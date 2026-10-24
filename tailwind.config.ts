import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saarthi: {
          dark: "#070A12",
          card: "#0E1526",
          cardHover: "#15203A",
          border: "rgba(255, 255, 255, 0.08)",
          borderGlow: "rgba(16, 185, 129, 0.25)",
          emerald: "#10B981",
          emeraldLight: "#34D399",
          cyan: "#06B6D4",
          amber: "#F59E0B",
          rose: "#EF4444",
          purple: "#8B5CF6",
        },
        ink: "#070A12",
        panel: "#0E1526",
        line: "rgba(255, 255, 255, 0.08)",
        accent: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "strobe": "strobe 1s ease-in-out infinite",
      },
      keyframes: {
        strobe: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
