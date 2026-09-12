import React, { useRef, useEffect, useState } from 'react';

/**
 * TransparentVideo - Componente de reprodução de vídeo com remoção de fundo branco (Chroma Key em tempo real)
 * Renderiza via HTML5 Canvas a 60fps, tornando o fundo branco 100% transparente com suavização de bordas.
 */
export const TransparentVideo = ({
  src,
  className = '',
  removeWhite = true,
  threshold = 215, // Nível a partir do qual considera branco (0 a 255)
  feather = 25,    // Suavização das bordas para evitar serrilhado
  onLoaded,
  alt = 'Vídeo'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId = null;

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setIsReady(true);
        if (onLoaded) onLoaded();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const render = () => {
      if (video.readyState >= 2 && canvas.width && canvas.height) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // 1. Desenha o frame do vídeo no canvas
          ctx.drawImage(video, 0, 0, w, h);

          // 2. Se a remoção de branco estiver ativa, processa os pixels
          if (removeWhite) {
            const frame = ctx.getImageData(0, 0, w, h);
            const data = frame.data;
            const len = data.length;

            const highThreshold = Math.min(255, threshold + feather);
            const lowThreshold = threshold;

            for (let i = 0; i < len; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Brilho mínimo entre os 3 canais (R, G, B)
              const minVal = Math.min(r, g, b);

              // Diferença máxima entre canais (garante que não apague cores saturadas claras)
              const maxVal = Math.max(r, g, b);
              const isNeutral = (maxVal - minVal) < 40;

              if (minVal > lowThreshold && isNeutral) {
                if (minVal >= highThreshold) {
                  // Branco puro -> 100% transparente
                  data[i + 3] = 0;
                } else {
                  // Zona de transição suave (anti-aliasing)
                  const factor = (highThreshold - minVal) / (highThreshold - lowThreshold);
                  data[i + 3] = Math.round(data[i + 3] * factor);
                }
              }
            }

            ctx.putImageData(frame, 0, 0);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    video.play().catch(() => {
      // Autoplay com som mudo pode precisar de interação se o navegador bloquear,
      // mas como está muted: true, é permitido nativamente.
    });

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src, removeWhite, threshold, feather, onLoaded]);

  return (
    <div className="relative inline-block w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[580px]">
      {/* Vídeo oculto que alimenta o canvas */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />

      {/* Canvas visível com o frame transparente processado */}
      <canvas
        ref={canvasRef}
        className={className}
        aria-label={alt}
      />
    </div>
  );
};
