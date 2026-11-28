'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../lib/language-context';

type Phase = 'enter' | 'visible' | 'exit' | 'done';

export default function IntroScreen() {
  const [phase, setPhase] = useState<Phase>('enter');
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith('/admin') || pathname?.startsWith('/nota');

  useEffect(() => {
    if (isAdminRoute) return;

    // Hanya tampil sekali per session
    if (sessionStorage.getItem('sk_intro_seen')) {
      setPhase('done');
      return;
    }

    // Lock scroll saat intro
    document.body.style.overflow = 'hidden';

    const t1 = setTimeout(() => setPhase('visible'), 80);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
      sessionStorage.setItem('sk_intro_seen', '1');
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = '';
    };
  }, [isAdminRoute]);

  if (isAdminRoute || phase === 'done') return null;

  const isVisible = phase === 'visible' || phase === 'exit';
  const isExiting = phase === 'exit';

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto"
      aria-hidden="true"
    >
      {/* ── Top curtain panel ── */}
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background: 'linear-gradient(170deg, #1a0f06 0%, #2D1A0E 60%, #3a1f10 100%)',
          transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
          transition: isExiting
            ? 'transform 950ms cubic-bezier(0.76,0,0.24,1)'
            : 'none',
        }}
      />

      {/* ── Bottom curtain panel ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: 'linear-gradient(350deg, #1a0f06 0%, #2D1A0E 60%, #3a1f10 100%)',
          transform: isExiting ? 'translateY(100%)' : 'translateY(0)',
          transition: isExiting
            ? 'transform 950ms cubic-bezier(0.76,0,0.24,1)'
            : 'none',
        }}
      />

      {/* ── Thin gold center line (between the two panels) ── */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-px pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)',
          opacity: isExiting ? 0 : 0.5,
          transition: 'opacity 400ms ease',
        }}
      />

      {/* ── Center content — fades in, then fades out ── */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="flex flex-col items-center gap-4 sm:gap-5 select-none w-full max-w-sm sm:max-w-xl text-center px-2"
          style={{
            opacity: isExiting ? 0 : isVisible ? 1 : 0,
            transform: isVisible && !isExiting ? 'translateY(0) scale(1)' : isExiting ? 'translateY(-8px) scale(0.98)' : 'translateY(18px) scale(0.97)',
            transition: isExiting
              ? 'opacity 350ms ease, transform 350ms ease'
              : 'opacity 700ms ease 100ms, transform 700ms cubic-bezier(0.34,1.56,0.64,1) 100ms',
          }}
        >
          {/* Logo with pulsing gold ring */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse ring */}
            <div
              className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4AF37]/20"
              style={{
                animation: 'intro-ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            {/* Middle ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#D4AF37]/30" />
            {/* Logo circle */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#D4AF37]/70 shadow-[0_0_30px_rgba(212,175,55,0.3)] z-10">
              <Image
                src="/assets/logo-sekaranti.jpg"
                alt="SEKARANTI"
                width={80}
                height={80}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Brand name */}
          <div className="text-center space-y-1 sm:space-y-1.5 mt-1 w-full max-w-full">
            <h1
              className="text-white text-[24px] xs:text-[28px] sm:text-5xl md:text-6xl tracking-[0.22em] sm:tracking-[0.32em] uppercase font-normal pl-[0.22em] sm:pl-[0.32em] whitespace-nowrap leading-tight"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              SEKARANTI
            </h1>
            <p className="text-[#D4AF37] text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.45em] uppercase font-semibold font-sans pl-[0.28em] sm:pl-[0.45em]">
              Premium Printed Hijab
            </p>
          </div>

          {/* Gold ornament divider */}
          <div className="flex items-center gap-3 sm:gap-4 mt-1">
            <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/80" />
            <span className="text-[#D4AF37] text-xs">✦</span>
            <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/80" />
          </div>

          {/* Tagline */}
          <p
            className="text-white/40 text-[8.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.26em] uppercase font-sans px-4 text-center max-w-xs sm:max-w-md"
            style={{
              opacity: isVisible && !isExiting ? 1 : 0,
              transition: 'opacity 800ms ease 500ms',
            }}
          >
            {lang === 'en' ? 'Beauty in every pattern' : 'Keindahan dalam setiap motif'}
          </p>
        </div>
      </div>

      {/* Keyframe style injected via style tag */}
      <style>{`
        @keyframes intro-ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
