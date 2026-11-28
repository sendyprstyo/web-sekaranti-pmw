import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "sekaranti_admin_token";
const SESSION_MAX_AGE_SECONDS = 21600; // 6 hours

export interface AppsScriptResponse {
  ok?: boolean;
  unauthorized?: boolean;
  message?: string;
  [key: string]: unknown;
}

/**
 * Forwards a JSON action payload to Google Apps Script via server-side GOOGLE_APPS_SCRIPT_URL.
 */
export async function callAppsScript(
  payload: Record<string, unknown>,
): Promise<{ status: number; data: AppsScriptResponse }> {
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  if (!appsScriptUrl) {
    return {
      status: 503,
      data: {
        ok: false,
        message:
          "GOOGLE_APPS_SCRIPT_URL belum disetel di server (.env.local / Environment Variables).",
      },
    };
  }

  try {
    const upstream = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      return {
        status: 502,
        data: {
          ok: false,
          message: "Gagal menghubungi server Google Sheets. Silakan coba lagi.",
        },
      };
    }

    let parsed: AppsScriptResponse;
    try {
      parsed = JSON.parse(text) as AppsScriptResponse;
    } catch {
      return {
        status: 502,
        data: {
          ok: false,
          message:
            "Respon Apps Script bukan JSON. Pastikan Apps Script sudah dideploy dengan Versi baru.",
        },
      };
    }

    if (parsed.unauthorized) {
      return { status: 401, data: parsed };
    }

    if (parsed.ok === false) {
      return { status: 400, data: parsed };
    }

    return { status: 200, data: parsed };
  } catch {
    return {
      status: 502,
      data: {
        ok: false,
        message: "Koneksi ke Google Apps Script timeout atau terputus.",
      },
    };
  }
}

/**
 * Attaches the HttpOnly admin session cookie to a NextResponse.
 */
export function setAdminSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears the admin session cookie on logout or unauthorized session.
 */
export function clearAdminSessionCookie(res: NextResponse): void {
  res.cookies.delete(ADMIN_COOKIE_NAME);
}

/**
 * Reads the current admin session token from HttpOnly cookies and executes a protected Apps Script action.
 */
export async function executeAuthorizedAdminAction(
  action: string,
  extraPayload: Record<string, unknown> = {},
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { ok: false, unauthorized: true, message: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  }

  const { status, data } = await callAppsScript({
    action,
    token,
    ...extraPayload,
  });

  const response = NextResponse.json(data, { status });
  if (status === 401 || data.unauthorized) {
    clearAdminSessionCookie(response);
  }
  return response;
}
