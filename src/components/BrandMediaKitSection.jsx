import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  Check, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Instagram,
  Copy
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
  const [downloadingAll, setDownloadingAll] = useState(false);

  const markDownloaded = (key) => {
    setDownloadedKey(key);
    setTimeout(() => setDownloadedKey(null), 2500);
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
