'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/language-context";

export default function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `/#${id}`);
    }
  };

  // Handle hash scrolling when arriving from other pages or URL direct visits
  useEffect(() => {
    if (pathname !== "/") return;

    const handleInitialHash = () => {
      const hashFromUrl = window.location.hash.replace("#", "");
      const hashFromSession = typeof window !== "undefined" ? sessionStorage.getItem("scroll_to_hash") : null;
      const targetId = hashFromUrl || hashFromSession;

      if (targetId === "collections" || targetId === "contact" || targetId === "tentang-kami" || targetId === "bazar-pmw") {
        if (hashFromSession) {
          sessionStorage.removeItem("scroll_to_hash");
        }
        setTimeout(() => {
          scrollToSection(targetId);
        }, 120);
      }
    };

    handleInitialHash();
    window.addEventListener("hashchange", handleInitialHash);
    return () => window.removeEventListener("hashchange", handleInitialHash);
  }, [pathname]);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/#collections", label: t.nav.collections },
    { href: "/#tentang-kami", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);

    if (href === "/#collections" || href === "#collections") {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection("collections");
      } else {
        sessionStorage.setItem("scroll_to_hash", "collections");
        window.location.href = "/#collections";
      }
    } else if (href === "/#contact" || href === "#contact") {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection("contact");
      } else {
        sessionStorage.setItem("scroll_to_hash", "contact");
        window.location.href = "/#contact";
      }
    } else if (href === "/#tentang-kami" || href === "#tentang-kami") {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection("tentang-kami");
      } else {
        sessionStorage.setItem("scroll_to_hash", "tentang-kami");
        window.location.href = "/#tentang-kami";
      }
    } else if (href === "/") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
    }
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/nota")) {
    return null;
  }

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div
        className={`relative mx-auto max-w-6xl w-full transition-all duration-300 pointer-events-auto border ${
          mobileOpen
            ? "rounded-3xl bg-[#fcf9f4] border-[#d4c3bb] shadow-[0_20px_50px_rgba(49,25,8,0.18)] p-3.5 sm:p-5"
            : scrolled
              ? "rounded-full bg-[#fcf9f4]/95 backdrop-blur-2xl border-[#d4c3bb]/80 shadow-[0_16px_40px_rgba(49,25,8,0.12)] py-2 px-4 sm:px-6"
              : "rounded-full bg-[#fcf9f4]/90 backdrop-blur-xl border-[#d4c3bb]/50 shadow-[0_10px_32px_rgba(49,25,8,0.07)] py-2.5 px-4 sm:px-7"
        }`}
      >
        {/* Golden bevel */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none rounded-full" />

        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-2.5 sm:gap-3 group"
            aria-label="SEKARANTI — Beranda"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-[1.5px] ring-[#D4AF37]/70 ring-offset-2 ring-offset-[#fcf9f4] shadow-[0_2px_10px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300 bg-white flex-shrink-0">
              <Image
                src="/assets/logo-sekaranti.jpg"
                alt="SEKARANTI Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span
              className="tracking-[0.22em] text-[#311908] uppercase font-bold text-lg sm:text-xl md:text-[22px] leading-none transition-colors group-hover:text-[#4A2E1B]"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              SEKARANTI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi Utama">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-[11px] uppercase tracking-[0.18em] font-semibold py-1.5 px-3.5 rounded-full text-[#50443e] hover:text-[#311908] hover:bg-[#311908]/[0.05] transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill (Desktop & Mobile) */}
            <div
              className="flex items-center p-0.5 rounded-full bg-[#311908]/5 border border-[#d4c3bb]/70 text-[10.5px] sm:text-[11px] font-sans font-semibold tracking-wider"
              aria-label="Pilih Bahasa / Language Selection"
            >
              <button
                type="button"
                onClick={() => setLang('id')}
                className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[#311908] !text-white shadow-xs font-bold'
                    : 'text-[#50443e] hover:text-[#311908]'
                }`}
                aria-label="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#311908] !text-white shadow-xs font-bold'
                    : 'text-[#50443e] hover:text-[#311908]'
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Shop Now Button (Desktop) */}
            <Link
              href="/#collections"
              onClick={(e) => handleNavClick(e, "/#collections")}
              className="hidden md:inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#311908] !text-white hover:bg-[#4A2E1B] text-[11px] uppercase tracking-[0.18em] font-semibold transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer ml-1"
            >
              <span className="!text-white font-bold">{t.nav.shopNow}</span>
              <span aria-hidden="true" className="!text-white font-bold">↓</span>
            </Link>

            {/* Mobile hamburger button */}
            <button
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-full bg-[#311908]/5 border border-[#d4c3bb]/50 hover:bg-[#311908]/10 transition-colors gap-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#d4c3bb]/50 flex flex-col gap-1.5 animate-in fade-in-50 duration-200">
            <nav className="flex flex-col gap-1" aria-label="Navigasi Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold py-3 px-4 rounded-xl text-[#4a3d35] hover:text-[#311908] hover:bg-[#311908]/[0.05] active:bg-[#311908]/[0.08] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[#a48e82] text-sm">›</span>
                </Link>
              ))}
            </nav>

            <div className="pt-2.5 border-t border-[#d4c3bb]/50 mt-1">
              <Link
                href="/#collections"
                onClick={(e) => handleNavClick(e, "/#collections")}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.22em] font-bold shadow-[0_4px_16px_rgba(49,25,8,0.22)] active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                <span className="!text-white font-bold tracking-[0.22em]">{t.nav.shopNow}</span>
                <span aria-hidden="true" className="!text-white font-bold text-sm">↓</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
