import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Check, 
  X, 
  Maximize2, 
  Minimize2,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export const ImageFramingModal = ({
  isOpen,
  imageSrc,
  targetType = 'logo', // 'logo' | 'banner'
  onClose,
  onConfirm
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState(targetType === 'logo' ? '#FFFFFF' : '#12121A');
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const isLogo = targetType === 'logo';
  
  // Dimensões do viewport de pré-visualização no modal
  const viewWidth = isLogo ? 280 : 420;
  const viewHeight = isLogo ? 280 : 236;

  // Carregar dimensões naturais da imagem ao abrir e detectar cor de fundo
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const natW = img.naturalWidth || (targetType === 'logo' ? 300 : 800);
      const natH = img.naturalHeight || (targetType === 'logo' ? 300 : 450);
      setNaturalSize({ width: natW, height: natH });

      const bScale = Math.min(viewWidth / natW, viewHeight / natH);

      if (targetType === 'banner') {
        // Para banner: preencher o frame 16:9 por padrão para evitar faixas pretas
        const fillScale = Math.max(viewWidth / natW, viewHeight / natH);
        const autoZoom = Math.max(1, Number((fillScale / bScale).toFixed(2)));
        setZoom(autoZoom);
        setBgColor('#12121A');
      } else {
        // Para logo: detectar cor de fundo dos cantos para eliminar bordas brancas indesejadas
        try {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 16;
          testCanvas.height = 16;
          const tCtx = testCanvas.getContext('2d');
          if (tCtx) {
            tCtx.drawImage(img, 0, 0, 16, 16);
            const p1 = tCtx.getImageData(0, 0, 1, 1).data;
            const p2 = tCtx.getImageData(15, 0, 1, 1).data;
            const p3 = tCtx.getImageData(0, 15, 1, 1).data;
            const p4 = tCtx.getImageData(15, 15, 1, 1).data;

            const isAlpha = p1[3] < 30 || p2[3] < 30 || p3[3] < 30 || p4[3] < 30;
            if (isAlpha) {
              setBgColor('transparent');
            } else {
              const avgR = (p1[0] + p2[0] + p3[0] + p4[0]) / 4;
              const avgG = (p1[1] + p2[1] + p3[1] + p4[1]) / 4;
              const avgB = (p1[2] + p2[2] + p3[2] + p4[2]) / 4;
              const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
              if (brightness < 60) {
                setBgColor('#000000');
              } else if (brightness > 220) {
                setBgColor('#FFFFFF');
              } else {
                setBgColor('#12121A');
              }
            }
          } else {
            setBgColor('#12121A');
          }
        } catch {
          setBgColor('#12121A');
        }

        // Sugere zoom proporcional de preenchimento ou enquadramento
        const fillScale = Math.max(viewWidth / natW, viewHeight / natH);
        const ratioDiff = fillScale / bScale;
        if (ratioDiff < 1.35) {
          // Se a imagem for quase quadrada, já inicia preenchendo o badge perfeitamente
          setZoom(Number(ratioDiff.toFixed(2)));
        } else {
          setZoom(1);
        }
      }
      setPosition({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, targetType]);

  if (!isOpen || !imageSrc) return null;

  // Calcular fator de escala base para caber no viewport
  const baseScale = naturalSize.width > 0 && naturalSize.height > 0
    ? Math.min(viewWidth / naturalSize.width, viewHeight / naturalSize.height)
    : 1;

  const renderedWidth = naturalSize.width * baseScale * zoom;
  const renderedHeight = naturalSize.height * baseScale * zoom;

  // Handlers de Arrastar / Panning com PointerEvents
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Zoom via roda do mouse
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(4, Math.max(0.5, Number((prev + delta).toFixed(2)))));
  };

  // Ajustes rápidos de enquadramento
  const handleResetCenter = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleFitEntireImage = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleFillContainer = () => {
    if (naturalSize.width > 0 && naturalSize.height > 0) {
      const fillScale = Math.max(viewWidth / naturalSize.width, viewHeight / naturalSize.height);
      const targetZoom = Number((fillScale / baseScale).toFixed(2));
      setZoom(Math.max(1, targetZoom));
      setPosition({ x: 0, y: 0 });
    }
  };

  // Renderizar e exportar imagem em alta resolução no Canvas
  const handleApply = () => {
    const exportWidth = isLogo ? 240 : 540;
    const exportHeight = isLogo ? 240 : 280;

    const ratio = exportWidth / viewWidth;

    const canvas = document.createElement('canvas');
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onConfirm(imageSrc);
      onClose();
      return;
    }

    // 1. Desenhar cor de fundo escolhida
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, exportWidth, exportHeight);
    }

    // 2. Desenhar a imagem na escala e posição relativas
    const drawW = renderedWidth * ratio;
    const drawH = renderedHeight * ratio;
    const drawX = (exportWidth / 2) + (position.x * ratio) - (drawW / 2);
    const drawY = (exportHeight / 2) + (position.y * ratio) - (drawH / 2);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const saveAndClose = (imgEl) => {
      try {
        ctx.drawImage(imgEl, drawX, drawY, drawW, drawH);
        const format = (isLogo && bgColor === 'transparent') ? 'image/png' : 'image/jpeg';
        const quality = isLogo ? 0.82 : 0.7;
        const resultDataUrl = canvas.toDataURL(format, quality);
        onConfirm(resultDataUrl);
      } catch (err) {
        console.error('Erro ao renderizar imagem no canvas:', err);
        onConfirm(imageSrc);
      }
      onClose();
    };

    if (imgRef.current && imgRef.current.complete) {
      saveAndClose(imgRef.current);
    } else {
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = 'anonymous';
      fallbackImg.onload = () => saveAndClose(fallbackImg);
      fallbackImg.onerror = () => {
        onConfirm(imageSrc);
        onClose();
      };
      fallbackImg.src = imageSrc;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#161622] border-2 border-[#FF5F00]/50 rounded-3xl p-6 sm:p-7 text-center shadow-2xl shadow-orange-950/70 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="text-left">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#FF5F00]/20 text-[#FF5F00]">
                <ImageIcon size={18} />
              </span>
              <span>{isLogo ? 'Ajustar Enquadramento da Logo' : 'Ajustar Enquadramento da Capa'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isLogo 
                ? 'Arraste e dê zoom para posicionar a marca perfeitamente no badge.' 
                : 'Arraste e aumente o zoom para o corte ideal do banner no card.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Viewport Interativo de Enquadramento */}
        <div className="flex flex-col items-center justify-center py-1">
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            style={{ 
              width: viewWidth, 
              height: viewHeight,
              backgroundColor: bgColor === 'transparent' ? '#0A0A10' : bgColor 
            }}
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-[#FF5F00]/70 select-none shadow-2xl touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Imagem Sendo Enquadrada */}
            <div 
              className="absolute left-1/2 top-1/2 will-change-transform pointer-events-none"
              style={{
                width: renderedWidth,
                height: renderedHeight,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
              }}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Enquadramento"
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Linhas Guias e Máscara Visual */}
            <div className="absolute inset-0 border border-white/20 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 pointer-events-none" />

            {/* Preview de badges reais na capa para o usuário saber exatamente onde cai */}
            {!isLogo && (
              <>
                <div className="absolute top-2 left-2 bg-[#FF5F00] text-white px-2 py-0.5 rounded-md text-[10px] font-black shadow pointer-events-none">
                  50% OFF
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 pointer-events-none bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="w-4 h-4 rounded bg-white flex items-center justify-center text-[10px]">🏪</span>
                  <span className="text-[10px] text-white font-bold">Nome da Loja</span>
                </div>
              </>
            )}

            {/* Dica flutuante no topo do viewport */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1">
              <Move size={10} />
              <span>Arraste para mover</span>
            </div>
          </div>

          {/* Prévia do Resultado Real no Card */}
          {isLogo && (
            <div className="flex items-center justify-center gap-3 bg-[#101018] border border-white/10 rounded-xl px-4 py-2 mt-2 w-fit mx-auto shadow-md">
              <span className="text-[11px] text-gray-400 font-bold">Prévia no Card:</span>
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-[#12121A] flex items-center justify-center relative">
                <div 
                  className="w-full h-full relative overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor }}
                >
                  <img
                    src={imageSrc}
                    alt="Preview"
                    style={{
                      width: `${(renderedWidth / viewWidth) * 32}px`,
                      height: `${(renderedHeight / viewHeight) * 32}px`,
                      maxWidth: 'none',
                      maxHeight: 'none',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${(position.x / viewWidth) * 32}px), calc(-50% + ${(position.y / viewHeight) * 32}px))`
                    }}
                    draggable={false}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-white">Marca</span>
            </div>
          )}
        </div>

        {/* Controles de Zoom */}
        <div className="bg-[#101018] border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5">
              <ZoomIn size={14} className="text-[#FF5F00]" />
              <span>Nível de Zoom</span>
            </span>
            <span className="text-amber-400 font-mono text-sm">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(0.5, Number((prev - 0.15).toFixed(2))))}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Reduzir zoom"
            >
              <ZoomOut size={15} />
            </button>

            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-grow accent-[#FF5F00] cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(3.5, Number((prev + 0.15).toFixed(2))))}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Aumentar zoom"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Botões Rápidos de Alinhamento */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-[11px]">
            <button
              type="button"
              onClick={handleResetCenter}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Centralizar</span>
            </button>

            <button
              type="button"
              onClick={handleFitEntireImage}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Minimize2 size={12} />
              <span>Caber Tudo</span>
            </button>

            <button
              type="button"
              onClick={handleFillContainer}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Maximize2 size={12} />
              <span>Preencher</span>
            </button>
          </div>
        </div>

        {/* Escolha da Cor de Fundo */}
        <div className="flex items-center justify-between text-xs text-gray-300 bg-[#101018] border border-white/10 rounded-2xl px-4 py-2.5">
          <span className="font-bold text-[11px] text-gray-400">Cor de Fundo:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBgColor('#FFFFFF')}
              className={`w-6 h-6 rounded-full bg-white border-2 transition-transform cursor-pointer ${
                bgColor === '#FFFFFF' ? 'border-[#FF5F00] scale-110 shadow-md shadow-orange-500/50' : 'border-gray-400'
              }`}
              title="Fundo Branco"
            />
            <button
              type="button"
              onClick={() => setBgColor('#12121A')}
              className={`w-6 h-6 rounded-full bg-[#12121A] border-2 transition-transform cursor-pointer ${
                bgColor === '#12121A' ? 'border-[#FF5F00] scale-110 shadow-md shadow-orange-500/50' : 'border-gray-600'
              }`}
              title="Fundo Escuro do Site"
            />
            <button
              type="button"
              onClick={() => setBgColor('#000000')}
              className={`w-6 h-6 rounded-full bg-black border-2 transition-transform cursor-pointer ${
                bgColor === '#000000' ? 'border-[#FF5F00] scale-110 shadow-md shadow-orange-500/50' : 'border-gray-700'
              }`}
              title="Fundo Preto Total"
            />
            <button
              type="button"
              onClick={() => setBgColor('transparent')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                bgColor === 'transparent' ? 'bg-[#FF5F00]/20 text-[#FF5F00] border-[#FF5F00]' : 'bg-white/5 text-gray-400 border-white/10'
              }`}
              title="Sem fundo / Transparente"
            >
              Transparente
            </button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-gradient-to-r from-[#FF5F00] via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-3 rounded-xl text-sm shadow-xl shadow-orange-600/30 flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer"
          >
            <Check size={16} />
            <span>Aplicar Enquadramento</span>
          </button>
        </div>

      </div>
    </div>
  );
};
