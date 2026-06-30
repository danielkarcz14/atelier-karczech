import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Content is managed by Keystatic and read via @keystatic/core/reader in index.astro.
// These definitions only tell Astro that src/content/* are YAML data collections,
// so it does not try to treat them as Markdown.
const dataCollection = (folder: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: `./src/content/${folder}` }),
  });

export const collections = {
  portfolio: dataCollection('portfolio'),
  team: dataCollection('team'),
  process: dataCollection('process'),
  bim: dataCollection('bim'),
  settings: dataCollection('settings'),
};
