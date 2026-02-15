import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#54EA62",
          black: "#000000",
          white: "#FFFFFF",
          gray: "#959596",
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
