export interface PmwPartner {
  id: string;
  name: string;
  shortName: string;
  roleId: string;
  roleEn: string;
  src: string;
  width: number;
  height: number;
}

export interface PmwBazaarPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  objectPosition: string;
  tagId: string;
  tagEn: string;
  titleId: string;
  titleEn: string;
  captionId: string;
  captionEn: string;
}

export const PMW_PARTNERS: PmwPartner[] = [
  {
    id: "polines",
    name: "Politeknik Negeri Semarang",
    shortName: "POLINES",
    roleId: "Perguruan Tinggi",
    roleEn: "Host Institution",
    src: "/assets/foto%20pmw/LOGO%20POLINES.jpg",
    width: 200,
    height: 200,
  },
  {
    id: "pmw-polines",
    name: "Program Mahasiswa Wirausaha",
    shortName: "PMW POLINES",
    roleId: "Inkubasi & Bazar Perdana",
    roleEn: "Entrepreneurship Program",
    src: "/assets/foto%20pmw/LOGO%20PMW.jpg",
    width: 594,
    height: 398,
  },
];

export const PMW_BAZAAR_PHOTOS: PmwBazaarPhoto[] = [
  {
    id: "booth-team",
    src: "/assets/foto%20pmw/WhatsApp%20Image%202026-11-26%20at%2012.40.20.jpeg",
    width: 720,
    height: 1280,
    objectPosition: "center 20%",
    tagId: "Momen Utama · Booth Bazar",
    tagEn: "Highlight · Bazaar Booth",
    titleId: "Tim SEKARANTI di Booth Perdana",
    titleEn: "SEKARANTI Team at Our Debut Booth",
    captionId:
      "Seluruh tim SEKARANTI menyapa langsung pengunjung di bazar perdana Program Mahasiswa Wirausaha (PMW) Politeknik Negeri Semarang bersama katalog, kemasan pouch, dan koleksi pertama kami.",
    captionEn:
      "The SEKARANTI team welcoming visitors in person at our debut Program Mahasiswa Wirausaha (PMW) bazaar at Politeknik Negeri Semarang with our catalog, pouches, and first collections.",
  },
  {
    id: "visitors-booth",
    src: "/assets/foto%20pmw/WhatsApp%20Image%202026-11-26%20at%2012.40.24.jpeg",
    width: 2268,
    height: 4032,
    objectPosition: "center 22%",
    tagId: "Pelanggan Perdana",
    tagEn: "First Customers",
    titleId: "Antusiasme Pengunjung di Booth",
    titleEn: "Warm Reception at the Booth",
    captionId:
      "Para pengunjung membawa pulang koleksi hijab SEKARANTI dalam kemasan pouch eksklusif langsung dari booth perdana kami.",
    captionEn:
      "Bazaar visitors taking home SEKARANTI hijab collections in signature pouches straight from our very first booth.",
  },
  {
    id: "campus-moment",
    src: "/assets/foto%20pmw/913b203f-cc09-47aa-aff2-9b6de0e6fb18.jpg",
    width: 900,
    height: 1600,
    objectPosition: "center 22%",
    tagId: "Area Bazar Polines",
    tagEn: "Polines Bazaar Grounds",
    titleId: "Dukungan di Pelataran Kampus",
    titleEn: "Campus Community Support",
    captionId:
      "Momen hangat di area bazar kampus Politeknik Negeri Semarang—pengunjung tetap antusias mendukung dan membawa pulang produk SEKARANTI.",
    captionEn:
      "A heartwarming moment on the Politeknik Negeri Semarang bazaar grounds—visitors eagerly supporting SEKARANTI and bringing home our pieces.",
  },
  {
    id: "first-transaction",
    src: "/assets/foto%20pmw/WhatsApp%20Image%202026-11-26%20at%2012.40.18.jpeg",
    width: 720,
    height: 1280,
    objectPosition: "center 15%",
    tagId: "Pembelian Offline",
    tagEn: "Offline Purchase",
    titleId: "Transaksi Langsung Pertama",
    titleEn: "First Direct Bazaar Purchase",
    captionId:
      "Pelanggan menunjukkan transaksi QRIS yang berhasil bersama koleksi Puspa Raras yang dipilih langsung di booth SEKARANTI.",
    captionEn:
      "A happy customer showing a completed QRIS transaction alongside the Puspa Raras collection chosen directly at the SEKARANTI booth.",
  },
  {
    id: "team-candid",
    src: "/assets/foto%20pmw/WhatsApp%20Image%202026-11-26%20at%2012.40.21.jpeg",
    width: 720,
    height: 1280,
    objectPosition: "center 20%",
    tagId: "Di Balik Booth",
    tagEn: "Behind the Booth",
    titleId: "Kebersamaan & Semangat Tim",
    titleEn: "Team Spirit & Camaraderie",
    captionId:
      "Potret kebersamaan tim SEKARANTI di depan booth perdana setelah melayani pengunjung selama gelaran bazar PMW Polines.",
    captionEn:
      "Candid smiles and teamwork from SEKARANTI in front of our debut booth throughout the PMW Polines bazaar.",
  },
];
