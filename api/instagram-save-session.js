// api/instagram-save-session.js
// Vercel Serverless Function para salvar/sincronizar sessão do Instagram
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  },
  maxDuration: 15
};

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'online', endpoint: '/api/instagram-save-session' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const username = body.username || '@omelhorcupom.com.br';
    const rawInput = (body.sessionId || '').trim();
    let cookies = body.cookies || [];

    if (rawInput && cookies.length === 0) {
      // 1. JSON Array (Cookie-Editor)
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

    // Extrair ds_user_id se presente no prefixo de sessionid
    const sessionCookie = cookies.find(c => c.name === 'sessionid');
    const dsCookie = cookies.find(c => c.name === 'ds_user_id');
    let extractedUserId = dsCookie ? dsCookie.value : null;

    if (sessionCookie && sessionCookie.value) {
      const matchUser = sessionCookie.value.match(/^([0-9]+)(?:%3A|:)/);
      if (matchUser) {
        extractedUserId = matchUser[1];
        if (!dsCookie) {
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
    }

    const hasValidSession = Boolean(sessionCookie && sessionCookie.value && sessionCookie.value.length > 5);

    const sessionData = {
      connected: hasValidSession,
      username: username.startsWith('@') ? username : `@${username}`,
      accountType: 'browser_session',
      connectedAt: new Date().toISOString(),
      cookiesCount: cookies.length,
      hasSessionId: hasValidSession,
      userId: extractedUserId || body.userId || 'admin',
      cookies: cookies
    };

    // Tentar salvar no disco local se filesystem for gravável
    try {
      const scriptsDir = path.resolve(process.cwd(), 'scripts');
      if (fs.existsSync(scriptsDir)) {
        fs.writeFileSync(path.join(scriptsDir, 'instagram-session.json'), JSON.stringify(sessionData, null, 2), 'utf8');
      }
      const publicDir = path.resolve(process.cwd(), 'public');
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(path.join(publicDir, 'instagram-session.json'), JSON.stringify({
          connected: hasValidSession,
          username: sessionData.username,
          accountType: sessionData.accountType,
          connectedAt: sessionData.connectedAt,
          cookiesCount: sessionData.cookiesCount,
          hasSessionId: hasValidSession,
          userId: sessionData.userId
        }, null, 2), 'utf8');
      }
    } catch (diskErr) {
      // Em ambientes serverless somente-leitura como Vercel, o salvamento no cliente/localStorage é a fonte da verdade
      console.warn('[instagram-save-session] Filesystem somente-leitura ou erro ao persistir:', diskErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Sessão salva com sucesso!',
      session: sessionData
    });
  } catch (err) {
    console.error('Erro em instagram-save-session:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
