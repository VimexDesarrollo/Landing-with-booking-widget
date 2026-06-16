import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { transform } from 'esbuild'
import path from 'path'

// Vite 6 usa OXC que no reconoce JSX en .js (convención Next.js).
// Este plugin transforma .js con JSX usando esbuild antes que OXC los procese.
const jsxInJsPlugin = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.endsWith('.js') || id.includes('node_modules')) return null
    if (!code.includes('<')) return null
    const result = await transform(code, {
      loader: 'jsx',
      jsx: 'automatic',
      jsxImportSource: 'react',
    })
    return { code: result.code, map: result.map }
  },
}

export default defineConfig({
  plugins: [jsxInJsPlugin, react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
