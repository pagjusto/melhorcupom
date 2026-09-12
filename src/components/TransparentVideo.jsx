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
  threshold = 200,             // Sensibilidade para detectar fundo branco (0 a 255)
  feather = 35,                // Suavização das bordas (anti-aliasing)
  trimOutro = true,            // Cortar vinheta final do CapCut
  trimOutroSeconds = 1.8,      // Duração da vinheta final do CapCut (em segundos)
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

              // Sementes na bolsa fechada entre a letra 'r' e o mascote
              const notchMinX = (w * 0.60) | 0;
              const notchMaxX = (w * 0.66) | 0;
              const notchMinY = (h * 0.25) | 0;
              const notchMaxY = (h * 0.36) | 0;

              for (let ny = notchMinY; ny <= notchMaxY; ny++) {
                const rowStart = ny * w;
                for (let nx = notchMinX; nx <= notchMaxX; nx++) {
                  const nIdx = rowStart + nx;
                  if (visited[nIdx] !== visitId) {
                    const np4 = nIdx * 4;
                    const nr = data[np4];
                    const ng = data[np4 + 1];
                    const nb = data[np4 + 2];
                    const nMin = Math.min(nr, ng, nb);
                    const nMax = Math.max(nr, ng, nb);
                    // Se for branco neutro
                    if (nMin > 160 && (nMax - nMin) < 45) {
                      // Verifica se à direita há o mascote laranja (dentro de até 30px)
                      let hasOrangeRight = false;
                      const maxScan = Math.min(w - 1, nx + 30);
                      for (let sx = nx + 1; sx <= maxScan; sx++) {
                        const sp4 = (rowStart + sx) * 4;
                        if (data[sp4] > 170 && data[sp4 + 1] > 110 && data[sp4 + 2] < 65) {
                          hasOrangeRight = true;
                          break;
                        }
                      }
                      if (hasOrangeRight) {
                        visited[nIdx] = visitId;
                        queue[tail++] = nIdx;
                      }
                    }
                  }
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

              // Limpeza de pequenas bolsas residuais de fundo presas entre os dedos e a mão segurando dinheiro
              // Região da mão/dinheiro: x entre 75% e 92% da largura, y entre 20% e 45% da altura
              const handMinX = (w * 0.75) | 0;
              const handMaxX = (w * 0.92) | 0;
              const handMinY = (h * 0.20) | 0;
              const handMaxY = (h * 0.45) | 0;
              const handVisited = new Uint8Array(w * h);

              for (let hy = handMinY; hy <= handMaxY; hy++) {
                const hRow = hy * w;
                for (let hx = handMinX; hx <= handMaxX; hx++) {
                  const hIdx = hRow + hx;
                  if (handVisited[hIdx]) continue;
                  const hp4 = hIdx * 4;
                  if (data[hp4 + 3] === 0) continue; // já é transparente

                  const hr = data[hp4];
                  const hg = data[hp4 + 1];
                  const hb = data[hp4 + 2];
                  const hMin = Math.min(hr, hg, hb);
                  const hMax = Math.max(hr, hg, hb);

                  // Se for pixel branco / claro neutro ainda opaco
                  if (hMin > 165 && (hMax - hMin) < 45) {
                    // Explora o componente conectado para medir o tamanho
                    const island = [hIdx];
                    handVisited[hIdx] = 1;
                    let headI = 0;
                    while (headI < island.length) {
                      const cur = island[headI++];
                      const cx = cur % w;
                      const cy = (cur / w) | 0;

                      const nbs = [cur - 1, cur + 1, cur - w, cur + w];
                      for (let i = 0; i < 4; i++) {
                        const nb = nbs[i];
                        if (nb >= 0 && nb < totalPixels && !handVisited[nb]) {
                          const nbp4 = nb * 4;
                          if (data[nbp4 + 3] > 0) {
                            const nbr = data[nbp4];
                            const nbg = data[nbp4 + 1];
                            const nbb = data[nbp4 + 2];
                            const nbMin = Math.min(nbr, nbg, nbb);
                            const nbMax = Math.max(nbr, nbg, nbb);
                            if (nbMin > 165 && (nbMax - nbMin) < 45) {
                              handVisited[nb] = 1;
                              island.push(nb);
                            }
                          }
                        }
                      }
                    }

                    // Se a ilha for pequena (<= 25 pixels), é um vão/detalhe de fundo preso entre os dedos!
                    // Os dedos reais têm 60-115+ pixels, e a palma tem 250+ pixels.
                    if (island.length <= 25) {
                      for (let i = 0; i < island.length; i++) {
                        data[island[i] * 4 + 3] = 0;
                      }
                    }
                  }
                }
              }

              // 3. REMOÇÃO DE MARCA D'ÁGUA EM CANTOS RESIDUAIS (CapCut)
              if (maskWatermark) {
                // Apenas canto extremo (longe do leque de dinheiro para não piscar)
                const cornerW = Math.round(w * 0.08);
                const cornerH = Math.round(h * 0.06);
                for (let y = 0; y < cornerH; y++) {
                  for (let x = w - cornerW; x < w; x++) {
                    const idx4 = (y * w + x) * 4;
                    data[idx4 + 3] = 0;
                  }
                }
                // Canto Inferior Direito
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
