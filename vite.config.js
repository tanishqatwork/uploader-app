import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true // For Windows file watching issues
    }
  },
  optimizeDeps: {
    force: true, // Force re-optimization
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  },
  build: {
    sourcemap: true
  }
}) 