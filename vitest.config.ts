import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      'react-native': resolve(__dirname, 'tests/__mocks__/react-native.ts'),
    },
  },
})
