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
  'centauro': 'https://www.centauro.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_centauro': 'https://www.centauro.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'puma': 'https://www.puma.com/br/pt?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_puma': 'https://www.puma.com/br/pt?awinaffid=3095275&clickref=melhorcupom_vip',
  'under armour': 'https://www.underarmour.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_underarmour': 'https://www.underarmour.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'oakley': 'https://www.oakley.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_oakley': 'https://www.oakley.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
  'ray-ban': 'https://www.ray-ban.com/brazil?awinaffid=3095275&clickref=melhorcupom_vip',
  'rayban': 'https://www.ray-ban.com/brazil?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_rayban': 'https://www.ray-ban.com/brazil?awinaffid=3095275&clickref=melhorcupom_vip',
  'dafiti': 'https://www.dafiti.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_dafiti': 'https://www.dafiti.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'zattini': 'https://www.zattini.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_zattini': 'https://www.zattini.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'c&a': 'https://www.cea.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'cea': 'https://www.cea.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_cea': 'https://www.cea.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'renner': 'https://www.lojasrenner.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'lojas renner': 'https://www.lojasrenner.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_renner': 'https://www.lojasrenner.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'riachuelo': 'https://www.riachuelo.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_riachuelo': 'https://www.riachuelo.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
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
  'dell': 'https://www.dell.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
  'dell computadores': 'https://www.dell.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_dell': 'https://www.dell.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
  'lenovo': 'https://www.lenovo.com/br/pt/?awinaffid=3095275&clickref=melhorcupom_vip',
  'lenovo brasil': 'https://www.lenovo.com/br/pt/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_lenovo': 'https://www.lenovo.com/br/pt/?awinaffid=3095275&clickref=melhorcupom_vip',
  'fast shop': 'https://www.fastshop.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'fastshop': 'https://www.fastshop.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_fastshop': 'https://www.fastshop.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'electrolux': 'https://www.electrolux.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_electrolux': 'https://www.electrolux.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'brastemp': 'https://loja.brastemp.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'consul': 'https://loja.brastemp.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_brastemp': 'https://loja.brastemp.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'philips': 'https://www.philips.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_philips': 'https://www.philips.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',

  // Saúde, Beleza e Cuidados Pessoais
  'omens': 'https://www.omens.com.br',
  'omens saúde masculina': 'https://www.omens.com.br',
  'sephora': 'https://www.sephora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_sephora': 'https://www.sephora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_sephora': 'https://www.sephora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'o boticário': 'https://www.boticario.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'boticario': 'https://www.boticario.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_boticario': 'https://www.boticario.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'eudora': 'https://www.eudora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_eudora': 'https://www.eudora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'quem disse berenice': 'https://www.quemdisseberenice.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_qdb': 'https://www.quemdisseberenice.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'beleza na web': 'https://www.belezanaweb.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_belezanaweb': 'https://www.belezanaweb.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'natura': 'https://www.natura.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_natura': 'https://www.natura.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'loccitane': 'https://br.loccitaneaubresil.com/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_loccitane': 'https://br.loccitaneaubresil.com/?awinaffid=3095275&clickref=melhorcupom_vip',
  'drogasil': 'https://www.drogasil.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_drogasil': 'https://www.drogasil.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'drogaraia': 'https://www.drogaraia.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'droga raia': 'https://www.drogaraia.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_drogaraia': 'https://www.drogaraia.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'pague menos': 'https://www.paguemenos.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_paguemenos': 'https://www.paguemenos.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'cobasi': 'https://www.cobasi.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_cobasi': 'https://www.cobasi.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'camicado': 'https://www.camicado.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_camicado': 'https://www.camicado.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'tokstok': 'https://www.tokstok.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_tokstok': 'https://www.tokstok.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'booking': 'https://www.booking.com/?aid=3095275&clickref=melhorcupom_vip',
  'store_awin_booking': 'https://www.booking.com/?aid=3095275&clickref=melhorcupom_vip',
  'decolar': 'https://www.decolar.com/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_decolar': 'https://www.decolar.com/?awinaffid=3095275&clickref=melhorcupom_vip',
  'carrefour': 'https://www.carrefour.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
  'store_awin_carrefour': 'https://www.carrefour.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',

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
 * Normaliza e sanitiza qualquer URL informada pelo usuário ou lojista.
 * Se o usuário digitou 'anycar.com.br' ou 'www.loja.com.br', prefixa automaticamente 'https://'.
 * Rejeita explicitamente pesquisas do Google ou strings inválidas.
 */
export const normalizeUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let clean = rawUrl.trim();
  if (!clean) return '';

  const lower = clean.toLowerCase();
  // NUNCA aceitar links de pesquisa do Google
  if (lower.includes('google.com/search') || lower.includes('google.com.br/search')) {
    return '';
  }

  // Se não começa com http:// ou https://
  if (!/^https?:\/\//i.test(clean)) {
    if (clean.startsWith('//')) {
      clean = `https:${clean}`;
    } else {
      clean = `https://${clean}`;
    }
  }

  try {
    const parsed = new URL(clean);
    // Deve ter um domínio válido (com ponto ou localhost)
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
};

/**
 * Validador que rejeita links vazios, fictícios ou URLs de busca do Google
 */
export const isValidUrl = (url) => {
  return Boolean(normalizeUrl(url));
};

/**
 * Obtém a URL de destino oficial e direta para qualquer loja ou cupom.
 * NUNCA retorna link de pesquisa do Google.
 * Prioriza sempre o link cadastrado no cupom ou na loja (normalizando se faltar https://).
 */
export const getStoreDestinationUrl = (store, coupon = {}) => {
  // 1. Link direto do cupom (prioridade máxima configurada pelo criador do cupom)
  const couponCandidates = [
    coupon?.affiliateUrl,
    coupon?.destinationUrl,
    coupon?.externalUrl,
    coupon?.storeUrl,
    coupon?.link,
    coupon?.url,
    coupon?.website,
    coupon?.site
  ];
  for (const candidate of couponCandidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) return normalized;
  }

  // 2. Link direto da loja (afiliado ou website oficial cadastrado na loja)
  const storeCandidates = [
    store?.affiliateUrl,
    store?.destinationUrl,
    store?.website,
    store?.site,
    store?.url,
    store?.link
  ];
  for (const candidate of storeCandidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) return normalized;
  }

  // 3. Busca por identificadores no dicionário oficial de parceiros
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

  // 4. Se for uma marca avulsa com nome limpo (ex: "AnyCar Consultas Veiculares" -> "https://www.anycar.com.br")
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
      if (firstWord === 'omens') return 'https://www.omens.com.br';
      if (firstWord === 'trackfield' || firstWord === 'track') return 'https://www.tf.com.br';
      if (firstWord === 'iplace') return 'https://www.iplace.com.br';
      return `https://www.${firstWord}.com.br`;
    }
  }

  // 5. Fallback seguro garantido (Home do site)
  return 'https://www.omelhorcupom.com.br';
};
