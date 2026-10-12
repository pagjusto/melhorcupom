const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const hotDealsPath = path.join(__dirname, '../src/data/hotDealsData.js');
let fileContent = fs.readFileSync(hotDealsPath, 'utf8');

const jsonMatch = fileContent.match(/export const INITIAL_HOT_DEALS = (\[[\s\S]*?\]);/);
const deals = JSON.parse(jsonMatch[1]);

// Encontrar IDs de imagens repetidas
const counts = {};
deals.forEach(d => {
  counts[d.image] = (counts[d.image] || 0) + 1;
});

const problematicItems = deals.filter(d => 
  counts[d.image] > 1 || 
  d.id === 'deal_shopee_cabo_magnetico_3em1' ||
  d.id === 'deal_shopee_camera_lampada_wifi'
);

console.log(`Encontrados ${problematicItems.length} produtos que precisam de foto exclusiva única...`);

const customQueries = {
  deal_shopee_cabo_magnetico_3em1: 'cabo magnetico 3 em 1 celular led rotativo shopee',
  deal_shopee_tampas_silicone_kit6: 'tampas de silicone elasticas potes tigelas shopee',
  deal_shopee_mop_giratorio_balde: 'mop giratorio lava e seca com balde shopee',
  deal_shopee_kit_rolo_jade_gua_sha: 'rolo de jade facial pedra verde massagem shopee',
  deal_shopee_kit_pinceis_maquiagem_13: 'kit 13 pinceis maquiagem profissionais estojo shopee',
  deal_shopee_estojo_lentes_contato: 'estojo para lentes de contato com espelho pinça shopee',
  deal_shopee_kit_organizadores_mala: 'kit organizador de mala viagem necessaires cubos shopee',
  deal_shopee_sacos_vacuo_roupas_kit5: 'sacos a vacuo roupas organizador hermetico shopee',
  deal_shopee_kit_meias_invisiveis_10: 'meias invisiveis masculinas femininas sapatilha shopee',
  deal_shopee_porta_joias_portatil: 'mini porta joias portatil viagem ziper veludo shopee',
  deal_shopee_camera_lampada_wifi: 'camera lampada wifi espia seguranca 360 bocal e27 shopee'
};

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  for (const deal of problematicItems) {
    const q = customQueries[deal.id] || `${deal.title.replace(/Kit/gi, '').trim()} shopee produto`;
    console.log(`Buscando foto real exclusiva para: ${deal.title.slice(0, 35)}... (query: ${q})`);

    try {
      await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(q)}&form=HDRSC2&first=1`, {
        waitUntil: 'domcontentloaded',
        timeout: 12000
      });
      await new Promise(r => setTimeout(r, 600));

      const found = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('a.iusc'));
        const list = [];
        for (const c of cards) {
          try {
            const m = JSON.parse(c.getAttribute('m'));
            list.push({ murl: m.murl, turl: m.turl, desc: m.desc || '' });
          } catch(e){}
        }

        // Prioridade 1: Shopee CDN direto
        const shopeeImg = list.find(x => x.murl && (x.murl.includes('susercontent.com') || x.murl.includes('shopee.com')));
        if (shopeeImg) return shopeeImg.murl;

        // Prioridade 2: Shopee na descrição
        const shopeeDesc = list.find(x => x.desc.toLowerCase().includes('shopee') && x.turl);
        if (shopeeDesc) return shopeeDesc.turl || shopeeDesc.murl;

        // Prioridade 3: Thumbnail limpo que não seja genérico
        const cleanThumb = list.find(x => x.turl && !x.turl.includes('MV526') && !x.turl.includes('PuNnk'));
        if (cleanThumb) return cleanThumb.turl;

        return list.length > 0 ? list[0].turl : null;
      });

      if (found && !found.includes('MV526') && !found.includes('PuNnk')) {
        console.log(`   -> ✅ Encontrado: ${found.slice(0, 65)}...`);
        deal.image = found;
      } else {
        console.log(`   -> ⚠️ Não encontrado ou repetido`);
      }
    } catch (e) {
      console.log(`   -> ❌ Erro: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  await browser.close();

  // Salvar no arquivo
  const newJsonStr = JSON.stringify(deals, null, 2);
  const updatedFileContent = fileContent.replace(
    /export const INITIAL_HOT_DEALS = \[[\s\S]*?\];/,
    `export const INITIAL_HOT_DEALS = ${newJsonStr};`
  );

  fs.writeFileSync(hotDealsPath, updatedFileContent, 'utf8');
  console.log('✅ Arquivo salvo com fotos exclusivas!');
})();
