// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],

  i18n: {
    lazy: true,
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
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
      apiBase: "/api",
    },
  },

  app: {
    head: {
      link: [
        {
          rel: "preload",
          as: "font",
          type: "font/otf",
          href: "/fonts/en/UxumGrotesque-Regular.otf",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/otf",
          href: "/fonts/ar/ZaridSerif-Regular.otf",
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
