import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: , '/'  // change to '/jobfit-ai/' if using via github
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
})
