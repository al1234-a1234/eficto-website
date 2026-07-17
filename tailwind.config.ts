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
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(19, 47, 33, 0.45)",
        elegant: "0 16px 48px -18px rgba(23, 64, 31, 0.28)",
        premium: "0 6px 24px -8px rgba(23, 64, 31, 0.16)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
