import { config, collection, singleton, fields } from '@keystatic/core';

// GitHub mode: content is edited live at /keystatic, authenticated via GitHub,
// and changes are committed to the repository. Requires a GitHub App and the
// KEYSTATIC_GITHUB_CLIENT_ID/SECRET and KEYSTATIC_SECRET env vars (see README).
// For purely local editing, switch to storage: { kind: 'local' }.

// Keystatic resolves a collection entry's images inside a per-entry folder
// (public/images/<slug>/…). Singletons have no slug, so their images sit
// directly in public/images/. Stored values always include the public path,
// which is what makes the existing image show up in the admin form.
const collectionImage = (label: string, description?: string, isRequired = false) =>
  fields.image({
    label,
    description,
    directory: 'public/images',
    publicPath: '/images/',
    ...(isRequired ? { validation: { isRequired: true } } : {}),
  });

const siteImage = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: 'public/images',
    publicPath: '/images/',
  });

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'danielkarcz14', name: 'atelier-karczech' },
  },

  ui: {
    brand: { name: 'Ateliér Karczech' },
    navigation: {
      Obsah: ['portfolio', 'bim', 'process', 'team'],
      'Texty webu': ['hero', 'sections'],
      'Nastavení': ['contact', 'settings'],
    },
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
        image: collectionImage(
          'Náhledový obrázek (menší, do karty)',
          'Zobrazuje se na kartě v galerii.',
          true,
        ),
        imageFull: collectionImage(
          'Plný obrázek (velký, do zvětšení)',
          'Otevře se po kliknutí na kartu. Když zůstane prázdný, použije se náhledový obrázek.',
        ),
        alt: fields.text({
          label: 'Popis obrázku (alt text)',
          description: 'Krátký popis pro čtečky a vyhledávače. Prázdné = použije se název projektu.',
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
        image: collectionImage(
          'Náhledový obrázek (menší, do galerie)',
          'Zobrazuje se ve slideru.',
          true,
        ),
        imageFull: collectionImage(
          'Plný obrázek (velký, do zvětšení)',
          'Otevře se po kliknutí. Když zůstane prázdný, použije se náhledový obrázek.',
        ),
        alt: fields.text({
          label: 'Popis obrázku (alt text)',
          description: 'Prázdné = použije se název vizualizace.',
        }),
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
          description:
            'Nahrané fotky jsou automaticky komprimovány a optimalizovány při buildu. Ideální poměr 3:4 (na výšku).',
          directory: 'src/assets/team',
          publicPath: '/src/assets/team/',
        }),
      },
    }),
  },

  singletons: {
    hero: singleton({
      label: 'Hero (úvodní obrazovka)',
      path: 'src/content/settings/hero',
      format: { data: 'yaml' },
      schema: {
        titlePlain: fields.text({
          label: 'Nadpis – běžná část',
          description: 'První, nebarevná část velkého nadpisu.',
          multiline: true,
        }),
        titleAccent: fields.text({
          label: 'Nadpis – zvýrazněná část',
          description: 'Část nadpisu kurzívou v akcentní barvě.',
          multiline: true,
        }),
        subtitle: fields.text({ label: 'Podtitul', multiline: true }),
        image: siteImage(
          'Obrázek na pozadí',
          'Velká fotka přes celou úvodní obrazovku. Ideálně na šířku, min. 2000 px.',
        ),
        imageAlt: fields.text({
          label: 'Popis obrázku na pozadí (alt text)',
          defaultValue: 'Ateliér Karczech – exteriér',
        }),
        primaryCtaLabel: fields.text({
          label: 'Hlavní tlačítko – text',
          defaultValue: 'Domluvit konzultaci',
        }),
        primaryCtaHref: fields.text({
          label: 'Hlavní tlačítko – odkaz',
          description: 'Kotva na sekci (#kontakt, #portfolio) nebo celá adresa.',
          defaultValue: '#kontakt',
        }),
        secondaryCtaLabel: fields.text({
          label: 'Vedlejší tlačítko – text',
          defaultValue: 'Portfolio',
        }),
        secondaryCtaHref: fields.text({
          label: 'Vedlejší tlačítko – odkaz',
          defaultValue: '#portfolio',
        }),
        marquee: fields.array(fields.text({ label: 'Položka' }), {
          label: 'Běžící pás pod hero sekcí',
          description: 'Klíčová slova, která se donekonečna posouvají. Doporučeno 4–8 položek.',
          itemLabel: (props) => props.value || 'Položka',
        }),
      },
    }),

    sections: singleton({
      label: 'Nadpisy sekcí',
      path: 'src/content/settings/sections',
      format: { data: 'yaml' },
      schema: {
        portfolio: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '01',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: 'Portfolio',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Vybrané projekty',
            }),
            description: fields.text({
              label: 'Popisek',
              multiline: true,
              defaultValue:
                'Každý projekt je originální odpovědí na místo, kontext a přání klienta.',
            }),
            dragHint: fields.text({
              label: 'Nápověda pod galerií',
              defaultValue: 'Táhněte pro další',
            }),
          },
          { label: 'Portfolio' },
        ),

        process: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '02',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: 'Proces',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Jak to u nás funguje',
            }),
            description: fields.text({
              label: 'Popisek',
              multiline: true,
              defaultValue:
                'Od prvního setkání až po hotovou stavbu vás provedeme každým krokem. Transparentně, profesionálně a vždy s ohledem na váš záměr.',
            }),
            ctaLabel: fields.text({ label: 'Tlačítko – text', defaultValue: 'Začít spolupráci' }),
            ctaHref: fields.text({ label: 'Tlačítko – odkaz', defaultValue: '#kontakt' }),
          },
          { label: 'Proces' },
        ),

        bim: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '03',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: 'Technologie',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Pracujeme v BIMu',
            }),
            description: fields.text({
              label: 'Popisek',
              multiline: true,
              defaultValue:
                'Navrhujeme v BIMu. Díky tomu máme pod kontrolou každý detail – od prvního náčrtu po realizaci.',
            }),
            stats: fields.array(
              fields.object({
                value: fields.text({
                  label: 'Hodnota',
                  description:
                    'Čistě číslo (např. 100) se dopočítá animací. Cokoli jiného (3D, LOD) se zobrazí rovnou.',
                }),
                suffix: fields.text({
                  label: 'Přípona za hodnotou',
                  description: 'Např. %, +, m². Nechte prázdné, pokud žádná není.',
                }),
                label: fields.text({ label: 'Popisek pod hodnotou' }),
              }),
              {
                label: 'Čísla vedle textu',
                description: 'Doporučeny 3 položky – víc se do řádku nevejde.',
                itemLabel: (props) => props.fields.label.value || 'Údaj',
              },
            ),
          },
          { label: 'BIM' },
        ),

        team: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '04',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: 'Ateliér',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Kdo za tím stojí',
            }),
          },
          { label: 'Tým' },
        ),

        cta: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: '',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Máte v hlavě projekt?',
            }),
            text: fields.text({
              label: 'Text pod nadpisem',
              multiline: true,
              defaultValue:
                'Ozvěte se nám a nezávazně probereme vaše možnosti. První konzultace je zdarma.',
            }),
            buttonLabel: fields.text({
              label: 'Tlačítko – text',
              defaultValue: 'Domluvit konzultaci zdarma',
            }),
            buttonHref: fields.text({ label: 'Tlačítko – odkaz', defaultValue: '#kontakt' }),
            image: siteImage('Obrázek na pozadí pruhu', 'Zobrazuje se ztlumeně za textem.'),
          },
          { label: 'Výzva k akci (pruh nad kontaktem)' },
        ),

        contact: fields.object(
          {
            index: fields.text({
              label: 'Číslo sekce',
              description: 'Malé číslo vlevo nad nadpisem. Prázdné = nezobrazí se.',
              defaultValue: '05',
            }),
            eyebrow: fields.text({
              label: 'Popisek sekce',
              description: 'Krátké slovo vedle čísla. Prázdné = nezobrazí se.',
              defaultValue: 'Kontakt',
            }),
            title: fields.text({
              label: 'Nadpis',
              description: 'Enterem lze nadpis zalomit na víc řádků.',
              multiline: true,
              defaultValue: 'Pojďme to probrat',
            }),
            formTitle: fields.text({ label: 'Nadpis formuláře', defaultValue: 'Napište nám' }),
            submitLabel: fields.text({
              label: 'Tlačítko formuláře',
              defaultValue: 'Odeslat zprávu',
            }),
          },
          { label: 'Kontakt' },
        ),
      },
    }),

    contact: singleton({
      label: 'Kontaktní údaje',
      path: 'src/content/settings/contact',
      format: { data: 'yaml' },
      schema: {
        person: fields.text({ label: 'Kontaktní osoba' }),
        phone: fields.text({
          label: 'Telefon',
          description: 'Jak se zobrazí na webu, např. 732 993 086',
        }),
        phoneHref: fields.text({
          label: 'Telefon – pro prokliknutí',
          description: 'Bez mezer, s předvolbou. Např. +420732993086',
        }),
        email: fields.text({ label: 'E-mail' }),
        addressLine1: fields.text({ label: 'Adresa – ulice a číslo' }),
        addressLine2: fields.text({ label: 'Adresa – PSČ a město' }),
        showMap: fields.checkbox({
          label: 'Zobrazit mapu',
          description: 'Vypnutím se mapa z webu skryje.',
          defaultValue: true,
        }),
        mapLat: fields.text({
          label: 'Mapa – zeměpisná šířka',
          description: 'Např. 49.7301588. Souřadnice najdete na openstreetmap.org.',
        }),
        mapLon: fields.text({
          label: 'Mapa – zeměpisná délka',
          description: 'Např. 18.6167863',
        }),
      },
    }),

    settings: singleton({
      label: 'Obecné nastavení',
      path: 'src/content/settings/general',
      format: { data: 'yaml' },
      schema: {
        logoPlain: fields.text({
          label: 'Logo – první část',
          description: 'Bílá část nápisu v navigaci a patičce.',
          defaultValue: 'Ateliér',
        }),
        logoAccent: fields.text({
          label: 'Logo – druhá část',
          description: 'Část v akcentní barvě.',
          defaultValue: 'Karczech',
        }),
        siteTitle: fields.text({
          label: 'Titulek stránky',
          description: 'Zobrazí se v záložce prohlížeče a jako nadpis ve vyhledávání.',
          defaultValue: 'Ateliér Karczech | Architektura & Projekce',
        }),
        siteDescription: fields.text({
          label: 'Popis stránky pro vyhledávače',
          description: 'Ideálně 120–160 znaků.',
          multiline: true,
        }),
        ogImage: siteImage(
          'Náhledový obrázek pro sdílení',
          'Zobrazí se při sdílení odkazu na Facebooku či WhatsAppu. Ideálně 1200×630 px.',
        ),
        favicon: fields.image({
          label: 'Favicon (ikona v záložce prohlížeče)',
          description:
            'Malý čtvercový obrázek, ideálně 512×512 px (PNG). Když zůstane prázdné, použije se výchozí.',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Text odkazu' }),
            href: fields.text({ label: 'Cíl', description: 'Kotva na sekci, např. #portfolio' }),
          }),
          {
            label: 'Odkazy v navigaci',
            description: 'Pořadí odpovídá pořadí v menu.',
            itemLabel: (props) => props.fields.label.value || 'Odkaz',
          },
        ),
        navCtaLabel: fields.text({
          label: 'Tlačítko v navigaci – text',
          defaultValue: 'Domluvit konzultaci',
        }),
        navCtaHref: fields.text({
          label: 'Tlačítko v navigaci – odkaz',
          defaultValue: '#kontakt',
        }),
        footerCopyright: fields.text({
          label: 'Copyright v patičce',
          description: 'Rok se doplní automaticky.',
          defaultValue: 'Ateliér Karczech',
        }),
      },
    }),
  },
});
