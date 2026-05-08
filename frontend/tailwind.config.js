/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0d0d14",
          50: "#f4f4f8",
          100: "#e8e8f0",
          900: "#0d0d14",
        },
        aurora: {
          teal: "#00e5c3",
          violet: "#8b5cf6",
          rose: "#f43f5e",
          amber: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};