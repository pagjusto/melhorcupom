// scripts/test-magalu-scraper.cjs
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Testar se conseguimos ler vitrine do Magazine Você
async function testMagaluStore(storeUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(storeUrl);
      const req = https.get(storeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      }, (res) => {
        let html = '';
        res.on('data', c => { if (html.length < 500000) html += c; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            length: html.length,
            titleMatch: html.match(/<title>([^<]+)<\/title>/i)?.[1]
          });
        });
      });
      req.on('error', e => resolve({ error: e.message }));
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

(async () => {
  const res = await testMagaluStore('https://www.magazinevoce.com.br');
  console.log('Result:', res);
})();
