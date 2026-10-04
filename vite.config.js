import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'instagram-login-middleware',
      configureServer(server) {
        server.middlewares.use('/api/instagram-login', (req, res) => {
          if (req.method === 'POST') {
            console.log('Disparando navegador para login no Instagram...');
            const scriptPath = path.resolve(__dirname, 'scripts/instagram-login.cjs');
            const child = spawn('node', [scriptPath], {
              detached: true,
              stdio: 'ignore'
            });
            child.unref();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Navegador iniciado' }));
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: true
  }
})
