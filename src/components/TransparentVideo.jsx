import React, { useRef, useEffect, useState } from 'react';

/**
 * TransparentVideo - Reprodução de vídeo com:
 * 1. Remoção inteligente de fundo branco por inundação de borda (Flood-Fill):
 *    Remove APENAS o fundo externo que toca as bordas, PRESERVANDO o branco das letras e do mascote!
 * 2. Remoção da vinheta final do CapCut (corta os últimos segundos onde aparece o logo CapCut).
 * 3. Remoção de marca d'água de cantos (mascaramento nos cantos superiores/inferiores).
 */
export const TransparentVideo = ({
  src,
  className = '',
  removeWhite = true,
  preserveWhiteContent = true, // Flood-fill preservador de letras e mascote
  threshold = 215,             // Sensibilidade para detectar fundo branco (0 a 255)
  feather = 25,                // Suavização das bordas (anti-aliasing)
  trimOutro = true,            // Cortar vinheta final do CapCut
  trimOutroSeconds = 2.8,      // Duração da vinheta final / corte do loop (em segundos)
  maskWatermark = true,        // Mascarar marcas d'água de canto (CapCut)
  onLoaded,
  alt = 'Vídeo'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Buffers reutilizáveis para evitar alocação de memória a cada frame (60fps suave)
  const memoryRef = useRef({
    visited: null,
    queue: null,
    visitId: 0,
    lastWidth: 0,
    lastHeight: 0
  });

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
        // 1. CORTE DA VINHETA / MARCA D'ÁGUA FINAL DO CAPCUT
        if (trimOutro && video.duration && video.duration > trimOutroSeconds + 0.8) {
          const cutPoint = video.duration - trimOutroSeconds;
          if (video.currentTime >= cutPoint) {
            video.currentTime = 0;
          }
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          const totalPixels = w * h;

          // Desenha o frame atual
          ctx.drawImage(video, 0, 0, w, h);

          // 2. PROCESSAMENTO DE REMOÇÃO DE FUNDO
          if (removeWhite) {
            const frame = ctx.getImageData(0, 0, w, h);
            const data = frame.data;

            if (preserveWhiteContent) {
              // =========================================================================
              // ALGORITMO INTELIGENTE: FLOOD-FILL PELAS BORDAS
              // Inunda apenas o fundo branco que toca as bordas do vídeo.
              // Como as letras e o mascote têm contorno preto, o preenchimento NUNCA
              // invade o interior das letras ou do boneco, mantendo-os 100% brancos!
              // =========================================================================
              const mem = memoryRef.current;
              if (!mem.visited || mem.lastWidth !== w || mem.lastHeight !== h) {
                mem.visited = new Int32Array(totalPixels);
                mem.queue = new Int32Array(totalPixels);
                mem.lastWidth = w;
                mem.lastHeight = h;
                mem.visitId = 1;
              } else {
                mem.visitId++;
                // Se o contador estourar o limite de 32 bits, reinicia
                if (mem.visitId > 2000000000) {
                  mem.visited.fill(0);
                  mem.visitId = 1;
                }
              }

              const visited = mem.visited;
              const queue = mem.queue;
              const visitId = mem.visitId;
              let head = 0;
              let tail = 0;

              // Enfileira todos os pixels das 4 bordas externas
              // Borda superior e inferior
              for (let x = 0; x < w; x++) {
                const topIdx = x;
                const botIdx = (h - 1) * w + x;
                if (visited[topIdx] !== visitId) {
                  visited[topIdx] = visitId;
                  queue[tail++] = topIdx;
                }
                if (visited[botIdx] !== visitId) {
                  visited[botIdx] = visitId;
                  queue[tail++] = botIdx;
                }
              }
              // Borda esquerda e direita
              for (let y = 0; y < h; y++) {
                const leftIdx = y * w;
                const rightIdx = y * w + w - 1;
                if (visited[leftIdx] !== visitId) {
                  visited[leftIdx] = visitId;
                  queue[tail++] = leftIdx;
                }
                if (visited[rightIdx] !== visitId) {
                  visited[rightIdx] = visitId;
                  queue[tail++] = rightIdx;
                }
              }

              // Limiares de cor para fundo claro
              const lowThreshold = threshold - feather;
              const highThreshold = threshold + 10;

              // Executa BFS Flood-Fill
              while (head < tail) {
                const p = queue[head++];
                const px = p % w;
                const py = (p / w) | 0;
                const p4 = p * 4;

                const r = data[p4];
                const g = data[p4 + 1];
                const b = data[p4 + 2];
                const minVal = Math.min(r, g, b);
                const maxVal = Math.max(r, g, b);
                const isNeutral = (maxVal - minVal) < 45;

                // Se o pixel for fundo branco/quase branco
                if (minVal > lowThreshold && isNeutral) {
                  if (minVal >= highThreshold) {
                    data[p4 + 3] = 0; // 100% transparente
                  } else {
                    // Transição suave nas bordas externas
                    const factor = (highThreshold - minVal) / (highThreshold - lowThreshold);
                    data[p4 + 3] = Math.round(data[p4 + 3] * factor);
                  }

                  // Propaga para os 4 vizinhos (apenas se for fundo)
                  if (px > 0) {
                    const n = p - 1;
                    if (visited[n] !== visitId) {
                      visited[n] = visitId;
                      queue[tail++] = n;
                    }
                  }
                  if (px < w - 1) {
                    const n = p + 1;
                    if (visited[n] !== visitId) {
                      visited[n] = visitId;
                      queue[tail++] = n;
                    }
                  }
                  if (py > 0) {
                    const n = p - w;
                    if (visited[n] !== visitId) {
                      visited[n] = visitId;
                      queue[tail++] = n;
                    }
                  }
                  if (py < h - 1) {
                    const n = p + w;
                    if (visited[n] !== visitId) {
                      visited[n] = visitId;
                      queue[tail++] = n;
                    }
                  }
                }
              }

              // 3. REMOÇÃO DE MARCA D'ÁGUA EM CANTOS RESIDUAIS (CapCut)
              if (maskWatermark) {
                // Canto Superior Direito (onde CapCut às vezes insere logo flutuante)
                const cornerW = Math.round(w * 0.22);
                const cornerH = Math.round(h * 0.16);
                for (let y = 0; y < cornerH; y++) {
                  for (let x = w - cornerW; x < w; x++) {
                    const idx4 = (y * w + x) * 4;
                    data[idx4 + 3] = 0;
                  }
                }
                // Canto Inferior Direito (onde CapCut às vezes insere texto flutuante)
                for (let y = h - cornerH; y < h; y++) {
                  for (let x = w - cornerW; x < w; x++) {
                    const idx4 = (y * w + x) * 4;
                    data[idx4 + 3] = 0;
                  }
                }
              }

              // 4. REMOÇÃO DE LINHA / BARRA BRANCA NA PARTE INFERIOR (ARTEFATO DE VÍDEO / CAPCUT)
              // Limpa os pixels da base para garantir que nenhuma linha de progresso ou borda branca permaneça
              const bottomCleanH = Math.min(14, Math.max(6, Math.round(h * 0.04)));
              for (let y = h - bottomCleanH; y < h; y++) {
                const rowStart = y * w * 4;
                for (let x = 0; x < w; x++) {
                  data[rowStart + x * 4 + 3] = 0;
                }
              }

              // Limpa também uma margem sutil de 2px no topo e laterais contra artefatos de corte
              for (let y = 0; y < 2; y++) {
                const rowStart = y * w * 4;
                for (let x = 0; x < w; x++) {
                  data[rowStart + x * 4 + 3] = 0;
                }
              }
              for (let y = 0; y < h; y++) {
                const rowStart = y * w * 4;
                data[rowStart + 3] = 0;
                data[rowStart + 4 + 3] = 0;
                data[rowStart + (w - 1) * 4 + 3] = 0;
                data[rowStart + (w - 2) * 4 + 3] = 0;
              }

            } else {
              // Modo simples (threshold global)
              for (let i = 0; i < data.length; i += 4) {
                const minVal = Math.min(data[i], data[i + 1], data[i + 2]);
                if (minVal > threshold) data[i + 3] = 0;
              }
            }

            ctx.putImageData(frame, 0, 0);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src, removeWhite, preserveWhiteContent, threshold, feather, trimOutro, trimOutroSeconds, maskWatermark, onLoaded]);

  return (
    <div className="relative inline-block w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[580px]">
      {/* Vídeo de origem oculto */}
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

      {/* Canvas com transparência e preservação perfeita de letras e mascote */}
      <canvas
        ref={canvasRef}
        className={className}
        aria-label={alt}
      />
    </div>
  );
};
