const https = require('https');

https.get('https://www.omelhorcupom.com.br', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scripts = data.match(/assets\/index-[^"]+\.js/g);
    console.log('HTML retornado com status:', res.statusCode);
    console.log('Arquivos JS em produção:', scripts);
  });
}).on('error', console.error);
