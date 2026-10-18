// Utilitário central para resolução de Fotos de Capa (Banners) dos cupons
// Garante que todo cupom tenha uma foto de capa real, atraente e vibrante,
// eliminando fundos pretos vazios ou logos duplicadas na capa.

import manualBanner from '../assets/brands/manual-banner.svg';

const CATEGORY_THEMATIC_BANNERS = {
  // Hardware, Games, Setup, Informática
  hardware: [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=700&auto=format&fit=crop&q=80', // Placa Mãe / GPU Setup Gamer
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80', // Tech Hardware RGB
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=700&auto=format&fit=crop&q=80', // Setup Gamer Completo
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80'  // Arena Esports & Gaming
  ],
  // Casa, Decoração, Cama, Mesa e Banho
  casa: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&auto=format&fit=crop&q=80', // Decoração de Interiores Sofisticada
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&auto=format&fit=crop&q=80', // Sala Aconchegante e Moderna
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&auto=format&fit=crop&q=80', // Poltrona e Design Nórdico
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&auto=format&fit=crop&q=80'  // Quarto e Cama Posta Confortável
  ],
  // Beleza, Cosméticos, Perfumes
  beleza: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80', // Cosméticos e Skincare
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=80', // Maquiagem e Cuidados
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=700&auto=format&fit=crop&q=80'  // Frascos de Perfumes Nobres
  ],
  // Moda, Vestuário, Sneakers
  moda: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80', // Loja de Roupas Moderna
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80', // Sneakers e Calçados
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=700&auto=format&fit=crop&q=80'  // Peças de Vestuário Estilosas
  ],
  // Gastronomia, Burgers, Bebidas
  gastronomia: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80', // Burger Artesanal
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80', // Restaurante Aconchegante
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&auto=format&fit=crop&q=80'  // Chopp & Happy Hour
  ],
  // Fitness, Saúde, Academia
  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80', // Academia e Treino
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80'  // Musculação e Performance
  ],
  // Saúde, Farmácia, Masculina
  saude: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80', // Saúde e Bem-estar
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&auto=format&fit=crop&q=80'  // Cuidados Médicos e Farmácia
  ],
  // Livraria, Livros, Cultura
  livros: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80', // Livros e Estante
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=700&auto=format&fit=crop&q=80'  // Livraria e Leitura
  ],
  // Geral / Eletrônicos
  eletronicos: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=80', // Tecnologia & Chips
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80'  // Headphones & Gadgets
  ]
};

