import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './api/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Serve frontend in dev (using Vite middleware) or prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BhuSetu Server] Running on http://localhost:${PORT} (${isProd ? 'Production' : 'Development'})`);
  });
}

// Only start the server when run directly (not in Vercel serverless environment)
if (process.env.VERCEL !== '1' && process.env.VERCEL !== 'true') {
  startServer();
}

export default app;
