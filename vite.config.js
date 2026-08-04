import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

const base = process.env.VERCEL ? '/' : '/aurelia-atelier-mary-adesakin/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        admin: resolve(rootDir, 'adesakin/admin/index.html'),
      },
    },
  },
});
