// src/utils/instagramAutoPublisher.js
// Utilitário de Publicação Automática no Instagram para Novos Parceiros Credenciados
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

export const getStoreLocationText = (store) => {
  if (!store) return 'Brasil';
  const city = (store.city || '').toLowerCase();
  const address = (store.address || '').toLowerCase();
  const type = (store.type || '').toLowerCase();
  const badge = (store.badge || '').toLowerCase();

  if (
    type === 'online' ||
    city.includes('online') ||
    city.includes('todo o brasil') ||
    address.includes('online') ||
    badge.includes('online')
  ) {
    return 'Brasil';
  }

  return store.city || 'Brasil';
};

export const isBigNetworkOrApiStore = (store) => {
  if (!store) return false;
  if (store.isApiIntegrated || store.apiSource || store.apiStatus) return true;
  if (store.type === 'online' || store.type === 'api' || store.type === 'affiliate' || store.isOnline) return true;
  if (Array.isArray(store.cities) && store.cities.length > 1) return true;
  if (store.isNational || store.isChain || store.network) return true;
  if (store.category === 'redes-nacionais' || store.category === 'grandes-redes' || store.category === 'afiliados') return true;
  const city = (store.city || '').toLowerCase();
  if (city.includes('online') || city.includes('todo o brasil') || city.includes('brasil')) return true;
  const badge = (store.badge || '').toLowerCase();
  if (badge.includes('api') || badge.includes('lomadee') || badge.includes('awin') || badge.includes('shopee') || badge.includes('afiliado')) return true;

  // Grandes marcas e franquias nacionais (Track & Field, McDonald's, Outback, Sephora, etc.)
  const name = (store.name || '').toLowerCase();
  const bigBrandKeywords = [
    'track & field', 'track&field', 'mcdonald', 'burger king', 'outback', 'smart fit',
    'starbucks', 'cacau show', 'cinemark', 'fogo de chão', 'madero', 'spoleto',
    'drogasil', 'magazine luiza', 'magalu', 'centauro', 'casas bahia', 'kabum',
    'aliexpress', 'amazon', 'shopee', 'shein', 'mercado livre', 'boticário',
    'iplace', 'sephora', 'subway', 'pão de açúcar', 'petz', 'nike', 'adidas', 'samsung'
  ];
  if (bigBrandKeywords.some(keyword => name.includes(keyword))) {
    return true;
  }

  return false;
};

export const KNOWN_BRAND_INSTAGRAMS = {
  'outback steakhouse': '@outbackbrasil',
  'outback': '@outbackbrasil',
  'mcdonald\'s brasil': '@mcdonalds_br',
  'mcdonalds': '@mcdonalds_br',
  'mcdonald\'s': '@mcdonalds_br',
  'burger king': '@burgerkingbr',
  'barbearia corleone': '@barbeariacorleone',
  'smart fit academias': '@smartfit',
  'smart fit': '@smartfit',
  'starbucks brasil': '@starbucksbrasil',
  'starbucks': '@starbucksbrasil',
  'cacau show': '@cacaushow',
  'cinemark brasil': '@cinemarkoficial',
  'cinemark': '@cinemarkoficial',
  'fogo de chão': '@fogodechaobr',
  'madero steakhouse': '@maderobrasil',
  'madero': '@maderobrasil',
  'spoleto': '@spoleto_oficial',
  'drogasil': '@drogasiloficial',
  'magazine luiza': '@magalu',
  'magalu': '@magalu',
  'centauro': '@centauroesporte',
  'casas bahia': '@casasbahia',
  'kabum': '@kabum.com.br',
  'aliexpress': '@aliexpressbr',
  'amazon': '@amazonbrasil',
  'shopee': '@shopee_br',
  'track & field': '@trackfieldoficial',
  'track & field leblon': '@trackfieldoficial',
  'track&field': '@trackfieldoficial',
  'o boticário': '@oboticario',
  'boticário': '@oboticario',
  'sephora brasil': '@sephora_brasil',
  'sephora': '@sephora_brasil',
  'petz': '@petz',
  'petz megastore': '@petz',
  'subway brasil': '@subwaybrasil',
  'subway': '@subwaybrasil',
  'iplace': '@iplace',
  'iplace apple premium reseller': '@iplace',
  'boteco belmonte': '@boteco_belmonte',
  'boteco belmonte rio': '@boteco_belmonte',
  'choperia pinguim': '@pinguimofficial',
  'choperia pinguim bh': '@pinguimofficial',
  'fogo de chão batel': '@fogodechaobr',
  'mercado livre': '@mercadolivre'
};

