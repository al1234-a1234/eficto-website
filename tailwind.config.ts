import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        eficto: {
          green: {
            DEFAULT: "#1E4A34",
            dark: "#132F21",
            light: "#2C6B4B",
          },
          gold: {
            DEFAULT: "#CBA97D",
            light: "#E4D2B0",
            dark: "#AB8A5E",
            deep: "#7A5C36",
          },
          cream: "#F3E9D7",
          ivory: "#FBF6EC",
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
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
