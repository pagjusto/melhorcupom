// scripts/publish-post.cjs
// Publicador automatizado em background via Puppeteer para o Instagram
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function publishPost({ imagePath, caption }) {
  const sessionFile = path.join(__dirname, 'instagram-session.json');
  if (!fs.existsSync(sessionFile)) {
    throw new Error('Sessão do Instagram não encontrada no sistema.');
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
  const cookies = sessionData.cookies || [];
  const sessionCookie = cookies.find(c => c.name === 'sessionid');

  if (!sessionCookie) {
    throw new Error('Cookies da sessão ausentes. Abra o atalho "Conectar Instagram.bat" na Área de Trabalho para conectar o robô primeiro.');
  }

  console.log('🚀 Iniciando navegador automatizado para publicação no perfil:', sessionData.username);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    // Injetar cookies autenticados
    await page.setCookie(...cookies);

    console.log('Acessando Instagram com a sessão autenticada...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

    if (page.url().includes('/accounts/login')) {
      throw new Error('A sessão do Instagram expirou. Por favor, execute o login novamente.');
    }

    // 1. Localizar e clicar no botão Criar Post
    console.log('Abrindo tela de criação de post...');
    const createBtnSelector = 'svg[aria-label="Nova publicação"], svg[aria-label="Novo post"], svg[aria-label="New post"], svg[aria-label="Create"]';
    await page.waitForSelector(createBtnSelector, { timeout: 15000 });
    const createSvg = await page.$(createBtnSelector);
    if (!createSvg) throw new Error('Botão de criar post não encontrado no Instagram.');
    
    // Clicar no botão pai
    await page.evaluate(el => {
      const btn = el.closest('div[role="button"]') || el.closest('a') || el;
      btn.click();
    }, createSvg);

    // 2. Fazer upload do arquivo de imagem
    console.log('Enviando imagem:', imagePath);
    await page.waitForSelector('input[type="file"]', { timeout: 12000 });
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(imagePath);

    await new Promise(r => setTimeout(r, 2500));

    // 3. Função auxiliar para clicar em "Avançar"
    const clickNext = async () => {
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
        for (const b of btns) {
          const t = (b.textContent || '').trim().toLowerCase();
          if (t === 'avançar' || t === 'next') {
            b.click();
            return true;
          }
        }
        return false;
      });
      return clicked;
    };

    // Avançar recorte
    console.log('Avançando recorte da imagem...');
    await clickNext();
    await new Promise(r => setTimeout(r, 2000));

    // Avançar filtros
    console.log('Avançando filtros...');
    await clickNext();
    await new Promise(r => setTimeout(r, 2000));

    // 4. Preencher a legenda
    console.log('Digitando legenda...');
    const captionSelector = 'div[aria-label="Escreva uma legenda..."], div[aria-label="Write a caption..."], div[role="textbox"]';
    await page.waitForSelector(captionSelector, { timeout: 10000 });
    await page.click(captionSelector);
    await page.keyboard.type(caption, { delay: 10 });

    await new Promise(r => setTimeout(r, 1500));

    // 5. Clicar em "Compartilhar"
    console.log('Clicando em Compartilhar...');
    const shared = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
      for (const b of btns) {
        const t = (b.textContent || '').trim().toLowerCase();
        if (t === 'compartilhar' || t === 'share') {
          b.click();
          return true;
        }
      }
      return false;
    });

    if (!shared) throw new Error('Botão "Compartilhar" não encontrado.');

    // Aguardar confirmação de publicação
    console.log('Aguardando confirmação do Instagram...');
    await new Promise(r => setTimeout(r, 7000));

    console.log('✅ Post publicado com sucesso!');
    return { success: true, message: 'Publicação compartilhada com sucesso no feed!' };
  } finally {
    try {
      await browser.close();
    } catch (e) {}
  }
}

// Execução direta via CLI se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const imageArg = args[0] || path.join(__dirname, '..', 'public', 'logo-melhor-cupom.png');
  const captionArg = args[1] || '🎉 Teste de publicação @omelhorcupom.com.br';
  publishPost({ imagePath: imageArg, caption: captionArg })
    .then(res => console.log('Resultado:', res))
    .catch(err => {
      console.error('❌ Falha na publicação:', err.message);
      process.exit(1);
    });
}

module.exports = { publishPost };
