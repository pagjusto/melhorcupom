import React, { useState, useRef, useEffect } from 'react';
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
  Key
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { InstagramLoginModal } from './InstagramLoginModal';
import { useApp } from '../context/AppContext';

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

    // 1. Fundo Branco Sólido no Interior do Círculo
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
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
    ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Desenhar imagem real da logo da loja proporcionalmente (Sem distorção)
    let logoDrawn = false;
    if (store?.logoImage || store?.image) {
      try {
        const storeImg = new Image();
        storeImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          storeImg.onload = resolve;
          storeImg.onerror = resolve;
          storeImg.src = store.logoImage || store.image;
        });

        const naturalW = storeImg.naturalWidth || storeImg.width;
        const naturalH = storeImg.naturalHeight || storeImg.height;

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
          const drawY = logoCenterY - (drawH / 2);

          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
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

          <div className="flex items-center gap-2 text-gray-400">
            <Tag size={13} className="text-orange-400" />
            <span>{activeCouponsCount} ofertas ativas para divulgação</span>
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
              className="rounded-xl shadow-2xl max-w-full h-auto transition-all border border-white/10"
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

    </div>
  );
};

// ============================================================================
// 2. COMPONENTE: PAINEL DE DIVULGAÇÃO & INSTAGRAM DO ADMIN (AdminPromoManager)
// ============================================================================
export const AdminPromoManager = ({ stores = [], showToast = () => {} }) => {
  const { coupons = [] } = useApp();
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [format, setFormat] = useState('feed'); // 'feed' (1:1) ou 'story' (9:16)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishErrorModal, setPublishErrorModal] = useState(null);

  // Sessão Real do Instagram (Carregada do LocalStorage e do public/instagram-session.json)
  const [instagramSession, setInstagramSession] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_instagram_session_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isConnected: false,
      username: '@omelhorcupom.com.br',
      accountType: 'browser_session',
      connectedAt: null,
      cookiesCount: 0
    };
  });

  // Histórico de postagens reais (inicia limpo sem dados falsos)
  const [postHistory, setPostHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_instagram_history_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [customCaption, setCustomCaption] = useState('');
  const canvasRef = useRef(null);

  const selectedStore = stores.find(s => s.id === selectedStoreId) || stores[0] || {};
  const locationText = getStoreLocationText(selectedStore);

  // Encontrar o cupom em destaque/disponível desta loja
  const storeCoupons = coupons.filter(c => c.storeId === selectedStore?.id);
  const featuredCoupon = storeCoupons[0];

  // URL direta da oferta/cupom da loja no site
  const storyOfferUrl = selectedStore?.id
    ? (featuredCoupon 
        ? `https://www.omelhorcupom.com.br/?loja=${selectedStore.id}&cupom=${featuredCoupon.id}`
        : `https://www.omelhorcupom.com.br/?loja=${selectedStore.id}`)
    : 'https://www.omelhorcupom.com.br';

  // Verificar se há sessão gerada pelo comando npm run instagram:login
  useEffect(() => {
    fetch('/instagram-session.json?t=' + Date.now())
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.connected && (data.cookiesCount > 0 || data.hasSessionId)) {
          setInstagramSession(prev => {
            const updated = {
              ...prev,
              isConnected: true,
              username: data.username || prev.username || '@omelhorcupom.com.br',
              accountType: data.accountType || prev.accountType,
              connectedAt: data.connectedAt || prev.connectedAt || new Date().toISOString(),
              cookiesCount: data.cookiesCount || prev.cookiesCount,
              hasSessionId: true
            };
            localStorage.setItem('melhor_cupom_instagram_session_v2', JSON.stringify(updated));
            return updated;
          });
        } else if (data && !data.connected) {
          setInstagramSession(prev => {
            const updated = {
              ...prev,
              isConnected: false,
              cookiesCount: 0,
              hasSessionId: false
            };
            localStorage.setItem('melhor_cupom_instagram_session_v2', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});
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

  // Inicializar legenda oficial
  useEffect(() => {
    if (selectedStore?.name) {
      const cleanStore = selectedStore.name;
      const isBig = isBigNetworkOrApiStore(selectedStore);
      const cleanCity = (locationText || 'Brasil').split('-')[0].trim();
      const hashtagStore = cleanStore.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const hashtagCity = cleanCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const activeHandle = instagramSession?.username || '@omelhorcupom.com.br';

      // Redes grandes / APIs: NÃO adicionar a cidade na imagem e na legenda
      const introLine = isBig
        ? `Agora você economiza com cupons exclusivos no ${cleanStore}! ✨`
        : `Agora você economiza com cupons exclusivos no ${cleanStore} em ${locationText}! ✨`;

      const hashtags = isBig
        ? `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #Economia #CuponsBrasil`
        : `#MelhorCupom #NovaParceria #${hashtagStore} #DescontosVIP #${hashtagCity} #Economia #CuponsBrasil`;

      setCustomCaption(
        `🎉 NOVA PARCERIA CREDENCIADA NO MELHOR CUPOM! 🎟️🔥\n\n${introLine}\n\n✅ Descontos exclusivos fisicamente e online\n✅ Resgate imediato pelo site!\n\n👉 Acesse o link na nossa bio ${activeHandle} ou acesse www.omelhorcupom.com.br para resgatar seus cupons!\n\n${cleanStore} + Melhor Cupom! 🤝\n\n${hashtags}`
      );
    }
  }, [selectedStoreId, locationText, selectedStore?.name, selectedStore?.isApiIntegrated, selectedStore?.cities, instagramSession?.username]);

  // Renderizar criativo no Canvas
  useEffect(() => {
    drawAdminArtwork();
  }, [format, selectedStore]);

  const renderAdminArtworkToCanvas = async (targetCanvas, targetFormat = format) => {
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const currentFormat = targetFormat || format;
    const width = 1080;
    const height = currentFormat === 'feed' ? 1080 : 1920;

    targetCanvas.width = width;
    targetCanvas.height = height;

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

    // 4. Logo do Lojista em Destaque com Fundo Branco Sólido e Enquadramento Proporcional
    const logoY = currentFormat === 'feed' ? 195 : 360;
    const logoRadius = currentFormat === 'feed' ? 125 : 170;

    // 1. Fundo Branco Sólido no Interior do Círculo
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
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
    ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Imagem da Logo da Loja Proporcional (Sem Distorção)
    let logoDrawn = false;
    if (selectedStore?.logoImage || selectedStore?.image) {
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
          logoImg.src = selectedStore.logoImage || selectedStore.image;
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
    const storeNameY = logoY + logoRadius + 36;
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
      const cityY = storeNameY + 34;
      ctx.fillStyle = '#FF9D5C';
      ctx.font = '700 24px "Inter", sans-serif';
      ctx.fillText(locationText, width / 2, cityY);
    }
    ctx.restore();

    // 7. SÍMBOLO DE COLABORAÇÃO: "+" AO INVÉS DA ESCRITA
    const plusY = currentFormat === 'feed' ? (isBig ? 425 : 445) : (isBig ? 685 : 710);
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
  };

  const drawAdminArtwork = async () => {
    if (canvasRef.current) {
      await renderAdminArtworkToCanvas(canvasRef.current, format);
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
  const handleDownloadArtwork = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

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
        // 1. Gerar criativo quadrado do Feed (1080x1080) otimizado em JPEG
        let feedImageBase64 = '';
        try {
          const feedCanvas = document.createElement('canvas');
          await renderAdminArtworkToCanvas(feedCanvas, 'feed');
          feedImageBase64 = feedCanvas.toDataURL('image/jpeg', 0.88);
        } catch (feedCanvasErr) {
          console.warn('Fallback canvas feed:', feedCanvasErr);
          if (canvasRef.current) feedImageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.88);
        }

        // 2. Gerar criativo vertical dos Stories (1080x1920) otimizado em JPEG
        let storyImageBase64 = '';
        try {
          const storyCanvas = document.createElement('canvas');
          await renderAdminArtworkToCanvas(storyCanvas, 'story');
          storyImageBase64 = storyCanvas.toDataURL('image/jpeg', 0.88);
        } catch (storyCanvasErr) {
          console.warn('Fallback canvas story:', storyCanvasErr);
          if (canvasRef.current) storyImageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.88);
        }

        const savedSessionId = localStorage.getItem('melhor_cupom_instagram_sessionid') || '';

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
            caption: customCaption,
            storeName: cleanStoreName,
            sessionId: savedSessionId,
            format: 'feed_and_story'
          })
        });

        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error(`Falha na resposta do servidor (Código HTTP ${res.status}).`);
        }

        if (data.success) {
          const finalPostUrl = data.postUrl || `https://www.instagram.com/${cleanUser}/`;
          const isStoryOk = !!data.storyPublished;
          const newPost = {
            id: `post_inst_${Date.now()}`,
            storeName: cleanStoreName,
            city: locationText,
            publishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            format: isStoryOk ? 'Feed (1080x1080) + Stories (1080x1920)' : 'Feed (1080x1080)',
            status: isStoryOk ? 'Publicado no Feed & Stories (com link do site)' : 'Publicado no Feed Oficial',
            postUrl: finalPostUrl,
            storyUrl: data.storyUrl || 'https://www.instagram.com/stories/omelhorcupom.com.br/'
          };
          const updated = [newPost, ...postHistory];
          setPostHistory(updated);
          localStorage.setItem('melhor_cupom_instagram_history_v2', JSON.stringify(updated));
          const toastMsg = isStoryOk
            ? `🎉 Arte de "${cleanStoreName}" publicada com sucesso no FEED e no STORIES (com link do site) de @omelhorcupom.com.br!`
            : `🎉 Arte de "${cleanStoreName}" publicada com sucesso no feed oficial de @omelhorcupom.com.br!`;
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
        setPublishErrorModal({
          title: 'Publicação Automática pelo Robô',
          message: err.message || 'Erro ao conectar com o serviço de publicação. Verifique a sessão do Instagram.'
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

      {/* 2. Área de Criação de Post & Seleção de Lojista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário de Configuração do Post (Coluna 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-orange-400" />
              <span>Configurar Divulgação do Lojista</span>
            </h3>

            {/* Selecionar Estabelecimento */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">
                Selecione a Loja para Divulgar no Feed Oficial:
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-[#12121C] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#161622] text-white">
                    {s.name} ({getStoreLocationText(s)})
                  </option>
                ))}
              </select>
            </div>

            {/* Formato da Arte */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">
                Formato do Criativo:
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
                    <span>Publicando no Feed e Stories com Link...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>🚀 Publicar no Feed e Stories com Link (Robô)</span>
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
            <div className="relative border-4 border-[#FF5F00]/30 rounded-2xl overflow-hidden shadow-2xl bg-black max-w-[420px] w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="w-full text-center mt-3 text-xs text-gray-400">
              Criativo gerado com logo oficial, selo de parceria (+) e informações de cidade.
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
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Divulgado
                  </span>

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
