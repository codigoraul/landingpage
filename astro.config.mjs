import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://diseñopaginas.cl',
  output: 'static',
  outDir: './dist',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    assetsPrefix: './',
  },
  compressHTML: true,
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  vite: {
    build: {
      cssMinify: 'lightningcss',
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [{ protocol: 'https' }],
    domains: ['localhost'],
    format: 'webp',
    quality: 80,
  },
});
