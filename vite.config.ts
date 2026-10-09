import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';

function serve3DViewersPlugin(): Plugin {
  const viewerRoutes: Record<string, string> = {
    '/viewers/loox-ostrowo': path.resolve(__dirname, 'Loox Ostrowo 2026/small.html'),
    '/viewers/reading-room': path.resolve(__dirname, 'Reading Room (No Lidar\uFF0C Only Photos)/small.html'),
    '/viewers/utlida-180': path.resolve(__dirname, 'Utlida 180/small.html'),
  };

  const handler = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const rawUrl = req.url ? req.url.split('?')[0] : '';
    const cleanUrl = decodeURIComponent(rawUrl).replace(/\/+$/, '');

    for (const [routePrefix, filePath] of Object.entries(viewerRoutes)) {
      if (
        cleanUrl === routePrefix ||
        cleanUrl === `${routePrefix}/small.html` ||
        rawUrl.startsWith(`${routePrefix}`)
      ) {
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(`404: 3D file not found at ${filePath}`);
          return;
        }

        const stat = fs.statSync(filePath);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Cache-Control', 'no-cache');
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        return;
      }
    }
    next();
  };

  return {
    name: 'serve-3d-viewers',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), serve3DViewersPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: ['mapbox-gl'],
          maplibre: ['maplibre-gl'],
          three: ['three'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
