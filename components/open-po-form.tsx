'use client';

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Collection,
  getCollections,
  PRODUCT_FINISHING,
  PRODUCT_MATERIAL,
  PRODUCT_PRICE,
  PRODUCT_PRICE_LABEL,
  PRODUCT_SIZE,
} from "../lib/collections";
import { useLanguage } from "../lib/language-context";
import {
  CustomerAffiliation,
  DELIVERY_METHOD_LABELS,
  DeliveryMethod,
  formatRupiah,
  normalizeOrderItems,
  normalizePromoCode,
  OPEN_PO_BATCH_LABEL,
  OPEN_PO_PROMO_CODE,
  OPEN_PO_PROMO_UNIT_PRICE,
  OpenPoReceipt,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
  validateOpenPoInput,
} from "../lib/open-po";

const INITIAL_QUANTITIES: Record<string, number> = Object.fromEntries(
  getCollections().map((item) => [item.slug, 0]),
);

function buildInitialQuantities(
  motifSlug: string | null,
): Record<string, number> {
  if (!motifSlug || !(motifSlug in INITIAL_QUANTITIES)) {
    return INITIAL_QUANTITIES;
  }
  return {
    ...INITIAL_QUANTITIES,
    [motifSlug]: 1,
  };
}

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3.5 pb-4 border-b border-[#d4c3bb]/50">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#311908] text-white text-xs font-sans font-bold tracking-wider flex-shrink-0 mt-0.5">
        {step}
      </span>
      <div>
        <h2 className="font-display text-xl sm:text-2xl text-[#1c1c19] font-normal leading-snug">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[#8C7D73] font-sans mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function MotifCard({
  collection,
  qty,
  unitPrice,
  promoActive,
  isEn,
  onChangeQty,
  onPreviewPattern,
}: {
  collection: Collection;
  qty: number;
  unitPrice: number;
  promoActive: boolean;
  isEn: boolean;
  onChangeQty: (slug: string, delta: number) => void;
  onPreviewPattern: (collection: Collection) => void;
}) {
  const isSelected = qty > 0;

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 flex flex-col justify-between gap-3.5 ${
        isSelected
          ? "bg-white border-[#6B1D2F]/60 ring-2 ring-[#6B1D2F]/15 shadow-md"
          : "bg-white/80 border-[#d4c3bb]/70 hover:border-[#8C7D73]/70 hover:bg-white shadow-xs"
      }`}
    >
      <div className="flex gap-3.5 items-start">
        <button
          type="button"
          onClick={() => onPreviewPattern(collection)}
          className="relative w-20 h-24 sm:w-22 sm:h-28 rounded-xl overflow-hidden bg-[#eee5de] flex-shrink-0 group cursor-pointer border border-[#d4c3bb]/50"
          aria-label={
            isEn
              ? `Preview motif ${collection.name}`
              : `Lihat motif ${collection.name}`
          }
        >
          <Image
            src={collection.modelImage}
            alt={collection.name}
            fill
            sizes="96px"
            className="object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute inset-x-0 bottom-0 py-0.5 bg-[#1F1D1A]/75 text-white text-[9px] font-sans uppercase tracking-wider text-center opacity-90 group-hover:opacity-100">
            {isEn ? "Motif" : "Detail"}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-black/15 flex-shrink-0"
              style={{ backgroundColor: collection.colorSwatch }}
            />
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8C7D73] font-semibold truncate">
              {collection.colorName}
            </span>
          </div>

          <h3 className="font-display text-base sm:text-lg text-[#1c1c19] font-normal mt-1 leading-tight">
            {collection.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            {promoActive && (
              <span className="text-xs text-[#8C7D73] line-through">
                {PRODUCT_PRICE_LABEL}
              </span>
            )}
            <p className="text-xs sm:text-sm font-semibold text-[#6B1D2F]">
              {formatRupiah(unitPrice)}
              <span className="text-[11px] font-normal text-[#8C7D73]">
                {" "}
                / pcs
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onPreviewPattern(collection)}
            className="mt-1.5 text-[11px] font-sans !text-[#50443e] hover:!text-[#311908] underline underline-offset-4 cursor-pointer"
          >
            {isEn ? "View artwork & spec" : "Intip motif & detail"}
          </button>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#d4c3bb]/40">
        <span className="text-xs font-sans text-[#50443e]">
          {isSelected
            ? `${isEn ? "Subtotal" : "Subtotal"}: ${formatRupiah(
                qty * unitPrice,
              )}`
            : isEn
              ? "Select quantity"
              : "Atur jumlah"}
        </span>

        <div className="inline-flex items-center rounded-full border border-[#d4c3bb] bg-[#FAF7F2] p-0.5">
          <button
            type="button"
            onClick={() => onChangeQty(collection.slug, -1)}
            disabled={qty === 0}
            aria-label={
              isEn
                ? `Decrease ${collection.name}`
                : `Kurangi jumlah ${collection.name}`
            }
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold !text-[#311908] hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            −
          </button>
          <span
            className="w-8 text-center text-xs sm:text-sm font-semibold text-[#1c1c19] tabular-nums"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => onChangeQty(collection.slug, 1)}
            aria-label={
              isEn
                ? `Increase ${collection.name}`
                : `Tambah jumlah ${collection.name}`
            }
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-[#311908] !text-white hover:bg-[#4A2E1B] transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderReceiptCard({
  receipt,
  isEn,
  onCreateNewOrder,
}: {
  receipt: OpenPoReceipt;
  isEn: boolean;
  onCreateNewOrder: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(receipt.orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#D4AF37]/50 shadow-xl overflow-hidden">
      {/* Top Celebration Banner */}
      <div className="bg-gradient-to-br from-[#311908] via-[#4A2E1B] to-[#1F1D1A] px-6 sm:px-10 py-8 text-white relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-[#D4AF37]/20 pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#ffe088] text-[10px] uppercase tracking-[0.2em] font-semibold">
          <span>✦</span>
          <span>{receipt.batch}</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-white mt-3 font-normal">
          {isEn
            ? "Pre-Order Form Recorded!"
            : "Pesanan Open PO Berhasil Dicatat!"}
        </h2>
        <p className="text-xs sm:text-sm text-[#F2EDE4]/80 font-sans mt-1.5 leading-relaxed">
          {isEn
            ? "Keep your PO code below. SEKARANTI Admin will reach out to you via WhatsApp for order follow-up."
            : "Simpan Kode PO di bawah ini. Admin SEKARANTI akan segera menghubungi kamu melalui WhatsApp untuk konfirmasi pesanan."}
        </p>

        {/* Order Code */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-[#D4AF37]/50 backdrop-blur-sm">
            <div>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#F2EDE4]/70">
                {isEn ? "PO Order Code" : "Kode PO Anda"}
              </span>
              <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[#ffe088]">
                {receipt.orderCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e9c349] !text-[#1F1D1A] text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              {copied
                ? isEn
                  ? "Copied"
                  : "Tersalin"
                : isEn
                  ? "Copy"
                  : "Salin"}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Breakdown */}
      <div className="p-6 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/50 space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7D73] font-semibold">
              {isEn ? "Customer Info" : "Data Pemesan"}
            </span>
            <p className="font-semibold text-[#1c1c19]">{receipt.fullName}</p>
            <p className="text-[#50443e]">WA: +{receipt.whatsapp}</p>
            <p className="text-[#50443e]">
              {receipt.affiliationLabel}
              {receipt.departmentOrClass
                ? ` · ${receipt.departmentOrClass}`
                : ""}
            </p>
            <p className="text-[11px] text-[#8C7D73] pt-1">
              {receipt.createdAtWib}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/50 space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7D73] font-semibold">
              {isEn ? "Pickup & Delivery" : "Pengambilan & Pengiriman"}
            </span>
            <p className="font-semibold text-[#1c1c19]">
              {receipt.deliveryMethodLabel}
            </p>
            {receipt.codSpot && (
              <p className="text-[#50443e]">
                <strong className="font-medium">
                  {isEn ? "Meetup Spot:" : "Titik COD:"}
                </strong>{" "}
                {receipt.codSpot}
              </p>
            )}
            {receipt.address && (
              <p className="text-[#50443e]">
                <strong className="font-medium">
                  {isEn ? "Address:" : "Alamat:"}
                </strong>{" "}
                {receipt.address}
              </p>
            )}
          </div>
        </div>

        {/* Itemized List */}
        <div className="rounded-2xl border border-[#d4c3bb]/60 overflow-hidden">
          <div className="px-4 py-3 bg-[#F2EDE4]/70 border-b border-[#d4c3bb]/50 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] font-semibold text-[#311908]">
            <span>{isEn ? "Selected Motifs" : "Rincian Motif"}</span>
            <span>{isEn ? "Subtotal" : "Subtotal"}</span>
          </div>
          <div className="divide-y divide-[#d4c3bb]/40">
            {receipt.items.map((item) => (
              <div
                key={item.slug}
                className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm"
              >
                <div>
                  <span className="font-medium text-[#1c1c19]">
                    {item.name}
                  </span>
                  <span className="text-[#8C7D73] ml-2">
                    × {item.quantity} pcs ({formatRupiah(item.unitPrice)})
                  </span>
                </div>
                <span className="font-semibold text-[#1c1c19]">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {receipt.promoCode && (
            <div className="px-4 py-2.5 bg-emerald-50/70 border-t border-[#d4c3bb]/50 flex items-center justify-between text-xs text-emerald-800">
              <span>
                Kode Diskon <strong>{receipt.promoCode}</strong>
              </span>
              <span className="font-semibold">
                − {formatRupiah(receipt.discountAmount)}
              </span>
            </div>
          )}

          <div className="px-4 py-3.5 bg-[#FAF7F2] border-t border-[#d4c3bb]/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#50443e] block">
                {receipt.paymentMethodLabel}
              </span>
              <span className="text-xs font-semibold text-[#311908]">
                Total ({receipt.totalQty} pcs)
              </span>
            </div>
            <div className="text-right">
              {receipt.discountAmount > 0 && (
                <span className="block text-xs text-[#8C7D73] line-through">
                  {formatRupiah(receipt.originalTotal)}
                </span>
              )}
              <span className="font-display text-xl sm:text-2xl text-[#6B1D2F] font-semibold">
                {formatRupiah(receipt.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onCreateNewOrder}
            className="flex-1 px-6 py-4 rounded-2xl bg-[#1F1D1A] hover:bg-[#311908] !text-white text-xs uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer"
          >
            <span className="text-white">
              {isEn ? "New Order" : "Buat Pesanan Baru"}
            </span>
          </button>

          <Link
            href="/"
            className="px-6 py-4 rounded-2xl border border-[#d4c3bb] bg-white hover:bg-[#FAF7F2] !text-[#311908] text-xs uppercase tracking-[0.16em] font-semibold text-center transition-colors"
          >
            {isEn ? "Back to Home" : "Kembali ke Beranda"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OpenPoForm() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const collections = useMemo(() => getCollections(), []);
  const searchParams = useSearchParams();

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    buildInitialQuantities(searchParams.get("motif")),
  );
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [affiliation, setAffiliation] =
    useState<CustomerAffiliation>("polines");
  const [departmentOrClass, setDepartmentOrClass] = useState("");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("cod-polines");
  const [semarangCodSpot, setSemarangCodSpot] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod-cash");

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<OpenPoReceipt | null>(null);
  const [previewCollection, setPreviewCollection] = useState<Collection | null>(
    null,
  );

  useEffect(() => {
    if (!previewCollection) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewCollection(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewCollection]);

  const {
    items,
    totalQty,
    promoCode,
    unitPrice,
    originalTotal,
    discountAmount,
    totalAmount,
  } = useMemo(
    () => normalizeOrderItems(quantities, appliedPromoCode),
    [quantities, appliedPromoCode],
  );

  const promoActive = promoCode === OPEN_PO_PROMO_CODE;

  const handleQtyChange = (slug: string, delta: number) => {
    setErrorMsg(null);
    setQuantities((prev) => {
      const current = prev[slug] ?? 0;
      const next = Math.max(0, Math.min(99, current + delta));
      return { ...prev, [slug]: next };
    });
  };

  const handleApplyPromo = () => {
    setErrorMsg(null);
    const { trimmedUpper, isValidMatch } = normalizePromoCode(promoInput);

    if (!trimmedUpper) {
      setAppliedPromoCode("");
      setPromoFeedback({
        type: "error",
        text: isEn
          ? "Please enter a discount code first."
          : "Masukkan kode diskon terlebih dahulu.",
      });
      return;
    }

    if (isValidMatch) {
      setAppliedPromoCode(OPEN_PO_PROMO_CODE);
      setPromoInput(OPEN_PO_PROMO_CODE);
      setPromoFeedback({
        type: "success",
        text: isEn
          ? `Code ${OPEN_PO_PROMO_CODE} applied! PO price is now ${formatRupiah(OPEN_PO_PROMO_UNIT_PRICE)} / pcs.`
          : `Kode ${OPEN_PO_PROMO_CODE} aktif! Harga PO jadi ${formatRupiah(OPEN_PO_PROMO_UNIT_PRICE)} / pcs.`,
      });
      return;
    }

    setAppliedPromoCode("");
    setPromoFeedback({
      type: "error",
      text: isEn
        ? "Discount code is invalid or expired."
        : "Kode diskon tidak valid. Periksa kembali penulisan kode.",
    });
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setAppliedPromoCode("");
    setPromoFeedback(null);
    setErrorMsg(null);
  };

  const handleResetForm = () => {
    setQuantities(INITIAL_QUANTITIES);
    setFullName("");
    setWhatsapp("");
    setDepartmentOrClass("");
    setSemarangCodSpot("");
    setAddress("");
    setPromoInput("");
    setAppliedPromoCode("");
    setPromoFeedback(null);
    setErrorMsg(null);
    setReceipt(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Allow users who typed the valid code without pressing "Pakai" to still apply seamlessly
    const candidatePromo = appliedPromoCode || promoInput.trim();
    const promoCheck = normalizePromoCode(candidatePromo);
    const promoToSubmit = promoCheck.trimmedUpper;

    const payload = {
      quantities,
      fullName,
      whatsapp,
      affiliation,
      departmentOrClass,
      deliveryMethod,
      codSpot: deliveryMethod === "cod-semarang" ? semarangCodSpot : "",
      address: deliveryMethod === "delivery-semarang" ? address : "",
      paymentMethod,
      promoCode: promoToSubmit,
    };

    const clientCheck = validateOpenPoInput(payload);
    if (!clientCheck.ok) {
      setErrorMsg(isEn ? clientCheck.errorEn : clientCheck.errorId);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/open-po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        errorEn?: string;
        receipt?: OpenPoReceipt;
      };

      if (!res.ok || !data.ok || !data.receipt) {
        setErrorMsg(
          (isEn ? data.errorEn : data.error) ||
            data.error ||
            (isEn
              ? "Failed to submit order. Please try again."
              : "Gagal mengirim form Open PO. Silakan coba lagi."),
        );
        return;
      }

      setReceipt(data.receipt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg(
        isEn
          ? "Network error occurred while submitting. Please try again."
          : "Terjadi gangguan jaringan saat mengirim form. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1c1c19] pt-24 sm:pt-28 pb-20">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-sans text-[#8C7D73] flex items-center gap-2"
      >
        <Link href="/" className="hover:text-[#311908] transition-colors">
          {isEn ? "HOME" : "BERANDA"}
        </Link>
        <span>/</span>
        <span className="text-[#311908] font-bold">OPEN PO BATCH 1</span>
      </nav>

      {/* Editorial Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-8 sm:pb-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D1A0E] via-[#3D2210] to-[#1F1D1A] text-white px-6 sm:px-10 py-8 sm:py-11 border border-[#D4AF37]/30 shadow-xl">
          <div className="absolute -right-14 -bottom-14 w-64 h-64 rounded-full border border-[#D4AF37]/15 pointer-events-none" />
          <div className="absolute right-8 top-8 w-28 h-28 rounded-full border border-[#D4AF37]/20 pointer-events-none hidden sm:block" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#ffe088] text-[10px] uppercase tracking-[0.22em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>{OPEN_PO_BATCH_LABEL}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3.5 leading-tight font-normal">
              {isEn ? (
                <>
                  Reserve Your Signature{" "}
                  <span className="italic text-[#ffe088]">SEKARANTI</span> Piece
                </>
              ) : (
                <>
                  Form Pre-Order{" "}
                  <span className="italic text-[#ffe088]">
                    Batch 1 SEKARANTI-SMG
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#F2EDE4]/80 font-sans mt-2.5 leading-relaxed max-w-2xl">
              {isEn
                ? "Select your favorite hijab motifs below, fill in your contact details, and choose Polines Campus COD or Semarang delivery."
                : "Pilih motif hijab favoritmu di bawah ini, isi nama lengkap, lalu pilih COD Kampus Polines atau area Semarang."}
            </p>

            <div className="flex flex-wrap gap-2 mt-5 text-[11px] font-sans">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAF7F2]">
                ✦ {PRODUCT_MATERIAL}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAF7F2]">
                ✦ {PRODUCT_SIZE}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAF7F2]">
                ✦ {PRODUCT_FINISHING}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#6B1D2F] border border-[#D4AF37]/40 text-white font-semibold">
                {promoActive
                  ? `${formatRupiah(OPEN_PO_PROMO_UNIT_PRICE)} / pcs (Promo)`
                  : `${PRODUCT_PRICE_LABEL} / pcs`}{" "}
                · COD Polines Gratis Ongkir
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {receipt ? (
          <OrderReceiptCard
            receipt={receipt}
            isEn={isEn}
            onCreateNewOrder={handleResetForm}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            noValidate
          >
            {/* Left Form Sections */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 01: Pilih Motif */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#d4c3bb]/60 shadow-sm space-y-5">
                <SectionHeader
                  step="01"
                  title={
                    isEn ? "Select Motifs & Quantity" : "Pilih Motif & Jumlah"
                  }
                  subtitle={
                    isEn
                      ? "You can combine more than one motif in a single pre-order."
                      : "Bisa pesan lebih dari 1 motif sekaligus dalam satu form."
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collections.map((collection) => (
                    <MotifCard
                      key={collection.slug}
                      collection={collection}
                      qty={quantities[collection.slug] ?? 0}
                      unitPrice={unitPrice}
                      promoActive={promoActive}
                      isEn={isEn}
                      onChangeQty={handleQtyChange}
                      onPreviewPattern={setPreviewCollection}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 02: Data Pemesan */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#d4c3bb]/60 shadow-sm space-y-5">
                <SectionHeader
                  step="02"
                  title={isEn ? "Customer Details" : "Data Pemesan"}
                  subtitle={
                    isEn
                      ? "Used to confirm order availability and COD meetup schedule."
                      : "Digunakan admin untuk konfirmasi pesanan & koordinasi jadwal COD."
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="po-fullname"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
                    >
                      {isEn ? "Full Name *" : "Nama Lengkap *"}
                    </label>
                    <input
                      id="po-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={
                        isEn
                          ? "e.g. Nabila Putri Azzahra"
                          : "Contoh: Nabila Putri Azzahra"
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#311908]/20 focus:border-[#311908] text-sm text-[#1c1c19]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="po-whatsapp"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
                    >
                      {isEn ? "Active WhatsApp *" : "Nomor WhatsApp Aktif *"}
                    </label>
                    <input
                      id="po-whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#311908]/20 focus:border-[#311908] text-sm text-[#1c1c19]"
                    />
                  </div>
                </div>

                {/* Affiliation Toggle */}
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-2">
                    {isEn ? "Customer Category" : "Status / Asal Pemesan"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        {
                          value: "polines",
                          labelId: "Mahasiswa / Civitas Polines",
                          labelEn: "Polines Student / Campus Community",
                        },
                        {
                          value: "general",
                          labelId: "Umum (Semarang & Luar Kota)",
                          labelEn: "General (Semarang & Outside)",
                        },
                      ] as const
                    ).map((opt) => {
                      const active = affiliation === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAffiliation(opt.value)}
                          className={`px-4 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                            active
                              ? "bg-[#311908] !text-white border-[#311908] shadow-sm"
                              : "bg-[#FAF7F2]/70 !text-[#50443e] border-[#d4c3bb] hover:border-[#311908]/50"
                          }`}
                        >
                          <span className={active ? "text-white" : "text-[#50443e]"}>
                            {isEn ? opt.labelEn : opt.labelId}
                          </span>
                          {active && <span className="text-[#ffe088]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {affiliation === "polines" && (
                  <div>
                    <label
                      htmlFor="po-prodi"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
                    >
                      {isEn
                        ? "Major / Study Program / Class (Optional)"
                        : "Jurusan / Prodi / Kelas (Opsional)"}
                    </label>
                    <input
                      id="po-prodi"
                      type="text"
                      value={departmentOrClass}
                      onChange={(e) => setDepartmentOrClass(e.target.value)}
                      placeholder={
                        isEn
                          ? "e.g. Accounting / D3-AB 2B"
                          : "Contoh: Akuntansi / AB-2B (memudahkan janjian COD)"
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#311908]/20 focus:border-[#311908] text-sm text-[#1c1c19]"
                    />
                  </div>
                )}
              </div>

              {/* STEP 03: Pilihan COD Polines & Alamat */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#d4c3bb]/60 shadow-sm space-y-5">
                <SectionHeader
                  step="03"
                  title={
                    isEn
                      ? "Pickup & Delivery Method"
                      : "Pilihan COD Polines & Pengiriman"
                  }
                  subtitle={
                    isEn
                      ? "Choose Polines Campus COD (free), Semarang COD, or Semarang address delivery."
                      : "Pilih COD Kampus Polines (bebas ongkir), COD area Tembalang/Semarang, atau antar alamat Kota Semarang."
                  }
                />

                {/* 3 Delivery Method Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(
                    Object.keys(DELIVERY_METHOD_LABELS) as DeliveryMethod[]
                  ).map((methodKey) => {
                    const active = deliveryMethod === methodKey;
                    const label = isEn
                      ? DELIVERY_METHOD_LABELS[methodKey].en
                      : DELIVERY_METHOD_LABELS[methodKey].id;

                    return (
                      <button
                        key={methodKey}
                        type="button"
                        onClick={() => {
                          setDeliveryMethod(methodKey);
                          setErrorMsg(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          active
                            ? "bg-[#311908]/[0.05] border-[#311908] ring-2 ring-[#311908]/15"
                            : "bg-[#FAF7F2]/60 border-[#d4c3bb]/80 hover:border-[#311908]/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-[#1c1c19] leading-snug">
                            {label}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              active
                                ? "border-[#311908] bg-[#311908]"
                                : "border-[#8C7D73]"
                            }`}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                        </div>
                        {methodKey === "cod-polines" && (
                          <span className="inline-block self-start mt-2 px-2 py-0.5 rounded-full bg-[#6B1D2F] text-white text-[9.5px] font-semibold uppercase tracking-wider">
                            {isEn ? "Popular · Free COD" : "Favorit · Gratis Ongkir"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* COD Kampus Polines — compact confirmation note only */}
                {deliveryMethod === "cod-polines" && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/70 text-xs sm:text-sm text-[#50443e] flex items-start gap-2.5">
                    <span className="text-[#6B1D2F] font-bold">✦</span>
                    <span>
                      {isEn
                        ? "Free delivery! Meetup spot & schedule at Polines Campus will be coordinated directly via WhatsApp Admin."
                        : "Gratis ongkir! Pengambilan langsung di area Kampus Polines, detail waktu ketemuan akan dikoordinasikan melalui WhatsApp Admin."}
                    </span>
                  </div>
                )}

                {/* COD Area Tembalang / Kota Semarang — Titik Temu only */}
                {deliveryMethod === "cod-semarang" && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/70">
                    <label
                      htmlFor="po-smg-spot"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
                    >
                      {isEn
                        ? "Semarang / Tembalang COD Spot *"
                        : "Titik Temu COD Area Tembalang / Semarang *"}
                    </label>
                    <input
                      id="po-smg-spot"
                      type="text"
                      value={semarangCodSpot}
                      onChange={(e) => setSemarangCodSpot(e.target.value)}
                      placeholder="Contoh: Bundaran Undip Tembalang / Banyumanik / Simpang Lima"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d4c3bb] bg-white focus:outline-none focus:ring-2 focus:ring-[#311908]/20 text-sm text-[#1c1c19]"
                    />
                  </div>
                )}

                {/* Antar Alamat Kota Semarang — Alamat Lengkap only */}
                {deliveryMethod === "delivery-semarang" && (
                  <div>
                    <label
                      htmlFor="po-address"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
                    >
                      {isEn
                        ? "Full Semarang Delivery Address (Street, District, City) *"
                        : "Alamat Lengkap Pengiriman (Jalan, RT/RW, Kec, Kota) *"}
                    </label>
                    <textarea
                      id="po-address"
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Contoh: Jl. Prof. Soedarto No. 10, RT 02/RW 04, Tembalang, Kota Semarang"
                      className="w-full px-4 py-3 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#311908]/20 focus:border-[#311908] text-sm text-[#1c1c19]"
                    />
                  </div>
                )}
              </div>

              {/* STEP 04: Metode Pembayaran */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#d4c3bb]/60 shadow-sm space-y-5">
                <SectionHeader
                  step="04"
                  title={isEn ? "Payment Method" : "Metode Pembayaran"}
                  subtitle={
                    isEn
                      ? "Choose how you prefer to complete payment after confirmation."
                      : "Pilih metode pembayaran yang paling nyaman untukmu."
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]
                  ).map((payKey) => {
                    const active = paymentMethod === payKey;
                    const label = isEn
                      ? PAYMENT_METHOD_LABELS[payKey].en
                      : PAYMENT_METHOD_LABELS[payKey].id;

                    return (
                      <button
                        key={payKey}
                        type="button"
                        onClick={() => setPaymentMethod(payKey)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
                            ? "bg-[#311908]/[0.05] border-[#311908] ring-2 ring-[#311908]/15"
                            : "bg-[#FAF7F2]/60 border-[#d4c3bb]/80 hover:border-[#311908]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-[#1c1c19]">
                            {label}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              active
                                ? "border-[#311908] bg-[#311908]"
                                : "border-[#8C7D73]"
                            }`}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sticky Order Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/40 shadow-lg space-y-5">
                <div className="pb-4 border-b border-[#d4c3bb]/50">
                  <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#6B1D2F]">
                    {OPEN_PO_BATCH_LABEL}
                  </span>
                  <h2 className="font-display text-2xl text-[#1c1c19] font-normal mt-1">
                    {isEn ? "Order Summary" : "Ringkasan Pesanan"}
                  </h2>
                </div>

                {/* Selected Items List */}
                {items.length === 0 ? (
                  <div className="py-6 px-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#d4c3bb] text-center">
                    <p className="text-xs text-[#8C7D73]">
                      {isEn
                        ? "No hijab motifs selected yet. Tap + on the motif cards."
                        : "Belum ada motif dipilih. Tekan tombol + pada pilihan motif di samping."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#d4c3bb]/30 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-[#1c1c19]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#8C7D73]">
                            {item.quantity} pcs × {formatRupiah(item.unitPrice)}
                          </p>
                        </div>
                        <span className="font-semibold text-[#1c1c19]">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Promo / Discount Code Input */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/60 space-y-2">
                  <label
                    htmlFor="po-promo-code"
                    className="block text-[10.5px] uppercase tracking-[0.16em] font-semibold text-[#311908]"
                  >
                    {isEn ? "Discount Code" : "Kode Diskon / Promo"}
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      id="po-promo-code"
                      type="text"
                      value={promoInput}
                      disabled={promoActive}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoFeedback?.type === "error") {
                          setPromoFeedback(null);
                        }
                      }}
                      placeholder={
                        isEn
                          ? "Enter discount code"
                          : "Masukkan kode diskon"
                      }
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-[#d4c3bb] bg-white disabled:bg-[#F0EDE9] text-xs font-mono uppercase tracking-wider text-[#1c1c19] focus:outline-none focus:ring-2 focus:ring-[#311908]/20"
                    />

                    {promoActive ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3.5 py-2 rounded-xl border border-[#d4c3bb] bg-white hover:bg-[#FAF7F2] !text-[#6B1D2F] text-[11px] font-semibold uppercase tracking-wider cursor-pointer flex-shrink-0"
                      >
                        {isEn ? "Remove" : "Hapus"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer flex-shrink-0"
                      >
                        {isEn ? "Apply" : "Pakai"}
                      </button>
                    )}
                  </div>

                  {promoFeedback && (
                    <p
                      className={`text-[11px] font-medium leading-snug ${
                        promoFeedback.type === "success"
                          ? "text-emerald-700"
                          : "text-[#ba1a1a]"
                      }`}
                    >
                      {promoFeedback.text}
                    </p>
                  )}
                </div>

                {/* Total Box */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#d4c3bb]/60 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#50443e]">
                    <span>{isEn ? "Total Quantity" : "Total Jumlah"}</span>
                    <span className="font-semibold text-[#1c1c19]">
                      {totalQty} pcs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#50443e]">
                    <span>{isEn ? "Unit Price" : "Harga Satuan"}</span>
                    <span className="font-medium text-[#1c1c19]">
                      {promoActive && (
                        <span className="line-through text-[#8C7D73] mr-1.5">
                          {formatRupiah(PRODUCT_PRICE)}
                        </span>
                      )}
                      {formatRupiah(unitPrice)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                      <span>
                        {isEn ? "Promo Savings" : `Diskon (${promoCode})`}
                      </span>
                      <span>− {formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-[#50443e]">
                    <span>{isEn ? "Delivery" : "Metode"}</span>
                    <span className="font-medium text-[#1c1c19] text-right max-w-[180px] truncate">
                      {isEn
                        ? DELIVERY_METHOD_LABELS[deliveryMethod].en
                        : DELIVERY_METHOD_LABELS[deliveryMethod].id}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#d4c3bb]/60 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#311908]">
                      {isEn ? "Estimated Total" : "Total Harga"}
                    </span>
                    <div className="text-right">
                      {discountAmount > 0 && (
                        <span className="block text-[11px] text-[#8C7D73] line-through">
                          {formatRupiah(originalTotal)}
                        </span>
                      )}
                      <span className="font-display text-2xl text-[#6B1D2F] font-semibold">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-2xl bg-[#ffdad6]/70 border border-[#ba1a1a]/30 text-xs text-[#93000a] font-medium"
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1F1D1A] hover:bg-[#311908] disabled:opacity-60 !text-white text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#D4AF37]/30 flex items-center justify-center gap-2"
                >
                  <span className="text-white">
                    {submitting
                      ? isEn
                        ? "Saving Pre-Order..."
                        : "Menyimpan Pesanan..."
                      : isEn
                        ? "Submit Open PO Form"
                        : "Kirim Pesanan Open PO"}
                  </span>
                  {!submitting && (
                    <span aria-hidden="true" className="text-white">
                      →
                    </span>
                  )}
                </button>

                <p className="text-[11px] text-[#8C7D73] text-center leading-relaxed">
                  {isEn
                    ? "After submitting, you will receive your PO Code as order confirmation."
                    : "Setelah kirim, kamu langsung mendapat Kode PO dan admin akan menghubungi via WhatsApp."}
                </p>
              </div>
            </aside>
          </form>
        )}
      </section>

      {/* Pattern Detail Preview Modal */}
      {previewCollection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewCollection.name}
          onClick={() => setPreviewCollection(null)}
          className="fixed inset-0 z-50 bg-[#1F1D1A]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full overflow-hidden border border-[#D4AF37]/40 shadow-2xl"
          >
            <div className="relative aspect-[16/10] bg-[#eee5de]">
              <Image
                src={previewCollection.flatArtworkImage}
                alt={`Motif ${previewCollection.name}`}
                fill
                sizes="(max-width: 768px) 95vw, 560px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewCollection(null)}
                aria-label={isEn ? "Close" : "Tutup"}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white !text-[#311908] flex items-center justify-center shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7D73] font-semibold">
                    {previewCollection.colorName}
                  </span>
                  <h3 className="font-display text-2xl text-[#1c1c19] font-normal">
                    {previewCollection.name}
                  </h3>
                </div>
                <span className="text-base font-semibold text-[#6B1D2F]">
                  {formatRupiah(unitPrice)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#50443e] leading-relaxed">
                {isEn
                  ? previewCollection.visualDescriptionEn ||
                    previewCollection.visualDescription
                  : previewCollection.visualDescription}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#d4c3bb]/50">
                <Link
                  href={`/collections/${previewCollection.slug}`}
                  className="text-xs uppercase tracking-[0.16em] font-semibold text-[#311908] underline underline-offset-4"
                >
                  {isEn ? "Open full collection page" : "Lihat halaman koleksi"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleQtyChange(previewCollection.slug, 1);
                    setPreviewCollection(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer"
                >
                  {isEn ? "+ Add 1 pcs" : "+ Tambah 1 pcs"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
