import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet.toLowerCase();
  const supabaseAdmin = getSupabaseAdmin();
  let { data, error } = await supabaseAdmin
    .from("users")
    .select("id,role")
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exists: !!data, role: data?.role });
}


