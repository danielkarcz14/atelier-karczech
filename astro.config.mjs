// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://atelierkarczech.cz',
  output: 'static',
  adapter: netlify(),
  // React je potřeba pro Keystatic admin UI; Keystatic přidává /keystatic rozhraní.
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
