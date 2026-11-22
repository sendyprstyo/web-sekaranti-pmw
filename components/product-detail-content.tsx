'use client';

import CollectionDetailContent from "./collection-detail-content";
import type { Collection } from "../lib/collections";

export default function ProductDetailContent({
  collection,
}: {
  collection: Collection;
}) {
  return <CollectionDetailContent collection={collection} />;
}
