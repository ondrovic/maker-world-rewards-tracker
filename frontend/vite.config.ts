import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    watch: {
      usePolling: true
    },
    port: 80,
    strictPort: true,
    host: true
  },
})
