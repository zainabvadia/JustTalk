import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        progress: {
          "0%": { transform: "scaleX(0)" },
          "50%": { transform: "scaleX(0.7)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        progress: "progress 10s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;