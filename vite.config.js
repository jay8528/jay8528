// vite.config.js (프로젝트 루트에 위치)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // '@' → 프로젝트 루트/src
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
