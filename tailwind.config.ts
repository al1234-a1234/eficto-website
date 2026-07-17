import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Sampled directly from eficto's real logo files (public/logo/*) — not an approximation.
        eficto: {
          green: {
            DEFAULT: "#235C31",
            dark: "#17401F",
            deep: "#102B17",
            light: "#318145",
          },
          gold: {
            DEFAULT: "#D7B790",
            light: "#E7D4BD",
            dark: "#8C6738",
            deep: "#79562C",
          },
          cream: "#F0E6D8",
          ivory: "#F8F3EC",
          alert: "#9E3B34",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        "arabic-display": ["var(--font-arabic-display)", "serif"],
        "arabic-body": ["var(--font-arabic-body)", "sans-serif"],
      },
      backgroundImage: {
        arch: "radial-gradient(120% 120% at 50% 0%, rgba(203,169,125,0.18) 0%, rgba(30,74,52,0) 60%)",
        forest: "linear-gradient(160deg, #17401F 0%, #235C31 55%, #102B17 100%)",
        champagne: "linear-gradient(180deg, #FFFFFF 0%, #F8F3EC 100%)",
      },
      boxShadow: {
        soft: "0 24px 70px -24px rgba(16, 43, 23, 0.4)",
        elegant: "0 20px 56px -22px rgba(16, 43, 23, 0.22)",
        premium: "0 10px 32px -12px rgba(16, 43, 23, 0.1)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
