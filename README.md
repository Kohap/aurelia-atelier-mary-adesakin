# Adesakin Mary Damilola Studio

Collector-facing portfolio website for Nigerian thread painter and textile artist Adesakin Mary Damilola.

Live site: https://kohap.github.io/aurelia-atelier-mary-adesakin/

## Overview

This Vite/React GitHub Pages site presents Mary Adesakin's thread painting practice, selected original artworks, sold works, exhibition history, studio policies, and direct collector inquiry forms.

The site is designed for collectors, curators, galleries, and art advisors who want to review original works, request print details, join the studio list, or contact the studio about commissions and acquisitions.

## Current Features

- React/Vite app structure for easier future editing
- Admin-friendly JSON artwork catalogue in `public/data/artworks.json`
- Browser admin screen at `/adesakin/admin/` for editing original and print prices before exporting JSON
- Admin artwork form that prepares new catalogue entries and optimized WebP images
- Responsive artist portfolio and artwork catalogue
- Separate Original Works and Print catalogue browsing
- Original artwork cards with status, dimensions, medium, year, and inquiry flow
- Collection browsing, search, and sort controls
- Multilingual interface support for English, Yoruba, and French
- Paystack deposit, original, and print Product Link fields
- Collector shortlist and acquisition inquiry modal
- Formspree-powered studio inquiry and mailing list forms
- Plausible analytics snippet
- Google Search Console verification tag
- SEO metadata, Open Graph preview image, sitemap, and robots file
- Studio terms, return/refund policy, and privacy policy modals
- Social links for Instagram, TikTok, and Facebook

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── assets/
│   │   ├── favicon.svg
│   │   └── artwork/
│   │       ├── beauty-in-becoming.webp
│   │       ├── hands-that-wont-let-go.webp
│   │       ├── in-her-prime-green.webp
│   │       ├── in-her-prime.webp
│   │       ├── loud-silence.webp
│   │       ├── mary-studio-social-preview.jpg
│   │       ├── maze-of-uncertainty-sold-2025.webp
│   │       ├── rare-like-a-blue-rose.webp
│   │       ├── stitched-in-time.webp
│   │       ├── the-calm-before-clarity.webp
│   │       ├── the-ife-muse.webp
│   │       ├── the-weight-of-words.webp
│   │       └── visible-within.webp
│   └── data/
│       └── artworks.json
├── sources/
│   └── artwork/          (original JPG/PNG sources, not deployed)
├── scripts/
│   └── optimize-images.mjs
├── src/
│   ├── main.jsx
│   └── styles.css
└── README.md
```

## Local Preview

Install dependencies once:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for GitHub Pages:

```bash
npm run build
```

## Publishing

This project is a Vite app configured with the GitHub Pages base path `/aurelia-atelier-mary-adesakin/`.

Deployment is handled by `.github/workflows/pages.yml`, which installs dependencies, builds the Vite app, uploads `dist`, and deploys it to GitHub Pages.

Publishing files:

- `sitemap.xml`: https://kohap.github.io/aurelia-atelier-mary-adesakin/sitemap.xml
- `robots.txt`: https://kohap.github.io/aurelia-atelier-mary-adesakin/robots.txt
- Canonical URL: https://kohap.github.io/aurelia-atelier-mary-adesakin/

## Maintenance Notes

- Keep artwork data inside `public/data/artworks.json`.
- Use `/adesakin/admin/` to edit original and print prices, export the updated JSON, replace `public/data/artworks.json`, then commit and push.
- When adding an artwork, copy the downloaded WebP image into `public/assets/artwork` before publishing the exported JSON.
- Run `npm run optimize:images` after adding source JPG or PNG files to `sources/artwork/` to prepare fast catalogue images (900 px max, WebP).
- To accept payments, create live Paystack Product Links and paste them into the original, deposit, and print link fields in `/adesakin/admin/`.
- Never add a Paystack secret key to this repository. Secure digital delivery requires server-side transaction verification and signed download links.
- Keep image filenames stable once they are published, unless the corresponding artwork record is updated.
- Update `sitemap.xml` when the canonical URL changes.

## Vercel Environment Variables

Configure these in Vercel for Production, Preview, and Development. Copy `.env.example` to `.env.local` for local development.

- `ADMIN_TOKEN` + `VITE_ADMIN_TOKEN`: both set to the same secret value. Protects the catalogue publish and image upload API endpoints. The `VITE_` copy is bundled into the admin panel; the plain copy is checked server-side.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token used by the `api/` routes to read and write artwork images and the live catalogue.
- `VITE_PAYSTACK_PUBLIC_KEY`: Paystack public key for browser-side Inline checkout. Safe to bundle.
- `PAYSTACK_SECRET_KEY`: Paystack secret key for webhook signature verification. Server-side only — never prefix with `VITE_`.
- Keep Formspree endpoints in `src/main.jsx` and analytics snippets in `index.html`.
