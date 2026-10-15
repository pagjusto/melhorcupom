/**
 * storeUrls.js - Mapeamento e resolvedor inteligente de links oficiais e afiliados dos parceiros
 * Garante que NENHUM cupom leve para pesquisas do Google.
 * Todo clique deve direcionar diretamente para o site oficial da loja ou para o link de afiliado.
 */

export const STORE_OFFICIAL_URLS = {
  // Lojas de Moda e Esporte
  'trackfield': 'https://www.tf.com.br',
  'track & field': 'https://www.tf.com.br',
  'track and field': 'https://www.tf.com.br',
  'store_rio_2': 'https://www.tf.com.br',
  'cupom_rio_2': 'https://www.tf.com.br',
  'nike': 'https://www.nike.com.br',
  'store_nike': 'https://www.nike.com.br',
  'adidas': 'https://www.adidas.com.br',
  'store_adidas': 'https://www.adidas.com.br',
  'centauro': 'https://www.centauro.com.br',
  'netshoes': 'https://www.netshoes.com.br',
  'store_netshoes': 'https://www.netshoes.com.br',

  // Lojas de Tecnologia e Eletrônicos
  'iplace': 'https://www.iplace.com.br',
  'iplace apple': 'https://www.iplace.com.br',
  'iplace apple premium reseller': 'https://www.iplace.com.br',
  'store_7': 'https://www.iplace.com.br',
  'cupom_7': 'https://www.iplace.com.br',
  'samsung': 'https://www.samsung.com/br',
  'store_samsung': 'https://www.samsung.com/br',
  'kabum': 'https://www.kabum.com.br',
  'store_kabum': 'https://www.kabum.com.br',

  // Saúde, Beleza e Cuidados Pessoais
  'omens': 'https://www.omens.com.br',
  'omens saúde masculina': 'https://www.omens.com.br',
  'sephora': 'https://www.sephora.com.br',
  'store_sephora': 'https://www.sephora.com.br',
  'drogasil': 'https://www.drogasil.com.br',
  'store_drogasil': 'https://www.drogasil.com.br',
  'drogaraia': 'https://www.drogaraia.com.br',

  // Grandes E-commerces e Marketplaces
  'amazon': 'https://www.amazon.com.br/?tag=melhorcupo00b-20',
  'store_amazon': 'https://www.amazon.com.br/?tag=melhorcupo00b-20',
  'shopee': 'https://shopee.com.br/?af=18305641225&utm_source=affiliate&utm_campaign=melhorcupom&af_sub1=melhorcupom',
  'store_shopee': 'https://shopee.com.br/?af=18305641225&utm_source=affiliate&utm_campaign=melhorcupom&af_sub1=melhorcupom',
  'shein': 'https://br.shein.com/?aff_id=5005674890&utm_source=affiliate&utm_campaign=melhorcupom&sub_id=melhorcupom',
  'store_shein': 'https://br.shein.com/?aff_id=5005674890&utm_source=affiliate&utm_campaign=melhorcupom&sub_id=melhorcupom',
  'magalu': 'https://www.magazineluiza.com.br',
  'magazine luiza': 'https://www.magazineluiza.com.br',
  'store_magalu': 'https://www.magazineluiza.com.br',
  'mercadolivre': 'https://www.mercadolivre.com.br',
  'mercado livre': 'https://www.mercadolivre.com.br',
  'store_meli': 'https://www.mercadolivre.com.br',
  'aliexpress': 'https://pt.aliexpress.com',
  'store_aliexpress': 'https://pt.aliexpress.com',
  'casasbahia': 'https://www.casasbahia.com.br',
  'casas bahia': 'https://www.casasbahia.com.br',
  'store_casasbahia': 'https://www.casasbahia.com.br',

  // Gastronomia, Redes e Lazer
  'cinemark': 'https://www.cinemark.com.br',
  'store_8': 'https://www.cinemark.com.br',
  'burgerking': 'https://www.burgerking.com.br',
  'burger king': 'https://www.burgerking.com.br',
  'store_bk': 'https://www.burgerking.com.br',
  'starbucks': 'https://www.starbucks.com.br',
  'store_starbucks': 'https://www.starbucks.com.br',
  'cacaushow': 'https://www.cacaushow.com.br',
  'cacau show': 'https://www.cacaushow.com.br',
  'store_cacaushow': 'https://www.cacaushow.com.br',
  'madero': 'https://www.restaurantemadero.com.br',
  'store_madero': 'https://www.restaurantemadero.com.br',
  'outback': 'https://www.outback.com.br',
  'store_5': 'https://www.outback.com.br',
  'spoleto': 'https://www.spoleto.com.br',
  'store_spoleto': 'https://www.spoleto.com.br',
  'subway': 'https://www.subway.com',
  'store_subway': 'https://www.subway.com',
  'fogodechao': 'https://www.fogodechao.com.br',
  'fogo de chão': 'https://www.fogodechao.com.br',
  'store_6': 'https://www.fogodechao.com.br',
  'pão de açúcar': 'https://www.paodeacucar.com',
  'paodeacucar': 'https://www.paodeacucar.com',
  'store_paodeacucar': 'https://www.paodeacucar.com',
  'petz': 'https://www.petz.com.br',
  'store_petz': 'https://www.petz.com.br',
  'choperia pinguim': 'https://www.pinguimochopp.com.br',
  'store_bh_1': 'https://www.pinguimochopp.com.br',
  'boteco belmonte': 'https://www.botecobelmonte.com.br',
  'store_rio_1': 'https://www.botecobelmonte.com.br',
  'barbearia corleone': 'https://www.barbeariacorleone.com.br',
  'store_2': 'https://www.barbeariacorleone.com.br',
  'madalosso': 'https://www.madalosso.com.br',
  'store_curitiba_1': 'https://www.madalosso.com.br'
};

