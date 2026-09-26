import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Instagram,
  Flame,
  Tag,
  Check,
  Copy,
  ExternalLink,
  Zap,
  ChevronRight,
  Share2,
  Film,
  Music,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  Utensils,
  Percent,
  Video,
  Volume2,
  VolumeX,
  Layers,
  Sliders,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { TransparentVideo } from './TransparentVideo';

// ============================================================================
// TEMPLATES ESTRATÉGICOS PARA O INSTAGRAM STORIES (9:16 - 15 SEGUNDOS)
// ============================================================================
export const STORY_TEMPLATES = [
  {
    id: 'geral',
    name: 'App Geral & Economia',
    category: 'Apresentação Oficial',
    icon: Flame,
    color: '#FF5F00',
    gradientText: 'from-[#FF5F00] via-[#FF8A00] to-[#FFB703]',
    badge: '🚀 LANÇAMENTO OFICIAL',
    acts: [
      {
        id: 1,
        timeRange: '0s - 5s',
        hook: 'Cansado de pagar caro no final do mês? 💸',
        sub: 'O segredo para economizar em todas as suas compras diárias!',
        tag: 'ECONOMIA REAL',
        highlight: 'ATÉ R$ 350/MÊS DE ECONOMIA'
      },
      {
        id: 2,
        timeRange: '5s - 10s',
        hook: 'Chegou o NOVO APP do Melhor Cupom! 📲✨',
        sub: 'Centenas de cupons 100% gratuitos na sua cidade + Cashback online.',
        tag: 'CUPONS ILIMITADOS',
        highlight: 'SEM TAXA DE ADESÃO'
      },
      {
        id: 3,
        timeRange: '10s - 15s',
        hook: 'Baixe Grátis Agora e Comece a Economizar!',
        sub: 'Toque no link abaixo ou acesse o perfil @melhorcupom.oficial',
        tag: 'VAGAS LIMITADAS',
        cta: 'BAIXAR APP GRÁTIS 🚀',
        linkSticker: 'omelhorcupom.com.br'
      }
    ],
    defaultCaption: `Economizar nunca foi tão fácil! 💸🔥 Conheça o novo app do @melhorcupom.oficial e garanta cupons gratuitos todo dia na sua cidade e cashback nas maiores lojas online! 📲 Toque na figurinha de link e baixe agora! #MelhorCupom #AppDeCupons #Economia #Descontos #SaoPaulo #Achadinhos`,
    musicSuggestion: '🔥 Áudio em alta sugerido: Afro House / Beat Viral do Reels',
    pollQuestion: 'Você já conhecia o app do Melhor Cupom?',
    pollOptions: ['Sim, já economizo! 😍', 'Baixando agora! 🚀']
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia & Lazer',
    category: 'Comércio Local',
    icon: Utensils,
    color: '#EF4444',
    gradientText: 'from-rose-500 via-orange-500 to-amber-400',
    badge: '🍔 GASTRONOMIA & BARES',
    acts: [
      {
        id: 1,
        timeRange: '0s - 5s',
        hook: 'Vai comer fora hoje? NÃO PAGUE PREÇO CHEIO! 🍔🍕',
        sub: 'Antes de pedir a conta, resgate o seu cupom no Melhor Cupom!',
        tag: 'ATÉ 50% OFF',
        highlight: 'HAMBURGUERIAS, PIZZAS & JAPA'
      },
      {
        id: 2,
        timeRange: '5s - 10s',
        hook: 'As melhores hamburguerias e restaurantes da cidade!',
        sub: 'Resgate seu cupom grátis na mesa com um clique sem complicação.',
        tag: 'RESGATE INSTANTÂNEO',
        highlight: 'DESCONTO DIRETO NA CONTA'
      },
      {
        id: 3,
        timeRange: '10s - 15s',
        hook: 'Garanta seu desconto exclusivo agora no App!',
        sub: 'Mostre o código no balcão e aproveite com a galera.',
        tag: 'CUPOM GRÁTIS',
        cta: 'PEGAR MEU CUPOM 🎟️',
        linkSticker: 'omelhorcupom.com.br/restaurantes'
      }
    ],
    defaultCaption: `Sextou ou rolê de fim de semana? 🍔🍣 Não pague preço cheio! No app do @melhorcupom.oficial você encontra os melhores restaurantes e lanchonetes da sua cidade com até 50% de desconto. Link no Story! 🎟️✨ #MelhorCupom #Hamburgueria #RestaurantesSP #OndeComerSP #Gastronomia #Descontos`,
    musicSuggestion: '🔥 Áudio em alta sugerido: Upbeat Funk / Lo-fi Chill Lounge',
    pollQuestion: 'Qual comida você mais quer desconto hoje?',
    pollOptions: ['Burger & Pizza 🍔🍕', 'Sushi & Japa 🍣']
  },
  {
    id: 'ecommerce',
    name: 'Grandes Lojas & Cashback',
    category: 'E-commerce & Afiliados',
    icon: ShoppingBag,
    color: '#10B981',
    gradientText: 'from-emerald-400 via-teal-400 to-cyan-400',
    badge: '🛒 CASHBACK ATÉ 9%',
    acts: [
      {
        id: 1,
        timeRange: '0s - 5s',
        hook: 'Vai comprar na internet hoje? ESPERA UM MINUTO! 🛒⚡',
        sub: 'Você sabia que pode receber dinheiro de volta na sua compra?',
        tag: 'DINHEIRO DE VOLTA',
        highlight: 'AMAZON, SHOPEE, ALIEXPRESS & MAGALU'
      },
      {
        id: 2,
        timeRange: '5s - 10s',
        hook: 'Cupons diários + Até 9% de Cashback direto no PIX!',
        sub: 'Ative o link no app do Melhor Cupom antes de fechar o carrinho.',
        tag: 'SAQUE VIA PIX',
        highlight: 'COMPRE E RECEBA DE VOLTA'
      },
      {
        id: 3,
        timeRange: '10s - 15s',
        hook: 'Ative agora e economize em milhares de produtos!',
        sub: 'Dinheiro na mão para você gastar como quiser.',
        tag: '100% SEGURO',
        cta: 'ATIVAR CASHBACK 💰',
        linkSticker: 'omelhorcupom.com.br/lojas'
      }
    ],
    defaultCaption: `Compre online e receba dinheiro de volta direto no PIX! 🛒💸 Com o @melhorcupom.oficial você ganha cupons testados e até 9% de cashback na Shopee, Amazon, Magalu e AliExpress. Toque no link da figurinha e confira! #MelhorCupom #Cashback #Shopee #AmazonBrasil #AliExpress #EconomizarOnline`,
    musicSuggestion: '🔥 Áudio em alta sugerido: Trending Pop / Electronic Bassline',
    pollQuestion: 'Onde você mais faz compras na internet?',
    pollOptions: ['Shopee / Ali 🛍️', 'Amazon / Mercado Livre 📦']
  },
  {
    id: 'vip',
    name: 'Clube VIP & Renda Extra',
    category: 'Indique e Ganhe',
    icon: Sparkles,
    color: '#A855F7',
    gradientText: 'from-purple-400 via-fuchsia-400 to-pink-500',
    badge: '👑 INDIQUE E GANHE R$ 5,00',
    acts: [
      {
        id: 1,
        timeRange: '0s - 5s',
        hook: 'Quer ganhar renda extra sem sair de casa? 🤑',
        sub: 'Transforme indicações de cupons em dinheiro na sua conta bancária!',
        tag: 'LUCRO DIÁRIO',
        highlight: 'R$ 5,00 POR INDICAÇÃO'
      },
      {
        id: 2,
        timeRange: '5s - 10s',
        hook: 'Ganhe R$ 5,00 por cada amigo que assinar o Clube VIP!',
        sub: 'Seus amigos economizam em tudo e você recebe comissões no PIX.',
        tag: 'PIX NA CARTEIRA',
        highlight: 'SEM LIMITE DE GANHOS'
      },
      {
        id: 3,
        timeRange: '10s - 15s',
        hook: 'Cadastre-se hoje mesmo e comece a lucrar!',
        sub: 'Vagas abertas para novos divulgadores parceiros.',
        tag: 'CLUBE EXCLUSIVO',
        cta: 'QUERO MINHA RENDA EXTRA 💎',
        linkSticker: 'omelhorcupom.com.br/clube'
      }
    ],
    defaultCaption: `Ganhe dinheiro indicando cupons de desconto! 👑💸 No Clube VIP do @melhorcupom.oficial você ganha R$ 5,00 no PIX por cada amigo indicado, além de acesso a ofertas e cupons secretos. Toque no link e venha faturar com a gente! #MelhorCupom #RendaExtra #ClubeVIP #IndiqueEGanhe #DinheiroExtra #TrabalharEmCasa`,
    musicSuggestion: '🔥 Áudio em alta sugerido: Trap / Luxury Beat Hip-Hop',
    pollQuestion: 'Quer receber R$ 5,00 por indicação?',
    pollOptions: ['Quero muito! 💰', 'Como funciona? 🤔']
  }
];

