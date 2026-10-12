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

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Provedor 1: Freeimage.host (CDN Global iili.io - 100% compatível com Meta Graph API e AWS/Vercel)
async function uploadToFreeimage(buffer) {
  const form = new FormData();
  form.append('key', '6d207e02198a847aa98d0a2a901485a5');
  form.append('action', 'upload');
  form.append('source', buffer.toString('base64'));
  form.append('format', 'json');

  const res = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Freeimage HTTP ${res.status}`);
  const json = await res.json();
  const url = json?.image?.url || json?.image?.display_url || '';
  if (url.startsWith('https://')) return url;
  throw new Error('Freeimage não retornou URL HTTPS válida');
}

// Provedor 2: Uguu.se (Link direto image/jpeg)
async function uploadToUguu(buffer, filename = 'post.jpg') {
  const form = new FormData();
  form.append('files[]', new Blob([buffer], { type: 'image/jpeg' }), filename);
  const res = await fetch('https://uguu.se/upload', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Uguu HTTP ${res.status}`);
  const json = await res.json();
  const url = json?.files?.[0]?.url || '';
  if (url.startsWith('https://')) return url;
  throw new Error('Uguu não retornou URL HTTPS válida');
}

// Provedor 3: Litterbox Catbox (Link direto image/jpeg)
async function uploadToLitterbox(buffer, filename = 'post.jpg') {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('time', '12h');
  form.append('fileToUpload', new Blob([buffer], { type: 'image/jpeg' }), filename);
  const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Litterbox HTTP ${res.status}`);
  const url = (await res.text()).trim();
  if (url.startsWith('https://')) return url;
  throw new Error('Litterbox não retornou URL HTTPS válida');
}

// Provedor 4: Catbox.moe (Link direto image/jpeg)
async function uploadToCatbox(buffer, filename = 'post.jpg') {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', new Blob([buffer], { type: 'image/jpeg' }), filename);
  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Catbox HTTP ${res.status}`);
  const url = (await res.text()).trim();
  if (url.startsWith('https://')) return url;
  throw new Error('Catbox não retornou URL HTTPS válida');
}