export const getPartnerInstagramHandle = (store, overrideHandle = '') => {
  if (overrideHandle?.trim()) {
    const clean = overrideHandle.trim();
    return clean.startsWith('@') ? clean : `@${clean}`;
  }
  if (store?.instagram?.trim()) {
    const clean = store.instagram.trim();
    return clean.startsWith('@') ? clean : `@${clean}`;
  }
  const lowerName = (store?.name || '').toLowerCase().trim();
  if (KNOWN_BRAND_INSTAGRAMS[lowerName]) {
    return KNOWN_BRAND_INSTAGRAMS[lowerName];
  }
  for (const [key, handle] of Object.entries(KNOWN_BRAND_INSTAGRAMS)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return handle;
    }
  }
  if (store?.name) {
    const handleSlug = store.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9._]/g, '');
    if (handleSlug) return `@${handleSlug}`;
  }
  return '@lojaparceira';
};

// Formatar Legenda Oficial do Instagram
export const formatStoreCaption = (store, activeHandle = '@omelhorcupom.com.br', overrideHandle = '') => {
  const cleanStore = store?.name || 'Comércio Parceiro';
  const partnerHandle = getPartnerInstagramHandle(store, overrideHandle);

  const locationText = getStoreLocationText(store);
  const isBig = isBigNetworkOrApiStore(store);
  const cleanCity = (locationText || 'Brasil').split('-')[0].trim();
  const hashtagStore = cleanStore.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
  const hashtagCity = cleanCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');

  const introLine = isBig
    ? `Agora você economiza com cupons exclusivos no ${cleanStore} (${partnerHandle})! ✨`
    : `Agora você economiza com cupons exclusivos no ${cleanStore} (${partnerHandle}) em ${locationText}! ✨`;

  const hashtags = isBig
    ? `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #Economia #CuponsBrasil`
    : `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #${hashtagCity} #Economia #CuponsBrasil`;

  return `🎉 NOVA PARCERIA CREDENCIADA NO MELHOR CUPOM! 🎟️🔥\n\n${introLine}\n\n✅ Descontos exclusivos fisicamente e online\n✅ Siga ${partnerHandle} e não perca nenhuma promoção!\n✅ Resgate gratuito pelo site oficial!\n\n👉 Acesse o link da nossa bio ${activeHandle} ou no link direto dos Stories para resgatar seus cupons!\n\nParceria oficial: ${partnerHandle} + ${activeHandle}! 🤝\n\n${hashtags}`;
};

