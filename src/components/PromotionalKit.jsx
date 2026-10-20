import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Send, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Tag, 
  RefreshCw, 
  Instagram, 
  Zap,
  MapPin,
  Plus,
  Terminal,
  LogIn,
  AlertCircle,
  X,
  Key,
  Users,
  Store,
  Sliders,
  Maximize2
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { InstagramLoginModal } from './InstagramLoginModal';
import { BrandMediaKitSection } from './BrandMediaKitSection';
import { useApp } from '../context/AppContext';
import { getBrandLogo } from '../assets/brands';
import { 
  isStoreAlreadyPublished, 
  markStoreAsPublished,
  getPartnerInstagramHandle 
} from '../utils/instagramAutoPublisher';

// Utilitário para formatar a localização da loja:
// "abaixo do nome apareça a cidade ,loja online aparecer brasil"
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

// Utilitário para identificar redes grandes, franquias nacionais e lojas integradas via API
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

// ============================================================================
// 1. COMPONENTE: KIT DE DIVULGAÇÃO DO LOJISTA (MerchantPromoKit)
// ============================================================================
export const MerchantPromoKit = ({ store, coupons = [] }) => {
  const [format, setFormat] = useState('feed'); // 'feed' (1:1) ou 'story' (9:16)
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const canvasRef = useRef(null);

  const activeCouponsCount = coupons.filter(c => c.active !== false).length;
  const bestCoupon = coupons[0];
  const locationText = getStoreLocationText(store);

  // Renderizar a arte no canvas sempre que o formato ou a loja mudar
  useEffect(() => {
    drawArtwork();
  }, [format, store]);

  const drawArtwork = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = format === 'feed' ? 1080 : 1920;

    canvas.width = width;
    canvas.height = height;

    // 1. Fundo Gradiente Luxury Dark
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#09090D');
    bgGrad.addColorStop(0.35, '#12121B');
    bgGrad.addColorStop(0.7, '#161424');
    bgGrad.addColorStop(1, '#0A0A0E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Auras Luminosas Radiais Padrão Oficial Melhor Cupom
    const orangeAura = ctx.createRadialGradient(width * 0.5, height * 0.25, 20, width * 0.5, height * 0.25, 520);
    orangeAura.addColorStop(0, 'rgba(255, 95, 0, 0.38)');
    orangeAura.addColorStop(0.5, 'rgba(255, 95, 0, 0.12)');
    orangeAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orangeAura;
    ctx.fillRect(0, 0, width, height);

    // Aura central padronizada
    const centerAura = ctx.createRadialGradient(width * 0.5, format === 'feed' ? 440 : 760, 20, width * 0.5, format === 'feed' ? 440 : 760, 420);
    centerAura.addColorStop(0, 'rgba(255, 95, 0, 0.28)');
    centerAura.addColorStop(0.6, 'rgba(255, 95, 0, 0.05)');
    centerAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = centerAura;
    ctx.fillRect(0, 0, width, height);

    // Linhas e arcos decorativos de fundo
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.5, format === 'feed' ? 195 : 360, format === 'feed' ? 260 : 360, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Container Circular com Logo do Lojista (Borda Padronizada Oficial em Destaque Maior)
    const logoCenterY = format === 'feed' ? 195 : 360;
    const logoRadius = format === 'feed' ? 125 : 170;
    const clipRadius = logoRadius - 4;
    const circleDiameter = clipRadius * 2;

    const activeFit = store?.logoFit || 'contain';
    const activeScale = (store?.logoScale !== undefined ? store.logoScale : 115) / 100;
    const activeBg = store?.logoBg || '#FFFFFF';

    // 1. Fundo do Interior do Círculo
    ctx.save();
    ctx.fillStyle = activeBg;
    ctx.beginPath();
    ctx.arc(width / 2, logoCenterY, clipRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Borda Padrão Oficial Melhor Cupom (Laranja Oficial + Anel Interno Branco)
    ctx.save();
    ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
    ctx.shadowBlur = 28;
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(width / 2, logoCenterY, logoRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(width / 2, logoCenterY, clipRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Desenhar imagem real da logo da loja proporcionalmente com expansão harmônica
    let logoDrawn = false;
    const storeLogoSrc = store?.logoImage || 
      getBrandLogo(store?.name) || 
      getBrandLogo(store?.id) || 
      getBrandLogo(store?.apiSource) || 
      store?.image;

    if (storeLogoSrc) {
      try {
        const storeImg = new Image();
        storeImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          storeImg.onload = resolve;
          storeImg.onerror = resolve;
          storeImg.src = storeLogoSrc;
        });

        const naturalW = storeImg.naturalWidth || storeImg.width;
        const naturalH = storeImg.naturalHeight || storeImg.height;

        if (naturalW > 0 && naturalH > 0) {
          const aspect = naturalW / naturalH;

          let drawW, drawH;
          if (activeFit === 'cover') {
            const scale = Math.max(circleDiameter / naturalW, circleDiameter / naturalH) * activeScale;
            drawW = naturalW * scale;
            drawH = naturalH * scale;
          } else {
            let baseW, baseH;
            if (aspect >= 1.4) {
              baseW = circleDiameter * 0.94;
              baseH = baseW / aspect;
              const maxSafeH = circleDiameter * 0.78;
              if (baseH > maxSafeH) {
                baseH = maxSafeH;
                baseW = baseH * aspect;
              }
            } else if (aspect >= 1.1) {
              baseW = circleDiameter * 0.90;
              baseH = baseW / aspect;
            } else if (aspect >= 0.9) {
              baseW = circleDiameter * 0.92;
              baseH = circleDiameter * 0.92;
            } else {
              baseH = circleDiameter * 0.90;
              baseW = baseH * aspect;
            }
            drawW = baseW * activeScale;
            drawH = baseH * activeScale;
          }

          const drawX = (width / 2) - (drawW / 2);
          const drawY = logoCenterY - (drawH / 2);

          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, logoCenterY, clipRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(storeImg, drawX, drawY, drawW, drawH);
          ctx.restore();
          logoDrawn = true;
        }
      } catch (e) {
        console.warn('Erro ao carregar imagem da logo do lojista:', e);
      }
    }

    // Fallback: se a imagem não carregar ou não existir
    if (!logoDrawn) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
      ctx.clip();
      const circleGrad = ctx.createLinearGradient(width / 2 - logoRadius, logoCenterY - logoRadius, width / 2 + logoRadius, logoCenterY + logoRadius);
      circleGrad.addColorStop(0, '#1F1F2E');
      circleGrad.addColorStop(1, '#111119');
      ctx.fillStyle = circleGrad;
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (store?.logo && store.logo.length <= 4) {
        ctx.font = format === 'feed' ? '96px "Inter", sans-serif' : '130px "Inter", sans-serif';
        ctx.fillText(store.logo, width / 2, logoCenterY);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = format === 'feed' ? 'bold 90px "Inter", sans-serif' : 'bold 120px "Inter", sans-serif';
        ctx.fillText((store?.name || 'MC').substring(0, 2).toUpperCase(), width / 2, logoCenterY);
      }
      ctx.restore();
    }

    // 4. Nome da Loja
    const storeNameY = logoCenterY + logoRadius + 36;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 40px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const storeName = store?.name || 'Nossa Loja Parceira';
    ctx.fillText(storeName.length > 28 ? storeName.substring(0, 26) + '...' : storeName, width / 2, storeNameY);

    // 5. ABAIXO DO NOME APARECER A CIDADE (SOMENTE SE NÃO FOR REDE GRANDE / API)
    const isBig = isBigNetworkOrApiStore(store);
    if (!isBig && locationText && locationText !== 'Brasil') {
      const cityY = storeNameY + 34;
      ctx.fillStyle = '#FF9D5C';
      ctx.font = '700 24px "Inter", sans-serif';
      ctx.fillText(locationText, width / 2, cityY);
    }
    ctx.restore();

    // 6. SÍMBOLO DE COLABORAÇÃO: "+" AO INVÉS DA ESCRITA
    const plusY = format === 'feed' ? (isBig ? 425 : 445) : (isBig ? 685 : 710);
    ctx.save();
    const plusGrad = ctx.createLinearGradient(width * 0.45, plusY - 25, width * 0.55, plusY + 25);
    plusGrad.addColorStop(0, '#FFFFFF');
    plusGrad.addColorStop(0.5, '#FFF2EB');
    plusGrad.addColorStop(1, '#FF7A29');
    ctx.fillStyle = plusGrad;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.75)';
    ctx.shadowBlur = 28;
    ctx.font = format === 'feed' ? '900 68px "Inter", sans-serif' : '900 84px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', width / 2, plusY);
    ctx.restore();

    // 7. LOGO DO MELHOR CUPOM (Com folga vertical perfeita sem colisão)
    let mcLogoBottom = plusY + 220;
    try {
      const mcLogoImg = new Image();
      mcLogoImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        mcLogoImg.onload = resolve;
        mcLogoImg.onerror = resolve;
        mcLogoImg.src = logoMelhorCupom;
      });

      if (mcLogoImg.width > 0) {
        const mcLogoWidth = format === 'feed' ? 340 : 470;
        const mcLogoHeight = (mcLogoImg.height / mcLogoImg.width) * mcLogoWidth;
        const mcLogoX = (width - mcLogoWidth) / 2;
        const mcLogoY = plusY + (format === 'feed' ? 46 : 65);
        mcLogoBottom = mcLogoY + mcLogoHeight;

        ctx.save();
        ctx.shadowColor = 'rgba(255, 95, 0, 0.45)';
        ctx.shadowBlur = 26;
        ctx.drawImage(mcLogoImg, mcLogoX, mcLogoY, mcLogoWidth, mcLogoHeight);
        ctx.restore();
      }
    } catch (e) {
      console.warn('Erro ao desenhar logo Melhor Cupom:', e);
    }

    // 8. Card de Cupom em Destaque (Se Story)
    if (format === 'story') {
      const cardW = 760;
      const cardH = 175;
      const cardX = (width - cardW) / 2;
      const cardY = mcLogoBottom + 55;

      ctx.save();
      ctx.fillStyle = 'rgba(24, 24, 36, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 28);
      ctx.fill();
      ctx.stroke();

      // Badge de Desconto
      ctx.fillStyle = '#FF5F00';
      ctx.font = '900 24px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(bestCoupon?.discountBadge || 'OFERTA EXCLUSIVA VIP', cardX + 40, cardY + 50);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px "Inter", sans-serif';
      const offerTitle = bestCoupon?.title || 'Descontos especiais para membros Melhor Cupom';
      ctx.fillText(offerTitle.length > 36 ? offerTitle.substring(0, 34) + '...' : offerTitle, cardX + 40, cardY + 95);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 19px "Inter", sans-serif';
      ctx.fillText('Apresente no balcão ou use o código online para ativar.', cardX + 40, cardY + 135);
      ctx.restore();
    }

    // 9. BOTÃO / FAIXA DE RESGATE (Garantindo mais de 60px de respiro livre abaixo do logo)
    const ctaY = format === 'feed' ? Math.max(785, mcLogoBottom + 55) : 1410;
    const ctaWidth = 580;
    const ctaHeight = 74;
    const ctaX = (width - ctaWidth) / 2;

    ctx.save();
    const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaWidth, ctaY + ctaHeight);
    ctaGrad.addColorStop(0, '#FF5F00');
    ctaGrad.addColorStop(1, '#FF3300');
    ctx.fillStyle = ctaGrad;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.7)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaWidth, ctaHeight, 37);
    ctx.fill();

    // Borda brilhante no botão
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Texto: "RESGATE SEU CUPOM EXCLUSIVO"
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.font = format === 'feed' ? '900 24px "Inter", sans-serif' : '900 32px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RESGATE SEU CUPOM EXCLUSIVO', width / 2, ctaY + (ctaHeight / 2) - 1);
    ctx.restore();

    // 10. Rodapé informativo
    const footerY = format === 'feed' ? 925 : 1580;
    ctx.save();
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Acesse pelo link na bio ou baixe o app:', width / 2, footerY);

    ctx.fillStyle = '#FF9D5C';
    ctx.font = '900 28px "Inter", sans-serif';
    ctx.fillText('www.omelhorcupom.com.br', width / 2, footerY + 36);

    ctx.fillStyle = '#6B7280';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText('A maior rede de cupons e economia do comércio local', width / 2, footerY + 70);
    ctx.restore();

    // Borda Externa Minimalista Fina (Padrão Oficial do Folder de Divulgação)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(32, 32, width - 64, height - 64, 36);
    ctx.stroke();
    ctx.restore();
  };

  // Download do arquivo PNG em alta resolução
  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        const cleanName = (store?.name || 'loja').toLowerCase().replace(/[^a-z0-9]/g, '-');
        link.download = `melhor-cupom-divulgacao-${cleanName}-${format}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Erro ao baixar arte:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  // Copiar legenda sugerida
  const handleCopyCaption = () => {
    const caption = `🎉 TEMOS UMA NOVIDADE INCRÍVEL! 🎟️✨\n\nAgora o ${store?.name || 'nosso estabelecimento'} + @omelhorcupom.com.br estão juntos!\n\nSe você é cliente ou quer aproveitar nossos produtos com economia real, nós disponibilizamos cupons exclusivos com descontos especiais para você resgatar gratuitamente agora mesmo!\n\n👉 COMO RESGATAR SEU CUPOM:\n1️⃣ Acesse o link na nossa bio @omelhorcupom.com.br ou acesse www.omelhorcupom.com.br\n2️⃣ Procure por "${store?.name || 'nossa loja'}"\n3️⃣ Resgate seu cupom grátis e aproveite!\n\nMarque aquele amigo que adora economizar e vem aproveitar! 🔥\n\n#MelhorCupom #Parceria #${(store?.name || 'loja').replace(/\s+/g, '')} #${locationText.split('-')[0].trim().replace(/\s+/g, '')}`;
    
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Principal da Aba */}
      <div className="bg-gradient-to-br from-[#1A1A28] via-[#141420] to-[#0E0E17] border border-orange-500/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 px-3.5 py-1 rounded-full text-orange-400 font-bold text-xs">
              <Share2 size={14} />
              <span>Central Oficial de Divulgação & Redes Sociais</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Kit de Divulgação: {store?.name || 'Loja'} + Melhor Cupom
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Baixe a arte oficial padronizada em alta resolução (1080p) personalizada com o logotipo do seu estabelecimento, símbolo de parceria (+), localização ({locationText}) e a marca do Melhor Cupom!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-gradient-to-r from-[#FF5F00] to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Gerando Imagem HD...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Baixar Arte Oficial (PNG)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyCaption}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span className="text-emerald-400 font-black">Legenda Copiada!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copiar Legenda</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resumo do Padrão da Arte */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Localização na Arte:</span>
            <span className="px-3 py-1 rounded-xl font-bold border flex items-center gap-1.5 bg-orange-500/15 text-orange-400 border-orange-500/30">
              <MapPin size={13} className="text-orange-400" />
              <span>{locationText}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl font-black border border-amber-500/40 bg-amber-500/15 text-amber-300 flex items-center gap-1.5">
              <Instagram size={14} className="text-[#FF5F00]" />
              <span>Lembre-se de marcar sempre <strong>@omelhorcupom.com.br</strong> nas suas divulgações!</span>
            </span>
            <div className="flex items-center gap-2 text-gray-400">
              <Tag size={13} className="text-orange-400" />
              <span>{activeCouponsCount} ofertas ativas para divulgação</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Controles à Esquerda e Live Preview à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Painel de Controles & Dicas (Coluna 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Seletor de Formato */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-orange-400" />
              <span>1. Escolha o Formato da Arte</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('feed')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  format === 'feed'
                    ? 'bg-orange-500/15 border-[#FF5F00] text-white shadow-md shadow-orange-600/20'
                    : 'bg-[#14141E] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2.5 font-bold">
                  1:1
                </div>
                <div className="font-bold text-sm text-white">Feed Quadrado</div>
                <div className="text-[11px] text-gray-400 mt-0.5">1080 x 1080 px (Instagram / Face)</div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('story')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  format === 'story'
                    ? 'bg-orange-500/15 border-[#FF5F00] text-white shadow-md shadow-orange-600/20'
                    : 'bg-[#14141E] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2.5 font-bold">
                  9:16
                </div>
                <div className="font-bold text-sm text-white">Stories / Status</div>
                <div className="text-[11px] text-gray-400 mt-0.5">1080 x 1920 px (Reels / WhatsApp)</div>
              </button>
            </div>
          </div>

          {/* Legenda Pronta para Redes Sociais */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>2. Legenda de Alta Conversão</span>
              </h3>
              <button
                onClick={handleCopyCaption}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedCaption ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedCaption ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="bg-[#12121B] border border-white/5 rounded-2xl p-4 text-xs text-gray-300 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {`🎉 TEMOS UMA NOVIDADE INCRÍVEL! 🎟️✨\n\nAgora o ${store?.name || 'nosso estabelecimento'} + @omelhorcupom.com.br estão juntos!\n\nResgate cupons exclusivos gratuitos e venha aproveitar com economia de verdade!\n\n👉 Acesse o link da nossa bio @omelhorcupom.com.br ou pelo site www.omelhorcupom.com.br!`}
            </div>
          </div>

          {/* Dicas de Divulgação Eficaz */}
          <div className="bg-gradient-to-br from-blue-950/40 to-[#181824] border border-blue-500/20 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Zap size={15} />
              <span>Dicas de Ouro para Vender Mais</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#FF5F00] font-black">•</span>
                <span><strong>Marque @omelhorcupom.com.br no Story:</strong> Nossa equipe reposta lojas parceiras para milhares de membros VIP.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF5F00] font-black">•</span>
                <span><strong>Link da Bio:</strong> Adicione o link direto da sua página no Melhor Cupom no perfil do seu Instagram para conversão imediata.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF5F00] font-black">•</span>
                <span><strong>WhatsApp Status:</strong> Poste o formato Story de manhã e no final da tarde nos dias de maior movimento.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Pré-visualização Interativa (Coluna 7) */}
        <div className="lg:col-span-7 bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Eye size={15} className="text-orange-400" />
              <span>Pré-visualização: Parceria (+) ({format === 'feed' ? '1080x1080' : '1080x1920'})</span>
            </div>

            <button
              onClick={handleDownload}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Baixar PNG</span>
            </button>
          </div>

          {/* Canvas Renderizado */}
          <div className="relative w-full flex items-center justify-center bg-black/40 rounded-2xl p-3 border border-white/5 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-2xl max-w-full h-auto transition-all border border-amber-500/30"
              style={{
                maxHeight: format === 'feed' ? '480px' : '620px',
                aspectRatio: format === 'feed' ? '1 / 1' : '9 / 16'
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
            <Sparkles size={13} className="text-amber-400" />
            <span>Arte oficial com símbolo de colaboração (+) entre a loja e o Melhor Cupom.</span>
          </div>

        </div>

      </div>

      {/* Media Kit Oficial: Logos Vetorizadas (.SVG & .PNG Transparente) para Parceiros */}
      <BrandMediaKitSection />

    </div>
  );
};

