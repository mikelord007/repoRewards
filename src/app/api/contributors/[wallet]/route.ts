import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet.toLowerCase().trim();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      contributor_profiles (
        github_id,
        login,
        name,
        avatar_url,
        html_url
      )
    `
    )
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  const profile = (data as any)?.contributor_profiles ?? null;
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}


