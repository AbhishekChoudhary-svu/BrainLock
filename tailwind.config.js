// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 enables manual dark mode via `dark` class

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // If using App Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