// Gera um hash determinístico a partir de uma string para escolher sempre a mesma foto por id
function getHashIndex(str, arrayLength) {
  if (!str || arrayLength <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % arrayLength;
}

export function getCouponBanner(coupon, store) {
  if (!coupon) return CATEGORY_THEMATIC_BANNERS.eletronicos[0];

  const textCorpus = `${coupon.title || ''} ${coupon.storeName || store?.name || ''} ${coupon.description || ''} ${coupon.category || ''}`.toLowerCase();

  // Manual Brasil (Tratamento Capilar)
  if (textCorpus.includes('manual') && (textCorpus.includes('queda') || textCorpus.includes('capilar') || textCorpus.includes('tratamento') || textCorpus.includes('cabelo') || textCorpus.includes('saude') || textCorpus.includes('saúde'))) {
    return manualBanner;
  }

  const rawBanner = coupon.banner || coupon.image;
  const storeLogo = coupon.storeLogoImage || coupon.logoImage || coupon.storeLogo || store?.logoImage;

  // 1. Se for uma imagem personalizada carregada pelo usuário (dataURL base64 ou upload direto):
  if (rawBanner && typeof rawBanner === 'string' && rawBanner.startsWith('data:')) {
    return rawBanner;
  }

  // 2. Se for uma URL real de foto que NÃO é logo (Unsplash, imagens de produtos, fotos externas):
  const isLogoUrl = rawBanner && typeof rawBanner === 'string' && (
    rawBanner.includes('/logos/') ||
    rawBanner.includes('cdn.lomadee.com.br/logos') ||
    rawBanner.includes('cdn.lomadee.com.br/domain') ||
    rawBanner.endsWith('/logo') ||
    rawBanner.endsWith('.svg') ||
    rawBanner === storeLogo
  );

  if (rawBanner && !isLogoUrl && (rawBanner.includes('unsplash.com') || rawBanner.includes('images') || rawBanner.includes('cloudinary') || rawBanner.includes('img'))) {
    return rawBanner;
  }

  // 3. Se não tiver banner ou o banner for apenas a logo da loja:
  // Resolver uma foto temática profissional com base na loja, título e categoria
  const seed = coupon.id || coupon.title || 'banner';

  // Hardware / Games / Informática (TeraByte, Pichau, Kabum, Gamer, Placa, etc.)
  if (
    textCorpus.includes('terabyte') || 
    textCorpus.includes('kabum') || 
    textCorpus.includes('pichau') || 
    textCorpus.includes('placa') || 
    textCorpus.includes('gamer') || 
    textCorpus.includes('pc') || 
    textCorpus.includes('hardware') || 
    textCorpus.includes('computador') || 
    textCorpus.includes('teclado') ||
    textCorpus.includes('monitor')
  ) {
    const list = CATEGORY_THEMATIC_BANNERS.hardware;
    return list[getHashIndex(seed, list.length)];
  }

  // Casa / Decoração (Sottile Casa, Móveis, Cama, Banho, etc.)
  if (
    textCorpus.includes('sottile') || 
    textCorpus.includes('casa') || 
    textCorpus.includes('decora') || 
    textCorpus.includes('quarto') || 
    textCorpus.includes('cama') || 
    textCorpus.includes('banho') || 
    textCorpus.includes('móveis') || 
    textCorpus.includes('colch')
  ) {
    const list = CATEGORY_THEMATIC_BANNERS.casa;
    return list[getHashIndex(seed, list.length)];
  }

  // Beleza / Cosméticos / Perfumaria (Amakha Paris, etc.)
  if (
    textCorpus.includes('amakha') || 
    textCorpus.includes('perfum') || 
    textCorpus.includes('cosm') || 
    textCorpus.includes('beleza') || 
    textCorpus.includes('skincare') || 
    textCorpus.includes('maquiag')
  ) {
    const list = CATEGORY_THEMATIC_BANNERS.beleza;
    return list[getHashIndex(seed, list.length)];
  }

  // Saúde / Masculina (Omens, etc.)
  if (
    textCorpus.includes('omens') || 
    textCorpus.includes('saúde') || 
    textCorpus.includes('masculina') || 
    textCorpus.includes('medic')
  ) {
    const list = CATEGORY_THEMATIC_BANNERS.saude;
    return list[getHashIndex(seed, list.length)];
  }

  // Livros / Cultura (Livrarias Curitiba, etc.)
  if (textCorpus.includes('livraria') || textCorpus.includes('livro') || textCorpus.includes('leitura')) {
    const list = CATEGORY_THEMATIC_BANNERS.livros;
    return list[getHashIndex(seed, list.length)];
  }

  // Moda / Roupas / Sneakers
  if (textCorpus.includes('moda') || textCorpus.includes('roupa') || textCorpus.includes('malwee') || textCorpus.includes('tênis') || textCorpus.includes('vestu')) {
    const list = CATEGORY_THEMATIC_BANNERS.moda;
    return list[getHashIndex(seed, list.length)];
  }

  // Gastronomia / Bares / Alimentação
  if (textCorpus.includes('gastro') || textCorpus.includes('burger') || textCorpus.includes('chopp') || textCorpus.includes('pizza') || textCorpus.includes('lanche')) {
    const list = CATEGORY_THEMATIC_BANNERS.gastronomia;
    return list[getHashIndex(seed, list.length)];
  }

  // Fallback baseado na categoria do cupom
  const cat = (coupon.category || '').toLowerCase();
  if (CATEGORY_THEMATIC_BANNERS[cat]) {
    const list = CATEGORY_THEMATIC_BANNERS[cat];
    return list[getHashIndex(seed, list.length)];
  }

  // Fallback geral
  return CATEGORY_THEMATIC_BANNERS.eletronicos[getHashIndex(seed, CATEGORY_THEMATIC_BANNERS.eletronicos.length)];
}
