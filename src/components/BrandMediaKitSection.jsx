import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  Check, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Instagram,
  Copy,
  Share2,
  Store,
  Gift,
  Users
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

// Gera SVG 100% Vetorial Puro da Logo Tipográfica + Ícone Ticket Oficial (Escalável Infinito para Canva, Illustrator, Corel, Gráficas)
const getPureVectorLogoSvg = (theme = 'dark') => {
  const textFill = theme === 'light' ? '#111118' : '#FFFFFF';
  const strokeColor = theme === 'light' ? '#000000' : '#08080C';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420">
  <defs>
    <linearGradient id="mcOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="50%" stop-color="#FF5F00" />
      <stop offset="100%" stop-color="#E04800" />
    </linearGradient>
    <linearGradient id="mcGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE169" />
      <stop offset="50%" stop-color="#FFB800" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <linearGradient id="mcGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="mcDropShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Ícone Vetorial do Cupom / Ticket Sorriso à Direita -->
  <g transform="translate(770, 28)" filter="url(#mcDropShadow)">
    <!-- Notas Verdes Vetoriais -->
    <g transform="translate(210, 15) rotate(18)">
      <rect x="0" y="0" width="95" height="56" rx="8" fill="url(#mcGreenGrad)" stroke="#064E3B" stroke-width="5"/>
      <rect x="8" y="8" width="79" height="40" rx="4" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="47.5" cy="28" r="14" fill="#065F46"/>
      <text x="47.5" y="34" font-family="Arial Black, Inter, sans-serif" font-weight="900" font-size="20" fill="#ECFDF5" text-anchor="middle">$</text>
    </g>
    <g transform="translate(185, 5) rotate(-4)">
      <rect x="0" y="0" width="95" height="56" rx="8" fill="url(#mcGreenGrad)" stroke="#064E3B" stroke-width="5"/>
      <rect x="8" y="8" width="79" height="40" rx="4" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="47.5" cy="28" r="14" fill="#065F46"/>
      <text x="47.5" y="34" font-family="Arial Black, Inter, sans-serif" font-weight="900" font-size="20" fill="#ECFDF5" text-anchor="middle">$</text>
    </g>

    <!-- Corpo do Ticket Dourado -->
    <path d="M30,20 H190 A16,16 0 0 1 206,36 V62 A18,18 0 0 0 206,98 V192 A18,18 0 0 0 206,228 V250 A16,16 0 0 1 190,266 H30 A16,16 0 0 1 14,250 V228 A18,18 0 0 0 14,192 V98 A18,18 0 0 0 14,62 V36 A16,16 0 0 1 30,20 Z" fill="url(#mcGoldGrad)" stroke="#0A0A0E" stroke-width="10" stroke-linejoin="round"/>
    
    <!-- Linha tracejada interna do cupom -->
    <line x1="34" y1="52" x2="186" y2="52" stroke="#78350F" stroke-width="5" stroke-dasharray="10 8" stroke-linecap="round"/>
    <line x1="34" y1="236" x2="186" y2="236" stroke="#78350F" stroke-width="5" stroke-dasharray="10 8" stroke-linecap="round"/>

    <!-- Óculos Escuros VIP -->
    <rect x="38" y="84" width="62" height="42" rx="10" fill="#111118" stroke="#000000" stroke-width="6"/>
    <rect x="120" y="84" width="62" height="42" rx="10" fill="#111118" stroke="#000000" stroke-width="6"/>
    <line x1="100" y1="100" x2="120" y2="100" stroke="#000000" stroke-width="7" stroke-linecap="round"/>
    <!-- Brilho da lente -->
    <polygon points="48,90 62,90 50,120 42,120" fill="#FFFFFF" opacity="0.75"/>
    <polygon points="130,90 144,90 132,120 124,120" fill="#FFFFFF" opacity="0.75"/>

    <!-- Sorriso -->
    <path d="M62,148 Q110,162 158,148 Q152,208 110,208 Q68,208 62,148 Z" fill="#111118" stroke="#000000" stroke-width="5"/>
    <path d="M68,150 Q110,160 152,150 L148,166 Q110,174 72,166 Z" fill="#FFFFFF"/>
    <ellipse cx="110" cy="194" rx="24" ry="12" fill="#EF4444"/>
  </g>

  <!-- Tipografia Oficial Vetorizada: MELHOR % -->
  <g filter="url(#mcDropShadow)">
    <text x="55" y="205" font-family="'Arial Black', 'Montserrat', 'Inter', sans-serif" font-weight="900" font-size="148" letter-spacing="-4" fill="${textFill}" stroke="${strokeColor}" stroke-width="18" paint-order="stroke fill">Melh</text>
    
    <!-- O com símbolo % integrado -->
    <g transform="translate(525, 152)">
      <circle cx="0" cy="0" r="56" fill="${textFill}" stroke="${strokeColor}" stroke-width="16"/>
      <circle cx="0" cy="0" r="38" fill="#111118"/>
      <text x="0" y="16" font-family="'Arial Black', 'Inter', sans-serif" font-weight="900" font-size="46" fill="#FF5F00" text-anchor="middle">%</text>
    </g>

    <text x="588" y="205" font-family="'Arial Black', 'Montserrat', 'Inter', sans-serif" font-weight="900" font-size="148" letter-spacing="-4" fill="${textFill}" stroke="${strokeColor}" stroke-width="18" paint-order="stroke fill">r</text>

    <!-- Segunda Linha: CUP$M -->
    <text x="85" y="348" font-family="'Arial Black', 'Montserrat', 'Inter', sans-serif" font-weight="900" font-size="156" letter-spacing="-4" fill="${textFill}" stroke="${strokeColor}" stroke-width="18" paint-order="stroke fill">Cup</text>

    <!-- O com símbolo $ integrado -->
    <g transform="translate(565, 294)">
      <circle cx="0" cy="0" r="62" fill="${textFill}" stroke="${strokeColor}" stroke-width="16"/>
      <circle cx="0" cy="0" r="43" fill="url(#mcOrangeGrad)"/>
      <text x="0" y="21" font-family="'Arial Black', 'Inter', sans-serif" font-weight="900" font-size="58" fill="#FFFFFF" text-anchor="middle">$</text>
    </g>

    <text x="632" y="348" font-family="'Arial Black', 'Montserrat', 'Inter', sans-serif" font-weight="900" font-size="156" letter-spacing="-4" fill="${textFill}" stroke="${strokeColor}" stroke-width="18" paint-order="stroke fill">m</text>
  </g>
</svg>`;
};

// Gera SVG 100% Vetorial Puro do Selo / Sticker Oficial para Stories, Posts e Vitrines
const getPureVectorStickerSvg = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300" width="900" height="300">
  <defs>
    <linearGradient id="badgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18121E" />
      <stop offset="50%" stop-color="#12121A" />
      <stop offset="100%" stop-color="#0B0B10" />
    </linearGradient>
    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF5F00" />
      <stop offset="50%" stop-color="#FFB800" />
      <stop offset="100%" stop-color="#FF5F00" />
    </linearGradient>
    <linearGradient id="iconCircle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="100%" stop-color="#FF5F00" />
    </linearGradient>
  </defs>

  <!-- Cápsula Principal -->
  <rect x="16" y="16" width="868" height="268" rx="134" fill="url(#badgeBg)" stroke="url(#badgeBorder)" stroke-width="8"/>
  <rect x="28" y="28" width="844" height="244" rx="122" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2"/>

  <!-- Ícone Esquerdo (% / $) -->
  <circle cx="150" cy="150" r="96" fill="url(#iconCircle)"/>
  <circle cx="150" cy="150" r="84" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="10 6"/>
  <text x="150" y="142" font-family="'Arial Black', 'Inter', sans-serif" font-weight="900" font-size="68" fill="#FFFFFF" text-anchor="middle">%</text>
  <text x="150" y="202" font-family="'Arial Black', 'Inter', sans-serif" font-weight="900" font-size="48" fill="#FFE169" text-anchor="middle">VIP</text>

  <!-- Textos Direita -->
  <rect x="275" y="54" width="290" height="36" rx="18" fill="#FF5F00" fill-opacity="0.2" stroke="#FF5F00" stroke-width="2"/>
  <text x="420" y="78" font-family="'Inter', 'Arial', sans-serif" font-weight="800" font-size="18" fill="#FFB800" letter-spacing="2" text-anchor="middle">PARCEIRO &amp; DIVULGADOR</text>

  <text x="275" y="162" font-family="'Arial Black', 'Montserrat', 'Inter', sans-serif" font-weight="900" font-size="68" fill="#FFFFFF">Melhor Cupom</text>
  <text x="278" y="216" font-family="'Inter', 'Arial', sans-serif" font-weight="700" font-size="28" fill="#FF7A00">omelhorcupom.com.br • Até 50% OFF</text>
</svg>`;
};

