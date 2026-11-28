'use client';

import { AdminOrder, buildAdminWhatsappMessage } from "./admin-types";
import { formatRupiah } from "./open-po";

export const ADMIN_LOGO_URL = "/assets/logo-sekaranti.jpg";
export const ADMIN_QRIS_URL =
  "/assets/QRIS/WhatsApp%20Image%202026-11-28%20at%2010.18.24.jpeg";

let cachedLogoImg: HTMLImageElement | null = null;
let cachedQrisImg: HTMLImageElement | null = null;

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat gambar nota: ${src}`));
    img.src = src;
  });
}

async function getNotaImages(): Promise<{
  logo: HTMLImageElement;
  qris: HTMLImageElement;
}> {
  if (!cachedLogoImg) {
    cachedLogoImg = await loadImageElement(ADMIN_LOGO_URL);
  }
  if (!cachedQrisImg) {
    cachedQrisImg = await loadImageElement(ADMIN_QRIS_URL);
  }
  return { logo: cachedLogoImg, qris: cachedQrisImg };
}

function getOrderLineItems(
  order: AdminOrder,
): Array<{ name: string; qty: number }> {
  const list: Array<{ name: string; qty: number }> = [];
  if (order.qtyPuspaRaras > 0) {
    list.push({
      name: "Puspa Raras (Voal Ultrasoft 110×110 cm)",
      qty: order.qtyPuspaRaras,
    });
  }
  if (order.qtySekarWengi > 0) {
    list.push({
      name: "Sekar Wengi (Voal Ultrasoft 110×110 cm)",
      qty: order.qtySekarWengi,
    });
  }
  if (order.qtyTamanSariSekar > 0) {
    list.push({
      name: "Taman Sari Sekar (Voal Ultrasoft 110×110 cm)",
      qty: order.qtyTamanSariSekar,
    });
  }
  if (order.qtyTirtaSekar > 0) {
    list.push({
      name: "Tirta Sekar (Voal Ultrasoft 110×110 cm)",
      qty: order.qtyTirtaSekar,
    });
  }
  return list;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor?: string,
  strokeColor?: string,
  lineWidth = 2,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Renders a high-resolution PNG invoice image containing SEKARANTI logo, itemized totals, and wide scannable QRIS.
 */
export async function renderOrderNotaBlob(order: AdminOrder): Promise<Blob> {
  const { logo, qris } = await getNotaImages();
  const items = getOrderLineItems(order);
  const hasPromo =
    Boolean(order.promoCode) &&
    order.promoCode !== "-" &&
    order.discountAmount > 0;

  const width = 1200;
  const rowHeight = 58;
  const tableRowsCount = items.length + (hasPromo ? 1 : 0);
  const tableStartY = 478;
  const totalBoxY = tableStartY + 56 + tableRowsCount * rowHeight + 18;
  const qrisCardY = totalBoxY + 114;

  // Wide QRIS (860 px wide inside 1200 px canvas for crisp scanning)
  const qrisDrawWidth = 860;
  const qrisDrawHeight = Math.round(qrisDrawWidth * (1280 / 908)); // ~1212 px
  const qrisCardHeight = 148 + qrisDrawHeight + 92;
  const totalHeight = qrisCardY + qrisCardHeight + 52;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = totalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Browser tidak mendukung pembuatan gambar canvas.");
  }

  // Background
  ctx.fillStyle = "#FCF9F4";
  ctx.fillRect(0, 0, width, totalHeight);

  // Header Card
  drawRoundedRect(ctx, 64, 36, 1072, 178, 22, "#FFFFFF", "#D4AF37", 2);

  // Logo (1080:820 aspect ratio -> 174 x 132)
  ctx.drawImage(logo, 90, 59, 174, 132);

  ctx.fillStyle = "#311908";
  ctx.font = "bold 32px Georgia, serif";
  ctx.fillText("NOTA PEMESANAN OPEN PO", 290, 95);

  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 21px system-ui, sans-serif";
  ctx.fillText("OPEN PO BATCH 1 SEKARANTI-SMG", 290, 132);

  ctx.fillStyle = "#786C64";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("sekaranti.web.id  |  WhatsApp Admin: +62 857-2703-3141", 290, 168);

  // Order Code Badge (top right)
  drawRoundedRect(ctx, 838, 56, 272, 138, 16, "#FAF7F2", "#D4AF37", 2);
  ctx.fillStyle = "#8C7D73";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.fillText("KODE PRE-ORDER", 860, 86);

  ctx.fillStyle = "#311908";
  ctx.font = "bold 25px monospace";
  ctx.fillText(order.orderCode, 860, 120);

  ctx.fillStyle = "#50443E";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText(order.timestamp || "-", 860, 148);
  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.fillText(`Status: ${order.status}`, 860, 174);

  // Customer & Delivery Info Boxes
  drawRoundedRect(ctx, 64, 238, 520, 212, 20, "#FFFFFF", "#E2D6CE", 2);
  drawRoundedRect(ctx, 616, 238, 520, 212, 20, "#FFFFFF", "#E2D6CE", 2);

  ctx.fillStyle = "#8C7D73";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText("DATA PEMESAN", 92, 274);
  ctx.fillText("PENGAMBILAN & PEMBAYARAN", 644, 274);

  ctx.fillStyle = "#1C1C19";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillText(order.fullName || "-", 92, 312);

  ctx.fillStyle = "#50443E";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText(`No. WA: +${order.whatsapp || "-"}`, 92, 344);

  const affText =
    order.affiliationLabel +
    (order.departmentOrClass ? ` · ${order.departmentOrClass}` : "");
  const affLines = wrapTextLines(ctx, affText, 464).slice(0, 3);
  affLines.forEach((line, idx) => {
    ctx.fillText(line, 92, 376 + idx * 26);
  });

  ctx.fillStyle = "#1C1C19";
  ctx.font = "bold 21px system-ui, sans-serif";
  ctx.fillText(order.deliveryMethodLabel || "-", 644, 312);

  ctx.fillStyle = "#50443E";
  ctx.font = "18px system-ui, sans-serif";
  const locInfo = order.codSpot
    ? `Titik COD: ${order.codSpot}`
    : order.address
      ? `Alamat: ${order.address}`
      : "COD Kampus Polines (Koordinasi WA)";
  const locLines = wrapTextLines(ctx, locInfo, 464).slice(0, 2);
  locLines.forEach((line, idx) => {
    ctx.fillText(line, 644, 344 + idx * 26);
  });

  const payLines = wrapTextLines(
    ctx,
    `Bayar: ${order.paymentMethodLabel || "-"}`,
    464,
  ).slice(0, 2);
  payLines.forEach((line, idx) => {
    ctx.fillText(line, 644, 404 + idx * 24);
  });

  // Table Header
  drawRoundedRect(ctx, 64, tableStartY, 1072, 56, 14, "#311908");
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 17px system-ui, sans-serif";
  ctx.fillText("RINCIAN MOTIF HIJAB", 92, tableStartY + 35);

  ctx.textAlign = "right";
  ctx.fillText("QTY", 720, tableStartY + 35);
  ctx.fillText("HARGA", 905, tableStartY + 35);
  ctx.fillText("SUBTOTAL", 1108, tableStartY + 35);
  ctx.textAlign = "left";

  // Table Rows
  let ry = tableStartY + 56;
  items.forEach((it, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? "#FFFFFF" : "#FAF7F2";
    ctx.fillRect(64, ry, 1072, rowHeight);

    ctx.strokeStyle = "#EFE7E1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, ry + rowHeight);
    ctx.lineTo(1136, ry + rowHeight);
    ctx.stroke();

    ctx.fillStyle = "#1C1C19";
    ctx.font = "19px system-ui, sans-serif";
    ctx.fillText(it.name, 92, ry + 36);

    ctx.textAlign = "right";
    ctx.fillText(`${it.qty} pcs`, 720, ry + 36);
    ctx.fillText(formatRupiah(order.unitPrice), 905, ry + 36);
    ctx.font = "bold 19px system-ui, sans-serif";
    ctx.fillText(formatRupiah(it.qty * order.unitPrice), 1108, ry + 36);
    ctx.textAlign = "left";
    ry += rowHeight;
  });

  if (hasPromo) {
    ctx.fillStyle = "#ECFDF5";
    ctx.fillRect(64, ry, 1072, rowHeight);
    ctx.fillStyle = "#065F46";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`Diskon Promo (${order.promoCode})`, 92, ry + 36);
    ctx.textAlign = "right";
    ctx.fillText(`− ${formatRupiah(order.discountAmount)}`, 1108, ry + 36);
    ctx.textAlign = "left";
  }

  // Total Tagihan Highlight Box
  drawRoundedRect(ctx, 64, totalBoxY, 1072, 86, 18, "#F3EDE4", "#D4AF37", 2.5);
  ctx.fillStyle = "#311908";
  ctx.font = "bold 23px system-ui, sans-serif";
  ctx.fillText(`TOTAL TAGIHAN (${order.totalQty} pcs)`, 94, totalBoxY + 52);

  ctx.textAlign = "right";
  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 36px Georgia, serif";
  ctx.fillText(formatRupiah(order.totalAmount), 1108, totalBoxY + 54);
  ctx.textAlign = "left";

  // Centered Wide QRIS Payment Section
  drawRoundedRect(
    ctx,
    64,
    qrisCardY,
    1072,
    qrisCardHeight,
    24,
    "#FFFFFF",
    "#D4AF37",
    2.5,
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "#311908";
  ctx.font = "bold 25px Georgia, serif";
  ctx.fillText("SCAN QRIS UNTUK PEMBAYARAN", width / 2, qrisCardY + 54);

  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillText(
    `Total: ${formatRupiah(order.totalAmount)}  ·  Kode PO: ${order.orderCode}`,
    width / 2,
    qrisCardY + 90,
  );

  ctx.fillStyle = "#786C64";
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText(
    "Scan lewat m-Banking atau e-Wallet (GoPay, OVO, DANA, ShopeePay, BCA, dll)",
    width / 2,
    qrisCardY + 122,
  );

  const qrisX = Math.round((width - qrisDrawWidth) / 2);
  const qrisY = qrisCardY + 144;
  drawRoundedRect(
    ctx,
    qrisX - 16,
    qrisY - 12,
    qrisDrawWidth + 32,
    qrisDrawHeight + 24,
    18,
    "#FFFFFF",
    "#E2D6CE",
    2,
  );
  ctx.drawImage(qris, qrisX, qrisY, qrisDrawWidth, qrisDrawHeight);

  const footerY = qrisY + qrisDrawHeight + 52;
  ctx.fillStyle = "#50443E";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText(
    "Kirim bukti pembayaran ke WhatsApp Admin (+62 857-2703-3141) setelah transfer.",
    width / 2,
    footerY,
  );
  ctx.textAlign = "left";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal mengonversi Nota ke PNG."));
      },
      "image/png",
      1,
    );
  });
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Downloads the high-res PNG invoice image to the user's device.
 */
export async function downloadAdminOrderNotaImage(
  order: AdminOrder,
  preRenderedBlob?: Blob,
): Promise<void> {
  const blob = preRenderedBlob ?? (await renderOrderNotaBlob(order));
  triggerBlobDownload(blob, `Nota-SEKARANTI-${order.orderCode}.png`);
}

/**
 * Attempts to copy the PNG invoice image into the OS clipboard (useful for Ctrl+V in WhatsApp Web).
 */
export async function tryCopyNotaImageToClipboard(
  blob: Blob,
): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof ClipboardItem !== "undefined"
    ) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      return true;
    }
  } catch {
    // Clipboard image write unsupported or denied
  }
  return false;
}

/**
 * Uses the native mobile Web Share API to share the PNG invoice directly to WhatsApp or other apps.
 * Falls back to downloading + copying if file sharing is unsupported.
 */
export async function shareAdminOrderNotaImage(order: AdminOrder): Promise<{
  mode: "shared" | "fallback";
  copied: boolean;
}> {
  const blob = await renderOrderNotaBlob(order);
  const filename = `Nota-SEKARANTI-${order.orderCode}.png`;
  const file = new File([blob], filename, { type: "image/png" });
  const text = buildAdminWhatsappMessage(order);

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
      title: `Nota SEKARANTI ${order.orderCode}`,
      text,
    });
    return { mode: "shared", copied: false };
  }

  const copied = await tryCopyNotaImageToClipboard(blob);
  triggerBlobDownload(blob, filename);
  return { mode: "fallback", copied };
}
