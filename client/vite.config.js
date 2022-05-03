import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../server/dist'),
  },
  server: {
    port: 8080,
    proxy: {
      '^/api/': {
        target: 'http://localhost:1337',
        pathRewrite: { '^/api/': '/api/' },
        changeOrigin: true,
        logLevel: 'debug',
      }
    },
  },
})
