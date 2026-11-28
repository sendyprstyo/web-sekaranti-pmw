'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeroSlider from "../components/hero-slider";
import PmwBazaarSection from "../components/pmw-bazaar-section";
import {
  Collection,
  getCollections,
  PRODUCT_FINISHING,
  PRODUCT_MATERIAL,
  PRODUCT_PRICE_LABEL,
  PRODUCT_SIZE,
  whatsappHref,
  INSTAGRAM_URL,
  TIKTOK_URL,
  SHOPEE_URL,
  TOKOPEDIA_URL,
} from "../lib/collections";
import { useLanguage } from "../lib/language-context";

const collections = getCollections();
const storyCollection = collections[0]; // Puspa Raras

const collectionDescriptionsEn: Record<string, string> = {
  "puspa-raras": "Floral motifs in serene soft blush pink.",
  "sekar-wengi": "Floral motifs in rich, royal wine burgundy.",
  "taman-sari-sekar": "Harmonious floral motifs in rose and sage green.",
  "tirta-sekar": "Flowing floral motifs in oceanic blue hues.",
};

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const { lang, t } = useLanguage();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [inspectPattern, setInspectPattern] = useState<Collection | null>(null);
  const [zoomArtwork, setZoomArtwork] = useState(false);

  useEffect(() => {
    if (inspectPattern) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setInspectPattern(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
      setZoomArtwork(false);
    }
  }, [inspectPattern]);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================
          HERO SLIDER — Clean Editorial Carousel
          ============================================ */}
      <HeroSlider />

      {/* ============================================
          BRAND ETHOS STRIP (Infinite Scrolling Marquee)
          ============================================ */}
      <div className="w-full bg-[#FAF7F2] border-y border-[#d4c3bb]/45 py-3 sm:py-3.5 overflow-hidden select-none">
        <div className="animate-marquee flex items-center min-w-max text-[10.5px] sm:text-xs font-sans uppercase tracking-[0.22em] font-semibold text-[#311908]">
          {/* Track 1 */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-12 pr-6 sm:pr-10 lg:pr-12">
            {[t.promise.item1, t.promise.item2, t.promise.item3, t.promise.item4, t.promise.item5, t.promise.item1, t.promise.item2, t.promise.item3, t.promise.item4, t.promise.item5].map((item, idx) => (
              <span key={`ethos-1-${idx}`} className="inline-flex items-center gap-6 sm:gap-10 lg:gap-12">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                  <span>{item}</span>
                </span>
                <span className="text-[#D4AF37] text-[10px] flex-shrink-0">✦</span>
              </span>
            ))}
          </div>

          {/* Track 2 (Clone for infinite seamless loop) */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-12 pr-6 sm:pr-10 lg:pr-12" aria-hidden="true">
            {[t.promise.item1, t.promise.item2, t.promise.item3, t.promise.item4, t.promise.item5, t.promise.item1, t.promise.item2, t.promise.item3, t.promise.item4, t.promise.item5].map((item, idx) => (
              <span key={`ethos-2-${idx}`} className="inline-flex items-center gap-6 sm:gap-10 lg:gap-12">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                  <span>{item}</span>
                </span>
                <span className="text-[#D4AF37] text-[10px] flex-shrink-0">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          FEATURED PRODUCTS (Muswe-Inspired Modern Catalog)
          ============================================ */}
      <section id="collections" className="scroll-mt-20 pt-5 sm:pt-7 pb-14 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Centered Boutique Header like Muswe */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display uppercase tracking-[0.2em] text-[#1c1c19] font-normal">
            {t.collections.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#8C7D73] font-sans font-light mt-1.5 max-w-md mx-auto leading-relaxed">
            {t.collections.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid — Modern Fashion Catalog (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {collections.map((item, index) => {
            const visualDesc = lang === 'en' ? (collectionDescriptionsEn[item.slug] || item.visualDescription) : item.visualDescription;
            const isFav = favorites.includes(item.slug);

            return (
              <div
                key={item.slug}
                className="group flex flex-col relative"
              >
                {/* Image Container — Refined Aspect Ratio (4:5) for perfect full viewport fit */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#eee5de] shadow-sm hover:shadow-xl transition-all duration-300">
                  <Link href={`/collections/${item.slug}`} className="absolute inset-0 z-0">
                    <Image
                      src={item.modelImage}
                      alt={`${item.name} — ${visualDesc}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      className="object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  {/* Volume / Tag Badge (Top Left) */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#6B1D2F] text-white text-[9px] sm:text-[10px] font-sans font-bold tracking-wider shadow-sm pointer-events-none">
                    VOL. 0{index + 1}
                  </div>

                  {/* Wishlist Heart Button (Top Right) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item.slug);
                    }}
                    className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 hover:bg-white text-[#311908] backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm cursor-pointer"
                    aria-label={`Favorite ${item.name}`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                        isFav
                          ? 'fill-[#9a4152] text-[#9a4152]'
                          : 'fill-none stroke-current'
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>

                  {/* Hover Quick Action — Muswe Exact Style Frosted Glass Bar */}
                  <div className="absolute inset-x-0 bottom-0 h-11 sm:h-12 bg-white/75 hover:bg-white/90 backdrop-blur-md border-t border-white/60 flex items-center justify-center transition-all duration-300 ease-out z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
                    <span className="font-display uppercase tracking-[0.22em] text-[#1c1c19] text-xs sm:text-[13px] font-normal select-none">
                      {t.collections.quickView}
                    </span>
                  </div>
                </div>

                {/* Card Caption Under Image (Muswe Style) */}
                <Link
                  href={`/collections/${item.slug}`}
                  className="pt-3.5 pb-1 text-center flex flex-col items-center group-hover:opacity-90"
                >
                  <span className="text-[11px] sm:text-[12px] font-serif uppercase tracking-[0.2em] font-normal text-[#8C7D73]">
                    {t.collections.categoryTag}
                  </span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-display text-[#1c1c19] group-hover:text-[#6B1D2F] transition-colors mt-1 font-normal">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-semibold text-[#1c1c19]">
                      {PRODUCT_PRICE_LABEL}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Centered Bottom Action Button — Open PO Batch 1 */}
        <div className="mt-10 sm:mt-14 flex justify-center">
          <Link
            href="/open-po"
            className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#1F1D1A] hover:bg-[#311908] !text-white text-[11px] sm:text-xs font-sans uppercase tracking-[0.22em] font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer border border-[#D4AF37]/30"
          >
            <span>{t.collections.viewAllBtn}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================
          TENTANG KAMI — Muswe-Inspired Editorial Section
          ============================================ */}
      <section id="tentang-kami" className="scroll-mt-20">

        {/* ── PART 1: Full-width Hero Narasi (Muswe: big type, clean, white) ── */}
        <div className="border-t border-[#d4c3bb]/40 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left label col */}
              <div className="lg:col-span-4 flex flex-col gap-3 lg:pt-2">
                <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#8C7D73]">
                  {lang === 'en' ? '— The Story of SEKARANTI' : '— Tentang SEKARANTI'}
                </span>
                <div className="w-8 h-px bg-[#D4AF37]" />
                {/* Model image — stacked below label on desktop */}
                <div className="relative aspect-[3/4] w-full max-w-[260px] mt-4 rounded-2xl overflow-hidden border border-[#d4c3bb]/60 shadow-lg hidden lg:block">
                  <Image
                    src={storyCollection.modelImage}
                    alt="SEKARANTI dikenakan model"
                    fill
                    sizes="260px"
                    className="object-cover object-[center_15%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c19]/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] text-white/90 font-sans tracking-widest uppercase">{storyCollection.name}</span>
                </div>
              </div>

              {/* Right: big editorial copy */}
              <div className="lg:col-span-8">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1c1c19] leading-[1.08] tracking-tight">
                  {lang === 'en' ? (
                    <>Beauty in every <em className="text-[#9a4152] italic font-serif">pattern,</em><br />elegance in every <em className="text-[#9a4152] italic font-serif">moment.</em></>
                  ) : (
                    <>Keindahan dalam setiap <em className="text-[#9a4152] italic font-serif">motif,</em><br />keanggunan dalam setiap <em className="text-[#9a4152] italic font-serif">momen.</em></>
                  )}
                </h2>

                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t border-[#d4c3bb]/50 pt-8">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73] block mb-2">
                      {lang === 'en' ? 'Our Story' : 'Kisah Kami'}
                    </span>
                    <p className="text-sm text-[#50443e] font-sans font-light leading-relaxed">
                      {lang === 'en'
                        ? 'SEKARANTI is a premium printed hijab brand from Semarang, Central Java. Born from a deep appreciation for Indonesian batik art, every pattern is a story woven with artistic precision and cultural pride.'
                        : 'SEKARANTI adalah brand hijab premium printing dari Semarang, Jawa Tengah. Lahir dari kecintaan mendalam pada seni batik nusantara, setiap motif adalah kisah yang dirajut dengan presisi artistik dan kebanggaan budaya.'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73] block mb-2">
                      {lang === 'en' ? 'Our Vision' : 'Visi Kami'}
                    </span>
                    <p className="text-sm text-[#50443e] font-sans font-light leading-relaxed">
                      {lang === 'en'
                        ? 'To present hijabs that are more than a covering — a meaningful expression of art and elegance, crafted with Voal Ultrasoft for the modern Indonesian woman.'
                        : 'Menghadirkan hijab yang lebih dari sekadar penutup kepala — sebuah ekspresi seni dan keanggunan yang bermakna, dari bahan Voal Ultrasoft untuk perempuan Indonesia modern.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ── PATTERN SHOWCASE: Motif Bergerak ── */}
        <div className="py-16 sm:py-20 bg-[#F2EDE4]/60 border-y border-[#d4c3bb]/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-10 sm:mb-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73] block mb-2">
                {t.patterns.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-[#1c1c19] tracking-tight">
                {t.patterns.title} <span className="text-[#9a4152] italic font-serif">{t.patterns.titleHighlight}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#50443e] mt-2.5 font-light leading-relaxed">
                {t.patterns.subtitle}
              </p>
            </div>
          </div>

          {/* Infinite Moving Pattern Gallery Track */}
          <div className="relative w-full overflow-hidden select-none py-2">
            <div className="absolute left-0 inset-y-0 w-8 sm:w-24 bg-gradient-to-r from-[#F2EDE4] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 sm:w-24 bg-gradient-to-l from-[#F2EDE4] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-gallery flex items-center">
              {/* Track 1 */}
              <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
                {[...collections, ...collections].map((item, idx) => (
                  <div
                    key={`pattern-track1-${item.slug}-${idx}`}
                    onClick={() => setInspectPattern(item)}
                    className="group w-[240px] sm:w-[280px] lg:w-[305px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-[#d4c3bb]/60 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
                      <Image
                        src={item.flatArtworkImage}
                        alt={`Artwork desain ${item.name}`}
                        fill
                        sizes="(max-width: 640px) 240px, 310px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-3.5 text-center bg-white border-t border-[#f0ede9]">
                      <h4 className="text-sm font-display font-bold text-[#1c1c19] group-hover:text-[#9a4152] transition-colors">{item.name}</h4>
                      <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-[#8C7D73] font-sans">
                        <span className="w-2 h-2 rounded-full border border-black/10 inline-block flex-shrink-0" style={{ backgroundColor: item.colorSwatch }} />
                        <span className="truncate">{item.colorName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Track 2 (Clone) */}
              <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7" aria-hidden="true">
                {[...collections, ...collections].map((item, idx) => (
                  <div
                    key={`pattern-track2-${item.slug}-${idx}`}
                    onClick={() => setInspectPattern(item)}
                    className="group w-[240px] sm:w-[280px] lg:w-[305px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-[#d4c3bb]/60 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
                      <Image
                        src={item.flatArtworkImage}
                        alt={`Artwork desain ${item.name}`}
                        fill
                        sizes="(max-width: 640px) 240px, 310px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-3.5 text-center bg-white border-t border-[#f0ede9]">
                      <h4 className="text-sm font-display font-bold text-[#1c1c19] group-hover:text-[#9a4152] transition-colors">{item.name}</h4>
                      <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-[#8C7D73] font-sans">
                        <span className="w-2 h-2 rounded-full border border-black/10 inline-block flex-shrink-0" style={{ backgroundColor: item.colorSwatch }} />
                        <span className="truncate">{item.colorName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* ── PART 3: Quality Cards — Muswe style: label + bold title + desc ── */}
        <div className="bg-white border-b border-[#d4c3bb]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#d4c3bb]/40">
              {/* Kualitas Bahan */}
              <div className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73]">
                  {lang === 'en' ? 'QUALITY' : 'KUALITAS'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#1c1c19] font-normal leading-tight">
                  {lang === 'en' ? 'Voal Ultrasoft Premium' : 'Bahan Voal Ultrasoft Premium'}
                </h3>
                <p className="text-xs text-[#50443e] font-sans font-light leading-relaxed">
                  {lang === 'en'
                    ? 'We select the finest Voal Ultrasoft for its featherlight feel, breathability, and natural drape. It holds beautifully at the crown, stays cool all day, and never shows through.'
                    : 'Kami memilih Voal Ultrasoft terbaik karena teksturnya yang sangat ringan, adem di kulit, dan jatuh natural yang elegan. Tegak di dahi, nyaman sepanjang hari, dan tidak menerawang.'
                  }
                </p>
              </div>

              {/* Craftsmanship */}
              <div className="py-8 md:py-0 md:px-10 flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73]">
                  {lang === 'en' ? 'CRAFTSMANSHIP' : 'KEAHLIAN'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#1c1c19] font-normal leading-tight">
                  {lang === 'en' ? 'Boutique-Grade Finishing' : 'Finishing Standar Butik'}
                </h3>
                <p className="text-xs text-[#50443e] font-sans font-light leading-relaxed">
                  {lang === 'en'
                    ? 'Each hijab is finished with precise edge stitching. We ensure neat hemlines, accurate patterns, and durable seams — 110×110 cm of perfection in every piece.'
                    : 'Setiap hijab difinishing dengan jahitan tepi yang presisi. Kami memastikan lebar kain 110×110 cm, pola tepat, dan jahitan kuat — kesempurnaan di setiap helai.'
                  }
                </p>
              </div>

              {/* Desain */}
              <div className="py-8 md:py-0 md:px-10 last:md:pr-0 flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73]">
                  {lang === 'en' ? 'ARTISTRY' : 'SENI MOTIF'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#1c1c19] font-normal leading-tight">
                  {lang === 'en' ? 'Exclusive Illustrated Patterns' : 'Motif Ilustrasi Eksklusif'}
                </h3>
                <p className="text-xs text-[#50443e] font-sans font-light leading-relaxed">
                  {lang === 'en'
                    ? 'Inspired by Indonesian batik heritage, every SEKARANTI pattern is illustrated with high artistic precision — a harmony of color, culture, and contemporary expression.'
                    : 'Terinspirasi dari warisan batik nusantara, setiap motif SEKARANTI digambar dengan presisi artistik tinggi — harmoni warna, budaya, dan ekspresi kontemporer.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PART 4: Centered Philosophy Quote (Muswe exact) ── */}
        <div className="bg-white py-20 sm:py-28 px-4 text-center border-b border-[#d4c3bb]/40">
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1c1c19] italic leading-snug max-w-3xl mx-auto">
            {lang === 'en'
              ? '"Beauty is not just what you wear — it is the story you carry."'
              : '"Keindahan bukan sekadar yang kamu kenakan — melainkan kisah yang kamu bawa."'
            }
          </p>
          <div className="w-10 h-px bg-[#D4AF37] mx-auto my-5" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8C7D73]">
            {lang === 'en' ? '— SEKARANTI Philosophy' : '— Filosofi SEKARANTI'}
          </span>
        </div>

        {/* ── PART 5: 2-col image + koleksi narasi (alternating) ── */}
        <div className="bg-[#FAF7F2]">
          {collections.map((item, i) => (
            <div
              key={item.slug}
              className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center border-b border-[#d4c3bb]/30 last:border-0 ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Image */}
              <div className={`relative ${i % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#d4c3bb]/60 shadow-md group">
                  <Image
                    src={item.coverImage}
                    alt={`${item.name} koleksi cover`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Vol tag */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-white/90 text-[#311908] text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm">
                    VOL. 0{i + 1}
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className={`flex flex-col gap-4 ${i % 2 !== 0 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: item.colorSwatch }}
                  />
                  <span className="text-[9px] uppercase tracking-[0.26em] font-bold text-[#8C7D73]">
                    {item.colorName}
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-[#1c1c19] font-normal leading-tight">
                  {item.name}
                  <br />
                  <em className="text-[#9a4152] italic font-serif text-2xl sm:text-3xl">{item.alias}</em>
                </h3>
                <p className="text-sm text-[#50443e] font-sans font-light leading-relaxed border-t border-[#d4c3bb]/40 pt-4">
                  {lang === 'en' ? item.philosophyStoryEn : item.philosophyStory}
                </p>
                <ul className="space-y-2 mt-1">
                  {(lang === 'en' ? item.philosophyPointsEn : item.philosophyPoints).map((pt, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-[11.5px] text-[#50443e] font-sans font-light leading-snug">
                      <span className="text-[#D4AF37] mt-0.5 flex-shrink-0 text-xs">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Link
                    href={`/collections/${item.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[#311908] pb-0.5 border-b border-[#311908] hover:text-[#9a4152] hover:border-[#9a4152] transition-colors"
                  >
                    <span>{lang === 'en' ? `Explore ${item.name}` : `Lihat ${item.name}`}</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ============================================
          BAZAR PERDANA — Dokumentasi PMW Polines
          ============================================ */}
      <PmwBazaarSection variant="home" />

      {/* ============================================
          KONTAK — Redesigned Elegant Contact Section
          ============================================ */}
      <section id="contact" className="scroll-mt-20 py-20 sm:py-32 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#f2e5df] via-[#faf3ef] to-[#FAF7F2] relative overflow-hidden">

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#9a4152]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">

          {/* ── Header ── */}
          <div className="text-center mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[#311908] mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] tracking-[0.24em] uppercase font-semibold">
                {t.contact.eyebrow}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-[#1c1c19] tracking-tight leading-[1.05] mb-5">
              {t.contact.title}<br />
              <span className="text-[#9a4152] italic">{t.contact.titleHighlight}</span>
            </h2>

            <p className="text-sm sm:text-base text-[#50443e] max-w-md mx-auto font-light leading-relaxed">
              {lang === "id"
                ? "Hubungi kami langsung atau temukan koleksi terbaru di platform favoritmu."
                : "Reach us directly or find our latest collections on your favourite platform."}
            </p>
          </div>

          {/* ── Platform Cards ── */}
          <div className="flex flex-col gap-4 sm:gap-5 mb-10">

            {/* Row 1: WhatsApp — compact centered */}
            <div className="flex justify-center">
            <a
              href={`https://wa.me/6285727033141?text=${encodeURIComponent("halo sekaranti aku mau kenalanan dengan kamu")}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 px-6 py-5 rounded-3xl bg-[#311908] text-white hover:bg-[#4A2E1B] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer mx-auto"
              aria-label="Chat WhatsApp SEKARANTI"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#25D366"/>
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-0.5">{lang === 'en' ? 'Customer Service' : 'Layanan Pelanggan'}</p>
                <p className="font-display text-lg sm:text-xl font-normal text-white leading-tight">WhatsApp</p>
                <p className="text-xs text-white/70 mt-0.5 font-sans">+62 857-2703-3141</p>
              </div>
              <ArrowIcon className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>
            </div>

            {/* Row 2: IG · TikTok · Shopee · Tokopedia — 4 kolom sejajar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-white hover:bg-gradient-to-br hover:from-[#f09433]/5 hover:to-[#bc1888]/5 border border-[#d4c3bb]/60 hover:border-[#E1306C]/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram SEKARANTI"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad2)" strokeWidth="1.8" fill="none"/>
                  <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad2)" strokeWidth="1.8" fill="none"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/>
                  <defs>
                    <linearGradient id="ig-grad2" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f09433"/>
                      <stop offset="0.5" stopColor="#dc2743"/>
                      <stop offset="1" stopColor="#bc1888"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#1c1c19] group-hover:text-[#E1306C] transition-colors">Instagram</p>
                  <p className="text-[10px] text-[#8C7D73] mt-0.5">@sekarantii.id</p>
                </div>
              </a>

              {/* TikTok */}
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-white hover:bg-[#f9f9f9] border border-[#d4c3bb]/60 hover:border-[#010101]/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="TikTok SEKARANTI"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.47a8.16 8.16 0 004.78 1.52V7.54a4.85 4.85 0 01-1.01-.85z" fill="#010101"/>
                </svg>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#1c1c19] group-hover:text-[#010101] transition-colors">TikTok</p>
                  <p className="text-[10px] text-[#8C7D73] mt-0.5">@sekarantii.id</p>
                </div>
              </a>

              {/* Shopee */}
              <a
                href={SHOPEE_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-white hover:bg-[#fff5f0] border border-[#d4c3bb]/60 hover:border-[#EE4D2D]/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Shopee SEKARANTI"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src="/assets/image-pendukung/logoshoppe.jpg"
                    alt="Shopee"
                    fill
                    sizes="32px"
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#1c1c19] group-hover:text-[#EE4D2D] transition-colors">Shopee</p>
                  <p className="text-[10px] text-[#8C7D73] mt-0.5">sekarantii.id</p>
                </div>
              </a>

              {/* Tokopedia */}
              <a
                href={TOKOPEDIA_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-white hover:bg-[#f0fff4] border border-[#d4c3bb]/60 hover:border-[#42b549]/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Tokopedia SEKARANTI"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src="/assets/image-pendukung/logotokopedia.jpg"
                    alt="Tokopedia"
                    fill
                    sizes="32px"
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#1c1c19] group-hover:text-[#42b549] transition-colors">Tokopedia</p>
                  <p className="text-[10px] text-[#8C7D73] mt-0.5">sekarantii</p>
                </div>
              </a>

            </div>
          </div>

          {/* ── Divider + tagline ── */}
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
            <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73]">
              {lang === "id" ? "Kami siap membantu" : "We're here for you"}
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
          </div>



        </div>

        {/* Big subtle watermark */}
        <span className="cta-mark select-none" aria-hidden="true">S</span>
      </section>

      {/* ====================================================
          DESIGN DETAIL & ARTWORK LIGHTBOX MODAL
          ==================================================== */}
      {inspectPattern && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detail Desain Motif ${inspectPattern.name}`}
          onClick={() => setInspectPattern(null)}
          className="fixed inset-0 z-50 bg-[#1F1D1A]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 lg:p-8 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 flex flex-col md:flex-row max-h-[92vh] animate-menu-drop"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectPattern(null)}
              className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#d4c3bb]/70 flex items-center justify-center text-[#311908] hover:text-[#9a4152] transition-colors shadow-sm cursor-pointer"
              aria-label={lang === 'en' ? 'Close' : 'Tutup'}
            >
              ✕
            </button>

            {/* Left: Interactive High-Res Artwork Panel */}
            <div className="md:w-7/12 bg-[#F2EDE4]/80 p-5 sm:p-7 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#d4c3bb]/60">
              <div
                onClick={() => setZoomArtwork(!zoomArtwork)}
                className={`relative aspect-square w-full max-w-[420px] rounded-2xl overflow-hidden shadow-md border border-[#d4c3bb]/70 bg-white transition-all duration-300 ${
                  zoomArtwork ? "cursor-zoom-out ring-2 ring-[#D4AF37]" : "cursor-zoom-in"
                }`}
                title={lang === 'en' ? 'Click to zoom in' : 'Klik untuk memperbesar / zoom'}
              >
                <Image
                  src={inspectPattern.flatArtworkImage}
                  alt={`Artwork desain ${inspectPattern.name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className={`object-cover transition-transform duration-500 ease-out ${
                    zoomArtwork ? "scale-175 origin-center" : "scale-100"
                  }`}
                  priority
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10.5px] text-[#8C7D73] font-sans">
                <span>🔍</span>
                <span>{zoomArtwork ? (lang === 'en' ? 'Click again for normal size' : 'Klik kembali untuk ukuran normal') : (lang === 'en' ? 'Click image to zoom artwork details' : 'Klik gambar untuk zoom detail karya seni')}</span>
              </div>
            </div>

            {/* Right: Rich Narrative & Cultural Philosophy Panel */}
            <div className="md:w-5/12 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6B1D2F]/10 border border-[#6B1D2F]/20 text-[#6B1D2F] text-[9.5px] tracking-widest uppercase font-semibold">
                  <span>✦</span>
                  <span>{lang === 'en' ? 'EXCLUSIVE ARTWORK' : 'KARYA SENI EKSKLUSIF'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#1c1c19] mt-2 leading-tight">
                  {inspectPattern.name}
                </h3>
                <span className="text-xs text-[#8C7D73] font-serif italic block mt-0.5">
                  {inspectPattern.alias} — {inspectPattern.colorName}
                </span>

                <div className="h-px bg-gradient-to-r from-[#D4AF37]/50 via-[#d4c3bb]/60 to-transparent my-3.5" />

                {/* Cultural Philosophy Narrative */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C7D73] block mb-1">
                      {lang === 'en' ? 'PHILOSOPHY & PATTERN MEANING' : 'FILOSOFI & MAKNA MOTIF'}
                    </span>
                    <p className="text-xs text-[#311908] leading-relaxed font-sans font-light">
                      {lang === 'en' ? inspectPattern.philosophyStoryEn : inspectPattern.philosophyStory}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-1 border-t border-[#d4c3bb]/40">
                    {(lang === 'en' ? inspectPattern.philosophyPointsEn : inspectPattern.philosophyPoints).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#50443e] leading-snug">
                        <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">✦</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Specs & CTA Link */}
              <div className="pt-5 mt-5 border-t border-[#d4c3bb]/50">
                <div className="flex items-center justify-between text-[11px] text-[#8C7D73] mb-3 font-sans">
                  <span>{lang === 'en' ? 'Size:' : 'Ukuran:'} <strong className="text-[#311908] font-semibold">110 × 110 cm</strong></span>
                  <span>Finishing: <strong className="text-[#311908] font-semibold">{lang === 'en' ? 'Precision Edge Stitch' : 'Jahit Tepi Presisi'}</strong></span>
                </div>

                <Link
                  href={`/collections/${inspectPattern.slug}`}
                  onClick={() => setInspectPattern(null)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.18em] font-semibold text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="!text-white">{lang === 'en' ? 'View Full Collection & Buy' : 'Lihat Koleksi Lengkap & Beli'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
