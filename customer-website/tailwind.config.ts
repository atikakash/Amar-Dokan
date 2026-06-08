import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--color-border) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        leaf: {
          50: "#ecfdf3",
          100: "#d2f9df",
          500: "#22a861",
          600: "#16834a",
          700: "#11673d",
          900: "#073b25"
        },
        berry: {
          500: "#e23d6f",
          600: "#c92357"
        },
        sky: {
          500: "#2563eb",
          600: "#1d4ed8"
        },
        amber: "#d89418",
        danger: "#dc2626",
        success: "#16a34a"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.06)",
        lift: "0 18px 50px rgba(15, 23, 42, 0.14)",
        glow: "0 20px 60px rgba(34, 168, 97, 0.25)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
