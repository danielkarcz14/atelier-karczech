// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://atelierkarczech.cz',
  output: 'static',
  adapter: netlify(),
  // React je potřeba pro Keystatic admin UI; Keystatic přidává /keystatic rozhraní.
  // Sitemap generuje /sitemap-index.xml, na který odkazuje public/robots.txt.
  integrations: [
    react(),
    keystatic(),
    sitemap({
      // Admin rozhraní do mapy stránek nepatří.
      filter: (page) => !page.includes('/keystatic'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
