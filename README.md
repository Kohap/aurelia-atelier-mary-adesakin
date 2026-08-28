# Arteli — Adesakin Mary Damilola

Studio site for Nigerian thread painter Adesakin Mary Damilola.

Live: [https://www.arteli.site/](https://www.arteli.site/)

## Stack

TanStack Start (Vite) on Vercel. Collector pages are English / Yoruba / French. Originals and prints check out through Paystack Inline (NGN). The Paystack webhook and Blob catalogue endpoints in `api/` stay in place.

## Scripts

```bash
npm install
npm run dev      # local atelier
npm run build    # Vercel production
```

## Env

Copy `.env.example`. Public Paystack key is safe in the client. `PAYSTACK_SECRET_KEY`, `ADMIN_TOKEN`, `BLOB_READ_WRITE_TOKEN`, and `RESEND_API_KEY` stay on Vercel only — never commit them.