// Renderizar arte em Canvas (para Feed 1080x1080 ou Stories 1080x1920)
export const renderStoreArtworkToCanvas = async (targetCanvas, targetFormat = 'feed', store, activeHandle = '@omelhorcupom.com.br') => {
  if (!targetCanvas || !store) return;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;
  const height = targetFormat === 'feed' ? 1080 : 1920;
  targetCanvas.width = width;
  targetCanvas.height = height;

  const locationText = getStoreLocationText(store);
  const isBig = isBigNetworkOrApiStore(store);

  // 1. Fundo Gradiente Luxury Dark
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0A0A0F');
  bgGrad.addColorStop(0.4, '#13131F');
  bgGrad.addColorStop(0.8, '#181528');
  bgGrad.addColorStop(1, '#09090C');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Banner da Loja
  const bannerHeight = targetFormat === 'feed' ? 340 : 540;
  if (store.image) {
    try {
      const bannerImg = new Image();
      bannerImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        bannerImg.onload = resolve;
        bannerImg.onerror = resolve;
        bannerImg.src = store.image;
      });

      if (bannerImg.width > 0) {
        ctx.save();
        ctx.drawImage(bannerImg, 0, 0, width, bannerHeight);

        const bannerOverlay = ctx.createLinearGradient(0, 0, 0, bannerHeight);
        bannerOverlay.addColorStop(0, 'rgba(10, 10, 15, 0.35)');
        bannerOverlay.addColorStop(0.65, 'rgba(10, 10, 15, 0.75)');
        bannerOverlay.addColorStop(1, '#0A0A0F');
        ctx.fillStyle = bannerOverlay;
        ctx.fillRect(0, 0, width, bannerHeight);
        ctx.restore();
      }
    } catch (e) {}
  }

  // 3. Aura Luminosa Laranja
  const aura = ctx.createRadialGradient(width * 0.5, targetFormat === 'feed' ? 520 : 880, 20, width * 0.5, targetFormat === 'feed' ? 520 : 880, 480);
  aura.addColorStop(0, 'rgba(255, 95, 0, 0.35)');
  aura.addColorStop(0.5, 'rgba(255, 95, 0, 0.1)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  // 4. Logo do Lojista
  const logoY = targetFormat === 'feed' ? 195 : 360;
  const logoRadius = targetFormat === 'feed' ? 125 : 170;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
  ctx.shadowBlur = 28;
  ctx.strokeStyle = '#FF5F00';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(width / 2, logoY, logoRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  let logoDrawn = false;
  if (store.logoImage || store.image) {
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
        logoImg.src = store.logoImage || store.image;
      });

      const naturalW = logoImg.naturalWidth || logoImg.width;
      const naturalH = logoImg.naturalHeight || logoImg.height;

      if (naturalW > 0 && naturalH > 0) {
        const aspect = naturalW / naturalH;
        const innerR = logoRadius - 16;
        const maxBoxW = innerR * 1.55;
        const maxBoxH = innerR * 1.35;

        let drawW, drawH;
        if (aspect >= 1) {
          drawW = maxBoxW;
          drawH = drawW / aspect;
          if (drawH > maxBoxH) {
            drawH = maxBoxH;
            drawW = drawH * aspect;
          }
        } else {
          drawH = maxBoxH;
          drawW = drawH * aspect;
          if (drawW > maxBoxW) {
            drawW = maxBoxW;
            drawW = maxBoxW / aspect;
          }
        }

        const drawX = (width / 2) - (drawW / 2);
        const drawY = logoY - (drawH / 2);

        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
        ctx.restore();
        logoDrawn = true;
      }
    } catch (e) {}
  }

  if (!logoDrawn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
    ctx.clip();
    const circleGrad = ctx.createLinearGradient(width / 2 - logoRadius, logoY - logoRadius, width / 2 + logoRadius, logoY + logoRadius);
    circleGrad.addColorStop(0, '#1F1F2E');
    circleGrad.addColorStop(1, '#111119');
    ctx.fillStyle = circleGrad;
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (store.logo && store.logo.length <= 4) {
      ctx.font = targetFormat === 'feed' ? '96px "Inter", sans-serif' : '130px "Inter", sans-serif';
      ctx.fillText(store.logo, width / 2, logoY);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = targetFormat === 'feed' ? 'bold 90px "Inter", sans-serif' : 'bold 120px "Inter", sans-serif';
      ctx.fillText((store.name || 'MC').substring(0, 2).toUpperCase(), width / 2, logoY);
    }
    ctx.restore();
  }

  // 5. Nome da Loja
  const storeNameY = logoY + logoRadius + 36;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 40px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const storeName = store.name || 'Estabelecimento Parceiro';
  ctx.fillText(storeName.length > 28 ? storeName.substring(0, 26) + '...' : storeName, width / 2, storeNameY);

  if (!isBig && locationText && locationText !== 'Brasil') {
    const cityY = storeNameY + 34;
    ctx.fillStyle = '#FF9D5C';
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillText(locationText, width / 2, cityY);
  }
  ctx.restore();

  // 6. Símbolo de Parceria "+"
  const plusY = targetFormat === 'feed' ? (isBig ? 425 : 445) : (isBig ? 685 : 710);
  ctx.save();
  const gradText = ctx.createLinearGradient(width * 0.45, plusY - 25, width * 0.55, plusY + 25);
  gradText.addColorStop(0, '#FFFFFF');
  gradText.addColorStop(0.5, '#FFF1EB');
  gradText.addColorStop(1, '#FF7A29');
  ctx.fillStyle = gradText;
  ctx.shadowColor = 'rgba(255, 95, 0, 0.75)';
  ctx.shadowBlur = 28;
  ctx.font = targetFormat === 'feed' ? '900 68px "Inter", sans-serif' : '900 84px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('+', width / 2, plusY);
  ctx.restore();

  // 7. Logo do Melhor Cupom
  let mcLogoBottom = plusY + 200;
  try {
    const mcLogoImg = new Image();
    mcLogoImg.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      mcLogoImg.onload = resolve;
      mcLogoImg.onerror = resolve;
      mcLogoImg.src = logoMelhorCupom;
    });

    if (mcLogoImg.width > 0) {
      const mcLogoWidth = targetFormat === 'feed' ? 340 : 470;
      const mcLogoHeight = (mcLogoImg.height / mcLogoImg.width) * mcLogoWidth;
      const mcLogoX = (width - mcLogoWidth) / 2;
      const mcLogoY = plusY + (targetFormat === 'feed' ? 46 : 65);
      mcLogoBottom = mcLogoY + mcLogoHeight;

      ctx.save();
      ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
      ctx.shadowBlur = 28;
      ctx.drawImage(mcLogoImg, mcLogoX, mcLogoY, mcLogoWidth, mcLogoHeight);
      ctx.restore();
    }
  } catch (e) {}

  // 8. Botão de Resgate
  const btnText = 'RESGATE SEU CUPOM EXCLUSIVO';
  ctx.font = targetFormat === 'feed' ? '900 24px "Inter", sans-serif' : '900 32px "Inter", sans-serif';
  const textMetrics = ctx.measureText(btnText);
  const btnPaddingX = targetFormat === 'feed' ? 56 : 72;
  const btnW = Math.max(targetFormat === 'feed' ? 560 : 750, textMetrics.width + (btnPaddingX * 2));
  const btnH = targetFormat === 'feed' ? 68 : 88;
  const btnRadius = btnH / 2;
  const btnX = (width - btnW) / 2;
  const botY = targetFormat === 'feed' ? Math.max(745, mcLogoBottom + 50) : 1330;

  ctx.save();
  const btnGrad = ctx.createLinearGradient(btnX, botY, btnX + btnW, botY + btnH);
  btnGrad.addColorStop(0, '#FF5F00');
  btnGrad.addColorStop(1, '#E64A00');
  ctx.fillStyle = btnGrad;
  ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.roundRect(btnX, botY, btnW, btnH, btnRadius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(btnText, width / 2, botY + (btnH / 2) - 1);
  ctx.restore();

  // 9. Rodapé
  const footerY = targetFormat === 'feed' ? 880 : 1520;
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Disponível no app e em www.omelhorcupom.com.br', width / 2, footerY);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText(`Siga ${activeHandle} para não perder nenhuma oferta`, width / 2, footerY + 34);
  ctx.restore();
};

