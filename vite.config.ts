import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compatible con GitHub Pages tanto en repositorio de proyecto (/Nobsa/) como en dominio raíz (/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          map: ['leaflet'],
        },
      },
    },
  },
});
