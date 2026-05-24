// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxtjs/color-mode"],

  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
    storageKey: "makzn7-color-mode",
  },

  i18n: {
    lazy: true,
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: false,
      cookieCrossOrigin: false,
      redirectOn: "all",
      alwaysRedirect: true,
      fallbackLocale: "en",
    },
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
      link: [
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
