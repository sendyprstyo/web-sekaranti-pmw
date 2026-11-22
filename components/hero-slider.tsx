'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { whatsappHref } from '../lib/collections';
import { useLanguage } from '../lib/language-context';

export interface SlideItem {
  id: string;
  slug: string;
  name: string;
  vol: string;
  description: string;
  image: string;
  motifImage: string;
  colorName: string;
  accentColor: string;
  studioBg: string;
}

const slides: SlideItem[] = [
  {
    id: '01',
    slug: 'puspa-raras',
    name: 'Puspa Raras',
    vol: '01',
    description: 'Kelembutan kelopak puspa mekar dalam rona merah muda yang teduh. Menghadirkan siluet anggun untuk setiap momen istimewa.',
    image: '/assets/design-hijab-orang/Puspa%20Raras.png',
    motifImage: '/assets/design-hijab-optimized/Puspa%20Raras.webp',
    colorName: 'Petal Blush',
    accentColor: '#9A4152',
    studioBg: '#E9DDD8',
  },
  {
    id: '02',
    slug: 'sekar-wengi',
    name: 'Sekar Wengi',
    vol: '02',
    description: 'Pesona siluet flora malam dalam balutan marun mendalam. Tegas, memikat, dan sarat akan elegansi klasik.',
    image: '/assets/design-hijab-orang/Sekar%20Wening.png',
    motifImage: '/assets/design-hijab-optimized/Sekar%20Wening.webp',
    colorName: 'Wine Burgundy',
    accentColor: '#6B1D2F',
    studioBg: '#E1D9D4',
  },
  {
    id: '03',
    slug: 'taman-sari-sekar',
    name: 'Taman Sari Sekar',
    vol: '03',
    description: 'Terinspirasi dari ketenangan taman keraton, memadukan rona mawar lembut dan segarnya dedaunan sage yang menenangkan.',
    image: '/assets/design-hijab-orang/Taman%20Sari%20Sekar.png',
    motifImage: '/assets/design-hijab-optimized/Taman%20Sari%20Sekar.webp',
    colorName: 'Rose & Sage',
    accentColor: '#735C00',
    studioBg: '#EADDD7',
  },
  {
    id: '04',
    slug: 'tirta-sekar',
    name: 'Tirta Sekar',
    vol: '04',
    description: 'Aliran motif air dan kelopak bunga dalam gradasi biru samudera. Memberi kesan sejuk, tenang, dan bersahaja.',
    image: '/assets/design-hijab-orang/Tirta%20Sekar.png',
    motifImage: '/assets/design-hijab-optimized/Tirta%20sekar.webp',
    colorName: 'Samudera Blue',
    accentColor: '#244B6E',
    studioBg: '#ECE1DC',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Otomatis ganti slide terus-menerus setiap 2 detik tanpa jeda
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];
  const slideTranslations = t.hero.slides[slide.slug as keyof typeof t.hero.slides];
  const displayDescription = slideTranslations?.description || slide.description;
  const displayColorName = slideTranslations?.colorName || slide.colorName;

  return (
    <section
      className="relative w-full min-h-[100dvh] sm:min-h-screen flex items-end lg:items-center overflow-hidden pt-20 sm:pt-28 pb-14 sm:pb-20 select-none bg-[#E9DDD8]"
      aria-label="SEKARANTI Hero Banner Slider"
    >
      {/* ============================================================
          SLIDE STACK (SETIAP SLIDE BERSIH, SATU KESATUAN WARNA UTUH)
          ============================================================ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((item, index) => {
          const isActive = current === index;
          return (
            <div
              key={`slide-bg-${item.id}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundColor: item.studioBg }}
            >
              {/* FOTO MODEL PEMAKAI HIJAB */}
              <div className="absolute inset-0 lg:left-auto lg:right-0 w-full lg:w-[58%] xl:w-[60%] h-full flex justify-center lg:justify-end items-start lg:items-end pointer-events-none">
                <div className="relative w-full h-full max-w-none lg:max-w-[760px] flex items-start lg:items-end justify-center lg:justify-end">
                  <Image
                    src={item.image}
                    alt={`${item.name} dikenakan model`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-[center_top] lg:object-contain lg:object-right-bottom"
                  />
                </div>
              </div>

              {/* Mobile veil gradient */}
              <div
                className="absolute inset-x-0 bottom-0 h-[60vh] sm:h-[50vh] pointer-events-none lg:hidden"
                style={{
                  background: `linear-gradient(to top, ${item.studioBg} 38%, ${item.studioBg}F0 65%, ${item.studioBg}66 88%, transparent 100%)`,
                }}
              />

              {/* Gradien bawah tipis */}
              <div
                className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${item.studioBg}, transparent)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ============================================================
          KONTEN KIRI — Clean Editorial Fashion (Bilingual)
          ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-16 flex flex-col items-start justify-end lg:justify-center">
        <div className="max-w-xl space-y-3 sm:space-y-4 lg:space-y-5 pt-[42vh] sm:pt-[48vh] lg:pt-0">
          
          {/* Eyebrow Editorial Bersih */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] font-sans tracking-[0.24em] uppercase text-[#8C7D73] font-medium">
            <span>{t.hero.volPrefix} {slide.vol}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span className="text-[#311908] font-semibold tracking-[0.18em]">{displayColorName}</span>
          </div>

          {/* Judul Koleksi Playfair Display Anggun */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-light text-[#1c1c19] tracking-tight leading-[1.06]">
            {slide.name}
          </h1>

          {/* Deskripsi Alami & Puitis Kurasi Desainer (Bilingual) */}
          <p className="text-sm sm:text-base font-sans font-light text-[#4a3b32] leading-relaxed max-w-lg">
            {displayDescription}
          </p>

          {/* CTA Actions Editorial */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              href="#collections"
              onClick={(e) => {
                const el = document.getElementById('collections');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '#collections');
                }
              }}
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs sm:text-sm font-sans uppercase tracking-[0.18em] font-semibold shadow-[0_8px_20px_rgba(49,25,8,0.18)] hover:shadow-[0_12px_28px_rgba(49,25,8,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer border border-[#D4AF37]/30"
            >
              {t.hero.exploreCta}
            </a>

            <Link
              href={`/products/${slide.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans tracking-[0.12em] font-medium text-[#311908] hover:text-[#6B1D2F] py-2 px-2 transition-colors group"
            >
              <span>{t.hero.viewDetail}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          KONTROL SLIDER & INDIKATOR EDITORIAL
          ============================================================ */}
      {/* Indikator Garis di Kiri Bawah */}
      <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-10 lg:left-16 z-20 flex items-center gap-2">
        {slides.map((item, index) => (
          <button
            key={`indicator-${item.id}`}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${item.name}`}
            className={`h-1 transition-all duration-500 rounded-full cursor-pointer ${
              current === index
                ? 'w-8 bg-[#311908]'
                : 'w-2.5 bg-[#311908]/20 hover:bg-[#311908]/50'
            }`}
          />
        ))}
      </div>

      {/* Counter & Tombol Arrow Bersih di Kanan Bawah */}
      <div className="absolute right-20 sm:right-24 lg:right-28 bottom-4 sm:bottom-6 z-20 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs tracking-widest font-sans font-medium text-[#8C7D73]">
          <span className="font-display font-semibold text-[#311908]">{slide.id}</span>
          <span>/</span>
          <span>0{slides.length}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label={t.hero.prevSlide}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#311908] border border-[#d4c3bb]/60 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label={t.hero.nextSlide}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#311908] border border-[#d4c3bb]/60 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>


    </section>
  );
}
