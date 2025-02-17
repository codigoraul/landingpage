import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static', // Esto generará solo archivos estáticos.
  adapter: node({
    mode: 'standalone', // Configuración para un servidor independiente.
  }),
});