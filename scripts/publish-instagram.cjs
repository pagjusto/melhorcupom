// scripts/publish-instagram.cjs
// Script para testar a sessão do Instagram ou automatizar a publicação de criativos promocionais.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testOrPublishInstagram() {
  console.log('================================================================');
  console.log('🚀 MELHOR CUPOM - PUBLICADOR DO INSTAGRAM');
  console.log('================================================================');

  const sessionFile = path.join(__dirname, 'instagram-session.json');
  if (!fs.existsSync(sessionFile)) {
    console.log('\n❌ Nenhuma sessão salva do Instagram foi encontrada.');
    console.log('Execute primeiro o comando de login:');
    console.log('   npm run instagram:login\n');
    process.exit(1);
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
  console.log(`Conta configurada: ${sessionData.username}`);
  console.log(`Cookies armazenados: ${sessionData.cookiesCount || sessionData.cookies?.length || 0}`);
  console.log(`Conectado em: ${sessionData.connectedAt || 'N/A'}`);

  console.log('\nIniciando navegador para verificar autenticação ativa...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

  // Carregar cookies da sessão
  if (Array.isArray(sessionData.cookies) && sessionData.cookies.length > 0) {
    await page.setCookie(...sessionData.cookies);
    console.log('Cookies da sessão aplicados ao navegador.');
  }

  console.log('Acessando Instagram com a sessão autenticada...');
  await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

  console.log('\nVerificando status da sessão...');
  const currentUrl = page.url();

  if (currentUrl.includes('/accounts/login')) {
    console.log('⚠️ A sessão expirou ou precisa de novo login.');
    console.log('Execute: npm run instagram:login para renovar o acesso.');
  } else {
    console.log(`✅ Sessão ativa e autenticada com sucesso no perfil ${sessionData.username}!`);
    console.log('A janela do navegador está aberta no Instagram para você publicar ou conferir.');
    console.log('Pressione Ctrl+C para encerrar o script quando terminar.');
  }
}

testOrPublishInstagram().catch(err => {
  console.error('❌ Erro no publicador:', err);
});