export const AnimatedStoriesStudio = ({ stores = [], showToast = () => {} }) => {
  // Estado do Template e Customização
  const [selectedTemplateId, setSelectedTemplateId] = useState('geral');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [cityOverride, setCityOverride] = useState('São Paulo - SP');
  const [customHook, setCustomHook] = useState('');
  const [customCta, setCustomCta] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedSticker, setCopiedSticker] = useState(false);

  // Estado do Player de Stories (15 segundos total)
  const STORY_DURATION = 15.0; // 15 segundos
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeActIndex, setActiveActIndex] = useState(0); // 0 (0-5s), 1 (5-10s), 2 (10-15s)

  // Estado de Gravação / Exportação de Vídeo
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [exportedVideoUrl, setExportedVideoUrl] = useState(null);

  const canvasExportRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTickTimeRef = useRef(Date.now());

  // Template Ativo
  const activeTemplate = useMemo(() => {
    return STORY_TEMPLATES.find((t) => t.id === selectedTemplateId) || STORY_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Loja Selecionada
  const activeStore = useMemo(() => {
    return stores.find((s) => s.id === selectedStoreId) || null;
  }, [stores, selectedStoreId]);

  // Atualizar legenda padrão ao trocar de template
  useEffect(() => {
    setCaptionText(activeTemplate.defaultCaption);
    setCustomHook('');
    setCustomCta('');
  }, [selectedTemplateId]);

  // Determinar o Ato ativo com base no currentTime (0 a 15s)
  useEffect(() => {
    if (currentTime < 5.0) {
      setActiveActIndex(0);
    } else if (currentTime < 10.0) {
      setActiveActIndex(1);
    } else {
      setActiveActIndex(2);
    }
  }, [currentTime]);

  // Loop do Player em tempo real (60 FPS)
  useEffect(() => {
    lastTickTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      if (isPlaying && !isExporting) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= STORY_DURATION) {
            return 0; // Loop automático do Story
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isExporting]);

  // Pular para ato específico
  const jumpToAct = (actIdx) => {
    setCurrentTime(actIdx * 5.0);
    setActiveActIndex(actIdx);
  };

  // Copiar legenda para o Instagram
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    showToast('Legenda copiada para o Instagram!');
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Copiar link do sticker
  const handleCopySticker = (link) => {
    navigator.clipboard.writeText(`https://www.${link}`);
    setCopiedSticker(true);
    showToast('Link do Sticker copiado!');
    setTimeout(() => setCopiedSticker(false), 2500);
  };

  // ============================================================================
  // FUNÇÃO: DESENHAR FRAME NO CANVAS DE ALTA DEFINIÇÃO (1080x1920)
  // Usado tanto para download de PNG estático quanto para gravação de vídeo MP4/WebM
  // ============================================================================
  const renderStoryFrameToCanvas = (ctx, time, template, store) => {
    const W = 1080;
    const H = 1920;
    const progress = (time % STORY_DURATION) / STORY_DURATION;
    const actIdx = time < 5.0 ? 0 : time < 10.0 ? 1 : 2;
    const currentAct = template.acts[actIdx];

    // 1. Fundo Luxury Obsidian Dark
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#07070A');
    bgGrad.addColorStop(0.35, '#111019');
    bgGrad.addColorStop(0.7, '#151322');
    bgGrad.addColorStop(1, '#060608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Auras Luminosas Radiais com respiração (Pulsing Glow)
    const pulse = Math.sin(time * 3) * 0.15 + 0.85;
    const mainAura = ctx.createRadialGradient(W * 0.5, H * 0.38, 50, W * 0.5, H * 0.38, 650);
    if (template.id === 'gastronomia') {
      mainAura.addColorStop(0, `rgba(239, 68, 68, ${0.45 * pulse})`);
      mainAura.addColorStop(0.5, 'rgba(255, 95, 0, 0.15)');
    } else if (template.id === 'ecommerce') {
      mainAura.addColorStop(0, `rgba(16, 185, 129, ${0.45 * pulse})`);
      mainAura.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
    } else if (template.id === 'vip') {
      mainAura.addColorStop(0, `rgba(168, 85, 247, ${0.45 * pulse})`);
      mainAura.addColorStop(0.5, 'rgba(217, 70, 239, 0.15)');
    } else {
      mainAura.addColorStop(0, `rgba(255, 95, 0, ${0.5 * pulse})`);
      mainAura.addColorStop(0.5, 'rgba(255, 183, 3, 0.18)');
    }
    mainAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mainAura;
    ctx.fillRect(0, 0, W, H);

    // 3. Partículas flutuantes douradas / brilhos dinâmicos
    for (let i = 0; i < 28; i++) {
      const pX = (Math.sin(i * 99 + time * 0.8) * 0.5 + 0.5) * W;
      const pY = ((i * 70 - time * 65) % H + H) % H;
      const pSize = (Math.sin(i + time * 2) * 2 + 3.5);
      const pAlpha = (Math.sin(i * 45 + time * 3) * 0.4 + 0.6) * 0.7;

      ctx.save();
      ctx.fillStyle = `rgba(255, 183, 3, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Barras de Progresso de Stories no Topo (Segmentadas: 3 atos de 5s cada)
    const barTop = 60;
    const barHeight = 7;
    const barSpacing = 16;
    const totalBars = 3;
    const availableWidth = W - 80;
    const singleBarWidth = (availableWidth - (totalBars - 1) * barSpacing) / totalBars;

    for (let b = 0; b < totalBars; b++) {
      const bX = 40 + b * (singleBarWidth + barSpacing);

      // Fundo cinza da barra
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.roundRect(bX, barTop, singleBarWidth, barHeight, 4);
      ctx.fill();

      // Preenchimento animado
      let fillRatio = 0;
      if (b < actIdx) fillRatio = 1;
      else if (b === actIdx) {
        fillRatio = Math.min(1, Math.max(0, (time - b * 5.0) / 5.0));
      }

      if (fillRatio > 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(bX, barTop, singleBarWidth * fillRatio, barHeight, 4);
        ctx.fill();
      }
    }

    // 5. Header do Instagram: Perfil Oficial @melhorcupom.oficial
    const headerY = 120;
    // Anel de Story Laranja degradê
    ctx.save();
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(80, headerY + 20, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Círculo interno do avatar
    ctx.fillStyle = '#181824';
    ctx.beginPath();
    ctx.arc(80, headerY + 20, 28, 0, Math.PI * 2);
    ctx.fill();

    // Texto do Perfil
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Inter", sans-serif';
    ctx.fillText('melhorcupom.oficial', 130, headerY + 18);

    // Selo de Verificado Oficial
    ctx.fillStyle = '#FF5F00';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('✓', 450, headerY + 18);

    // Subtítulo do Header (Cidade / Patrocinado)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillText(`${cityOverride} • Patrocinado`, 130, headerY + 48);
    ctx.restore();

    // 6. Badge Superior Animado (Categoria da Oferta)
    ctx.save();
    const badgeText = template.badge;
    ctx.font = 'bold 26px "Inter", sans-serif';
    const badgeW = ctx.measureText(badgeText).width + 60;
    const badgeH = 54;
    const badgeX = (W - badgeW) / 2;
    const badgeY = 240;

    // Fundo do Badge
    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeGrad.addColorStop(0, 'rgba(255, 95, 0, 0.35)');
    badgeGrad.addColorStop(1, 'rgba(255, 183, 3, 0.2)');
    ctx.fillStyle = badgeGrad;
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 27);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, W / 2, badgeY + 36);
    ctx.restore();

    // 7. Headline Principal do Ato (com animação de escala/surgimento suave)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px "Inter", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 24;

    const hookText = customHook || currentAct.hook;
    // Quebrar texto do hook em 2 ou 3 linhas se necessário
    const words = hookText.split(' ');
    let line1 = '';
    let line2 = '';
    let line3 = '';
    words.forEach((w) => {
      if (line1.length + w.length < 24) line1 += (line1 ? ' ' : '') + w;
      else if (line2.length + w.length < 26) line2 += (line2 ? ' ' : '') + w;
      else line3 += (line3 ? ' ' : '') + w;
    });

    const headlineStartY = 370;
    if (line1) ctx.fillText(line1, W / 2, headlineStartY);
    if (line2) {
      // Linha 2 destacada em degradê dourado/laranja
      ctx.fillStyle = template.color || '#FF8A00';
      ctx.fillText(line2, W / 2, headlineStartY + 74);
      ctx.fillStyle = '#FFFFFF';
    }
    if (line3) ctx.fillText(line3, W / 2, headlineStartY + 148);
    ctx.restore();

    // 8. Card Flutuante / Ticket 3D Central
    const cardY = 620;
    const cardW = 900;
    const cardH = 680;
    const cardX = (W - cardW) / 2;

    ctx.save();
    // Efeito de flutuação suave no card
    const floatOffset = Math.sin(time * 3.5) * 12;

    // Sombra profunda luxury
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    // Fundo do Card
    const cardBg = ctx.createLinearGradient(cardX, cardY + floatOffset, cardX, cardY + cardH + floatOffset);
    cardBg.addColorStop(0, '#191828');
    cardBg.addColorStop(0.5, '#12111D');
    cardBg.addColorStop(1, '#0C0B14');
    ctx.fillStyle = cardBg;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY + floatOffset, cardW, cardH, 36);
    ctx.fill();

    // Borda iluminada gradiente
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    const borderGrad = ctx.createLinearGradient(cardX, cardY + floatOffset, cardX + cardW, cardY + cardH + floatOffset);
    borderGrad.addColorStop(0, '#FF5F00');
    borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    borderGrad.addColorStop(1, '#FFB703');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY + floatOffset, cardW, cardH, 36);
    ctx.stroke();

    // Recortes de ticket nas laterais (estilo cupom)
    const notchY = cardY + cardH * 0.5 + floatOffset;
    ctx.fillStyle = '#0E0D16';
    ctx.beginPath();
    ctx.arc(cardX, notchY, 26, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cardX + cardW, notchY, 26, Math.PI / 2, -Math.PI / 2);
    ctx.fill();

    // Linha pontilhada divisória do cupom
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(cardX + 45, notchY);
    ctx.lineTo(cardX + cardW - 45, notchY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Conteúdo Superior do Card: Logo + Destaque
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText('MELHOR CUPOM', W / 2, cardY + 75 + floatOffset);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillText(currentAct.tag || 'CUPOM EXCLUSIVO', W / 2, cardY + 115 + floatOffset);

    // Grande Tag de Destaque no meio do Card
    ctx.save();
    const tagBoxW = 760;
    const tagBoxH = 110;
    const tagBoxX = (W - tagBoxW) / 2;
    const tagBoxY = cardY + 160 + floatOffset;

    const tagGrad = ctx.createLinearGradient(tagBoxX, tagBoxY, tagBoxX + tagBoxW, tagBoxY);
    tagGrad.addColorStop(0, 'rgba(255, 95, 0, 0.25)');
    tagGrad.addColorStop(0.5, 'rgba(255, 183, 3, 0.35)');
    tagGrad.addColorStop(1, 'rgba(255, 95, 0, 0.25)');
    ctx.fillStyle = tagGrad;
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tagBoxX, tagBoxY, tagBoxW, tagBoxH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFB703';
    ctx.font = '900 48px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentAct.highlight || 'ECONOMIZE ATÉ 50%', W / 2, tagBoxY + 70);
    ctx.restore();

    // Conteúdo Inferior do Card (Após a linha pontilhada)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const subText = currentAct.sub;
    const subWords = subText.split(' ');
    let sLine1 = '';
    let sLine2 = '';
    subWords.forEach((sw) => {
      if (sLine1.length + sw.length < 32) sLine1 += (sLine1 ? ' ' : '') + sw;
      else sLine2 += (sLine2 ? ' ' : '') + sw;
    });

    const subStartY = notchY + 85;
    ctx.fillText(sLine1, W / 2, subStartY);
    if (sLine2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '500 28px "Inter", sans-serif';
      ctx.fillText(sLine2, W / 2, subStartY + 50);
    }
    ctx.restore();

    // 9. Simulador de Sticker de Link do Instagram (Toque no Link)
    const stickerY = 1380;
    const stickerW = 620;
    const stickerH = 100;
    const stickerX = (W - stickerW) / 2;

    // Efeito de pulso no botão de link
    const stickerPulse = Math.sin(time * 5) * 4;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;

    // Fundo Branco Oficial de Link do Instagram Stories
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(stickerX - stickerPulse / 2, stickerY - stickerPulse / 2, stickerW + stickerPulse, stickerH + stickerPulse, 50);
    ctx.fill();

    // Ícone de Link e Texto do Sticker
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0D0D11';
    ctx.font = '900 32px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🔗  ${currentAct.linkSticker || 'omelhorcupom.com.br'}`, W / 2, stickerY + 62);
    ctx.restore();

    // 10. Botão de Chamada para Ação (CTA Pulsante no Rodapé)
    const ctaY = 1540;
    const ctaW = 860;
    const ctaH = 120;
    const ctaX = (W - ctaW) / 2;

    ctx.save();
    const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY);
    ctaGrad.addColorStop(0, '#FF5F00');
    ctaGrad.addColorStop(0.5, '#FF8A00');
    ctaGrad.addColorStop(1, '#FF3D00');
    ctx.fillStyle = ctaGrad;

    ctx.shadowColor = 'rgba(255, 95, 0, 0.8)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 30);
    ctx.fill();

    // Texto do CTA
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 40px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const ctaLabel = customCta || currentAct.cta || 'BAIXAR APP GRÁTIS 🚀';
    ctx.fillText(ctaLabel, W / 2, ctaY + 74);
    ctx.restore();

    // 11. Rodapé Informativo: "Toque na tela e pegue o seu cupom agora"
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Disponível na Web, Android e iOS • 100% Gratuito', W / 2, 1720);
    ctx.restore();
  };

  // ============================================================================
  // FUNÇÃO: GRAVAR VÍDEO DO STORY (CANVAS -> MediaRecorder -> WebM/MP4)
  // ============================================================================
  const handleRecordStoryVideo = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText('Inicializando estúdio de renderização (1080x1920)...');

    try {
      const canvas = canvasExportRef.current;
      if (!canvas) throw new Error('Canvas não encontrado');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Contexto 2D indisponível');

      canvas.width = 1080;
      canvas.height = 1920;

      // Suporte a codecs de gravação
      let mimeType = 'video/webm;codecs=vp9';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }

      const stream = canvas.captureStream(30); // 30 FPS para estabilidade e fluidez
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000 // 6 Mbps alta nitidez
      });

      const recordedChunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      const recordPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, ext: mimeType.includes('mp4') ? 'mp4' : 'webm' });
        };
      });

      recorder.start();

      // Renderizar 15 segundos frame a frame (450 frames @ 30 FPS)
      const fps = 30;
      const totalFrames = fps * STORY_DURATION; // 450 frames
      const dt = 1 / fps;

      for (let f = 0; f < totalFrames; f++) {
        const renderTime = f * dt;
        renderStoryFrameToCanvas(ctx, renderTime, activeTemplate, activeStore);

        if (f % 15 === 0) {
          const percent = Math.round((f / totalFrames) * 100);
          setExportProgress(percent);
          const currentSecond = (renderTime).toFixed(1);
          setExportStatusText(`Renderizando segundo ${currentSecond}s de 15s (${percent}%)...`);
          // Dá respiro ao motor JS
          await new Promise((r) => setTimeout(r, 10));
        }
      }

      setExportStatusText('Finalizando arquivo de vídeo de alta definição...');
      recorder.stop();

      const result = await recordPromise;
      setExportedVideoUrl(result.url);
      setExportProgress(100);
      setExportStatusText('Vídeo pronto para download!');

      // Disparar download automático
      const a = document.createElement('a');
      a.href = result.url;
      a.download = `story-melhor-cupom-${activeTemplate.id}-1080x1920.${result.ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(`Vídeo do Story gerado e baixado com sucesso! (${result.ext.toUpperCase()})`);
    } catch (err) {
      console.error('Erro na gravação do Story:', err);
      showToast('Erro ao exportar vídeo. Tente baixar a capa em PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  // ============================================================================
  // FUNÇÃO: BAIXAR CAPA ESTÁTICA EM ALTA DEFINIÇÃO (PNG 1080x1920)
  // ============================================================================
  const handleDownloadStaticCover = () => {
    const canvas = canvasExportRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;
    renderStoryFrameToCanvas(ctx, currentTime, activeTemplate, activeStore);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `story-capa-${activeTemplate.id}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Capa do Story em 1080x1920 baixada com sucesso!');
  };

  const currentAct = activeTemplate.acts[activeActIndex] || activeTemplate.acts[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Canvas Oculto para Renderização e Gravação de Vídeo em 1080x1920 */}
      <canvas ref={canvasExportRef} className="hidden" />

      {/* HEADER PRINCIPAL DO ESTÚDIO */}
      <div className="bg-gradient-to-r from-[#170E10] via-[#1B1626] to-[#12101D] border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-fuchsia-500/20 border border-orange-500/40 text-orange-300 text-xs font-black uppercase tracking-wider">
                <Film size={14} className="text-orange-400 animate-pulse" />
                <span>Estúdio Oficial Instagram Stories (9:16)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 border border-white/10 text-gray-300">
                1080 x 1920 Full HD
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                15 Segundos Graváveis
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
              <span>Criador de Stories Animados para Divulgação</span>
              <Sparkles size={24} className="text-amber-400" />
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              Gere vídeos animados profissionais com o mascote oficial, cupons relâmpago e chamadas para ação
              otimizadas para viralizar no Instagram e atrair novos usuários para o app do Melhor Cupom.
            </p>
          </div>

          {/* Botões de Ação Rápida no Topo */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRecordStoryVideo}
              disabled={isExporting}
              className="px-5 py-3.5 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Video size={18} className={isExporting ? 'animate-spin' : ''} />
              <span>{isExporting ? 'Gravando Vídeo...' : '🎬 Gravar & Baixar Vídeo (9:16)'}</span>
            </button>

            <button
              onClick={handleDownloadStaticCover}
              className="px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={16} className="text-orange-400" />
              <span>Baixar Capa (PNG)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE PROGRESSO DA GRAVAÇÃO DE VÍDEO */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181824] border-2 border-orange-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Film size={32} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white font-display">
                Renderizando Vídeo dos Stories
              </h3>
              <p className="text-xs text-gray-400">
                Processando 450 quadros em alta definição (1080x1920) para o Instagram...
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-orange-400">{exportStatusText}</span>
                <span className="text-white">{exportProgress}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-gray-500">
              Por favor, não feche esta aba enquanto o vídeo é finalizado. O download começará automaticamente.
            </div>
          </div>
        </div>
      )}

      {/* SELEÇÃO DOS 4 TEMPLATES DE STORIES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={14} className="text-orange-400" />
            <span>Escolha a Narrativa do Story (Templates Estratégicos)</span>
          </label>
          <span className="text-[11px] text-gray-400">Formatado para 15 segundos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORY_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplateId(tmpl.id);
                  setCurrentTime(0);
                  setActiveActIndex(0);
                }}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#231A26] to-[#171420] border-orange-500 shadow-lg shadow-orange-500/20 ring-2 ring-orange-500/30'
                    : 'bg-[#14141E] border-white/5 hover:border-white/15 text-gray-400'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${tmpl.color}25`, border: `1px solid ${tmpl.color}50` }}
                  >
                    <Icon size={20} style={{ color: tmpl.color }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-gray-400">
                      {tmpl.category}
                    </span>
                    <h4 className="text-sm font-black text-white font-display">{tmpl.name}</h4>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                  {tmpl.acts[0].hook}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-orange-400">{tmpl.badge}</span>
                  <span className="text-gray-500">3 Atos (15s)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA PRINCIPAL: PLAYER MOCKUP (ESQUERDA) + CONTROLES & LEGENDA (DIREITA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: SMARTPHONE MOCKUP 9:16 (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* MOCKUP DO IPHONE 9:16 */}
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-gray-800 shadow-orange-500/10 ring-1 ring-white/10 overflow-hidden select-none">
            
            {/* Dynamic Island / Câmera Frontal */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3 border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-white/20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* TELA INTERNA DO STORIES */}
            <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-b from-[#09080E] via-[#13121F] to-[#0A0910] flex flex-col justify-between p-4 pt-10">
              
              {/* Efeito de Aura Luminosa no Fundo */}
              <div
                className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${activeTemplate.color} 0%, transparent 70%)`
                }}
              />

              {/* 1. BARRAS DE PROGRESSO DO INSTAGRAM STORIES (3 ATOS) */}
              <div className="relative z-30 flex items-center gap-1.5 w-full pt-1">
                {[0, 1, 2].map((actIdx) => {
                  let fill = 0;
                  if (actIdx < activeActIndex) fill = 100;
                  else if (actIdx === activeActIndex) {
                    fill = Math.min(100, Math.max(0, ((currentTime - actIdx * 5.0) / 5.0) * 100));
                  }
                  return (
                    <div
                      key={actIdx}
                      onClick={() => jumpToAct(actIdx)}
                      className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
                    >
                      <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 2. HEADER DO STORIES (@melhorcupom.oficial) */}
              <div className="relative z-30 flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-amber-400">
                    <img
                      src={logoMelhorCupom}
                      alt="Melhor Cupom"
                      className="w-full h-full rounded-full object-cover bg-black"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-black text-white">
                      <span>melhorcupom.oficial</span>
                      <CheckCircle2 size={12} className="text-orange-400 fill-orange-400" />
                    </div>
                    <span className="text-[9px] text-gray-400">{cityOverride} • Patrocinado</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>
                </div>
              </div>

              {/* 3. CONTEÚDO DINÂMICO DO ATO ATUAL (TRANSIÇÃO ENTRE ATOS) */}
              <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center my-2 space-y-3">
                
                {/* Badge do Ato */}
                <div className="animate-bounce">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 border border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/20">
                    {currentAct.tag}
                  </span>
                </div>

                {/* Headline Principal com Efeito Pop */}
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight drop-shadow-md px-2">
                  {customHook || currentAct.hook}
                </h3>

                {/* MASCOTE ANIMADO OFICIAL (Vídeo com Chroma Key) */}
                <div className="relative w-44 h-40 sm:w-48 sm:h-44 flex items-center justify-center my-1">
                  <TransparentVideo
                    src="/video_loop_32s.mp4"
                    trimIntroSeconds={2.1}
                    loopEndSeconds={4.1}
                    removeGreen={true}
                    removeWhite={false}
                    preserveWhiteContent={true}
                    threshold={215}
                    feather={25}
                    transitionMode="crossfade"
                    transitionDuration={0.5}
                    className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(255,95,0,0.4)]"
                    alt="Mascote Melhor Cupom"
                  />
                </div>

                {/* Card de Cupom / Destaque do Ato */}
                <div className="w-full bg-[#1A1828]/90 backdrop-blur-md border border-orange-500/30 rounded-2xl p-3 shadow-xl space-y-1.5 transform hover:scale-102 transition-transform">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {currentAct.highlight}
                  </div>
                  <div className="text-[11px] text-gray-300 leading-snug">
                    {currentAct.sub}
                  </div>
                </div>

                {/* Simulador da Figurinha de Link do Instagram */}
                <div className="w-full pt-1">
                  <div className="mx-auto w-fit px-4 py-2 bg-white text-black font-black text-xs rounded-full shadow-xl flex items-center gap-1.5 animate-pulse cursor-pointer">
                    <span>🔗</span>
                    <span>{currentAct.linkSticker || 'omelhorcupom.com.br'}</span>
                  </div>
                </div>

              </div>

              {/* 4. FOOTER DO STORIES: BOTÃO CTA E INTERAÇÃO */}
              <div className="relative z-30 space-y-2 pt-2">
                <button
                  onClick={() => jumpToAct((activeActIndex + 1) % 3)}
                  className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span>{customCta || currentAct.cta || 'BAIXAR APP GRÁTIS'}</span>
                  <ChevronRight size={14} />
                </button>

                <div className="flex items-center justify-between text-[9px] text-gray-400 px-1">
                  <span>Toque para avançar ({Math.round(currentTime)}s / 15s)</span>
                  <span className="text-orange-400 font-bold">Ato {activeActIndex + 1} de 3</span>
                </div>
              </div>

            </div>
          </div>

          {/* CONTROLES DO PLAYER (PLAY / PAUSA / REINICIAR / NAVEGAR) */}
          <div className="mt-4 flex items-center gap-2 bg-[#181824] border border-white/10 rounded-2xl p-2 shadow-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setActiveActIndex(0);
                setIsPlaying(true);
              }}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Reiniciar Story"
            >
              <RotateCcw size={15} />
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            {/* Pular para os Atos */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToAct(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeActIndex === idx
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ato {idx + 1}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: CUSTOMIZAÇÃO, LEGENDA & GUIA DE POSTAGEM (7 COLUNAS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PAINEL DE PERSONALIZAÇÃO */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                <Sliders size={18} className="text-orange-400" />
                <span>Personalizar Textos do Story</span>
              </h3>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Sincronização em Tempo Real
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cidade / Localização */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Cidade em Destaque:</label>
                <input
                  type="text"
                  value={cityOverride}
                  onChange={(e) => setCityOverride(e.target.value)}
                  placeholder="Ex: São Paulo - SP, Curitiba, Brasil"
                  className="w-full bg-[#12121C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Loja Parceira Vinculada (Opcional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Loja Parceira (Opcional):</label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full bg-[#12121C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="">Divulgação Geral do App</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city || 'Brasil'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customização de Gancho / Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>Título do Gancho (Ato Atual):</span>
                <span className="text-[10px] text-gray-500">Deixe em branco para usar o padrão</span>
              </label>
              <input
                type="text"
                value={customHook}
                onChange={(e) => setCustomHook(e.target.value)}
                placeholder={currentAct.hook}
                className="w-full bg-[#12121C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Customização do Botão de CTA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>Texto do Botão de Ação (CTA):</span>
                <span className="text-[10px] text-gray-500">Ex: BAIXAR AGORA, PEGAR CUPOM</span>
              </label>
              <input
                type="text"
                value={customCta}
                onChange={(e) => setCustomCta(e.target.value)}
                placeholder={currentAct.cta || 'BAIXAR APP GRÁTIS 🚀'}
                className="w-full bg-[#12121C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* GERADOR DE LEGENDA & HASHTAGS PARA O INSTAGRAM */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                <Instagram size={18} className="text-rose-400" />
                <span>Legenda Pronta para o Instagram</span>
              </h3>

              <button
                onClick={handleCopyCaption}
                className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCaption ? 'Copiada!' : 'Copiar Legenda'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full bg-[#12121C] border border-white/10 rounded-2xl p-3.5 text-xs text-gray-200 focus:outline-none focus:border-orange-500 leading-relaxed font-sans resize-none"
            />
          </div>

          {/* DICAS ESTRATÉGICAS DE PUBLICAÇÃO NO INSTAGRAM */}
          <div className="bg-gradient-to-br from-[#1A1428] to-[#14121F] border border-purple-500/30 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
                <Music size={18} className="text-fuchsia-400" />
                <span>Dicas para Impulsionar o Algoritmo do Story</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              {/* Recomendação de Áudio */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider block">
                    Trilha Sonora Recomendada:
                  </span>
                  <span className="font-bold text-white text-xs">{activeTemplate.musicSuggestion}</span>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold">
                  +300% Alcance
                </span>
              </div>

              {/* Recomendação de Sticker de Link */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                    Figurinha de Link Obrigatória:
                  </span>
                  <span className="font-mono text-white text-xs">
                    https://www.{currentAct.linkSticker || 'omelhorcupom.com.br'}
                  </span>
                </div>

                <button
                  onClick={() => handleCopySticker(currentAct.linkSticker || 'omelhorcupom.com.br')}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedSticker ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSticker ? 'Copiado' : 'Copiar URL'}</span>
                </button>
              </div>

              {/* Recomendação de Enquete */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Figurinha de Enquete Sugerida (Aumenta Engajamento):
                </span>
                <p className="font-bold text-white text-xs">"{activeTemplate.pollQuestion}"</p>
                <div className="flex items-center gap-2 pt-1">
                  {activeTemplate.pollOptions.map((opt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
