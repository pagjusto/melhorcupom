const https = require('https');

const url = 'https://shopee.com.br/Rel%C3%B3gio-Smartwatch-7-em-1-S%C3%A9rie-9-Ultra-com-7-Pulseiras-Original-Envio-Imediato-i.872424585.23098008625';

https.get(url, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
    const ogTitleMatch = data.match(/property="og:title"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:title"/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'None');
    console.log('og:title:', ogTitleMatch ? ogTitleMatch[1] : 'None');
    console.log('Length:', data.length);
  });
}).on('error', err => console.error(err));
