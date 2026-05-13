/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#030302",
        charcoal: "#0c0b0a",
        slate: "#161514",
        ember: {
          DEFAULT: "#c6a24a",
          dim: "#8a7340",
          glow: "rgba(198, 162, 74, 0.12)",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['Inter', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        cinematic: "1200ms",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 1.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
