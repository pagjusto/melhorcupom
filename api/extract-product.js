// api/extract-product.js
// Endpoint serverless para extrair imagem real e dados do anúncio a partir do link da Shopee/qualquer loja
import https from 'https';
import http from 'http';
import { URL } from 'url';

function fetchUrlMetadata(targetUrl, maxRedirects = 6) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ success: false, error: 'Muitos redirecionamentos' });

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
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
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
          if (data.length < 800000) data += chunk;
        });

        res.on('end', () => {
          // Extrair og:image
          const ogImageMatch = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                               data.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                               data.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);

          // Extrair og:title
          const ogTitleMatch = data.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                               data.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
                               data.match(/<title>([^<]+)<\/title>/i);

          // Extrair og:description
          const ogDescMatch = data.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                              data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

          // Extrair og:price se houver
          const ogPriceMatch = data.match(/<meta[^>]*property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i);

          let image = ogImageMatch ? ogImageMatch[1] : null;
          let title = ogTitleMatch ? ogTitleMatch[1] : null;
          let description = ogDescMatch ? ogDescMatch[1] : null;

          if (title) {
            title = title
              .replace(/\|\s*Shopee Brasil.*$/i, '')
              .replace(/na Shopee Brasil!.*$/i, '')
              .replace(/compre na Shopee.*$/i, '')
              .trim();
          }

          resolve({
            success: true,
            finalUrl: targetUrl,
            image,
            title,
            description,
            price: ogPriceMatch ? parseFloat(ogPriceMatch[1]) : null
          });
        });
      });

      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout ao acessar anúncio' });
      });
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  const rawUrl = (req.method === 'POST' ? req.body?.url : req.query?.url) || '';

  if (!rawUrl || !rawUrl.startsWith('http')) {
    return res.status(400).json({ success: false, error: 'URL do anúncio inválida ou não informada.' });
  }

  try {
    const meta = await fetchUrlMetadata(rawUrl.trim());
    return res.status(200).json(meta);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
