import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  // GitHub mode: content is edited live at /keystatic, authenticated via GitHub,
  // and changes are committed to the repository. Requires a GitHub App and the
  // KEYSTATIC_GITHUB_CLIENT_ID/SECRET and KEYSTATIC_SECRET env vars (see README).
  // For purely local editing, switch to storage: { kind: 'local' }.
  storage: {
    kind: 'github',
    repo: { owner: 'danielkarcz14', name: 'atelier-karczech' },
  },

  ui: {
    brand: { name: 'Atelier Karczech' },
  },

  collections: {
    portfolio: collection({
      label: 'Portfolio',
      slugField: 'title',
      path: 'src/content/portfolio/*',
      format: { data: 'yaml' },
      columns: ['title', 'category'],
      entryLayout: 'form',
      schema: {
        title: fields.slug({ name: { label: 'Název projektu' } }),
        category: fields.text({
          label: 'Kategorie',
          description: 'Např. Interiérový design, Exteriérový návrh, Architektonická studie',
        }),
        order: fields.integer({
          label: 'Pořadí',
          description: 'Nižší číslo = dříve v galerii',
          defaultValue: 0,
        }),
        image: fields.image({
          label: 'Náhledový obrázek (menší, do karty)',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: true },
        }),
        imageFull: fields.image({
          label: 'Plný obrázek (velký, do zvětšení)',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: true },
        }),
        alt: fields.text({ label: 'Popis obrázku (alt text)' }),
      },
    }),

    team: collection({
      label: 'Tým',
      slugField: 'name',
      path: 'src/content/team/*',
      format: { data: 'yaml' },
      columns: ['name', 'role'],
      entryLayout: 'form',
      schema: {
        name: fields.slug({ name: { label: 'Jméno' } }),
        role: fields.text({ label: 'Pozice / role' }),
        order: fields.integer({ label: 'Pořadí', defaultValue: 0 }),
        photo: fields.image({
          label: 'Fotka',
          directory: 'public/images/team',
          publicPath: '/images/team/',
        }),
      },
    }),

    bim: collection({
      label: 'BIM vizualizace',
      slugField: 'title',
      path: 'src/content/bim/*',
      format: { data: 'yaml' },
      columns: ['title'],
      entryLayout: 'form',
      schema: {
        title: fields.slug({ name: { label: 'Název vizualizace' } }),
        order: fields.integer({
          label: 'Pořadí',
          description: 'Nižší číslo = dříve v galerii',
          defaultValue: 0,
        }),
        image: fields.image({
          label: 'Náhledový obrázek (menší, do galerie)',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: true },
        }),
        imageFull: fields.image({
          label: 'Plný obrázek (velký, do zvětšení)',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: true },
        }),
        alt: fields.text({ label: 'Popis obrázku (alt text)' }),
      },
    }),

    process: collection({
      label: 'Proces (kroky spolupráce)',
      slugField: 'title',
      path: 'src/content/process/*',
      format: { data: 'yaml' },
      columns: ['number', 'title'],
      entryLayout: 'form',
      schema: {
        number: fields.text({
          label: 'Číslo kroku',
          description: 'Např. 01, 02, …',
        }),
        title: fields.slug({ name: { label: 'Název kroku' } }),
        order: fields.integer({ label: 'Pořadí', defaultValue: 0 }),
        body: fields.text({ label: 'Popis', multiline: true }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Obecné nastavení',
      path: 'src/content/settings/general',
      format: { data: 'yaml' },
      schema: {
        heroTitlePlain: fields.text({
          label: 'Nadpis hero – běžná část',
          description: 'První, nebarevná část velkého nadpisu.',
          multiline: true,
        }),
        heroTitleAccent: fields.text({
          label: 'Nadpis hero – zvýrazněná část',
          description: 'Část nadpisu kurzívou v akcentní barvě.',
          multiline: true,
        }),
        heroSubtitle: fields.text({ label: 'Hero – podtitul', multiline: true }),
        contactPerson: fields.text({ label: 'Kontaktní osoba' }),
        contactPhone: fields.text({ label: 'Telefon' }),
        contactPhoneHref: fields.text({
          label: 'Telefon – odkaz (tel:)',
          description: 'Např. +420732993086',
        }),
        contactEmail: fields.text({ label: 'E-mail' }),
      },
    }),
  },
});
