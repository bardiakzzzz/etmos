import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ command }) => ({
  base: '/etmos/',
  plugins: [react(), ...(command === 'build' ? [viteSingleFile()] : [])],
  build: {
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    outDir: '../dist-standalone',
  },
}))
