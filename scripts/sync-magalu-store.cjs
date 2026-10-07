// scripts/sync-magalu-store.cjs
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const STORE_URL = 'https://www.magazinevoce.com.br/magazinemelhorcupom/';

async function syncMagaluOffers() {
  console.log(`[Robô Magalu] Iniciando varredura na loja: ${STORE_URL}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto(STORE_URL, { waitUntil: 'networkidle2', timeout: 35000 });
    
    // Rolar a página para baixo para carregar os carrosséis e vitrines
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, 700));
      await new Promise(r => setTimeout(r, 1000));
    }

    const scrapedProducts = await page.evaluate((storeBase) => {
      const items = [];
      const links = Array.from(document.querySelectorAll('a[href*="/p/"]'));

      for (const a of links) {
        const href = a.href;
        if (!href || items.some(x => x.href === href)) continue;

        // Container do card
        const card = a.closest('li') || a;
        const img = card.querySelector('img');
        const imgSrc = img ? (img.src || img.getAttribute('data-src') || '') : '';

        // Título
        const titleEl = card.querySelector('h2, h3, [class*="title"], [class*="Title"], p[title]') ||
                        Array.from(card.querySelectorAll('p')).find(p => p.innerText.length > 15 && !p.innerText.includes('R$'));
        
        let title = titleEl ? titleEl.innerText.trim() : (img?.alt || '');
        if (!title || title.toLowerCase() === 'full' || title.toLowerCase() === 'mercado full') {
          if (img?.alt && img.alt.length > 5) title = img.alt.trim();
        }

        // Preços
        const cardText = card.innerText || '';
        const priceMatches = cardText.match(/R\$\s*([\d\.,]+)/g) || [];
        
        let originalPrice = 0;
        let promoPrice = 0;

        if (priceMatches.length >= 2) {
          const p1 = parseFloat(priceMatches[0].replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
          const p2 = parseFloat(priceMatches[priceMatches.length - 1].replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
          if (p1 > p2) {
            originalPrice = p1;
            promoPrice = p2;
          } else {
            originalPrice = p2 * 1.3;
            promoPrice = p2;
          }
        } else if (priceMatches.length === 1) {
          promoPrice = parseFloat(priceMatches[0].replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
          originalPrice = promoPrice * 1.25;
        }

        // Categorizar automaticamente
        let category = 'utilidades';
        let categoryLabel = 'Achadinhos & Utilidades';
        const tLower = title.toLowerCase();

        if (tLower.includes('smartphone') || tLower.includes('moto') || tLower.includes('galaxy') || tLower.includes('iphone') || tLower.includes('tv') || tLower.includes('fone') || tLower.includes('notebook')) {
          category = 'tech';
          categoryLabel = 'Tecnologia & Gadgets';
        } else if (tLower.includes('talher') || tLower.includes('bowl') || tLower.includes('panela') || tLower.includes('inox') || tLower.includes('air fryer') || tLower.includes('fogão') || tLower.includes('cafeteira') || tLower.includes('papel higiênico')) {
          category = 'casa';
          categoryLabel = 'Casa & Cozinha';
        } else if (tLower.includes('perfume') || tLower.includes('creme') || tLower.includes('shampoo') || tLower.includes('cabelo') || tLower.includes('pele') || tLower.includes('beleza')) {
          category = 'beleza';
          categoryLabel = 'Beleza & Cuidados';
        }

        if (title && imgSrc && promoPrice > 0 && imgSrc.startsWith('http') && !imgSrc.includes('error/temnomagalu.gif')) {
          const discountPercent = Math.max(5, Math.round(((originalPrice - promoPrice) / originalPrice) * 100));
          items.push({
            id: `deal_magalu_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            title,
            image: imgSrc,
            category,
            categoryLabel,
            originalPrice: Math.round(originalPrice * 100) / 100,
            promoPrice: Math.round(promoPrice * 100) / 100,
            discountBadge: `${discountPercent}% OFF`,
            discountPercent,
            savings: Math.round((originalPrice - promoPrice) * 100) / 100,
            rating: 4.8,
            salesCount: 'Mais Vendido Magalu',
            tag: '💙 Oferta Oficial Magalu',
            badgeColor: 'bg-blue-600',
            freeShipping: true,
            store: 'Magazine Luiza',
            affiliateUrl: href,
            description: `Produto oficial vendido e entregue com a garantia Magazine Luiza e comissão do parceiro ${storeBase}.`
          });
        }
      }

      return items;
    }, STORE_URL);

    console.log(`[Robô Magalu] Varredura finalizada. ${scrapedProducts.length} produtos oficiais capturados com sucesso!`);
    return scrapedProducts;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  syncMagaluOffers().then(res => {
    console.log('Total:', res.length);
    console.log('Exemplo 1:', res[0]);
  });
}

module.exports = { syncMagaluOffers };
