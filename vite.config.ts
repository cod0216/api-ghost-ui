import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/global" as *;
          @use "@/styles/fonts" as *;
          @use "@/styles/colors" as *;
          @use "@/styles/radius" as *;
        `,
      },
    },
  },
});
