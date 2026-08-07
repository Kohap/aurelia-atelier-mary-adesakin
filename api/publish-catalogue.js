import { put } from '@vercel/blob';

const checkAdminToken = (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && req.headers['x-admin-token'] !== adminToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkAdminToken(req, res)) return;

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'application/json required' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    // Validate JSON before storing
    JSON.parse(body.toString('utf8'));

    const blob = await put('artworks.json', body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Publish catalogue error:', err);
    return res.status(500).json({ error: 'Publish failed' });
  }
}
