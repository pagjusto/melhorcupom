// scripts/test-metadata.cjs
const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchUrlMetadata(targetUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return resolve({ error: 'Too many redirects' });

    try {
      const parsedUrl = new URL(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      };

      const req = client.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = new URL(res.headers.location, targetUrl).toString();
          return resolve(fetchUrlMetadata(nextUrl, maxRedirects - 1));
        }

        let data = '';
        res.on('data', chunk => {
          if (data.length < 500000) data += chunk; // limite 500KB
        });

        res.on('end', () => {
          const ogImageMatch = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                               data.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
          const ogTitleMatch = data.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                               data.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
          const ogPriceMatch = data.match(/<meta[^>]*property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i);

          resolve({
            success: true,
            statusCode: res.statusCode,
            finalUrl: targetUrl,
            image: ogImageMatch ? ogImageMatch[1] : null,
            title: ogTitleMatch ? ogTitleMatch[1] : null,
            price: ogPriceMatch ? ogPriceMatch[1] : null
          });
        });
      });

      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout ao conectar' });
      });
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

(async () => {
  const result = await fetchUrlMetadata('https://shopee.com.br');
  console.log('Shopee Home Metadata:', result);
})();
