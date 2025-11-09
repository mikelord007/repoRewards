// src/app/api/users/[wallet]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet.toLowerCase().trim();
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, role")  // include id to ensure single-row shape
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(
    { exists: !!data, role: data?.role },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}