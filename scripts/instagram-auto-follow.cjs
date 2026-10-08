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
  // Perfis referência de grande porte com centenas de milhares de seguidores de cupons/ofertas
  TARGET_ACCOUNTS: [
    'cuponomia',
    'promobitoficial',
    'pelando_br',
    'shopee_br'
  ],
  
  // Limite máximo diário recomendado para evitar bloqueios da Meta
  MAX_DAILY_FOLLOWS: 60,
  
  // Quantidade de pessoas a seguir por execução desta rodada (lote seguro)
  BATCH_SIZE: 12,
  
  // Intervalo aleatório em segundos entre cada clique em "Seguir"
  MIN_DELAY_SECONDS: 45,
  MAX_DELAY_SECONDS: 95,
  
  // Executar com interface gráfica visível para poder acompanhar
  HEADLESS: false
};

const SESSION_FILE = path.join(__dirname, 'instagram-session.json');
const HISTORY_FILE = path.join(__dirname, 'instagram-history.json');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay(minSec, maxSec) {
  return Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000;
}

function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function loadHistory() {
  const today = getTodayString();
  if (!fs.existsSync(HISTORY_FILE)) {
    return { date: today, followedToday: 0, allFollowed: [] };
  }

  try {
    const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    if (data.date !== today) {
      data.date = today;
      data.followedToday = 0; // Reinicia cota diária
    }
    if (!Array.isArray(data.allFollowed)) {
      data.allFollowed = [];
    }
    return data;
  } catch {
    return { date: today, followedToday: 0, allFollowed: [] };
  }
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

async function runAutoFollow() {
  console.log('================================================================');
  console.log('🛡️  INSTAGRAM AUTO-FOLLOW SEGMENTADO - MELHOR CUPOM');
  console.log('================================================================');

  if (!fs.existsSync(SESSION_FILE)) {
    console.error('\n❌ Nenhuma sessão salva do Instagram foi encontrada!');
    console.log('Execute primeiro o login interativo para salvar seus cookies:');
    console.log('   cmd.exe /c "npm run instagram:login"\n');
    process.exit(1);
  }

  const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  const history = loadHistory();

  console.log(`\nConta autenticada: @${session.username}`);
  console.log(`📅 Data de hoje: ${history.date}`);
  console.log(`📊 Seguidos hoje: ${history.followedToday} / ${CONFIG.MAX_DAILY_FOLLOWS} (Máx diário)`);
  console.log(`🎯 Meta deste lote: até ${CONFIG.BATCH_SIZE} perfis`);
  console.log(`⏱️ Intervalo entre ações: ${CONFIG.MIN_DELAY_SECONDS}s a ${CONFIG.MAX_DELAY_SECONDS}s`);

  if (history.followedToday >= CONFIG.MAX_DAILY_FOLLOWS) {
    console.log('\n🛑 Limite diário de segurança atingido para hoje!');
    console.log('Para proteger sua conta de restrições da Meta, aguarde até amanhã.');
    return;
  }

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

  if (Array.isArray(session.cookies) && session.cookies.length > 0) {
    await page.setCookie(...session.cookies);
    console.log('✓ Sessão autenticada carregada com sucesso.');
  }

  // Escolher conta-alvo de grande porte
  const targetAccount = CONFIG.TARGET_ACCOUNTS[Math.floor(Math.random() * CONFIG.TARGET_ACCOUNTS.length)];
  console.log(`\n🎯 Acessando perfil de nicho alvo: https://www.instagram.com/${targetAccount}/`);

  await page.goto(`https://www.instagram.com/${targetAccount}/`, { waitUntil: 'networkidle2', timeout: 45000 });
  await sleep(3500);

  if (page.url().includes('/accounts/login/')) {
    console.error('\n❌ Sessão expirada! Renove os cookies com: npm run instagram:login');
    await browser.close();
    return;
  }

  // Abrir modal de seguidores
  console.log(`Abrindo lista de seguidores de @${targetAccount}...`);
  const followersOpened = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, span'));
    const target = links.find(el => 
      (el.getAttribute && el.getAttribute('href') && el.getAttribute('href').includes('/followers/')) || 
      (el.innerText && el.innerText.includes('seguidores'))
    );
    if (target) {
      target.click();
      return true;
    }
    return false;
  });

  if (!followersOpened) {
    console.error('Não foi possível clicar no link de seguidores.');
    await browser.close();
    return;
  }

  await sleep(4000);

  let followedInThisBatch = 0;
  const remainingToday = CONFIG.MAX_DAILY_FOLLOWS - history.followedToday;
  const targetToFollow = Math.min(CONFIG.BATCH_SIZE, remainingToday);

  console.log(`🚀 Iniciando seguimentos seguros (Meta desta rodada: ${targetToFollow} perfis)...\n`);

  let scrollAttempts = 0;

  while (followedInThisBatch < targetToFollow && scrollAttempts < 25) {
    // Verificar alerta de bloqueio de ação da Meta
    const isBlocked = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('ação bloqueada') || 
             text.includes('action blocked') || 
             text.includes('tente novamente mais tarde') ||
             text.includes('try again later');
    });

    if (isBlocked) {
      console.warn('\n⚠️ Detectado aviso de ação temporária da Meta! Parando o script imediatamente.');
      break;
    }

    // Encontrar candidatos disponíveis no modal
    const candidates = await page.evaluate((alreadyFollowed) => {
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) return [];

      const buttons = Array.from(dialog.querySelectorAll('button'));
      const list = [];

      for (const btn of buttons) {
        const text = btn.innerText.trim();
        if (text === 'Seguir' || text === 'Follow') {
          let parent = btn.parentElement;
          let username = null;
          for (let i = 0; i < 8 && parent; i++) {
            const uLink = parent.querySelector('a[href^="/"]');
            if (uLink) {
              const h = uLink.getAttribute('href').replace(/\//g, '');
              if (h && !h.includes('explore') && !h.includes('p') && h !== '') {
                username = h;
                break;
              }
            }
            parent = parent.parentElement;
          }

          if (username && !alreadyFollowed.includes(username) && !list.some(x => x.username === username)) {
            list.push({ username });
          }
        }
      }
      return list;
    }, history.allFollowed);

    if (candidates.length > 0) {
      const nextUser = candidates[0].username;
      console.log(`[${followedInThisBatch + 1}/${targetToFollow}] Seguindo @${nextUser}...`);

      const clicked = await page.evaluate((target) => {
        const dialog = document.querySelector('div[role="dialog"]');
        if (!dialog) return false;

        const buttons = Array.from(dialog.querySelectorAll('button'));
        for (const btn of buttons) {
          if (btn.innerText.trim() === 'Seguir' || btn.innerText.trim() === 'Follow') {
            let parent = btn.parentElement;
            let uFound = null;
            for (let i = 0; i < 8 && parent; i++) {
              const uLink = parent.querySelector('a[href^="/"]');
              if (uLink) {
                const h = uLink.getAttribute('href').replace(/\//g, '');
                if (h === target) {
                  uFound = h;
                  break;
                }
              }
              parent = parent.parentElement;
            }
            if (uFound === target) {
              btn.click();
              return true;
            }
          }
        }
        return false;
      }, nextUser);

      if (clicked) {
        followedInThisBatch++;
        history.followedToday++;
        history.allFollowed.push(nextUser);
        saveHistory(history);

        console.log(`   ✅ Sucesso! Agora você segue @${nextUser}`);
        console.log(`   📊 Progresso hoje: ${history.followedToday}/${CONFIG.MAX_DAILY_FOLLOWS}`);

        if (followedInThisBatch < targetToFollow) {
          const delayMs = getRandomDelay(CONFIG.MIN_DELAY_SECONDS, CONFIG.MAX_DELAY_SECONDS);
          console.log(`   ⏳ Pausa humana de segurança: ${(delayMs / 1000).toFixed(0)} segundos...\n`);
          await sleep(delayMs);
        }
      }
      scrollAttempts = 0;
    } else {
      scrollAttempts++;
      console.log(`Rolando modal para carregar mais seguidores (${scrollAttempts}/25)...`);
      await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"]');
        if (dialog) {
          const scrollable = dialog.querySelector('div[style*="overflow"]') || 
                             dialog.querySelector('div.x7r04t1') || 
                             dialog;
          scrollable.scrollBy(0, 350);
        }
      });
      await sleep(2500);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 Rodada de auto-follow finalizada!`);
  console.log(`Perfis seguidos neste lote: ${followedInThisBatch}`);
  console.log(`Total acumulado hoje: ${history.followedToday}/${CONFIG.MAX_DAILY_FOLLOWS}`);
  console.log('================================================================\n');

  await sleep(3000);
  await browser.close();
}

runAutoFollow().catch(err => {
  console.error('\nErro na execução do script:', err);
  process.exit(1);
});
