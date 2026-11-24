xport type ProductImage = {
  src: string;
  alt: string;
  label?: string;
};

export type Collection = {
  slug: string;
  name: string;
  alias: string;
  colorName: string;
  colorSwatch: string;
  tag: string;
  visualDescription: string;
  visualDescriptionEn?: string;
  price: number;
  originalPrice: number;
  discount: string;
  modelImage: string;
  flatArtworkImage: string;
  coverImage: string;
  productImage: string;
  detailImage: string;
  stylingImage: string;
  informationImage: string;
  philosophyStory: string;
  philosophyPoints: string[];
  philosophyStoryEn: string;
  philosophyPointsEn: string[];
  gallery: ProductImage[];
};

export const PRODUCT_PRICE = 67_000;
export const PRODUCT_ORIGINAL_PRICE = 0;
export const PRODUCT_PRICE_LABEL = `Rp${PRODUCT_PRICE.toLocaleString("id-ID")}`;
export const PRODUCT_ORIGINAL_PRICE_LABEL = ``;
export const PRODUCT_MATERIAL = "Voal Ultrasoft";
export const PRODUCT_SIZE = "110 × 110 cm";
export const PRODUCT_FINISHING = "Jahitan tepi rapi dan kuat";
export const INSTAGRAM_URL = "https://www.instagram.com/sekarantii.id/";
export const TIKTOK_URL = "https://www.tiktok.com/@sekarantii.id";
export const SHOPEE_URL = "https://id.shp.ee/35K4DR4M";
export const TOKOPEDIA_URL = "https://www.tokopedia.com/sekarantii";

