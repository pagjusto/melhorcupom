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
                
                const feedBase64 = (parsed.feedImageBase64 || parsed.imageBase64 || '').replace(/^data:image\/\w+;base64,/, '');
                if (feedBase64) {
                  fs.writeFileSync(tempImagePath, Buffer.from(feedBase64, 'base64'));
                } else {
                  fs.copyFileSync(path.resolve(__dirname, 'public/logo-melhor-cupom.png'), tempImagePath);
                }

                let tempStoryImagePath = null;
                const storyBase64 = (parsed.storyImageBase64 || '').replace(/^data:image\/\w+;base64,/, '');
                if (storyBase64) {
                  tempStoryImagePath = path.join(tempDir, `story-${Date.now()}.png`);
                  fs.writeFileSync(tempStoryImagePath, Buffer.from(storyBase64, 'base64'));
                }

                let result = null;
                try {
                  const directModPath = path.resolve(__dirname, 'scripts/direct-publish.cjs');
                  delete nodeRequire.cache[directModPath];
                  const { publishDirectToInstagram } = nodeRequire(directModPath);
                  result = await publishDirectToInstagram({
                    imagePath: tempImagePath,
                    storyImagePath: tempStoryImagePath,
                    publishStory: parsed.publishStory !== false,
                    storyLinkUrl: parsed.storyLinkUrl || 'https://www.omelhorcupom.com.br',
                    caption: parsed.caption || '🎉 Cupons exclusivos no www.omelhorcupom.com.br! Siga @omelhorcupom.com.br',
                    sessionId: parsed.sessionId || sessionCookie.value,
                    dsUserId: sessionData.userId
                  });
                } catch (httpErr) {
                  console.warn('Tentativa via HTTP direto falhou, acionando Puppeteer:', httpErr.message);
                  const publishScriptPath = path.resolve(__dirname, 'scripts/publish-post.cjs');
                  delete nodeRequire.cache[publishScriptPath];
                  const { publishPost } = nodeRequire(publishScriptPath);
                  result = await publishPost({
                    imagePath: tempImagePath,
                    caption: parsed.caption || '🎉 Cupons exclusivos no www.omelhorcupom.com.br! Siga @omelhorcupom.com.br'
                  });
                }

                try { fs.unlinkSync(tempImagePath); } catch (e) {}
                if (tempStoryImagePath) {
                  try { fs.unlinkSync(tempStoryImagePath); } catch (e) {}
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  postUrl: result.postUrl,
                  storyPublished: result.storyPublished,
                  storyUrl: result.storyUrl,
                  message: result.message || 'Publicado com sucesso no feed e stories!'
                }));
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

        // 3. Rota Local /api/mercadopago para testes no ambiente Vite Dev
        server.middlewares.use('/api/mercadopago', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.statusCode = 200;
            return res.end();
          }

          try {
            const apiModPath = path.resolve(__dirname, 'api/mercadopago.js');
            // Carregar dinamicamente o handler serverless
            const { default: handler } = await import(`file://${apiModPath}?t=${Date.now()}`);

            // Simular objeto de resposta compatível com Vercel/Express
            const mockRes = {
              statusCode: 200,
              headers: {},
              setHeader(k, v) { this.headers[k] = v; res.setHeader(k, v); return this; },
              status(code) { this.statusCode = code; res.statusCode = code; return this; },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
              end(data) {
                res.end(data);
                return this;
              }
            };

            if (req.method === 'GET') {
              const urlObj = new URL(req.url, 'http://localhost:3000');
              const query = Object.fromEntries(urlObj.searchParams.entries());
              await handler({ ...req, query }, mockRes);
              return;
            }

            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
                  await handler({ ...req, body: parsedBody }, mockRes);
                } catch (err) {
                  mockRes.status(500).json({ success: false, error: err.message });
                }
              });
              return;
            }

            res.statusCode = 405;
            res.end('Method Not Allowed');
          } catch (err) {
            console.error('Erro no middleware do Mercado Pago:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });

        // 4. Rota Local /api/extract-product para puxar imagem e dados reais do anúncio da Shopee
        server.middlewares.use('/api/extract-product', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 200;
            return res.end();
          }

          try {
            const apiModPath = path.resolve(__dirname, 'api/extract-product.js');
            const { default: handler } = await import(`file://${apiModPath}?t=${Date.now()}`);

            const mockRes = {
              statusCode: 200,
              headers: {},
              setHeader(k, v) { this.headers[k] = v; res.setHeader(k, v); return this; },
              status(code) { this.statusCode = code; res.statusCode = code; return this; },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
              end(data) {
                res.end(data);
                return this;
              }
            };

            if (req.method === 'GET') {
              const urlObj = new URL(req.url, 'http://localhost:3000');
              const query = Object.fromEntries(urlObj.searchParams.entries());
              await handler({ ...req, query }, mockRes);
              return;
            }

            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
                  await handler({ ...req, body: parsedBody }, mockRes);
                } catch (err) {
                  mockRes.status(500).json({ success: false, error: err.message });
                }
              });
              return;
            }

            res.statusCode = 405;
            res.end('Method Not Allowed');
          } catch (err) {
            console.error('Erro no middleware extract-product:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
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
