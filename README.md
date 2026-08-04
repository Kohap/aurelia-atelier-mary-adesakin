# Adesakin Mary Damilola Studio

Collector-facing portfolio website for Nigerian thread painter and textile artist Adesakin Mary Damilola.

Live site: https://kohap.github.io/aurelia-atelier-mary-adesakin/

## Overview

This static GitHub Pages site presents Mary Adesakin's thread painting practice, selected original artworks, sold works, exhibition history, studio policies, and direct collector inquiry forms.

The site is designed for collectors, curators, galleries, and art advisors who want to review original works, request print details, join the studio list, or contact the studio about commissions and acquisitions.

## Current Features

- Responsive artist portfolio and artwork catalogue
- Original artwork cards with status, dimensions, medium, year, and inquiry flow
- Collection browsing, search, and sort controls
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
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── favicon.svg
│   └── artwork/
│       ├── beauty-in-becoming.jpg
│       ├── hands-that-wont-let-go.png
│       ├── in-her-prime-green.jpg
│       ├── in-her-prime.jpg
│       ├── loud-silence.png
│       ├── mary-studio-social-preview.png
│       ├── maze-of-uncertainty-sold-2025.jpg
│       ├── maze-of-uncertainty-sold.jpg
│       ├── rare-like-a-blue-rose.jpg
│       ├── stitched-in-time.jpg
│       ├── the-calm-before-clarity.png
│       ├── the-ife-muse.jpg
│       ├── the-weight-of-words.png
│       └── visible-within.png
└── README.md
```

## Local Preview

Because the site is static, it can be opened directly in a browser:

```bash
open index.html
```

For a closer GitHub Pages-style preview, run a local server from the project root:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://127.0.0.1:4173/
```

## Publishing

This project is published through GitHub Pages from the `main` branch with `index.html` at the repository root.

Publishing files:

- `sitemap.xml`: https://kohap.github.io/aurelia-atelier-mary-adesakin/sitemap.xml
- `robots.txt`: https://kohap.github.io/aurelia-atelier-mary-adesakin/robots.txt
- Canonical URL: https://kohap.github.io/aurelia-atelier-mary-adesakin/

## Maintenance Notes

- Keep artwork data inside the `artworks` array in `index.html`.
- Keep image filenames stable once they are published, unless the corresponding artwork record is updated.
- Update `sitemap.xml` when the canonical URL changes.
- Keep Formspree endpoints and analytics snippets in `index.html`.
