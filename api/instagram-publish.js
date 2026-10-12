// api/instagram-publish.js
// Vercel Serverless Function para publicação simultânea no FEED e STORIES do Instagram (@omelhorcupom.com.br)
// Motor Oficial: Meta Instagram Graph API v20.0 (Sem dependência de cookies de navegador / sessionid)
import fs from 'fs';
import path from 'path';

const META_IG_ACCOUNT_ID = process.env.META_INSTAGRAM_ACCOUNT_ID || "28667775222832917";
const META_ACCESS_TOKEN = process.env.META_INSTAGRAM_ACCESS_TOKEN || "IGABAKQAsoFORBZAFl0cGZAyaWVlV1A4NWZAZAa0VEakJMSks0bHlmNWRvN1pBX05jc1JHT2FXUFN3OWdqWm1CUDA3UVdqMXRqbjVRWnprT3dVOGFVZAmxVMkdGdzhtVjJpWlVIT2FtcWxOYUl1a3ljLTBuUXNxNkFyMVFJVFFfUTdVTQZDZD";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  maxDuration: 60
};

// Faz upload temporário do Buffer da arte gerada no Canvas para uma URL pública acessível pelos servidores da Meta
async function uploadBufferToPublicUrl(buffer, filename = 'post.jpg') {
  // Tentativa 1: Catbox
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', new Blob([buffer], { type: 'image/jpeg' }), filename);
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });
    if (res.ok) {
      const url = (await res.text()).trim();
      if (url.startsWith('https://')) return url;
    }
  } catch (e) {
    console.warn('[Meta Graph API] Fallback upload Catbox:', e.message);
  }

  // Tentativa 2: Tmpfiles.org
  try {
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: 'image/jpeg' }), filename);
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: form
    });
    if (res.ok) {
      const json = await res.json();
      const rawUrl = json?.data?.url || '';
      if (rawUrl) {
        return rawUrl.replace('http://', 'https://').replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      }
    }
  } catch (e) {
    console.warn('[Meta Graph API] Fallback upload Tmpfiles:', e.message);
  }

  throw new Error('Não foi possível gerar URL pública da imagem para envio à Meta Graph API.');
}

