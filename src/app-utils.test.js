import test from 'node:test';
import assert from 'node:assert/strict';

import {
  artworkForHash,
  hasPaymentLink,
  money,
  normalizePrice,
  parseArtworkHash,
} from './app-utils.js';

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

test('hasPaymentLink requires an available artwork and an approved HTTPS Stripe URL', () => {
  const available = { status: 'Available', stripePaymentUrl: 'https://buy.stripe.com/example' };
  assert.equal(hasPaymentLink(available, 'full'), true);
  assert.equal(hasPaymentLink({ ...available, status: 'Sold' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, stripePaymentUrl: '' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, stripePaymentUrl: 'javascript:alert(1)' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, stripePaymentUrl: 'https://example.com/pay' }, 'full'), false);
  assert.equal(hasPaymentLink({ ...available, stripePaymentUrl: 'https://checkout.stripe.com/example' }, 'full'), true);
});
