// scripts/meli-login.cjs
// Script interativo para efetuar login na conta de Afiliado Mercado Livre e salvar cookies da sessão
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function loginAndSaveCookies() {
  console.log('====================================================');
  console.log('🛒 MERCADO LIVRE - LOGIN DE AFILIADO & SESSÃO');
  console.log('====================================================');
  console.log('\nIniciando navegador com interface visual...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // User Agent comum de desktop para evitar bloqueios
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log('Abrindo Mercado Livre...');
  await page.goto('https://www.mercadolivre.com.br/', { waitUntil: 'networkidle2' });

  console.log('\n👉 INSTRUÇÃO:');
  console.log('1. A janela do navegador abriu.');
  console.log('2. Clique em "Entre" no topo do Mercado Livre e faça login na sua conta de Afiliado.');
  console.log('3. Complete qualquer verificação (SMS / WhatsApp / Captcha) normalmente.');
  console.log('4. Quando estiver logado e a página inicial do Mercado Livre carregar com seu nome:');
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

  const cookiesPath = path.join(__dirname, 'meli-cookies.json');
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf8');

  console.log(`✅ Sucesso! ${cookies.length} cookies da sessão salvos em scripts/meli-cookies.json`);
  console.log('Agora o robô headless pode navegar e gerar links encurtados de afiliado automaticamente.');

  await browser.close();
}

loginAndSaveCookies().catch(err => {
  console.error('❌ Erro no login:', err);
});
