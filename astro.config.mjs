import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  base: './',
  build: {
    assets: '_assets'
  },
  vite: {
    base: './',
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
        }
      }
    }
  },
  adapter: node({
    mode: 'standalone'
  })
});