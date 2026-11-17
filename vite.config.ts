import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  root: resolve(__dirname, 'playground'),
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'formo-react-native/schema': resolve(__dirname, 'src/schema/index.ts'),
      'formo-react-native': resolve(__dirname, 'src/index.ts'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist-playground'),
    emptyOutDir: true,
  },
})
