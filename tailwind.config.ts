import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ["var(--font-caveat)", "cursive"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        prompt: ["var(--font-prompt)", "sans-serif"],
      },
      colors: {
        // Cream/Beige - #e3ddc5
        cream: {
          50: "#faf9f5",
          100: "#f5f3eb",
          200: "#ebe7d8",
          300: "#e3ddc5",
          400: "#d4cba8",
          500: "#c5b98b",
          600: "#a99b6d",
          700: "#8d7f57",
          800: "#736749",
          900: "#5f553d",
        },
        // Brown - #543f3f
        brown: {
          50: "#f8f5f5",
          100: "#ede7e7",
          200: "#ddd2d2",
          300: "#c4b3b3",
          400: "#a68d8d",
          500: "#8a7070",
          600: "#745c5c",
          700: "#5f4c4c",
          800: "#543f3f",
          900: "#453636",
        },
        // Tan - #ae866c
        tan: {
          50: "#fbf8f5",
          100: "#f5ede6",
          200: "#ead9cb",
          300: "#dbbfa8",
          400: "#c9a082",
          500: "#ae866c",
          600: "#9a7059",
          700: "#805b49",
          800: "#6a4c3f",
          900: "#583f35",
        },
      },
    },
  },
  plugins: [],
};

export default config;
