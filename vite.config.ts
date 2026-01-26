import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 8888,
  },
  preview: {
    port: 8888,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
