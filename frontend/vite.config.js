import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    hmr: {
      overlay: true,     // Show errors as overlay
      clientPort: 5173,  // Match your server port
    },
    watch: {
      usePolling: true   // Better file system watching
    }
  }
})
