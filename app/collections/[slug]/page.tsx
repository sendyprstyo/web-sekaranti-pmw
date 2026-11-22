import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionDetailContent from "../../../components/collection-detail-content";
import {
  getCollectionBySlug,
  getCollections,
  PRODUCT_SIZE,
} from "../../../lib/collections";

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }));
}

type CollectionPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Koleksi tidak ditemukan" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const imageUrl = siteUrl
    ? new URL(collection.modelImage, siteUrl).toString()
    : undefined;

  return {
    title: `${collection.name} Collection`,
    description: `${collection.name} — ${collection.visualDescription} Hijab Matte Satin Silk ukuran ${PRODUCT_SIZE}.`,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} | SEKARANTI`,
      description: collection.visualDescription,
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

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  return <CollectionDetailContent collection={collection} />;
}
