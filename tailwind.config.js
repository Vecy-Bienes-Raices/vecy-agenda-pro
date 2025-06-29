/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caramel-dark': '#4b372a',
        'caramel-light': '#a1887f',
        'soft-gold': '#d4af37',
        'volcanic-black': '#1c1c1c',
        'off-white': '#f3f4f6',
        'esmeralda': '#10B981',
      },
      boxShadow: {
        'glass-inset': 'inset 0 1px 4px 0 rgb(0 0 0 / 0.1)',
        'luminous-gold': '0 0 20px 0px rgba(212, 175, 55, 0.5)',
        'luminous-green': '0 0 20px 0px rgba(34, 197, 94, 0.6)',
        'luminous-red': '0 0 20px 0px rgba(220, 38, 38, 0.6)',
      }
    },
  },
  plugins: [],
}