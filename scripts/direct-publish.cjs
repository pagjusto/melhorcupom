// scripts/direct-publish.cjs
// Motor Oficial de Publicação no Instagram via Meta Instagram Graph API v20.0 (Feed + Stories)
// Sem dependência de cookies de navegador ou sessionid
const fs = require('fs');
const path = require('path');

const META_IG_ACCOUNT_ID = process.env.META_INSTAGRAM_ACCOUNT_ID || "28667775222832917";
const META_ACCESS_TOKEN = process.env.META_INSTAGRAM_ACCESS_TOKEN || "IGABAKQAsoFORBZAFl0cGZAyaWVlV1A4NWZAZAa0VEakJMSks0bHlmNWRvN1pBX05jc1JHT2FXUFN3OWdqWm1CUDA3UVdqMXRqbjVRWnprT3dVOGFVZAmxVMkdGdzhtVjJpWlVIT2FtcWxOYUl1a3ljLTBuUXNxNkFyMVFJVFFfUTdVTQZDZD";

async function uploadBufferToPublicUrl(buffer, filename = 'post.jpg') {
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
    console.warn('[Meta Graph API] Fallback Catbox:', e.message);
  }

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
    console.warn('[Meta Graph API] Fallback Tmpfiles:', e.message);
  }

  throw new Error('Não foi possível gerar URL pública da imagem para envio à Meta Graph API.');
}

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
    } catch (e) {}
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

async function publishDirectToInstagram({
  imageBuffer,
  imagePath,
  imageBase64,
  feedImageBase64,
  storyImageBuffer,
  storyImagePath,
  storyImageBase64,
  publishStory = true,
  onlyStory = false,
  caption = '',
  accessToken = META_ACCESS_TOKEN,
  instagramAccountId = META_IG_ACCOUNT_ID
}) {
  let feedBuffer = null;
  const rawFeedBase64 = feedImageBase64 || imageBase64;
  if (Buffer.isBuffer(imageBuffer)) {
    feedBuffer = imageBuffer;
  } else if (rawFeedBase64) {
    const cleanBase64 = rawFeedBase64.replace(/^data:image\/\w+;base64,/, '');
    feedBuffer = Buffer.from(cleanBase64, 'base64');
  } else if (imagePath && fs.existsSync(imagePath)) {
    feedBuffer = fs.readFileSync(imagePath);
  } else {
    const defaultLogo = path.join(__dirname, '..', 'public', 'logo-melhor-cupom.png');
    if (fs.existsSync(defaultLogo)) feedBuffer = fs.readFileSync(defaultLogo);
  }

  let storyBuffer = null;
  if (Buffer.isBuffer(storyImageBuffer)) {
    storyBuffer = storyImageBuffer;
  } else if (storyImageBase64) {
    const cleanStory = storyImageBase64.replace(/^data:image\/\w+;base64,/, '');
    storyBuffer = Buffer.from(cleanStory, 'base64');
  } else if (storyImagePath && fs.existsSync(storyImagePath)) {
    storyBuffer = fs.readFileSync(storyImagePath);
  } else {
    storyBuffer = feedBuffer;
  }

  // MODO EXCLUSIVO DE STORY
  if (onlyStory) {
    if (!storyBuffer || storyBuffer.length === 0) {
      throw new Error('Nenhuma imagem válida fornecida para publicação no Story.');
    }
    console.log('📲 [Meta Graph API v20.0] Publicando EXCLUSIVAMENTE no Story oficial...');
    const storyPublicUrl = await uploadBufferToPublicUrl(storyBuffer, `story-${Date.now()}.jpg`);
    const createStoryRes = await fetch(`https://graph.instagram.com/v20.0/${instagramAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: storyPublicUrl,
        media_type: 'STORIES',
        access_token: accessToken
      })
    });
    const createStoryJson = await createStoryRes.json();
    if (!createStoryRes.ok || !createStoryJson.id) {
      throw new Error(`Falha ao criar container do Story: ${createStoryJson?.error?.message || JSON.stringify(createStoryJson)}`);
    }
    const publishedStoryId = await publishGraphContainer(instagramAccountId, createStoryJson.id, accessToken);
    return {
      success: true,
      storyPublished: true,
      mediaId: publishedStoryId,
      storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/',
      postUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
    };
  }

  if (!feedBuffer || feedBuffer.length === 0) {
    throw new Error('Nenhuma imagem válida fornecida para publicação.');
  }

  console.log(`🚀 [Meta Graph API v20.0] Publicando no Feed oficial de @omelhorcupom.com.br (Account ID: ${instagramAccountId})...`);

  const feedPublicUrl = await uploadBufferToPublicUrl(feedBuffer, `feed-${Date.now()}.jpg`);

  const createFeedRes = await fetch(`https://graph.instagram.com/v20.0/${instagramAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: feedPublicUrl,
      caption: caption || '🎉 Novidades e cupons exclusivos no @omelhorcupom.com.br! Acesse www.omelhorcupom.com.br',
      access_token: accessToken
    })
  });

  const createFeedJson = await createFeedRes.json();
  if (!createFeedRes.ok || !createFeedJson.id) {
    throw new Error(`Falha ao criar container do Feed na Meta Graph API: ${createFeedJson?.error?.message || JSON.stringify(createFeedJson)}`);
  }

  const publishedFeedId = await publishGraphContainer(instagramAccountId, createFeedJson.id, accessToken);

  let postUrl = 'https://www.instagram.com/omelhorcupom.com.br/';
  let code = '';
  try {
    const mediaInfoRes = await fetch(
      `https://graph.instagram.com/v20.0/${publishedFeedId}?fields=permalink,shortcode&access_token=${encodeURIComponent(accessToken)}`
    );
    const mediaInfoJson = await mediaInfoRes.json();
    if (mediaInfoJson.permalink) postUrl = mediaInfoJson.permalink;
    if (mediaInfoJson.shortcode) code = mediaInfoJson.shortcode;
  } catch (e) {}

  console.log('✅ [Meta Graph API v20.0] Post no Feed publicado com sucesso!', postUrl);

  let storyResult = null;
  if (publishStory && storyBuffer && storyBuffer.length > 0) {
    try {
      console.log('📲 [Meta Graph API v20.0] Publicando no Story oficial...');
      const storyPublicUrl = await uploadBufferToPublicUrl(storyBuffer, `story-${Date.now()}.jpg`);

      const createStoryRes = await fetch(`https://graph.instagram.com/v20.0/${instagramAccountId}/media`, {
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
        const publishedStoryId = await publishGraphContainer(instagramAccountId, createStoryJson.id, accessToken);
        storyResult = {
          success: true,
          mediaId: publishedStoryId,
          storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
        };
        console.log('✅ [Meta Graph API v20.0] Story publicado com sucesso!');
      }
    } catch (storyErr) {
      console.warn('⚠️ [Meta Graph API v20.0] Aviso na publicação do Story:', storyErr.message);
    }
  }

  return {
    success: true,
    code,
    postUrl,
    mediaId: publishedFeedId,
    storyPublished: !!storyResult?.success,
    storyUrl: storyResult?.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/',
    message: storyResult?.success
      ? 'Publicado com sucesso no Feed e nos Stories de @omelhorcupom.com.br via Meta Graph API Oficial!'
      : 'Post publicado com sucesso no Feed oficial de @omelhorcupom.com.br via Meta Graph API Oficial!'
  };
}

module.exports = { publishDirectToInstagram };