// ============================================================================
// 2. COMPONENTE: PAINEL DE DIVULGAÇÃO & INSTAGRAM DO ADMIN (AdminPromoManager)
// ============================================================================
export const AdminPromoManager = ({ stores = [], showToast = () => {} }) => {
  const { coupons = [], updateStore } = useApp();
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [format, setFormat] = useState('feed'); // 'feed' (1:1) ou 'story' (9:16)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishErrorModal, setPublishErrorModal] = useState(null);

  // Estados locais para ajuste e expansão da logo em tempo real
  const [liveLogoScale, setLiveLogoScale] = useState(115);
  const [liveLogoFit, setLiveLogoFit] = useState('contain');
  const [liveLogoBg, setLiveLogoBg] = useState('#ffffff');
  const [savedLogoSettings, setSavedLogoSettings] = useState(false);

  // Sessão Oficial do Instagram via Meta Graph API v20.0 (App ID: 4514869808731364 • Account ID: 28667775222832917)
  const [instagramSession, setInstagramSession] = useState(() => {
    const defaultMetaSession = {
      isConnected: true,
      username: '@omelhorcupom.com.br',
      accountType: 'meta_graph_api',
      appId: '4514869808731364',
      instagramAccountId: '28667775222832917',
      connectedAt: new Date().toISOString(),
      cookiesCount: 1,
      hasSessionId: true
    };
    try {
      const saved = localStorage.getItem('melhor_cupom_instagram_session_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isConnected && parsed.accountType === 'meta_graph_api') return parsed;
      }
      localStorage.setItem('melhor_cupom_instagram_session_v3', JSON.stringify(defaultMetaSession));
    } catch {}
    return defaultMetaSession;
  });

  // Histórico de postagens reais (inicia limpo sem dados falsos)
  const [postHistory, setPostHistory] = useState(() => {
    try {
      const requeueKey = 'melhor_cupom_requeue_sephora_petz_v1';
      if (!localStorage.getItem(requeueKey)) {
        const rawIds = localStorage.getItem('melhor_cupom_published_store_ids');
        if (rawIds) {
          const parsedIds = JSON.parse(rawIds);
          if (Array.isArray(parsedIds)) {
            const filteredIds = parsedIds.filter(item => {
              const val = String(item).toLowerCase().trim();
              return !val.includes('sephora') && !val.includes('petz');
            });
            localStorage.setItem('melhor_cupom_published_store_ids', JSON.stringify(filteredIds));
          }
        }

        const rawHist = localStorage.getItem('melhor_cupom_instagram_history_v2');
        if (rawHist) {
          const parsedHist = JSON.parse(rawHist);
          if (Array.isArray(parsedHist)) {
            const filteredHist = parsedHist.filter(post => {
              const sId = String(post.storeId || '').toLowerCase();
              const sName = String(post.storeName || '').toLowerCase();
              return !sId.includes('sephora') && !sId.includes('petz') && !sName.includes('sephora') && !sName.includes('petz');
            });
            localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(filteredHist));
          }
        }
        localStorage.setItem(requeueKey, 'done');
      }

      const saved = localStorage.getItem('melhor_cupom_instagram_history_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [customCaption, setCustomCaption] = useState('');
  const canvasRef = useRef(null);

  // Lojas já publicadas (ocultar por padrão para facilitar novas divulgações)
  const [showAllStores, setShowAllStores] = useState(false);
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_auto_publish_new_partners');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true; // Ativado por padrão para novos parceiros
  });

  // Lojas / Parceiros de API excluídos manualmente da fila de divulgação pelo 'X'
  const [dismissedStoreIds, setDismissedStoreIds] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_dismissed_promo_stores_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const handleDismissStore = (storeId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = [...new Set([...dismissedStoreIds, storeId])];
    setDismissedStoreIds(next);
    localStorage.setItem('melhor_cupom_dismissed_promo_stores_v1', JSON.stringify(next));
    const targetStore = stores.find(s => s.id === storeId);
    showToast(`✕ "${targetStore?.name || 'Parceiro'}" removido da fila de divulgação.`, 'info');

    // Se a loja removida estava selecionada, selecionar a próxima
    if (selectedStoreId === storeId) {
      const remaining = pendingStores.filter(s => s.id !== storeId);
      if (remaining.length > 0) {
        setSelectedStoreId(remaining[0].id);
      } else {
        setSelectedStoreId('promo_cadastro_usuario');
      }
    }
  };

  const handleRestoreDismissedStores = () => {
    setDismissedStoreIds([]);
    localStorage.removeItem('melhor_cupom_dismissed_promo_stores_v1');
    showToast('✓ Lojas e parceiros de API restaurados para a fila de divulgação!', 'success');
  };

  // Destino da Publicação: 'both' (Feed + Stories), 'feed_only' (Apenas Feed), 'story_only' (Apenas Stories)
  const [publishDestination, setPublishDestination] = useState('both');

  const toggleAutoPublish = () => {
    const next = !autoPublishEnabled;
    setAutoPublishEnabled(next);
    localStorage.setItem('melhor_cupom_auto_publish_new_partners', JSON.stringify(next));
    showToast(
      next 
        ? '⚡ Piloto Automático ATIVADO: Novos parceiros cadastrados a partir de agora serão postados sozinhos via Meta Graph API!' 
        : 'Piloto Automático DESATIVADO: Novos parceiros aguardarão seu clique manual.',
      next ? 'success' : 'info'
    );
  };

  // Devolver loja do histórico para a fila de pendentes
  const handleReturnStoreToQueue = (postOrStore) => {
    const targetId = String(postOrStore?.storeId || postOrStore?.id || '').toLowerCase();
    const targetName = String(postOrStore?.storeName || postOrStore?.name || '').toLowerCase().trim();

    try {
      const rawIds = localStorage.getItem('melhor_cupom_published_store_ids');
      if (rawIds) {
        const list = JSON.parse(rawIds);
        if (Array.isArray(list)) {
          const nextIds = list.filter(item => {
            const v = String(item).toLowerCase().trim();
            return v !== targetId && v !== targetName;
          });
          localStorage.setItem('melhor_cupom_published_store_ids', JSON.stringify(nextIds));
        }
      }
    } catch {}

    const nextHistory = postHistory.filter(p => {
      const pId = String(p.storeId || '').toLowerCase();
      const pName = String(p.storeName || '').toLowerCase().trim();
      return pId !== targetId && pName !== targetName;
    });
    setPostHistory(nextHistory);
    localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(nextHistory));

    if (postOrStore?.storeId || postOrStore?.id) {
      setSelectedStoreId(postOrStore.storeId || postOrStore.id);
    }
    showToast(`🔄 "${postOrStore?.storeName || postOrStore?.name}" voltou para a fila de divulgação!`, 'info');
  };

  // Consolidar lojas cadastradas + lojas e marcas de cupons avulsos para divulgação no Instagram
  const allPromoStores = useMemo(() => {
    const storeMap = new Map();
    // 1. Inserir lojas oficiais com resolução inteligente de logos
    stores.forEach(s => {
      const resolvedLogo = s.logoImage || getBrandLogo(s.name) || getBrandLogo(s.id) || getBrandLogo(s.apiSource) || '';
      storeMap.set(s.id, {
        ...s,
        logoImage: resolvedLogo
      });
    });

    // 2. Extrair marcas e ofertas de cupons avulsos (ex: Omens) para entrar diretamente na fila de postagens
    coupons.forEach(c => {
      const sId = c.storeId || `store_${c.id}`;
      const resolvedLogo = c.storeLogoImage || c.logoImage || (typeof c.storeLogo === 'string' && (c.storeLogo.startsWith('http') || c.storeLogo.startsWith('data:')) ? c.storeLogo : '') || getBrandLogo(c.storeId) || getBrandLogo(c.storeName) || '';
      if (!storeMap.has(sId)) {
        storeMap.set(sId, {
          id: sId,
          name: c.storeName || c.title,
          legalName: c.storeName || c.title,
          category: c.category || 'geral',
          city: c.city || 'Brasil (Online)',
          cities: c.cities || [c.city || 'Brasil (Online)'],
          type: c.type || 'online',
          isOnline: c.type === 'online' || (c.city && c.city.toLowerCase().includes('online')),
          logo: c.storeLogo || '🏪',
          logoImage: resolvedLogo,
          image: c.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
          tier: 'api',
          isAvulso: true,
          instagram: c.instagram || `@${(c.storeName || 'cupom').toLowerCase().replace(/[^a-z0-9]/g, '')}`
        });
      } else {
        if (c.isAvulso) {
          const existing = storeMap.get(sId);
          storeMap.set(sId, { 
            ...existing, 
            isAvulso: true,
            hasAvulso: true,
            logoImage: resolvedLogo || existing.logoImage,
            image: c.banner || existing.image
          });
        }
      }
    });

    return Array.from(storeMap.values());
  }, [stores, coupons]);

  // Filtrar lojas pendentes (que ainda não foram publicadas e não foram excluídas pelo X)
  // Cupons avulsos possuem prioridade para divulgação rápida pelo ADM
  const pendingStores = allPromoStores
    .filter(s => !isStoreAlreadyPublished(s, postHistory) && !dismissedStoreIds.includes(s.id))
    .sort((a, b) => {
      const aAvulso = (a.isAvulso || a.hasAvulso || String(a.id).startsWith('store_avulsa_')) ? 0 : 1;
      const bAvulso = (b.isAvulso || b.hasAvulso || String(b.id).startsWith('store_avulsa_')) ? 0 : 1;
      if (aAvulso !== bAvulso) return aAvulso - bAvulso;

      const aPriority = (a.id === 'store_sephora' || a.id === 'store_petz') ? 0 : 1;
      const bPriority = (b.id === 'store_sephora' || b.id === 'store_petz') ? 0 : 1;
      return aPriority - bPriority;
    });

  const selectableStores = showAllStores 
    ? allPromoStores.filter(s => !dismissedStoreIds.includes(s.id))
    : (pendingStores.length > 0 ? pendingStores : []);

  const PROMO_CADASTRO_USUARIO_STORE = {
    id: 'promo_cadastro_usuario',
    name: '👥 ARTE OFICIAL: Cadastro de Usuários (Economize Já)',
    city: 'Brasil',
    address: 'Brasil',
    type: 'institutional',
    image: '/artes/folder-cadastro-usuario-feed.png',
    storyImage: '/artes/folder-cadastro-usuario-story.png',
    instagram: '@omelhorcupom.com.br',
    isPromoCampaign: true
  };

  const PROMO_SEJA_PARCEIRO_STORE = {
    id: 'promo_seja_parceiro',
    name: '⭐ ARTE OFICIAL: Seja um Parceiro (100% Grátis Sempre)',
    city: 'Brasil',
    address: 'Brasil',
    type: 'institutional',
    image: '/artes/folder-seja-parceiro-feed.png',
    storyImage: '/artes/folder-seja-parceiro-story.png',
    instagram: '@omelhorcupom.com.br',
    isPromoCampaign: true
  };

  const selectedStore = selectedStoreId === 'promo_cadastro_usuario'
    ? PROMO_CADASTRO_USUARIO_STORE
    : selectedStoreId === 'promo_seja_parceiro'
      ? PROMO_SEJA_PARCEIRO_STORE
      : (allPromoStores.find(s => s.id === selectedStoreId) || selectableStores[0] || allPromoStores[0] || {});
  const locationText = getStoreLocationText(selectedStore);

  // Auto-selecionar primeira loja pendente
  useEffect(() => {
    if (selectedStoreId === 'promo_seja_parceiro' || selectedStoreId === 'promo_cadastro_usuario') return;
    if (!showAllStores && pendingStores.length > 0) {
      const isCurrentPending = pendingStores.some(s => s.id === selectedStoreId);
      if (!isCurrentPending) {
        setSelectedStoreId(pendingStores[0].id);
      }
    }
  }, [pendingStores.length, showAllStores, selectedStoreId]);

  // Ouvir publicações automáticas disparadas em tempo real
  useEffect(() => {
    const handleStorePublishedEvent = () => {
      try {
        const rawHistory = localStorage.getItem('melhor_cupom_instagram_history_v2');
        if (rawHistory) {
          setPostHistory(JSON.parse(rawHistory));
        }
      } catch (err) {}
    };

    window.addEventListener('melhor-cupom-store-published', handleStorePublishedEvent);
    return () => window.removeEventListener('melhor-cupom-store-published', handleStorePublishedEvent);
  }, []);

  // Encontrar o cupom em destaque/disponível desta loja
  const storeCoupons = coupons.filter(c => c.storeId === selectedStore?.id);
  const featuredCoupon = storeCoupons[0];

  // URL direta da oferta/cupom da loja no site
  const storyOfferUrl = (selectedStoreId === 'promo_seja_parceiro' || selectedStoreId === 'promo_cadastro_usuario')
    ? 'https://www.omelhorcupom.com.br'
    : (selectedStore?.id
        ? (featuredCoupon 
            ? `https://www.omelhorcupom.com.br/?loja=${selectedStore.id}&cupom=${featuredCoupon.id}`
            : `https://www.omelhorcupom.com.br/?loja=${selectedStore.id}`)
        : 'https://www.omelhorcupom.com.br');

  // Sincronizar status da Meta Graph API
  useEffect(() => {
    setInstagramSession(prev => {
      const updated = {
        ...prev,
        isConnected: true,
        username: prev.username || '@omelhorcupom.com.br',
        accountType: 'meta_graph_api',
        appId: '4514869808731364',
        instagramAccountId: '28667775222832917',
        hasSessionId: true
      };
      localStorage.setItem('melhor_cupom_instagram_session_v3', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Salvar sessão conectada
  const handleSaveSession = (newSession) => {
    setInstagramSession(newSession);
    localStorage.setItem('melhor_cupom_instagram_session_v2', JSON.stringify(newSession));
  };

  // Desconectar sessão
  const handleDisconnectSession = () => {
    const disconnected = {
      isConnected: false,
      username: '@omelhorcupom.com.br',
      accountType: 'browser_session',
      connectedAt: null,
      cookiesCount: 0
    };
    setInstagramSession(disconnected);
    localStorage.removeItem('melhor_cupom_instagram_session_v2');
    showToast('Conta do Instagram desconectada.', 'info');
  };

  // Estado de Instagram do Parceiro
  const [partnerInstagram, setPartnerInstagram] = useState(() => 
    getPartnerInstagramHandle(selectedStore, selectedStore?.instagram)
  );

  useEffect(() => {
    setPartnerInstagram(getPartnerInstagramHandle(selectedStore, selectedStore?.instagram));
  }, [selectedStoreId, selectedStore?.id, selectedStore?.instagram]);

  // Inicializar legenda oficial com marcação do @ do parceiro
  useEffect(() => {
    if (selectedStoreId === 'promo_cadastro_usuario') {
      const activeHandle = instagramSession?.username || '@omelhorcupom.com.br';
      setCustomCaption(
        `🎟️ *SÃO MAIS DE 450 CUPONS ESPERANDO SEREM RESGATADOS!* 🔥✨\n\nVocê sabia que no Melhor Cupom são mais de 450 cupons de desconto ativos esperando por você? Dá pra economizar em restaurantes, hamburguerias, pizzarias e serviços da nossa cidade, além de grandes lojas da internet (Shopee, Magalu, Shein e Mercado Livre)!\n\n🎁 *CADASTRO RÁPIDO & FÁCIL:*\n✅ Cupons exclusivos prontos para resgate imediato\n✅ Economize até 50% OFF na sua conta\n✅ Resgate em 1 clique direto pelo celular\n✅ Apresente o cupom no balcão ou use online\n✅ Clube VIP com ofertas exclusivas e secretas\n\n👉 Acesse o link da nossa bio ${activeHandle} ou acesse:\nhttps://www.omelhorcupom.com.br\n\n#MelhorCupom #Economia #Descontos #CuponsGratis #ComercioLocal #Restaurantes #Shopee #Magalu #Shein`
      );
      return;
    }

    if (selectedStoreId === 'promo_seja_parceiro') {
      const activeHandle = instagramSession?.username || '@omelhorcupom.com.br';
      setCustomCaption(
        `🚀 SEJA UM PARCEIRO OFICIAL NO MELHOR CUPOM! 🏪✨\n\nTem uma loja física, restaurante, cafeteria, barbearia ou franquia?\nColoque seu negócio na vitrine para milhares de assinantes VIP com alto poder de compra da sua região!\n\n🎁 CADASTRO 100% GRÁTIS PARA SEMPRE!\n🎟️ Crie já a oferta de cupom da sua loja sem pagar nada\n📱 Validador de balcão via QR Code direto no caixa (PDV)\n⭐ Aumente o fluxo de clientes e turbine suas vendas\n\n👉 Cadastre sua empresa agora pelo link da nossa bio ${activeHandle} ou acesse:\nhttps://www.omelhorcupom.com.br\n\n#MelhorCupom #SejaUmParceiro #ComercioLocal #CuponsDeDesconto #LojasParceiras #Empreendedorismo #Promocoes #Descontos`
      );
      return;
    }

    if (selectedStore?.name) {
      const cleanStore = selectedStore.name;
      const isBig = isBigNetworkOrApiStore(selectedStore);
      const cleanCity = (locationText || 'Brasil').split('-')[0].trim();
      const hashtagStore = cleanStore.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const hashtagCity = cleanCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const activeHandle = instagramSession?.username || '@omelhorcupom.com.br';

      const partnerHandle = getPartnerInstagramHandle(selectedStore, partnerInstagram);

      // Redes grandes / APIs: NÃO adicionar a cidade na imagem e na legenda
      const introLine = isBig
        ? `Agora você economiza com cupons exclusivos no ${cleanStore} (${partnerHandle})! ✨`
        : `Agora você economiza com cupons exclusivos no ${cleanStore} (${partnerHandle}) em ${locationText}! ✨`;

      const hashtags = isBig
        ? `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #Economia #CuponsBrasil`
        : `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #${hashtagCity} #Economia #CuponsBrasil`;

      setCustomCaption(
        `🎉 NOVA PARCERIA CREDENCIADA NO MELHOR CUPOM! 🎟️🔥\n\n${introLine}\n\n✅ Descontos exclusivos fisicamente e online\n✅ Siga ${partnerHandle} e não perca nenhuma novidade!\n✅ Resgate gratuito pelo site!\n\n👉 Acesse o link na nossa bio ${activeHandle} ou no link direto dos Stories para resgatar seus cupons!\n\nParceria oficial: ${partnerHandle} + ${activeHandle}! 🤝\n\n${hashtags}`
      );
    }
  }, [selectedStoreId, locationText, selectedStore?.name, selectedStore?.isApiIntegrated, selectedStore?.cities, instagramSession?.username, partnerInstagram]);

  // Sincronizar ajustes da logo com a loja selecionada
  useEffect(() => {
    if (selectedStore) {
      setLiveLogoScale(selectedStore.logoScale !== undefined ? selectedStore.logoScale : 115);
      setLiveLogoFit(selectedStore.logoFit || 'contain');
      setLiveLogoBg(selectedStore.logoBg || '#ffffff');
      setSavedLogoSettings(false);
    }
  }, [selectedStoreId, selectedStore]);

  // Salvar ajustes de enquadramento da logo permanentemente
  const handleSaveLogoSettings = () => {
    if (!selectedStore) return;
    if (typeof updateStore === 'function') {
      updateStore(selectedStore.id, {
        logoScale: liveLogoScale,
        logoFit: liveLogoFit,
        logoBg: liveLogoBg
      });
    }
    setSavedLogoSettings(true);
    showToast(`Enquadramento da logo de ${selectedStore.name} salvo com sucesso!`, 'success');
    setTimeout(() => setSavedLogoSettings(false), 2500);
  };

  // Renderizar criativo no Canvas em tempo real
  useEffect(() => {
    drawAdminArtwork();
  }, [format, selectedStore, selectedStoreId, liveLogoScale, liveLogoFit, liveLogoBg]);

  const renderAdminArtworkToCanvas = async (targetCanvas, targetFormat = format, customLogoOpts = null) => {
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const currentFormat = targetFormat || format;
    const width = 1080;
    const height = currentFormat === 'feed' ? 1080 : 1920;

    targetCanvas.width = width;
    targetCanvas.height = height;

    // Se for a campanha oficial "Cadastro de Usuários", desenhar diretamente a arte HD pré-renderizada
    if (selectedStoreId === 'promo_cadastro_usuario') {
      const artSrc = currentFormat === 'feed' 
        ? '/artes/folder-cadastro-usuario-feed.png' 
        : '/artes/folder-cadastro-usuario-story.png';
      try {
        const artImg = new Image();
        artImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          artImg.onload = resolve;
          artImg.onerror = resolve;
          artImg.src = artSrc;
        });
        if (artImg.width > 0) {
          ctx.drawImage(artImg, 0, 0, width, height);
          return;
        }
      } catch (err) {
        console.warn('Erro ao carregar arte cadastro usuario no canvas:', err);
      }
    }

    // Se for a campanha oficial "Seja um Parceiro", desenhar diretamente a arte HD pré-renderizada
    if (selectedStoreId === 'promo_seja_parceiro') {
      const artSrc = currentFormat === 'feed' 
        ? '/artes/folder-seja-parceiro-feed.png' 
        : '/artes/folder-seja-parceiro-story.png';
      try {
        const artImg = new Image();
        artImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          artImg.onload = resolve;
          artImg.onerror = resolve;
          artImg.src = artSrc;
        });
        if (artImg.width > 0) {
          ctx.drawImage(artImg, 0, 0, width, height);
          return;
        }
      } catch (err) {
        console.warn('Erro ao carregar arte seja parceiro no canvas:', err);
      }
    }

    // 1. Fundo Gradiente Luxury Dark
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0A0A0F');
    bgGrad.addColorStop(0.4, '#13131F');
    bgGrad.addColorStop(0.8, '#181528');
    bgGrad.addColorStop(1, '#09090C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Banner da Loja como Fundo Superior Estilizado
    const bannerHeight = currentFormat === 'feed' ? 340 : 540;
    if (selectedStore?.image) {
      try {
        const bannerImg = new Image();
        bannerImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          bannerImg.onload = resolve;
          bannerImg.onerror = resolve;
          bannerImg.src = selectedStore.image;
        });

        if (bannerImg.width > 0) {
          ctx.save();
          ctx.drawImage(bannerImg, 0, 0, width, bannerHeight);

          // Overlay escuro com degradê suave para transição perfeita
          const bannerOverlay = ctx.createLinearGradient(0, 0, 0, bannerHeight);
          bannerOverlay.addColorStop(0, 'rgba(10, 10, 15, 0.35)');
          bannerOverlay.addColorStop(0.65, 'rgba(10, 10, 15, 0.75)');
          bannerOverlay.addColorStop(1, '#0A0A0F');
          ctx.fillStyle = bannerOverlay;
          ctx.fillRect(0, 0, width, bannerHeight);
          ctx.restore();
        }
      } catch (err) {
        console.warn('Erro ao carregar banner para arte adm:', err);
      }
    }

    // 3. Aura Luminosa Laranja Padrão
    const aura = ctx.createRadialGradient(width * 0.5, currentFormat === 'feed' ? 520 : 880, 20, width * 0.5, currentFormat === 'feed' ? 520 : 880, 480);
    aura.addColorStop(0, 'rgba(255, 95, 0, 0.35)');
    aura.addColorStop(0.5, 'rgba(255, 95, 0, 0.1)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    // 4. Logo do Lojista em Destaque com Fundo e Enquadramento Proporcional Expandido
    const logoY = currentFormat === 'feed' ? 195 : 360;
    const logoRadius = currentFormat === 'feed' ? 125 : 170;
    const clipRadius = logoRadius - 4;
    const circleDiameter = clipRadius * 2;

    const activeFit = customLogoOpts?.fit || liveLogoFit || selectedStore?.logoFit || 'contain';
    const activeScale = ((customLogoOpts?.scale !== undefined ? customLogoOpts.scale : (liveLogoScale !== undefined ? liveLogoScale : (selectedStore?.logoScale !== undefined ? selectedStore.logoScale : 115)))) / 100;
    const activeBg = customLogoOpts?.bg || liveLogoBg || selectedStore?.logoBg || '#FFFFFF';

    // 1. Fundo do Interior do Círculo
    ctx.save();
    ctx.fillStyle = activeBg;
    ctx.beginPath();
    ctx.arc(width / 2, logoY, clipRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Borda Padronizada Oficial
    ctx.save();
    ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
    ctx.shadowBlur = 28;
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(width / 2, logoY, logoRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Anel interno sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(width / 2, logoY, clipRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Imagem da Logo da Loja Proporcional (Expansão Harmônica)
    let logoDrawn = false;
    const storeLogoSrc = selectedStore?.logoImage || 
      getBrandLogo(selectedStore?.name) || 
      getBrandLogo(selectedStore?.id) || 
      getBrandLogo(selectedStore?.apiSource) || 
      selectedStore?.image;

    if (storeLogoSrc) {
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
          logoImg.src = storeLogoSrc;
        });

        const naturalW = logoImg.naturalWidth || logoImg.width;
        const naturalH = logoImg.naturalHeight || logoImg.height;

        if (naturalW > 0 && naturalH > 0) {
          const aspect = naturalW / naturalH;

          let drawW, drawH;
          if (activeFit === 'cover') {
            const scale = Math.max(circleDiameter / naturalW, circleDiameter / naturalH) * activeScale;
            drawW = naturalW * scale;
            drawH = naturalH * scale;
          } else {
            let baseW, baseH;
            if (aspect >= 1.4) {
              baseW = circleDiameter * 0.94;
              baseH = baseW / aspect;
              const maxSafeH = circleDiameter * 0.78;
              if (baseH > maxSafeH) {
                baseH = maxSafeH;
                baseW = baseH * aspect;
              }
            } else if (aspect >= 1.1) {
              baseW = circleDiameter * 0.90;
              baseH = baseW / aspect;
            } else if (aspect >= 0.9) {
              baseW = circleDiameter * 0.92;
              baseH = circleDiameter * 0.92;
            } else {
              baseH = circleDiameter * 0.90;
              baseW = baseH * aspect;
            }
            drawW = baseW * activeScale;
            drawH = baseH * activeScale;
          }

          const drawX = (width / 2) - (drawW / 2);
          const drawY = logoY - (drawH / 2);

          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, logoY, clipRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
          ctx.restore();
          logoDrawn = true;
        }
      } catch (e) {
        console.warn('Erro ao carregar logo do lojista:', e);
      }
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
      if (selectedStore?.logo && selectedStore.logo.length <= 4) {
        ctx.font = currentFormat === 'feed' ? '96px "Inter", sans-serif' : '130px "Inter", sans-serif';
        ctx.fillText(selectedStore.logo, width / 2, logoY);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = currentFormat === 'feed' ? 'bold 90px "Inter", sans-serif' : 'bold 120px "Inter", sans-serif';
        ctx.fillText((selectedStore?.name || 'MC').substring(0, 2).toUpperCase(), width / 2, logoY);
      }
      ctx.restore();
    }

    // 5. Nome da Loja
    const storeNameY = logoY + logoRadius + 38;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 40px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const storeName = selectedStore?.name || 'Estabelecimento Parceiro';
    ctx.fillText(storeName.length > 28 ? storeName.substring(0, 26) + '...' : storeName, width / 2, storeNameY);

    // 6. ABAIXO DO NOME APARECER A CIDADE (SOMENTE SE NÃO FOR REDE GRANDE / API)
    const isBig = isBigNetworkOrApiStore(selectedStore);
    if (!isBig && locationText && locationText !== 'Brasil') {
      const cityY = storeNameY + 38;
      ctx.fillStyle = '#FF9D5C';
      ctx.font = '700 24px "Inter", sans-serif';
      ctx.fillText(locationText, width / 2, cityY);
    }
    ctx.restore();

    // 7. SÍMBOLO DE COLABORAÇÃO: "+" AO INVÉS DA ESCRITA
    const plusY = currentFormat === 'feed' ? (isBig ? 430 : 455) : (isBig ? 690 : 720);
    ctx.save();
    const gradText = ctx.createLinearGradient(width * 0.45, plusY - 25, width * 0.55, plusY + 25);
    gradText.addColorStop(0, '#FFFFFF');
    gradText.addColorStop(0.5, '#FFF1EB');
    gradText.addColorStop(1, '#FF7A29');
    ctx.fillStyle = gradText;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.75)';
    ctx.shadowBlur = 28;
    ctx.font = currentFormat === 'feed' ? '900 68px "Inter", sans-serif' : '900 84px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', width / 2, plusY);
    ctx.restore();

    // 8. LOGO DO MELHOR CUPOM
    // Posicionamento com folga calculada para NUNCA sobrepor o botão de resgate
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
        const mcLogoWidth = currentFormat === 'feed' ? 340 : 470;
        const mcLogoHeight = (mcLogoImg.height / mcLogoImg.width) * mcLogoWidth;
        const mcLogoX = (width - mcLogoWidth) / 2;
        const mcLogoY = plusY + (currentFormat === 'feed' ? 46 : 65);
        mcLogoBottom = mcLogoY + mcLogoHeight;

        ctx.save();
        ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
        ctx.shadowBlur = 28;
        ctx.drawImage(mcLogoImg, mcLogoX, mcLogoY, mcLogoWidth, mcLogoHeight);
        ctx.restore();
      }
    } catch (e) {
      console.warn('Erro ao carregar logo do Melhor Cupom no admin:', e);
    }

    // 9. BOTÃO DE RESGATE (Perfeitamente alinhado e centralizado)
    const btnText = 'RESGATE SEU CUPOM EXCLUSIVO';
    ctx.font = currentFormat === 'feed' ? '900 24px "Inter", sans-serif' : '900 32px "Inter", sans-serif';
    const textMetrics = ctx.measureText(btnText);
    const btnPaddingX = currentFormat === 'feed' ? 56 : 72;
    const btnW = Math.max(currentFormat === 'feed' ? 560 : 750, textMetrics.width + (btnPaddingX * 2));
    const btnH = currentFormat === 'feed' ? 68 : 88;
    const btnRadius = btnH / 2;
    const btnX = (width - btnW) / 2;
    const botY = currentFormat === 'feed' ? Math.max(745, mcLogoBottom + 50) : 1330;

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

    // 10. Rodapé de Canais
    const footerY = currentFormat === 'feed' ? 880 : 1520;
    ctx.save();
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Disponível no app e em www.omelhorcupom.com.br', width / 2, footerY);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 16px "Inter", sans-serif';
    ctx.fillText(`Siga ${instagramSession.username || '@omelhorcupom.com.br'} para não perder nenhuma oferta`, width / 2, footerY + 34);
    ctx.restore();

    // 11. Borda Externa Minimalista Fina (Padrão Oficial do Folder de Divulgação)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(32, 32, width - 64, height - 64, 36);
    ctx.stroke();
    ctx.restore();
  };

  const drawAdminArtwork = async () => {
    if (canvasRef.current) {
      await renderAdminArtworkToCanvas(canvasRef.current, format, {
        scale: liveLogoScale,
        fit: liveLogoFit,
        bg: liveLogoBg
      });
    }
  };

  // Copiar Legenda Oficial
  const handleCopyCaption = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(customCaption);
    }
    setCopiedCaption(true);
    showToast('Legenda oficial copiada para a área de transferência!', 'success');
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Baixar imagem do Admin
  const handleDownloadArtwork = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await renderAdminArtworkToCanvas(canvas, format, {
        scale: liveLogoScale,
        fit: liveLogoFit,
        bg: liveLogoBg
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const cleanName = (selectedStore?.name || 'loja').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `melhorcupom-post-${cleanName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Criativo promocional baixado em alta resolução!', 'success');
    } catch (err) {
      console.error('Erro ao baixar arte:', err);
    }
  };

  // Publicar no Instagram (Automático via Robô ou Assistido)
  const handlePublishToInstagram = async (mode = 'auto') => {
    if (!instagramSession.isConnected) {
      setIsLoginModalOpen(true);
      showToast('Conecte a conta do Instagram antes de iniciar a divulgação.', 'warning');
      return;
    }

    const cleanStoreName = selectedStore?.name || 'Comércio Parceiro';
    const cleanUser = (instagramSession.username || '@omelhorcupom.com.br').replace('@', '');

    // MODO 1: Publicação 100% Automática no Feed e Stories via Robô Oficial
    if (mode === 'auto') {
      setIsPublishing(true);
      try {
        const logoFramingOpts = {
          scale: liveLogoScale,
          fit: liveLogoFit,
          bg: liveLogoBg
        };

        // 1. Gerar criativo quadrado do Feed (1080x1080) otimizado em JPEG
        let feedImageBase64 = '';
        try {
          const feedCanvas = document.createElement('canvas');
          await renderAdminArtworkToCanvas(feedCanvas, 'feed', logoFramingOpts);
          feedImageBase64 = feedCanvas.toDataURL('image/jpeg', 0.88);
        } catch (feedCanvasErr) {
          console.warn('Fallback canvas feed:', feedCanvasErr);
          if (canvasRef.current) feedImageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.88);
        }

        // 2. Gerar criativo vertical dos Stories (1080x1920) otimizado em JPEG
        let storyImageBase64 = '';
        try {
          const storyCanvas = document.createElement('canvas');
          await renderAdminArtworkToCanvas(storyCanvas, 'story', logoFramingOpts);
          storyImageBase64 = storyCanvas.toDataURL('image/jpeg', 0.88);
        } catch (storyCanvasErr) {
          console.warn('Fallback canvas story:', storyCanvasErr);
          if (canvasRef.current) storyImageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.88);
        }

        const savedSessionId = localStorage.getItem('melhor_cupom_instagram_sessionid') || '';

        const willPublishStory = publishDestination === 'both' || publishDestination === 'story_only';
        const isOnlyStory = publishDestination === 'story_only';

        const res = await fetch('/api/instagram-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: feedImageBase64,
            feedImageBase64,
            storyImageBase64,
            publishStory: willPublishStory,
            onlyStory: isOnlyStory,
            storyLinkUrl: storyOfferUrl,
            linkTitle: 'RESGATAR CUPOM',
            caption: customCaption,
            storeName: cleanStoreName,
            sessionId: savedSessionId,
            format: publishDestination === 'both' ? 'feed_and_story' : (publishDestination === 'story_only' ? 'story_only' : 'feed_only')
          })
        });

        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error(`Falha na resposta do servidor (Código HTTP ${res.status}).`);
        }

        if (data.success) {
          let isStoryOk = !!data.storyPublished;

          // Se o Feed publicou mas o Story precisou de mais tempo, dispara requisição dedicada de Story (apenas se story foi solicitado)
          if (!isStoryOk && willPublishStory && storyImageBase64) {
            try {
              const storyRes = await fetch('/api/instagram-publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  onlyStory: true,
                  storyImageBase64,
                  storeName: cleanStoreName
                })
              });
              const storyData = await storyRes.json();
              if (storyData?.storyPublished) {
                isStoryOk = true;
              }
            } catch (storyRetryErr) {
              console.warn('Retentativa dedicada de Story:', storyRetryErr);
            }
          }

          const finalPostUrl = data.postUrl || `https://www.instagram.com/${cleanUser}/`;

          let formatText = 'Feed (1080x1080) + Stories (1080x1920)';
          let statusText = 'Publicado no Feed & Stories (com link do site)';
          let toastMsg = `🎉 Arte de "${cleanStoreName}" publicada com sucesso no FEED e no STORIES de @omelhorcupom.com.br!`;

          if (publishDestination === 'feed_only') {
            formatText = 'Feed (1080x1080)';
            statusText = 'Publicado Somente no Feed Oficial';
            toastMsg = `🎉 Arte de "${cleanStoreName}" publicada com sucesso SOMENTE NO FEED oficial de @omelhorcupom.com.br!`;
          } else if (publishDestination === 'story_only') {
            formatText = 'Stories (1080x1920)';
            statusText = 'Publicado Somente nos Stories (com link interativo)';
            toastMsg = `🎉 Arte de "${cleanStoreName}" publicada com sucesso SOMENTE NOS STORIES com link de @omelhorcupom.com.br!`;
          } else if (!isStoryOk) {
            formatText = 'Feed (1080x1080)';
            statusText = 'Publicado no Feed Oficial';
            toastMsg = `🎉 Arte de "${cleanStoreName}" publicada com sucesso no feed oficial de @omelhorcupom.com.br!`;
          }

          const newPost = {
            id: `post_inst_${Date.now()}`,
            storeId: selectedStore?.id,
            storeName: cleanStoreName,
            city: locationText,
            publishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            format: formatText,
            status: statusText,
            postUrl: finalPostUrl,
            storyUrl: data.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/'
          };
          const updated = [newPost, ...postHistory];
          setPostHistory(updated);
          localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(updated));
          markStoreAsPublished(selectedStore, newPost);

          showToast(toastMsg, 'success');
          setIsPublishing(false);
          return;
        }

        if (data.needCookies) {
          setIsPublishing(false);
          setPublishErrorModal({
            title: 'Sincronizar Chave do Instagram',
            message: data.message
          });
          return;
        }

        throw new Error(data.error || 'Erro ao publicar no Instagram.');
      } catch (err) {
        setIsPublishing(false);
        const rawMsg = err.message || '';
        const isLoginExpired = rawMsg.includes('login_required') || rawMsg.includes('sessionid') || rawMsg.includes('expirou');
        
        setPublishErrorModal({
          title: isLoginExpired ? 'Sessão do Instagram Expirada' : 'Publicação Automática pelo Robô',
          message: isLoginExpired 
            ? 'A sua sessão web do Instagram expirou por segurança nos servidores da Meta (login_required). O robô precisa de uma chave atualizada para publicar 100% sozinho.' 
            : rawMsg || 'Erro ao conectar com o serviço de publicação. Verifique a sessão do Instagram.'
        });
        return;
      }
    }

    // MODO 2: Modo Assistido (Baixa imagem, copia texto e abre Instagram para upload rápido)
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(customCaption);
    }

    handleDownloadArtwork();

    const newPost = {
      id: `post_inst_${Date.now()}`,
      storeId: selectedStore?.id,
      storeName: cleanStoreName,
      city: locationText,
      publishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      format: format === 'feed' ? 'Feed (1080x1080)' : 'Story (1080x1920)',
      status: 'Modo Assistido (Imagem baixada)',
      postUrl: `https://www.instagram.com/${cleanUser}/`
    };

    const updated = [newPost, ...postHistory];
    setPostHistory(updated);
    localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(updated));
    markStoreAsPublished(selectedStore, newPost);

    showToast(`Imagem salva em Downloads e legenda copiada! No Instagram que abriu, clique em "Selecionar do Computador" e cole o texto com Ctrl+V.`, 'success');

    setTimeout(() => {
      window.open('https://www.instagram.com/create/select/', '_blank');
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Integração com Instagram (@omelhorcupom.com.br) */}
      <div className="bg-gradient-to-r from-[#20132A] via-[#1B162E] to-[#12111E] border border-fuchsia-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#151322] rounded-[14px] flex items-center justify-center text-white">
                <Instagram size={28} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white font-display">
                  Instagram Oficial: <span className="text-fuchsia-400">{instagramSession.username}</span>
                </h3>
                {instagramSession.isConnected ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Conectado ({instagramSession.accountType === 'meta_graph_api' ? 'Meta Graph API' : 'Sessão Web Ativa'})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Desconectado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300">
                {instagramSession.isConnected 
                  ? 'Conta oficial conectada com permissões de publicação de carrosséis, feed e stories para comércios credenciados.'
                  : 'Conecte sua conta oficial do Instagram para automatizar e divulgar os estabelecimentos parceiros.'}
              </p>
              
              <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1 flex-wrap">
                {instagramSession.isConnected ? (
                  <>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Autenticado para Divulgação
                    </span>
                    <span>•</span>
                    <span>Modo: {instagramSession.accountType === 'meta_graph_api' ? 'Meta Graph API v19.0' : 'Sessão Web com Cookies'}</span>
                    {instagramSession.connectedAt && (
                      <>
                        <span>•</span>
                        <span>Conectado em: {new Date(instagramSession.connectedAt).toLocaleDateString('pt-BR')}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Dica: Conecte em 1 clique pelo botão acima ou use <strong>node scripts/instagram-login.cjs</strong></span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                instagramSession.isConnected 
                  ? 'bg-white/10 hover:bg-white/15 text-gray-300 border border-white/10'
                  : 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-[#FF5F00] text-white shadow-lg shadow-fuchsia-900/50 font-black'
              }`}
            >
              {instagramSession.isConnected ? (
                <>
                  <RefreshCw size={14} />
                  <span>Gerenciar Conta</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Fazer Login no Instagram</span>
                </>
              )}
            </button>

            <a
              href={`https://www.instagram.com/${(instagramSession.username || 'omelhorcupom.com.br').replace('@', '')}/`}
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Abrir Perfil Oficial no Instagram"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Ver Perfil</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Banner de Automação de Publicação de Novos Parceiros */}
      <div className="bg-gradient-to-r from-orange-500/15 via-[#181824] to-fuchsia-600/15 border border-orange-500/30 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-md">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                Publicação Automática de Novos Parceiros
              </h4>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide border ${
                autoPublishEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-white/10 text-gray-400 border-white/10'
              }`}>
                {autoPublishEnabled ? '● Piloto Automático Ativo' : '○ Pausado'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 leading-snug">
              {autoPublishEnabled 
                ? 'Novos parceiros cadastrados a partir de agora serão publicados automaticamente no Feed e Stories de @omelhorcupom.com.br!' 
                : 'A automação está pausada. Novos parceiros cadastrados ficarão aguardando publicação manual nesta lista.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAutoPublish}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer shadow-md ${
            autoPublishEnabled
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
          }`}
        >
          <span>{autoPublishEnabled ? '✓ Piloto Automático Ligado' : 'Ativar Piloto Automático'}</span>
        </button>
      </div>

      {/* 2.5 BANNER DE ATALHO RÁPIDO: POSTAGENS DIÁRIAS OFICIAIS */}
      <div className="bg-gradient-to-r from-amber-500/20 via-[#26150D] to-[#14141E] border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#161622] rounded-[14px] flex items-center justify-center text-2xl">
                🚀
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-gradient-to-r from-amber-400 to-[#FF5F00] text-black font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  ⭐ Postagens Diárias Oficiais
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Artes Oficiais em Alta Resolução (HD)
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                Campanhas Oficiais do Melhor Cupom: Clientes & Parceiros
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                Poste todos os dias para cadastrar novos <strong>Clientes/Usuários</strong> que buscam descontos ou novos <strong>Lojistas/Parceiros</strong>. As artes de <strong>Story (1080x1920)</strong> e <strong>Feed (1080x1080)</strong> já estão prontas!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            {/* Botão Campanha 1: Cadastro de Usuários */}
            <button
              type="button"
              onClick={() => {
                setSelectedStoreId('promo_cadastro_usuario');
                showToast('👥 Campanha "Cadastro de Usuários" selecionada para publicação!', 'success');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${
                selectedStoreId === 'promo_cadastro_usuario'
                  ? 'bg-emerald-500 text-white shadow-emerald-950/60'
                  : 'bg-gradient-to-r from-amber-400 to-[#FF5F00] hover:from-amber-300 hover:to-orange-500 text-black'
              }`}
            >
              <Users size={14} />
              <span>{selectedStoreId === 'promo_cadastro_usuario' ? '✓ Usuários Ativo' : 'Postar Cadastro de Usuários'}</span>
            </button>

            {/* Botão Campanha 2: Seja um Parceiro */}
            <button
              type="button"
              onClick={() => {
                setSelectedStoreId('promo_seja_parceiro');
                showToast('⭐ Campanha "Seja um Parceiro" selecionada para publicação!', 'success');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${
                selectedStoreId === 'promo_seja_parceiro'
                  ? 'bg-emerald-500 text-white shadow-emerald-950/60'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Store size={14} />
              <span>{selectedStoreId === 'promo_seja_parceiro' ? '✓ Parceiros Ativo' : 'Postar Seja um Parceiro'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Área de Criação de Post & Seleção de Lojista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário de Configuração do Post (Coluna 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-orange-400" />
              <span>Configurar Divulgação do Lojista</span>
            </h3>

            {/* Selecionar Estabelecimento (Ocultando já publicados por padrão) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-gray-300">
                  Selecione o Fornecedor ou Campanha para Divulgar:
                </label>
                <button
                  type="button"
                  onClick={() => setShowAllStores(prev => !prev)}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                >
                  {showAllStores ? 'Ocultar já publicadas' : `Ver já publicadas (${stores.length - pendingStores.length})`}
                </button>
              </div>

              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-[#12121C] border border-amber-500/40 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                <optgroup label="🌟 CAMPANHAS INSTITUCIONAIS DIÁRIAS" className="bg-[#241508] text-amber-300 font-black">
                  <option value="promo_cadastro_usuario" className="bg-[#241508] text-amber-300 font-bold">
                    👥 ARTE OFICIAL: Cadastro de Usuários (Clientes & Economia) ✨
                  </option>
                  <option value="promo_seja_parceiro" className="bg-[#241508] text-amber-300 font-bold">
                    ⭐ ARTE OFICIAL: Seja um Parceiro (Lojas & Comércio • 100% Grátis Sempre) 🏪
                  </option>
                </optgroup>
                <optgroup label="🏪 FORNECEDORES E LOJAS CADASTRADAS" className="bg-[#161622] text-gray-300 font-bold">
                  {selectableStores.map((s) => {
                    const isPub = isStoreAlreadyPublished(s, postHistory);
                    return (
                      <option key={s.id} value={s.id} className="bg-[#161622] text-white font-normal">
                        {s.name} ({getStoreLocationText(s)}) {isPub ? '✓ (Já Publicado)' : '• Pendente de Divulgação'}
                      </option>
                    );
                  })}
                </optgroup>
              </select>

              {selectableStores.length === 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Todas as lojas parceiras já foram divulgadas!</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Você pode continuar postando diariamente a <strong>Arte Oficial: Seja um Parceiro</strong> selecionada acima!
                  </p>
                </div>
              )}

              {/* FILA VISUAL DE PARCEIROS PENDENTES COM BOTÃO 'X' PARA EXCLUIR DA LISTA */}
              {pendingStores.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                      <span>Fila de Lojas & Parceiros ({pendingStores.length}):</span>
                    </span>
                    {dismissedStoreIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRestoreDismissedStores}
                        className="text-[10px] text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                      >
                        ↺ Restaurar {dismissedStoreIds.length} excluídos
                      </button>
                    )}
                  </div>

                  {/* Chips interativos com X para remoção imediata da lista */}
                  <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-2 bg-[#101017] rounded-2xl border border-white/10">
                    {pendingStores.map((s) => {
                      const isSelected = s.id === selectedStoreId;
                      const isApi = Boolean(s.isApiIntegrated || s.apiSource || s.tier === 'api');
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedStoreId(s.id)}
                          className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#FF5F00]/25 border-[#FF5F00] text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {s.logoImage ? (
                            <img src={s.logoImage} alt="" className="w-4 h-4 rounded object-contain bg-white/20 p-0.5" />
                          ) : (
                            <span className="text-sm">{s.logo || '🏪'}</span>
                          )}
                          <span className="truncate max-w-[130px]">{s.name}</span>
                          {(s.isAvulso || s.hasAvulso) && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">AVULSO</span>
                          )}
                          {isApi && !s.isAvulso && !s.hasAvulso && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-bold">API</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDismissStore(s.id, e)}
                            className="ml-0.5 p-0.5 rounded-full hover:bg-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                            title={`Excluir ${s.name} da fila de divulgação`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                <span>
                  {pendingStores.length} {pendingStores.length === 1 ? 'loja pendente' : 'lojas pendentes'} de divulgação
                </span>
                <span className="text-emerald-400 font-semibold">
                  ✓ {stores.length - pendingStores.length} já publicadas
                </span>
              </div>
            </div>

            {/* Instagram Oficial do Parceiro */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300">
                  Instagram Oficial do Parceiro (@):
                </label>
                <span className="text-[10px] text-fuchsia-400 font-bold">Marcado na legenda e na arte</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">@</span>
                <input
                  type="text"
                  value={(partnerInstagram || '').replace(/^@/, '')}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/^@/, '').trim();
                    setPartnerInstagram(clean ? `@${clean}` : '');
                  }}
                  placeholder="Ex: nomedoparceiro"
                  className="w-full bg-[#12121C] border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                />
              </div>
            </div>

            {/* DESTINO DA PUBLICAÇÃO: STORIES + FEED, SOMENTE FEED OU SOMENTE STORIES */}
            <div className="space-y-2 pt-1 bg-[#12121C] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Destino da Divulgação no Instagram:</span>
                </label>
                <span className="text-[10px] text-gray-400 font-bold">
                  {publishDestination === 'both' ? 'Feed + Stories' : publishDestination === 'feed_only' ? 'Apenas Feed' : 'Apenas Stories'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Opção 1: Stories + Feed */}
                <button
                  type="button"
                  onClick={() => setPublishDestination('both')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    publishDestination === 'both'
                      ? 'bg-gradient-to-r from-fuchsia-600/30 via-rose-600/30 to-[#FF5F00]/30 border-orange-500 text-white font-bold shadow-md shadow-orange-600/20 ring-1 ring-orange-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Layers size={13} />
                    <span>Feed + Stories</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Completo</span>
                </button>

                {/* Opção 2: Somente Feed */}
                <button
                  type="button"
                  onClick={() => {
                    setPublishDestination('feed_only');
                    setFormat('feed');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    publishDestination === 'feed_only'
                      ? 'bg-orange-500/25 border-orange-400 text-white font-bold shadow-md ring-1 ring-orange-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Instagram size={13} />
                    <span>Somente Feed</span>
                  </div>
                  <span className="text-[9px] text-gray-400">1080x1080</span>
                </button>

                {/* Opção 3: Somente Stories */}
                <button
                  type="button"
                  onClick={() => {
                    setPublishDestination('story_only');
                    setFormat('story');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    publishDestination === 'story_only'
                      ? 'bg-fuchsia-600/25 border-fuchsia-400 text-white font-bold shadow-md ring-1 ring-fuchsia-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs text-fuchsia-300">
                    <ExternalLink size={13} />
                    <span>Somente Stories</span>
                  </div>
                  <span className="text-[9px] text-gray-400">9:16 + Link</span>
                </button>
              </div>
            </div>

            {/* Formato da Arte */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">
                Pré-visualização do Formato:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('feed')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    format === 'feed'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>Feed (1:1 Quadrado)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    format === 'story'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>Story (9:16 Vertical)</span>
                </button>
              </div>
            </div>

            {/* Editor de Legenda do Instagram */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <span>Legenda Oficial Formatada:</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCaption ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCaption ? 'Copiada!' : 'Copiar Legenda'}</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full bg-[#12121C] border border-white/10 rounded-2xl p-3.5 text-xs text-gray-200 focus:outline-none focus:border-orange-500 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Botões de Ação de Publicação */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => handlePublishToInstagram('auto')}
                disabled={isPublishing}
                className="w-full bg-gradient-to-r from-fuchsia-600 via-rose-600 to-[#FF5F00] hover:opacity-95 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-xl shadow-fuchsia-900/40 flex items-center justify-center gap-3 active:scale-98 cursor-pointer disabled:opacity-75"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-white" />
                    <span>
                      {publishDestination === 'both' && 'Publicando no Feed e Stories com Link...'}
                      {publishDestination === 'feed_only' && 'Publicando Somente no Feed Oficial...'}
                      {publishDestination === 'story_only' && 'Publicando Somente nos Stories com Link...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>
                      {publishDestination === 'both' && '🚀 Publicar no Feed e Stories com Link (Robô)'}
                      {publishDestination === 'feed_only' && '📸 Publicar Somente no Feed Oficial (Robô)'}
                      {publishDestination === 'story_only' && '⏳ Publicar Somente nos Stories com Link (Robô)'}
                    </span>
                  </>
                )}
              </button>


              <button
                type="button"
                onClick={() => handlePublishToInstagram('assisted')}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-200 font-bold py-3 px-4 rounded-xl text-xs border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Instagram size={15} className="text-rose-400" />
                <span>📋 Modo Assistido (Baixar Imagem + Abrir Instagram)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadArtwork}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Baixar PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="bg-white/5 hover:bg-white/10 text-amber-300 font-bold py-2.5 px-4 rounded-xl text-xs border border-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedCaption ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCaption ? 'Copiada!' : 'Copiar Legenda'}</span>
                </button>
              </div>

              {/* Exibição do Link Oficial Direto do Story */}
              <div className="bg-orange-500/10 border border-orange-500/25 rounded-2xl p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-orange-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ExternalLink size={13} />
                    <span>Link Direto no Story (Adesivo Interativo):</span>
                  </span>
                  {featuredCoupon ? (
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded text-[10px]">
                      Cupom: {featuredCoupon.title?.slice(0, 18)}...
                    </span>
                  ) : (
                    <span className="bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[10px]">Página da Loja</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-300 font-mono break-all truncate">
                  {storyOfferUrl}
                </div>
              </div>

              {/* Dica de Divulgação */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 text-[11px] text-gray-300 leading-relaxed flex items-start gap-2">
                <Sparkles size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Como funciona:</strong> Ao clicar em <em>Publicar</em>, o robô compartilha automaticamente no <strong>Feed oficial</strong> e também nos <strong>Stories</strong> de @omelhorcupom.com.br com o adesivo de link posicionado <strong>exatamente sobre o botão "RESGATE SEU CUPOM EXCLUSIVO"</strong>, levando direto aos cupons desta loja.
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Preview Visual da Arte Oficial (Coluna 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={15} className="text-orange-400" />
                <span>Pré-visualização Oficial em Tempo Real</span>
              </span>
              <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full font-bold">
                {format === 'feed' ? '1080 x 1080 px (Feed)' : '1080 x 1920 px (Stories)'}
              </span>
            </div>

            {/* Container do Canvas */}
            <div className="relative border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl bg-black max-w-[420px] w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="w-full text-center mt-3 text-xs text-gray-400">
              Criativo gerado com logo oficial, selo de parceria (+) e informações de cidade.
            </div>

            {/* Painel Interativo de Ajuste e Expansão da Logo no Círculo */}
            <div className="w-full max-w-[420px] bg-[#12121C] border border-white/10 rounded-2xl p-4 space-y-3 mt-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Expansão da Logo no Círculo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveLogoSettings}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    savedLogoSettings
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
                  }`}
                >
                  {savedLogoSettings ? <Check size={12} /> : null}
                  <span>{savedLogoSettings ? 'Salvo!' : 'Salvar Ajuste'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Modo de Preenchimento */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300 flex items-center justify-between">
                    <span>Preenchimento:</span>
                    <span className="text-orange-400 font-bold">{liveLogoFit === 'cover' ? 'Cobrir 100%' : 'Conter'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setLiveLogoFit('contain')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        liveLogoFit === 'contain'
                          ? 'bg-[#FF5F00] text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Conter
                    </button>
                    <button
                      type="button"
                      onClick={() => setLiveLogoFit('cover')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        liveLogoFit === 'cover'
                          ? 'bg-[#FF5F00] text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Cobrir 100%
                    </button>
                  </div>
                </div>

                {/* Cor de Fundo do Círculo */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300 flex items-center justify-between">
                    <span>Fundo do Círculo:</span>
                    <span className="font-mono text-[10px] text-gray-400">{liveLogoBg}</span>
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[
                      { label: 'Branco', value: '#ffffff' },
                      { label: 'Escuro', value: '#111119' },
                      { label: 'Verde', value: '#006B3F' },
                      { label: 'Laranja', value: '#FF5F00' }
                    ].map(bg => (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setLiveLogoBg(bg.value)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          liveLogoBg === bg.value ? 'border-orange-500 scale-110 shadow-md ring-2 ring-orange-500/30' : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: bg.value }}
                        title={`Fundo ${bg.label}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={liveLogoBg.startsWith('#') ? liveLogoBg : '#ffffff'}
                      onChange={(e) => setLiveLogoBg(e.target.value)}
                      className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0 p-0"
                      title="Escolher cor personalizada"
                    />
                  </div>
                </div>
              </div>

              {/* Slider de Escala / Expansão */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
                  <span>Tamanho / Expansão:</span>
                  <span className="text-orange-400 font-bold font-mono">{liveLogoScale}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="70"
                    max="220"
                    step="5"
                    value={liveLogoScale}
                    onChange={(e) => setLiveLogoScale(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                  />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {[100, 125, 150, 180].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLiveLogoScale(s)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          liveLogoScale === s
                            ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Histórico de Publicações Realizadas */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Instagram size={18} className="text-rose-400" />
              <span>Histórico de Publicações e Divulgações</span>
            </h3>
            <p className="text-xs text-gray-400">
              Registro real das postagens preparadas e divulgadas para a conta {instagramSession.username}
            </p>
          </div>

          {postHistory.length > 0 && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
              {postHistory.length} {postHistory.length === 1 ? 'publicação registrada' : 'publicações registradas'}
            </div>
          )}
        </div>

        {postHistory.length === 0 ? (
          <div className="bg-[#12121C] border border-white/5 rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 flex items-center justify-center mx-auto text-2xl">
              📸
            </div>
            <h4 className="text-sm font-bold text-white">Nenhuma publicação registrada ainda</h4>
            <p className="text-xs text-gray-400">
              Selecione uma loja parceira acima, gere a arte e clique em "Publicar / Divulgar no Instagram" para registrar seus posts reais aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {postHistory.map((post) => (
              <div
                key={post.id}
                className="bg-[#12121C] border border-white/5 hover:border-white/15 rounded-2xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[180px]">{post.storeName}</span>
                  <span className="text-[10px] text-gray-400">{post.publishedAt}</span>
                </div>

                <div className="text-xs text-gray-400 line-clamp-2">
                  {post.city} • Formato: {post.format || 'Feed'}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      ✓ Divulgado
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReturnStoreToQueue(post)}
                      className="text-[10px] text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer"
                      title="Devolver esta loja para a fila de pendentes para repostar"
                    >
                      🔄 Voltar p/ Fila
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>Feed</span>
                      <ExternalLink size={11} />
                    </a>
                    {post.storyUrl && (
                      <a
                        href={post.storyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-fuchsia-400 hover:text-fuchsia-300 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>Stories</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Folder Oficial "Seja um Parceiro" & Logos Vetorizadas */}
      <BrandMediaKitSection />

      {/* Modal de Conexão Real com o Instagram */}
      <InstagramLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentSession={instagramSession}
        onSaveSession={handleSaveSession}
        onDisconnectSession={handleDisconnectSession}
        showToast={showToast}
      />

      {/* Modal Informativo: Falha/Orientação de Cookies para Publicação Automática */}
      {publishErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181824] border border-orange-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">
                    {publishErrorModal.title || 'Atenção na Publicação Automática'}
                  </h3>
                  <span className="text-xs text-orange-400 font-bold">Instagram @omelhorcupom.com.br</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishErrorModal(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-gray-300 leading-relaxed space-y-3">
              <p>
                {publishErrorModal.message}
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] flex items-start gap-2">
                <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  O robô automático precisa dos cookies da sua conta para realizar o envio em segundo plano. Enquanto isso, você pode usar o <strong>Modo Assistido</strong> em 1 clique!
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setPublishErrorModal(null);
                  handlePublishToInstagram('assisted');
                }}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-[#FF5F00] hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Instagram size={15} />
                <span>Usar Modo Assistido Agora (Baixar + Abrir Instagram)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishErrorModal(null);
                  setIsLoginModalOpen(true);
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key size={14} />
                <span>Abrir Opções de Conexão / Inserir Cookies</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
