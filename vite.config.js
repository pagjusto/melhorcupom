import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeRequire = createRequire(import.meta.url)

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
                const rawInput = (parsed.sessionId || '').trim();
                let cookies = parsed.cookies || [];

                if (rawInput && cookies.length === 0) {
                  // 1. JSON Array (Cookie-Editor / EditThisCookie)
                  if (rawInput.startsWith('[') && rawInput.endsWith(']')) {
                    try {
                      const jsonCookies = JSON.parse(rawInput);
                      if (Array.isArray(jsonCookies)) {
                        cookies = jsonCookies.map(c => ({
                          name: c.name,
                          value: c.value,
                          domain: c.domain || '.instagram.com',
                          path: c.path || '/',
                          httpOnly: Boolean(c.httpOnly),
                          secure: Boolean(c.secure ?? true)
                        }));
                      }
                    } catch (e) {}
                  }

                  // 2. Cookie header string (sessionid=xyz; ds_user_id=123)
                  if (cookies.length === 0 && rawInput.includes('=')) {
                    const parts = rawInput.split(';');
                    for (const part of parts) {
                      const [k, ...v] = part.trim().split('=');
                      if (k && v.length > 0) {
                        cookies.push({
                          name: k.trim(),
                          value: v.join('=').trim(),
                          domain: '.instagram.com',
                          path: '/',
                          httpOnly: k.trim() === 'sessionid',
                          secure: true
                        });
                      }
                    }
                  }

                  // 3. Raw sessionid value
                  if (cookies.length === 0 && rawInput.length > 0) {
                    let val = rawInput.replace(/^['"]|['"]$/g, '');
                    cookies.push({
                      name: 'sessionid',
                      value: val,
                      domain: '.instagram.com',
                      path: '/',
                      httpOnly: true,
                      secure: true
                    });
                  }
                }

                // Extrair ds_user_id se presente no prefixo de sessionid (ex: 68912345678%3A...)
                const sessionCookie = cookies.find(c => c.name === 'sessionid');
                const dsCookie = cookies.find(c => c.name === 'ds_user_id');
                if (sessionCookie && sessionCookie.value && !dsCookie) {
                  const matchUser = sessionCookie.value.match(/^([0-9]+)(?:%3A|:)/);
                  if (matchUser) {
                    cookies.push({
                      name: 'ds_user_id',
                      value: matchUser[1],
                      domain: '.instagram.com',
                      path: '/',
                      httpOnly: false,
                      secure: true
                    });
                  }
                }

                const hasValidSession = Boolean(sessionCookie && sessionCookie.value && sessionCookie.value.length > 5);

                const sessionData = {
                  connected: hasValidSession,
                  username: username.startsWith('@') ? username : `@${username}`,
                  accountType: 'browser_session',
                  connectedAt: new Date().toISOString(),
                  cookiesCount: cookies.length,
                  hasSessionId: hasValidSession,
                  userId: (cookies.find(c => c.name === 'ds_user_id') || {}).value || parsed.userId || 'admin',
                  cookies: cookies
                };

                const sessionFile = path.resolve(__dirname, 'scripts/instagram-session.json');
                fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf8');

                const publicSessionFile = path.resolve(__dirname, 'public/instagram-session.json');
                fs.writeFileSync(publicSessionFile, JSON.stringify({
                  connected: hasValidSession,
                  username: sessionData.username,
                  accountType: sessionData.accountType,
                  connectedAt: sessionData.connectedAt,
                  cookiesCount: sessionData.cookiesCount,
                  hasSessionId: hasValidSession,
                  userId: sessionData.userId
                }, null, 2), 'utf8');

                console.log(`[Instagram Middleware] Sessão salva! Cookies: ${cookies.length}, sessionid válido: ${hasValidSession}`);

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

        server.middlewares.use('/api/instagram-publish', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const sessionFile = path.resolve(__dirname, 'scripts/instagram-session.json');
                if (!fs.existsSync(sessionFile)) {
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({
                    success: false,
                    needCookies: true,
                    message: 'Sessão do Instagram não encontrada.'
                  }));
                }

                const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
                const cookies = sessionData.cookies || [];
                const sessionCookie = cookies.find(c => c.name === 'sessionid');

                if (!sessionCookie) {
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({
                    success: false,
                    needCookies: true,
                    message: 'Os cookies do robô ainda não foram sincronizados. Abra o arquivo "Conectar Instagram.bat" na sua Área de Trabalho para conectar o robô, ou copie o cookie sessionid.'
                  }));
                }

                // Salvar imagem temporária
                const tempDir = path.resolve(__dirname, 'temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                const tempImagePath = path.join(tempDir, `post-${Date.now()}.png`);
                
                const base64Data = (parsed.imageBase64 || '').replace(/^data:image\/\w+;base64,/, '');
                if (base64Data) {
                  fs.writeFileSync(tempImagePath, Buffer.from(base64Data, 'base64'));
                } else {
                  fs.copyFileSync(path.resolve(__dirname, 'public/logo-melhor-cupom.png'), tempImagePath);
                }

                const publishScriptPath = path.resolve(__dirname, 'scripts/publish-post.cjs');
                delete nodeRequire.cache[publishScriptPath];
                const { publishPost } = nodeRequire(publishScriptPath);
                if (typeof publishPost !== 'function') {
                  throw new Error('Função de publicação não pôde ser carregada.');
                }
                const result = await publishPost({
                  imagePath: tempImagePath,
                  caption: parsed.caption || '🎉 Cupons exclusivos no Melhor Cupom!'
                });

                try { fs.unlinkSync(tempImagePath); } catch (e) {}

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: result.message || 'Publicado com sucesso!' }));
              } catch (e) {
                console.error('Erro na publicação automática:', e);
                res.setHeader('Content-Type', 'application/json');
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
