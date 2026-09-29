// scripts/sync-all.cjs
// Sincronizador Mestre de Todas as Redes de Afiliados (Lomadee, Shopee, SHEIN, AliExpress)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function syncAll() {
  console.log('====================================================');
  console.log('🌐 SINCRONIZADOR GERAL DE APIS DE AFILIADOS');
  console.log('   Melhor Cupom Multi-Network Engine');
  console.log('====================================================\n');

  const scriptsDir = __dirname;
  const dataDir = path.join(__dirname, '..', 'src', 'data');

  // 1. Lomadee API
  console.log('1️⃣  Executando sincronização Lomadee v2 (SocialSoul)...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-lomadee.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro na Lomadee:', e.message);
  }

  // 2. Shopee Open Platform
  console.log('\n2️⃣  Executando sincronização Shopee Open Platform...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-shopee.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro na Shopee:', e.message);
  }

  // 3. SHEIN Open Platform
  console.log('\n3️⃣  Executando sincronização SHEIN Open Platform...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-shein.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro na SHEIN:', e.message);
  }

  // 4. AliExpress Open Platform
  console.log('\n4️⃣  Executando sincronização AliExpress Open Platform...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-aliexpress.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro no AliExpress:', e.message);
  }

  // 5. Mercado Livre Automation (Puppeteer / Barra de Afiliados)
  console.log('\n5️⃣  Executando automação Mercado Livre (Barra de Afiliados / Puppeteer)...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-mercadolivre.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro no Mercado Livre:', e.message);
  }

  // 6. Amazon Brasil (SiteStripe & Tag de Associado)
  console.log('\n6️⃣  Executando sincronização Amazon Brasil (SiteStripe & Tag)...');
  try {
    execSync(`node "${path.join(scriptsDir, 'sync-amazon.cjs')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Erro na Amazon:', e.message);
  }

  // 7. Consolidar todos os cupons em liveAffiliateCoupons.json
  console.log('\n📦 Consolidando base unificada de cupons...');
  const files = ['lomadeeCoupons.json', 'shopeeCoupons.json', 'sheinCoupons.json', 'aliexpressCoupons.json', 'meliCoupons.json', 'amazonCoupons.json'];
  let allCoupons = [];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(content)) {
          allCoupons = [...allCoupons, ...content];
          console.log(`   + ${content.length} cupons integrados de ${file}`);
        }
      } catch (err) {
        console.error(`Erro ao ler ${file}:`, err.message);
      }
    }
  });

  const consolidatedPath = path.join(dataDir, 'liveAffiliateCoupons.json');
  fs.writeFileSync(consolidatedPath, JSON.stringify(allCoupons, null, 2), 'utf8');

  console.log('\n====================================================');
  console.log(`🎉 SUCESSO TOTAL! ${allCoupons.length} cupons oficiais sincronizados e prontos!`);
  console.log(`📁 Arquivo consolidado salvo em: src/data/liveAffiliateCoupons.json`);
  console.log('====================================================');
}

syncAll();
