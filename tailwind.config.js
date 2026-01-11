/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
      colors: {
        // Subtle tweaks for better light/dark ramps
        surface: {
          light: "#FAFAFA",
          dark: "#0B0B0C"
        }
      },
      boxShadow: {
        glass: "0 20px 70px rgba(0,0,0,0.45)"
      }
    },
  },
  plugins: [],
};
