'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

// ─── Template definitions ───────────────────────────────────────────────
type TemplateId =
  | 'puspa-elegan'
  | 'wengi-marun'
  | 'tirta-biru'
  | 'taman-sage'
  | 'batik-hitam'
  | 'minimal-krem';

interface Template {
  id: TemplateId;
  name: string;
  tagline: string;
  bg: string;
  border: string;
  accent: string;
  textColor: string;
  goldLine: boolean;
  frameStyle: 'ornate' | 'minimal' | 'bold' | 'editorial';
  pattern: string; // svg pattern id or ''
  badgeColor: string;
  overlayFrom: string;
  overlayTo: string;
  pillBg: string;
  pillText: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'puspa-elegan',
    name: 'Puspa Elegan',
    tagline: 'Keanggunan Mekar',
    bg: 'from-[#fdf4f5] via-[#fff0f1] to-[#fce4e7]',
    border: 'border-[#E8B4B8]',
    accent: '#E8B4B8',
    textColor: 'text-[#6B1D2F]',
    goldLine: true,
    frameStyle: 'ornate',
    pattern: 'puspa',
    badgeColor: 'bg-[#9a4152]',
    overlayFrom: 'from-[#6B1D2F]/60',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#9a4152]',
    pillText: 'text-white',
  },
  {
    id: 'wengi-marun',
    name: 'Wengi Marun',
    tagline: 'Keteguhan Malam',
    bg: 'from-[#2a0a14] via-[#3d1020] to-[#1f0a10]',
    border: 'border-[#D4AF37]/50',
    accent: '#D4AF37',
    textColor: 'text-[#FAF7F2]',
    goldLine: true,
    frameStyle: 'bold',
    pattern: 'wengi',
    badgeColor: 'bg-[#D4AF37]',
    overlayFrom: 'from-[#1f0a10]/80',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#D4AF37]',
    pillText: 'text-[#311908]',
  },
  {
    id: 'tirta-biru',
    name: 'Tirta Biru',
    tagline: 'Ketenangan Samudra',
    bg: 'from-[#ddeeff] via-[#e8f4ff] to-[#c8e4f8]',
    border: 'border-[#2E5B88]/40',
    accent: '#244b6e',
    textColor: 'text-[#1a3a5a]',
    goldLine: false,
    frameStyle: 'editorial',
    pattern: 'tirta',
    badgeColor: 'bg-[#244b6e]',
    overlayFrom: 'from-[#1a3a5a]/60',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#244b6e]',
    pillText: 'text-white',
  },
  {
    id: 'taman-sage',
    name: 'Taman Sage',
    tagline: 'Kesegaran Taman',
    bg: 'from-[#edf5ec] via-[#f3f9f2] to-[#dff0de]',
    border: 'border-[#8EA885]/50',
    accent: '#5a7a53',
    textColor: 'text-[#2d4a28]',
    goldLine: false,
    frameStyle: 'minimal',
    pattern: 'taman',
    badgeColor: 'bg-[#5a7a53]',
    overlayFrom: 'from-[#2d4a28]/55',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#5a7a53]',
    pillText: 'text-white',
  },
  {
    id: 'batik-hitam',
    name: 'Batik Malam',
    tagline: 'Warisan Nusantara',
    bg: 'from-[#1F1D1A] via-[#2a2825] to-[#1a1816]',
    border: 'border-[#D4AF37]/60',
    accent: '#D4AF37',
    textColor: 'text-[#FAF7F2]',
    goldLine: true,
    frameStyle: 'bold',
    pattern: 'batik',
    badgeColor: 'bg-[#D4AF37]',
    overlayFrom: 'from-[#1a1816]/90',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#D4AF37]',
    pillText: 'text-[#1F1D1A]',
  },
  {
    id: 'minimal-krem',
    name: 'Krem Klasik',
    tagline: 'Elegan Tanpa Waktu',
    bg: 'from-[#F2EDE4] via-[#FAF7F2] to-[#ede7dd]',
    border: 'border-[#311908]/20',
    accent: '#311908',
    textColor: 'text-[#311908]',
    goldLine: true,
    frameStyle: 'minimal',
    pattern: 'krem',
    badgeColor: 'bg-[#311908]',
    overlayFrom: 'from-[#311908]/50',
    overlayTo: 'to-transparent',
    pillBg: 'bg-[#311908]',
    pillText: 'text-[#FAF7F2]',
  },
];

// ─── SVG Corner ornament (reusable) ─────────────────────────────────────
function CornerOrnament({ color = '#D4AF37', size = 32 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" fill={color} opacity="0.8" />
      <circle cx="2" cy="2" r="1.5" fill={color} />
    </svg>
  );
}

