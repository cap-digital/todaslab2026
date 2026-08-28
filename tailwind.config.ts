import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // planos
        page: "#f8efe9",
        surface: "#fffdfb",
        sunken: "#f3e9e1",
        // tinta
        ink: "#1c2417",
        "ink-2": "#5b6355",
        "ink-3": "#8a9083",
        // marca / série (paleta validada)
        green: {
          DEFAULT: "#2f9e0e",
          dark: "#1f7a06",
          deep: "#145c04",
          soft: "#dff3d6",
          wash: "#eef8e8",
        },
        purple: {
          DEFAULT: "#a94fd1",
          dark: "#8a35b3",
          soft: "#f0ddf8",
          wash: "#f7edfc",
        },
        lilac: "#d18ee8",
        orange: {
          DEFAULT: "#d97708",
          bright: "#f59c1b",
          soft: "#fdeed8",
        },
        magenta: {
          DEFAULT: "#c9407a",
          soft: "#fae0eb",
        },
        // chrome de gráfico
        grid: "#ece2d9",
        axis: "#d8ccc1",
        track: "#f1e8df",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,36,23,0.04), 0 8px 24px -12px rgba(28,36,23,0.10)",
        pop: "0 12px 32px -8px rgba(28,36,23,0.18)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(6deg)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        floaty: "floaty 6s ease-in-out infinite",
        "spin-slow": "spinSlow 14s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
