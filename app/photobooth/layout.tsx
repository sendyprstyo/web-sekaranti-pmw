import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photobooth | SEKARANTI',
  description:
    'Buat kenangan indah dengan Photobooth SEKARANTI. Pilih template elegan bertema hijab premium, upload foto, dan unduh hasilnya untuk dibagikan ke Instagram.',
  openGraph: {
    title: 'SEKARANTI Photobooth — Abadikan Momenmu',
    description:
      '6 template photobooth eksklusif bertema Sekaranti. Upload foto, pilih template, unduh dan bagikan!',
    type: 'website',
  },
};

export default function PhotoboothLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
