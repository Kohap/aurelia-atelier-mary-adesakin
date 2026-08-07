import crypto from 'node:crypto';

const sendOrderEmail = async ({ to, buyerName, artwork, item, amount, reference }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? 'Mary Adesakin Studio <onboarding@resend.dev>';
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: 'adesakinmary2020@gmail.com',
      subject: `Order confirmed — ${artwork}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <p style="font-size:1.1rem">Dear ${buyerName},</p>
          <p>Thank you for your purchase. Your payment of <strong>${formattedAmount}</strong> has been received.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Artwork</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${artwork}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Item</td><td style="padding:8px 0;border-bottom:1px solid #eee">${item}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Amount paid</td><td style="padding:8px 0;border-bottom:1px solid #eee">${formattedAmount}</td></tr>
            <tr><td style="padding:8px 0;color:#555">Reference</td><td style="padding:8px 0;font-family:monospace;font-size:.9rem">${reference}</td></tr>
          </table>
          <p>The studio will contact you shortly to confirm your shipping address and arrange delivery. If you have any questions, reply to this email or contact <a href="mailto:adesakinmary2020@gmail.com">adesakinmary2020@gmail.com</a>.</p>
          <p style="margin-top:32px">Warm regards,<br><strong>Mary Adesakin Studio</strong></p>
        </div>
      `,
    }),
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing x-paystack-signature header' });
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  const expected = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex');

  if (expected !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(rawBody.toString('utf8'));

  if (event.event === 'charge.success') {
    const { customer, amount, reference, metadata } = event.data;
    const fields = Array.isArray(metadata?.custom_fields) ? metadata.custom_fields : [];
    const field = (name) => fields.find((f) => f.variable_name === name)?.value ?? '';

    try {
      await sendOrderEmail({
        to: customer.email,
        buyerName: field('buyer_name') || customer.first_name || 'Collector',
        artwork: field('artwork'),
        item: field('item'),
        amount,
        reference,
      });
    } catch (err) {
      console.error('Order email failed:', err);
    }
  }

  return res.status(200).json({ received: true });
}
