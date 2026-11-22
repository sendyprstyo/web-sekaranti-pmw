import type { Metadata } from "next";
import AboutContent from "../../components/about-content";

export const metadata: Metadata = {
  title: { absolute: "Tentang SEKARANTI | Premium Printed Hijab" },
  description: "Kenali SEKARANTI, brand hijab premium printing dengan koleksi motif yang elegan dan karakter tersendiri.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
