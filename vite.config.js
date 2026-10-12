import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base '/' imprescindible para BrowserRouter: los assets se resuelven
  // desde la raíz aunque la URL sea /libro/<id>.
  base: '/',
  build: {
    outDir: 'dist',
  },
})
