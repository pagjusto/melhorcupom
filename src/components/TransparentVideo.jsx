import React, { useRef, useEffect, useState } from 'react';

/**
 * TransparentVideo - Reprodução de vídeo com:
 * 1. Remoção inteligente de fundo branco por inundação de borda (BFS Flood-Fill):
 *    Remove APENAS o fundo externo que toca as bordas, PRESERVANDO o branco das letras e do mascote!
 * 2. Transição Ultra-Suave de Looping:
 *    - 'crossfade': Motor Dual-Player com dissolvência contínua entre ciclos (elimina corte seco e travamento de seek).
 *    - 'fade': Desvanecimento suave (fade-out / fade-in orgânico).
 *    - 'cut': Corte instantâneo direto.
 * 3. Corte da vinheta final do CapCut configurável.
 * 4. Remoção de marca d'água de cantos e artefatos de linha inferior.
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
  transitionDuration = 0.5,     // Duração da transição em segundos (0.2s a 1.2s)
  maskWatermark = true,        // Mascarar marcas d'água de canto (CapCut)
  onLoaded,
  alt = 'Vídeo'
}) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Referência do player atualmente ativo (1 ou 2)
  const activePlayerRef = useRef(1);
  const transitionTriggeredRef = useRef(false);

  // Buffers reutilizáveis para 60fps constantes sem alocação de memória (zero GC lag)
  const memoryRef = useRef({
    visited: null,
    queue: null,
    visitId: 0,
    lastWidth: 0,
    lastHeight: 0,
    bufferA: null,
    bufferB: null
  });

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    const canvas = canvasRef.current;
    if (!video1 || !canvas) return;

    let animId = null;

    const handleLoadedMetadata = () => {
      if (video1.videoWidth && video1.videoHeight) {
        const w = video1.videoWidth;
        const h = video1.videoHeight;
        canvas.width = w;
        canvas.height = h;

        const mem = memoryRef.current;
        if (!mem.bufferA) {
          mem.bufferA = document.createElement('canvas');
          mem.bufferB = document.createElement('canvas');
        }
        mem.bufferA.width = w;
        mem.bufferA.height = h;
        mem.bufferB.width = w;
        mem.bufferB.height = h;

        setIsReady(true);
        if (onLoaded) onLoaded();
      }
    };

    video1.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video2) video2.load(); // Pré-aquece o buffer do segundo player

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
     * Loop de renderização com motor de transição de loop suave
     */
    const render = () => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      const cvs = canvasRef.current;

      if (!v1 || !cvs || !cvs.width || !cvs.height) {
        animId = requestAnimationFrame(render);
        return;
      }

      const w = cvs.width;
      const h = cvs.height;
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const activeVideo = activePlayerRef.current === 1 ? v1 : (v2 || v1);
      const incomingVideo = activePlayerRef.current === 1 ? (v2 || v1) : v1;

      if (activeVideo.readyState < 2) {
        animId = requestAnimationFrame(render);
        return;
      }

      const duration = activeVideo.duration || 6.434;
      const cutPoint = trimOutro && duration > trimOutroSeconds + 0.2
        ? duration - trimOutroSeconds
        : duration;

      // Se transitionDuration for negativo (abaixo de 0):
      // Usamos como offset no início do vídeo (corta o início estático/intro)
      // Se for positivo: usamos como tempo de crossfade suave
      const startOffset = transitionDuration < 0 ? Math.abs(transitionDuration) : 0;
      const effectiveTransDur = transitionDuration > 0
        ? Math.min(transitionDuration, Math.max(0.1, (cutPoint - startOffset) * 0.45))
        : (transitionDuration === 0 ? 0 : 0.2); // micro-dissolvência mesmo com offset negativo

      const transStart = cutPoint - effectiveTransDur;

      // =========================================================================
      // OPÇÃO 1: MOTOR DE DISSOLVÊNCIA CRUZADA CONTÍNUA (CROSSFADE DUAL-PLAYER)
      // O próximo player começa antes do fim, eliminando corte seco e seek lag!
      // =========================================================================
      if (transitionMode === 'crossfade' && v2) {
        cvs.style.opacity = '1';

        // Janela de transição: activeVideo está prestes a terminar
        if (effectiveTransDur > 0 && trimOutro && activeVideo.currentTime >= transStart && activeVideo.currentTime < cutPoint) {
          // Dispara o player de entrada EXATAMENTE UMA VEZ
          if (!transitionTriggeredRef.current) {
            transitionTriggeredRef.current = true;
            incomingVideo.currentTime = startOffset;
            incomingVideo.play().catch(() => {});
          }

          const rawProgress = (activeVideo.currentTime - transStart) / effectiveTransDur;
          const progress = Math.max(0, Math.min(1, rawProgress));
          const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI); // Curva S suave

          const mem = memoryRef.current;
          if (!mem.bufferA) {
            mem.bufferA = document.createElement('canvas');
            mem.bufferB = document.createElement('canvas');
            mem.bufferA.width = w;
            mem.bufferA.height = h;
            mem.bufferB.width = w;
            mem.bufferB.height = h;
          }

          const ctxA = mem.bufferA.getContext('2d', { willReadFrequently: true });
          const ctxB = mem.bufferB.getContext('2d', { willReadFrequently: true });

          // Processa activeVideo no buffer A
          processVideoFrame(activeVideo, ctxA, w, h);

          // Processa incomingVideo no buffer B
          const hasB = incomingVideo.readyState >= 2 && processVideoFrame(incomingVideo, ctxB, w, h);

          // Mescla buffer A e buffer B suavemente
          ctx.clearRect(0, 0, w, h);
          ctx.save();
          if (hasB) {
            ctx.globalAlpha = 1.0 - ease;
            ctx.drawImage(mem.bufferA, 0, 0, w, h);
            ctx.globalAlpha = ease;
            ctx.drawImage(mem.bufferB, 0, 0, w, h);
          } else {
            // Se o segundo player ainda estiver carregando o frame, mantém o primeiro visível
            ctx.globalAlpha = 1.0;
            ctx.drawImage(mem.bufferA, 0, 0, w, h);
          }
          ctx.restore();

        } else if (trimOutro && activeVideo.currentTime >= cutPoint) {
          // Ponto de corte atingido: troca de papéis entre os players
          activeVideo.pause();
          activeVideo.currentTime = startOffset;

          incomingVideo.play().catch(() => {});
          activePlayerRef.current = activePlayerRef.current === 1 ? 2 : 1;
          transitionTriggeredRef.current = false;

          // Renderiza o novo player ativo diretamente
          processVideoFrame(incomingVideo, ctx, w, h);

        } else {
          // Reprodução normal de alta performance fora da janela de transição
          transitionTriggeredRef.current = false;
          processVideoFrame(activeVideo, ctx, w, h);
        }

      // =========================================================================
      // OPÇÃO 2: DESVANECIMENTO SUAVE (FADE IN / FADE OUT ELEGANTE)
      // =========================================================================
      } else if (transitionMode === 'fade') {
        if (trimOutro && duration && effectiveTransDur > 0) {
          const fadeHalf = effectiveTransDur / 2;
          const fadeOutStart = cutPoint - fadeHalf;
          let op = 1.0;

          if (activeVideo.currentTime >= fadeOutStart && activeVideo.currentTime < cutPoint) {
            const p = (activeVideo.currentTime - fadeOutStart) / fadeHalf;
            op = Math.max(0, 1.0 - p);
          } else if (activeVideo.currentTime >= cutPoint) {
            activeVideo.currentTime = startOffset;
            op = 0;
          } else if (activeVideo.currentTime < startOffset + fadeHalf) {
            const p = (activeVideo.currentTime - startOffset) / fadeHalf;
            op = Math.min(1.0, Math.max(0, p));
          }

          const smoothOp = Math.sin(op * (Math.PI / 2));
          cvs.style.opacity = smoothOp.toFixed(3);
        } else {
          cvs.style.opacity = '1';
          if (trimOutro && duration && activeVideo.currentTime >= cutPoint) {
            activeVideo.currentTime = startOffset;
          }
        }

        processVideoFrame(activeVideo, ctx, w, h);

      // =========================================================================
      // OPÇÃO 3: CORTE DIRETO INSTANTÂNEO (SEM TRANSIÇÃO)
      // =========================================================================
      } else {
        cvs.style.opacity = '1';
        if (trimOutro && duration && activeVideo.currentTime >= cutPoint) {
          activeVideo.currentTime = startOffset;
        }
        processVideoFrame(activeVideo, ctx, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    video1.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      video1.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
      {/* Vídeo 1 (Player Principal A) */}
      <video
        ref={video1Ref}
        src={src}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        className="hidden"
      />

      {/* Vídeo 2 (Player Secundário B para Crossfade Contínuo sem Stutter) */}
      <video
        ref={video2Ref}
        src={src}
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
