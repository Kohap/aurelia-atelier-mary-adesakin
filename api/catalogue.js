import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'artworks', limit: 1 });
    if (!blobs.length) {
      return res.status(404).end();
    }

    const upstream = await fetch(blobs[0].url);
    if (!upstream.ok) return res.status(502).end();

    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    return res.status(200).end(body);
  } catch (err) {
    console.error('Catalogue fetch error:', err);
    return res.status(500).end();
  }
}
