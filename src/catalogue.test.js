import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const catalogue = JSON.parse(
  await readFile(new URL('../public/data/artworks.json', import.meta.url), 'utf8'),
);

const bySlug = new Map(catalogue.map((artwork) => [artwork.slug, artwork]));

test('collector catalogue contains the confirmed original and print prices', () => {
  const expected = {
    'the-weight-of-words': [2500, [['10 x 12 inches', 100], ['16 x 20 inches', 200]]],
    'maze-of-uncertainty': [null, [['10 x 12 inches', 100]]],
    'the-ife-muse': [1200, [['10 x 12 inches', 100]]],
    'beauty-in-becoming': [700, [['10 x 12 inches', 70]]],
    'loud-silence': [3000, []],
    'rare-like-a-blue-rose': [900, [['10 x 12 inches', 70]]],
    'the-calm-before-clarity': [1000, [['10 x 12 inches', 100]]],
    'hands-that-wont-let-go': [2500, [['10 x 12 inches', 100]]],
    'the-weight': [null, [['10 x 12 inches', 100]]],
    'in-her-prime': [null, [['10 x 12 inches', 100]]],
    'stitched-in-time': [null, [['10 x 12 inches', 100]]],
  };

  for (const [slug, [originalPrice, printOptions]] of Object.entries(expected)) {
    const artwork = bySlug.get(slug);
    assert.ok(artwork, `Missing artwork: ${slug}`);
    assert.equal(artwork.originalPrice, originalPrice, `${slug} original price`);
    assert.deepEqual(
      (artwork.printOptions || []).map(({ size, price }) => [size, price]),
      printOptions,
      `${slug} print prices`,
    );
  }
});
