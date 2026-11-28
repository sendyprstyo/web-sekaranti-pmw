'use client';

import { jsPDF } from "jspdf";
import { AdminOrder } from "./admin-types";
import { formatRupiah } from "./open-po";

export const ADMIN_LOGO_URL = "/assets/logo-sekaranti.jpg";
export const ADMIN_QRIS_URL =
  "/assets/QRIS/WhatsApp%20Image%202026-11-28%20at%2010.18.24.jpeg";

let cachedLogoDataUri: string | null = null;
let cachedQrisDataUri: string | null = null;

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal memuat gambar nota: ${url}`);
  }
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Gagal membaca data gambar."));
      }
    };
    reader.onerror = () => reject(new Error("Gagal mengonversi gambar."));
    reader.readAsDataURL(blob);
  });
}

async function getInvoiceImages(): Promise<{ logo: string; qris: string }> {
  if (!cachedLogoDataUri) {
    cachedLogoDataUri = await fetchImageAsDataUrl(ADMIN_LOGO_URL);
  }
  if (!cachedQrisDataUri) {
    cachedQrisDataUri = await fetchImageAsDataUrl(ADMIN_QRIS_URL);
  }
  return { logo: cachedLogoDataUri, qris: cachedQrisDataUri };
}

function getOrderLineItems(
  order: AdminOrder,
): Array<{ name: string; qty: number }> {
  const list: Array<{ name: string; qty: number }> = [];
  if (order.qtyPuspaRaras > 0) {
    list.push({
      name: "Puspa Raras (Voal Ultrasoft 110x110 cm)",
      qty: order.qtyPuspaRaras,
    });
  }
  if (order.qtySekarWengi > 0) {
    list.push({
      name: "Sekar Wengi (Voal Ultrasoft 110x110 cm)",
      qty: order.qtySekarWengi,
    });
  }
  if (order.qtyTamanSariSekar > 0) {
    list.push({
      name: "Taman Sari Sekar (Voal Ultrasoft 110x110 cm)",
      qty: order.qtyTamanSariSekar,
    });
  }
  if (order.qtyTirtaSekar > 0) {
    list.push({
      name: "Tirta Sekar (Voal Ultrasoft 110x110 cm)",
      qty: order.qtyTirtaSekar,
    });
  }
  return list;
}

/**
 * Generates and downloads an A4 PDF invoice containing SEKARANTI logo, order totals, and QRIS.
 */
export async function downloadAdminOrderPdf(order: AdminOrder): Promise<void> {
  const { logo, qris } = await getInvoiceImages();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Header with SEKARANTI Logo (1080:820 ratio -> 29 x 22 mm)
  doc.addImage(logo, "JPEG", 15, 11, 29, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(49, 25, 8);
  doc.text("NOTA PEMESANAN OPEN PO", 48, 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(107, 29, 47);
  doc.text("OPEN PO BATCH 1 SEKARANTI-SMG", 48, 22.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(120, 108, 100);
  doc.text("sekaranti.web.id  |  WhatsApp Admin: +62 857-2703-3141", 48, 28);

  // Top-right Order Code Box
  doc.setFillColor(250, 247, 242);
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(142, 11, 53, 21, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 125, 115);
  doc.text("KODE PRE-ORDER", 146, 16);

  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.setTextColor(49, 25, 8);
  doc.text(order.orderCode, 146, 21.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 68, 62);
  doc.text(order.timestamp || "", 146, 26.5);
  doc.text(`Status: ${order.status}`, 146, 30.2);

  // Gold divider
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(15, 37, 195, 37);

  // Customer & Delivery boxes
  doc.setFillColor(250, 247, 242);
  doc.setDrawColor(226, 214, 206);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 42, 87, 36, 2.5, 2.5, "FD");
  doc.roundedRect(108, 42, 87, 36, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(140, 125, 115);
  doc.text("DATA PEMESAN", 19, 48);
  doc.text("PENGAMBILAN & PEMBAYARAN", 112, 48);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 28, 25);
  doc.text(order.fullName || "-", 19, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 68, 62);
  doc.text(`No. WA: +${order.whatsapp || "-"}`, 19, 59.5);
  const affText =
    order.affiliationLabel +
    (order.departmentOrClass ? ` · ${order.departmentOrClass}` : "");
  const affLines = doc.splitTextToSize(affText, 79) as string[];
  doc.text(affLines.slice(0, 3), 19, 64.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(28, 28, 25);
  doc.text(order.deliveryMethodLabel || "-", 112, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 68, 62);
  const locInfo = order.codSpot
    ? `Titik COD: ${order.codSpot}`
    : order.address
      ? `Alamat: ${order.address}`
      : "COD Kampus Polines (Koordinasi WA)";
  const locLines = doc.splitTextToSize(locInfo, 79) as string[];
  doc.text(locLines.slice(0, 2), 112, 59.5);
  const payLines = doc.splitTextToSize(
    `Bayar: ${order.paymentMethodLabel || "-"}`,
    79,
  ) as string[];
  doc.text(payLines.slice(0, 2), 112, 69.5);

  // Order Table
  let y = 86;
  doc.setFillColor(49, 25, 8);
  doc.rect(15, y, 180, 8.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("RINCIAN MOTIF HIJAB", 19, y + 5.7);
  doc.text("QTY", 125, y + 5.7, { align: "right" });
  doc.text("HARGA", 156, y + 5.7, { align: "right" });
  doc.text("SUBTOTAL", 191, y + 5.7, { align: "right" });

  y += 8.5;
  const items = getOrderLineItems(order);
  items.forEach((it, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 247, 242);
      doc.rect(15, y, 180, 8.5, "F");
    }
    doc.setDrawColor(235, 227, 221);
    doc.line(15, y + 8.5, 195, y + 8.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(28, 28, 25);
    doc.text(it.name, 19, y + 5.7);
    doc.text(`${it.qty} pcs`, 125, y + 5.7, { align: "right" });
    doc.text(formatRupiah(order.unitPrice), 156, y + 5.7, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(formatRupiah(it.qty * order.unitPrice), 191, y + 5.7, {
      align: "right",
    });
    y += 8.5;
  });

  if (
    order.promoCode &&
    order.promoCode !== "-" &&
    order.discountAmount > 0
  ) {
    doc.setFillColor(236, 253, 245);
    doc.rect(15, y, 180, 8.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text(`Diskon Promo (${order.promoCode})`, 19, y + 5.7);
    doc.text(`- ${formatRupiah(order.discountAmount)}`, 191, y + 5.7, {
      align: "right",
    });
    y += 8.5;
  }

  // Highlight Total Tagihan
  y += 3;
  doc.setFillColor(243, 237, 228);
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(15, y, 180, 14, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(49, 25, 8);
  doc.text(`TOTAL TAGIHAN (${order.totalQty} pcs)`, 19, y + 9);

  doc.setFontSize(14);
  doc.setTextColor(107, 29, 47);
  doc.text(formatRupiah(order.totalAmount), 191, y + 9.2, { align: "right" });

  y += 22;

  // Payment instructions + QRIS frame
  doc.setFillColor(250, 247, 242);
  doc.setDrawColor(226, 214, 206);
  doc.roundedRect(15, y, 102, 98, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(49, 25, 8);
  doc.text("INSTRUKSI PEMBAYARAN", 20, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 68, 62);
  const instr = [
    "1. Pastikan nominal pembayaran sesuai Total Tagihan:",
    `   ${formatRupiah(order.totalAmount)} (${order.totalQty} pcs).`,
    "2. Scan QRIS di samping menggunakan aplikasi m-Banking",
    "   atau e-Wallet (GoPay, OVO, DANA, ShopeePay, BCA, dll).",
    "3. Simpan bukti transfer dan kirimkan ke WhatsApp Admin",
    "   SEKARANTI (+62 857-2703-3141) dengan menyertakan",
    `   Kode PO: ${order.orderCode}.`,
    "4. Untuk metode COD, pembayaran dapat dilakukan",
    "   langsung saat serah terima barang (Cash / QRIS).",
  ];
  let iy = y + 16;
  instr.forEach((line) => {
    doc.text(line, 20, iy);
    iy += 5.3;
  });

  doc.setDrawColor(212, 175, 55);
  doc.line(20, y + 72, 112, y + 72);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(107, 29, 47);
  doc.text("Terima kasih telah mempercayakan pilihan hijabmu", 20, y + 79);
  doc.text("pada koleksi SEKARANTI.", 20, y + 84);

  // QRIS Frame (exact 908:1280 ratio -> 68 x 95.8 mm)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(123, y, 72, 98, 2.5, 2.5, "FD");
  doc.addImage(qris, "JPEG", 125, y + 1.2, 68, 95.8);

  doc.save(`Nota-SEKARANTI-${order.orderCode}.pdf`);
}
