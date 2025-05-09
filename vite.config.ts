import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/apighost-ui/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          chart: ['recharts'],
          flow: ['reactflow'],
        },
      },
    },
  },
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
