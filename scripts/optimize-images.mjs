import { readdir, stat } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const sourceDirectory = fileURLToPath(new URL('../../sources/artwork/', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../public/assets/artwork/', import.meta.url));
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png']);
const excludedFiles = new Set(['mary-studio-social-preview.png', 'mary-studio-social-preview.jpg']);
const files = await readdir(sourceDirectory);

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (!supportedExtensions.has(extension) || excludedFiles.has(file)) continue;

  const input = join(sourceDirectory, file);
  const output = join(outputDirectory, `${parse(file).name}.webp`);

  await sharp(input)
    .rotate()
    .resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 })
    .toFile(output);

  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const reduction = Math.round((1 - after.size / before.size) * 100);
  process.stdout.write(`${file} -> ${parse(output).base} (${reduction}% smaller)\n`);
}
