/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
