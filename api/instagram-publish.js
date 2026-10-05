// api/instagram-publish.js
// Vercel Serverless Function para publicação direta no feed do Instagram (@omelhorcupom.com.br)
import fs from 'fs';
import path from 'path';

const DEFAULT_SESSION_ID = "76452558269%3APaJl64Xq4mqWfs%3A11%3AAYmg8pfC95U2Yj6HOWWfGE6LbpLX716JCMiPmiSP6A";
const DEFAULT_USER_ID = "76452558269";
const CSRF_TOKEN = "VZIHRZEAMZn5f7uBmvOqmt1wg6ikfwey";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    const imageBase64 = body.imageBase64 || '';
    const caption = body.caption || '🎉 Cupons exclusivos no www.omelhorcupom.com.br! Siga @omelhorcupom.com.br';
    let sessionId = body.sessionId || process.env.INSTAGRAM_SESSION_ID || DEFAULT_SESSION_ID;
    let userId = body.userId || DEFAULT_USER_ID;

    // Tentar ler de public/instagram-session.json caso exista
    try {
      const pubFile = path.resolve(process.cwd(), 'public/instagram-session.json');
      if (fs.existsSync(pubFile)) {
        const pubData = JSON.parse(fs.readFileSync(pubFile, 'utf8'));
        if (pubData.userId) userId = pubData.userId;
      }
    } catch (e) {}

    let buffer = null;
    if (imageBase64) {
      const clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(clean, 'base64');
    }

    if (!buffer || buffer.length === 0) {
      const logoPath = path.resolve(process.cwd(), 'public/logo-melhor-cupom.png');
      if (fs.existsSync(logoPath)) {
        buffer = fs.readFileSync(logoPath);
      }
    }

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ success: false, error: 'Imagem não fornecida' });
    }

    sessionId = sessionId.trim().replace(/^['"]|['"]$/g, '');
    if (!userId) {
      const match = sessionId.match(/^([0-9]+)(?:%3A|:)/);
      userId = match ? match[1] : DEFAULT_USER_ID;
    }

    const cookieHeader = `sessionid=${sessionId}; ds_user_id=${userId}; csrftoken=${CSRF_TOKEN}`;
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    const uploadId = String(Date.now());
    const ruploadParams = JSON.stringify({
      media_type: 1,
      upload_id: uploadId,
      upload_media_height: 1080,
      upload_media_width: 1080
    });

    // 1. Upload para rupload_igphoto
    const uploadRes = await fetch(`https://i.instagram.com/rupload_igphoto/fb_uploader_${uploadId}`, {
      method: 'POST',
      headers: {
        'x-instagram-rupload-params': ruploadParams,
        'offset': '0',
        'x-entity-length': String(buffer.length),
        'x-ig-app-id': '936619743392459',
        'content-type': 'image/png',
        'user-agent': userAgent,
        'cookie': cookieHeader
      },
      body: buffer
    });

    const uploadJson = await uploadRes.json();
    if (uploadJson.status !== 'ok') {
      return res.status(500).json({
        success: false,
        error: `Falha no upload para o Instagram: ${uploadJson.message || JSON.stringify(uploadJson)}`
      });
    }

    // 2. Configurar no feed (/api/v1/media/configure/)
    const bodyParams = new URLSearchParams({
      upload_id: uploadId,
      caption: caption,
      source_type: 'library',
      disable_comments: '0',
      like_and_view_counts_disabled: '0'
    });

    const configRes = await fetch('https://www.instagram.com/api/v1/media/configure/', {
      method: 'POST',
      headers: {
        'x-csrftoken': CSRF_TOKEN,
        'x-ig-app-id': '936619743392459',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': userAgent,
        'cookie': cookieHeader,
        'origin': 'https://www.instagram.com',
        'referer': 'https://www.instagram.com/'
      },
      body: bodyParams.toString()
    });

    const configJson = await configRes.json();
    if (configJson.status !== 'ok') {
      return res.status(500).json({
        success: false,
        error: `Instagram rejeitou publicação: ${configJson.message || JSON.stringify(configJson)}`
      });
    }

    const media = configJson.media || {};
    const code = media.code || '';
    const postUrl = code ? `https://www.instagram.com/p/${code}/` : `https://www.instagram.com/omelhorcupom.com.br/`;

    return res.status(200).json({
      success: true,
      code,
      postUrl,
      mediaId: media.id || media.pk,
      message: 'Post publicado com sucesso no feed oficial de @omelhorcupom.com.br!'
    });
  } catch (err) {
    console.error('Erro na publicação automática:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
