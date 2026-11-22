import Image from 'next/image'
import Link from 'next/link'
import { INSTAGRAM_URL, whatsappHref, getCollections } from '@/lib/collections'

export default function Footer() {
  const collections = getCollections?.() || [
    { slug: 'puspa-raras', name: 'Puspa Raras' },
    { slug: 'sekar-wengi', name: 'Sekar Wengi' },
    { slug: 'taman-sari-sekar', name: 'Taman Sari Sekar' },
    { slug: 'tirta-sekar', name: 'Tirta Sekar' },
  ]

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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#D4AF37]/70 ring-offset-2 ring-offset-[#1F1D1A] shadow-[0_2px_12px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300">
                <Image
                  src="/assets/logo-sekaranti.jpg"
                  alt="SEKARANTI Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.24em] text-white uppercase font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  SEKARANTI
                </span>
                <span className="text-[9px] text-[#D4AF37] tracking-[0.26em] uppercase font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  Elegance in Every Pattern
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#F2EDE4]/75 leading-relaxed max-w-md pt-2">
              SEKARANTI menghadirkan keindahan dalam setiap motif melalui koleksi hijab premium printing 
              yang dirancang untuk menemani setiap momen istimewa Anda dengan sentuhan anggun, lembut, dan penuh karakter.
            </p>

            {/* Semarang COD Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#311908]/90 border border-[#D4AF37]/40 text-[#FAF7F2] text-xs shadow-sm mt-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[11px] font-medium tracking-wide">Melayani COD Khusus Wilayah Kota Semarang</span>
            </div>
          </div>

          {/* Koleksi Kami (Col 6-7) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              Koleksi Utama
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
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  Katalog Koleksi
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-[#F2EDE4]/80 hover:text-white transition-colors">
                  Kontak & Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Hubungi Kami (Col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              Pemesanan & Kontak
            </h4>
            <div className="space-y-3 text-sm text-[#F2EDE4]/80">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2]/5 hover:bg-[#FAF7F2]/10 border border-[#FAF7F2]/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#FAF7F2]/60">WhatsApp CS</span>
                  <span className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">0857 2703 3141</span>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2]/5 hover:bg-[#FAF7F2]/10 border border-[#FAF7F2]/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#FAF7F2]/60">Instagram Resmi</span>
                  <span className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">@sekarantii.id</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F2EDE4]/60">
          <p>© 2026 SEKARANTI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="italic font-serif" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              Made with care, worn with grace.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
