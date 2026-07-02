import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/jobfit-ai/',   // change to '/' if deploying to Vercel
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
})
