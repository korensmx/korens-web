import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        korens: {
          bg: "#070A0F",
          card: "#0D131F",
          cardHover: "#131C2E",
          border: "#1E293B",
          borderGlow: "#334155",
          orange: {
            DEFAULT: "#FF6A00",
            light: "#FF8533",
            dark: "#D95700",
            glow: "rgba(255, 106, 0, 0.4)",
          },
          navy: {
            DEFAULT: "#0F1E36",
            deep: "#080F1C",
            accent: "#1A3258",
          },
          silver: "#94A3B8",
          platinum: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glowOrange: "0 0 35px -5px rgba(255, 106, 0, 0.35)",
        glowOrangeSubtle: "0 0 20px -3px rgba(255, 106, 0, 0.2)",
        glowMetallic: "0 0 30px -5px rgba(148, 163, 184, 0.15)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