// ─── Decorative SVG patterns per template ───────────────────────────────
function PatternBg({ pattern, opacity = 0.07 }: { pattern: string; opacity?: number }) {
  const floral = (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <pattern id="floral-p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="8" fill="currentColor" fillOpacity="0.5" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <circle cx="20" cy="10" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="20" cy="30" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="10" cy="20" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="30" cy="20" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="13" cy="13" r="2" fill="currentColor" fillOpacity="0.4" />
          <circle cx="27" cy="27" r="2" fill="currentColor" fillOpacity="0.4" />
          <circle cx="27" cy="13" r="2" fill="currentColor" fillOpacity="0.4" />
          <circle cx="13" cy="27" r="2" fill="currentColor" fillOpacity="0.4" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#floral-p)" />
    </svg>
  );

  const batikDots = (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <pattern id="batik-p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="0" cy="0" r="1" fill="currentColor" fillOpacity="0.5" />
          <circle cx="20" cy="0" r="1" fill="currentColor" fillOpacity="0.5" />
          <circle cx="0" cy="20" r="1" fill="currentColor" fillOpacity="0.5" />
          <circle cx="20" cy="20" r="1" fill="currentColor" fillOpacity="0.5" />
          <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#batik-p)" />
    </svg>
  );

  const waves = (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <pattern id="wave-p" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="currentColor" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#wave-p)" />
    </svg>
  );

  const grid = (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <pattern id="grid-p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#grid-p)" />
    </svg>
  );

  const svgMap: Record<string, React.ReactNode> = {
    puspa: floral,
    wengi: batikDots,
    tirta: waves,
    taman: floral,
    batik: batikDots,
    krem: grid,
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      <div className="w-full h-full">{svgMap[pattern] ?? grid}</div>
    </div>
  );
}

