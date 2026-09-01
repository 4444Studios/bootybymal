import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      closeBundle() {
        const index = path.resolve('dist/index.html')
        const fallback = path.resolve('dist/404.html')
        if (existsSync(index)) copyFileSync(index, fallback)
      },
    },
  ],
  base: '/bootybymal/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\')) {
              return 'react-vendor'
            }
          }
        },
      },
    },
  },
})
