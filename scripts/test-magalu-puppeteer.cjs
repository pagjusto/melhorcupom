// scripts/test-magalu-puppeteer.cjs
const puppeteer = require('puppeteer');

async function scrapeMagaluStore(storeUrl) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    console.log('Navegando para loja Magalu...', storeUrl);
    await page.goto(storeUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 3000));

    const products = await page.evaluate(() => {
      // Procurar cards de produtos no Magazine Você / Magalu
      const items = [];
      const links = Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="magazinevoce.com.br"]'));

      for (const link of links) {
        const href = link.href;
        const img = link.querySelector('img') || link.parentElement?.querySelector('img');
        const titleEl = link.querySelector('h2, h3, [class*="title"], [class*="Title"], p');
        const priceEl = link.querySelector('[class*="price"], [class*="Price"], [data-testid="price-value"]');

        const title = titleEl ? titleEl.innerText.trim() : (img?.alt || '');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        const priceText = priceEl ? priceEl.innerText.trim() : '';

        if (title && image && href && !href.includes('/cliente/') && !href.includes('/sac/')) {
          items.push({ title, image, href, priceText });
        }
      }
      return items.slice(0, 10);
    });

    console.log('Produtos encontrados:', products);
    return products;
  } finally {
    await browser.close();
  }
}

(async () => {
  // Teste com vitrine padrão
  await scrapeMagaluStore('https://www.magazinevoce.com.br/magazineofertas/');
})();
