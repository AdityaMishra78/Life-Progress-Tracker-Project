import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))"
      },
      boxShadow: {
        glow: "0 0 40px rgba(120,120,120,.12)"
      },
      backgroundImage: {
        "aurora": "radial-gradient(circle at top left, rgba(120,120,120,.05), transparent 45%), radial-gradient(circle at bottom right, rgba(120,120,120,.05), transparent 45%)"
      }
    }
  },
  plugins: []
};

export default config;
