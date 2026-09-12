import React, { useRef, useEffect, useState } from 'react';

/**
 * TransparentVideo - Reprodução de vídeo com:
 * 1. Remoção inteligente de fundo branco por inundação de borda (BFS Flood-Fill):
 *    Remove APENAS o fundo externo que toca as bordas, PRESERVANDO o branco das letras e do mascote!
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
  removeWhite = true,
  preserveWhiteContent = true, // Flood-fill preservador de letras e mascote
  threshold = 215,             // Sensibilidade para detectar fundo branco (0 a 255)
  feather = 25,                // Suavização das bordas (anti-aliasing)
  trimOutro = true,            // Cortar vinheta final do CapCut
  trimOutroSeconds = 2.8,      // Duração da vinheta final / corte do loop (em segundos)
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
    snapshot: null
  });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId = null;

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        canvas.width = w;
        canvas.height = h;

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

    /**
     * Processa um frame de vídeo removendo o fundo branco e limpando resíduos
     */
    const processVideoFrame = (vid, targetCtx, w, h) => {
      if (!vid || vid.readyState < 2) return false;

      // 1. Desenha o frame bruto
      targetCtx.drawImage(vid, 0, 0, w, h);

      if (!removeWhite) return true;

      const frame = targetCtx.getImageData(0, 0, w, h);
      const data = frame.data;

      if (preserveWhiteContent) {
        // =========================================================================
        // ALGORITMO BFS FLOOD-FILL PELAS BORDAS
        // Inunda apenas o fundo branco conectado às 4 bordas do vídeo.
        // Letras e mascote são contornados de preto, mantendo o interior 100% branco!
        // =========================================================================
        const mem = memoryRef.current;
        const totalPixels = w * h;

        if (!mem.visited || mem.lastWidth !== w || mem.lastHeight !== h) {
          mem.visited = new Int32Array(totalPixels);
          mem.queue = new Int32Array(totalPixels);
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

        const lowThreshold = threshold - feather;
        const highThreshold = threshold + 10;

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

          if (minVal > lowThreshold && isNeutral) {
            if (minVal >= highThreshold) {
              data[p4 + 3] = 0; // 100% transparente
            } else {
              const factor = (highThreshold - minVal) / (highThreshold - lowThreshold);
              data[p4 + 3] = Math.round(data[p4 + 3] * factor);
            }

            if (px > 0) {
              const n = p - 1;
              if (visited[n] !== visitId) { visited[n] = visitId; queue[tail++] = n; }
            }
            if (px < w - 1) {
              const n = p + 1;
              if (visited[n] !== visitId) { visited[n] = visitId; queue[tail++] = n; }
            }
            if (py > 0) {
              const n = p - w;
              if (visited[n] !== visitId) { visited[n] = visitId; queue[tail++] = n; }
            }
            if (py < h - 1) {
              const n = p + w;
              if (visited[n] !== visitId) { visited[n] = visitId; queue[tail++] = n; }
            }
          }
        }

        // 2. Remoção de Marca d'água em cantos residuais (CapCut)
        if (maskWatermark) {
          const cornerW = Math.round(w * 0.22);
          const cornerH = Math.round(h * 0.16);
          for (let y = 0; y < cornerH; y++) {
            for (let x = w - cornerW; x < w; x++) {
              data[(y * w + x) * 4 + 3] = 0;
            }
          }
          for (let y = h - cornerH; y < h; y++) {
            for (let x = w - cornerW; x < w; x++) {
              data[(y * w + x) * 4 + 3] = 0;
            }
          }
        }

        // 3. Remoção de linha/barra residual inferior
        const bottomCleanH = Math.min(14, Math.max(6, Math.round(h * 0.04)));
        for (let y = h - bottomCleanH; y < h; y++) {
          const rowStart = y * w * 4;
          for (let x = 0; x < w; x++) {
            data[rowStart + x * 4 + 3] = 0;
          }
        }

        // 4. Limpeza de bordas sutis (2px)
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
        for (let i = 0; i < data.length; i += 4) {
          const minVal = Math.min(data[i], data[i + 1], data[i + 2]);
          if (minVal > threshold) data[i + 3] = 0;
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

      const duration = video.duration || 6.434;
      const cutPoint = trimOutro && duration > trimOutroSeconds + 0.2
        ? Math.max(0.5, duration - trimOutroSeconds)
        : duration;

      // Ponto de início do loop:
      // Se transitionDuration for negativo (< 0), corta o início do vídeo pelo valor absoluto
      const startPoint = transitionDuration < 0 ? Math.abs(transitionDuration) : 0;

      // Duração da transição em milissegundos
      const fadeDurMs = transitionDuration === 0
        ? 0
        : Math.max(150, Math.min(1500, Math.abs(transitionDuration) * 1000));

      // 1. REBOBINAMENTO AUTOMÁTICO AO ATINGIR O PONTO DE CORTE
      if (trimOutro && duration && video.currentTime >= cutPoint && !isLoopingRef.current) {
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

    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [
    src,
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
    <div className="relative inline-block w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[580px]">
      {/* Vídeo de origem oculto com reprodução contínua */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        className="hidden"
      />

      {/* Canvas renderizado com transparência e transição suave */}
      <canvas
        ref={canvasRef}
        className={className}
        aria-label={alt}
      />
    </div>
  );
};
