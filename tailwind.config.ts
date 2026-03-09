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
        navy: {
          DEFAULT: "#0D2545",
          light: "#1B4F9C",
          dark: "#081830",
        },
        gold: {
          DEFAULT: "#C8892A",
          light: "#D9A54A",
          dark: "#A67020",
        },
        bg: "#F7F9FC",
        foreground: "#1A202C",
      },
      fontFamily: {
        serif: ["PingFang SC", "Microsoft YaHei", "Helvetica Neue", "Arial", "serif"],
        sans: ["PingFang SC", "Microsoft YaHei", "Helvetica Neue", "Arial", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