// Converte uma imagem (PNG local) em um arquivo SVG Vetorial Híbrido de Alta Definição (com viewBox escalável)
const buildEmbeddedSvgFromImage = async (imgSrc, width = 1200, height = 800) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imgSrc;
  });

  const natW = img.naturalWidth || width;
  const natH = img.naturalHeight || height;
  const canvas = document.createElement('canvas');
  canvas.width = natW;
  canvas.height = natH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, natW, natH);
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${natW} ${natH}" width="${natW}" height="${natH}">
  <title>Logo Oficial Melhor Cupom</title>
  <image width="${natW}" height="${natH}" xlink:href="${dataUrl}" href="${dataUrl}" />
</svg>`;
};

// Renderiza qualquer string SVG ou imagem para PNG Transparente Ultra HD (2400px) e inicia o download
const downloadAsHighResPng = async ({ svgString, imgSrc, fileName, targetWidth = 2400 }) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  let urlToLoad = imgSrc;
  let revokeAfter = false;

  if (svgString) {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    urlToLoad = URL.createObjectURL(blob);
    revokeAfter = true;
  }

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = urlToLoad;
  });

  const aspect = (img.naturalHeight || img.height || 800) / (img.naturalWidth || img.width || 1200);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = Math.round(targetWidth * aspect);

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (revokeAfter) {
    URL.revokeObjectURL(urlToLoad);
  }

  const pngDataUrl = canvas.toDataURL('image/png', 1.0);
  const a = document.createElement('a');
  a.href = pngDataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Faz download direto de uma string SVG como arquivo .svg
const downloadSvgString = (svgString, fileName) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export const BrandMediaKitSection = ({ compact = false }) => {
  const [bgPreview, setBgPreview] = useState('checker'); // 'checker' | 'dark' | 'light'
  const [downloadedKey, setDownloadedKey] = useState(null);
  const [flyerType, setFlyerType] = useState('user'); // 'user' (Clientes & Economia) | 'partner' (Lojas & Parceiros)
  const [flyerFormat, setFlyerFormat] = useState('story'); // 'story' (1080x1920) | 'feed' (1080x1080)
  const flyerCanvasRef = useRef(null);

  const markDownloaded = (key) => {
    setDownloadedKey(key);
    setTimeout(() => setDownloadedKey(null), 2500);
  };

  // Renderiza o Folder Selecionado (Usuários ou Parceiros)
  useEffect(() => {
    if (flyerType === 'user') {
      drawUserFlyer();
    } else {
      drawPartnerFlyer();
    }
  }, [flyerType, flyerFormat]);

  // FOLDER 1: CADASTRO DE USUÁRIOS (CLIENTES & ECONOMIA)
  const drawUserFlyer = async () => {
    const canvas = flyerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isStory = flyerFormat === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Fundo Minimalista Dark
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#07070B');
    bgGrad.addColorStop(0.5, '#100D16');
    bgGrad.addColorStop(1, '#07070B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Aura Central Suave e Elegante
    const auraCenterY = isStory ? height * 0.38 : height * 0.40;
    const aura = ctx.createRadialGradient(width * 0.5, auraCenterY, 40, width * 0.5, auraCenterY, isStory ? 580 : 440);
    aura.addColorStop(0, 'rgba(255, 95, 0, 0.32)');
    aura.addColorStop(0.5, 'rgba(255, 120, 0, 0.08)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    // Borda Externa Minimalista Fina
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(32, 32, width - 64, height - 64, 36);
    ctx.stroke();
    ctx.restore();

    // 3. Logo Oficial em Grande Destaque
    let logoBottomY = isStory ? 700 : 450;
    try {
      const mcLogoImg = new Image();
      mcLogoImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        mcLogoImg.onload = resolve;
        mcLogoImg.onerror = resolve;
        mcLogoImg.src = logoMelhorCupom;
      });

      if (mcLogoImg.width > 0) {
        const logoW = isStory ? 600 : 380;
        const logoH = (mcLogoImg.height / mcLogoImg.width) * logoW;
        const logoX = (width - logoW) / 2;
        const logoY = isStory ? 240 : 110;
        logoBottomY = logoY + logoH;

        ctx.save();
        ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
        ctx.shadowBlur = 40;
        ctx.drawImage(mcLogoImg, logoX, logoY, logoW, logoH);
        ctx.restore();
      }
    } catch (e) {
      console.warn('Erro ao carregar logo no folder:', e);
    }

    // 4. Headline Principal Direta e Forte
    const headStartY = isStory ? logoBottomY + 115 : logoBottomY + 46;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "Economize Todos os Dias"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = isStory ? '900 68px "Inter", "Segoe UI", sans-serif' : '900 44px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Economize Todos os Dias', width / 2, headStartY);

    // "Cadastre-se no Melhor Cupom" (Gradiente Laranja Vibrante)
    const line2Y = headStartY + (isStory ? 84 : 54);
    const grad = ctx.createLinearGradient(width * 0.2, line2Y, width * 0.8, line2Y);
    grad.addColorStop(0, '#FF8A00');
    grad.addColorStop(0.5, '#FFB800');
    grad.addColorStop(1, '#FF5F00');
    ctx.fillStyle = grad;
    ctx.font = isStory ? '900 70px "Inter", "Segoe UI", sans-serif' : '900 46px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Cadastre-se no Melhor Cupom', width / 2, line2Y);
    ctx.restore();

    // 5. Selo Elegante e Minimalista: "🎁 100% GRÁTIS • ATÉ 50% OFF"
    const pillY = line2Y + (isStory ? 85 : 52);
    const pillW = isStory ? 540 : 410;
    const pillH = isStory ? 58 : 42;
    const pillX = (width - pillW) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = isStory ? '900 24px "Inter", "Segoe UI", sans-serif' : '900 17px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁 100% GRÁTIS • DESCONTOS DE ATÉ 50% OFF', width / 2, pillY + pillH / 2 + 1);
    ctx.restore();

    // 6. Subtítulo Limpo
    const subY = pillY + pillH + (isStory ? 65 : 38);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9CA3AF';
    ctx.font = isStory ? '600 28px "Inter", "Segoe UI", sans-serif' : '600 19px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Restaurantes, comércio local e grandes lojas online em um só lugar.', width / 2, subY);
    ctx.restore();

    // Se for Story, card com 4 destaques
    let afterPerksY = subY;
    if (isStory) {
      const cardY = subY + 50;
      const cardW = 860;
      const cardH = 290;
      const cardX = (width - cardW) / 2;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 28);
      ctx.fill();
      ctx.stroke();

      const perks = [
        '🍔 Restaurantes, hamburguerias, pizzarias e lojas da sua cidade',
        '🛍️ Achadinhos virais da Shopee, Magalu, Shein e Mercado Livre',
        '🎟️ Resgate cupons em 1 clique sem custo direto no celular',
        '👑 Clube VIP com ofertas exclusivas e descontos turbinados'
      ];

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '600 25px "Inter", "Segoe UI", sans-serif';
      perks.forEach((perk, idx) => {
        ctx.fillStyle = '#E5E7EB';
        ctx.fillText(perk, cardX + 44, cardY + 48 + (idx * 64));
      });
      ctx.restore();
      afterPerksY = cardY + cardH;
    }

    // 7. Botão de Ação Sofisticado e Limpo
    const btnY = isStory ? afterPerksY + 65 : subY + 48;
    const btnW = isStory ? 680 : 530;
    const btnH = isStory ? 94 : 68;
    const btnX = (width - btnW) / 2;

    ctx.save();
    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
    btnGrad.addColorStop(0, '#FF5F00');
    btnGrad.addColorStop(1, '#E04F00');
    ctx.fillStyle = btnGrad;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, btnH / 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.font = isStory ? '900 32px "Inter", "Segoe UI", sans-serif' : '900 23px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Criar Conta Grátis & Economizar', width / 2, btnY + btnH / 2);
    ctx.restore();

    // 8. Rodapé Minimalista
    const footY = isStory ? 1730 : 965;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#E5E7EB';
    ctx.font = isStory ? '900 32px "Inter", "Segoe UI", sans-serif' : '900 24px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('omelhorcupom.com.br', width / 2, footY);

    ctx.fillStyle = '#FF7A29';
    ctx.font = isStory ? '700 22px "Inter", "Segoe UI", sans-serif' : '700 17px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('@omelhorcupom.com.br', width / 2, footY + (isStory ? 42 : 30));
    ctx.restore();
  };

  // FOLDER 2: SEJA UM PARCEIRO (LOJAS & COMÉRCIO)
  const drawPartnerFlyer = async () => {
    const canvas = flyerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isStory = flyerFormat === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Fundo Minimalista Dark
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#07070B');
    bgGrad.addColorStop(0.5, '#100D16');
    bgGrad.addColorStop(1, '#07070B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Aura Central Suave e Elegante
    const auraCenterY = isStory ? height * 0.38 : height * 0.40;
    const aura = ctx.createRadialGradient(width * 0.5, auraCenterY, 40, width * 0.5, auraCenterY, isStory ? 580 : 440);
    aura.addColorStop(0, 'rgba(255, 95, 0, 0.32)');
    aura.addColorStop(0.5, 'rgba(255, 120, 0, 0.08)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    // Borda Externa Minimalista Fina
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(32, 32, width - 64, height - 64, 36);
    ctx.stroke();
    ctx.restore();

    // 3. Logo Oficial em Grande Destaque
    let logoBottomY = isStory ? 700 : 450;
    try {
      const mcLogoImg = new Image();
      mcLogoImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        mcLogoImg.onload = resolve;
        mcLogoImg.onerror = resolve;
        mcLogoImg.src = logoMelhorCupom;
      });

      if (mcLogoImg.width > 0) {
        const logoW = isStory ? 600 : 380;
        const logoH = (mcLogoImg.height / mcLogoImg.width) * logoW;
        const logoX = (width - logoW) / 2;
        const logoY = isStory ? 240 : 110;
        logoBottomY = logoY + logoH;

        ctx.save();
        ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
        ctx.shadowBlur = 40;
        ctx.drawImage(mcLogoImg, logoX, logoY, logoW, logoH);
        ctx.restore();
      }
    } catch (e) {
      console.warn('Erro ao carregar logo no folder:', e);
    }

    // 4. Headline Principal Direta e Forte
    const headStartY = isStory ? logoBottomY + 120 : logoBottomY + 48;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "Seja um Parceiro Oficial"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = isStory ? '900 68px "Inter", "Segoe UI", sans-serif' : '900 44px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Seja um Parceiro Oficial', width / 2, headStartY);

    // "Crie o Cupom da Sua Loja" (Gradiente Laranja Vibrante)
    const line2Y = headStartY + (isStory ? 84 : 54);
    const grad = ctx.createLinearGradient(width * 0.25, line2Y, width * 0.75, line2Y);
    grad.addColorStop(0, '#FF8A00');
    grad.addColorStop(0.5, '#FFB800');
    grad.addColorStop(1, '#FF5F00');
    ctx.fillStyle = grad;
    ctx.font = isStory ? '900 74px "Inter", "Segoe UI", sans-serif' : '900 48px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Crie o Cupom da Sua Loja', width / 2, line2Y);
    ctx.restore();

    // 5. Selo Elegante e Minimalista: "100% GRÁTIS"
    const pillY = line2Y + (isStory ? 85 : 52);
    const pillW = isStory ? 390 : 290;
    const pillH = isStory ? 58 : 42;
    const pillX = (width - pillW) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = isStory ? '900 25px "Inter", "Segoe UI", sans-serif' : '900 18px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁 100% GRÁTIS', width / 2, pillY + pillH / 2 + 1);
    ctx.restore();

    // 6. Subtítulo Limpo
    const subY = pillY + pillH + (isStory ? 70 : 40);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9CA3AF';
    ctx.font = isStory ? '600 28px "Inter", "Segoe UI", sans-serif' : '600 20px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Atraia novos clientes e aumente suas vendas todos os dias.', width / 2, subY);
    ctx.restore();

    // 7. Botão de Ação Sofisticado e Limpo
    const btnY = subY + (isStory ? 100 : 52);
    const btnW = isStory ? 660 : 520;
    const btnH = isStory ? 94 : 68;
    const btnX = (width - btnW) / 2;

    ctx.save();
    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
    btnGrad.addColorStop(0, '#FF5F00');
    btnGrad.addColorStop(1, '#E04F00');
    ctx.fillStyle = btnGrad;
    ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, btnH / 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.font = isStory ? '900 32px "Inter", "Segoe UI", sans-serif' : '900 24px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cadastre sua Loja Grátis', width / 2, btnY + btnH / 2);
    ctx.restore();

    // 8. Rodapé Minimalista
    const footY = isStory ? 1730 : 965;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#E5E7EB';
    ctx.font = isStory ? '900 32px "Inter", "Segoe UI", sans-serif' : '900 24px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('omelhorcupom.com.br', width / 2, footY);

    ctx.fillStyle = '#FF7A29';
    ctx.font = isStory ? '700 22px "Inter", "Segoe UI", sans-serif' : '700 17px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('@omelhorcupom.com.br', width / 2, footY + (isStory ? 42 : 30));
    ctx.restore();
  };

  const handleDownloadFlyerPng = () => {
    const canvas = flyerCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = dataUrl;
    const baseName = flyerType === 'user' ? 'folder-cadastro-usuario-melhor-cupom' : 'folder-seja-parceiro-melhor-cupom';
    a.download = `${baseName}-${flyerFormat}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    markDownloaded('flyer-png');
  };

  const handleDownloadFlyerSvg = () => {
    const canvas = flyerCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const w = canvas.width;
    const h = canvas.height;
    const titleText = flyerType === 'user' ? 'Folder Cadastro de Usuários Melhor Cupom' : 'Folder Seja um Parceiro Melhor Cupom';
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>${titleText}</title>
  <image width="${w}" height="${h}" xlink:href="${dataUrl}" href="${dataUrl}" />
</svg>`;
    const baseName = flyerType === 'user' ? 'folder-cadastro-usuario-melhor-cupom' : 'folder-seja-parceiro-melhor-cupom';
    downloadSvgString(svgStr, `${baseName}-${flyerFormat}.svg`);
    markDownloaded('flyer-svg');
  };

  const userFlyerCaption = `🎟️ *ECONOMIZE EM DEZENAS DE LOJAS COM O MELHOR CUPOM!* 🔥✨

Você sabia que dá pra resgatar cupons de desconto 100% grátis em restaurantes, lanchonetes e serviços da nossa cidade, além de grandes lojas da internet (Shopee, Magalu, Shein e Mercado Livre)?

🎁 *CADASTRO 100% GRATUITO:*
✅ Economize até 50% OFF na sua conta
✅ Sem mensalidade, resgate direto pelo celular
✅ Apresente o cupom no balcão ou use online
✅ Clube VIP com ofertas exclusivas e secretas

📲 *Cadastre-se grátis em menos de 1 minuto:*
👉 https://omelhorcupom.com.br

📢 Siga nosso Instagram oficial: *@omelhorcupom.com.br*`;

  const partnerFlyerCaption = `🚀 *SEJA UM PARCEIRO MELHOR CUPOM E CRIE JÁ O CUPOM DA SUA LOJA!* 🎟️🔥

Quer atrair novos clientes da cidade todos os dias e destacar sua empresa na maior vitrine de descontos da região?

🎁 *CADASTRO 100% GRÁTIS • 1 CUPOM GRATUITO LIBERADO!*
✅ Cadastre sua loja gratuitamente e publique seu 1º cupom sem custo!
✅ Divulgação oficial no Instagram *@omelhorcupom.com.br*
✅ Painel exclusivo para gerenciar suas ofertas e atrair clientes reais para o seu negócio!

📲 *Cadastre sua loja em 1 minuto:*
👉 https://omelhorcupom.com.br

📢 Lembre-se de marcar sempre *@omelhorcupom.com.br* nas suas divulgações!`;

  const currentFlyerCaption = flyerType === 'user' ? userFlyerCaption : partnerFlyerCaption;

  const handleCopyFlyerCaption = () => {
    navigator.clipboard.writeText(currentFlyerCaption);
    markDownloaded('flyer-caption');
  };

  const handleShareFlyerWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(currentFlyerCaption)}`, '_blank');
  };

  const assets = [
    {
      id: 'logo-oficial-completa',
      title: 'Logo Oficial 3D + Mascote',
      badge: 'Mais Usada nas Mídias',
      description: 'Logotipo oficial completo com o mascote Cupomzinho VIP e fundo 100% transparente. Perfeito para Stories, Reels, Posts e Banners.',
      type: 'image',
      imgSrc: logoMelhorCupom,
      svgFileName: 'melhor-cupom-logo-oficial-completa.svg',
      pngFileName: 'melhor-cupom-logo-oficial-completa-hd.png'
    },
    {
      id: 'logo-vetor-curvas-dark',
      title: 'Logo Vetorizada em Curvas (Fundo Escuro)',
      badge: '100% Vetor Puro (.SVG)',
      description: 'Versão vetorial escalável sem perda de qualidade para Canva, Illustrator, CorelDRAW, gráficas, fachadas e vídeos.',
      type: 'svg',
      svgContent: getPureVectorLogoSvg('dark'),
      svgFileName: 'melhor-cupom-logo-vetor-curvas-dark.svg',
      pngFileName: 'melhor-cupom-logo-vetor-curvas-dark-hd.png'
    },
    {
      id: 'mascote-isolado',
      title: 'Mascote Oficial Isolado (Sticker)',
      badge: 'Fundo Transparente',
      description: 'Apenas o mascote oficial do Melhor Cupom recortado em alta definição para usar como figurinha/sticker nos Stories e artes.',
      type: 'image',
      imgSrc: '/favicon.png',
      svgFileName: 'melhor-cupom-mascote-oficial.svg',
      pngFileName: 'melhor-cupom-mascote-oficial-hd.png'
    },
    {
      id: 'selo-parceiro-vetor',
      title: 'Selo / Sticker "Parceiro & Divulgador"',
      badge: '100% Vetor Puro (.SVG)',
      description: 'Etiqueta oficial horizontal pronta para aplicar no canto de fotos de produtos, stories de ofertas, cardápios e vitrines.',
      type: 'svg',
      svgContent: getPureVectorStickerSvg(),
      svgFileName: 'melhor-cupom-selo-oficial-vetor.svg',
      pngFileName: 'melhor-cupom-selo-oficial-hd.png'
    }
  ];

  const handleDownloadSvg = async (asset) => {
    try {
      let svgStr = asset.svgContent;
      if (!svgStr && asset.imgSrc) {
        svgStr = await buildEmbeddedSvgFromImage(asset.imgSrc);
      }
      downloadSvgString(svgStr, asset.svgFileName);
      markDownloaded(`${asset.id}-svg`);
    } catch (e) {
      console.error('Erro ao baixar SVG:', e);
    }
  };

  const handleDownloadPng = async (asset) => {
    try {
      await downloadAsHighResPng({
        svgString: asset.svgContent,
        imgSrc: asset.imgSrc,
        fileName: asset.pngFileName,
        targetWidth: 2400
      });
      markDownloaded(`${asset.id}-png`);
    } catch (e) {
      console.error('Erro ao baixar PNG HD:', e);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (const asset of assets) {
        await handleDownloadSvg(asset);
        await new Promise(r => setTimeout(r, 250));
        await handleDownloadPng(asset);
        await new Promise(r => setTimeout(r, 250));
      }
      markDownloaded('all');
    } finally {
      setDownloadingAll(false);
    }
  };

  const getPreviewBgStyle = () => {
    if (bgPreview === 'dark') {
      return { backgroundColor: '#0D0D14' };
    }
    if (bgPreview === 'light') {
      return { backgroundColor: '#F3F4F6' };
    }
    // Quadriculado de transparência padrão de editores gráficos
    return {
      backgroundColor: '#181822',
      backgroundImage: `
        linear-gradient(45deg, #232332 25%, transparent 25%), 
        linear-gradient(-45deg, #232332 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #232332 75%), 
        linear-gradient(-45deg, transparent 75%, #232332 75%)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    };
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1A28] via-[#141420] to-[#101018] border-2 border-orange-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* FOLDER OFICIAL DE DIVULGAÇÃO: USUÁRIOS OU PARCEIROS */}
      <div className="bg-gradient-to-br from-[#23140D] via-[#181422] to-[#12121A] border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl">
        {/* Seletor de Tipo de Folder (Usuários vs Parceiros) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-300">Campanha do Folder:</span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setFlyerType('user')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                flyerType === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={13} />
              <span>👥 Cadastro de Usuários (Clientes)</span>
            </button>

            <button
              type="button"
              onClick={() => setFlyerType('partner')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                flyerType === 'partner'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Store size={13} />
              <span>🏪 Seja um Parceiro (Lojas)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Coluna Esquerda: Controles, Textos e Botões de Download do Folder */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
              {flyerType === 'user' ? (
                <>
                  <Users size={13} className="text-[#FF5F00]" />
                  <span>Folder Oficial de Cadastro de Usuários (Clientes & Economia)</span>
                </>
              ) : (
                <>
                  <Store size={13} className="text-[#FF5F00]" />
                  <span>Folder Oficial de Captação de Lojas & Parceiros</span>
                </>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
              {flyerType === 'user' 
                ? 'Folder: "Economize Todos os Dias • Cadastre-se no Melhor Cupom"'
                : 'Folder: "Seja um Parceiro Melhor Cupom e crie já o cupom da sua loja!"'}
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {flyerType === 'user'
                ? 'Arte oficial pronta para convidar clientes e consumidores a se cadastrarem gratuitamente para resgatar cupons de até 50% OFF em restaurantes locais e compras online (Shopee, Magalu, Shein e Mercado Livre)!'
                : 'Arte oficial pronta com a Logo 3D do Melhor Cupom e o destaque de 🎁 100% Grátis (1 Cupom Gratuito) para publicar nos Stories, Feed, Status ou enviar diretamente para comércios e lojistas da cidade!'}
            </p>

            {/* Seletor de Formato do Folder */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-gray-400 mr-1">Formato do Folder:</span>
              <button
                type="button"
                onClick={() => setFlyerFormat('story')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  flyerFormat === 'story'
                    ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span>📱 Folder Vertical / Story (9:16)</span>
              </button>
              <button
                type="button"
                onClick={() => setFlyerFormat('feed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  flyerFormat === 'feed'
                    ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span>🟦 Post Quadrado / Feed (1:1)</span>
              </button>
            </div>

            {/* Botões Principais de Download e Compartilhamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadFlyerPng}
                className="bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                {downloadedKey === 'flyer-png' ? <Check size={16} /> : <Download size={16} />}
                <span>{downloadedKey === 'flyer-png' ? 'Folder PNG Baixado!' : 'Baixar Folder em PNG HD'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadFlyerSvg}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {downloadedKey === 'flyer-svg' ? <Check size={16} className="text-emerald-400" /> : <Layers size={16} className="text-amber-400" />}
                <span>{downloadedKey === 'flyer-svg' ? 'Folder SVG Baixado!' : 'Baixar Folder em Vetor (.SVG)'}</span>
              </button>
            </div>

            {/* Legenda Pronta para Enviar Junto com o Folder */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Gift size={13} className="text-[#FF5F00]" />
                  <span>Texto Pronto para Enviar com o Folder:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyFlyerCaption}
                    className="text-[11px] font-black text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/30"
                  >
                    {downloadedKey === 'flyer-caption' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{downloadedKey === 'flyer-caption' ? 'Texto Copiado!' : 'Copiar Texto'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareFlyerWhatsApp}
                    className="text-[11px] font-black text-emerald-300 hover:text-emerald-200 flex items-center gap-1 cursor-pointer bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30"
                  >
                    <Share2 size={12} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-gray-300 font-mono whitespace-pre-line line-clamp-3">
                {currentFlyerCaption}
              </p>
            </div>
          </div>

          {/* Coluna Direita: Preview ao Vivo do Folder */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/50 border border-white/10 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-gray-400 mb-2.5 flex items-center gap-1.5">
              <Eye size={13} className="text-amber-400" />
              <span>Pré-visualização do Folder Oficial ({flyerFormat === 'story' ? '1080x1920' : '1080x1080'})</span>
            </div>
            <canvas
              ref={flyerCanvasRef}
              className="rounded-xl shadow-2xl border border-amber-500/30 max-w-full h-auto transition-all"
              style={{
                maxHeight: flyerFormat === 'story' ? '420px' : '320px',
                aspectRatio: flyerFormat === 'story' ? '9 / 16' : '1 / 1'
              }}
            />
          </div>

        </div>
      </div>

      {/* Header do Media Kit Oficial */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Layers size={13} className="text-[#FF5F00]" />
            <span>Media Kit Oficial • Logos Vetorizadas (.SVG & .PNG Transparente)</span>
          </div>
          <h3 className={`${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-black text-white font-display`}>
            Logotipos Oficiais do Melhor Cupom para Suas Mídias
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Baixe as logos oficiais vetorizadas em <strong>.SVG (vetor escalável para Canva, Illustrator, Corel e gráficas)</strong> ou em <strong>.PNG Ultra HD com fundo transparente</strong> para colocar nos seus Stories, Reels, Posts, vídeos e artes de divulgação!
          </p>
        </div>

        {/* Controles Superiores: Testar Fundo + Baixar Tudo */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-[11px]">
            <span className="text-gray-400 px-2 font-bold hidden sm:inline flex items-center gap-1">
              <Eye size={12} /> Fundo:
            </span>
            <button
              type="button"
              onClick={() => setBgPreview('checker')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                bgPreview === 'checker' ? 'bg-[#FF5F00] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Visualizar grade de fundo transparente"
            >
              Transparente
            </button>
            <button
              type="button"
              onClick={() => setBgPreview('dark')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                bgPreview === 'dark' ? 'bg-[#FF5F00] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Simular aplicação sobre fundo escuro"
            >
              Escuro
            </button>
            <button
              type="button"
              onClick={() => setBgPreview('light')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                bgPreview === 'light' ? 'bg-[#FF5F00] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Simular aplicação sobre fundo claro"
            >
              Claro
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            className="bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {downloadedKey === 'all' ? (
              <>
                <Check size={15} />
                <span>Pacote Baixado!</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>{downloadingAll ? 'Baixando Logos...' : 'Baixar Todas as Logos'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AVISO EM DESTAQUE: MARCAR @omelhorcupom.com.br */}
      <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-pink-500/15 border-2 border-[#FF5F00]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5F00] to-pink-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Instagram size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-white flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span>📢 Lembre-se de marcar sempre</span>
              <span className="text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg border border-amber-500/40 font-mono">
                @omelhorcupom.com.br
              </span>
              <span>nas suas divulgações!</span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Quando você marca nosso perfil oficial nos Stories, Reels ou Posts, nossa equipe visualiza e reposta para impulsionar seus resultados!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText('@omelhorcupom.com.br');
            markDownloaded('copy-ig-handle');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
            downloadedKey === 'copy-ig-handle'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          {downloadedKey === 'copy-ig-handle' ? <Check size={14} /> : <Copy size={14} />}
          <span>{downloadedKey === 'copy-ig-handle' ? '@ Copiado!' : 'Copiar @omelhorcupom.com.br'}</span>
        </button>
      </div>

      {/* Grid dos 4 Arquivos Oficiais Vetorizados */}
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-4'} gap-4`}>
        {assets.map((asset) => {
          const isSvgDownloaded = downloadedKey === `${asset.id}-svg`;
          const isPngDownloaded = downloadedKey === `${asset.id}-png`;

          return (
            <div
              key={asset.id}
              className="bg-[#13131C] border border-white/10 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-lg group"
            >
              <div>
                {/* Área de Preview com Fundo Transparente Quadriculado */}
                <div
                  style={getPreviewBgStyle()}
                  className="relative h-36 sm:h-40 w-full rounded-xl border border-white/10 flex items-center justify-center p-4 overflow-hidden mb-3.5 transition-colors"
                >
                  <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    {asset.badge}
                  </span>

                  {asset.type === 'image' ? (
                    <img
                      src={asset.imgSrc}
                      alt={asset.title}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:w-auto [&>svg]:h-auto group-hover:scale-105 transition-transform duration-300"
                      dangerouslySetInnerHTML={{ __html: asset.svgContent }}
                    />
                  )}
                </div>

                {/* Título e Descrição */}
                <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                  {asset.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  {asset.description}
                </p>
              </div>

              {/* Botões de Download: .SVG Vetorizado e .PNG Transparente HD */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleDownloadSvg(asset)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSvgDownloaded
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-[#FF5F00] hover:bg-[#E04F00] text-white shadow-md shadow-orange-600/20'
                  }`}
                  title="Baixar arquivo vetorizado escalável (.SVG)"
                >
                  {isSvgDownloaded ? <Check size={13} /> : <Download size={13} />}
                  <span>{isSvgDownloaded ? 'Baixado!' : 'Vetor .SVG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPng(asset)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    isPngDownloaded
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                  title="Baixar imagem em alta resolução (2400px) com fundo transparente (.PNG)"
                >
                  {isPngDownloaded ? <Check size={13} /> : <ImageIcon size={13} className="text-amber-400" />}
                  <span>{isPngDownloaded ? 'Baixado!' : 'PNG Transp.'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé de Dica Rápida */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Dica para Stories, Reels e Canva:</strong> Use o formato <strong>Vetor .SVG</strong> no Canva/Illustrator ou o <strong>PNG Transparente</strong> direto na galeria do celular para colar como figurinha sobre suas fotos e vídeos!
          </span>
        </span>
      </div>

    </div>
  );
};

export default BrandMediaKitSection;
