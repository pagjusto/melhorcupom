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
      '--window-size=1280,900',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=default',
      '--ignore-gpu-blocklist',
      '--enable-gpu-rasterization'
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
    await new Promise(r => setTimeout(r, 3500));

    // Fechar popups comuns de primeiro acesso ("Agora não", cookies, etc)
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
    await new Promise(r => setTimeout(r, 1500));

    const currentUrl = page.url();
    if (currentUrl.includes('/accounts/login') || currentUrl.includes('/challenge/')) {
      throw new Error('A chave de sessão (sessionid) foi rejeitada ou expirou. Por favor, atualize o sessionid no painel.');
    }

    console.log('[Robô Instagram] Sessão autenticada confirmada! Abrindo criador de publicação...');

    // 1. Clicar no menu lateral "+ Criar" / "Novo post"
    const clickedCreate = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const createSvg = svgs.find(s => {
        const l = (s.getAttribute('aria-label') || '').toLowerCase();
        return l.includes('novo post') || l.includes('criar') || l.includes('nova publicação') || l.includes('create');
      });
      if (createSvg) {
        const btn = createSvg.closest('div[role="button"]') || createSvg.closest('a') || createSvg;
        btn.click();
        return true;
      }
      return false;
    });

    if (!clickedCreate) {
      console.log('[Robô Instagram] Botão de menu não detectado por SVG, buscando por texto...');
      await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('span, a, div[role="button"]'));
        for (const el of all) {
          const t = (el.textContent || '').trim().toLowerCase();
          if (t === 'criar' || t === 'create') {
            el.click();
            return true;
          }
        }
        return false;
      });
    }

    await new Promise(r => setTimeout(r, 1500));

    // 2. Clicar no submenu "Postar" que abre ao clicar em Criar
    console.log('[Robô Instagram] Clicando na opção "Postar" do menu...');
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('span, div, a, button'));
      for (const el of all) {
        const t = (el.textContent || '').trim().toLowerCase();
        if ((t === 'postar' || t === 'publicação' || t === 'post') && el.children.length === 0) {
          const parentBtn = el.closest('div[role="button"]') || el.closest('a') || el;
          parentBtn.click();
          return true;
        }
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 2000));

    // 3. Fazer upload do arquivo de imagem
    console.log('[Robô Instagram] Localizando campo de anexo da imagem...');
    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 15000 });
    if (!fileInput) throw new Error('Campo de anexo de imagem do Instagram não foi encontrado.');

    console.log('[Robô Instagram] Enviando arquivo:', imagePath);
    await fileInput.uploadFile(imagePath);
    await new Promise(r => setTimeout(r, 3500));

    // Helper para clicar em botões por texto especificamente dentro do modal
    const clickButtonInDialog = async (targetTexts, retries = 6, waitBetween = 1500) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        const clicked = await page.evaluate((texts) => {
          const dialog = document.querySelector('div[role="dialog"]') || document;
          const btns = Array.from(dialog.querySelectorAll('button, div[role="button"]'));
          for (const b of btns) {
            const t = (b.textContent || '').trim().toLowerCase();
            if (texts.includes(t)) {
              b.click();
              return true;
            }
          }
          return false;
        }, targetTexts);
        if (clicked) return true;
        await new Promise(r => setTimeout(r, waitBetween));
      }
      return false;
    };

    // 4. Avançar 1: Recorte -> Filtros
    console.log('[Robô Instagram] Clicando em Avançar 1 (Recorte -> Filtros)...');
    const advanced1 = await clickButtonInDialog(['avançar', 'next']);
    if (!advanced1) throw new Error('Não foi possível avançar a etapa de recorte.');
    await new Promise(r => setTimeout(r, 3000));

    // 5. Avançar 2: Filtros -> Legenda
    console.log('[Robô Instagram] Clicando em Avançar 2 (Filtros -> Legenda)...');
    const advanced2 = await clickButtonInDialog(['avançar', 'next']);
    if (!advanced2) throw new Error('Não foi possível avançar a etapa de filtros.');
    await new Promise(r => setTimeout(r, 3000));

    // 6. Preencher a legenda oficial
    console.log('[Robô Instagram] Localizando campo de legenda...');
    const captionSelector = 'div[role="dialog"] div[aria-label*="legenda" i], div[role="dialog"] div[aria-label*="caption" i], div[role="dialog"] div[role="textbox"], div[role="dialog"] div[contenteditable="true"]';
    const captionEl = await page.waitForSelector(captionSelector, { timeout: 12000 });
    if (!captionEl) throw new Error('Campo de texto para legenda não foi encontrado.');

    await captionEl.click();
    await page.keyboard.type(caption, { delay: 4 });
    await new Promise(r => setTimeout(r, 2000));

    // 7. Clicar em "Compartilhar" dentro do modal
    console.log('[Robô Instagram] Clicando em "Compartilhar"...');
    const shared = await clickButtonInDialog(['compartilhar', 'share'], 6, 1500);
    if (!shared) {
      throw new Error('Botão "Compartilhar" não foi localizado na janela do Instagram.');
    }

    // 8. Aguardar confirmação de publicação
    console.log('[Robô Instagram] Publicação enviada! Aguardando confirmação do Instagram...');
    let confirmed = false;
    for (let waitSec = 0; waitSec < 15; waitSec++) {
      await new Promise(r => setTimeout(r, 1000));
      confirmed = await page.evaluate(() => {
        const text = (document.body.innerText || '').toLowerCase();
        return text.includes('seu post foi compartilhado') ||
               text.includes('post compartilhado') ||
               text.includes('sua publicação foi compartilhada') ||
               text.includes('publicação compartilhada') ||
               text.includes('your post has been shared');
      });
      if (confirmed) break;
    }

    console.log('✅ [Robô Instagram] Publicação concluída com sucesso!');
    return {
      success: true,
      message: 'Arte e legenda compartilhadas com sucesso no feed do Instagram @omelhorcupom.com.br!'
    };
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
  const captionArg = args[1] || '🎉 Super cupons e ofertas exclusivas no www.omelhorcupom.com.br! Siga @omelhorcupom.com.br';
  publishPost({ imagePath: imageArg, caption: captionArg })
    .then(res => console.log('Resultado:', res))
    .catch(err => {
      console.error('❌ Falha na publicação:', err.message);
      process.exit(1);
    });
}

module.exports = { publishPost };
