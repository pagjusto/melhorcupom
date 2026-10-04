// scripts/instagram-login.cjs
// Script interativo com detecção automática para efetuar login real na conta oficial do Instagram (@melhorcupom.oficial)
// e salvar a sessão autenticada (cookies e tokens) para publicação e divulgação automática.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function loginAndSaveInstagramSession() {
  console.log('================================================================');
  console.log('📸 MELHOR CUPOM - LOGIN OFICIAL DO INSTAGRAM');
  console.log('================================================================');
  console.log('\nIniciando navegador com interface visual...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  
  // User Agent moderno de desktop para compatibilidade com o Instagram
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

  console.log('Abrindo tela de login do Instagram...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

  console.log('\n👉 INSTRUÇÕES DE LOGIN:');
  console.log('1. Uma janela do navegador foi aberta na tela oficial do Instagram na sua tela.');
  console.log('2. Faça login com o seu usuário (@melhorcupom.oficial ou seu @ oficial) e senha.');
  console.log('3. Complete qualquer verificação necessária (código de segurança, SMS, etc.).');
  console.log('4. O sistema irá DETECTAR O SEU LOGIN AUTOMATICAMENTE assim que você entrar!\n');
  console.log('Aguardando login no Instagram (detecção automática ativa)...');

  let isBrowserOpen = true;
  browser.on('disconnected', () => {
    isBrowserOpen = false;
  });

  let sessionCookie = null;
  let dsUserCookie = null;
  let cookies = [];
  const maxWaitMs = 15 * 60 * 1000; // 15 minutos de timeout
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (!isBrowserOpen || browser.connected === false) {
      console.log('Navegador foi fechado pelo usuário.');
      break;
    }

    try {
      if (page.isClosed()) {
        console.log('Aba de navegação fechada.');
        break;
      }

      cookies = await page.cookies();
      sessionCookie = cookies.find(c => c.name === 'sessionid');
      dsUserCookie = cookies.find(c => c.name === 'ds_user_id');

      if (sessionCookie) {
        console.log('\n🎉 SUCESSO! Cookie de login "sessionid" detectado com sucesso!');
        await new Promise(r => setTimeout(r, 2000));
        break;
      }
    } catch (err) {
      if (err.message && (err.message.includes('Target closed') || err.message.includes('Session closed'))) {
        console.log('Janela fechada pelo usuário.');
        break;
      }
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  // Tentar obter o nome de usuário ativo do perfil se o login foi realizado
  let username = 'melhorcupom.oficial';
  if (sessionCookie) {
    try {
      const detectedUser = await page.evaluate(() => {
        const blacklist = ['explore', 'direct', 'reels', 'reel', 'stories', 'accounts', 'developer', 'popular', 'about', 'legal', 'privacy', 'terms', 'help', 'api', 'directory', 'login', 'emails'];
        const profileLinks = Array.from(document.querySelectorAll('a[href^="/"]'));
        for (const a of profileLinks) {
          const href = a.getAttribute('href') || '';
          const match = href.match(/^\/([a-zA-Z0-9._]+)\/?$/);
          if (match && !blacklist.includes(match[1].toLowerCase())) {
            return match[1];
          }
        }
        return null;
      });
      if (detectedUser) username = detectedUser;
    } catch (e) {}

    const finalUsername = username.startsWith('@') ? username : `@${username}`;

    const sessionData = {
      connected: true,
      username: finalUsername,
      accountType: 'browser_session',
      connectedAt: new Date().toISOString(),
      cookiesCount: cookies.length,
      hasSessionId: true,
      userId: dsUserCookie ? dsUserCookie.value : null,
      cookies: cookies
    };

    // Salvar em scripts/instagram-session.json
    const sessionFile = path.join(__dirname, 'instagram-session.json');
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf8');

    // Salvar também em public/instagram-session.json para o painel web detectar em tempo real
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicSessionFile = path.join(publicDir, 'instagram-session.json');
    fs.writeFileSync(publicSessionFile, JSON.stringify({
      connected: true,
      username: sessionData.username,
      accountType: sessionData.accountType,
      connectedAt: sessionData.connectedAt,
      cookiesCount: sessionData.cookiesCount,
      hasSessionId: true,
      userId: sessionData.userId
    }, null, 2), 'utf8');

    console.log('================================================================');
    console.log(`✅ Sucesso! Sessão ativa com ${cookies.length} cookies salva com sucesso.`);
    console.log(`Conta oficial vinculada: ${sessionData.username}`);
    console.log('O painel web do Melhor Cupom já identificará a conta como CONECTADA!');
    console.log('Você pode iniciar a divulgação das lojas parceiras imediatamente.');
    console.log('================================================================\n');
  } else {
    console.log('================================================================');
    console.log('⚠️ Aviso: A janela foi fechada sem login detectado.');
    console.log('================================================================\n');
  }

  try {
    if (browser.connected) {
      await browser.close();
    }
  } catch (e) {}
}

loginAndSaveInstagramSession().catch(err => {
  console.error('❌ Erro no login do Instagram:', err);
});
