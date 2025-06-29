import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // Esta sección crea el "desvío" para las peticiones a /api.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // Apunta a sí mismo
        changeOrigin: true,
      },
    },
  },
})