// Aguarda o processamento do container na Meta e publica
async function publishGraphContainer(igAccountId, creationId, accessToken) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const statusRes = await fetch(
        `https://graph.instagram.com/v20.0/${creationId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`
      );
      const statusJson = await statusRes.json();
      if (statusJson.status_code === 'FINISHED') break;
      if (statusJson.status_code === 'ERROR') {
        throw new Error(`Meta Graph API rejeitou a mídia (${JSON.stringify(statusJson)})`);
      }
    } catch (e) {
      // Continua para tentativa de publish
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const pubRes = await fetch(`https://graph.instagram.com/v20.0/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
    })
  });

  const pubJson = await pubRes.json();
  if (!pubRes.ok || !pubJson.id) {
    throw new Error(pubJson?.error?.message || `Erro ao confirmar publicação na Meta Graph API: ${JSON.stringify(pubJson)}`);
  }

  return pubJson.id;
}

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

    const feedImageBase64 = body.feedImageBase64 || body.imageBase64 || '';
    const storyImageBase64 = body.storyImageBase64 || body.imageBase64 || '';
    const caption = body.caption || '🎉 Cupons exclusivos em www.omelhorcupom.com.br! Siga @omelhorcupom.com.br';
    const publishStory = body.publishStory !== false;

    const accessToken = body.accessToken || META_ACCESS_TOKEN;
    const igAccountId = body.instagramAccountId || META_IG_ACCOUNT_ID;

    let feedBuffer = null;
    if (feedImageBase64) {
      const clean = feedImageBase64.replace(/^data:image\/\w+;base64,/, '');
      feedBuffer = Buffer.from(clean, 'base64');
    }

    let storyBuffer = null;
    if (storyImageBase64) {
      const cleanStory = storyImageBase64.replace(/^data:image\/\w+;base64,/, '');
      storyBuffer = Buffer.from(cleanStory, 'base64');
    } else {
      storyBuffer = feedBuffer;
    }

    if (!feedBuffer || feedBuffer.length === 0) {
      const logoPath = path.resolve(process.cwd(), 'public/logo-melhor-cupom.png');
      if (fs.existsSync(logoPath)) {
        feedBuffer = fs.readFileSync(logoPath);
        if (!storyBuffer) storyBuffer = feedBuffer;
      }
    }

    if (!feedBuffer || feedBuffer.length === 0) {
      return res.status(400).json({ success: false, error: 'Imagem não fornecida para publicação.' });
    }

    // ==========================================
    // ETAPA 1: PUBLICAÇÃO OFICIAL NO FEED VIA META GRAPH API (1080x1080)
    // ==========================================
    const feedPublicUrl = await uploadBufferToPublicUrl(feedBuffer, `feed-${Date.now()}.jpg`);

    const createFeedRes = await fetch(`https://graph.instagram.com/v20.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: feedPublicUrl,
        caption: caption,
        access_token: accessToken
      })
    });

    const createFeedJson = await createFeedRes.json();
    if (!createFeedRes.ok || !createFeedJson.id) {
      return res.status(500).json({
        success: false,
        error: `Falha ao criar container do Feed na Meta Graph API: ${createFeedJson?.error?.message || JSON.stringify(createFeedJson)}`
      });
    }

    const publishedFeedId = await publishGraphContainer(igAccountId, createFeedJson.id, accessToken);

    // Buscar permalink oficial do post publicado
    let postUrl = 'https://www.instagram.com/omelhorcupom.com.br/';
    let feedCode = '';
    try {
      const mediaInfoRes = await fetch(
        `https://graph.instagram.com/v20.0/${publishedFeedId}?fields=permalink,shortcode&access_token=${encodeURIComponent(accessToken)}`
      );
      const mediaInfoJson = await mediaInfoRes.json();
      if (mediaInfoJson.permalink) postUrl = mediaInfoJson.permalink;
      if (mediaInfoJson.shortcode) feedCode = mediaInfoJson.shortcode;
    } catch (e) {}

    // ==========================================
    // ETAPA 2: PUBLICAÇÃO OFICIAL NOS STORIES VIA META GRAPH API (1080x1920)
    // ==========================================
    let storyResult = null;
    if (publishStory && storyBuffer && storyBuffer.length > 0) {
      try {
        const storyPublicUrl = await uploadBufferToPublicUrl(storyBuffer, `story-${Date.now()}.jpg`);

        const createStoryRes = await fetch(`https://graph.instagram.com/v20.0/${igAccountId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: storyPublicUrl,
            media_type: 'STORIES',
            access_token: accessToken
          })
        });

        const createStoryJson = await createStoryRes.json();
        if (createStoryRes.ok && createStoryJson.id) {
          const publishedStoryId = await publishGraphContainer(igAccountId, createStoryJson.id, accessToken);
          storyResult = {
            success: true,
            mediaId: publishedStoryId,
            storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
          };
        } else {
          console.warn('[Meta Graph API] Aviso ao criar container de Story:', createStoryJson);
        }
      } catch (storyErr) {
        console.warn('[Meta Graph API] Falha ao publicar Story:', storyErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      engine: 'meta_graph_api_v20',
      code: feedCode,
      postUrl,
      mediaId: publishedFeedId,
      storyPublished: !!storyResult?.success,
      storyUrl: storyResult?.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/',
      message: storyResult?.success
        ? 'Publicado com sucesso no Feed e nos Stories de @omelhorcupom.com.br via Meta Graph API Oficial!'
        : 'Post publicado com sucesso no Feed oficial de @omelhorcupom.com.br via Meta Graph API Oficial!'
    });
  } catch (err) {
    console.error('[Meta Graph API] Erro na publicação automática:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
