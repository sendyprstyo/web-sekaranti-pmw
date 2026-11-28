import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  callAppsScript,
  clearAdminSessionCookie,
} from "../../../../lib/admin-api";

/**
 * Invalidates the active Apps Script session token and clears the HttpOnly session cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (token) {
    await callAppsScript({ action: "adminLogout", token });
  }

  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
