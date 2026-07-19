/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e1a',
          card: '#111827',
          input: '#1f2937',
        },
        brand: {
          primary: '#1e3a8a',
          secondary: '#3b82f6',
          accent: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}