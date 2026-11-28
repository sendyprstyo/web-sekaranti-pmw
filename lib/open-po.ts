import { getCollections, PRODUCT_PRICE } from "./collections";

export const OPEN_PO_BATCH_LABEL = "OPEN PO BATCH 1 SEKARANTI-SMG";

export const OPEN_PO_CLOSING_AT_ISO = "2026-12-01T23:59:59+07:00";
export const OPEN_PO_CLOSING_DATE_LABEL_ID = "Selasa, 1 Desember 2026";
export const OPEN_PO_CLOSING_DATE_LABEL_EN = "Tuesday, December 1, 2026";

export const OPEN_PO_PROMO_CODE = "BERSAMASEKARANTI";
export const OPEN_PO_PROMO_UNIT_PRICE = 50_000;

export interface OpenPoCountdown {
  expired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Computes remaining time until Batch 1 closes (1 December 2026, 23:59 WIB).
 */
export function getOpenPoCountdown(nowMs = Date.now()): OpenPoCountdown {
  const deadlineMs = new Date(OPEN_PO_CLOSING_AT_ISO).getTime();
  const diff = deadlineMs - nowMs;
  if (!Number.isFinite(diff) || diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    expired: false,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

export type CustomerAffiliation = "polines" | "general";

export type DeliveryMethod =
  | "cod-polines"
  | "cod-semarang"
  | "delivery-semarang";

export type PaymentMethod = "cod-cash" | "transfer-qris";

export const DELIVERY_METHOD_LABELS: Record<
  DeliveryMethod,
  { id: string; en: string }
> = {
  "cod-polines": {
    id: "COD Kampus Polines (Tembalang)",
    en: "COD at Polines Campus (Tembalang)",
  },
  "cod-semarang": {
    id: "COD Area Tembalang / Kota Semarang",
    en: "COD Tembalang / Semarang City Area",
  },
  "delivery-semarang": {
    id: "Antar Alamat Kota Semarang",
    en: "Semarang City Address Delivery",
  },
};

export const PAYMENT_METHOD_LABELS: Record<
  PaymentMethod,
  { id: string; en: string }
> = {
  "cod-cash": {
    id: "Bayar saat COD (Cash / QRIS di tempat)",
    en: "Pay on COD (Cash / QRIS on meetup)",
  },
  "transfer-qris": {
    id: "Transfer Bank / QRIS (Konfirmasi Admin WA)",
    en: "Bank Transfer / QRIS (Confirm via WA)",
  },
};

export interface OpenPoOrderItem {
  slug: string;
  name: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OpenPoReceipt {
  orderCode: string;
  batch: string;
  createdAtWib: string;
  savedToSheet: boolean;
  fullName: string;
  whatsapp: string;
  affiliation: CustomerAffiliation;
  affiliationLabel: string;
  departmentOrClass: string;
  items: OpenPoOrderItem[];
  itemsSummary: string;
  totalQty: number;
  promoCode: string;
  unitPrice: number;
  originalTotal: number;
  discountAmount: number;
  totalAmount: number;
  deliveryMethod: DeliveryMethod;
  deliveryMethodLabel: string;
  codSpot: string;
  address: string;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
}

export interface OpenPoValidationSuccess {
  ok: true;
  data: {
    fullName: string;
    whatsapp: string;
    affiliation: CustomerAffiliation;
    affiliationLabel: string;
    departmentOrClass: string;
    items: OpenPoOrderItem[];
    itemsSummary: string;
    qtyBySlug: Record<string, number>;
    totalQty: number;
    promoCode: string;
    unitPrice: number;
    originalTotal: number;
    discountAmount: number;
    totalAmount: number;
    deliveryMethod: DeliveryMethod;
    deliveryMethodLabel: string;
    codSpot: string;
    address: string;
    paymentMethod: PaymentMethod;
    paymentMethodLabel: string;
  };
}

export interface OpenPoValidationError {
  ok: false;
  field: string;
  errorId: string;
  errorEn: string;
}

/**
 * Formats an integer amount into Indonesian Rupiah label (e.g. Rp100.000).
 */
export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

/**
 * Normalizes a WhatsApp number by stripping spaces, dashes, and formatting 08... -> 628...
 */
export function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith("8")) {
    return `62${digits}`;
  }
  return digits;
}

/**
 * Checks whether a submitted promo code matches the active Batch 1 discount code.
 */
export function normalizePromoCode(raw: unknown): {
  trimmedUpper: string;
  isValidMatch: boolean;
} {
  const trimmedUpper = String(raw ?? "").trim().toUpperCase();
  return {
    trimmedUpper,
    isValidMatch: trimmedUpper === OPEN_PO_PROMO_CODE,
  };
}

export interface PoCatalogItem {
  slug: string;
  name: string;
  colorName: string;
  colorSwatch: string;
  thumbnailImage: string;
  flatArtworkImage: string;
  visualDescription: string;
  visualDescriptionEn: string;
  hasCollectionPage: boolean;
}

const EXTRA_PO_DESIGN_ITEMS: PoCatalogItem[] = [
  {
    slug: "ambarwati",
    name: "Ambarwati",
    colorName: "Dusty Plum Rose",
    colorSwatch: "#A97E8E",
    thumbnailImage: "/assets/design-hijab-optimized/AMBARWATI.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/AMBARWATI.webp",
    visualDescription:
      "Motif floral cat air bernuansa dusty plum dan mauve dengan sulur ornamen klasik yang anggun, manis, dan lembut untuk tampilan harian maupun acara spesial.",
    visualDescriptionEn:
      "Dusty plum and mauve watercolor florals paired with classic ornamental scrolls for a soft, graceful daily or occasion look.",
    hasCollectionPage: false,
  },
  {
    slug: "bumi-asri",
    name: "Bumi Asri",
    colorName: "Warm Coral & Sage",
    colorSwatch: "#D99B97",
    thumbnailImage: "/assets/design-hijab-optimized/BUMI ASRI.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/BUMI ASRI.webp",
    visualDescription:
      "Perpaduan bunga botani bernuansa coral hangat, sage, dan dusty blue di atas dasar blush-cream yang segar, ringan, dan feminin.",
    visualDescriptionEn:
      "Warm coral, sage, and dusty blue botanical blooms arranged over a fresh, feminine blush-cream base.",
    hasCollectionPage: false,
  },
  {
    slug: "kawungsari",
    name: "Kawungsari",
    colorName: "Ivory & Dusty Rose",
    colorSwatch: "#C48B94",
    thumbnailImage: "/assets/design-hijab-optimized/KAWUNGSARI.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/KAWUNGSARI.webp",
    visualDescription:
      "Kelopak bunga dusty rose dengan dedaunan sage-beige yang tenang di atas dasar gading bersih bermotif simetris elegan.",
    visualDescriptionEn:
      "Dusty rose floral blooms with muted sage-beige foliage set over a clean ivory symmetrical layout.",
    hasCollectionPage: false,
  },
  {
    slug: "kembangkinonce",
    name: "Kembangkinonce",
    colorName: "Indigo Denim Blue",
    colorSwatch: "#3E5C8A",
    thumbnailImage: "/assets/design-hijab-optimized/KEMBANGKINONCE.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/KEMBANGKINONCE.webp",
    visualDescription:
      "Motif floral monokrom biru indigo denim yang tegas namun tetap lembut, memberi kesan klasik berkarakter dan mudah dipadukan.",
    visualDescriptionEn:
      "Deep indigo denim-blue monochrome florals and foliage with a crisp, classic, and versatile character.",
    hasCollectionPage: false,
  },
  {
    slug: "puspitasari",
    name: "Puspitasari",
    colorName: "Sage & Pearl Paisley",
    colorSwatch: "#B9BEB4",
    thumbnailImage: "/assets/design-hijab-optimized/PUSPITASARI.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/PUSPITASARI.webp",
    visualDescription:
      "Latar floral cat air sage-taupe lembut berpadu detail ornamen paisley warna mutiara gading yang halus dan bersahaja.",
    visualDescriptionEn:
      "Soft sage-taupe watercolor floral backdrop layered with delicate ivory-pearl paisley ornaments.",
    hasCollectionPage: false,
  },
  {
    slug: "sekar-arum",
    name: "Sekar Arum",
    colorName: "Dove Grey & Soft Gold",
    colorSwatch: "#8F9394",
    thumbnailImage: "/assets/design-hijab-optimized/SEKAR ARUM.webp",
    flatArtworkImage: "/assets/design-hijab-optimized/SEKAR ARUM.webp",
    visualDescription:
      "Motif bunga cat air abu-abu dove yang sejuk dengan aksen daun olive keemasan, menghadirkan nuansa tenang dan modern.",
    visualDescriptionEn:
      "Soft dove-grey watercolor florals accented with muted olive-gold leaves for a calm, modern finish.",
    hasCollectionPage: false,
  },
];

/**
 * Returns all 10 hijab designs available in the Open PO Batch 1 catalog.
 */
export function getPoCatalogItems(): PoCatalogItem[] {
  const storefrontItems: PoCatalogItem[] = getCollections().map(
    (collection) => ({
      slug: collection.slug,
      name: collection.name,
      colorName: collection.colorName,
      colorSwatch: collection.colorSwatch,
      thumbnailImage: collection.modelImage,
      flatArtworkImage: collection.flatArtworkImage,
      visualDescription: collection.visualDescription,
      visualDescriptionEn:
        collection.visualDescriptionEn || collection.visualDescription,
      hasCollectionPage: true,
    }),
  );

  return [...storefrontItems, ...EXTRA_PO_DESIGN_ITEMS];
}

/**
 * Normalizes and computes line items and totals using canonical prices and optional promo pricing.
 */
export function normalizeOrderItems(
  quantities: Record<string, unknown>,
  promoCodeInput?: string,
): {
  items: OpenPoOrderItem[];
  qtyBySlug: Record<string, number>;
  totalQty: number;
  promoCode: string;
  unitPrice: number;
  originalTotal: number;
  discountAmount: number;
  totalAmount: number;
  itemsSummary: string;
} {
  const catalogItems = getPoCatalogItems();
  const { isValidMatch } = normalizePromoCode(promoCodeInput);
  const promoCode = isValidMatch ? OPEN_PO_PROMO_CODE : "";
  const activeUnitPrice = isValidMatch ? OPEN_PO_PROMO_UNIT_PRICE : PRODUCT_PRICE;

  const qtyBySlug: Record<string, number> = {};
  const items: OpenPoOrderItem[] = [];

  for (const item of catalogItems) {
    const rawQty = Number(quantities?.[item.slug] ?? 0);
    const qty = Number.isFinite(rawQty)
      ? Math.max(0, Math.min(99, Math.floor(rawQty)))
      : 0;

    qtyBySlug[item.slug] = qty;
    if (qty > 0) {
      items.push({
        slug: item.slug,
        name: item.name,
        colorName: item.colorName,
        quantity: qty,
        unitPrice: activeUnitPrice,
        subtotal: qty * activeUnitPrice,
      });
    }
  }

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const originalTotal = totalQty * PRODUCT_PRICE;
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = Math.max(0, originalTotal - totalAmount);
  const itemsSummary = items
    .map((item) => `${item.name} (${item.quantity} pcs)`)
    .join(", ");

  return {
    items,
    qtyBySlug,
    totalQty,
    promoCode,
    unitPrice: activeUnitPrice,
    originalTotal,
    discountAmount,
    totalAmount,
    itemsSummary,
  };
}

function isValidDeliveryMethod(value: unknown): value is DeliveryMethod {
  return (
    value === "cod-polines" ||
    value === "cod-semarang" ||
    value === "delivery-semarang"
  );
}

function isValidPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "cod-cash" || value === "transfer-qris";
}

function isValidAffiliation(value: unknown): value is CustomerAffiliation {
  return value === "polines" || value === "general";
}

/**
 * Validates and normalizes incoming Open PO form payloads on both client and server.
 */
export function validateOpenPoInput(
  raw: Record<string, unknown>,
): OpenPoValidationSuccess | OpenPoValidationError {
  const { trimmedUpper, isValidMatch } = normalizePromoCode(raw.promoCode);
  if (trimmedUpper.length > 0 && !isValidMatch) {
    return {
      ok: false,
      field: "promoCode",
      errorId: "Kode diskon tidak valid. Periksa kembali atau kosongkan.",
      errorEn: "Invalid discount code. Please check or clear the field.",
    };
  }

  const quantities =
    raw.quantities && typeof raw.quantities === "object"
      ? (raw.quantities as Record<string, unknown>)
      : {};
  const {
    items,
    qtyBySlug,
    totalQty,
    promoCode,
    unitPrice,
    originalTotal,
    discountAmount,
    totalAmount,
    itemsSummary,
  } = normalizeOrderItems(quantities, trimmedUpper);

  if (totalQty < 1) {
    return {
      ok: false,
      field: "quantities",
      errorId: "Pilih minimal 1 pcs motif hijab terlebih dahulu.",
      errorEn: "Please select at least 1 hijab motif.",
    };
  }

  const fullName = String(raw.fullName ?? "").trim();
  if (fullName.length < 2) {
    return {
      ok: false,
      field: "fullName",
      errorId: "Nama lengkap wajib diisi (minimal 2 karakter).",
      errorEn: "Full name is required (at least 2 characters).",
    };
  }

  const rawWhatsapp = String(raw.whatsapp ?? "").trim();
  const normalizedWhatsapp = normalizeWhatsappNumber(rawWhatsapp);
  if (normalizedWhatsapp.length < 10 || normalizedWhatsapp.length > 15) {
    return {
      ok: false,
      field: "whatsapp",
      errorId: "Nomor WhatsApp tidak valid. Contoh: 085727033141.",
      errorEn: "Invalid WhatsApp number. Example: 085727033141.",
    };
  }

  const affiliation: CustomerAffiliation = isValidAffiliation(raw.affiliation)
    ? raw.affiliation
    : "polines";
  const affiliationLabel =
    affiliation === "polines"
      ? "Mahasiswa / Civitas Polines"
      : "Umum / Luar Kampus";
  const departmentOrClass = String(raw.departmentOrClass ?? "").trim();

  if (!isValidDeliveryMethod(raw.deliveryMethod)) {
    return {
      ok: false,
      field: "deliveryMethod",
      errorId: "Pilih metode pengambilan atau pengiriman.",
      errorEn: "Please choose a pickup or delivery method.",
    };
  }
  const deliveryMethod = raw.deliveryMethod;
  const deliveryMethodLabel = DELIVERY_METHOD_LABELS[deliveryMethod].id;

  const codSpot =
    deliveryMethod === "cod-semarang"
      ? String(raw.codSpot ?? "").trim()
      : "";

  if (deliveryMethod === "cod-semarang" && codSpot.length < 3) {
    return {
      ok: false,
      field: "codSpot",
      errorId: "Tulis area atau titik temu COD di Tembalang / Kota Semarang.",
      errorEn: "Please provide your Tembalang / Semarang COD spot.",
    };
  }

  const address =
    deliveryMethod === "delivery-semarang"
      ? String(raw.address ?? "").trim()
      : "";

  if (deliveryMethod === "delivery-semarang" && address.length < 5) {
    return {
      ok: false,
      field: "address",
      errorId: "Alamat lengkap pengiriman Kota Semarang wajib diisi.",
      errorEn: "Full Semarang shipping address is required.",
    };
  }

  if (!isValidPaymentMethod(raw.paymentMethod)) {
    return {
      ok: false,
      field: "paymentMethod",
      errorId: "Pilih metode pembayaran terlebih dahulu.",
      errorEn: "Please choose a payment method.",
    };
  }
  const paymentMethod = raw.paymentMethod;
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[paymentMethod].id;

  return {
    ok: true,
    data: {
      fullName,
      whatsapp: normalizedWhatsapp,
      affiliation,
      affiliationLabel,
      departmentOrClass,
      items,
      itemsSummary,
      qtyBySlug,
      totalQty,
      promoCode,
      unitPrice,
      originalTotal,
      discountAmount,
      totalAmount,
      deliveryMethod,
      deliveryMethodLabel,
      codSpot,
      address,
      paymentMethod,
      paymentMethodLabel,
    },
  };
}

/**
 * Generates a compact, readable Batch 1 PO code such as PO1-1128-4821.
 */
export function generatePoOrderCode(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `PO1-${month}${day}-${randomDigits}`;
}

/**
 * Formats a Date into WIB (Asia/Jakarta) readable string for receipts and spreadsheets.
 */
export function formatWibTimestamp(now: Date = new Date()): string {
  const formatted = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  return `${formatted} WIB`;
}
