import { readdir, stat } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const sourceDirectory = fileURLToPath(new URL('../sources/artwork/', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../public/assets/artwork/', import.meta.url));
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png']);
const excludedFiles = new Set(['mary-studio-social-preview.png', 'mary-studio-social-preview.jpg']);
const files = await readdir(sourceDirectory);

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (!supportedExtensions.has(extension) || excludedFiles.has(file)) continue;

  const input = join(sourceDirectory, file);
  const baseName = parse(file).name;
  const output = join(outputDirectory, `${baseName}.webp`);
  const smallOutput = join(outputDirectory, `${baseName}-480.webp`);

  const pipeline = await sharp(input).rotate();
  const metadata = await pipeline.metadata();

  await pipeline
    .clone()
    .resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 })
    .toFile(output);

  if (metadata.width > 480) {
    await pipeline
      .clone()
      .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(smallOutput);
  } else {
    await sharp(output).toFile(smallOutput);
  }

  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const small = await stat(smallOutput);
  const reduction = Math.round((1 - after.size / before.size) * 100);
  process.stdout.write(`${file} -> ${baseName}.webp (${reduction}% smaller) + ${baseName}-480.webp (${Math.round(small.size / 1024)} KB)\n`);
}
