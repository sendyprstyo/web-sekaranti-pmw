'use client';

import Image from "next/image";
import Link from "next/link";
import PmwBazaarSection from "./pmw-bazaar-section";
import { getCollections, whatsappHref, INSTAGRAM_URL, PRODUCT_MATERIAL, PRODUCT_SIZE, PRODUCT_FINISHING } from "../lib/collections";
import { useLanguage } from "../lib/language-context";

const collections = getCollections();

const VALUES = [
  {
    icon: "✦",
    titleId: "Keindahan Autentik",
    titleEn: "Authentic Beauty",
    descId: "Setiap motif lahir dari apresiasi mendalam terhadap keindahan alam dan kekayaan budaya nusantara.",
    descEn: "Every pattern is born from a deep appreciation of nature's beauty and the richness of Indonesian heritage.",
  },
  {
    icon: "◈",
    titleId: "Kualitas Tanpa Kompromi",
    titleEn: "Uncompromising Quality",
    descId: "bahan Voal Ultrasoft dipilih khusus untuk memberikan kenyamanan maksimal, tekstur ultra-ringan, dan kelembutan terbaik yang nyaman dipakai seharian.",
    descEn: "Voal Ultrasoft is specially chosen for exceptional comfort, its featherlight texture, and ultra-soft feel that keeps you at ease all day long.",
  },
  {
    icon: "◇",
    titleId: "Desain yang Bermakna",
    titleEn: "Meaningful Design",
    descId: "Tiap koleksi membawa filosofi tersendiri—bukan sekadar motif, tetapi kisah yang dirajut ke dalam setiap helai.",
    descEn: "Each collection carries its own philosophy—not merely a pattern, but a story woven into every thread.",
  },
  {
    icon: "✧",
    titleId: "Sentuhan Eksklusif",
    titleEn: "Exclusive Touch",
    descId: "Motif-motif SEKARANTI digambar dengan presisi artistik tinggi, menghadirkan koleksi edisi terbatas yang berkarakter.",
    descEn: "SEKARANTI's patterns are illustrated with high artistic precision, presenting limited edition collections with character.",
  },
];

const TIMELINE = [
  {
    yearId: "Awal Mula",
    yearEn: "The Beginning",
    descId: "SEKARANTI lahir dari kecintaan mendalam terhadap seni motif batik dan kain nusantara, diwujudkan dalam bentuk hijab premium printing.",
    descEn: "SEKARANTI was born from a deep love of Indonesian batik art and traditional textiles, realised in premium printed hijab.",
  },
  {
    yearId: "Visi & Misi",
    yearEn: "Vision & Mission",
    descId: "Menghadirkan hijab premium yang memadukan keindahan seni motif khas nusantara dengan kenyamanan bahan berkualitas tinggi untuk perempuan modern Indonesia.",
    descEn: "To present premium hijabs that blend the beauty of Indonesian artistic patterns with the comfort of high-quality fabric for the modern Indonesian woman.",
  },
  {
    yearId: "Koleksi Perdana",
    yearEn: "Debut Collection",
    descId: "Empat koleksi perdana — Puspa Raras, Sekar Wengi, Taman Sari Sekar, dan Tirta Sekar — diluncurkan dengan masing-masing membawa filosofi dan palet warna yang unik.",
    descEn: "Four debut collections — Puspa Raras, Sekar Wengi, Taman Sari Sekar, and Tirta Sekar — launched each carrying a unique philosophy and colour palette.",
  },
  {
    yearId: "Bazar Perdana · PMW Polines",
    yearEn: "Debut Bazaar · PMW Polines",
    descId: "SEKARANTI melangkah ke ruang luring untuk pertama kalinya melalui bazar Program Mahasiswa Wirausaha (PMW) Politeknik Negeri Semarang, mempertemukan koleksi kami langsung dengan pelanggan perdana.",
    descEn: "SEKARANTI made our first offline debut at the Politeknik Negeri Semarang Student Entrepreneurship Program (PMW) bazaar, connecting our collections directly with our first customers.",
  },
  {
    yearId: "Hari Ini",
    yearEn: "Today",
    descId: "SEKARANTI terus berkembang, menghadirkan lebih banyak pilihan motif untuk menemani momen spesial perempuan Indonesia.",
    descEn: "SEKARANTI continues to grow, presenting more pattern choices to accompany the special moments of Indonesian women.",
  },
];

