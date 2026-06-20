import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--bg)",
        surface: "var(--bg-elev)",
        "surface-2": "var(--bg-elev-2)",
        line: "var(--border)",
        "line-strong": "var(--border-strong)",
        primary: "var(--text)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        up: "var(--up)",
        down: "var(--down)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "22px",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
} satisfies Config;
