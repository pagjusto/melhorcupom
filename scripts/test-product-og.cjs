// scripts/test-product-og.cjs
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');

    console.log('Acessando página...');
    // Exemplo de busca ou produto
    await page.goto('https://shopee.com.br', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const og = await page.evaluate(() => {
      const el = document.querySelector('meta[property="og:image"]');
      return el ? el.content : null;
    });
    console.log('OG Image:', og);
    await browser.close();
  } catch (e) {
    console.error(e.message);
  }
})();
