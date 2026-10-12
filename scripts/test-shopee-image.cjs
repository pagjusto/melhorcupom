// scripts/test-shopee-image.cjs
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    console.log('Navegando na Shopee...');
    await page.goto('https://shopee.com.br/search?keyword=smartwatch', {
      waitUntil: 'networkidle2',
      timeout: 25000
    });

    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 2000));

    const images = await page.evaluate(() => {
      const allImgs = Array.from(document.querySelectorAll('img'));
      return allImgs
        .map(i => i.src)
        .filter(s => s && (s.includes('susercontent.com') || s.includes('shopee')));
    });

    console.log('Imagens encontradas:', images.slice(0, 10));
    await browser.close();
  } catch (err) {
    console.error('Erro:', err.message);
  }
})();
