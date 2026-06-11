// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxtjs/color-mode"],

  colorMode: {
    classSuffix: "",
    // Site-wide default is light. The home page opens in dark for first-time
    // visitors via the theme-route-default client plugin; once a visitor
    // toggles the theme their choice is persisted and wins everywhere.
    preference: "light",
    fallback: "light",
    storageKey: "makzn7-color-mode",
  },

  i18n: {
    lazy: true,
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    // Browser-language auto-detection is disabled so the first visit is
    // always English. The chosen locale is persisted/restored via the
    // i18n-persist client plugin (cookie), and otherwise carried in the URL
    // prefix through locale-aware <NuxtLinkLocale> links.
    detectBrowserLanguage: false,
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        dir: "ltr",
        file: "en.json",
      },
      {
        code: "ar",
        iso: "ar-SA",
        name: "Arabic",
        dir: "rtl",
        file: "ar.json",
      },
    ],
  },

  css: [
    "~/assets/css/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:8000/api",
    },
  },

  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      script: [
        {
          // Pre-paint theme: home opens dark for first-time visitors, every
          // other page light. Skipped once the visitor has explicitly toggled
          // the theme (flag set in ContactSection) so their stored choice wins.
          innerHTML:
            "(function(){try{var k='makzn7-color-mode';if(localStorage.getItem('makzn7-theme-user-set')==='1')return;var p=location.pathname,d=(p==='/'||p==='/ar'||p==='/ar/')?'dark':'light';localStorage.setItem(k,d);var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(d);}catch(_){}})();",
          tagPosition: "head",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon/favicon.svg",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon/favicon-96x96.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favicon/site.webmanifest" },
        {
          rel: "preload",
          as: "font",
          type: "font/otf",
          href: "/fonts/en/FunnelDisplay-Regular.ttf",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/otf",
          href: "/fonts/ar/Jali Arabic Regular.ttf",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/ttf",
          href: "/fonts/pixel/DotGothic16-Regular.ttf",
          crossorigin: "",
        },
      ],
    },
  },
});
