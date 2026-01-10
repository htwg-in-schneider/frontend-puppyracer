import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const repoName = '/frontend-puppyracer/'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173
  }
})