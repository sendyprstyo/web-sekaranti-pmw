'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Collection,
  PRODUCT_FINISHING,
  PRODUCT_MATERIAL,
  PRODUCT_PRICE_LABEL,
  PRODUCT_ORIGINAL_PRICE_LABEL,
  PRODUCT_SIZE,
  INSTAGRAM_URL,
  TIKTOK_URL,
  SHOPEE_URL,
  TOKOPEDIA_URL,
  whatsappCodHref,
  getCollections,
} from "../lib/collections";
import { useLanguage } from "../lib/language-context";

export default function CollectionDetailContent({
  collection,
}: {
  collection: Collection;
}) {
  const { lang } = useLanguage();
  const allCollections = getCollections();

  const [activeTab, setActiveTab] = useState<'desc' | 'size' | 'care'>('desc');
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  // Listen to Escape key to close modal / lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImg(null);
        setSizeModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // The 4 similar products in "PRODUK SERUPA"
  const similarProducts = allCollections;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1c1c19] pt-24 pb-20">
      {/* ====================================================
          1. BREADCRUMBS (Matches exact URL structure)
             /collections/[slug] -> HOME / COLLECTIONS / [COLLECTION NAME]
          ==================================================== */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-sans text-[#8C7D73] flex items-center gap-2 overflow-x-auto scrollbar-none"
      >
        <Link href="/" className="hover:text-[#311908] transition-colors whitespace-nowrap">
          {lang === 'en' ? 'HOME' : 'BERANDA'}
        </Link>
        <span>/</span>
        <Link
          href="/#collections"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("scroll_to_hash", "collections");
            }
          }}
          className="hover:text-[#311908] transition-colors whitespace-nowrap"
        >
          {lang === 'en' ? 'COLLECTIONS' : 'KOLEKSI'}
        </Link>
        <span>/</span>
        <span className="text-[#311908] font-bold whitespace-nowrap">
          {collection.name.toUpperCase()}
        </span>
      </nav>

      {/* ====================================================
          2. MAIN PRODUCT DETAIL LAYOUT (2 Columns)
             Left: 2-Col Gallery Grid of Large Images
             Right: Sticky Purchase & Specs Panel
          ==================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* --------------------------------------------------
              LEFT COLUMN: 2-COLUMN EDITORIAL GALLERY GRID
              -------------------------------------------------- */}
          <section
            aria-label="Galeri Foto Produk"
            className="lg:col-span-7 flex flex-col gap-4 sm:gap-6"
          >
            {/* Gallery Grid (2 columns on tablet/desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              {collection.gallery.map((img, idx) => (
                <div
                  key={img.src}
                  onClick={() => setLightboxImg(img)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#eee5de] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#d4c3bb]/40 ${
                    idx === 0
                      ? "sm:col-span-2 aspect-[4/4.5] sm:aspect-[16/11]"
                      : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Top Badge for image label */}
                  {img.label && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-[#1F1D1A]/85 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-sans font-semibold shadow-xs">
                      {img.label}
                    </div>
                  )}

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 bg-[#311908]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-[#311908] text-[10px] uppercase tracking-wider font-bold shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-[#d4c3bb]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      {lang === 'en' ? 'Click to Enlarge' : 'Klik untuk Memperbesar'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------
              RIGHT COLUMN: STICKY PURCHASE & SPECS PANEL
              -------------------------------------------------- */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col space-y-6">
            
            {/* 1. Header Information */}
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.24em] font-sans font-semibold text-[#8C7D73] block mb-1.5">
                {lang === 'en' ? 'SQUARE HIJAB' : collection.tag} · SEKARANTI
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-[#1c1c19] tracking-tight uppercase">
                {collection.name}
              </h1>

              {collection.alias && (
                <p className="text-xs sm:text-sm font-serif italic text-[#9a4152] mt-0.5">
                  ({collection.alias})
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3.5">
                <span className="text-2xl sm:text-3xl font-sans font-bold text-[#1c1c19]">
                  {PRODUCT_PRICE_LABEL}
                </span>
                {PRODUCT_ORIGINAL_PRICE_LABEL && (
                  <span className="text-sm font-sans text-[#8C7D73] line-through">
                    {PRODUCT_ORIGINAL_PRICE_LABEL}
                  </span>
                )}
                {collection.discount && (
                  <span className="px-2 py-0.5 rounded-full bg-[#6B1D2F] text-white text-[10px] font-sans font-bold tracking-wider">
                    {collection.discount}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Story & Cultural Philosophy (Direct from BATIK SEKARANTI.pdf) */}
            <div className="space-y-3 pt-1 border-t border-[#d4c3bb]/50 text-xs sm:text-[13px] text-[#50443e] font-sans font-light leading-relaxed">
              <p className="font-normal text-[#311908]">
                {lang === 'en' ? collection.philosophyStoryEn : collection.philosophyStory}
              </p>

              {/* PDF Philosophy Points */}
              <div className="space-y-1.5 pl-3 border-l-2 border-[#D4AF37]/70 py-0.5 italic">
                {(lang === 'en' ? collection.philosophyPointsEn : collection.philosophyPoints).map((point, idx) => (
                  <p key={idx} className="text-[12px] text-[#4A2E1B]">
                    • {point}
                  </p>
                ))}
              </div>
            </div>

            {/* 3. Panduan Ukuran Trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setSizeModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#311908] hover:text-[#9a4152] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#8C7D73]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M21.3 8.7 8.7 21.3c-.4.4-1 .4-1.4 0l-6-6c-.4-.4-.4-1 0-1.4L13.9 1.3c.4-.4 1-.4 1.4 0l6 6c.4.4.4 1 0 1.4Z" />
                  <path d="m14.5 4.5 2 2" />
                  <path d="m11.5 7.5 1 1" />
                  <path d="m8.5 10.5 2 2" />
                  <path d="m5.5 13.5 1 1" />
                </svg>
                <span className="underline underline-offset-4">
                  {lang === 'en' ? 'SIZE GUIDE' : 'PANDUAN UKURAN'}
                </span>
              </button>
            </div>

            {/* 4. Variant / Collection Switcher Pills */}
            <div className="pt-1">
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#8C7D73] block mb-2.5">
                {lang === 'en' ? 'SELECT MOTIF / COLOR' : 'PILIH WARNA / KOLEKSI'}
              </span>
              <div className="flex flex-wrap gap-2">
                {allCollections.map((col) => {
                  const isActive = col.slug === collection.slug;
                  return (
                    <Link
                      key={col.slug}
                      href={`/collections/${col.slug}`}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans tracking-wide transition-all duration-200 border ${
                        isActive
                          ? "bg-[#1F1D1A] !text-white border-[#1F1D1A] shadow-md font-semibold"
                          : "bg-white text-[#311908] border-[#d4c3bb]/70 hover:border-[#311908] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: col.colorSwatch }}
                      />
                      <span>{col.name.toUpperCase()}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 5. E-COMMERCE PURCHASE BUTTONS (Shopee, Tokopedia & COD) */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C7D73] block">
                  {lang === 'en' ? 'ORDER VIA OFFICIAL STORE' : 'PILIH SALURAN PEMBELIAN RESMI'}
                </span>
                <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[#6B1D2F] bg-[#6B1D2F]/5 px-2 py-0.5 rounded-full border border-[#6B1D2F]/15">
                  100% Original
                </span>
              </div>

              {/* Shopee Button */}
              <a
                href={SHOPEE_URL}
                target="_blank"
                rel="noreferrer"
                className="group w-full p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-[#FFFBF9] border border-[#d4c3bb]/80 hover:border-[#EE4D2D]/60 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EBE3DC] p-1 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:border-[#EE4D2D]/40 transition-colors">
                    <Image
                      src="/assets/image-pendukung/logoshoppe.jpg"
                      alt="Shopee"
                      width={44}
                      height={44}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[#1c1c19] group-hover:text-[#EE4D2D] transition-colors leading-tight">
                        {lang === 'en' ? 'BUY ON SHOPEE' : 'BELI DI SHOPEE'}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#EE4D2D]/10 text-[#EE4D2D] leading-none">
                        Official Store
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8C7D73] font-sans truncate block mt-0.5">
                      {lang === 'en' ? 'SEKARANTI Official Store • Free Shipping' : 'SEKARANTI Official Store • Gratis Ongkir'}
                    </span>
                  </div>
                </div>
              </a>

              {/* Tokopedia Button */}
              <a
                href={TOKOPEDIA_URL}
                target="_blank"
                rel="noreferrer"
                className="group w-full p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-[#F9FCF9] border border-[#d4c3bb]/80 hover:border-[#03AC0E]/60 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EBE3DC] p-1 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:border-[#03AC0E]/40 transition-colors">
                    <Image
                      src="/assets/image-pendukung/logotokopedia.jpg"
                      alt="Tokopedia"
                      width={44}
                      height={44}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[#1c1c19] group-hover:text-[#03AC0E] transition-colors leading-tight">
                        {lang === 'en' ? 'BUY ON TOKOPEDIA' : 'BELI DI TOKOPEDIA'}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#03AC0E]/10 text-[#03AC0E] leading-none">
                        Official Store
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8C7D73] font-sans truncate block mt-0.5">
                      {lang === 'en' ? 'SEKARANTI Official Store • Free Shipping' : 'SEKARANTI Official Store • Bebas Ongkir'}
                    </span>
                  </div>
                </div>

              </a>

              {/* COD Khusus Kota Semarang Button */}
              <a
                href={whatsappCodHref(collection.name)}
                target="_blank"
                rel="noreferrer"
                className="group w-full p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#d4c3bb]/80 hover:border-[#311908]/60 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#EBE3DC] flex items-center justify-center flex-shrink-0 text-[#311908] shadow-2xs group-hover:bg-[#311908] group-hover:text-white group-hover:border-[#311908] transition-all">
                    <svg className="w-5 h-5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="1" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[#1c1c19] group-hover:text-[#311908] transition-colors leading-tight">
                        {lang === 'en' ? 'COD SEMARANG CITY' : 'COD KOTA SEMARANG'}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#311908]/10 text-[#311908] leading-none">
                        Via WhatsApp
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8C7D73] font-sans truncate block mt-0.5">
                      {lang === 'en' ? 'Pay on delivery after WhatsApp confirmation' : 'Bayar langsung di tempat saat pesanan tiba'}
                    </span>
                  </div>
                </div>

              </a>
            </div>

            {/* 6. SOCIAL MEDIA CHANNELS (Instagram & TikTok) */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C7D73] block mb-2">
                {lang === 'en' ? 'OFFICIAL INFORMATION & CONTENT' : 'INFORMASI & KONTEN RESMI'}
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Instagram */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-[#d4c3bb]/70 hover:border-[#E1306C] flex items-center gap-2.5 transition-all duration-200 group shadow-2xs hover:shadow-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#1c1c19] block leading-tight group-hover:text-[#E1306C] transition-colors">
                      Instagram
                    </span>
                    <span className="text-[10px] text-[#8C7D73] font-sans">
                      @sekarantii.id
                    </span>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-[#d4c3bb]/70 hover:border-black flex items-center gap-2.5 transition-all duration-200 group shadow-2xs hover:shadow-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.95-4.52V8.06a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95.51z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#1c1c19] block leading-tight group-hover:text-black transition-colors">
                      TikTok
                    </span>
                    <span className="text-[10px] text-[#8C7D73] font-sans">
                      @sekarantii.id
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* 7. Information Tabs (Deskripsi, Ukuran, Bahan & Perawatan) */}
            <div className="pt-2 border-t border-[#d4c3bb]/50">
              <div className="flex border-b border-[#d4c3bb]/60 gap-4 sm:gap-6 text-xs font-sans uppercase tracking-[0.16em]">
                <button
                  type="button"
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'desc'
                      ? "text-[#1c1c19] font-bold"
                      : "text-[#8C7D73] hover:text-[#1c1c19]"
                  }`}
                >
                  {lang === 'en' ? 'Product Description' : 'Deskripsi Produk'}
                  {activeTab === 'desc' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1c1c19]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('size')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'size'
                      ? "text-[#1c1c19] font-bold"
                      : "text-[#8C7D73] hover:text-[#1c1c19]"
                  }`}
                >
                  {lang === 'en' ? 'Size Guide' : 'Panduan Ukuran'}
                  {activeTab === 'size' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1c1c19]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'care'
                      ? "text-[#1c1c19] font-bold"
                      : "text-[#8C7D73] hover:text-[#1c1c19]"
                  }`}
                >
                  {lang === 'en' ? 'Material & Care' : 'Bahan & Perawatan'}
                  {activeTab === 'care' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1c1c19]" />
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-4 text-xs sm:text-[12.5px] text-[#50443e] font-sans leading-relaxed">
                {activeTab === 'desc' && (
                  <div className="space-y-3">
                    <p>
                      <strong>{collection.name}</strong> — {lang === 'en' ? (collection.visualDescriptionEn || collection.visualDescription) : collection.visualDescription}
                    </p>
                    <ul className="space-y-1.5 list-disc pl-4 text-[#50443e]">
                      <li><strong>{lang === 'en' ? 'Material:' : 'Material:'}</strong> {PRODUCT_MATERIAL} {lang === 'en' ? '(cool, elegant drape, luxurious matte sheen).' : '(adem, jatuh anggun, kilau matte mewah).'}</li>
                      <li><strong>{lang === 'en' ? 'Dimensions:' : 'Dimensi:'}</strong> {PRODUCT_SIZE} {lang === 'en' ? '(precise square, holds shape at the crown).' : '(persegi presisi, mudah tegak di dahi).'}</li>
                      <li><strong>Finishing:</strong> {lang === 'en' ? 'Neat and durable edge stitching.' : `${PRODUCT_FINISHING}.`}</li>
                      <li><strong>{lang === 'en' ? 'Characteristics:' : 'Karakteristik:'}</strong> {lang === 'en' ? 'Lightweight, non-slip, comfortable all day.' : 'Tidak panas, tidak licin, tidak berdengung di telinga.'}</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'size' && (
                  <div className="space-y-3">
                    <p>
                      <strong>{lang === 'en' ? 'Standard Square Size:' : 'Ukuran Standar Segiempat:'}</strong> 110 cm × 110 cm.
                    </p>
                    <p>
                      {lang === 'en'
                        ? "This size is ideal for a neat daily look, full draping coverage over the chest, or a clean modern wrap style."
                        : "Ukuran ini dirancang ideal untuk styling harian rapi, drapery syar'i menutupi dada, maupun gaya ikat leher modern yang clean dan rapi."}
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-[#d4c3bb]/50">
                      <span className="text-[10px] uppercase font-bold text-[#8C7D73] block mb-1">
                        {lang === 'en' ? 'SIZE TOLERANCE' : 'TOLERANSI UKURAN'}
                      </span>
                      <p className="text-[11px] text-[#50443e]">
                        {lang === 'en'
                          ? 'Edge seam tolerance of approximately ±1–2 cm due to high-precision manual edge finishing.'
                          : 'Toleransi jahitan sekitar ±1-2 cm pada tepian kain karena proses pengerjaan tepi manual berpresisi tinggi.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-2 text-[#4A2E1B]">
                    <p className="text-[11.5px] italic mb-1.5 text-[#8C7D73]">
                      {lang === 'en'
                        ? 'Care instructions for Voal Ultrasoft fabric to preserve its ultra-soft texture and colour:'
                        : 'Petunjuk perawatan kain Voal Ultrasoft agar serat ultra-lembut & warnanya tetap awet:'}
                    </p>
                    <p>• {lang === 'en' ? 'Wash gently by hand using cold water.' : 'Cuci lembut dengan tangan menggunakan air dingin.'}</p>
                    <p>• {lang === 'en' ? 'Use mild detergent.' : 'Gunakan deterjen berbahan lembut.'}</p>
                    <p>• {lang === 'en' ? 'Store in a dry, cool place.' : 'Simpan dengan rapi di tempat yang kering dan sejuk.'}</p>
                    <p>• {lang === 'en' ? 'Use a low heat setting when ironing.' : 'Gunakan setelan suhu rendah saat menyetrika.'}</p>
                    <p>• {lang === 'en' ? 'Dry in the shade, away from direct sunlight.' : 'Keringkan di tempat teduh, hindari terik matahari langsung.'}</p>
                  </div>
                )}
              </div>
            </div>


          </aside>
        </div>
      </main>

      {/* ====================================================
          3. SECTION: REKOMENDASI KAMI / PRODUK SERUPA
             (Muswe Exact 4 Product Cards Grid)
          ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-16 sm:mt-24 pt-16 border-t border-[#d4c3bb]/60">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10.5px] uppercase tracking-[0.26em] font-sans font-semibold text-[#8C7D73] block mb-2">
            {lang === 'en' ? 'OUR RECOMMENDATIONS' : 'REKOMENDASI KAMI'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-[0.18em] text-[#1c1c19] font-normal">
            {lang === 'en' ? 'SIMILAR PRODUCTS' : 'PRODUK SERUPA'}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {similarProducts.map((item) => (
            <div key={`rec-${item.slug}`} className="group flex flex-col relative">
              {/* Card Image */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#eee5de] shadow-sm hover:shadow-xl transition-all duration-300">
                <Link href={`/collections/${item.slug}`} className="absolute inset-0 z-0">
                  <Image
                    src={item.modelImage}
                    alt={`${item.name} dikenakan model`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    className="object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </Link>

                {/* Discount Badge (Top Left) — only shown if item has a discount */}
                {item.discount && (
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#6B1D2F] text-white text-[9px] sm:text-[10px] font-sans font-bold tracking-wider shadow-sm pointer-events-none">
                    {item.discount}
                  </div>
                )}
              </div>

              {/* Card Caption Under Image */}
              <Link
                href={`/collections/${item.slug}`}
                className="pt-3.5 pb-1 text-center flex flex-col items-center group-hover:opacity-90"
              >
                <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.2em] font-normal text-[#8C7D73]">
                  {lang === 'en' ? 'SQUARE HIJAB' : item.tag}
                </span>
                <h3 className="text-sm sm:text-base font-display text-[#1c1c19] group-hover:text-[#6B1D2F] transition-colors mt-1 font-normal">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs sm:text-sm font-semibold text-[#1c1c19]">
                    {PRODUCT_PRICE_LABEL}
                  </span>
                  {PRODUCT_ORIGINAL_PRICE_LABEL && (
                    <span className="text-[11px] text-[#8C7D73] line-through">
                      {PRODUCT_ORIGINAL_PRICE_LABEL}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>



      {/* ====================================================
          5. SIZE GUIDE MODAL (Panduan Ukuran Popover)
          ==================================================== */}
      {sizeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-modal-title"
          onClick={() => setSizeModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#d4c3bb]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Right Close Button (High contrast, clearly visible) */}
            <button
              type="button"
              onClick={() => setSizeModalOpen(false)}
              aria-label={lang === 'en' ? 'Close Size Guide' : 'Tutup Panduan Ukuran'}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#1c1c19] flex items-center justify-center border border-[#d4c3bb] shadow-sm hover:scale-105 transition-all text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C7D73] block mb-1">
              SEKARANTI SPECIFICATION
            </span>
            <h3 id="size-modal-title" className="text-xl sm:text-2xl font-display text-[#1c1c19] mb-4">
              {lang === 'en' ? 'Size Guide & Dimensions' : 'Panduan Ukuran Hijab'}
            </h3>

            {/* Illustration Box */}
            <div className="aspect-[4/3] rounded-2xl bg-white border border-[#d4c3bb]/60 flex flex-col items-center justify-center p-6 mb-4 relative">
              <div className="w-36 h-36 border-2 border-dashed border-[#D4AF37] rounded-lg flex items-center justify-center relative">
                <span className="text-xs font-display font-bold text-[#311908]">
                  110 × 110 cm
                </span>
                <span className="absolute -top-3 px-2 bg-white text-[9px] uppercase tracking-wider text-[#8C7D73]">
                  {lang === 'en' ? 'Width 110 cm' : 'Lebar 110 cm'}
                </span>
                <span className="absolute -left-7 -rotate-90 text-[9px] uppercase tracking-wider text-[#8C7D73]">
                  110 cm
                </span>
              </div>
              <span className="text-[11px] text-[#8C7D73] mt-3">
                {lang === 'en' ? 'Symmetrical Square Hijab' : 'Segiempat Persegi Simetris (Square Hijab)'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#50443e]">
              <p>• <strong>{lang === 'en' ? 'Material:' : 'Bahan:'}</strong> {lang === 'en' ? 'Voal Ultrasoft (ultra-light, soft & holds at the crown).' : 'Voal Ultrasoft (ultra-ringan, lembut & tegak di dahi).'}</p>
              <p>• <strong>Finishing:</strong> {lang === 'en' ? 'High-precision machine edge stitching, neat and durable.' : 'Jahit tepi mesin presisi tinggi, rapi, dan kokoh.'}</p>
              <p>• <strong>{lang === 'en' ? 'Comfort:' : 'Kenyamanan:'}</strong> {lang === 'en' ? 'Cool on the scalp, breathable, and non-slip.' : 'Dingin di kulit kepala, breathable, dan tidak licin.'}</p>
            </div>

            {/* Primary Action Button (White text, high contrast, clearly visible) */}
            <button
              type="button"
              onClick={() => setSizeModalOpen(false)}
              className="w-full mt-6 py-3.5 rounded-xl bg-[#1F1D1A] hover:bg-[#311908] !text-white text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer shadow-md text-center block"
            >
              {lang === 'en' ? 'UNDERSTOOD' : 'MENGERTI'}
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          6. IMAGE LIGHTBOX MODAL (Super visible close button!)
          ==================================================== */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          {/* Prominent High-Contrast Close Button in Top Right */}
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            aria-label={lang === 'en' ? 'Close Photo Preview (Escape)' : 'Tutup Preview Foto (Escape)'}
            className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-full bg-white text-[#1c1c19] hover:bg-[#FAF7F2] shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-2 border-white/80 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-base font-black leading-none">✕</span>
            <span>{lang === 'en' ? 'CLOSE (ESC)' : 'TUTUP (ESC)'}</span>
          </button>

          <div
            className="relative max-w-4xl max-h-[88vh] w-full h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-sans shadow-lg">
                {lightboxImg.alt}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
