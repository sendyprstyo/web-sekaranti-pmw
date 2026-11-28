import { NextRequest, NextResponse } from "next/server";
import { executeAuthorizedAdminAction } from "../../../../lib/admin-api";

/**
 * Handles owner password updates and adding co-owner accounts for authenticated admins.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format payload tidak valid." },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;
  const mode = String(payload?.mode ?? "");

  if (mode === "changePassword") {
    return executeAuthorizedAdminAction("adminChangePassword", {
      currentPassword: String(payload.currentPassword ?? ""),
      newPassword: String(payload.newPassword ?? ""),
    });
  }

  if (mode === "addOwner") {
    return executeAuthorizedAdminAction("adminAddOwner", {
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      password: String(payload.password ?? ""),
    });
  }

  return NextResponse.json(
    { ok: false, message: "Aksi keamanan tidak dikenal." },
    { status: 400 },
  );
}
