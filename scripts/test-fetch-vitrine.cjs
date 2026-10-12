// scripts/test-fetch-vitrine.cjs
const puppeteer = require('puppeteer');

(async () => {
  const storeUrl = 'https://www.magazinevoce.com.br/magazinemelhorcupom/';
  console.log('Acessando vitrine oficial:', storeUrl);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1440, height: 900 });

    const response = await page.goto(storeUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Status HTTP:', response ? response.status() : 'null');
    console.log('Título da Página:', await page.title());

    // Scroll para carregar lazy loading de imagens e produtos
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 2000));

    // Inspecionar links e elementos de produtos
    const productData = await page.evaluate(() => {
      const items = [];
      // Seletor geral de produtos na vitrine Magazine Você
      const productCards = document.querySelectorAll('li[itemtype*="Product"], [data-testid*="product"], a[href*="/p/"]');
      
      productCards.forEach((el) => {
        const linkEl = el.tagName === 'A' ? el : el.querySelector('a[href*="/p/"]');
        const imgEl = el.querySelector('img');
        const titleEl = el.querySelector('h2, h3, [class*="title"], [class*="Title"], p');
        const priceEl = el.querySelector('[class*="price"], [class*="Price"], [data-testid*="price"]');

        const title = titleEl ? titleEl.innerText.trim() : (imgEl?.alt || '');
        const image = imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : '';
        const link = linkEl ? linkEl.href : '';
        const price = priceEl ? priceEl.innerText.trim() : '';

        if (title && (link || image)) {
          items.push({ title, image, link, price });
        }
      });

      return {
        count: items.length,
        sample: items.slice(0, 5)
      };
    });

    console.log('Resultado da varredura:', JSON.stringify(productData, null, 2));
    await page.screenshot({ path: 'C:/Users/pagju/.gemini/antigravity/brain/08295bfb-65af-4486-98e9-e40cc0068eec/vitrine_magazinemelhorcupom.png' });
    console.log('Screenshot salva com sucesso!');
  } catch (err) {
    console.error('Erro ao acessar:', err.message);
  } finally {
    await browser.close();
  }
})();
