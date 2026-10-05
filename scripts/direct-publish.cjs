// scripts/direct-publish.cjs
// Motor direto de publicação no Instagram via HTTP Web API e Puppeteer Fallback
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

async function publishDirectToInstagram({ imageBuffer, imagePath, imageBase64, caption = '', sessionId = null, dsUserId = null }) {
  // 1. Obter imagem em Buffer
  let buffer = null;
  if (Buffer.isBuffer(imageBuffer)) {
    buffer = imageBuffer;
  } else if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    buffer = Buffer.from(cleanBase64, 'base64');
  } else if (imagePath && fs.existsSync(imagePath)) {
    buffer = fs.readFileSync(imagePath);
  } else {
    // Fallback para logo oficial
    const defaultLogo = path.join(__dirname, '..', 'public', 'logo-melhor-cupom.png');
    if (fs.existsSync(defaultLogo)) buffer = fs.readFileSync(defaultLogo);
  }

  if (!buffer || buffer.length === 0) {
    throw new Error('Nenhuma imagem válida fornecida para publicação.');
  }

  // 2. Resolver sessão (prioridade: parâmetro enviado > arquivo local > env)
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

  // Limpar aspas se houver
  finalSessionId = finalSessionId.trim().replace(/^['"]|['"]$/g, '');

  if (!finalUserId) {
    const match = finalSessionId.match(/^([0-9]+)(?:%3A|:)/);
    if (match) finalUserId = match[1];
    else if (stored.userId) finalUserId = stored.userId;
    else finalUserId = '76452558269';
  }

  const cookieHeader = `sessionid=${finalSessionId}; ds_user_id=${finalUserId}; csrftoken=${csrfToken}`;
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

  console.log(`🚀 [Publicador Instagram] Enviando publicação para @omelhorcupom.com.br (User ID: ${finalUserId})...`);

  // 3. Upload da Imagem para rupload_igphoto
  const uploadId = String(Date.now());
  const ruploadParams = JSON.stringify({
    media_type: 1,
    upload_id: uploadId,
    upload_media_height: 1080,
    upload_media_width: 1080
  });

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
    throw new Error(`Falha no upload da foto no Instagram: ${uploadJson.message || JSON.stringify(uploadJson)}`);
  }

  // 4. Configurar Mídia no Feed (/api/v1/media/configure/)
  const bodyParams = new URLSearchParams({
    upload_id: uploadId,
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
    body: bodyParams.toString()
  });

  const configJson = await configRes.json();

  if (configJson.status !== 'ok') {
    throw new Error(`Instagram rejeitou a configuração do post: ${configJson.message || JSON.stringify(configJson)}`);
  }

  const media = configJson.media || {};
  const code = media.code || '';
  const postUrl = code ? `https://www.instagram.com/p/${code}/` : `https://www.instagram.com/omelhorcupom.com.br/`;

  console.log('✅ [Publicador Instagram] Post publicado com sucesso!', postUrl);

  return {
    success: true,
    code,
    postUrl,
    mediaId: media.id || media.pk,
    message: `Publicação compartilhada com sucesso no feed oficial do Instagram (@omelhorcupom.com.br)!`,
    publishedAt: new Date().toISOString()
  };
}

module.exports = { publishDirectToInstagram };
