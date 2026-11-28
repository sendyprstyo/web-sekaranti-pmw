import { NextRequest, NextResponse } from "next/server";
import { executeAuthorizedAdminAction } from "../../../../lib/admin-api";
import { ADMIN_ORDER_STATUSES } from "../../../../lib/admin-types";

/**
 * Fetches dashboard stats, orders, and owner records for the authenticated admin.
 */
export async function GET() {
  return executeAuthorizedAdminAction("adminDashboard");
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
