// scripts/inspect-magalu-html.cjs
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log('Navegando...');
  await page.goto('https://www.magazinevoce.com.br/magazineofertas/', { waitUntil: 'networkidle2', timeout: 25000 });
  
  const info = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      imgs: Array.from(document.querySelectorAll('img')).map(i => i.src).slice(0, 5),
      linksCount: document.querySelectorAll('a').length
    };
  });
  console.log('Page info:', info);
  await browser.close();
})();
