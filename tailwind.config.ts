import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          /* Static brand colors */
          black: "#000000",
          white: "#FFFFFF",
          gray: "#959596",
          /* Dynamic tokens — respond to .dark class via CSS variables */
          primary: "var(--color-primary)",
          bg: "var(--color-bg)",
          "bg-2": "var(--color-bg-secondary)",
          surface: "var(--color-surface)",
          text: "var(--color-text)",
          muted: "var(--color-text-muted)",
          border: "var(--color-border)",
        },
      },
      fontFamily: {
        en: ['"Uxum Grotesque"', "system-ui", "sans-serif"],
        ar: ['"29LT Zarid Serif"', "system-ui", "serif"],
      },
    },
  },
  plugins: [],
};
