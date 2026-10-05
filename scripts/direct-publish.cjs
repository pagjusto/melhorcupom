// scripts/direct-publish.cjs
// Motor direto de publicação no Instagram via HTTP Web API (Feed + Stories com Link)
const fs = require('fs');
const path = require('path');

function getStoredSession() {
  const paths = [
    path.join(__dirname, 'instagram-session.json'),
    path.join(__dirname, '..', 'public', 'instagram-session.json')
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {}
    }
  }
  return null;
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
  storyLinkUrl = 'https://www.omelhorcupom.com.br',
  caption = '',
  sessionId = null,
  dsUserId = null
}) {
  // 1. Obter imagem do Feed em Buffer
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

  // Obter imagem do Story em Buffer
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

  if (!feedBuffer || feedBuffer.length === 0) {
    throw new Error('Nenhuma imagem válida fornecida para publicação.');
  }

  // 2. Resolver sessão
  const stored = getStoredSession() || {};
  let finalSessionId = sessionId;
  let finalUserId = dsUserId;
  let csrfToken = 'VZIHRZEAMZn5f7uBmvOqmt1wg6ikfwey';

  if (!finalSessionId && stored.cookies) {
    const sCookie = stored.cookies.find(c => c.name === 'sessionid');
    if (sCookie) finalSessionId = sCookie.value;
    const uCookie = stored.cookies.find(c => c.name === 'ds_user_id');
    if (uCookie) finalUserId = uCookie.value;
    const cCookie = stored.cookies.find(c => c.name === 'csrftoken');
    if (cCookie) csrfToken = cCookie.value;
  }

  if (!finalSessionId && process.env.INSTAGRAM_SESSION_ID) {
    finalSessionId = process.env.INSTAGRAM_SESSION_ID;
  }

  if (!finalSessionId) {
    throw new Error('Sessão do Instagram não configurada. Conecte sua conta no painel com o sessionid.');
  }

  finalSessionId = finalSessionId.trim().replace(/^['"]|['"]$/g, '');

  if (!finalUserId) {
    const match = finalSessionId.match(/^([0-9]+)(?:%3A|:)/);
    if (match) finalUserId = match[1];
    else if (stored.userId) finalUserId = stored.userId;
    else finalUserId = '76452558269';
  }

  const cookieHeader = `sessionid=${finalSessionId}; ds_user_id=${finalUserId}; csrftoken=${csrfToken}`;
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

  console.log(`🚀 [Publicador Instagram] Publicando no feed de @omelhorcupom.com.br (User ID: ${finalUserId})...`);

  // 3. Upload da Imagem do Feed para rupload_igphoto
  const uploadIdFeed = String(Date.now());
  const ruploadParamsFeed = JSON.stringify({
    media_type: 1,
    upload_id: uploadIdFeed,
    upload_media_height: 1080,
    upload_media_width: 1080
  });

  const uploadRes = await fetch(`https://i.instagram.com/rupload_igphoto/fb_uploader_${uploadIdFeed}`, {
    method: 'POST',
    headers: {
      'x-instagram-rupload-params': ruploadParamsFeed,
      'offset': '0',
      'x-entity-length': String(feedBuffer.length),
      'x-ig-app-id': '936619743392459',
      'content-type': 'image/png',
      'user-agent': userAgent,
      'cookie': cookieHeader
    },
    body: feedBuffer
  });

  const uploadJson = await uploadRes.json();
  if (uploadJson.status !== 'ok') {
    throw new Error(`Falha no upload da foto para o feed do Instagram: ${uploadJson.message || JSON.stringify(uploadJson)}`);
  }

  // 4. Configurar Mídia no Feed (/api/v1/media/configure/)
  const bodyParamsFeed = new URLSearchParams({
    upload_id: uploadIdFeed,
    caption: caption || '🎉 Novidades e cupons exclusivos no @omelhorcupom.com.br! Acesse www.omelhorcupom.com.br',
    source_type: 'library',
    disable_comments: '0',
    like_and_view_counts_disabled: '0'
  });

  const configRes = await fetch('https://www.instagram.com/api/v1/media/configure/', {
    method: 'POST',
    headers: {
      'x-csrftoken': csrfToken,
      'x-ig-app-id': '936619743392459',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': userAgent,
      'cookie': cookieHeader,
      'origin': 'https://www.instagram.com',
      'referer': 'https://www.instagram.com/'
    },
    body: bodyParamsFeed.toString()
  });

  const configJson = await configRes.json();
  if (configJson.status !== 'ok') {
    throw new Error(`Instagram rejeitou a configuração do post no feed: ${configJson.message || JSON.stringify(configJson)}`);
  }

  const media = configJson.media || {};
  const code = media.code || '';
  const postUrl = code ? `https://www.instagram.com/p/${code}/` : `https://www.instagram.com/omelhorcupom.com.br/`;

  console.log('✅ [Publicador Instagram] Post no Feed publicado com sucesso!', postUrl);

  // 5. Publicação no Story com Link Sticker
  let storyResult = null;
  if (publishStory && storyBuffer && storyBuffer.length > 0) {
    try {
      console.log('📲 [Publicador Instagram] Publicando no Story com link para:', storyLinkUrl);
      const uploadIdStory = String(Date.now() + 150);
      const ruploadParamsStory = JSON.stringify({
        media_type: 1,
        upload_id: uploadIdStory,
        upload_media_height: 1920,
        upload_media_width: 1080
      });

      const uploadStoryRes = await fetch(`https://i.instagram.com/rupload_igphoto/fb_uploader_${uploadIdStory}`, {
        method: 'POST',
        headers: {
          'x-instagram-rupload-params': ruploadParamsStory,
          'offset': '0',
          'x-entity-length': String(storyBuffer.length),
          'x-ig-app-id': '936619743392459',
          'content-type': 'image/png',
          'user-agent': userAgent,
          'cookie': cookieHeader
        },
        body: storyBuffer
      });

      const uploadStoryJson = await uploadStoryRes.json();
      if (uploadStoryJson.status === 'ok') {
        const linkStickers = [
          {
            story_link_sticker: {
              url: storyLinkUrl
            },
            x: 0.5,
            y: 0.82,
            width: 0.55,
            height: 0.11,
            rotation: 0.0
          }
        ];

        const bodyParamsStory = new URLSearchParams({
          upload_id: uploadIdStory,
          source_type: 'library',
          configure_mode: '1',
          story_link_stickers: JSON.stringify(linkStickers),
          client_shared_at: String(Math.floor(Date.now() / 1000))
        });

        const configStoryRes = await fetch('https://www.instagram.com/api/v1/media/configure_to_story/', {
          method: 'POST',
          headers: {
            'x-csrftoken': csrfToken,
            'x-ig-app-id': '936619743392459',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': userAgent,
            'cookie': cookieHeader,
            'origin': 'https://www.instagram.com',
            'referer': 'https://www.instagram.com/'
          },
          body: bodyParamsStory.toString()
        });

        const configStoryJson = await configStoryRes.json();
        if (configStoryJson.status === 'ok') {
          const sMedia = configStoryJson.media || {};
          storyResult = {
            success: true,
            code: sMedia.code || '',
            storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
          };
          console.log('✅ [Publicador Instagram] Story publicado com sucesso com link!');
        } else {
          console.warn('⚠️ Erro ao configurar Story:', configStoryJson);
        }
      }
    } catch (storyErr) {
      console.warn('⚠️ Falha na publicação de Story:', storyErr.message);
    }
  }

  return {
    success: true,
    code,
    postUrl,
    mediaId: media.id || media.pk,
    storyPublished: !!storyResult?.success,
    storyCode: storyResult?.code || '',
    storyUrl: storyResult?.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/',
    message: storyResult?.success
      ? `Publicado com sucesso no feed e nos stories com link oficial de @omelhorcupom.com.br!`
      : `Publicação compartilhada com sucesso no feed oficial do Instagram (@omelhorcupom.com.br)!`,
    publishedAt: new Date().toISOString()
  };
}

module.exports = { publishDirectToInstagram };
