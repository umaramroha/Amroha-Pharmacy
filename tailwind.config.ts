import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F766E", light: "#14B8A6", dark: "#115E59" },
        secondary: { DEFAULT: "#F59E0B", light: "#FCD34D", dark: "#D97706" },
        background: { DEFAULT: "#FEFCF9", dark: "#1A1A1A" },
        surface: { DEFAULT: "#FFFFFF", dark: "#2A2A2A" },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
