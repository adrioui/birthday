/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.split('\\').join('/');

          if (!normalizedId.includes('node_modules')) return;

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/')
          ) {
            return 'react-vendor';
          }

          if (normalizedId.includes('/node_modules/@tanstack/react-router/')) {
            return 'router';
          }

          if (normalizedId.includes('/node_modules/gsap/')) {
            return 'gsap';
          }

          return 'vendor';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