/**
 * Validador que rejeita links vazios, fictícios ou URLs de busca do Google
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) return false;
  if (clean.includes('google.com/search') || clean.includes('google.com.br/search')) return false;
  return true;
};

/**
 * Obtém a URL de destino oficial e direta para qualquer loja ou cupom.
 * NUNCA retorna link de pesquisa do Google.
 */
export const getStoreDestinationUrl = (store, coupon = {}) => {
  // 1. Link direto do cupom (se preenchido e válido)
  if (isValidUrl(coupon?.affiliateUrl)) return coupon.affiliateUrl.trim();
  if (isValidUrl(coupon?.link)) return coupon.link.trim();
  if (isValidUrl(coupon?.url)) return coupon.url.trim();

  // 2. Link direto da loja (afiliado ou website)
  if (isValidUrl(store?.affiliateUrl)) return store.affiliateUrl.trim();
  if (isValidUrl(store?.website)) return store.website.trim();

  // 3. Busca por identificadores no dicionário oficial
  const identifiers = [
    coupon?.id,
    coupon?.storeId,
    store?.id,
    store?.merchantId,
    coupon?.apiSource,
    store?.apiSource,
    coupon?.storeName,
    store?.name,
    coupon?.title
  ].filter(Boolean);

  for (const id of identifiers) {
    const raw = String(id).toLowerCase().trim();
    if (STORE_OFFICIAL_URLS[raw]) {
      return STORE_OFFICIAL_URLS[raw];
    }
    const cleanKey = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    for (const [key, url] of Object.entries(STORE_OFFICIAL_URLS)) {
      const cleanDictKey = key
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      if (cleanKey.includes(cleanDictKey) || cleanDictKey.includes(cleanKey)) {
        return url;
      }
    }
  }

  // 4. Se for uma marca avulsa com nome limpo (ex: "Omens Saúde Masculina" -> "https://www.omens.com.br")
  const rawBrandName = store?.name || coupon?.storeName || '';
  if (rawBrandName) {
    const firstWord = rawBrandName
      .trim()
      .split(' ')[0]
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    if (firstWord.length >= 3) {
      // Se for Omens especificamente
      if (firstWord === 'omens') return 'https://www.omens.com.br';
      if (firstWord === 'trackfield' || firstWord === 'track') return 'https://www.tf.com.br';
      if (firstWord === 'iplace') return 'https://www.iplace.com.br';
      return `https://www.${firstWord}.com.br`;
    }
  }

  // 5. Fallback seguro garantido (Home do site)
  return 'https://www.omelhorcupom.com.br';
};
