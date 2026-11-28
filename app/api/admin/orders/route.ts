import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  callAppsScript,
  clearAdminSessionCookie,
  executeAuthorizedAdminAction,
} from "../../../../lib/admin-api";
import { ADMIN_ORDER_STATUSES } from "../../../../lib/admin-types";
import { buildSignedNotaPath } from "../../../../lib/nota-token";

/**
 * Fetches dashboard stats, orders (with signed online Nota paths), and owner records for the authenticated admin.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { ok: false, unauthorized: true, message: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  }

  const { status, data } = await callAppsScript({
    action: "adminDashboard",
    token,
  });

  if (status === 200 && data.ok && Array.isArray(data.orders)) {
    data.orders = data.orders.map((order) => {
      const rec = order as Record<string, unknown>;
      const code = String(rec.orderCode ?? "");
      return {
        ...rec,
        ...(code ? { notaPath: buildSignedNotaPath(code) } : {}),
      };
    });
  }

  const response = NextResponse.json(data, { status });
  if (status === 401 || data.unauthorized) {
    clearAdminSessionCookie(response);
  }
  return response;
}

/**
 * Updates the status of an existing Open PO order in Google Sheets.
 */
export async function PATCH(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format payload tidak valid." },
      { status: 400 },
    );
  }

  const orderCode = String(
    (body as Record<string, unknown>)?.orderCode ?? "",
  ).trim();
  const newStatus = String(
    (body as Record<string, unknown>)?.newStatus ?? "",
  ).trim();

  if (
    !orderCode ||
    !ADMIN_ORDER_STATUSES.includes(
      newStatus as (typeof ADMIN_ORDER_STATUSES)[number],
    )
  ) {
    return NextResponse.json(
      { ok: false, message: "Kode PO atau status pesanan tidak valid." },
      { status: 400 },
    );
  }

  return executeAuthorizedAdminAction("adminUpdateStatus", {
    orderCode,
    newStatus,
  });
}

/**
 * Deletes an Open PO order row from Google Sheets by order code.
 */
export async function DELETE(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format payload tidak valid." },
      { status: 400 },
    );
  }

  const orderCode = String(
    (body as Record<string, unknown>)?.orderCode ?? "",
  ).trim();

  if (!orderCode) {
    return NextResponse.json(
      { ok: false, message: "Kode PO wajib disertakan." },
      { status: 400 },
    );
  }

  return executeAuthorizedAdminAction("adminDeleteOrder", { orderCode });
}
