import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet.toLowerCase().trim();
  const supabaseAdmin = getSupabaseAdmin();

  // Find org user
  const { data: userRow, error: userErr } = await supabaseAdmin
    .from("users")
    .select("id, role")
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }
  if (!userRow || userRow.role !== "organization") {
    // Not an org or not found — return empty list gracefully
    return NextResponse.json({ projects: [] }, { status: 200 });
  }

  // Fetch projects for this organization.
  // NOTE: This assumes a `projects` table exists. Adjust column names as needed.
  const { data: projects, error: projErr } = await supabaseAdmin
    .from("projects")
    .select("id, name, repo, contributors, goal, total_funds_usd, yield_distributed_usd, created_at")
    .eq("user_id", userRow.id)
    .order("created_at", { ascending: false });

  if (projErr) {
    // Return empty but include error for debugging in response
    return NextResponse.json({ projects: [], error: projErr.message }, { status: 200 });
  }

  // Normalize to UI shape expected by the dashboard
  const normalized =
    (projects ?? []).map((p: any) => ({
      id: String(p.id),
      name: p.name ?? "Untitled",
      amount: typeof p.total_funds_usd === "number" ? p.total_funds_usd : Number(p.total_funds_usd) || 0,
      goal: typeof p.goal === "string" ? p.goal : "",
      yieldDistributed: `$${(
        typeof p.yield_distributed_usd === "number"
          ? p.yield_distributed_usd
          : Number(p.yield_distributed_usd) || 0
      ).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      contributors: typeof p.contributors === "number" ? p.contributors : Number(p.contributors) || 0,
      repo: p.repo ?? undefined,
    })) ?? [];

  return NextResponse.json({ projects: normalized }, { headers: { "Cache-Control": "no-store" } });
}


