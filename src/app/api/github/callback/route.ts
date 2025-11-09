import { NextResponse } from "next/server";
import { verifyState } from "@/lib/oauthState";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
  const stateSecret = process.env.GITHUB_OAUTH_STATE_SECRET!;

  if (!code || !state || !siteUrl || !clientId || !clientSecret || !stateSecret) {
    return NextResponse.json(
      { error: "Missing OAuth parameters or env" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Validate state and nonce
  const parsed = verifyState(state, stateSecret);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const { wallet, nonce, exp } = parsed as { wallet: string; nonce: string; exp: number };
  const now = Math.floor(Date.now() / 1000);
  if (!wallet || !nonce || !exp || now > exp) {
    return NextResponse.json({ error: "Expired state" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Verify nonce cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const nonceCookie = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("gh_oauth_nonce="));
  if (!nonceCookie || decodeURIComponent(nonceCookie.split("=")[1]) !== nonce) {
    return NextResponse.json({ error: "Invalid nonce" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Exchange code for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${siteUrl}/api/github/callback`,
    }),
    cache: "no-store",
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string | undefined;
  if (!accessToken) {
    return NextResponse.json({ error: "Token exchange failed" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Fetch GitHub profile
  const profileRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  const gh = await profileRes.json();
  if (!gh?.id || !gh?.login) {
    return NextResponse.json({ error: "Failed to fetch GitHub profile" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const supabase = getSupabaseAdmin();
  const lower = (wallet as string).toLowerCase();

  // Ensure user exists as contributor
  const { data: existing } = await supabase
    .from("users")
    .select("id, role")
    .eq("wallet_address", lower)
    .maybeSingle();

  let userId = existing?.id as string | undefined;
  if (!existing) {
    const ins = await supabase
      .from("users")
      .insert({ wallet_address: lower, role: "contributor" })
      .select("id")
      .single();
    userId = ins.data?.id as string;
  } else if (existing.role !== "contributor") {
    const upd = await supabase
      .from("users")
      .update({ role: "contributor" })
      .eq("id", existing.id)
      .select("id")
      .single();
    userId = upd.data?.id as string;
  }

  if (!userId) {
    return NextResponse.json({ error: "Failed to ensure user" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  // Upsert contributor profile
  const up = await supabase.from("contributor_profiles").upsert(
    {
      user_id: userId,
      github_id: gh.id,
      login: gh.login,
      name: gh.name ?? null,
      avatar_url: gh.avatar_url ?? null,
      html_url: gh.html_url ?? null,
    },
    { onConflict: "user_id" }
  );
  if (up.error) {
    return NextResponse.json({ error: up.error.message }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  // Redirect back to onboarding
  const res = NextResponse.redirect(`${siteUrl}/contributor/onboarding?github=connected`, 302);
  res.headers.set("Cache-Control", "no-store");
  // Clear nonce
  res.cookies.set("gh_oauth_nonce", "", { path: "/", maxAge: 0 });
  return res;
}


