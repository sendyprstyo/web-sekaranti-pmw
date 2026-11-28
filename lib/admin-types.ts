import { formatRupiah } from "./open-po";

export const ADMIN_ORDER_STATUSES = [
  "Konfirmasi",
  "Proses",
  "Selesai",
  "Dibatalkan",
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface AdminOrder {
  rowNumber: number;
  timestamp: string;
  orderCode: string;
  batch: string;
  fullName: string;
  whatsapp: string;
  affiliationLabel: string;
  departmentOrClass: string;
  itemsSummary: string;
  qtyPuspaRaras: number;
  qtySekarWengi: number;
  qtyTamanSariSekar: number;
  qtyTirtaSekar: number;
  qtyAmbarwati?: number;
  qtyBumiAsri?: number;
  qtyKawungsari?: number;
  qtyKembangkinonce?: number;
  qtyPuspitasari?: number;
  qtySekarArum?: number;
  totalQty: number;
  promoCode: string;
  unitPrice: number;
  originalTotal: number;
  discountAmount: number;
  totalAmount: number;
  deliveryMethodLabel: string;
  codSpot: string;
  address: string;
  paymentMethodLabel: string;
  status: AdminOrderStatus;
  notaPath?: string;
}

export interface AdminStats {
  totalOrders: number;
  activeOrders: number;
  pendingOrders: number;
  totalQty: number;
  totalRevenue: number;
  promoUsedCount: number;
  codPolinesCount: number;
}

export interface AdminOwnerRecord {
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export interface AdminDashboardPayload {
  user: AdminUser;
  orders: AdminOrder[];
  stats: AdminStats;
  owners: AdminOwnerRecord[];
  statuses: AdminOrderStatus[];
  spreadsheetUrl: string;
}

export const STATUS_BADGE_CLASSES: Record<AdminOrderStatus, string> = {
  Konfirmasi: "bg-amber-50 border-amber-300 text-amber-900",
  Proses: "bg-sky-50 border-sky-300 text-sky-900",
  Selesai: "bg-emerald-50 border-emerald-300 text-emerald-900",
  Dibatalkan: "bg-rose-50 border-rose-300 text-rose-900",
};

/**
 * Resolves the full shareable online invoice URL for an order.
 */
export function resolveOrderNotaUrl(
  order: AdminOrder,
  origin?: string,
): string | null {
  if (!order.notaPath) return null;
  const base =
    origin?.trim().replace(/\/$/, "") || "https://www.sekaranti.web.id";
  return `${base}${order.notaPath}`;
}

/**
 * Builds the formatted WhatsApp notification message for an order, including the auto-expiring Nota URL.
 */
export function buildAdminWhatsappMessage(
  order: AdminOrder,
  origin?: string,
): string {
  const notaUrl = resolveOrderNotaUrl(order, origin);
  const lines = [
    `Halo kak *${order.fullName}*, kami dari Admin *SEKARANTI* ingin mengonfirmasi pesanan Open PO Batch 1:`,
    "",
    `*Kode PO:* ${order.orderCode}`,
    `*Pesanan:* ${order.itemsSummary}`,
    order.promoCode && order.promoCode !== "-"
      ? `*Kode Diskon:* ${order.promoCode} (Hemat ${formatRupiah(order.discountAmount)})`
      : null,
    `*Total Tagihan:* ${formatRupiah(order.totalAmount)}`,
    `*Pengambilan:* ${order.deliveryMethodLabel}${order.codSpot ? ` (${order.codSpot})` : ""}${order.address ? ` - ${order.address}` : ""}`,
    `*Pembayaran:* ${order.paymentMethodLabel}`,
    "",
    notaUrl ? "*Link Nota & QRIS Pembayaran:*" : null,
    notaUrl ? notaUrl : null,
    notaUrl
      ? "_(Link nota otomatis nonaktif setelah pesanan berstatus Selesai)_"
      : "Berikut kami lampirkan gambar Nota beserta QRIS pembayarannya ya kak. Mohon dicek, terima kasih!",
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/**
 * Builds a WhatsApp link targeted directly to the customer's phone number with order details and Nota link.
 */
export function buildAdminCustomerWhatsappUrl(
  order: AdminOrder,
  origin?: string,
): string {
  return `https://wa.me/${encodeURIComponent(order.whatsapp)}?text=${encodeURIComponent(
    buildAdminWhatsappMessage(order, origin),
  )}`;
}

export interface ParsedOrderLineItem {
  name: string;
  qty: number;
  subtotal: number;
}

const ORDERED_MOTIF_FIELDS: Array<{
  key: keyof AdminOrder;
  name: string;
}> = [
  { key: "qtyPuspaRaras", name: "Puspa Raras" },
  { key: "qtySekarWengi", name: "Sekar Wengi" },
  { key: "qtyTamanSariSekar", name: "Taman Sari Sekar" },
  { key: "qtyTirtaSekar", name: "Tirta Sekar" },
  { key: "qtyAmbarwati", name: "Ambarwati" },
  { key: "qtyBumiAsri", name: "Bumi Asri" },
  { key: "qtyKawungsari", name: "Kawungsari" },
  { key: "qtyKembangkinonce", name: "Kembangkinonce" },
  { key: "qtyPuspitasari", name: "Puspitasari" },
  { key: "qtySekarArum", name: "Sekar Arum" },
];

/**
 * Extracts per-motif line items from structured columns and/or itemsSummary so all 10 motifs render consistently.
 */
export function parseOrderLineItems(order: AdminOrder): ParsedOrderLineItem[] {
  const unitPrice = Number(order.unitPrice || 0);
  const summaryItems: ParsedOrderLineItem[] = [];

  if (order.itemsSummary) {
    const segments = order.itemsSummary
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const seg of segments) {
      const match = seg.match(/^(.+?)\s*\((\d+)\s*pcs\)$/i);
      if (match) {
        const name = match[1].trim();
        const qty = Number(match[2] || 0);
        if (name && qty > 0) {
          summaryItems.push({
            name,
            qty,
            subtotal: qty * unitPrice,
          });
        }
      }
    }
  }

  const structuredItems: ParsedOrderLineItem[] = [];
  for (const field of ORDERED_MOTIF_FIELDS) {
    const qty = Number(order[field.key] ?? 0);
    if (qty > 0) {
      structuredItems.push({
        name: field.name,
        qty,
        subtotal: qty * unitPrice,
      });
    }
  }

  const summaryQty = summaryItems.reduce((acc, item) => acc + item.qty, 0);
  const structuredQty = structuredItems.reduce((acc, item) => acc + item.qty, 0);

  if (summaryItems.length > 0 && (structuredQty === 0 || summaryQty > structuredQty)) {
    return summaryItems;
  }

  if (structuredItems.length > 0) {
    return structuredItems;
  }

  if (summaryItems.length > 0) {
    return summaryItems;
  }

  return [
    {
      name: order.itemsSummary || "Hijab Sekaranti",
      qty: order.totalQty || 1,
      subtotal: Number(order.totalAmount || 0),
    },
  ];
}
