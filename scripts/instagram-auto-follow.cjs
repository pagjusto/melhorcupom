// scripts/instagram-auto-follow.cjs
// Automação Segura de Seguimento Segmentado no Instagram (Melhor Cupom)
// Configurado com limites anti-ban: 60 a 80/dia, lotes de 10-15, delays humanos de 45-100s.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURAÇÕES DE SEGURANÇA ANTIBAN (LIMITES RÍGIDOS)
// ============================================================================
const CONFIG = {
  // Perfis referência de onde buscar seguidores altamente interessados em cupons e promoções
  TARGET_ACCOUNTS: [
    'promobitoficial',
    'pelando_br',
    'cuponomia',
    'gatryoficial',
    'manualdomundo'
  ],
  
  // Limite máximo diário recomendado para evitar bloqueios da Meta
  MAX_DAILY_FOLLOWS: 60,
  
  // Quantidade de pessoas a seguir por execução desta rodada (lote seguro)
  BATCH_SIZE: 12,
  
  // Intervalo aleatório em segundos entre cada clique em "Seguir"
  MIN_DELAY_SECONDS: 45,
  MAX_DELAY_SECONDS: 105,
  
  // Executar com interface gráfica visível para poder acompanhar
  HEADLESS: false
};

const SESSION_FILE = path.join(__dirname, 'instagram-session.json');
const HISTORY_FILE = path.join(__dirname, 'instagram-history.json');

// Função auxiliar para delays aleatórios
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay(minSec, maxSec) {
  return Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000;
}

// Obter a data atual no formato YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Carregar histórico de execuções
function loadHistory() {
  const today = getTodayString();
  if (!fs.existsSync(HISTORY_FILE)) {
    return { date: today, followedToday: 0, allFollowed: [] };
  }

  try {
    const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    if (data.date !== today) {
      data.date = today;
      data.followedToday = 0; // Reinicia cota para o novo dia
    }
    if (!Array.isArray(data.allFollowed)) {
      data.allFollowed = [];
    }
    return data;
  } catch {
    return { date: today, followedToday: 0, allFollowed: [] };
  }
}

// Salvar histórico atualizado
function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

