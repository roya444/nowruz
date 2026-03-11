import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        spring: "#4CAF50",
        gold: "#FFD700",
        saffron: "#FF9800",
        rose: "#E91E63",
        sky: "#03A9F4",
        charcoal: "#333333",
      },
    },
  },
  plugins: [],
};
export default config;