export default function AboutContent() {
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  return (
    <div className="about-page bg-[#FCFAF6] min-h-screen">

      {/* ============================================
          HERO — Full-bleed editorial dengan logo + tagline
          ============================================ */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-end pb-12 sm:pb-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D1A0E] via-[#3D2210] to-[#1F1D1A]" />

        {/* Decorative gold ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#D4AF37]/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#D4AF37]/15 pointer-events-none" />

        {/* Motif artwork collage — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-5/12 opacity-30 overflow-hidden pointer-events-none hidden md:block">
          <div className="grid grid-cols-2 h-full gap-0.5">
            {collections.map((c, i) => (
              <div key={c.slug} className="relative overflow-hidden">
                <Image
                  src={c.flatArtworkImage}
                  alt={c.name}
                  fill
                  sizes="25vw"
                  className={`object-cover ${i % 2 === 0 ? 'scale-110' : 'scale-105'}`}
                />
              </div>
            ))}
          </div>
          {/* Gradient fade over the collage */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1A0E] via-[#2D1A0E]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Logo */}
            <div className="mb-8 sm:mb-10">
              <Image
                src="/assets/logo-sekaranti.jpg"
                alt="SEKARANTI Logo"
                width={64}
                height={64}
                className="rounded-full border-2 border-[#D4AF37]/50 object-cover"
              />
            </div>

            <div className="inline-flex items-center gap-2 mb-5 sm:mb-6">
              <span className="w-8 h-px bg-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#D4AF37]">
                {isEn ? "The Story of SEKARANTI" : "THE STORY OF SEKARANTI"}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-tight tracking-tight">
              {isEn ? (
                <>Beauty that feels <em className="text-[#D4AF37] italic not-italic font-serif">personal.</em></>
              ) : (
                <>Keindahan yang <em className="text-[#D4AF37] italic font-serif">terasa personal.</em></>
              )}
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base text-white/60 font-sans font-light leading-relaxed max-w-lg">
              {isEn
                ? "SEKARANTI embodies beauty in every pattern through premium printed hijab collections designed to accompany every precious moment with elegance and distinct character."
                : "SEKARANTI menghadirkan keindahan dalam setiap motif melalui koleksi hijab premium printing yang dirancang untuk menemani setiap momen dengan sentuhan elegan dan karakter yang istimewa."
              }
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
              <Link
                href="/#collections"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D4AF37] text-[#1F1D1A] text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#c9a62f] transition-all shadow-lg hover:-translate-y-0.5"
              >
                <span>{isEn ? "Explore Collections" : "Jelajahi Koleksi"}</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white/10 transition-all"
              >
                {isEn ? "Chat WhatsApp" : "Chat WhatsApp"}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FCFAF6] to-transparent" />
      </section>

      {/* ============================================
          BRAND STORY — 2 kolom: narasi + gambar
          ============================================ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Narasi */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73]">
                {isEn ? "About The Brand" : "TENTANG BRAND"}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1c1c19] leading-tight tracking-tight">
              {isEn ? (
                <>Patterns with <em className="text-[#9a4152] italic">distinct character.</em></>
              ) : (
                <>Motif yang punya <em className="text-[#9a4152] italic">karakter.</em></>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#50443e] font-sans font-light leading-relaxed">
              {isEn
                ? "SEKARANTI is a premium printed hijab brand from Semarang, Central Java, Indonesia. Founded with a deep appreciation for the richness of Indonesian art and culture, SEKARANTI was born to present hijabs that are not merely a covering, but a form of artistic expression that is meaningful and elegant."
                : "SEKARANTI adalah brand hijab premium printing asal Semarang, Jawa Tengah, Indonesia. Didirikan dengan apresiasi mendalam terhadap kekayaan seni dan budaya nusantara, SEKARANTI hadir untuk menghadirkan hijab yang bukan sekadar penutup kepala, namun sebuah ekspresi artistik yang bermakna dan elegan."
              }
            </p>

            <p className="text-sm sm:text-base text-[#50443e] font-sans font-light leading-relaxed">
              {isEn
                ? "Four collections — Puspa Raras, Sekar Wengi, Taman Sari Sekar, and Tirta Sekar — each showcase distinct palettes and artwork born from a deep appreciation of nature and the timeless heritage of the archipelago."
                : "Empat koleksi — Puspa Raras, Sekar Wengi, Taman Sari Sekar, dan Tirta Sekar — menampilkan pilihan motif serta palet warna yang berbeda-beda. Setiap motif lahir dari apresiasi mendalam terhadap keindahan alam dan budaya nusantara."
              }
            </p>

            <blockquote className="border-l-2 border-[#D4AF37] pl-5 py-1">
              <p className="text-base sm:text-lg font-serif italic text-[#50443e] leading-relaxed">
                {isEn
                  ? "\"Beauty in every pattern — a hijab that speaks of who you are.\""
                  : "\"Keindahan dalam setiap motif — hijab yang bercerita tentang siapa dirimu.\""
                }
              </p>
            </blockquote>

            <Link
              href="/#collections"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#311908] pb-1 border-b border-[#311908] hover:text-[#9a4152] hover:border-[#9a4152] transition-colors self-start"
            >
              <span>{isEn ? "Explore Collections" : "Jelajahi Koleksi"}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#d4c3bb]/60">
              <Image
                src={collections[0].detailImage}
                alt="Detail motif SEKARANTI"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/85 backdrop-blur-sm border border-white/60 flex items-center justify-between">
                <div>
                  <span className="font-display text-sm font-bold text-[#311908] block">Puspa Raras</span>
                  <span className="text-[11px] text-[#50443e]">
                    {isEn ? "Voal Ultrasoft Fabric Detail" : "Detail Serat Voal Ultrasoft"}
                  </span>
                </div>
                <span className="text-xs text-[#D4AF37] font-serif italic">SEKARANTI · 01</span>
              </div>
            </div>
            {/* Deco ring */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-[#D4AF37]/30 pointer-events-none -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border border-[#9a4152]/20 pointer-events-none -z-10" />
          </div>
        </div>
      </section>

      {/* ============================================
          NILAI-NILAI / BRAND VALUES
          ============================================ */}
      <section className="py-20 sm:py-24 bg-[#F2EDE4]/60 border-y border-[#d4c3bb]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73] block mb-3">
              {isEn ? "OUR BRAND VALUES" : "NILAI-NILAI KAMI"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1c1c19] tracking-tight">
              {isEn ? <>What drives <span className="text-[#9a4152] italic">SEKARANTI.</span></> : <>Yang menggerakkan <span className="text-[#9a4152] italic">SEKARANTI.</span></>}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 border border-[#d4c3bb]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl text-[#9a4152] font-serif block mb-4">{v.icon}</span>
                <h3 className="font-display text-lg text-[#1c1c19] mb-2 font-normal">
                  {isEn ? v.titleEn : v.titleId}
                </h3>
                <p className="text-xs text-[#50443e] leading-relaxed font-sans font-light">
                  {isEn ? v.descEn : v.descId}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          KOLEKSI SHOWCASE — 4 Koleksi dengan Filosofi
          ============================================ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73] block mb-3">
            {isEn ? "THE COLLECTIONS" : "KOLEKSI KAMI"}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1c1c19] tracking-tight">
            {isEn ? <>Four stories, <span className="text-[#9a4152] italic">one soul.</span></> : <>Empat kisah, <span className="text-[#9a4152] italic">satu jiwa.</span></>}
          </h2>
          <p className="mt-3 text-sm text-[#8C7D73] font-sans font-light">
            {isEn ? "Each collection carries a unique philosophical narrative drawn from the richness of Indonesian nature and culture." : "Setiap koleksi membawa narasi filosofis yang unik dari kekayaan alam dan budaya Indonesia."}
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-28">
          {collections.map((c, i) => (
            <div
              key={c.slug}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Image */}
              <div className={`relative ${i % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#d4c3bb]/50 group">
                  <Image
                    src={c.modelImage}
                    alt={`${c.name} dikenakan model`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Vol badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#6B1D2F] text-white text-[10px] font-bold tracking-wider">
                    VOL. 0{i + 1}
                  </div>
                  {/* Color swatch */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-white/60 flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: c.colorSwatch }}
                    />
                    <div>
                      <span className="font-display text-sm font-bold text-[#311908] block leading-tight">{c.name}</span>
                      <span className="text-[10px] text-[#8C7D73]">{c.colorName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className={`flex flex-col gap-5 ${i % 2 !== 0 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="inline-flex items-center gap-2">
                  <span className="w-5 h-px bg-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73]">
                    {isEn ? `Collection 0${i + 1}` : `Koleksi 0${i + 1}`}
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-[#1c1c19] leading-tight font-normal">
                  {c.name} <span className="text-[#9a4152]">·</span> <em className="text-[#9a4152] italic font-serif">{c.alias}</em>
                </h3>

                <p className="text-sm text-[#50443e] font-sans font-light leading-relaxed">
                  {isEn ? c.philosophyStoryEn : c.philosophyStory}
                </p>

                <ul className="space-y-2.5">
                  {(isEn ? c.philosophyPointsEn : c.philosophyPoints).map((pt, pi) => (
                    <li key={pi} className="flex items-start gap-2.5 text-[12px] text-[#50443e] leading-snug font-sans">
                      <span className="text-[#D4AF37] mt-0.5 flex-shrink-0 font-bold">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link
                    href={`/collections/${c.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#311908] hover:bg-[#4A2E1B] text-white text-[11px] uppercase tracking-[0.16em] font-semibold transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>{isEn ? `View ${c.name}` : `Lihat ${c.name}`}</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          DETAIL PRODUK — Material, Ukuran, Finishing
          ============================================ */}
      <section className="py-20 sm:py-24 bg-[#FAF7F2] border-y border-[#d4c3bb]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#8C7D73] block mb-3">
              {isEn ? "THE EVERYDAY DETAILS" : "DETAIL PRODUK"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1c1c19] tracking-tight">
              {isEn ? <>Crafted with <span className="text-[#9a4152] italic">meticulous care.</span></> : <>Dirancang dengan <span className="text-[#9a4152] italic">penuh perhatian.</span></>}
            </h2>
            <p className="mt-3 text-sm text-[#8C7D73] font-sans font-light">
              {isEn ? "High quality standards in every detail of SEKARANTI hijabs." : "Standar kualitas tinggi pada setiap detail hijab SEKARANTI."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 — Material */}
            <div className="bg-white rounded-3xl p-8 border border-[#d4c3bb]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] bg-[#F2EDE4]/80 pointer-events-none" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-4">
                01 · {isEn ? "MATERIAL" : "MATERIAL"}
              </span>
              <span className="text-5xl text-[#9a4152] font-serif block mb-4">✳</span>
              <h3 className="font-display text-xl text-[#1c1c19] mb-3 font-normal">{PRODUCT_MATERIAL}</h3>
              <p className="text-xs text-[#50443e] leading-relaxed font-sans font-light">
                {isEn
                  ? "Soft material with a classy matte sheen, breathable, structured at the crown, and completely opaque when worn all day long."
                  : "Material lembut dengan kilau matte yang berkelas, adem, tegak di dahi, dan tidak menerawang saat dipakai sepanjang hari."
                }
              </p>
            </div>

            {/* Card 2 — Ukuran */}
            <div className="bg-white rounded-3xl p-8 border border-[#d4c3bb]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] bg-[#F2EDE4]/80 pointer-events-none" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-4">
                02 · {isEn ? "SIZE" : "UKURAN"}
              </span>
              <span className="text-5xl text-[#9a4152] font-serif italic block mb-4">110</span>
              <h3 className="font-display text-xl text-[#1c1c19] mb-3 font-normal">{PRODUCT_SIZE}</h3>
              <p className="text-xs text-[#50443e] leading-relaxed font-sans font-light">
                {isEn
                  ? "The ideal square silhouette that drapes effortlessly, offering versatile styling options for modern modest looks."
                  : "Dimensi persegi ideal yang mudah dibentuk, memberikan keleluasaan berbagai variasi styling hijab modern."
                }
              </p>
            </div>

            {/* Card 3 — Finishing */}
            <div className="bg-white rounded-3xl p-8 border border-[#d4c3bb]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] bg-[#F2EDE4]/80 pointer-events-none" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-4">
                03 · {isEn ? "FINISHING" : "FINISHING"}
              </span>
              <span className="text-5xl text-[#9a4152] font-serif block mb-4">✧</span>
              <h3 className="font-display text-xl text-[#1c1c19] mb-3 font-normal">{isEn ? "Precision Finishing" : "Finishing Rapi"}</h3>
              <p className="text-xs text-[#50443e] leading-relaxed font-sans font-light">
                {isEn
                  ? "Neat and precise edge stitching. Every edge is meticulously processed for utmost durability and neatness."
                  : "Jahit tepi rapi & presisi. Setiap ujung diproses secara teliti demi ketahanan dan kerapian maksimal."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PERJALANAN BRAND / TIMELINE
          ============================================ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Image stack */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {collections.slice(0, 2).map((c) => (
                <div key={c.slug} className="relative aspect-square rounded-2xl overflow-hidden border border-[#d4c3bb]/60 shadow-md">
                  <Image
                    src={c.flatArtworkImage}
                    alt={`Artwork ${c.name}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
              {collections.slice(2, 4).map((c) => (
                <div key={c.slug} className="relative aspect-square rounded-2xl overflow-hidden border border-[#d4c3bb]/60 shadow-md">
                  <Image
                    src={c.flatArtworkImage}
                    alt={`Artwork ${c.name}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
            {/* Logo overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white shadow-xl border-2 border-[#D4AF37]/50 overflow-hidden z-10">
              <Image
                src="/assets/logo-sekaranti.jpg"
                alt="SEKARANTI"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7D73]">
                {isEn ? "OUR JOURNEY" : "PERJALANAN KAMI"}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1c1c19] mb-10 tracking-tight">
              {isEn ? <>From passion <span className="text-[#9a4152] italic">to purpose.</span></> : <>Dari passion <span className="text-[#9a4152] italic">menjadi karya.</span></>}
            </h2>

            <div className="space-y-0">
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex gap-5 group">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#D4AF37]/40 flex-shrink-0 mt-1" />
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-[#d4c3bb]/60 my-2 min-h-[3rem]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-1.5">
                      {isEn ? step.yearEn : step.yearId}
                    </span>
                    <p className="text-sm text-[#50443e] font-sans font-light leading-relaxed">
                      {isEn ? step.descEn : step.descId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BAZAR PERDANA — Dokumentasi PMW Polines
          ============================================ */}
      <PmwBazaarSection variant="about" />

      {/* ============================================
          CTA SECTION — Kontak & Order
          ============================================ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-[#2D1A0E] to-[#1F1D1A] relative overflow-hidden">
        {/* Deco rings */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 rounded-full border border-[#D4AF37]/10 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 right-20 -translate-y-1/2 w-48 h-48 rounded-full border border-[#D4AF37]/15 pointer-events-none hidden lg:block" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/30 text-white mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] tracking-[0.22em] uppercase font-semibold">
              {isEn ? "Find your signature elegance" : "FIND YOUR SIGNATURE ELEGANCE"}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-5">
            {isEn
              ? <>Your motif <span className="text-[#D4AF37] italic">awaits.</span></>
              : <>Motif favoritmu <span className="text-[#D4AF37] italic">menanti.</span></>
            }
          </h2>

          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mb-8 font-sans font-light leading-relaxed">
            {isEn
              ? "All collections available at Rp149.000. Order or consult directly via WhatsApp. COD service available exclusively for Semarang City."
              : "Semua koleksi tersedia seharga Rp149.000. Pesan atau konsultasikan langsung via WhatsApp. Layanan COD khusus wilayah Kota Semarang."
            }
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4AF37] text-[#1F1D1A] text-xs uppercase tracking-[0.16em] font-bold shadow-xl hover:-translate-y-1 hover:bg-[#c9a62f] transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
              </svg>
              <span>{isEn ? "Order via WhatsApp" : "Pesan via WhatsApp"}</span>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-white/30 text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white/10 transition-all"
            >
              <span>{isEn ? "Instagram @sekarantii.id" : "Instagram @sekarantii.id"}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>

          {/* COD notice */}
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/8 border border-white/15 text-xs text-white/60">
            <span className="font-semibold text-white/80">{isEn ? "COD Information:" : "Informasi COD:"}</span>
            <span>
              {isEn
                ? "Exclusively for Semarang City, payment upon delivery after WhatsApp confirmation."
                : "Khusus Kota Semarang, pengiriman & pembayaran di tempat setelah konfirmasi WhatsApp."
              }
            </span>
          </div>
        </div>

        {/* Big watermark */}
        <span className="cta-mark select-none pointer-events-none" aria-hidden="true">S</span>
      </section>

    </div>
  );
}
