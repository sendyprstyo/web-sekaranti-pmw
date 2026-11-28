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
 * Builds the formatted WhatsApp notification message for an order.
 */
export function buildAdminWhatsappMessage(order: AdminOrder): string {
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
    "Berikut kami lampirkan gambar Nota beserta QRIS pembayarannya ya kak. Mohon dicek, terima kasih!",
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/**
 * Builds a WhatsApp link targeted directly to the customer's phone number with order details.
 */
export function buildAdminCustomerWhatsappUrl(order: AdminOrder): string {
  return `https://wa.me/${encodeURIComponent(order.whatsapp)}?text=${encodeURIComponent(
    buildAdminWhatsappMessage(order),
  )}`;
}
