import { NextRequest, NextResponse } from "next/server";
import { callAppsScript, setAdminSessionCookie } from "../../../../lib/admin-api";

/**
 * Authenticates an admin/owner via Apps Script and stores the session token in an HttpOnly cookie.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format login tidak valid." },
      { status: 400 },
    );
  }

  const email = String(
    (body as Record<string, unknown>)?.email ?? "",
  ).trim();
  const password = String((body as Record<string, unknown>)?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email dan password wajib diisi." },
      { status: 400 },
    );
  }

  const { status, data } = await callAppsScript({
    action: "adminLogin",
    email,
    password,
  });

  if (status !== 200 || !data.ok || typeof data.token !== "string") {
    return NextResponse.json(
      { ok: false, message: data.message || "Email atau password salah." },
      { status: status === 200 ? 401 : status },
    );
  }

  const res = NextResponse.json({
    ok: true,
    user: data.user,
  });
  setAdminSessionCookie(res, data.token);
  return res;
}
