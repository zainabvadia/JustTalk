import type { Config } from "tailwindcss";

const config: Config = {
  // 1. This tells Tailwind where to look for your class names
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Added just in case you use a src folder
  ],
  theme: {
    extend: {
      // 2. Custom animations for your ProcessingScreen
      keyframes: {
        progress: {
          "0%": { transform: "scaleX(0)" },
          "50%": { transform: "scaleX(0.7)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        // Use 'animate-progress' in your HTML to trigger this
        progress: "progress 10s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;