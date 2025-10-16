import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: './dist',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      assetsInlineLimit: 4096
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    remotePatterns: [{ protocol: 'https' }],
    domains: ['localhost'],
    format: 'webp',
    quality: 80
  }
});