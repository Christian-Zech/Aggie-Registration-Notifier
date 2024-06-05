import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://server.aggienotify.us:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  base: "/",
  plugins: [react()],
})