async function runAutoFollow() {
  console.log('================================================================');
  console.log('🛡️  INSTAGRAM AUTO-FOLLOW SEGMENTADO - MELHOR CUPOM');
  console.log('================================================================');

  // 1. Validar sessão
  if (!fs.existsSync(SESSION_FILE)) {
    console.error('\n❌ Nenhuma sessão salva do Instagram foi encontrada!');
    console.log('Execute primeiro o login interativo para salvar seus cookies:');
    console.log('   npm run instagram:login\n');
    process.exit(1);
  }

  const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  const history = loadHistory();

  console.log(`\nConta autenticada: @${session.username}`);
  console.log(`📅 Data de hoje: ${history.date}`);
  console.log(`📊 Seguidos hoje: ${history.followedToday} / ${CONFIG.MAX_DAILY_FOLLOWS} (Máx diário)`);
  console.log(`🎯 Tamanho deste lote: até ${CONFIG.BATCH_SIZE} perfis`);
  console.log(`⏱️ Intervalo entre ações: ${CONFIG.MIN_DELAY_SECONDS}s a ${CONFIG.MAX_DELAY_SECONDS}s`);

  if (history.followedToday >= CONFIG.MAX_DAILY_FOLLOWS) {
    console.log('\n🛑 Limite diário de segurança atingido para hoje!');
    console.log('Para proteger sua conta de bloqueios temporários da Meta, aguarde até amanhã.');
    return;
  }

  // 2. Iniciar navegador
  console.log('\nIniciando navegador com travas de segurança...');
  const browser = await puppeteer.launch({
    headless: CONFIG.HEADLESS,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  // Injetar cookies salvos
  if (Array.isArray(session.cookies) && session.cookies.length > 0) {
    await page.setCookie(...session.cookies);
    console.log('✓ Sessão autenticada carregada com sucesso.');
  }

  // Escolher uma conta-alvo aleatória da lista de cupons
  const targetAccount = CONFIG.TARGET_ACCOUNTS[Math.floor(Math.random() * CONFIG.TARGET_ACCOUNTS.length)];
  console.log(`\n🎯 Acessando perfil de nicho alvo: https://www.instagram.com/${targetAccount}/`);

  await page.goto(`https://www.instagram.com/${targetAccount}/`, { waitUntil: 'networkidle2', timeout: 45000 });
  await sleep(4000);

  // Verificar se o login ainda é válido
  const currentUrl = page.url();
  if (currentUrl.includes('/accounts/login/')) {
    console.error('\n❌ Sessão expirada! Por favor, renove sua sessão com:');
    console.log('   npm run instagram:login');
    await browser.close();
    return;
  }

  // Abrir lista de seguidores da conta-alvo
  console.log(`Buscando lista de seguidores de @${targetAccount}...`);
  const followersLink = await page.$(`a[href*="/${targetAccount}/followers/"]`);
  
  if (!followersLink) {
    console.log('Tentando localizar botão de seguidores alternativo...');
    const links = await page.$$('a');
    let clicked = false;
    for (const l of links) {
      const text = await page.evaluate(el => el.textContent, l);
      if (text && (text.includes('seguidores') || text.includes('followers'))) {
        await l.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      console.error('Não foi possível abrir o modal de seguidores.');
      await browser.close();
      return;
    }
  } else {
    await followersLink.click();
  }

  console.log('Aguardando carregamento da lista de seguidores...');
  await sleep(5000);

  // Localizar o modal de seguidores
  let followedInThisBatch = 0;
  const remainingToday = CONFIG.MAX_DAILY_FOLLOWS - history.followedToday;
  const targetToFollow = Math.min(CONFIG.BATCH_SIZE, remainingToday);

  console.log(`🚀 Iniciando seguimentos seguros (Meta desta rodada: ${targetToFollow})...\n`);

  while (followedInThisBatch < targetToFollow) {
    // Verificar se apareceu algum alerta de bloqueio de ação do Instagram
    const isBlocked = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('ação bloqueada') || 
             text.includes('action blocked') || 
             text.includes('tente novamente mais tarde') ||
             text.includes('try again later');
    });

    if (isBlocked) {
      console.warn('\n⚠️ ATENÇÃO: Detectado aviso de ação temporária do Instagram!');
      console.warn('Parando a execução imediatamente para manter a saúde total da conta.');
      break;
    }

    // Coletar botões "Seguir" disponíveis no modal
    const followCandidate = await page.evaluate((alreadyFollowed) => {
      // Buscar elementos no modal de seguidores
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) return null;

      const buttons = Array.from(dialog.querySelectorAll('button'));
      for (const btn of buttons) {
        const text = btn.innerText.trim();
        // Verificar se é botão Seguir (e não Seguindo, Solicitado, etc)
        if (text === 'Seguir' || text === 'Follow') {
          // Achar o nome de usuário correspondente na linha
          const row = btn.closest('div[role="listitem"]') || btn.closest('li') || btn.parentElement.parentElement;
          const userLink = row ? row.querySelector('a[href^="/"]') : null;
          const username = userLink ? userLink.getAttribute('href').replace(/\//g, '') : null;

          if (username && !alreadyFollowed.includes(username)) {
            return { username };
          }
        }
      }
      return null;
    }, history.allFollowed);

    if (followCandidate) {
      const username = followCandidate.username;
      console.log(`[${followedInThisBatch + 1}/${targetToFollow}] Preparando para seguir @${username}...`);

      // Clicar no botão correspondente via Puppeteer
      const clicked = await page.evaluate((targetUser) => {
        const dialog = document.querySelector('div[role="dialog"]');
        if (!dialog) return false;

        const buttons = Array.from(dialog.querySelectorAll('button'));
        for (const btn of buttons) {
          const text = btn.innerText.trim();
          if (text === 'Seguir' || text === 'Follow') {
            const row = btn.closest('div[role="listitem"]') || btn.closest('li') || btn.parentElement.parentElement;
            const userLink = row ? row.querySelector('a[href^="/"]') : null;
            const username = userLink ? userLink.getAttribute('href').replace(/\//g, '') : null;
            if (username === targetUser) {
              btn.click();
              return true;
            }
          }
        }
        return false;
      }, username);

      if (clicked) {
        followedInThisBatch++;
        history.followedToday++;
        history.allFollowed.push(username);
        saveHistory(history);

        console.log(`   ✅ Sucesso! Seguiu @${username}`);
        console.log(`   📊 Total hoje: ${history.followedToday}/${CONFIG.MAX_DAILY_FOLLOWS}`);

        if (followedInThisBatch < targetToFollow) {
          const delayMs = getRandomDelay(CONFIG.MIN_DELAY_SECONDS, CONFIG.MAX_DELAY_SECONDS);
          console.log(`   ⏳ Pausa humana de segurança: ${(delayMs / 1000).toFixed(0)} segundos...\n`);
          await sleep(delayMs);
        }
      }
    } else {
      // Se não encontrou mais botões visíveis, rolar o modal para carregar novos seguidores
      console.log('Rolando lista para carregar mais seguidores...');
      await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"]');
        if (dialog) {
          const scrollable = dialog.querySelector('div[style*="overflow"]') || dialog;
          scrollable.scrollBy(0, 400);
        }
      });
      await sleep(3000);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 Rodada finalizada com sucesso!`);
  console.log(`Perfis seguidos nesta rodada: ${followedInThisBatch}`);
  console.log(`Total acumulado hoje: ${history.followedToday}/${CONFIG.MAX_DAILY_FOLLOWS}`);
  console.log('================================================================\n');

  await sleep(3000);
  await browser.close();
}

runAutoFollow().catch(err => {
  console.error('\nErro durante a execução do script:', err);
  process.exit(1);
});
