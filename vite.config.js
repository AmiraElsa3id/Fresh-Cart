import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // fileURLToPath, not URL.pathname: on Windows pathname yields "/C:/Users/...",
      // which does not resolve on Linux or macOS deploy targets.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})