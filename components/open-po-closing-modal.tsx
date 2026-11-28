'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCT_MATERIAL, PRODUCT_PRICE_LABEL, PRODUCT_SIZE } from "../lib/collections";
import {
  getOpenPoCountdown,
  getPoCatalogItems,
  OPEN_PO_CLOSING_DATE_LABEL_EN,
  OPEN_PO_CLOSING_DATE_LABEL_ID,
  OpenPoCountdown,
} from "../lib/open-po";

export interface OpenPoClosingModalProps {
  isEn: boolean;
  onClose: () => void;
  ctaHref?: string;
  onAction?: () => void;
}

/**
 * Editorial announcement modal showing the Open PO Batch 1 closing date (1 December 2026) and live countdown.
 */
export default function OpenPoClosingModal({
  isEn,
  onClose,
  ctaHref,
  onAction,
}: OpenPoClosingModalProps) {
  const [countdown, setCountdown] = useState<OpenPoCountdown>(() =>
    getOpenPoCountdown(),
  );
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const previewMotifs = useMemo(
    () => getPoCatalogItems().filter((_, idx) => [0, 4, 5, 3, 7].includes(idx)),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const tick = window.setInterval(() => {
      setCountdown(getOpenPoCountdown());
    }, 1000);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.clearInterval(tick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const countdownUnits = [
    {
      value: String(countdown.days).padStart(2, "0"),
      label: isEn ? "Days" : "Hari",
    },
    {
      value: String(countdown.hours).padStart(2, "0"),
      label: isEn ? "Hours" : "Jam",
    },
    {
      value: String(countdown.minutes).padStart(2, "0"),
      label: isEn ? "Mins" : "Menit",
    },
    {
      value: String(countdown.seconds).padStart(2, "0"),
      label: isEn ? "Secs" : "Detik",
    },
  ];

  const ctaLabel = ctaHref
    ? isEn
      ? "Join Open PO Batch 1 Now →"
      : "Ikuti Open PO Batch 1 Sekarang →"
    : isEn
      ? "Reserve Batch 1 Motifs Now →"
      : "Amankan Motif Batch 1 Sekarang →";

  const ctaClasses =
    "w-full py-3.5 px-6 rounded-2xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center text-center cursor-pointer";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        isEn
          ? "Open PO Batch 1 Closing Announcement"
          : "Pengumuman Penutupan Open PO Batch 1"
      }
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#1F1D1A]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#D4AF37]/60 shadow-[0_28px_80px_rgba(31,29,26,0.45)] animate-menu-drop"
      >
        {/* Top Luxury Banner Header */}
        <div className="relative bg-gradient-to-br from-[#2D1A0E] via-[#6B1D2F] to-[#1F1D1A] px-6 sm:px-7 pt-6 pb-6 text-white overflow-hidden">
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full border border-[#D4AF37]/20 pointer-events-none" />
          <div className="absolute -left-10 -bottom-14 w-40 h-40 rounded-full border border-[#D4AF37]/15 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/45 text-[#ffe088] text-[10px] uppercase tracking-[0.2em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffe088] animate-pulse" />
              {isEn ? "LIMITED BATCH 1 WINDOW" : "PENGUMUMAN OPEN PO · BATCH 1"}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? "Close popup" : "Tutup pengumuman"}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 !text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              <span className="!text-white">✕</span>
            </button>
          </div>

          <div className="relative z-10 mt-4">
            <h2 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight">
              {isEn ? (
                <>
                  Open PO Batch 1 Closes{" "}
                  <span className="italic text-[#ffe088] block sm:inline">
                    December 1, 2026
                  </span>
                </>
              ) : (
                <>
                  Open PO Batch 1 Ditutup{" "}
                  <span className="italic text-[#ffe088] block sm:inline">
                    1 Desember 2026
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/85 mt-2 leading-relaxed">
              {isEn
                ? `Orders close on ${OPEN_PO_CLOSING_DATE_LABEL_EN} at 23:59 WIB. Reserve your favorite motifs before Batch 1 ends!`
                : `Batas akhir pemesanan ${OPEN_PO_CLOSING_DATE_LABEL_ID} pukul 23.59 WIB. Yuk amankan motif favoritmu sebelum Batch 1 ditutup!`}
            </p>
          </div>

          {/* Miniature Motif Strip */}
          <div className="relative z-10 mt-4 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {previewMotifs.map((motif) => (
                <div
                  key={motif.slug}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#FAF7F2]/80 bg-[#eee5de] shadow-sm"
                  title={motif.name}
                >
                  <Image
                    src={motif.flatArtworkImage}
                    alt={motif.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-medium text-[#ffe088]">
              {isEn
                ? "10 Exclusive Motifs · Voal Ultrasoft"
                : "10 Motif Eksklusif · Voal Ultrasoft"}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {countdown.expired ? (
            <div className="p-3.5 rounded-2xl bg-[#6B1D2F]/10 border border-[#6B1D2F]/25 text-center text-xs sm:text-sm text-[#6B1D2F] font-medium">
              {isEn
                ? "The Batch 1 deadline has passed — please check the Open PO page or contact Admin WhatsApp."
                : "Batas waktu Batch 1 sudah berakhir — silakan cek halaman Open PO atau konfirmasi ke WhatsApp Admin."}
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8C7D73] font-semibold text-center">
                {isEn
                  ? "Time Remaining Before Closing"
                  : "Hitung Mundur Penutupan Batch 1"}
              </span>
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {countdownUnits.map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-2xl bg-white border border-[#D4AF37]/40 py-2.5 px-2 text-center shadow-xs"
                  >
                    <span className="block font-display text-xl sm:text-2xl font-bold text-[#311908] tabular-nums leading-none">
                      {unit.value}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-[#8C7D73] font-semibold mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          <div className="rounded-2xl bg-white border border-[#d4c3bb]/60 p-4 space-y-2 text-xs text-[#50443e]">
            <div className="flex items-start gap-2">
              <span className="text-[#6B1D2F] font-bold">✦</span>
              <span>
                {isEn ? (
                  <>
                    <strong>10 signature patterns</strong> in {PRODUCT_MATERIAL}{" "}
                    ({PRODUCT_SIZE}) with neat edge stitching
                  </>
                ) : (
                  <>
                    <strong>10 motif eksklusif</strong> bahan {PRODUCT_MATERIAL}{" "}
                    ({PRODUCT_SIZE}), ringan & tegak di dahi
                  </>
                )}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#6B1D2F] font-bold">✦</span>
              <span>
                {isEn ? (
                  <>
                    <strong>COD Polines Free Delivery</strong> + Semarang meetup
                    & city delivery options
                  </>
                ) : (
                  <>
                    <strong>COD Kampus Polines Gratis Ongkir</strong>, tersedia
                    juga COD & antar Kota Semarang
                  </>
                )}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#6B1D2F] font-bold">✦</span>
              <span>
                {isEn ? (
                  <>
                    Price{" "}
                    <strong className="text-[#6B1D2F]">
                      {PRODUCT_PRICE_LABEL} / pcs
                    </strong>{" "}
                    (mix multiple motifs in one order)
                  </>
                ) : (
                  <>
                    Harga{" "}
                    <strong className="text-[#6B1D2F]">
                      {PRODUCT_PRICE_LABEL} / pcs
                    </strong>{" "}
                    — bisa gabung beberapa motif sekaligus dalam 1 PO
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {ctaHref ? (
              <Link href={ctaHref} onClick={onClose} className={ctaClasses}>
                <span className="!text-white">{ctaLabel}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction ?? onClose}
                className={ctaClasses}
              >
                <span className="!text-white">{ctaLabel}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-[11px] text-center !text-[#8C7D73] hover:!text-[#311908] transition-colors cursor-pointer"
            >
              {ctaHref
                ? isEn
                  ? "Later, explore homepage first"
                  : "Nanti dulu, lihat beranda"
                : isEn
                  ? "Close announcement"
                  : "Tutup pengumuman"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
