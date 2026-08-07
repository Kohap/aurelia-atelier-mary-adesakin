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

  const filename = new URL(req.url, `https://${req.headers.host}`).searchParams.get('filename');
  if (!filename || !/^[a-z0-9][a-z0-9-]*\.webp$/.test(filename)) {
    return res.status(400).json({ error: 'Valid filename required (slug.webp)' });
  }

  if (req.headers['content-type'] !== 'image/webp') {
    return res.status(415).json({ error: 'Only image/webp accepted' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const blob = await put(`artwork/${filename}`, body, {
      access: 'public',
      contentType: 'image/webp',
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Blob upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
