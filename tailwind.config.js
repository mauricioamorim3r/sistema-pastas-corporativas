/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  // No Tailwind v4, darkMode é configurado via @variant no CSS
  theme: {
    extend: {},
  },
  plugins: [],
} 