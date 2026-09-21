import React, { useRef, useEffect, useState } from 'react';

/**
 * TransparentVideo - Reprodução de vídeo com:
 * 1. Remoção inteligente de fundo verde (Chroma Key) e/ou branco por inundação de borda (BFS Flood-Fill):
 *    Remove o fundo externo e tarjas de letterbox, PRESERVANDO o branco das letras, do mascote e o verde das notas de dinheiro!
 * 2. Transição Ultra-Suave de Looping com Snapshot Crossfade à Prova de Travamentos:
 *    - Auto-recuperação contínua (NUNCA congela ou para de se mexer).
 *    - 'crossfade': Dissolvência suave de alta precisão entre o fim e o início do ciclo.
 *    - 'fade': Desvanecimento orgânico (fade-out e fade-in suave).
 *    - 'cut': Corte instantâneo direto.
 * 3. Suporte a valores abaixo de 0 (negativos):
 *    - Valores negativos cortam o início do vídeo (startOffset), permitindo pular aberturas estáticas/intros.
 *    - Valores positivos definem o tempo da dissolvência.
 * 4. Corte da vinheta final do CapCut configurável.
 * 5. Remoção de marca d'água de cantos e barra inferior.
 */
export const TransparentVideo = ({
  src,
  className = '',
  containerClassName = '',
  trimIntroSeconds = 2.1,      // Cortar os primeiros segundos do vídeo (salvo como padrão: 2.1s)
  loopEndSeconds = 4.1,        // Ponto final do looping em segundos (salvo como padrão: 4.1s)
  removeGreen = true,          // Remoção de fundo verde Chroma Key (padrão)
  removeWhite = false,         // Remoção de fundo branco (para compatibilidade)
  preserveWhiteContent = true, // Flood-fill preservador de letras e mascote
  threshold = 215,             // Sensibilidade para detectar fundo branco (0 a 255)
  feather = 25,                // Suavização das bordas (anti-aliasing)
  trimOutro = false,           // Cortar vinheta final do CapCut (desativado por padrão no loop de 32s)
  trimOutroSeconds = 0,        // Duração da vinheta final / corte do loop (em segundos)
  transitionMode = 'crossfade', // 'crossfade' | 'fade' | 'cut'
  transitionDuration = 0.5,     // Duração da transição em segundos (permite abaixo de 0)
  maskWatermark = true,        // Mascarar marcas d'água de canto (CapCut)
  onLoaded,
  alt = 'Vídeo'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Controle de transição de loop
  const isLoopingRef = useRef(false);
  const loopStartTimeRef = useRef(0);

  // Buffers reutilizáveis para 60fps constantes sem alocação de memória (zero GC lag)
  const memoryRef = useRef({
    visited: null,
    queue: null,
    visitId: 0,
    lastWidth: 0,
    lastHeight: 0,
    snapshot: null,
    alphas: null
  });

  // Ponto de início do vídeo (corta os primeiros segundos especificados)
  const getStartPoint = () => {
    const explicitIntro = typeof trimIntroSeconds === 'number' ? trimIntroSeconds : 0;
    const durationOffset = transitionDuration < 0 ? Math.abs(transitionDuration) : 0;
    return Math.max(explicitIntro, durationOffset);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId = null;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const seekToStartIfBefore = () => {
      const startPoint = getStartPoint();
      if (startPoint > 0 && video.currentTime < startPoint) {
        try {
          video.currentTime = startPoint;
        } catch (e) {}
      }
    };

    const handleLoadedMetadata = () => {
      seekToStartIfBefore();
      if (video.videoWidth && video.videoHeight) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }

        const mem = memoryRef.current;
        if (!mem.snapshot) {
          mem.snapshot = document.createElement('canvas');
        }
        mem.snapshot.width = w;
        mem.snapshot.height = h;

        setIsReady(true);
        if (onLoaded) onLoaded();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    video.addEventListener('play', seekToStartIfBefore);

    if (video.videoWidth && video.videoHeight) {
      handleLoadedMetadata();
    }

    // Inicia carregamento e reprodução já posicionando após os primeiros segundos
    video.load();
    seekToStartIfBefore();
    video.play().catch(() => {});

    /**
     * Processa um frame de vídeo removendo o fundo verde (Chroma Key) e/ou branco e limpando resíduos
     */
    const processVideoFrame = (vid, targetCtx, w, h) => {
      if (!vid || vid.readyState < 2) return false;

      // 1. Desenha o frame bruto
      targetCtx.drawImage(vid, 0, 0, w, h);

      if (!removeWhite && !removeGreen) return true;

      const frame = targetCtx.getImageData(0, 0, w, h);
      const data = frame.data;
      const total = w * h;

      // =========================================================================
      // 1. PROCESSAMENTO DE CHROMA KEY VERDE (REMOVE FUNDO E BURACOS INTERNOS)
      // Remove tanto o fundo externo quanto o verde entre o braço e a cabeça do boneco!
      // Preserva 100% as notas de dinheiro, letras brancas e o mascote.
      // =========================================================================
      if (removeGreen) {
        // Pass 1: Identificação precisa de chroma verde e despill inteligente
        for (let i = 0; i < total; i++) {
          const i4 = i * 4;
          const r = data[i4];
          const g = data[i4 + 1];
          const b = data[i4 + 2];
          const maxRB = Math.max(r, b);
          const diff = g - maxRB;
          const px = i % w;
          const py = (i / w) | 0;

          // Barras pretas externas (Letterbox superior/inferior e Pillarbox laterais):
          const isOuterBoundary = (px < 16 || px > w - 16 || py < 25 || py > h - 25);
          const isBlackBar = isOuterBoundary && (r < 45 && g < 45 && b < 45);

          if (isBlackBar) {
            data[i4 + 3] = 0;
            continue;
          }

          // Notas de Dólar (preservação do papel-moeda verde-oliva com pigmentos r e b):
          const isDollarBill = (px > 740 && py < 400) &&
                               (r >= 65 && b >= 42 && diff < 60 && g < 245);

          if (isDollarBill) {
            continue;
          }

          // Fundo verde Chroma Key (fundo externo E buraco entre braço e cabeça):
          if ((g > 140 && diff > 30) || (g > 95 && diff > 45)) {
            data[i4 + 3] = 0; // 100% transparente
          } else if (diff > 8 && g > 35) {
            // Borda verde de transição: elimina o serrilhado verde no contorno do rosto, mão e notas
            const factor = Math.max(0, 1 - (diff - 8) / 22);
            data[i4 + 3] = Math.round(data[i4 + 3] * factor);
            data[i4 + 1] = maxRB; // Despill total
          } else if (diff > 2 && g > 20) {
            // Despill sutil em contornos pretos e sombras
            data[i4 + 1] = maxRB;
          }
        }

        // Pass 2: Defringe / Suavização da borda externa (elimina o serrilhado branco/cinza e verde residual)
        const mem = memoryRef.current;
        if (!mem.alphas || mem.alphas.length !== total) {
          mem.alphas = new Uint8Array(total);
        }
        const alphas = mem.alphas;
        for (let i = 0; i < total; i++) alphas[i] = data[i * 4 + 3];

        for (let y = 1; y < h - 1; y++) {
          const rowStart = y * w;
          for (let x = 1; x < w - 1; x++) {
            const idx = rowStart + x;
            const a = alphas[idx];
            if (a > 10) {
              // Verifica se o pixel faz fronteira com o fundo transparente
              const hasTranspNeighbor =
                alphas[idx - 1] === 0 || alphas[idx + 1] === 0 ||
                alphas[idx - w] === 0 || alphas[idx + w] === 0 ||
                alphas[idx - w - 1] === 0 || alphas[idx - w + 1] === 0 ||
                alphas[idx + w - 1] === 0 || alphas[idx + w + 1] === 0;

              if (hasTranspNeighbor) {
                const i4 = idx * 4;
                const r = data[i4];
                const g = data[i4 + 1];
                const b = data[i4 + 2];

                // Elimina qualquer tom verde residual na borda externa (no rosto, mão e dólares)
                if (g > r || g > b) {
                  data[i4 + 1] = Math.max(r, b);
                }

                const lum = 0.299 * r + 0.587 * data[i4 + 1] + 0.114 * b;
                const isMascotYellow = (r > 190 && g > 140 && b < 100 && r > g * 1.1);

                if (!isMascotYellow) {
                  // Se for um pixel claro/cinza na borda externa (o serrilhado residual do contorno preto):
                  if (lum > 70) {
                    const fade = Math.max(0, Math.min(1, (130 - lum) / 60));
                    data[i4] = Math.round(r * 0.25);
                    data[i4 + 1] = Math.round(data[i4 + 1] * 0.25);
                    data[i4 + 2] = Math.round(b * 0.25);
                    data[i4 + 3] = Math.round(a * (0.35 + 0.65 * fade));
                  }
                }
              }
            }
          }
        }
      }

      // =========================================================================
      // 2. PROCESSAMENTO DE FUNDO BRANCO (SE ATIVO) VIA BFS FLOOD-FILL
      // =========================================================================
      if (removeWhite) {
        if (preserveWhiteContent) {
          const mem = memoryRef.current;
          if (!mem.visited || mem.lastWidth !== w || mem.lastHeight !== h) {
            mem.visited = new Int32Array(total);
            mem.queue = new Int32Array(total);
            mem.lastWidth = w;
            mem.lastHeight = h;
            mem.visitId = 1;
          } else {
            mem.visitId++;
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

          const lowThreshold = threshold - feather;
          const highThreshold = threshold + 10;

          const isWhiteBg = (p4) => {
            const r = data[p4];
            const g = data[p4 + 1];
            const b = data[p4 + 2];
            const minVal = Math.min(r, g, b);
            const maxVal = Math.max(r, g, b);
            return minVal > lowThreshold && (maxVal - minVal) < 45;
          };

          for (let x = 0; x < w; x++) {
            const topIdx = x;
            const botIdx = (h - 1) * w + x;
            if (visited[topIdx] !== visitId) {
              visited[topIdx] = visitId;
              if (isWhiteBg(topIdx * 4)) queue[tail++] = topIdx;
            }
            if (visited[botIdx] !== visitId) {
              visited[botIdx] = visitId;
              if (isWhiteBg(botIdx * 4)) queue[tail++] = botIdx;
            }
          }
          for (let y = 0; y < h; y++) {
            const leftIdx = y * w;
            const rightIdx = y * w + w - 1;
            if (visited[leftIdx] !== visitId) {
              visited[leftIdx] = visitId;
              if (isWhiteBg(leftIdx * 4)) queue[tail++] = leftIdx;
            }
            if (visited[rightIdx] !== visitId) {
              visited[rightIdx] = visitId;
              if (isWhiteBg(rightIdx * 4)) queue[tail++] = rightIdx;
            }
          }

          while (head < tail) {
            const p = queue[head++];
            const px = p % w;
            const py = (p / w) | 0;
            const p4 = p * 4;

            const minVal = Math.min(data[p4], data[p4 + 1], data[p4 + 2]);
            if (minVal >= highThreshold) {
              data[p4 + 3] = 0;
            } else {
              const factor = (highThreshold - minVal) / (highThreshold - lowThreshold);
              data[p4 + 3] = Math.round(data[p4 + 3] * factor);
            }

            if (px > 0) {
              const n = p - 1;
              if (visited[n] !== visitId) {
                visited[n] = visitId;
                if (isWhiteBg(n * 4)) queue[tail++] = n;
              }
            }
            if (px < w - 1) {
              const n = p + 1;
              if (visited[n] !== visitId) {
                visited[n] = visitId;
                if (isWhiteBg(n * 4)) queue[tail++] = n;
              }
            }
            if (py > 0) {
              const n = p - w;
              if (visited[n] !== visitId) {
                visited[n] = visitId;
                if (isWhiteBg(n * 4)) queue[tail++] = n;
              }
            }
            if (py < h - 1) {
              const n = p + w;
              if (visited[n] !== visitId) {
                visited[n] = visitId;
                if (isWhiteBg(n * 4)) queue[tail++] = n;
              }
            }
          }
        } else {
          for (let i = 0; i < total; i++) {
            const i4 = i * 4;
            const minVal = Math.min(data[i4], data[i4 + 1], data[i4 + 2]);
            if (minVal > threshold) data[i4 + 3] = 0;
          }
        }
      }

      // =========================================================================
      // 3. REMOÇÃO DE MARCA D'ÁGUA CAPCUT NOS CANTOS
      // =========================================================================
      if (maskWatermark) {
        // Canto superior esquerdo (marca d'água "CapCut")
        const cw = Math.round(w * 0.22);
        const ch = Math.round(h * 0.12);
        for (let y = 0; y < ch; y++) {
          const rowStart = y * w * 4;
          for (let x = 0; x < cw; x++) {
            data[rowStart + x * 4 + 3] = 0;
          }
        }
        // Cantos superiores e inferiores direitos
        const cornerW = Math.round(w * 0.22);
        const cornerH = Math.round(h * 0.16);
        for (let y = 0; y < cornerH; y++) {
          const rowStart = y * w * 4;
          for (let x = w - cornerW; x < w; x++) {
            data[rowStart + x * 4 + 3] = 0;
          }
        }
        for (let y = h - cornerH; y < h; y++) {
          const rowStart = y * w * 4;
          for (let x = w - cornerW; x < w; x++) {
            data[rowStart + x * 4 + 3] = 0;
          }
        }
      }

      // =========================================================================
      // 4. LIMPEZA DE BORDAS EXTREMAS LATERAIS E VERTICAIS (12px)
      // Elimina 100% as linhas pretas verticais e horizontais nos cantos do vídeo
      // =========================================================================
      const edgeClean = 12;
      for (let y = 0; y < edgeClean; y++) {
        const rowStart = y * w * 4;
        for (let x = 0; x < w; x++) data[rowStart + x * 4 + 3] = 0;
      }
      for (let y = h - edgeClean; y < h; y++) {
        const rowStart = y * w * 4;
        for (let x = 0; x < w; x++) data[rowStart + x * 4 + 3] = 0;
      }
      for (let y = 0; y < h; y++) {
        const rowStart = y * w * 4;
        for (let x = 0; x < edgeClean; x++) {
          data[rowStart + x * 4 + 3] = 0;
          data[rowStart + (w - 1 - x) * 4 + 3] = 0;
        }
      }

      targetCtx.putImageData(frame, 0, 0);
      return true;
    };

    /**
     * Loop de renderização contínuo e à prova de travamentos
     */
    const render = () => {
      const video = videoRef.current;
      const cvs = canvasRef.current;

      if (!video || !cvs || !cvs.width || !cvs.height) {
        animId = requestAnimationFrame(render);
        return;
      }

      // 🛡️ Auto-recuperação: NUNCA deixa o vídeo permanecer pausado ou congelado
      if (video.paused && video.readyState >= 2) {
        video.play().catch(() => {});
      }

      const w = cvs.width;
      const h = cvs.height;
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (video.readyState < 2) {
        animId = requestAnimationFrame(render);
        return;
      }

      const duration = video.duration || 32;
      const cutPoint = typeof loopEndSeconds === 'number' && loopEndSeconds > 0
        ? Math.min(duration, loopEndSeconds)
        : (trimOutro && trimOutroSeconds > 0 && duration > trimOutroSeconds + 0.2
            ? Math.max(0.5, duration - trimOutroSeconds)
            : duration);

      // Ponto de início do loop (corta os primeiros segundos configurados)
      const startPoint = getStartPoint();

      // Duração da transição em milissegundos
      const fadeDurMs = transitionDuration === 0
        ? 0
        : Math.max(150, Math.min(1500, Math.abs(transitionDuration) * 1000));

      // Garante que o vídeo nunca volte a exibir os primeiros segundos cortados
      if (startPoint > 0 && video.currentTime < startPoint - 0.05) {
        try {
          video.currentTime = startPoint;
        } catch (e) {}
      }

      // 1. REBOBINAMENTO AUTOMÁTICO AO ATINGIR O PONTO DE CORTE
      if (duration && video.currentTime >= Math.max(startPoint + 0.5, cutPoint - 0.08) && !isLoopingRef.current) {
        isLoopingRef.current = true;
        loopStartTimeRef.current = performance.now();

        // Guarda snapshot do frame atual para a dissolvência suave
        if (transitionMode !== 'cut' && fadeDurMs > 0) {
          const mem = memoryRef.current;
          if (!mem.snapshot) {
            mem.snapshot = document.createElement('canvas');
          }
          if (mem.snapshot.width !== w || mem.snapshot.height !== h) {
            mem.snapshot.width = w;
            mem.snapshot.height = h;
          }
          const snapCtx = mem.snapshot.getContext('2d');
          snapCtx.clearRect(0, 0, w, h);
          snapCtx.drawImage(cvs, 0, 0);
        }

        // Rebobina para o início configurado (startPoint) e garante reprodução contínua
        video.currentTime = startPoint;
        video.play().catch(() => {});
      }

      // 2. PROCESSAMENTO DO FRAME ATUAL NO CANVAS PRINCIPAL
      processVideoFrame(video, ctx, w, h);

      // 3. APLICAÇÃO DA TRANSIÇÃO SUAVE (DISSOLVÊNCIA OU FADE)
      if (isLoopingRef.current) {
        const elapsed = performance.now() - loopStartTimeRef.current;

        if (elapsed < fadeDurMs && fadeDurMs > 0) {
          const progress = Math.max(0, Math.min(1, elapsed / fadeDurMs));

          if (transitionMode === 'crossfade') {
            cvs.style.opacity = '1';
            const mem = memoryRef.current;
            if (mem.snapshot) {
              // Curva suave de decaimento: o snapshot final dissolve gradualmente sobre o início do loop
              const ease = 0.5 + 0.5 * Math.cos(progress * Math.PI);
              ctx.save();
              ctx.globalAlpha = ease;
              ctx.drawImage(mem.snapshot, 0, 0);
              ctx.restore();
            }
          } else if (transitionMode === 'fade') {
            // Desvanecimento orgânico
            const dip = Math.sin(progress * Math.PI);
            cvs.style.opacity = Math.max(0, 1.0 - dip).toFixed(3);
          }
        } else {
          // Transição concluída
          isLoopingRef.current = false;
          cvs.style.opacity = '1';
        }
      } else {
        cvs.style.opacity = '1';
      }

      animId = requestAnimationFrame(render);
    };

    const handleEnded = () => {
      const startPoint = getStartPoint();
      video.currentTime = startPoint;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
      video.removeEventListener('play', seekToStartIfBefore);
      video.removeEventListener('ended', handleEnded);
    };
  }, [
    src,
    trimIntroSeconds,
    loopEndSeconds,
    removeGreen,
    removeWhite,
    preserveWhiteContent,
    threshold,
    feather,
    trimOutro,
    trimOutroSeconds,
    transitionMode,
    transitionDuration,
    maskWatermark,
    onLoaded
  ]);

  return (
    <div className={`relative inline-block w-full ${containerClassName || 'max-w-[680px] sm:max-w-[880px] md:max-w-[1080px] lg:max-w-[1200px] xl:max-w-[1300px]'}`}>
      {/* Vídeo de origem ativo no pipeline de decodificação offscreen */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        className="absolute w-px h-px opacity-0 pointer-events-none -z-50"
      />

      {/* Canvas renderizado com transparência e transição suave */}
      <canvas
        ref={canvasRef}
        width={612}
        height={408}
        className={className}
        aria-label={alt}
      />
    </div>
  );
};
