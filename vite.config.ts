import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://koji.thedev.id',
      changefreq: 'monthly',
      priority: 1.0,
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: 'Googlebot',
          allow: '/',
        },
        {
          userAgent: 'Bingbot',
          allow: '/',
        },
        {
          userAgent: 'Twitterbot',
          allow: '/',
        },
        {
          userAgent: 'facebookexternalhit',
          allow: '/',
        },
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
            '@radix-ui/react-slot',
            'class-variance-authority',
            'lucide-react',
          ],
        },
      },
    },
  },
}));