// Gerar Base64 da arte
export const generateStoreArtworkBase64 = async (store, format = 'feed', activeHandle = '@omelhorcupom.com.br') => {
  const canvas = document.createElement('canvas');
  await renderStoreArtworkToCanvas(canvas, format, store, activeHandle);
  return canvas.toDataURL('image/jpeg', 0.88);
};

// Identificar se a loja já foi publicada
export const isStoreAlreadyPublished = (store, customHistory = null) => {
  if (!store) return false;

  // 1. Conferir conjunto salvo em localStorage
  try {
    const rawIds = localStorage.getItem('melhor_cupom_published_store_ids');
    if (rawIds) {
      const list = JSON.parse(rawIds);
      if (Array.isArray(list)) {
        if (store.id && list.includes(String(store.id))) return true;
        if (store.name && list.includes(store.name.trim().toLowerCase())) return true;
      }
    }
  } catch (e) {}

  // 2. Conferir histórico de postagens
  let history = customHistory;
  if (!history) {
    try {
      const rawHistory = localStorage.getItem('melhor_cupom_instagram_history_v2');
      if (rawHistory) history = JSON.parse(rawHistory);
    } catch (e) {}
  }

  if (Array.isArray(history)) {
    return history.some(post => {
      if (post.storeId && String(post.storeId) === String(store.id)) return true;
      if (post.storeName && post.storeName.trim().toLowerCase() === store.name?.trim().toLowerCase()) return true;
      return false;
    });
  }

  return false;
};

