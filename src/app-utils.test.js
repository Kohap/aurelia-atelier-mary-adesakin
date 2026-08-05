import test from 'node:test';
import assert from 'node:assert/strict';

import {
  artworkForHash,
  hasPaymentLink,
  hasPrintPricing,
  hasPrintPaymentLink,
  isAdminPath,
  isPaystackPaymentUrl,
  matchesCatalogueFilter,
  money,
  normalizePrice,
  parseArtworkHash,
  printOptionsFor,
} from './app-utils.js';

test('isAdminPath recognizes only the dedicated admin route', () => {
  assert.equal(isAdminPath('/adesakin/admin'), true);
  assert.equal(isAdminPath('/adesakin/admin/'), true);
  assert.equal(isAdminPath('/aurelia-atelier-mary-adesakin/adesakin/admin/'), true);
  assert.equal(isAdminPath('/aurelia-atelier-mary-adesakin/'), false);
  assert.equal(isAdminPath('/admin'), false);
  assert.equal(isAdminPath(undefined), false);
});

test('parseArtworkHash returns an artwork slug only for valid artwork routes', () => {
  assert.equal(parseArtworkHash('#artwork/the-weight-of-words'), 'the-weight-of-words');
  assert.equal(parseArtworkHash('#artist'), null);
  assert.equal(parseArtworkHash('#admin'), null);
  assert.equal(parseArtworkHash('#artwork/'), null);
});

test('parseArtworkHash safely rejects malformed URL encoding', () => {
  assert.doesNotThrow(() => parseArtworkHash('#artwork/%'));
  assert.equal(parseArtworkHash('#artwork/%'), null);
});

test('artworkForHash clears selection for non-artwork and unknown routes', () => {
  const artworks = [{ slug: 'known-work', title: 'Known Work' }];
  assert.equal(artworkForHash(artworks, '#artwork/known-work'), artworks[0]);
  assert.equal(artworkForHash(artworks, '#artwork/missing'), null);
  assert.equal(artworkForHash(artworks, '#admin'), null);
});

test('normalizePrice accepts positive finite prices and rejects zero or invalid input', () => {
  assert.equal(normalizePrice('1000'), 1000);
  assert.equal(normalizePrice('0'), null);
  assert.equal(normalizePrice('-1'), null);
  assert.equal(normalizePrice('not-a-number'), null);
  assert.equal(normalizePrice(''), null);
});

test('money formats positive prices and leaves missing prices blank', () => {
  assert.equal(money(1000), '$1,000 USD');
  assert.equal(money(null), '');
  assert.equal(money(0), '');
});

test('printOptionsFor returns only complete size-specific print prices', () => {
  const artwork = {
    printOptions: [
      { size: '10 x 12 inches', price: 100 },
      { size: '', price: 70 },
      { size: '16 x 20 inches', price: 0 },
    ],
  };
  assert.deepEqual(printOptionsFor(artwork), [{ size: '10 x 12 inches', price: 100 }]);
  assert.equal(hasPrintPricing(artwork), true);
  assert.equal(hasPrintPricing({ printPrice: 70 }), true);
  assert.equal(hasPrintPricing({ printPrice: null }), false);
});

test('Print includes only catalogue entries with valid print pricing', () => {
  const printWork = { printOptions: [{ size: '10 x 12 inches', price: 100 }] };
  const originalOnly = { originalPrice: 1200, status: 'Available' };
  assert.equal(matchesCatalogueFilter(printWork, 'prints'), true);
  assert.equal(matchesCatalogueFilter(originalOnly, 'prints'), false);
  assert.equal(matchesCatalogueFilter(originalOnly, 'all'), true);
});

test('Paystack links require an approved HTTPS Paystack payment or product page', () => {
  assert.equal(isPaystackPaymentUrl('https://paystack.com/pay/mary-art'), true);
  assert.equal(isPaystackPaymentUrl('https://paystack.com/buy/mary-print'), true);
  assert.equal(isPaystackPaymentUrl('https://checkout.paystack.com/pay/mary-art'), true);
  assert.equal(isPaystackPaymentUrl('http://paystack.com/pay/mary-art'), false);
  assert.equal(isPaystackPaymentUrl('https://paystack.com.example.com/pay/mary-art'), false);
  assert.equal(isPaystackPaymentUrl('https://paystack.com/about'), false);
  assert.equal(isPaystackPaymentUrl('javascript:alert(1)'), false);
});

test('hasPaymentLink requires an available artwork and a valid Paystack URL', () => {
  const available = { status: 'Available', paystackPaymentUrl: 'https://paystack.com/buy/example' };
  assert.equal(hasPaymentLink(available, 'full'), true);
  assert.equal(hasPaymentLink({ ...available, status: 'Sold' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, paystackPaymentUrl: '' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, paystackPaymentUrl: 'https://example.com/pay/art' }, 'full'), false);
  assert.equal(hasPaymentLink({ status: 'Available', paystackDepositUrl: 'https://paystack.com/pay/deposit' }, 'deposit'), true);
});

test('print payment links do not depend on original artwork availability', () => {
  assert.equal(hasPrintPaymentLink({ paystackPaymentUrl: 'https://paystack.com/buy/print' }), true);
  assert.equal(hasPrintPaymentLink({ paystackPaymentUrl: '' }), false);
});
