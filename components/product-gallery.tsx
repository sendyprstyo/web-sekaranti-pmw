'use client';

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "../lib/collections";
import { useLanguage } from "../lib/language-context";

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const { lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="product-gallery">
      <div className="gallery-stage">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 800px) 100vw, 55vw"
        />
        <span className="gallery-counter">0{activeIndex + 1} / 0{images.length}</span>
      </div>
      <div className="gallery-thumbnails" role="group" aria-label={lang === 'en' ? `${productName} product photos` : `${productName} foto produk`}>
        {images.map((image, index) => (
          <button
            aria-label={lang === 'en' ? `View photo ${index + 1}: ${image.alt}` : `Lihat foto ${index + 1}: ${image.alt}`}
            aria-pressed={index === activeIndex}
            className={`gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
            key={image.src}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image src={image.src} alt="" fill sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  );
}