// Cria o container de mídia na Meta Graph API tentando múltiplos provedores de CDN JPEG se necessário
async function createGraphMediaContainer(igAccountId, buffer, filename, extraPayload, accessToken, preferAltCdn = false) {
  const defaultProviders = [
    { name: 'Freeimage CDN', fn: () => uploadToFreeimage(buffer) },
    { name: 'Uguu CDN', fn: () => uploadToUguu(buffer, filename) },
    { name: 'Litterbox CDN', fn: () => uploadToLitterbox(buffer, filename) },
    { name: 'Catbox CDN', fn: () => uploadToCatbox(buffer, filename) }
  ];

  // Alterna a ordem dos CDNs no Story para evitar colisão simultânea no mesmo host
  const providers = preferAltCdn
    ? [defaultProviders[1], defaultProviders[2], defaultProviders[0], defaultProviders[3]]
    : defaultProviders;

  let lastError = 'Não foi possível gerar URL pública compatível com a Meta Graph API.';

  for (const provider of providers) {
    try {
      const publicUrl = await provider.fn();
      const createRes = await fetch(`https://graph.instagram.com/v20.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: publicUrl,
          ...extraPayload,
          access_token: accessToken
        })
      });

      const createJson = await createRes.json();
      if (createRes.ok && createJson.id) {
        return { id: createJson.id, publicUrl, provider: provider.name };
      }

      lastError = createJson?.error?.message || JSON.stringify(createJson);
      console.warn(`[Meta Graph API] Provedor ${provider.name} (${publicUrl}) rejeitado pela Meta:`, lastError);
    } catch (err) {
      lastError = err.message;
      console.warn(`[Meta Graph API] Falha no provedor ${provider.name}:`, err.message);
    }
  }

  throw new Error(lastError);
}

// Aguarda o processamento do container na Meta e publica com retentativa automática
async function publishGraphContainer(igAccountId, creationId, accessToken) {
  for (let attempt = 0; attempt < 10; attempt++) {
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
      if (e.message?.includes('rejeitou a mídia')) throw e;
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  let lastPubError = '';
  for (let pubAttempt = 0; pubAttempt < 5; pubAttempt++) {
    const pubRes = await fetch(`https://graph.instagram.com/v20.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken
      })
    });

    const pubJson = await pubRes.json();
    if (pubRes.ok && pubJson.id) {
      return pubJson.id;
    }

    lastPubError = pubJson?.error?.message || JSON.stringify(pubJson);
    await new Promise(r => setTimeout(r, 1500));
  }

  throw new Error(lastPubError || 'Erro ao confirmar publicação na Meta Graph API.');
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
    const onlyStory = body.onlyStory === true;

    const accessToken = body.accessToken || META_ACCESS_TOKEN;
    const igAccountId = body.instagramAccountId || META_IG_ACCOUNT_ID;

    let feedBuffer = null;
    if (feedImageBase64) {
      const clean = feedImageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      feedBuffer = Buffer.from(clean, 'base64');
    }

    let storyBuffer = null;
    if (storyImageBase64) {
      const cleanStory = storyImageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      storyBuffer = Buffer.from(cleanStory, 'base64');
    } else {
      storyBuffer = feedBuffer;
    }

    // MODO EXCLUSIVO DE STORY (para garantia de 100% de entrega nos Stories)
    if (onlyStory) {
      if (!storyBuffer || storyBuffer.length === 0) {
        return res.status(400).json({ success: false, error: 'Imagem de Story não fornecida.' });
      }
      const storyContainer = await createGraphMediaContainer(
        igAccountId,
        storyBuffer,
        `story-${Date.now()}.jpg`,
        { media_type: 'STORIES' },
        accessToken,
        false
      );
      const publishedStoryId = await publishGraphContainer(igAccountId, storyContainer.id, accessToken);
      return res.status(200).json({
        success: true,
        storyPublished: true,
        storyMediaId: publishedStoryId,
        storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
      });
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
    // CRIAÇÃO E PUBLICAÇÃO PARALELA (FEED 1080x1080 + STORIES 1080x1920)
    // ==========================================
    const shouldPublishStory = publishStory && storyBuffer && storyBuffer.length > 0;

    // 1. Dispara a criação dos dois containers em paralelo na Meta Graph API
    const [feedContainerOutcome, storyContainerOutcome] = await Promise.allSettled([
      createGraphMediaContainer(
        igAccountId,
        feedBuffer,
        `feed-${Date.now()}.jpg`,
        { caption },
        accessToken,
        false
      ),
      shouldPublishStory
        ? createGraphMediaContainer(
            igAccountId,
            storyBuffer,
            `story-${Date.now()}.jpg`,
            { media_type: 'STORIES' },
            accessToken,
            true
          )
        : Promise.resolve(null)
    ]);

    if (feedContainerOutcome.status === 'rejected' || !feedContainerOutcome.value?.id) {
      const errMsg = feedContainerOutcome.reason?.message || 'Erro desconhecido';
      return res.status(500).json({
        success: false,
        error: `Falha ao criar container do Feed na Meta Graph API: ${errMsg}`
      });
    }

    const feedContainer = feedContainerOutcome.value;
    const storyContainer = storyContainerOutcome.status === 'fulfilled' ? storyContainerOutcome.value : null;

    // 2. Publica o Feed e o Story simultaneamente enquanto os containers processam
    const [feedPubOutcome, storyPubOutcome] = await Promise.allSettled([
      publishGraphContainer(igAccountId, feedContainer.id, accessToken),
      storyContainer?.id
        ? publishGraphContainer(igAccountId, storyContainer.id, accessToken)
        : Promise.resolve(null)
    ]);

    if (feedPubOutcome.status === 'rejected' || !feedPubOutcome.value) {
      throw new Error(feedPubOutcome.reason?.message || 'Erro ao publicar Feed na Meta Graph API.');
    }

    const publishedFeedId = feedPubOutcome.value;
    let storyResult = null;

    if (storyPubOutcome.status === 'fulfilled' && storyPubOutcome.value) {
      storyResult = {
        success: true,
        mediaId: storyPubOutcome.value,
        storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
      };
    }

    // Buscar permalink oficial do post publicado no Feed
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
