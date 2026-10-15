/**
 * imageCompressor.js - Utilitário de compressão de imagens no cliente
 * Reduz fotos de câmeras/celulares de 5MB-15MB para menos de 100KB,
 * evitando estouro de cota de LocalStorage (5MB) e acelerando o carregamento.
 */

export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Nenhum arquivo fornecido.'));
    }

    // Se não for imagem, rejeita
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const maxWidth = options.maxWidth || 1000;
    const maxHeight = options.maxHeight || 600;
    const quality = options.quality !== undefined ? options.quality : 0.75;

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar os dados da imagem.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular proporção mantendo aspecto
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback para resultado direto se canvas falhar
          return resolve(e.target.result);
        }

        // Desenhar com interpolação suave
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG comprimido
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};
