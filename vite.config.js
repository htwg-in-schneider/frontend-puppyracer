import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dotenv from 'dotenv'

// Lade die .env-Datei manuell
dotenv.config()

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Greife auf VITE_BASE aus der env-Datei zu
  base: process.env.VITE_BASE || '/'
})