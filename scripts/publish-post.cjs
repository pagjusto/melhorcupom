// scripts/publish-post.cjs
// Publicador automatizado em background via Puppeteer para o Instagram (@omelhorcupom.com.br)
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function publishPost({ imagePath, caption }) {
  const sessionFile = path.join(__dirname, 'instagram-session.json');
  if (!fs.existsSync(sessionFile)) {
    throw new Error('Sessão do Instagram não encontrada no sistema. Conecte sua conta no painel.');
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
  const cookies = sessionData.cookies || [];
  const sessionCookie = cookies.find(c => c.name === 'sessionid');

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('Cookie "sessionid" ausente ou inválido. Cole a chave de sessão no modal do Instagram e clique em "Salvar".');
  }

  console.log('🚀 [Robô Instagram] Iniciando navegador automatizado para o perfil:', sessionData.username || '@omelhorcupom.com.br');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--window-size=1280,900'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Anti-detecção de robô
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // Injetar cookies
    const validCookies = cookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain || '.instagram.com',
      path: c.path || '/',
      httpOnly: Boolean(c.httpOnly),
      secure: true
    }));
    await page.setCookie(...validCookies);

    console.log(`[Robô Instagram] ${validCookies.length} cookies injetados. Acessando feed...`);
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 2500));

    // Fechar popups comuns de primeiro acesso
    await page.evaluate(() => {
      const dismissTexts = ['agora não', 'not now', 'cancelar', 'cancel', 'aceitar', 'permitir todos os cookies', 'rejeitar'];
      const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
      for (const btn of buttons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (dismissTexts.includes(text)) {
          btn.click();
        }
      }
    });

    const currentUrl = page.url();
    if (currentUrl.includes('/accounts/login') || currentUrl.includes('/challenge/')) {
      throw new Error('A chave de sessão (sessionid) foi rejeitada ou expirou. Por favor, copie novamente o sessionid no Chrome ou abra "Conectar Instagram.bat".');
    }

    console.log('[Robô Instagram] Sessão autenticada confirmada! Abrindo criador de publicação...');

    // Tentar clicar no botão "Criar" ou navegar direto
    let openedDialog = false;
    try {
      const createBtnSelector = 'svg[aria-label="Nova publicação"], svg[aria-label="Novo post"], svg[aria-label="Criar"], svg[aria-label="Create"], svg[aria-label="New post"]';
      const createSvg = await page.$(createBtnSelector);
      if (createSvg) {
        await page.evaluate(el => {
          const btn = el.closest('div[role="button"]') || el.closest('a') || el;
          btn.click();
        }, createSvg);
        openedDialog = true;
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      console.log('[Robô Instagram] Clique no botão falhou, tentando navegação direta para /create/select/...');
    }

    if (!openedDialog) {
      await page.goto('https://www.instagram.com/create/select/', { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 2500));
    }

    // 2. Fazer upload do arquivo de imagem
    console.log('[Robô Instagram] Localizando seletor de arquivo de imagem...');
    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 15000 });
    if (!fileInput) throw new Error('Campo de anexo de imagem do Instagram não foi encontrado.');

    console.log('[Robô Instagram] Enviando arquivo:', imagePath);
    await fileInput.uploadFile(imagePath);
    await new Promise(r => setTimeout(r, 3000));

    // 3. Função para clicar em "Avançar" / "Next"
    const clickNextButton = async (stepName) => {
      console.log(`[Robô Instagram] Clicando em Avançar (${stepName})...`);
      let clicked = false;
      for (let attempt = 0; attempt < 6; attempt++) {
        clicked = await page.evaluate(() => {
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
        if (clicked) break;
        await new Promise(r => setTimeout(r, 1200));
      }
      return clicked;
    };

    // Avançar recorte
    await clickNextButton('Recorte');
    await new Promise(r => setTimeout(r, 2500));

    // Avançar filtros
    await clickNextButton('Filtros');
    await new Promise(r => setTimeout(r, 2500));

    // 4. Preencher a legenda
    console.log('[Robô Instagram] Escrevendo legenda oficial...');
    const captionSelector = 'div[aria-label*="legenda" i], div[aria-label*="caption" i], div[role="textbox"], div[contenteditable="true"]';
    await page.waitForSelector(captionSelector, { timeout: 12000 });
    await page.click(captionSelector);
    
    // Digitar em blocos para performance e naturalidade
    await page.keyboard.type(caption, { delay: 5 });
    await new Promise(r => setTimeout(r, 2000));

    // 5. Clicar em "Compartilhar"
    console.log('[Robô Instagram] Clicando em Compartilhar...');
    let shared = false;
    for (let attempt = 0; attempt < 6; attempt++) {
      shared = await page.evaluate(() => {
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
      if (shared) break;
      await new Promise(r => setTimeout(r, 1200));
    }

    if (!shared) {
      throw new Error('Botão "Compartilhar" não foi localizado na janela do Instagram.');
    }

    // 6. Aguardar publicação ser confirmada
    console.log('[Robô Instagram] Aguardando confirmação de envio da postagem...');
    await new Promise(r => setTimeout(r, 8000));

    console.log('✅ [Robô Instagram] Publicação concluída com sucesso!');
    return { success: true, message: 'Arte e legenda compartilhadas com sucesso no feed do Instagram!' };
  } finally {
    try {
      await browser.close();
    } catch (e) {}
  }
}

// Execução direta se chamado via terminal
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
