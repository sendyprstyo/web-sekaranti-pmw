import { NextRequest, NextResponse } from "next/server";
import {
  formatWibTimestamp,
  generatePoOrderCode,
  OPEN_PO_BATCH_LABEL,
  OpenPoReceipt,
  validateOpenPoInput,
} from "../../../lib/open-po";

/**
 * Handles Open PO Batch 1 submissions and forwards validated rows to Google Apps Script when configured.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Format data pesanan tidak valid." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Payload pesanan kosong." },
      { status: 400 },
    );
  }

  const validation = validateOpenPoInput(body as Record<string, unknown>);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        field: validation.field,
        error: validation.errorId,
        errorEn: validation.errorEn,
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const orderCode = generatePoOrderCode(now);
  const createdAtWib = formatWibTimestamp(now);
  const { data } = validation;

  const sheetRow = {
    timestamp: createdAtWib,
    orderCode,
    batch: OPEN_PO_BATCH_LABEL,
    fullName: data.fullName,
    whatsapp: data.whatsapp,
    affiliationLabel: data.affiliationLabel,
    departmentOrClass: data.departmentOrClass,
    itemsSummary: data.itemsSummary,
    qtyPuspaRaras: data.qtyBySlug["puspa-raras"] ?? 0,
    qtySekarWengi: data.qtyBySlug["sekar-wengi"] ?? 0,
    qtyTamanSariSekar: data.qtyBySlug["taman-sari-sekar"] ?? 0,
    qtyTirtaSekar: data.qtyBySlug["tirta-sekar"] ?? 0,
    totalQty: data.totalQty,
    promoCode: data.promoCode || "-",
    unitPrice: data.unitPrice,
    originalTotal: data.originalTotal,
    discountAmount: data.discountAmount,
    totalAmount: data.totalAmount,
    deliveryMethodLabel: data.deliveryMethodLabel,
    codSpot: data.codSpot,
    address: data.address,
    paymentMethodLabel: data.paymentMethodLabel,
    status: "Konfirmasi",
  };

  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  let savedToSheet = false;

  if (appsScriptUrl) {
    try {
      const upstream = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sheetRow),
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });

      const responseText = await upstream.text();
      if (!upstream.ok) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Gagal menyimpan pesanan ke Google Sheets. Silakan coba lagi atau konfirmasi via WhatsApp.",
          },
          { status: 502 },
        );
      }

      let parsed: { status?: string; ok?: boolean; message?: string } | null =
        null;
      try {
        parsed = JSON.parse(responseText) as {
          status?: string;
          ok?: boolean;
          message?: string;
        };
      } catch {
        parsed = null;
      }

      if (
        !parsed ||
        parsed.status === "error" ||
        parsed.ok === false ||
        (parsed.ok !== true && parsed.status !== "success")
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              parsed?.message ||
              "Respon Google Apps Script tidak valid. Pastikan akses Web App diset ke Anyone (Siapa saja).",
          },
          { status: 502 },
        );
      }

      savedToSheet = true;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Koneksi ke Google Sheets terputus atau timeout. Silakan coba kirim ulang.",
        },
        { status: 502 },
      );
    }
  }

  const receipt: OpenPoReceipt = {
    orderCode,
    batch: OPEN_PO_BATCH_LABEL,
    createdAtWib,
    savedToSheet,
    fullName: data.fullName,
    whatsapp: data.whatsapp,
    affiliation: data.affiliation,
    affiliationLabel: data.affiliationLabel,
    departmentOrClass: data.departmentOrClass,
    items: data.items,
    itemsSummary: data.itemsSummary,
    totalQty: data.totalQty,
    promoCode: data.promoCode,
    unitPrice: data.unitPrice,
    originalTotal: data.originalTotal,
    discountAmount: data.discountAmount,
    totalAmount: data.totalAmount,
    deliveryMethod: data.deliveryMethod,
    deliveryMethodLabel: data.deliveryMethodLabel,
    codSpot: data.codSpot,
    address: data.address,
    paymentMethod: data.paymentMethod,
    paymentMethodLabel: data.paymentMethodLabel,
  };

  return NextResponse.json({
    ok: true,
    savedToSheet,
    receipt,
  });
}
