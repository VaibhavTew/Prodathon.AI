import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        // Light theme. `ink` = surfaces (light), `white` = primary text (dark), `zinc` is inverted
        // so existing text-zinc-* classes stay readable. Change `accent` to re-skin the whole site.
        ink: { DEFAULT: "#F7F7FB", 900: "#EFF0F7", 800: "#FFFFFF", 700: "#E7E8F2", 600: "#D9DBE8" },
        white: "#14142B",
        zinc: {
          50: "#18181B", 100: "#1F1F24", 200: "#27272F", 300: "#3A3A46", 400: "#55556A",
          500: "#71717F", 600: "#A1A1AE", 700: "#D4D4DC", 800: "#E8E8EE", 900: "#F4F4F7", 950: "#FAFAFC",
        },
        line: "rgba(20,20,43,0.10)",
        muted: "#5E5E74",
        accent: { DEFAULT: "#5B3DF5", soft: "#7A63FF", deep: "#3F22D1" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(91,61,245,.18), 0 12px 36px -12px rgba(91,61,245,.35)",
      },
      keyframes: {
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(200%)" } },
        pulseDot: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".4", transform: "scale(.8)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0) rotate(-4deg)" }, "50%": { transform: "translateY(-10px) rotate(4deg)" } },
      },
      animation: {
        shimmer: "shimmer 2.4s ease-in-out infinite",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        float: "float 5s ease-in-out infinite",
        fadeUp: "fadeUp .45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
