import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import fs from 'fs'
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

        server.middlewares.use('/api/instagram-save-session', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const username = parsed.username || '@omelhorcupom.com.br';
                const sessionId = (parsed.sessionId || '').trim();
                const cookies = parsed.cookies || (sessionId ? [{
                  name: 'sessionid',
                  value: sessionId,
                  domain: '.instagram.com',
                  path: '/',
                  httpOnly: true,
                  secure: true
                }] : []);

                const sessionData = {
                  connected: true,
                  username: username.startsWith('@') ? username : `@${username}`,
                  accountType: 'browser_session',
                  connectedAt: new Date().toISOString(),
                  cookiesCount: cookies.length || 1,
                  hasSessionId: Boolean(sessionId || cookies.length > 0),
                  userId: parsed.userId || 'admin',
                  cookies: cookies
                };

                const sessionFile = path.resolve(__dirname, 'scripts/instagram-session.json');
                fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf8');

                const publicSessionFile = path.resolve(__dirname, 'public/instagram-session.json');
                fs.writeFileSync(publicSessionFile, JSON.stringify({
                  connected: true,
                  username: sessionData.username,
                  accountType: sessionData.accountType,
                  connectedAt: sessionData.connectedAt,
                  cookiesCount: sessionData.cookiesCount,
                  hasSessionId: sessionData.hasSessionId,
                  userId: sessionData.userId
                }, null, 2), 'utf8');

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, session: sessionData }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
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
