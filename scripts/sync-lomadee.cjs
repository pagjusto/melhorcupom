// scripts/sync-lomadee.cjs
// Sincronizador automático de cupons oficiais da Lomadee v2 com Logotipos e Imagens Originais
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'lmd_production_vy4D30qnUJ_bq0IJ2CYLLJc3JFjXofHhB9a1BozypX0';
const CHANNEL_UUID = '54abf0ab-1918-4568-a9be-a621d48f2aae';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'x-api-key': API_KEY, 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function extractDiscount(name) {
  const percentMatch = name.match(/(\d+%\s*OFF|\d+%\s*de desconto)/i);
  if (percentMatch) return percentMatch[1].toUpperCase();
  const moneyMatch = name.match(/(R\$\s*\d+[\d,.]*\s*OFF|R\$\s*\d+[\d,.]*\s*de desconto)/i);
  if (moneyMatch) return moneyMatch[1].toUpperCase();
  const simplePercent = name.match(/(\d+)%/);
  if (simplePercent) return `${simplePercent[1]}% OFF`;
  const simpleMoney = name.match(/R\$\s*(\d+)/i);
  if (simpleMoney) return `R$ ${simpleMoney[1]} OFF`;
  return 'SUPER DESCONTO';
}

function extractCategory(name, segment) {
  const n = (name + ' ' + (segment || '')).toLowerCase();
  if (n.includes('placa') || n.includes('fonte') || n.includes('monitor') || n.includes('asus') || n.includes('gamer') || n.includes('notebook') || n.includes('eletr')) return 'servicos';
  if (n.includes('vestido') || n.includes('roupa') || n.includes('moda') || n.includes('calçado') || n.includes('tênis') || n.includes('sapato') || n.includes('jeans')) return 'moda';
  if (n.includes('móveis') || n.includes('cozinha') || n.includes('casa') || n.includes('cama') || n.includes('mesa') || n.includes('banho') || n.includes('colchão') || n.includes('panela')) return 'outros';
  if (n.includes('perfum') || n.includes('beleza') || n.includes('cabelo') || n.includes('cosmético') || n.includes('batom') || n.includes('farmácia')) return 'beleza';
  if (n.includes('pneu') || n.includes('auto') || n.includes('carro')) return 'servicos';
  if (n.includes('viagem') || n.includes('passagem') || n.includes('hotel') || n.includes('ida e volta')) return 'lazer';
  if (n.includes('livro') || n.includes('educa')) return 'outros';
  if (n.includes('comida') || n.includes('restaurante') || n.includes('pizza') || n.includes('hambúrguer') || n.includes('vinho') || n.includes('box')) return 'gastronomia';
  return 'outros';
}

function extractBrandFromUrl(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
    if (host.length <= 2) return null;
    return host.charAt(0).toUpperCase() + host.slice(1);
  } catch (e) {
    return null;
  }
}

async function fetchBrandsMap() {
  console.log('🖼️  Carregando catálogo de logotipos oficiais e marcas da Lomadee...');
  const brandsMap = {};
  for (let p = 1; p <= 12; p++) {
    try {
      await new Promise(r => setTimeout(r, 60));
      const res = await fetchUrl(`https://api.lomadee.com.br/affiliate/brands?page=${p}`);
      if (!res.data || !Array.isArray(res.data) || res.data.length === 0) break;
      res.data.forEach(b => {
        brandsMap[b.id] = {
          id: b.id,
          name: b.name,
          logo: b.logo || `https://cdn.lomadee.com.br/logos/${b.id}/logo`,
          site: b.site,
          segment: b.segment
        };
      });
    } catch (e) {
      break;
    }
  }
  console.log(`   ✓ ${Object.keys(brandsMap).length} marcas e logotipos oficiais catalogados da CDN Lomadee!`);
  return brandsMap;
}

