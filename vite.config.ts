import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        // SPA fallback fix: On Windows, Vite's transform middleware resolves
        // /app -> App.tsx (case-insensitive FS) and serves raw JS as the page.
        // This plugin intercepts navigation requests BEFORE transform middleware
        // and rewrites them to /index.html so the SPA loads correctly on reload.
        {
          name: 'spa-fallback-pre',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              const url = req.url || '';
              const isNavigationRequest =
                req.method === 'GET' &&
                req.headers.accept?.includes('text/html') &&
                !url.includes('.') &&
                !url.startsWith('/@') &&
                !url.startsWith('/__') &&
                !url.startsWith('/node_modules/');

              if (isNavigationRequest && url !== '/' && url !== '/index.html') {
                req.url = '/index.html';
              }
              next();
            });
          },
        },
        react(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Enable SPA fallback for client-side routing
      appType: 'spa'
    };
});
