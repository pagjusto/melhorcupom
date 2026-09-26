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
  Plus
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

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

    // Borda Padrão Oficial Melhor Cupom (Laranja Oficial + Anel Interno Branco)
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

    // Tentar desenhar imagem real da logo da loja dentro do círculo
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

        if (storeImg.width > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(storeImg, (width / 2) - logoRadius, logoCenterY - logoRadius, logoRadius * 2, logoRadius * 2);
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
      const circleGrad = ctx.createLinearGradient(width / 2 - logoRadius, logoCenterY - logoRadius, width / 2 + logoRadius, logoCenterY + logoRadius);
      circleGrad.addColorStop(0, '#1F1F2E');
      circleGrad.addColorStop(1, '#111119');
      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(width / 2, logoCenterY, logoRadius - 4, 0, Math.PI * 2);
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

    // 5. ABAIXO DO NOME APARECER A CIDADE (LOJA ONLINE APARECER BRASIL)
    const cityY = storeNameY + 34;
    ctx.fillStyle = '#FF9D5C';
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillText(locationText, width / 2, cityY);
    ctx.restore();

    // 6. SÍMBOLO DE COLABORAÇÃO: "+" AO INVÉS DA ESCRITA
    const plusY = format === 'feed' ? 445 : 710;
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

    // Texto: "resgate seu cupom!"
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.font = '900 34px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎟️ resgate seu cupom!', width / 2, ctaY + ctaHeight / 2);
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
    ctx.fillText('melhorcupom.com.br', width / 2, footerY + 36);

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
    const caption = `🎉 TEMOS UMA NOVIDADE INCRÍVEL! 🎟️✨\n\nAgora o ${store?.name || 'nosso estabelecimento'} + @melhorcupom.oficial estão juntos!\n\nSe você é cliente ou quer aproveitar nossos produtos com economia real, nós disponibilizamos cupons exclusivos com descontos especiais para você resgatar gratuitamente agora mesmo!\n\n👉 COMO RESGATAR SEU CUPOM:\n1️⃣ Acesse o link na nossa bio ou baixe o app @melhorcupom.oficial\n2️⃣ Procure por "${store?.name || 'nossa loja'}"\n3️⃣ Resgate seu cupom grátis e aproveite!\n\nMarque aquele amigo que adora economizar e vem aproveitar! 🔥\n\n#MelhorCupom #Parceria #${(store?.name || 'loja').replace(/\s+/g, '')} #${locationText.split('-')[0].trim().replace(/\s+/g, '')}`;
    
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
              {`🎉 TEMOS UMA NOVIDADE INCRÍVEL! 🎟️✨\n\nAgora o ${store?.name || 'nosso estabelecimento'} + @melhorcupom.oficial estão juntos!\n\nResgate cupons exclusivos gratuitos e venha aproveitar com economia de verdade!\n\n👉 Acesse o link da nossa bio ou baixe o app Melhor Cupom!`}
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
                <span><strong>Marque @melhorcupom.oficial no Story:</strong> Nossa equipe reposta lojas parceiras para milhares de membros VIP.</span>
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
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [format, setFormat] = useState('feed'); // 'feed' (1:1) ou 'story' (9:16)
  const [isInstagramConnected, setIsInstagramConnected] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStep, setPublishStep] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [postHistory, setPostHistory] = useState([
    {
      id: 'post_inst_1',
      storeName: 'Hamburgueria Bullguer Artesanal',
      city: 'São Paulo - SP',
      publishedAt: 'Hoje às 14:30',
      likes: 342,
      comments: 28,
      status: 'Publicado no Feed',
      postUrl: 'https://instagram.com/p/MCBullguer2026'
    },
    {
      id: 'post_inst_2',
      storeName: 'Batel Steakhouse & Wine',
      city: 'Curitiba - PR',
      publishedAt: 'Ontem às 19:15',
      likes: 512,
      comments: 44,
      status: 'Publicado no Feed',
      postUrl: 'https://instagram.com/p/MCBatelSteak'
    },
    {
      id: 'post_inst_3',
      storeName: 'Boteco Tradicional de Ipanema',
      city: 'Rio de Janeiro - RJ',
      publishedAt: '12/09 às 18:00',
      likes: 689,
      comments: 57,
      status: 'Publicado no Feed',
      postUrl: 'https://instagram.com/p/MCIpanemaChopp'
    }
  ]);

  const canvasRef = useRef(null);

  const selectedStore = stores.find(s => s.id === selectedStoreId) || stores[0] || {};
  const locationText = getStoreLocationText(selectedStore);

  // Inicializar legenda com colaboração
  useEffect(() => {
    if (selectedStore?.name) {
      setCustomCaption(
        `🎉 NOVA PARCERIA ! 🎟️🔥\n\nAgora você encontra cupons exclusivos no ${selectedStore.name} em ${locationText}! 🍔✨\n\nResgate seu cupom com descontos imperdíveis acessando o link na bio do @melhorcupom.oficial ou baixando nosso app!\n\n👉 ${selectedStore.name} + Melhor Cupom!\n\n#MelhorCupom #NovaParceria #${(selectedStore.name || '').replace(/[^a-zA-Z0-9]/g, '')} #DescontosVIP #${locationText.split('-')[0].trim().replace(/[^a-zA-Z0-9]/g, '')}`
      );
    }
  }, [selectedStoreId]);

  // Desenhar arte no Canvas para o Admin
  // Solicitação do usuário: "ao invez da escrita seria bom colocar um + pra eu ver como ficaria"
  useEffect(() => {
    drawAdminArtwork();
  }, [format, selectedStore]);

  const drawAdminArtwork = async () => {
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
    bgGrad.addColorStop(0, '#0A0A0F');
    bgGrad.addColorStop(0.4, '#13131F');
    bgGrad.addColorStop(0.8, '#181528');
    bgGrad.addColorStop(1, '#09090C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Banner da Loja como Fundo Superior Estilizado
    const bannerHeight = format === 'feed' ? 340 : 540;
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
    const aura = ctx.createRadialGradient(width * 0.5, format === 'feed' ? 520 : 880, 20, width * 0.5, format === 'feed' ? 520 : 880, 480);
    aura.addColorStop(0, 'rgba(255, 95, 0, 0.35)');
    aura.addColorStop(0.5, 'rgba(255, 95, 0, 0.1)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    // 4. Logo do Lojista em Destaque com Borda Padronizada Oficial em Destaque Maior
    const logoY = format === 'feed' ? 195 : 360;
    const logoRadius = format === 'feed' ? 125 : 170;

    // Borda Padronizada Oficial
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

    // Imagem da Logo da Loja
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

        if (logoImg.width > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, (width / 2) - logoRadius, logoY - logoRadius, logoRadius * 2, logoRadius * 2);
          ctx.restore();
          logoDrawn = true;
        }
      } catch (e) {
        console.warn('Erro ao carregar logo do lojista:', e);
      }
    }

    if (!logoDrawn) {
      ctx.save();
      const circleGrad = ctx.createLinearGradient(width / 2 - logoRadius, logoY - logoRadius, width / 2 + logoRadius, logoY + logoRadius);
      circleGrad.addColorStop(0, '#1F1F2E');
      circleGrad.addColorStop(1, '#111119');
      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(width / 2, logoY, logoRadius - 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = format === 'feed' ? 'bold 90px "Inter", sans-serif' : 'bold 120px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (selectedStore?.logo && selectedStore.logo.length <= 4) {
        ctx.font = format === 'feed' ? '96px "Inter", sans-serif' : '130px "Inter", sans-serif';
        ctx.fillText(selectedStore.logo, width / 2, logoY);
      } else {
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

    // 6. ABAIXO DO NOME APARECER A CIDADE (LOJA ONLINE APARECER BRASIL)
    const cityY = storeNameY + 34;
    ctx.fillStyle = '#FF9D5C';
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillText(locationText, width / 2, cityY);
    ctx.restore();

    // 7. SÍMBOLO DE COLABORAÇÃO: "+" AO INVÉS DA ESCRITA
    const plusY = format === 'feed' ? 445 : 710;
    ctx.save();
    const gradText = ctx.createLinearGradient(width * 0.45, plusY - 25, width * 0.55, plusY + 25);
    gradText.addColorStop(0, '#FFFFFF');
    gradText.addColorStop(0.5, '#FFF1EB');
    gradText.addColorStop(1, '#FF7A29');
    ctx.fillStyle = gradText;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.75)';
    ctx.shadowBlur = 28;
    ctx.font = format === 'feed' ? '900 68px "Inter", sans-serif' : '900 84px "Inter", sans-serif';
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
        const mcLogoWidth = format === 'feed' ? 340 : 470;
        const mcLogoHeight = (mcLogoImg.height / mcLogoImg.width) * mcLogoWidth;
        const mcLogoX = (width - mcLogoWidth) / 2;
        const mcLogoY = plusY + (format === 'feed' ? 46 : 65);
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

    // 9. BOTÃO DE RESGATE (Mais de 65px de espaço livre abaixo do logo)
    const btnW = 560;
    const btnH = 68;
    const btnX = (width - btnW) / 2;
    const botY = format === 'feed' ? Math.max(745, mcLogoBottom + 50) : 1330;

    ctx.save();
    const btnGrad = ctx.createLinearGradient(btnX, botY, btnX + btnW, botY + btnH);
    btnGrad.addColorStop(0, '#FF5F00');
    btnGrad.addColorStop(1, '#E64A00');
    ctx.fillStyle = btnGrad;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.roundRect(btnX, botY, btnW, btnH, 34);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎟️ RESGATE SEU CUPOM EXCLUSIVO', width / 2, botY + btnH / 2);
    ctx.restore();

    // 10. Rodapé de Canais
    const footerY = format === 'feed' ? 880 : 1520;
    ctx.save();
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Disponível no app e em melhorcupom.com.br', width / 2, footerY);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 16px "Inter", sans-serif';
    ctx.fillText('Siga @melhorcupom.oficial para não perder nenhuma oferta', width / 2, footerY + 34);
    ctx.restore();
  };

  // Simulação completa de Post Automático no Instagram (@melhorcupom.oficial)
  const handleAutoPostInstagram = () => {
    if (!isInstagramConnected) {
      showToast('Conecte a conta do Instagram antes de publicar.', 'warning');
      return;
    }

    setIsPublishing(true);
    setPublishProgress(15);
    setPublishStep('Renderizando criativo oficial 1080x1080...');

    setTimeout(() => {
      setPublishProgress(45);
      setPublishStep('Enviando container de mídia para Meta Graph API v19.0...');
    }, 900);

    setTimeout(() => {
      setPublishProgress(80);
      setPublishStep('Publicando arte no feed de @melhorcupom.oficial...');
    }, 1800);

    setTimeout(() => {
      setPublishProgress(100);
      setPublishStep('Publicado com sucesso no feed!');

      // Adicionar nova publicação ao histórico
      const newPost = {
        id: `post_inst_${Date.now()}`,
        storeName: selectedStore?.name || 'Novo Estabelecimento Parceiro',
        city: locationText,
        publishedAt: 'Agora mesmo',
        likes: 1,
        comments: 0,
        status: 'Publicado no Feed',
        postUrl: `https://instagram.com/p/MC${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };

      setPostHistory([newPost, ...postHistory]);
      setIsPublishing(false);
      showToast(`Arte da loja "${selectedStore?.name}" publicada com sucesso no Instagram oficial!`, 'success');
    }, 2700);
  };

  // Baixar imagem do Admin
  const handleDownload = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const cleanName = (selectedStore?.name || 'loja').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `adm-divulgacao-instagram-${cleanName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Imagem promocional baixada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao baixar arte:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Integração com Instagram (@melhorcupom.oficial) */}
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
                  Instagram Oficial: @melhorcupom.oficial
                </h3>
                {isInstagramConnected ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Conectado (Meta Graph API)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Desconectado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300">
                Conta Profissional Meta conectada com permissões de publicação automática de carrossel, feed e stories.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                <span><strong>48.2k</strong> seguidores</span>
                <span>•</span>
                <span><strong>128k</strong> impressões mensais</span>
                <span>•</span>
                <span>Token válido por mais 58 dias</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInstagramConnected(!isInstagramConnected)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isInstagramConnected 
                  ? 'bg-white/10 hover:bg-white/15 text-gray-300 border border-white/10'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/30 font-black'
              }`}
            >
              {isInstagramConnected ? 'Gerenciar Conexão' : 'Conectar Instagram'}
            </button>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl border border-white/10 transition-colors"
              title="Abrir Perfil no Instagram"
            >
              <ExternalLink size={16} />
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
                  <option key={s.id} value={s.id}>
                    {s.name} - {getStoreLocationText(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Formato */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Formato da Mídia:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('feed')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    format === 'feed'
                      ? 'bg-orange-500/20 border-orange-500 text-white'
                      : 'bg-[#12121C] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Feed (1:1 Quadrado)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    format === 'story'
                      ? 'bg-orange-500/20 border-orange-500 text-white'
                      : 'bg-[#12121C] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Story / Reels (9:16)
                </button>
              </div>
            </div>

            {/* Editor de Legenda do Instagram */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>Legenda do Post: Parceria (+)</span>
                <span className="text-[10px] text-gray-400">Variáveis e hashtags automáticas</span>
              </label>
              <textarea
                rows={5}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full bg-[#12121C] border border-white/10 rounded-2xl p-3.5 text-xs text-gray-200 focus:outline-none focus:border-orange-500 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Botão Principal: Postar Automaticamente no Instagram */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleAutoPostInstagram}
                disabled={isPublishing || !isInstagramConnected}
                className="w-full bg-gradient-to-r from-fuchsia-600 via-rose-600 to-[#FF5F00] hover:from-fuchsia-500 hover:to-orange-500 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Publicando no @melhorcupom.oficial...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Postar Automaticamente no Instagram</span>
                  </>
                )}
              </button>

              {/* Barra de Progresso de Publicação */}
              {isPublishing && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px] text-gray-300 font-medium">
                    <span>{publishStep}</span>
                    <span>{publishProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${publishProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-2xl text-xs transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Arte para Arquivo Local (PNG)</span>
              </button>
            </div>

          </div>

        </div>

        {/* Pré-visualização da Arte do Admin (Coluna 7) */}
        <div className="lg:col-span-7 bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Eye size={15} className="text-fuchsia-400" />
              <span>Arte Oficial: Parceria (+)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40">
                ⭐ {locationText}
              </span>
            </div>
          </div>

          {/* Canvas Renderizado */}
          <div className="relative w-full flex items-center justify-center bg-black/40 rounded-2xl p-3 border border-white/5 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-2xl max-w-full h-auto transition-all border border-white/10"
              style={{
                maxHeight: format === 'feed' ? '460px' : '600px',
                aspectRatio: format === 'feed' ? '1 / 1' : '9 / 16'
              }}
            />
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Arte com símbolo de parceria (+) e espaçamento perfeito sem sobreposição.</span>
          </div>

        </div>

      </div>

      {/* 3. Histórico de Publicações Automáticas no Instagram */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Instagram size={18} className="text-rose-400" />
              <span>Feed de Publicações Automáticas Realizadas</span>
            </h3>
            <p className="text-xs text-gray-400">
              Histórico de postagens enviadas diretamente para a conta oficial @melhorcupom.oficial
            </p>
          </div>

          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
            Taxa de Entrega: 100% via API
          </div>
        </div>

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
                {post.city} • Post automático no feed com selo de parceria.
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-3 text-[11px]">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>

                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>Ver Post</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