const collections: Collection[] = [
  {
    slug: "puspa-raras",
    name: "Puspa Raras",
    alias: "Sekar Arum",
    colorName: "Petal Blush Pink",
    colorSwatch: "#E8B4B8",
    tag: "HIJAB SEGIEMPAT",
    price: PRODUCT_PRICE,
    originalPrice: PRODUCT_ORIGINAL_PRICE,
    discount: "",
    visualDescription: "Motif floral bernuansa merah muda lembut dengan detail bunga puspa mekar dan kupu-kupu.",
    visualDescriptionEn: "Floral motifs in serene soft blush pink with blossoming flowers and butterfly details.",
    philosophyStory:
      "Puspa Raras (atau Sekar Arum) adalah koleksi yang terinspirasi oleh keharmonisan batin dan kasih sayang yang tulus. Menghadirkan keseimbangan rasa antara kelembutan jiwa dan keanggunan seorang perempuan nusantara.",
    philosophyPoints: [
      "Raras bermakna indah, serasi, dan menenangkan batin.",
      "Warna merah muda yang lembut melambangkan kasih sayang, kelembutan, ketulusan, serta keharmonisan hubungan.",
      "Hadirnya detail bunga dan kupu-kupu menggambarkan proses pertumbuhan, kebahagiaan yang ringan, serta keindahan yang memancar secara alami tanpa berlebihan.",
    ],
    philosophyStoryEn:
      "Puspa Raras (or Sekar Arum) is a collection inspired by inner harmony and sincere affection. It presents a balance between the gentleness of the soul and the grace of a woman of the archipelago.",
    philosophyPointsEn: [
      "Raras means beautiful, harmonious, and calming to the soul.",
      "The soft pink hue symbolises love, tenderness, sincerity, and the harmony of relationships.",
      "The presence of floral and butterfly details depicts growth, effortless joy, and beauty that radiates naturally without excess.",
    ],
    modelImage: "/assets/design-hijab-orang/Puspa%20Raras.png",
    flatArtworkImage: "/assets/design-hijab-optimized/Puspa%20Raras.webp",
    coverImage: "/assets/PUSPA%20RARAS/SLIDE%201%20Cover%20Collection.png",
    productImage: "/assets/PUSPA%20RARAS/SLIDE%202%20Product%20Showcase.png",
    detailImage: "/assets/PUSPA%20RARAS/SLIDE%203%20Fabric%20%26%20Detail.png",
    stylingImage: "/assets/PUSPA%20RARAS/SLIDE%204%20Styling%20Inspiration.png",
    informationImage: "/assets/PUSPA%20RARAS/SLIDE%205%20Product%20Information.png",
    gallery: [
      {
        src: "/assets/design-hijab-orang/Puspa%20Raras.png",
        alt: "Puspa Raras dikenakan model, menampilkan siluet anggun motif floral merah muda.",
        label: "Look Model",
      },
      {
        src: "/assets/PUSPA%20RARAS/SLIDE%201%20Cover%20Collection.png",
        alt: "Kain hijab Puspa Raras lipatan cover collection.",
        label: "Cover Collection",
      },
      {
        src: "/assets/PUSPA%20RARAS/SLIDE%202%20Product%20Showcase.png",
        alt: "Tampilan bentangan motif Puspa Raras pada kain hijab Voal Ultrasoft.",
        label: "Product Showcase",
      },
      {
        src: "/assets/PUSPA%20RARAS/SLIDE%203%20Fabric%20%26%20Detail.png",
        alt: "Detail tekstur bahan Voal Ultrasoft dan motif Puspa Raras.",
        label: "Fabric & Detail",
      },
      {
        src: "/assets/PUSPA%20RARAS/SLIDE%204%20Styling%20Inspiration.png",
        alt: "Inspirasi penataan gaya styling hijab Puspa Raras.",
        label: "Styling Inspiration",
      },
      {
        src: "/assets/PUSPA%20RARAS/SLIDE%205%20Product%20Information.png",
        alt: "Informasi ukuran 110 x 110 cm dan finishing jahitan Puspa Raras.",
        label: "Product Info",
      },
      {
        src: "/assets/design-hijab/Puspa%20Raras.png",
        alt: "Artwork desain motif floral Puspa Raras.",
        label: "Pattern Artwork",
      },
    ],
  },
  {
    slug: "sekar-wengi",
    name: "Sekar Wengi",
    alias: "Sekar Puspa Riris",
    colorName: "Wine Burgundy Maroon",
    colorSwatch: "#6B1D2F",
    tag: "HIJAB SEGIEMPAT",
    price: PRODUCT_PRICE,
    originalPrice: PRODUCT_ORIGINAL_PRICE,
    discount: "",
    visualDescription: "Motif floral bernuansa merah marun mendalam dengan keteraturan pola berulang.",
    visualDescriptionEn: "Floral motifs in rich wine burgundy with repeating classical patterns.",
    philosophyStory:
      "Sekar Wening (atau Sekar Puspa Riris) melambangkan keindahan yang lahir dari ketenangan malam, memancarkan keteguhan hati serta kematangan jiwa.",
    philosophyPoints: [
      "Sekar berarti bunga, melambangkan keindahan, kebaikan hati, dan keanggunan yang tumbuh dari ketenangan.",
      "Warna merah marun yang dalam melambangkan keteguhan, keberanian, dan kematangan jiwa, sementara pola berulang di bagian atas menggambarkan keteraturan hidup dan keselarasan semesta.",
      "Gugusan bunga yang mekar lembut di bagian bawah menyimbolkan harapan, kehangatan, serta rezeki yang tumbuh subur seiring kesabaran.",
    ],
    philosophyStoryEn:
      "Sekar Wening (or Sekar Puspa Riris) embodies the beauty that is born from the stillness of the night, radiating steadfastness of heart and the maturity of the soul.",
    philosophyPointsEn: [
      "Sekar means flower, symbolising beauty, kindness, and grace that grows from inner calm.",
      "The deep maroon hue represents strength, courage, and spiritual maturity, while the repeating pattern at the top reflects life's order and cosmic harmony.",
      "The gently blooming clusters of flowers at the base symbolise hope, warmth, and abundance that flourishes through patience.",
    ],
    modelImage: "/assets/design-hijab-orang/Sekar%20Wening.png",
    flatArtworkImage: "/assets/design-hijab-optimized/Sekar%20Wening.webp",
    coverImage: "/assets/SEKAR%20WENGI/SLIDE%201%20Cover%20Collection.png",
    productImage: "/assets/SEKAR%20WENGI/SLIDE%202%20Product%20Showcase.png",
    detailImage: "/assets/SEKAR%20WENGI/SLIDE%203%20Fabric%20%26%20Detail.png",
    stylingImage: "/assets/SEKAR%20WENGI/SLIDE%204%20Styling%20Inspiration.png",
    informationImage: "/assets/SEKAR%20WENGI/SLIDE%205%20Product%20Information.png",
    gallery: [
      {
        src: "/assets/design-hijab-orang/Sekar%20Wening.png",
        alt: "Sekar Wengi dikenakan model dengan nuansa marun berkelas.",
        label: "Look Model",
      },
      {
        src: "/assets/SEKAR%20WENGI/SLIDE%201%20Cover%20Collection.png",
        alt: "Kain hijab Sekar Wengi cover collection.",
        label: "Cover Collection",
      },
      {
        src: "/assets/SEKAR%20WENGI/SLIDE%202%20Product%20Showcase.png",
        alt: "Tampilan bentangan motif Sekar Wengi.",
        label: "Product Showcase",
      },
      {
        src: "/assets/SEKAR%20WENGI/SLIDE%203%20Fabric%20%26%20Detail.png",
        alt: "Detail serat bahan dan motif Sekar Wengi.",
        label: "Fabric & Detail",
      },
      {
        src: "/assets/SEKAR%20WENGI/SLIDE%204%20Styling%20Inspiration.png",
        alt: "Inspirasi styling hijab Sekar Wengi.",
        label: "Styling Inspiration",
      },
      {
        src: "/assets/SEKAR%20WENGI/SLIDE%205%20Product%20Information.png",
        alt: "Informasi ukuran dan spesifikasi Sekar Wengi.",
        label: "Product Info",
      },
      {
        src: "/assets/design-hijab/Sekar%20Wening.png",
        alt: "Artwork desain motif floral Sekar Wengi.",
        label: "Pattern Artwork",
      },
    ],
  },
  {
    slug: "taman-sari-sekar",
    name: "Taman Sari Sekar",
    alias: "Sekar Tanjung",
    colorName: "Rose & Sage Garden",
    colorSwatch: "#8EA885",
    tag: "HIJAB SEGIEMPAT",
    price: PRODUCT_PRICE,
    originalPrice: PRODUCT_ORIGINAL_PRICE,
    discount: "",
    visualDescription: "Motif floral dalam nuansa merah muda dan hijau pastel dengan sentuhan geometris samar.",
    visualDescriptionEn: "Floral motifs in rose and sage green pastel tones with subtle geometric accents.",
    philosophyStory:
      "Taman Sari Sekar (atau Sekar Tanjung) menggambarkan suasana taman keraton yang asri, sarat kehidupan dan kesegaran awal penuh harapan.",
    philosophyPoints: [
      "Menggambarkan suasana taman yang asri, segar, dan penuh kehidupan.",
      "Paduan hijau dan kuning pastel melambangkan kesegaran awal, harapan baru, dan keseimbangan alam, sedangkan sentuhan merah muda memberi kehangatan dan kelembutan.",
      "Unsur pola geometris samar yang menyatu dengan bunga-bunga melambangkan keseimbangan antara aturan/prinsip hidup dan keluwesan dalam menjalani hari.",
    ],
    philosophyStoryEn:
      "Taman Sari Sekar (or Sekar Tanjung) evokes the lush atmosphere of a royal palace garden, brimming with life and the freshness of new beginnings full of hope.",
    philosophyPointsEn: [
      "It portrays the ambience of a verdant, refreshing garden teeming with life.",
      "The blend of pastel green and yellow represents fresh starts, new hope, and nature's balance, while the blush pink accents bring warmth and softness.",
      "The subtle geometric pattern woven among the blossoms symbolises the harmony between life's guiding principles and the ease of flowing through each day.",
    ],
    modelImage: "/assets/design-hijab-orang/Taman%20Sari%20Sekar.png",
    flatArtworkImage: "/assets/design-hijab-optimized/Taman%20Sari%20Sekar.webp",
    coverImage: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%201%20Cover%20Collection.png",
    productImage: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%202%20Product%20Showcase.png",
    detailImage: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%203%20Fabric%20%26%20Detail.png",
    stylingImage: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%204%20Styling%20Inspiration.png",
    informationImage: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%205%20Product%20Information.png",
    gallery: [
      {
        src: "/assets/design-hijab-orang/Taman%20Sari%20Sekar.png",
        alt: "Taman Sari Sekar dikenakan model bernuansa hijau segar dan mawar.",
        label: "Look Model",
      },
      {
        src: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%201%20Cover%20Collection.png",
        alt: "Kain hijab Taman Sari Sekar cover collection.",
        label: "Cover Collection",
      },
      {
        src: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%202%20Product%20Showcase.png",
        alt: "Tampilan bentangan motif Taman Sari Sekar.",
        label: "Product Showcase",
      },
      {
        src: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%203%20Fabric%20%26%20Detail.png",
        alt: "Detail bahan dan motif Taman Sari Sekar.",
        label: "Fabric & Detail",
      },
      {
        src: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%204%20Styling%20Inspiration.png",
        alt: "Inspirasi styling hijab Taman Sari Sekar.",
        label: "Styling Inspiration",
      },
      {
        src: "/assets/TAMAN%20SARI%20SEKAR/SLIDE%205%20Product%20Information.png",
        alt: "Informasi ukuran dan spesifikasi Taman Sari Sekar.",
        label: "Product Info",
      },
      {
        src: "/assets/design-hijab/Taman%20Sari%20Sekar.png",
        alt: "Artwork desain motif floral Taman Sari Sekar.",
        label: "Pattern Artwork",
      },
    ],
  },
  {
    slug: "tirta-sekar",
    name: "Tirta Sekar",
    alias: "Sekar Samudra",
    colorName: "Samudera Sky Blue",
    colorSwatch: "#2E5B88",
    tag: "HIJAB SEGIEMPAT",
    price: PRODUCT_PRICE,
    originalPrice: PRODUCT_ORIGINAL_PRICE,
    discount: "",
    visualDescription: "Motif floral bernuansa biru samudera dan ornamen awan mega mendung.",
    visualDescriptionEn: "Floral motifs in oceanic blue gradients with traditional cloud (mega mendung) ornaments.",
    philosophyStory:
      "Tirta Sekar (atau Sekar Samudra) terinspirasi dari filosofi air sebagai sumber kejernihan pikiran, ketenangan batin, serta kelapangan hati.",
    philosophyPoints: [
      "Tirta berarti air, yang dalam filosofi tradisi melambangkan ketenangan, kejernihan pikiran, kesucian, dan sumber kehidupan.",
      "Warna biru dan motif awan/mega mendung menyimbolkan kelapangan hati, keteduhan, serta kemampuan beradaptasi dalam berbagai keadaan seperti air yang mengalir.",
      "Kehadiran bunga kecil dan kupu-kupu melambangkan kedamaian batin dan keindahan yang tetap mekar di tengah ketenangan.",
    ],
    philosophyStoryEn:
      "Tirta Sekar (or Sekar Samudra) is inspired by the philosophy of water as a source of mental clarity, inner serenity, and openness of heart.",
    philosophyPointsEn: [
      "Tirta means water, which in traditional philosophy symbolises calm, clarity of mind, purity, and the source of life.",
      "The blue tones and cloud/mega mendung motifs symbolise an open heart, tranquillity, and the ability to adapt to any circumstance — just as water flows.",
      "The presence of small flowers and butterflies represents inner peace and beauty that continues to bloom in the midst of stillness.",
    ],
    modelImage: "/assets/design-hijab-orang/Tirta%20Sekar.png",
    flatArtworkImage: "/assets/design-hijab-optimized/Tirta%20sekar.webp",
    coverImage: "/assets/TIRTA%20SEKAR/SLIDE%201%20Cover%20Collection.png",
    productImage: "/assets/TIRTA%20SEKAR/SLIDE%202%20Product%20Showcase.png",
    detailImage: "/assets/TIRTA%20SEKAR/SLIDE%203%20Fabric%20%26%20Detail.png",
    stylingImage: "/assets/TIRTA%20SEKAR/SLIDE%204%20Styling%20Inspiration.png",
    informationImage: "/assets/TIRTA%20SEKAR/SLIDE%205%20Product%20Information.png",
    gallery: [
      {
        src: "/assets/design-hijab-orang/Tirta%20Sekar.png",
        alt: "Tirta Sekar dikenakan model bernuansa biru samudera sejuk.",
        label: "Look Model",
      },
      {
        src: "/assets/TIRTA%20SEKAR/SLIDE%201%20Cover%20Collection.png",
        alt: "Kain hijab Tirta Sekar cover collection.",
        label: "Cover Collection",
      },
      {
        src: "/assets/TIRTA%20SEKAR/SLIDE%202%20Product%20Showcase.png",
        alt: "Tampilan bentangan motif Tirta Sekar.",
        label: "Product Showcase",
      },
      {
        src: "/assets/TIRTA%20SEKAR/SLIDE%203%20Fabric%20%26%20Detail.png",
        alt: "Detail bahan dan motif Tirta Sekar.",
        label: "Fabric & Detail",
      },
      {
        src: "/assets/TIRTA%20SEKAR/SLIDE%204%20Styling%20Inspiration.png",
        alt: "Inspirasi styling hijab Tirta Sekar.",
        label: "Styling Inspiration",
      },
      {
        src: "/assets/TIRTA%20SEKAR/SLIDE%205%20Product%20Information.png",
        alt: "Informasi ukuran dan spesifikasi Tirta Sekar.",
        label: "Product Info",
      },
      {
        src: "/assets/design-hijab/Tirta%20sekar.png",
        alt: "Artwork desain motif floral Tirta Sekar.",
        label: "Pattern Artwork",
      },
    ],
  },
];

export function getCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function whatsappHref(productName?: string, quantity: number = 1): string {
  const productMessage = productName
    ? `Halo SEKARANTI, saya tertarik untuk memesan produk ${productName} (Jumlah: ${quantity} pcs). Apakah tersedia untuk pemesanan COD wilayah Semarang?`
    : "Halo SEKARANTI, saya ingin bertanya mengenai koleksi hijab yang tersedia.";

  return `https://wa.me/6285727033141?text=${encodeURIComponent(productMessage)}`;
}

export function whatsappCodHref(productName?: string): string {
  const msg = productName
    ? `Halo SEKARANTI, saya ingin menanyakan jadwal pengantaran & pembayaran COD wilayah Kota Semarang untuk produk ${productName}.`
    : "Halo SEKARANTI, saya ingin menanyakan layanan COD khusus wilayah Kota Semarang.";
  return `https://wa.me/6285727033141?text=${encodeURIComponent(msg)}`;
}
