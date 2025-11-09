import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type OnboardingBody =
  | {
      walletAddress: string;
      role: "contributor";
    }
  | {
      walletAddress: string;
      role: "organization";
      organization: {
        name: string;
        yieldSource: "aave" | "morpho" | "kalani";
      };
    };

export async function POST(req: Request) {
  const body = (await req.json()) as OnboardingBody;
  const wallet = body.walletAddress.toLowerCase();
  const supabaseAdmin = getSupabaseAdmin();

  // Ensure user exists or create
  const { data: existing, error: findErr } = await supabaseAdmin
    .from("users")
    .select("id, role")
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  let userId = existing?.id as string | undefined;
  let role = existing?.role as "contributor" | "organization" | undefined;

  if (!existing) {
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("users")
      .insert({ wallet_address: wallet, role: body.role })
      .select("id, role")
      .single();
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }
    userId = inserted.id;
    role = inserted.role as "contributor" | "organization";
  } else if (existing && body.role !== existing.role) {
    // If role differs, update it
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("users")
      .update({ role: body.role })
      .eq("id", existing.id)
      .select("id, role")
      .single();
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }
    userId = updated.id;
    role = updated.role as "contributor" | "organization";
  }

  if (body.role === "organization" && "organization" in body) {
    const { name, yieldSource } = body.organization;
    // Upsert organization details by user_id
    const { error: upsertErr } = await supabaseAdmin
      .from("organization_details")
      .upsert(
        {
          user_id: userId,
          name,
          yield_source: yieldSource,
        },
        { onConflict: "user_id" }
      );
    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, role });
}


