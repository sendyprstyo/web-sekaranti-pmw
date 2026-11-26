'use client';

import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL, whatsappHref, getCollections } from "../lib/collections";
import { useLanguage } from "../lib/language-context";

export default function SiteFooter() {
  const collections = getCollections();
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#1F1D1A] text-[#FAF7F2] overflow-hidden pt-16 pb-12 border-t border-[#D4AF37]/20">
      {/* Decorative Golden Top Bevel */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent pointer-events-none" />

      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4A2E1B]/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#FAF7F2]/10">
          
          {/* Brand Info (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <Link href="/" className="flex items-center gap-3 group" aria-label="SEKARANTI — Beranda">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#D4AF37]/70 ring-offset-2 ring-offset-[#1F1D1A] shadow-[0_2px_12px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300 bg-white flex-shrink-0">
                <Image
                  src="/assets/logo-sekaranti.jpg"
                  alt="SEKARANTI Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-serif tracking-[0.22em] text-white uppercase font-bold text-xl sm:text-2xl leading-none" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                SEKARANTI
              </span>
            </Link>

            <p className="text-sm text-[#F2EDE4]/75 leading-relaxed max-w-md pt-2 font-sans font-light">
              {t.footer.brandBio}
            </p>

            {/* Semarang COD Badge & PMW Support Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#311908]/90 border border-[#D4AF37]/40 text-[#FAF7F2] text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[11px] font-medium tracking-wide">{t.footer.codBadge}</span>
              </div>
              <Link
                href="/#bazar-pmw"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("scroll_to_hash", "bazar-pmw");
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-[#F2EDE4]/90 text-[11px] font-medium tracking-wide transition-colors"
              >
                <span className="text-[#D4AF37]">✦</span>
                <span>{t.nav.bazarPmw}</span>
              </Link>
            </div>
          </div>

          {/* Koleksi Kami (Col 6-7) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              {t.footer.colMainTitle}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {collections.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/collections/${item.slug}`}
                    className="text-[#F2EDE4]/80 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200"
                  >
                    <span className="text-[10px] text-[#D4AF37]">✦</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi Cepat (Col 8-9) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              {t.footer.colLinksTitle}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("scroll_to_hash", "collections");
                    }
                  }}
                  className="text-[#F2EDE4]/80 hover:text-white transition-colors"
                >
                  {t.nav.collections}
                </Link>
              </li>
              <li>
                <Link
                  href="/#bazar-pmw"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("scroll_to_hash", "bazar-pmw");
                    }
                  }}
                  className="text-[#F2EDE4]/80 hover:text-white transition-colors"
                >
                  {t.nav.bazarPmw}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("scroll_to_hash", "contact");
                    }
                  }}
                  className="text-[#F2EDE4]/80 hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Hubungi Kami (Col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              {t.footer.colContactTitle}
            </h4>
            <div className="space-y-3">

              {/* WhatsApp — gaya card CS */}
              <a
                href={`https://wa.me/6285727033141?text=${encodeURIComponent("halo sekaranti aku mau kenalanan dengan kamu")}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#25D366]/30 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="#25D366"/>
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" fill="white"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF7F2]/50 mb-0.5">{t.footer.customerService}</p>
                  <p className="text-sm font-semibold text-white group-hover:text-[#25D366] transition-colors leading-tight">+62 857-2703-3141</p>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all flex-shrink-0" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E1306C]/30 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E1306C]/15 flex items-center justify-center group-hover:bg-[#E1306C]/25 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-footer)" strokeWidth="1.8" fill="none"/>
                    <circle cx="12" cy="12" r="4.5" stroke="url(#ig-footer)" strokeWidth="1.8" fill="none"/>
                    <circle cx="17.5" cy="6.5" r="1.1" fill="#E1306C"/>
                    <defs>
                      <linearGradient id="ig-footer" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f09433"/>
                        <stop offset="0.5" stopColor="#dc2743"/>
                        <stop offset="1" stopColor="#bc1888"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF7F2]/50 mb-0.5">{t.footer.officialInstagram}</p>
                  <p className="text-sm font-semibold text-white group-hover:text-[#E1306C] transition-colors leading-tight">@sekarantii.id</p>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-[#E1306C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F2EDE4]/60">
          <p>© 2026 SEKARANTI. {t.footer.copyright}</p>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="italic font-serif" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              {t.footer.madeWith}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
