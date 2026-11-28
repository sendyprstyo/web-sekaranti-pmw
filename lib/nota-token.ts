import crypto from "node:crypto";

function getNotaSecret(): string {
  return (
    process.env.NOTA_SECRET?.trim() ||
    process.env.GOOGLE_APPS_SCRIPT_URL?.trim() ||
    "sekaranti-local-nota-dev-secret"
  );
}

/**
 * Generates an unguessable URL-safe HMAC signature for an order code's online invoice link.
 */
export function signNotaCode(orderCode: string): string {
  const cleanCode = orderCode.trim();
  return crypto
    .createHmac("sha256", getNotaSecret())
    .update(`sekaranti-nota:${cleanCode}`, "utf8")
    .digest("base64url")
    .slice(0, 22);
}

/**
 * Verifies an online invoice signature using constant-time comparison.
 */
export function verifyNotaSignature(
  orderCode: string,
  signature: string | undefined | null,
): boolean {
  const cleanCode = orderCode.trim();
  const cleanSig = String(signature ?? "").trim();
  if (!cleanCode || !cleanSig) return false;

  const expected = signNotaCode(cleanCode);
  const a = Buffer.from(cleanSig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

/**
 * Builds the relative signed path for an order's online invoice page.
 */
export function buildSignedNotaPath(orderCode: string): string {
  const sig = signNotaCode(orderCode);
  return `/nota/${encodeURIComponent(orderCode.trim())}?s=${encodeURIComponent(sig)}`;
}
