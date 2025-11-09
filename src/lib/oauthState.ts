import crypto from "node:crypto";

export function signState(payload: object, secret: string) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyState(state: string, secret: string): any | null {
  const [data, sig] = state.split(".");
  if (!data || !sig) return null;
  const expSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  if (sig !== expSig) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch {
    return null;
  }
}


