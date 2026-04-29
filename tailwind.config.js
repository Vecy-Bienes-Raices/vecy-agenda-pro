/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vecy Gold Edition — mismo nombre de clase, nuevo valor hex
        'caramel-dark': '#000000',     // antes #4b372a → negro puro
        'caramel-light': '#1c1c1c',    // antes #a1887f → carbón oscuro
        'soft-gold': '#bf953f',        // antes #d4af37 → oro Vecy oficial
        'volcanic-black': '#000000',   // antes #1c1c1c → negro puro
        'off-white': '#f0f0f0',        // antes #f3f4f6 → blanco hueso
        'esmeralda': '#10B981',        // sin cambio
        // Nuevos tokens Vecy Gold
        'vecy-surface': '#0a0a0a',     // fondo de cards/formulario
        'vecy-card': '#121212',        // superficies secundarias
        'vecy-border': '#18181b',      // bordes inactivos
        'vecy-muted': '#a1a1aa',       // texto secundario
        'gold-bright': '#d4af37',      // oro brillante para bordes/glow
        'gold-cream': '#fcf6ba',       // crema dorada para texto sobre oro
      },
      boxShadow: {
        'glass-inset': 'inset 0 1px 4px 0 rgb(0 0 0 / 0.1)',
        'luminous-gold': '0 0 25px rgba(191, 149, 63, 0.7), 0 0 50px rgba(191, 149, 63, 0.3)',
        'luminous-green': '0 0 20px 0px rgba(34, 197, 94, 0.6)',
        'luminous-red': '0 0 20px 0px rgba(220, 38, 38, 0.6)',
        'gold-glow-sm': '0 0 15px rgba(191, 149, 63, 0.5)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}