// ─── Single template frame preview card ─────────────────────────────────
function TemplateCard({
  template,
  selected,
  onClick,
}: {
  template: Template;
  selected: boolean;
  onClick: () => void;
}) {
  const isDark = ['wengi-marun', 'batik-hitam'].includes(template.id);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group
        ${selected ? 'scale-[1.03] shadow-2xl ring-2 ring-[#D4AF37]' : 'hover:scale-[1.02] hover:shadow-lg'}
        ${template.border}`}
      style={{ aspectRatio: '3/4' }}
      aria-label={`Pilih template ${template.name}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${template.bg}`} />
      <PatternBg pattern={template.pattern} opacity={isDark ? 0.15 : 0.08} />

      {/* Corner ornaments */}
      <div className="absolute top-2 left-2">
        <CornerOrnament color={template.accent} size={18} />
      </div>
      <div className="absolute top-2 right-2 rotate-90">
        <CornerOrnament color={template.accent} size={18} />
      </div>
      <div className="absolute bottom-2 left-2 -rotate-90">
        <CornerOrnament color={template.accent} size={18} />
      </div>
      <div className="absolute bottom-2 right-2 rotate-180">
        <CornerOrnament color={template.accent} size={18} />
      </div>

      {/* Gold top line */}
      {template.goldLine && (
        <div
          className="absolute top-6 left-6 right-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${template.accent}, transparent)` }}
        />
      )}

      {/* Logo area */}
      <div className="absolute top-8 inset-x-0 flex flex-col items-center gap-1">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/40 bg-white/20">
          <Image src="/assets/logo-sekaranti.jpg" alt="SEKARANTI" width={28} height={28} className="object-cover" />
        </div>
        <span
          className={`text-[8px] font-bold tracking-[0.25em] uppercase ${template.textColor}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          SEKARANTI
        </span>
      </div>

      {/* Photo placeholder */}
      <div className="absolute inset-x-5 top-[52px] bottom-[42px] rounded-lg overflow-hidden bg-black/10 border border-white/20 flex items-center justify-center">
        <svg className="w-6 h-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 15.75A2.25 2.25 0 004.5 18h15a2.25 2.25 0 00-2.25-2.25H6.75z" />
        </svg>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-2 inset-x-0 text-center">
        <span className={`text-[7px] font-bold tracking-[0.2em] uppercase ${template.textColor} opacity-80`}>
          {template.tagline}
        </span>
      </div>

      {/* Selected badge */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Template name overlay on hover */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
        <span className="text-white text-[9px] font-bold tracking-widest uppercase">{template.name}</span>
      </div>
    </button>
  );
}

// ─── Main photobooth frame renderer ─────────────────────────────────────
function PhotoFrame({
  template,
  photoSrc,
  frameRef,
}: {
  template: Template;
  photoSrc: string | null;
  frameRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isDark = ['wengi-marun', 'batik-hitam'].includes(template.id);
  const logoFilter = isDark ? '' : 'mix-blend-multiply';

  return (
    <div
      ref={frameRef}
      id="photobooth-frame"
      className={`relative overflow-hidden rounded-3xl border-2 ${template.border} shadow-2xl`}
      style={{ aspectRatio: '3/4', maxWidth: '420px', width: '100%' }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.bg}`} />

      {/* Pattern overlay */}
      <PatternBg pattern={template.pattern} opacity={isDark ? 0.12 : 0.07} />

      {/* Gold or accent top/bottom lines */}
      {template.goldLine && (
        <>
          <div
            className="absolute top-10 left-8 right-8 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${template.accent}CC, transparent)` }}
          />
          <div
            className="absolute bottom-12 left-8 right-8 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${template.accent}CC, transparent)` }}
          />
        </>
      )}

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3"><CornerOrnament color={template.accent} size={28} /></div>
      <div className="absolute top-3 right-3 rotate-90"><CornerOrnament color={template.accent} size={28} /></div>
      <div className="absolute bottom-3 left-3 -rotate-90"><CornerOrnament color={template.accent} size={28} /></div>
      <div className="absolute bottom-3 right-3 rotate-180"><CornerOrnament color={template.accent} size={28} /></div>

      {/* ── HEADER BRANDING ── */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center gap-1.5 z-10">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border-2 shadow-md bg-white flex-shrink-0"
          style={{ borderColor: template.accent + '80' }}
        >
          <Image
            src="/assets/logo-sekaranti.jpg"
            alt="SEKARANTI"
            width={40}
            height={40}
            className={`object-cover ${logoFilter}`}
          />
        </div>
        <span
          className={`text-[11px] font-bold tracking-[0.28em] uppercase ${template.textColor}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          SEKARANTI
        </span>
        <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${template.accent}, transparent)` }} />
        <span className={`text-[8px] tracking-[0.18em] uppercase ${template.textColor} opacity-70`}>
          {template.tagline}
        </span>
      </div>

      {/* ── PHOTO AREA ── */}
      <div className="absolute inset-x-6 top-[22%] bottom-[18%] z-10">
        <div
          className="w-full h-full rounded-2xl overflow-hidden border shadow-lg"
          style={{ borderColor: template.accent + '60' }}
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt="Foto kamu"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black/10 backdrop-blur-sm">
              <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke={isDark ? '#FAF7F2' : '#311908'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span
                className={`text-[11px] text-center font-sans ${template.textColor} opacity-50`}
              >
                Upload foto kamu
              </span>
            </div>
          )}

          {/* Photo gradient overlay bottom */}
          {photoSrc && (
            <div className={`absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t ${template.overlayFrom} ${template.overlayTo} pointer-events-none`} />
          )}
        </div>
      </div>

      {/* ── FOOTER BRANDING ── */}
      <div className="absolute bottom-5 inset-x-0 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-3">
          <div className="h-px w-8" style={{ background: template.accent + '60' }} />
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1 h-1 rounded-full`}
              style={{ backgroundColor: template.accent }}
            />
            <span className={`text-[8px] font-semibold tracking-[0.22em] uppercase ${template.textColor} opacity-80`}>
              @sekarantii.id
            </span>
            <span
              className={`w-1 h-1 rounded-full`}
              style={{ backgroundColor: template.accent }}
            />
          </div>
          <div className="h-px w-8" style={{ background: template.accent + '60' }} />
        </div>
        <span className={`text-[7px] tracking-[0.14em] ${template.textColor} opacity-50`}>
          hijab premium printing · semarang
        </span>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────
export default function PhotoboothPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('puspa-elegan');
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const template = TEMPLATES.find((t) => t.id === selectedTemplate)!;
  const isDark = ['wengi-marun', 'batik-hitam'].includes(template.id);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDownload = async () => {
    if (!frameRef.current) return;
    setDownloading(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default ?? (html2canvasModule as unknown as typeof html2canvasModule.default);
      const canvas = await html2canvas(frameRef.current as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `sekaranti-photobooth-${template.id}.png`;
      link.href = url;
      link.click();
    } catch {
      // Fallback: open print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Paste photo support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#F2EDE4] pt-28 pb-20 px-4 sm:px-6 lg:px-8">

      {/* ── Page Header ── */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/40 shadow-sm mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#311908]">
            SEKARANTI Photobooth
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl text-[#1c1c19] leading-tight tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
        >
          Abadikan Momen<br />
          <em className="text-[#9a4152] italic">Bersamamu</em>
        </h1>
        <p className="text-sm sm:text-base text-[#50443e] font-light max-w-md mx-auto leading-relaxed">
          Pilih template, upload fotomu, dan unduh hasilnya. Sempurna untuk dibagikan di Instagram!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-12 items-start">

        {/* ── LEFT: Template Picker + Upload ── */}
        <div className="flex flex-col gap-8">

          {/* Template grid */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7D73] mb-4">
              Pilih Template
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {TEMPLATES.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={selectedTemplate === t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                />
              ))}
            </div>
          </div>

          {/* Selected template info */}
          <div
            className={`rounded-2xl border p-5 ${template.border} bg-gradient-to-br ${template.bg}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: template.accent }} />
              <span className={`text-xs uppercase tracking-[0.2em] font-bold ${template.textColor}`}>
                {template.name}
              </span>
            </div>
            <p className={`text-[11px] mt-2 ${template.textColor} opacity-70 font-light leading-relaxed`}>
              Template bertema <strong className="font-semibold">{template.tagline}</strong> —
              cocok untuk foto formal maupun santai dengan sentuhan khas Sekaranti.
            </p>
          </div>

          {/* Upload area */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7D73] mb-4">
              Upload Foto
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-8 flex flex-col items-center justify-center gap-4 text-center
                ${dragOver
                  ? 'border-[#D4AF37] bg-[#D4AF37]/5 scale-[1.01]'
                  : 'border-[#d4c3bb] bg-white/60 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/3'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />

              {photoSrc ? (
                <>
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-md">
                    <img src={photoSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#311908]">Foto berhasil diupload ✓</p>
                    <p className="text-xs text-[#8C7D73] mt-1">Klik atau drag untuk ganti foto</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-[#F2EDE4] border border-[#d4c3bb] flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#8C7D73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#311908]">Drag & drop foto di sini</p>
                    <p className="text-xs text-[#8C7D73] mt-1">atau klik untuk pilih dari galeri</p>
                    <p className="text-[10px] text-[#8C7D73] mt-1 opacity-70">JPG, PNG, WEBP · bisa juga Ctrl+V paste</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {photoSrc && (
              <button
                type="button"
                onClick={() => setPhotoSrc(null)}
                className="flex-1 py-3 px-5 rounded-xl border-2 border-[#d4c3bb] text-[#311908] text-xs font-semibold tracking-wide uppercase hover:bg-[#F2EDE4] transition-all cursor-pointer"
              >
                Hapus Foto
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!photoSrc || downloading}
              className={`flex-[2] py-3.5 px-6 rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer
                ${photoSrc && !downloading
                  ? 'bg-[#311908] text-white hover:bg-[#4A2E1B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-[#D4AF37]/30'
                  : 'bg-[#d4c3bb]/40 text-[#8C7D73] cursor-not-allowed'
                }`}
            >
              {downloading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh Foto Photobooth
                </span>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-white/80 rounded-2xl border border-[#d4c3bb]/60 p-5">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7D73] mb-3">Tips Terbaik</h3>
            <ul className="space-y-2">
              {[
                'Gunakan foto portrait (tegak) untuk hasil terbaik',
                'Resolusi tinggi = hasil unduhan lebih jernih',
                'Foto wajah penuh lebih cocok untuk template ini',
                'Bagikan ke Instagram Story dengan tag @sekarantii.id',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-[#50443e] leading-relaxed">
                  <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT: Live Preview Frame ── */}
        <div className="flex flex-col items-center gap-5 lg:sticky lg:top-28">
          <div className="w-full max-w-[420px]">
            <div className="text-center mb-4">
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73]">
                Preview • {template.name}
              </span>
            </div>
            <PhotoFrame template={template} photoSrc={photoSrc} frameRef={frameRef} />
          </div>

          {/* Share teaser */}
          <div className="text-center max-w-[320px]">
            <p className="text-xs text-[#8C7D73] leading-relaxed">
              Setelah diunduh, bagikan ke Instagram Story kamu dan tag{' '}
              <span className="font-semibold text-[#9a4152]">@sekarantii.id</span> untuk tampil di feed kami ✨
            </p>
          </div>
        </div>

      </div>

      {/* ── All Template Gallery ── */}
      <div className="max-w-6xl mx-auto mt-20">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73] block mb-2">
            Semua Template
          </span>
          <h2
            className="text-2xl sm:text-3xl text-[#1c1c19] tracking-tight"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            6 Template Eksklusif <span className="text-[#9a4152] italic">Sekaranti</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="flex flex-col gap-2">
              <TemplateCard
                template={t}
                selected={selectedTemplate === t.id}
                onClick={() => {
                  setSelectedTemplate(t.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              <div className="text-center">
                <span className="text-[10px] font-semibold text-[#311908] block">{t.name}</span>
                <span className="text-[9px] text-[#8C7D73]">{t.tagline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* html2canvas install note (hidden from DOM, for dev reference) */}
      <noscript>
        <p>JavaScript diperlukan untuk fitur photobooth.</p>
      </noscript>
    </div>
  );
}
