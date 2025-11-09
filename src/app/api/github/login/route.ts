import { NextResponse } from "next/server";
import { signState } from "@/lib/oauthState";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isHexLowercaseAddress(addr: string) {
  return /^0x[a-f0-9]{40}$/.test(addr);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const wallet = (url.searchParams.get("wallet") || "").toLowerCase().trim();
  const clientId = process.env.GITHUB_CLIENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const stateSecret = process.env.GITHUB_OAUTH_STATE_SECRET;

  if (!clientId || !siteUrl || !stateSecret) {
    return NextResponse.json(
      { error: "GitHub OAuth env vars not configured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!isHexLowercaseAddress(wallet)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const nonce = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  const exp = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes
  const state = signState({ wallet, nonce, exp }, stateSecret);

  const redirectUri = `${siteUrl}/api/github/callback`;
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl.toString(), 302);
  res.headers.set("Cache-Control", "no-store");
  // Store nonce to validate CSRF
  res.cookies.set("gh_oauth_nonce", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });
  return res;
}


