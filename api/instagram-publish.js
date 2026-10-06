// api/instagram-publish.js
// Vercel Serverless Function para publicação simultânea no FEED e STORIES do Instagram (@omelhorcupom.com.br)
import fs from 'fs';
import path from 'path';

const DEFAULT_SESSION_ID = "76452558269%3APaJl64Xq4mqWfs%3A11%3AAYmg8pfC95U2Yj6HOWWfGE6LbpLX716JCMiPmiSP6A";
const DEFAULT_USER_ID = "76452558269";
const CSRF_TOKEN = "VZIHRZEAMZn5f7uBmvOqmt1wg6ikfwey";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  maxDuration: 60
};

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
    const caption = body.caption || '🎉 Cupons exclusivos no www.omelhorcupom.com.br! Siga @omelhorcupom.com.br';
    const storyLinkUrl = body.storyLinkUrl || 'https://www.omelhorcupom.com.br';
    const publishStory = body.publishStory !== false;

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
      return res.status(400).json({ success: false, error: 'Imagem não fornecida' });
    }

    sessionId = sessionId.trim().replace(/^['"]|['"]$/g, '');
    if (!userId) {
      const match = sessionId.match(/^([0-9]+)(?:%3A|:)/);
      userId = match ? match[1] : DEFAULT_USER_ID;
    }

    const cookieHeader = `sessionid=${sessionId}; ds_user_id=${userId}; csrftoken=${CSRF_TOKEN}`;
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    // ==========================================
    // ETAPA 1: PUBLICAÇÃO NO FEED (1080x1080)
    // ==========================================
    const uploadIdFeed = String(Date.now());
    const ruploadParamsFeed = JSON.stringify({
      media_type: 1,
      upload_id: uploadIdFeed,
      upload_media_height: 1080,
      upload_media_width: 1080
    });

    const uploadFeedRes = await fetch(`https://i.instagram.com/rupload_igphoto/fb_uploader_${uploadIdFeed}`, {
      method: 'POST',
      headers: {
        'x-instagram-rupload-params': ruploadParamsFeed,
        'offset': '0',
        'x-entity-length': String(feedBuffer.length),
        'x-ig-app-id': '936619743392459',
        'content-type': 'image/jpeg',
        'user-agent': userAgent,
        'cookie': cookieHeader
      },
      body: feedBuffer
    });

    const uploadFeedJson = await uploadFeedRes.json();
    if (uploadFeedJson.status !== 'ok') {
      return res.status(500).json({
        success: false,
        error: `Falha no upload para o feed do Instagram: ${uploadFeedJson.message || JSON.stringify(uploadFeedJson)}`
      });
    }

    // Configurar mídia no feed (/api/v1/media/configure/)
    const bodyParamsFeed = new URLSearchParams({
      upload_id: uploadIdFeed,
      caption: caption,
      source_type: 'library',
      disable_comments: '0',
      like_and_view_counts_disabled: '0'
    });

    const configFeedRes = await fetch('https://www.instagram.com/api/v1/media/configure/', {
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
      body: bodyParamsFeed.toString()
    });

    const configFeedJson = await configFeedRes.json();
    if (configFeedJson.status !== 'ok') {
      return res.status(500).json({
        success: false,
        error: `Instagram rejeitou publicação no feed: ${configFeedJson.message || JSON.stringify(configFeedJson)}`
      });
    }

    const feedMedia = configFeedJson.media || {};
    const feedCode = feedMedia.code || '';
    const postUrl = feedCode ? `https://www.instagram.com/p/${feedCode}/` : `https://www.instagram.com/omelhorcupom.com.br/`;

    // ==========================================
    // ETAPA 2: PUBLICAÇÃO NOS STORIES COM LINK (1080x1920)
    // ==========================================
    let storyResult = null;
    if (publishStory && storyBuffer && storyBuffer.length > 0) {
      try {
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
            'content-type': 'image/jpeg',
            'user-agent': userAgent,
            'cookie': cookieHeader
          },
          body: storyBuffer
        });

        const uploadStoryJson = await uploadStoryRes.json();
        if (uploadStoryJson.status === 'ok') {
          // Link sticker clicável posicionado EXATAMENTE em cima do botão "RESGATE SEU CUPOM EXCLUSIVO"
          const linkTitle = body.linkTitle || 'RESGATAR CUPOM';
          const linkStickers = [
            {
              x: 0.5,
              y: 0.715, // Exatamente no botão de resgate da arte oficial (1374px / 1920px)
              z: 0,
              width: 0.69,
              height: 0.08,
              rotation: 0.0,
              is_pinned: 0,
              is_hidden: 0,
              is_sticker: 1,
              is_fb_sticker: 0,
              story_link: {
                link_type: 'web',
                url: storyLinkUrl,
                link_title: linkTitle,
                display_url: 'omelhorcupom.com.br'
              },
              story_link_sticker: {
                url: storyLinkUrl,
                link_title: linkTitle,
                display_url: 'omelhorcupom.com.br'
              },
              url: storyLinkUrl,
              web_uri: storyLinkUrl,
              link_type: 'web'
            }
          ];

          const bodyParamsStory = new URLSearchParams({
            upload_id: uploadIdStory,
            source_type: 'library',
            configure_mode: '1',
            story_sticker_ids: 'link_sticker_default',
            story_link_stickers: JSON.stringify(linkStickers),
            tap_models: JSON.stringify(linkStickers),
            story_cta: JSON.stringify([{ links: [{ webUri: storyLinkUrl }] }]),
            client_shared_at: String(Math.floor(Date.now() / 1000))
          });

          const configStoryRes = await fetch('https://www.instagram.com/api/v1/media/configure_to_story/', {
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
            body: bodyParamsStory.toString()
          });

          const configStoryJson = await configStoryRes.json();
          if (configStoryJson.status === 'ok') {
            const storyMedia = configStoryJson.media || {};
            storyResult = {
              success: true,
              code: storyMedia.code || '',
              mediaId: storyMedia.id || storyMedia.pk,
              storyUrl: 'https://www.instagram.com/stories/omelhorcupom.com.br/'
            };
          } else {
            console.warn('Instagram rejeitou story:', configStoryJson);
          }
        }
      } catch (storyErr) {
        console.warn('Falha na publicação do Story:', storyErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      code: feedCode,
      postUrl,
      mediaId: feedMedia.id || feedMedia.pk,
      storyPublished: !!storyResult?.success,
      storyCode: storyResult?.code || '',
      storyUrl: storyResult?.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/',
      message: storyResult?.success
        ? 'Publicado com sucesso no feed e nos stories com link oficial de @omelhorcupom.com.br!'
        : 'Post publicado com sucesso no feed oficial de @omelhorcupom.com.br!'
    });
  } catch (err) {
    console.error('Erro na publicação automática:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
