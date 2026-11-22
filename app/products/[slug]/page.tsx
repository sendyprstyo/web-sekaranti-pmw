import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailContent from "../../../components/product-detail-content";
import {
  getCollectionBySlug,
  getCollections,
  PRODUCT_MATERIAL,
  PRODUCT_PRICE_LABEL,
  PRODUCT_SIZE,
} from "../../../lib/collections";

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }));
}

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Produk tidak ditemukan" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const imageUrl = siteUrl
    ? new URL(collection.modelImage, siteUrl).toString()
    : undefined;

  return {
    title: `${collection.name} Hijab`,
    description: `${collection.name}, ${collection.visualDescription.toLowerCase()} ${PRODUCT_MATERIAL}, ukuran ${PRODUCT_SIZE}. Harga ${PRODUCT_PRICE_LABEL}.`,
    alternates: { canonical: `/products/${collection.slug}` },
    openGraph: {
      title: `${collection.name} Hijab | SEKARANTI`,
      description: `${collection.visualDescription} ${PRODUCT_MATERIAL}, ${PRODUCT_SIZE}.`,
      ...(imageUrl
        ? {
            images: [
              { url: imageUrl, alt: `${collection.name} dikenakan model` },
            ],
          }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  return <ProductDetailContent collection={collection} />;
}
