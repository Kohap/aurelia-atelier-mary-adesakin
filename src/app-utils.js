export const isPositivePrice = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;

export const money = (value) => (
  isPositivePrice(value) ? `$${value.toLocaleString('en-US')} USD` : ''
);

export const normalizePrice = (value) => {
  if (value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

export const parseArtworkHash = (hash) => {
  if (!hash.startsWith('#artwork/')) return null;

  try {
    return decodeURIComponent(hash.slice('#artwork/'.length)) || null;
  } catch {
    return null;
  }
};

export const artworkForHash = (artworks, hash) => {
  const slug = parseArtworkHash(hash);
  return slug ? artworks.find((artwork) => artwork.slug === slug) || null : null;
};

export const paymentUrlFor = (artwork, type) => (
  type === 'deposit' ? artwork?.stripeDepositUrl : artwork?.stripePaymentUrl
);

export const hasPaymentLink = (artwork, type) => {
  if (artwork?.status !== 'Available') return false;

  const url = paymentUrlFor(artwork, type);
  if (typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && ['buy.stripe.com', 'checkout.stripe.com'].includes(parsed.hostname);
  } catch {
    return false;
  }
};