// Marcar loja como publicada
export const markStoreAsPublished = (store, postData = null) => {
  if (!store) return;
  try {
    const rawIds = localStorage.getItem('melhor_cupom_published_store_ids');
    let list = rawIds ? JSON.parse(rawIds) : [];
    if (!Array.isArray(list)) list = [];

    if (store.id && !list.includes(String(store.id))) list.push(String(store.id));
    if (store.name && !list.includes(store.name.trim().toLowerCase())) list.push(store.name.trim().toLowerCase());

    localStorage.setItem('melhor_cupom_published_store_ids', JSON.stringify(list));

    if (postData) {
      const rawHistory = localStorage.getItem('melhor_cupom_instagram_history_v2');
      let history = rawHistory ? JSON.parse(rawHistory) : [];
      if (!Array.isArray(history)) history = [];
      const updated = [postData, ...history];
      localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(updated));
    }

    // Disparar evento para atualizar qualquer componente aberto na tela
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('melhor-cupom-store-published', {
        detail: { store, post: postData }
      }));
    }
  } catch (e) {
    console.warn('Erro ao marcar loja como publicada:', e);
  }
};

// Publicação 100% Automática de um Novo Parceiro
export const autoPublishStoreToInstagram = async (store, coupons = []) => {
  if (!store) return { success: false, reason: 'Loja inválida' };

  // Verificar se o recurso está ativado
  let autoPublishEnabled = true;
  try {
    const savedToggle = localStorage.getItem('melhor_cupom_auto_publish_new_partners');
    if (savedToggle !== null) autoPublishEnabled = JSON.parse(savedToggle);
  } catch (e) {}

  if (!autoPublishEnabled) {
    console.log('[AutoPublish] Publicação automática desativada pelo administrador.');
    return { success: false, reason: 'disabled_by_admin' };
  }

  // Se já foi publicado, não repete
  if (isStoreAlreadyPublished(store)) {
    console.log(`[AutoPublish] Loja "${store.name}" já foi publicada anteriormente. Pulando.`);
    return { success: false, reason: 'already_published' };
  }

  console.log(`🚀 [AutoPublish] Iniciando publicação automática para o novo parceiro: ${store.name}`);

  try {
    let handle = '@omelhorcupom.com.br';
    try {
      const rawSession = localStorage.getItem('melhor_cupom_instagram_session_v2');
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed.username) handle = parsed.username;
      }
    } catch (e) {}

    const savedSessionId = (typeof localStorage !== 'undefined' && localStorage.getItem('melhor_cupom_instagram_sessionid')) || '';

    // Encontrar oferta da loja
    const storeCoupons = Array.isArray(coupons) ? coupons.filter(c => c.storeId === store.id) : [];
    const featuredCoupon = storeCoupons[0];
    const storyOfferUrl = store.id
      ? (featuredCoupon 
          ? `https://www.omelhorcupom.com.br/?loja=${store.id}&cupom=${featuredCoupon.id}`
          : `https://www.omelhorcupom.com.br/?loja=${store.id}`)
      : 'https://www.omelhorcupom.com.br';

    // Gerar artes
    const feedImageBase64 = await generateStoreArtworkBase64(store, 'feed', handle);
    const storyImageBase64 = await generateStoreArtworkBase64(store, 'story', handle);
    const caption = formatStoreCaption(store, handle);
    const locationText = getStoreLocationText(store);

    // Disparar API de Publicação
    const res = await fetch('/api/instagram-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: feedImageBase64,
        feedImageBase64,
        storyImageBase64,
        publishStory: true,
        storyLinkUrl: storyOfferUrl,
        linkTitle: 'RESGATAR CUPOM',
        caption,
        storeName: store.name,
        sessionId: savedSessionId,
        format: 'feed_and_story'
      })
    });

    if (!res.ok) {
      throw new Error(`Erro na resposta da API (${res.status})`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || data.message || 'Falha ao publicar');
    }

    const isStoryOk = !!data.storyPublished;
    const newPost = {
      id: `post_auto_${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      city: locationText,
      publishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      format: isStoryOk ? 'Feed (1080x1080) + Stories (1080x1920)' : 'Feed (1080x1080)',
      status: 'Publicado Automaticamente pelo Robô ⚡',
      postUrl: data.postUrl || `https://www.instagram.com/${handle.replace('@', '')}/`,
      storyUrl: data.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/'
    };

    // Marcar como publicado e atualizar histórico
    markStoreAsPublished(store, newPost);

    console.log(`🎉 [AutoPublish] "${store.name}" publicado com sucesso no Instagram!`);
    return { success: true, post: newPost };
  } catch (err) {
    console.error(`[AutoPublish] Erro ao publicar "${store.name}":`, err.message);
    return { success: false, error: err.message };
  }
};
