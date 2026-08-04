export const isPositivePrice = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;

export const money = (value) => (
  isPositivePrice(value) ? `$${value.toLocaleString('en-US')} USD` : ''
);

export const normalizePrice = (value) => {
  if (value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

export const printOptionsFor = (artwork) => (
  Array.isArray(artwork?.printOptions)
    ? artwork.printOptions.filter((option) => (
      typeof option?.size === 'string' && option.size.trim() && isPositivePrice(option.price)
    ))
    : []
);

export const hasPrintPricing = (artwork) => (
  printOptionsFor(artwork).length > 0 || isPositivePrice(artwork?.printPrice)
);

export const matchesCatalogueFilter = (artwork, filter) => (
  filter === 'all' ||
  (filter === 'prints' && hasPrintPricing(artwork)) ||
  (filter === 'priced' && artwork?.status === 'Available' && isPositivePrice(artwork?.originalPrice)) ||
  (filter === 'request' && artwork?.status !== 'Sold' && !isPositivePrice(artwork?.originalPrice)) ||
  (filter === '2026' && artwork?.year === '2026')
);

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

export const isAdminPath = (pathname) => {
  if (typeof pathname !== 'string') return false;
  return pathname.replace(/\/+$/, '').endsWith('/adesakin/admin');
};

export const paymentUrlFor = (artwork, type) => (
  type === 'deposit' ? artwork?.paystackDepositUrl : artwork?.paystackPaymentUrl
);

export const printPaymentUrlFor = (option) => option?.paystackPaymentUrl;

export const isPaystackPaymentUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;

  try {
    const parsed = new URL(value);
    const approvedHost = parsed.hostname === 'paystack.com' || parsed.hostname.endsWith('.paystack.com');
    const approvedPath = parsed.pathname.startsWith('/pay/') || parsed.pathname.startsWith('/buy/');
    return parsed.protocol === 'https:' && approvedHost && approvedPath;
  } catch {
    return false;
  }
};

export const hasPaymentLink = (artwork, type) => {
  if (artwork?.status !== 'Available') return false;
  return isPaystackPaymentUrl(paymentUrlFor(artwork, type));
};

export const hasPrintPaymentLink = (option) => isPaystackPaymentUrl(printPaymentUrlFor(option));
