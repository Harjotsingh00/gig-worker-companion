import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090d0c",
        panel: "#101614",
        line: "#202a26",
        accent: "#b7f36b",
      },
      fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
