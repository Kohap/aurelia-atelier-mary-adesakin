const checkAdminToken = (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && req.headers['x-admin-token'] !== adminToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkAdminToken(req, res)) return;

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured' });
  }

  const { page = '1', perPage = '20', status = 'success' } = req.query ?? {};

  const url = new URL('https://api.paystack.co/transaction');
  url.searchParams.set('perPage', String(Math.min(Number(perPage) || 20, 50)));
  url.searchParams.set('page', String(Math.max(Number(page) || 1, 1)));
  if (status) url.searchParams.set('status', status);

  try {
    const upstream = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const body = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: body.message ?? 'Paystack error' });
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(body);
  } catch (err) {
    console.error('Transactions fetch error:', err);
    return res.status(500).json({ error: 'Could not fetch transactions' });
  }
}
