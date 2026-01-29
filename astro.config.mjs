// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://nadxus.github.io', // Nombre del repositorio (case-sensitive)
  base: '/Portfolio/', // Agregamos slash final para evitar errores de concatenación
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  adapter: node({
    mode: 'standalone'
  })
});