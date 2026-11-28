import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { LanguageProvider } from "../lib/language-context";
import IntroScreen from "../components/intro-screen";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "SEKARANTI | Premium Printed Hijab",
    template: "%s | SEKARANTI",
  },
  description:
    "Jelajahi koleksi hijab premium printing SEKARANTI: Puspa Raras, Sekar Wengi, Taman Sari Sekar, dan Tirta Sekar.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/assets/logo-sekaranti.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "SEKARANTI",
    title: "SEKARANTI | Premium Printed Hijab",
    description:
      "Hijab premium printing dengan motif elegan dan karakter tersendiri.",
    ...(siteUrl
      ? {
          images: [
            {
              url: new URL(
                "/assets/design-hijab-orang/Puspa%20Raras.png",
                siteUrl,
              ).toString(),
              width: 1199,
              height: 1312,
              alt: "Koleksi Puspa Raras dari SEKARANTI",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "SEKARANTI | Premium Printed Hijab",
    description:
      "Hijab premium printing dengan motif elegan dan karakter tersendiri.",
    ...(siteUrl
      ? {
          images: [
            new URL(
              "/assets/design-hijab-orang/Puspa%20Raras.png",
              siteUrl,
            ).toString(),
          ],
        }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#fcf9f4] text-[#1c1c19] overflow-x-hidden">
        <LanguageProvider>
          <Suspense fallback={null}>
            <IntroScreen />
          </Suspense>
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          <main>{children}</main>
          <Suspense fallback={null}>
            <SiteFooter />
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
