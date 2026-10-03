// scripts/instagram-login.cjs
// Script interativo para efetuar login real na conta oficial do Instagram (@melhorcupom.oficial)
// e salvar a sessão autenticada (cookies e tokens) para publicação e divulgação automática.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  console.log('1. A janela do navegador abriu na tela de login oficial do Instagram.');
  console.log('2. Digite o usuário (ex: melhorcupom.oficial), e-mail ou telefone e a senha da conta.');
  console.log('3. Complete qualquer verificação necessária (código SMS, WhatsApp ou autenticador).');
  console.log('4. Quando a página carregar e você visualizar a página inicial/feed do Instagram:');
  console.log('   >>> VOLTE AQUI NO TERMINAL E PRESSIONE [ENTER] <<<\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise(resolve => {
    rl.question('Pressione [ENTER] quando tiver finalizado o login no navegador...', () => {
      resolve();
    });
  });

  console.log('\nExtraindo cookies e dados da sessão ativa...');
  const cookies = await page.cookies();

  // Verificar se há o cookie de sessão do Instagram (sessionid)
  const sessionCookie = cookies.find(c => c.name === 'sessionid');
  const dsUserCookie = cookies.find(c => c.name === 'ds_user_id');

  let username = 'melhorcupom.oficial';
  try {
    // Tentar obter o nome de usuário ativo do perfil
    const detectedUser = await page.evaluate(() => {
      const profileLinks = Array.from(document.querySelectorAll('a[href^="/"]'));
      for (const a of profileLinks) {
        const href = a.getAttribute('href') || '';
        const match = href.match(/^\/([a-zA-Z0-9._]+)\/$/);
        if (match && !['explore', 'direct', 'reels', 'stories', 'accounts', 'developer'].includes(match[1])) {
          return match[1];
        }
      }
      return null;
    });
    if (detectedUser) username = detectedUser;
  } catch (e) {
    // fallback
  }

  // Perguntar se o usuário quer confirmar o handle oficial
  await new Promise(resolve => {
    rl.question(`\nConfirme o nome de usuário do Instagram [@${username}] (ou pressione ENTER para confirmar): `, (ans) => {
      if (ans && ans.trim()) {
        username = ans.trim().replace('@', '');
      }
      rl.close();
      resolve();
    });
  });

  const sessionData = {
    connected: Boolean(sessionCookie),
    username: username.startsWith('@') ? username : `@${username}`,
    accountType: 'browser_session',
    connectedAt: new Date().toISOString(),
    cookiesCount: cookies.length,
    hasSessionId: Boolean(sessionCookie),
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
    connected: sessionData.connected,
    username: sessionData.username,
    accountType: sessionData.accountType,
    connectedAt: sessionData.connectedAt,
    cookiesCount: sessionData.cookiesCount,
    hasSessionId: sessionData.hasSessionId,
    userId: sessionData.userId
  }, null, 2), 'utf8');

  console.log('================================================================');
  if (sessionCookie) {
    console.log(`✅ Sucesso! Sessão ativa com ${cookies.length} cookies salva com sucesso.`);
    console.log(`Conta oficial vinculada: ${sessionData.username}`);
    console.log('O painel web do Melhor Cupom já identificará a conta como CONECTADA!');
    console.log('Você pode iniciar a divulgação das lojas parceiras imediatamente.');
  } else {
    console.log('⚠️ Aviso: O cookie "sessionid" não foi detectado.');
    console.log('Certifique-se de que o login foi completado com sucesso antes de pressionar Enter.');
    console.log('Os dados foram salvos para teste.');
  }
  console.log('================================================================\n');

  await browser.close();
}

loginAndSaveInstagramSession().catch(err => {
  console.error('❌ Erro no login do Instagram:', err);
});