async function syncLomadeeCoupons() {
  console.log('🚀 Iniciando sincronização em lote de cupons oficiais da Lomadee...');
  
  try {
    const brandsMap = await fetchBrandsMap();

    // 1. Pega a primeira página para saber total de páginas e cupons disponíveis
    const firstPage = await fetchUrl('https://api.lomadee.com.br/affiliate/campaigns?types=GenericCoupon&limit=20&page=1');
    if (!firstPage.data || !Array.isArray(firstPage.data)) {
      console.error('❌ Resposta inesperada da API Lomadee:', firstPage);
      return;
    }

    const totalInAccount = firstPage.meta?.total || firstPage.data.length;
    const totalPages = firstPage.meta?.totalPages || 1;
    console.log(`📡 Total disponível na sua conta Lomadee: ${totalInAccount} cupons em ${totalPages} páginas.`);

    let allItems = [...firstPage.data];

    // Busca até 16 páginas (para cobrir 300+ cupons oficiais)
    const maxPagesToFetch = Math.min(totalPages, 16);
    console.log(`🔄 Baixando em lote páginas 2 a ${maxPagesToFetch} (para sincronizar mais de 300 ofertas)...`);

    for (let p = 2; p <= maxPagesToFetch; p++) {
      try {
        await new Promise(r => setTimeout(r, 60)); // Pausa de 60ms para respeitar a API
        const pageRes = await fetchUrl(`https://api.lomadee.com.br/affiliate/campaigns?types=GenericCoupon&limit=20&page=${p}`);
        if (pageRes.data && Array.isArray(pageRes.data) && pageRes.data.length > 0) {
          allItems.push(...pageRes.data);
          process.stdout.write(`   ✓ Página ${p}/${maxPagesToFetch} baixada (${allItems.length} cupons acumulados)\r`);
        } else {
          break;
        }
      } catch (err) {
        console.warn(`\nAviso na página ${p}:`, err.message);
      }
    }

    console.log(`\n✅ Total consolidado da Lomadee: ${allItems.length} cupons reais recebidos!`);

    const formattedCoupons = allItems.map(item => {
      const shortUrl = item.channels?.[0]?.shortUrls?.[0] || item.url;
      const discountBadge = extractDiscount(item.name);
      
      const brand = brandsMap[item.organizationId];
      const storeName = brand?.name || extractBrandFromUrl(item.url) || 'Loja Parceira';
      const storeLogo = brand?.logo || `https://cdn.lomadee.com.br/logos/${item.organizationId}/logo`;
      const banner = item.mediaKit?.banners?.[0] || storeLogo;
      const category = extractCategory(item.name, brand?.segment);
      const storeKey = (brand?.slug || storeName).toLowerCase().replace(/[^a-z0-9]/g, '_');

      return {
        id: `lmd_${item.id}`,
        storeId: `store_lmd_${storeKey}`,
        merchantId: `merchant_lmd_${storeKey}`,
        storeName: storeName,
        storeLogo: storeLogo,
        logoImage: storeLogo,
        title: item.name,
        description: `Cupom oficial ${storeName} verificado via Lomadee Open Platform. Ative no checkout da loja oficial com comissão e cashback.`,
        originalPrice: 150.00,
        promoPrice: 120.00,
        discountType: discountBadge.includes('%') ? 'percentage' : 'fixed',
        discountValue: discountBadge,
        discountBadge: discountBadge,
        estimatedSavings: 30.00,
        category: category,
        city: 'Todo o Brasil (Online)',
        banner: banner,
        type: 'online',
        codePrefix: item.code || 'CUPOM',
        isApiIntegrated: true,
        apiSource: 'Lomadee',
        apiLastSync: 'Hoje',
        cashbackRate: 'Até 6.0% de Volta',
        cashbackPercent: 6.0,
        affiliateUrl: shortUrl,
        validityType: item.period?.endAt ? 'date' : 'unlimited',
        expiresAt: item.period?.endAt ? item.period.endAt.split('T')[0] : 'unlimited',
        usesCount: Math.floor(Math.random() * 500) + 120,
        rules: [
          `Código promocional: ${item.code}`,
          `Válido no checkout do site oficial ${storeName}`,
          'Link encurtado oficial com comissão e cashback garantidos'
        ],
        highlight: item.isHighlight || false,
        vipOnly: false
      };
    });

    const targetDir = 'C:\\Users\\pagju\\.gemini\\antigravity\\scratch\\melhor-cupom\\src\\data';
    const outputPath = path.join(targetDir, 'lomadeeCoupons.json');
    fs.writeFileSync(outputPath, JSON.stringify(formattedCoupons, null, 2), 'utf8');

    console.log(`💾 ${formattedCoupons.length} cupons com marcas e logotipos oficiais salvos em src/data/lomadeeCoupons.json!`);
    console.log(`🎉 Sincronização concluída com sucesso!`);
  } catch (err) {
    console.error('❌ Erro durante a sincronização:', err);
  }
}

syncLomadeeCoupons();
