<<<<<<< HEAD
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
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> d6c6ea6c151ad2afcd5e021a6e8bf436af53b13e
})
