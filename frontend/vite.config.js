import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = process.env.API_TARGET || 'http://127.0.0.1:3000'
const media = process.env.MEDIA_TARGET || 'http://127.0.0.1:8888'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': { target: backend, changeOrigin: true },
      '/img': {
        target: 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@7455efae41b330c265e7cd4b78dfa848e7ce5ebd/images',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img/, '')
      },
      '/gif': {
        target: 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@7455efae41b330c265e7cd4b78dfa848e7ce5ebd/videos',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gif/, '')
      }
    }
  },
  build: { chunkSizeWarningLimit: 1500 }
})
