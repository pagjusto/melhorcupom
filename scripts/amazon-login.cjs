// scripts/amazon-login.cjs
// Script interativo para efetuar login na conta de Associados da Amazon Brasil e salvar cookies da sessão
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function loginAndSaveCookies() {
  console.log('====================================================');
  console.log('📦 AMAZON BRASIL - LOGIN DE ASSOCIADOS & SESSÃO');
  console.log('====================================================');
  console.log('\nIniciando navegador com interface visual...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log('Abrindo Amazon Brasil...');
  await page.goto('https://www.amazon.com.br/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com.br%2F&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=brflex&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0', { waitUntil: 'networkidle2' });

  console.log('\n👉 INSTRUÇÃO:');
  console.log('1. A janela do navegador abriu na tela de login da Amazon.');
  console.log('2. Faça login com a sua conta do Programa de Associados Amazon.');
  console.log('3. Complete qualquer verificação (Código por e-mail, SMS ou App Autenticador).');
  console.log('4. Quando a página inicial carregar e você visualizar a barra SiteStripe no topo:');
  console.log('   >>> VOLTE AQUI NO TERMINAL E PRESSIONE [ENTER] <<<');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise(resolve => {
    rl.question('\nPressione [ENTER] quando tiver finalizado o login no navegador...', () => {
      rl.close();
      resolve();
    });
  });

  console.log('\nExtraindo cookies da sessão ativa...');
  const cookies = await page.cookies();

  const cookiesPath = path.join(__dirname, 'amazon-cookies.json');
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf8');

  console.log(`✅ Sucesso! ${cookies.length} cookies da sessão salvos em scripts/amazon-cookies.json`);
  console.log('Agora o robô headless pode navegar e gerar links amzn.to do SiteStripe automaticamente.');

  await browser.close();
}

loginAndSaveCookies().catch(err => {
  console.error('❌ Erro no login Amazon:', err);
});
