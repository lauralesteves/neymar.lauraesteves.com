export type Locale = 'pt' | 'en' | 'es';

export interface AlternateSite {
  locale: Locale;
  flag: string;
  label: string;
}

export interface Translations {
  lang: string;
  siteTitle: string;
  metaDescription: string;
  dragInstruction: {
    desktop: string;
    mobile: string;
  };
  audio: {
    activate: string;
    deactivate: string;
    off: string;
    on: string;
  };
  nav: {
    lauraUrl: string;
  };
  footer: {
    tagline: string;
    madeWith: string;
  };
  github: {
    ariaLabel: string;
  };
  alternates: AlternateSite[];
}

const pt: Translations = {
  lang: 'pt-BR',
  siteTitle: 'Neymar - Tá Doendo Demais',
  metaDescription:
    "Neymar caindo sem parar ao som de 'tá doendo demais'. Assista o craque do tombo em ação neste tributo interativo e sonoro. Mais um site de extrema utilidade pública.",
  dragInstruction: {
    desktop: 'Clique e arraste o Neymar caído para jogá-lo de novo',
    mobile: 'Toque e arraste o Neymar caído para jogá-lo de novo',
  },
  audio: {
    activate: 'Ativar som',
    deactivate: 'Desativar som',
    off: 'Som desligado',
    on: 'Som ligado',
  },
  nav: {
    lauraUrl: 'https://lauraesteves.com',
  },
  footer: {
    tagline: 'Mais um site de extrema utilidade pública',
    madeWith: 'Feito com ❤️ e ☕️ por',
  },
  github: {
    ariaLabel: 'Ver código-fonte no GitHub',
  },
  alternates: [
    { locale: 'en', flag: '/images/flags/en.svg', label: 'English' },
    { locale: 'es', flag: '/images/flags/es.svg', label: 'Español' },
  ],
};

const en: Translations = {
  lang: 'en',
  siteTitle: 'Neymar - It Hurts So Much',
  metaDescription:
    "Neymar falling nonstop to the sound of 'it hurts so much'. Watch the king of dives in action in this interactive and sonic tribute. Yet another website of extreme public utility.",
  dragInstruction: {
    desktop: 'Click and drag the fallen Neymar to throw him again',
    mobile: 'Tap and drag the fallen Neymar to throw him again',
  },
  audio: {
    activate: 'Turn on sound',
    deactivate: 'Turn off sound',
    off: 'Sound off',
    on: 'Sound on',
  },
  nav: {
    lauraUrl: 'https://lauraesteves.com/en',
  },
  footer: {
    tagline: 'Yet another website of extreme public utility',
    madeWith: 'Made with ❤️ and ☕️ by',
  },
  github: {
    ariaLabel: 'View source on GitHub',
  },
  alternates: [
    { locale: 'pt', flag: '/images/flags/pt.svg', label: 'Português' },
    { locale: 'es', flag: '/images/flags/es.svg', label: 'Español' },
  ],
};

const es: Translations = {
  lang: 'es',
  siteTitle: 'Neymar - Me Duele Demasiado',
  metaDescription:
    "Neymar cayendo sin parar al son de 'me duele demasiado'. Mira al crack del piscinazo en acción en este tributo interactivo y sonoro. Otro sitio web de extrema utilidad pública.",
  dragInstruction: {
    desktop: 'Haz clic y arrastra al Neymar caído para lanzarlo de nuevo',
    mobile: 'Toca y arrastra al Neymar caído para lanzarlo de nuevo',
  },
  audio: {
    activate: 'Activar sonido',
    deactivate: 'Desactivar sonido',
    off: 'Sonido apagado',
    on: 'Sonido encendido',
  },
  nav: {
    lauraUrl: 'https://lauraesteves.com/es',
  },
  footer: {
    tagline: 'Otro sitio web de extrema utilidad pública',
    madeWith: 'Hecho con ❤️ y ☕️ por',
  },
  github: {
    ariaLabel: 'Ver código fuente en GitHub',
  },
  alternates: [
    { locale: 'pt', flag: '/images/flags/pt.svg', label: 'Português' },
    { locale: 'en', flag: '/images/flags/en.svg', label: 'English' },
  ],
};

export const translations: Record<Locale, Translations> = { pt, en, es };
