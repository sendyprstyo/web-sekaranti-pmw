'use client';

import Image from "next/image";
import { type TouchEvent, useEffect, useRef, useState } from "react";
import { useLanguage } from "../lib/language-context";
import { PMW_BAZAAR_PHOTOS, PMW_PARTNERS } from "../lib/pmw-bazaar";

interface PmwBazaarSectionProps {
  variant?: "home" | "about";
}

function LightboxArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function LightboxCloseIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function PmwBazaarSection({ variant = "home" }: PmwBazaarSectionProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const featuredPhoto = PMW_BAZAAR_PHOTOS[0];
  const galleryPhotos = PMW_BAZAAR_PHOTOS.slice(1);
  const activePhoto = activeIndex !== null ? PMW_BAZAAR_PHOTOS[activeIndex] : null;
  const isPortraitOrSquare = activePhoto ? activePhoto.height >= activePhoto.width : true;
  const formatPhotoNumber = (num: number) => String(num).padStart(2, "0");
  const totalPhotosLabel = formatPhotoNumber(PMW_BAZAAR_PHOTOS.length);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % PMW_BAZAAR_PHOTOS.length
        );
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + PMW_BAZAAR_PHOTOS.length) % PMW_BAZAAR_PHOTOS.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const showPrev = () => {
    setActiveIndex((prev) =>
      prev === null
        ? 0
        : (prev - 1 + PMW_BAZAAR_PHOTOS.length) % PMW_BAZAAR_PHOTOS.length
    );
  };

  const showNext = () => {
    setActiveIndex((prev) =>
      prev === null ? 0 : (prev + 1) % PMW_BAZAAR_PHOTOS.length
    );
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) {
      return;
    }

    if (deltaX < 0) {
      showNext();
    } else {
      showPrev();
    }
  };

  const renderCounterBadge = (extraClassName: string) => {
    if (!activePhoto || activeIndex === null) return null;
    return (
      <div
        className={`items-center gap-2 px-3 py-1 rounded-full bg-[#6B1D2F]/10 border border-[#6B1D2F]/20 text-[#6B1D2F] text-[9.5px] tracking-widest uppercase font-semibold max-w-full ${extraClassName}`}
      >
        <span className="shrink-0">
          {formatPhotoNumber(activeIndex + 1)} / {totalPhotosLabel}
        </span>
        <span className="shrink-0">·</span>
        <span className="truncate">
          {isEn ? activePhoto.tagEn : activePhoto.tagId}
        </span>
      </div>
    );
  };

  const paginationDots = (
    <div className="flex items-center gap-1.5">
      {PMW_BAZAAR_PHOTOS.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setActiveIndex(idx)}
          aria-label={`${isEn ? "Open photo" : "Buka foto"} ${idx + 1}`}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            idx === activeIndex
              ? "w-7 bg-[#311908]"
              : "w-2 bg-[#d4c3bb] hover:bg-[#8C7D73]"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section
      id="bazar-pmw"
      className={`scroll-mt-20 border-t border-[#d4c3bb]/45 ${
        variant === "about"
          ? "bg-[#FAF7F2] py-20 sm:py-28"
          : "bg-white py-20 sm:py-28"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* ============================================
            TOP EDITORIAL SPLIT — Story + Institutional Logos & Featured Booth Photo
            ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Narrative & Institutional Lockup */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-8 h-px bg-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73]">
                {isEn
                  ? "FIRST MILESTONE · PMW POLINES BAZAAR"
                  : "JEJAK PERDANA · BAZAR PMW POLINES"}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-[52px] text-[#1c1c19] leading-[1.08] tracking-tight font-normal">
              {isEn ? (
                <>
                  First steps at{" "}
                  <em className="text-[#9a4152] italic font-serif">
                    our debut bazaar.
                  </em>
                </>
              ) : (
                <>
                  Langkah pertama di{" "}
                  <em className="text-[#9a4152] italic font-serif">
                    bazar perdana kami.
                  </em>
                </>
              )}
            </h2>

            <div className="space-y-4 text-sm sm:text-[15px] text-[#50443e] font-sans font-light leading-relaxed max-w-2xl">
              <p>
                {isEn
                  ? "SEKARANTI made our very first offline appearance at the Program Mahasiswa Wirausaha (PMW) bazaar at Politeknik Negeri Semarang (POLINES). From presenting our Voal Ultrasoft fabric swatches to wrapping every pouch in person, this milestone marked the moment our digital illustrations met real smiles."
                  : "Melalui gelaran bazar Program Mahasiswa Wirausaha (PMW) Politeknik Negeri Semarang (POLINES), SEKARANTI hadir untuk pertama kalinya secara langsung menyapa pengunjung. Dari sentuhan lembut bahan Voal Ultrasoft hingga pengemasan pouch perdana, bazar ini menjadi saksi langkah awal perjalanan nyata kami."}
              </p>
              <p>
                {isEn
                  ? "Every warm conversation, feedback, and first purchase at the booth motivates us to keep crafting printed hijabs with lasting cultural character."
                  : "Setiap sapaan hangat, masukan berharga, dan pembelian perdana di booth menjadi penyemangat bagi kami untuk terus merangkai hijab printing bernilai seni dan berkarakter."}
              </p>
            </div>

            {/* Institutional Partner Lockup Card */}
            <div
              className={`rounded-2xl border border-[#d4c3bb]/70 p-4 sm:p-5 ${
                variant === "about" ? "bg-white" : "bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="text-[9px] uppercase tracking-[0.24em] font-bold text-[#8C7D73]">
                  {isEn
                    ? "SUPPORTED BY · DEBUT BAZAAR DOCUMENTATION"
                    : "DIDUKUNG OLEH · DOKUMENTASI BAZAR PERDANA"}
                </span>
                <span className="text-[10px] text-[#D4AF37] font-serif italic">
                  Polines, Semarang
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PMW_PARTNERS.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-3.5 rounded-xl bg-white border border-[#d4c3bb]/50 px-3.5 py-2.5 shadow-2xs"
                  >
                    <div
                      className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-white border border-[#f0ede9] flex items-center justify-center ${
                        partner.id === "pmw-polines"
                          ? "w-20 h-12 px-1.5 py-1"
                          : "w-12 h-12 p-1"
                      }`}
                    >
                      <Image
                        src={partner.src}
                        alt={partner.name}
                        width={partner.width}
                        height={partner.height}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9.5px] uppercase tracking-[0.16em] text-[#8C7D73] font-semibold truncate">
                        {isEn ? partner.roleEn : partner.roleId}
                      </p>
                      <p className="text-xs sm:text-[13px] font-display font-semibold text-[#311908] leading-snug">
                        {partner.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Milestone Facts */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-2 border-t border-[#d4c3bb]/50">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C7D73] font-semibold block">
                  {isEn ? "Milestone" : "Momentum"}
                </span>
                <p className="font-display text-sm sm:text-base text-[#1c1c19] mt-0.5">
                  {isEn ? "1st Offline Bazaar" : "Bazar Perdana"}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C7D73] font-semibold block">
                  {isEn ? "Venue" : "Lokasi"}
                </span>
                <p className="font-display text-sm sm:text-base text-[#1c1c19] mt-0.5">
                  Kampus Polines
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C7D73] font-semibold block">
                  {isEn ? "Program" : "Program"}
                </span>
                <p className="font-display text-sm sm:text-base text-[#1c1c19] mt-0.5">
                  PMW Polines
                </p>
              </div>
            </div>
          </div>

          {/* Right Featured Portrait Photo */}
          <div className="lg:col-span-5">
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              className="group relative block w-full text-left rounded-3xl overflow-hidden border border-[#d4c3bb]/70 shadow-xl bg-[#eee5de] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
              aria-label={isEn ? featuredPhoto.titleEn : featuredPhoto.titleId}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={featuredPhoto.src}
                  alt={isEn ? featuredPhoto.titleEn : featuredPhoto.titleId}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  style={{ objectPosition: featuredPhoto.objectPosition }}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#311908] text-[9.5px] uppercase tracking-[0.18em] font-bold shadow-sm border border-[#D4AF37]/40">
                    01 · {isEn ? featuredPhoto.tagEn : featuredPhoto.tagId}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#1F1D1A]/65 backdrop-blur-sm text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#311908] transition-all">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M9 21H3v-6" />
                      <path d="M21 3l-7 7" />
                      <path d="M3 21l7-7" />
                    </svg>
                  </span>
                </div>

                {/* Bottom Scrim & Caption */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-[#1c1c19]/90 via-[#1c1c19]/55 to-transparent text-white">
                  <h3 className="font-display text-xl sm:text-2xl font-normal leading-snug text-white">
                    {isEn ? featuredPhoto.titleEn : featuredPhoto.titleId}
                  </h3>
                  <p className="text-xs text-white/80 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed">
                    {isEn ? featuredPhoto.captionEn : featuredPhoto.captionId}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mt-3">
                    <span>{isEn ? "View full documentation" : "Lihat dokumentasi penuh"}</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ============================================
            BOTTOM EDITORIAL GALLERY STRIP
            ============================================ */}
        <div className="mt-12 sm:mt-16 pt-10 border-t border-[#d4c3bb]/45">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <span className="text-[9.5px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73] block mb-1">
                {isEn
                  ? `BAZAAR ARCHIVE · ${totalPhotosLabel} MOMENTS`
                  : `ARSIP BAZAR · ${totalPhotosLabel} MOMEN`}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1c1c19] font-normal">
                {isEn ? (
                  <>
                    Captured moments from{" "}
                    <em className="text-[#9a4152] italic font-serif">day one.</em>
                  </>
                ) : (
                  <>
                    Potret kehangatan{" "}
                    <em className="text-[#9a4152] italic font-serif">di hari pertama.</em>
                  </>
                )}
              </h3>
            </div>
            <p className="text-xs text-[#8C7D73] font-sans font-light">
              {isEn
                ? "Click any photo to view full resolution and story."
                : "Klik foto mana saja untuk melihat detail penuh & ceritanya."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {galleryPhotos.map((photo, idx) => {
              const photoIndex = idx + 1;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActiveIndex(photoIndex)}
                  className={`group flex flex-col text-left rounded-2xl overflow-hidden border border-[#d4c3bb]/65 hover:border-[#D4AF37] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    variant === "about" ? "bg-white" : "bg-[#FAF7F2]"
                  }`}
                  aria-label={isEn ? photo.titleEn : photo.titleId}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#eee5de]">
                    <Image
                      src={photo.src}
                      alt={isEn ? photo.titleEn : photo.titleId}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      style={{ objectPosition: photo.objectPosition }}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/88 backdrop-blur-sm text-[#311908] text-[9px] font-bold tracking-widest border border-[#d4c3bb]/60">
                      {formatPhotoNumber(photoIndex + 1)}
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#1F1D1A]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M9 21H3v-6" />
                        <path d="M21 3l-7 7" />
                        <path d="M3 21l7-7" />
                      </svg>
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-1.5">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#9a4152] block">
                        {isEn ? photo.tagEn : photo.tagId}
                      </span>
                      <h4 className="font-display text-sm sm:text-base text-[#1c1c19] group-hover:text-[#6B1D2F] transition-colors mt-0.5 font-normal leading-snug">
                        {isEn ? photo.titleEn : photo.titleId}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#50443e] font-sans font-light line-clamp-2 leading-relaxed">
                      {isEn ? photo.captionEn : photo.captionId}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================
          LIGHTBOX MODAL — Full Uncropped View + Navigation
          ============================================ */}
      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? activePhoto.titleEn : activePhoto.titleId}
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-50 bg-[#1F1D1A]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-[26px] sm:rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 flex flex-col max-h-[90dvh] md:max-h-[92vh] animate-menu-drop"
          >
            {/* Mobile Header Bar — Keeps Counter & Close Action Cleanly Separated */}
            <div className="md:hidden shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-[#FAF7F2] border-b border-[#d4c3bb]/45">
              {renderCounterBadge("inline-flex min-w-0")}
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="shrink-0 w-8 h-8 rounded-full bg-white hover:bg-[#F2EDE4] border border-[#d4c3bb]/80 flex items-center justify-center text-[#311908] hover:text-[#9a4152] transition-colors shadow-2xs cursor-pointer"
                aria-label={isEn ? "Close documentation view" : "Tutup tampilan dokumentasi"}
              >
                <LightboxCloseIcon />
              </button>
            </div>

            {/* Desktop Close Button */}
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="hidden md:flex absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#d4c3bb]/70 items-center justify-center text-[#311908] hover:text-[#9a4152] transition-colors shadow-sm cursor-pointer"
              aria-label={isEn ? "Close documentation view" : "Tutup tampilan dokumentasi"}
            >
              <LightboxCloseIcon />
            </button>

            {/* Scrollable Body on Mobile / Split Columns on Desktop */}
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">
              {/* Left / Top: Full Uncropped Image Stage */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative shrink-0 md:shrink md:w-7/12 bg-[#ECE4D8] flex items-center justify-center px-4 py-3.5 sm:p-6 md:border-r md:border-[#d4c3bb]/50 overflow-hidden touch-pan-y"
              >
                {/* Soft Ambient Photo Halo — Replaces Harsh Dark Sidebars */}
                <Image
                  key={`${activePhoto.src}-ambient`}
                  src={activePhoto.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 520px"
                  aria-hidden="true"
                  className="object-cover scale-110 blur-2xl opacity-30 saturate-125 pointer-events-none select-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/35 via-[#ECE4D8]/25 to-[#311908]/12 pointer-events-none"
                />

                <div className="relative z-10 w-full h-[43dvh] min-h-[240px] max-h-[410px] sm:h-[52dvh] sm:max-h-[480px] md:h-[70vh] md:max-h-[600px] flex items-center justify-center">
                  <div
                    style={{ aspectRatio: `${activePhoto.width} / ${activePhoto.height}` }}
                    className={`relative overflow-hidden rounded-2xl bg-[#E4DBD0] shadow-[0_14px_38px_rgba(49,25,8,0.22)] ring-1 ring-[#311908]/12 ${
                      isPortraitOrSquare ? "h-full max-w-full" : "w-full max-h-full"
                    }`}
                  >
                    <Image
                      key={activePhoto.src}
                      src={activePhoto.src}
                      alt={isEn ? activePhoto.titleEn : activePhoto.titleId}
                      fill
                      sizes="(max-width: 768px) 84vw, 520px"
                      className="object-contain select-none"
                      priority
                    />
                  </div>
                </div>

                {/* Desktop Prev / Next Controls */}
                <button
                  type="button"
                  onClick={showPrev}
                  className="hidden md:flex absolute z-20 left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/92 hover:bg-white border border-[#d4c3bb]/60 text-[#311908] items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                  aria-label={isEn ? "Previous photo" : "Foto sebelumnya"}
                >
                  <LightboxArrowIcon direction="prev" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="hidden md:flex absolute z-20 right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/92 hover:bg-white border border-[#d4c3bb]/60 text-[#311908] items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                  aria-label={isEn ? "Next photo" : "Foto berikutnya"}
                >
                  <LightboxArrowIcon direction="next" />
                </button>
              </div>

              {/* Mobile Navigation Strip — Thumb-Friendly & Always Visible Below Photo */}
              <div className="md:hidden shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 bg-[#FAF7F2] border-y border-[#d4c3bb]/45">
                <button
                  type="button"
                  onClick={showPrev}
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F2EDE4] border border-[#d4c3bb]/80 text-[#311908] flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
                  aria-label={isEn ? "Previous photo" : "Foto sebelumnya"}
                >
                  <LightboxArrowIcon direction="prev" />
                </button>

                {paginationDots}

                <button
                  type="button"
                  onClick={showNext}
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F2EDE4] border border-[#d4c3bb]/80 text-[#311908] flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
                  aria-label={isEn ? "Next photo" : "Foto berikutnya"}
                >
                  <LightboxArrowIcon direction="next" />
                </button>
              </div>

              {/* Right / Bottom: Documentation Story & Attribution */}
              <div className="md:w-5/12 px-4 pt-3.5 pb-5 sm:p-7 flex flex-col justify-between md:overflow-y-auto">
                <div>
                  {renderCounterBadge("hidden md:inline-flex")}

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-normal text-[#1c1c19] md:mt-3 leading-snug">
                    {isEn ? activePhoto.titleEn : activePhoto.titleId}
                  </h3>

                  <div className="h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#d4c3bb]/60 to-transparent my-2.5 sm:my-4" />

                  <p className="text-[13px] sm:text-sm text-[#50443e] font-sans font-light leading-relaxed">
                    {isEn ? activePhoto.captionEn : activePhoto.captionId}
                  </p>

                  {/* Partner Logos Attribution inside Lightbox */}
                  <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#d4c3bb]/50">
                    <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#8C7D73] block mb-2.5">
                      {isEn ? "Official Bazaar Event" : "Gelaran Resmi"}
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      {PMW_PARTNERS.map((partner) => (
                        <div
                          key={partner.id}
                          className={`rounded-lg bg-white border border-[#d4c3bb]/60 flex items-center justify-center overflow-hidden ${
                            partner.id === "pmw-polines"
                              ? "w-20 h-10 px-1.5 py-1"
                              : "w-10 h-10 p-1"
                          }`}
                        >
                          <Image
                            src={partner.src}
                            alt={partner.name}
                            width={partner.width}
                            height={partner.height}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                      <div className="text-[11px] text-[#50443e] leading-tight">
                        <strong className="font-semibold text-[#311908] block">
                          PMW Polines
                        </strong>
                        <span>Politeknik Negeri Semarang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Thumbnail Strip Dots */}
                <div className="hidden md:flex pt-5 mt-6 border-t border-[#d4c3bb]/50 items-center justify-between gap-3">
                  {paginationDots}
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7D73] font-medium">
                    {isEn ? "SEKARANTI Debut" : "Bazar Perdana"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
