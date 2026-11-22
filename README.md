# SEKARANTI

SEKARANTI is a responsive brand showroom for premium printed hijabs. It presents four collections, their product imagery and details, and directs orders to WhatsApp. There is no internal cart or checkout.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product data and assets

- Collection names, visual descriptions, image paths, price, product specifications, Instagram, and WhatsApp are maintained in `lib/collections.ts`.
- Product photography and collection slides are served from `public/assets/`.
- Collection pages use `/collections/[slug]`; product detail pages use `/products/[slug]`.
- Update the WhatsApp, Instagram, and marketplace destinations only with official SEKARANTI links. Marketplace links are not shown until official URLs are available.

## Deployment and SEO

Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin (for example, `https://brand.example`) before deployment. It is used for canonical metadata and the generated sitemap and robots sitemap reference. Without it, the site does not publish a sitemap URL.

```bash
npm run build
npm run start
```

