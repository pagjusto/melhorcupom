const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generateUserFlyers() {
  console.log('🚀 Iniciando geração dos folders de cadastro para usuários...');

  const logoBase64 = fs.readFileSync(path.join(__dirname, '../public/logo-melhor-cupom.png')).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const formats = [
    { name: 'feed', width: 1080, height: 1080 },
    { name: 'story', width: 1080, height: 1920 }
  ];

  for (const fmt of formats) {
    const page = await browser.newPage();
    const isStory = fmt.name === 'story';
    const width = fmt.width;
    const height = fmt.height;

    await page.setViewport({ width, height, deviceScaleFactor: 1 });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    canvas {
      display: block;
      width: ${width}px;
      height: ${height}px;
    }
  </style>
</head>
<body>
  <canvas id="cv" width="${width}" height="${height}"></canvas>
  <script>
    async function draw() {
      const canvas = document.getElementById('cv');
      const ctx = canvas.getContext('2d');
      const width = ${width};
      const height = ${height};
      const isStory = ${isStory};

      // 1. Fundo Minimalista Dark
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#07070B');
      bgGrad.addColorStop(0.5, '#100D16');
      bgGrad.addColorStop(1, '#07070B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Aura Central Suave e Elegante
      const auraCenterY = isStory ? height * 0.38 : height * 0.40;
      const aura = ctx.createRadialGradient(width * 0.5, auraCenterY, 40, width * 0.5, auraCenterY, isStory ? 580 : 440);
      aura.addColorStop(0, 'rgba(255, 95, 0, 0.32)');
      aura.addColorStop(0.5, 'rgba(255, 120, 0, 0.08)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Borda Externa Minimalista Fina
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(32, 32, width - 64, height - 64, 36);
      ctx.stroke();
      ctx.restore();

      // 3. Logo Oficial em Grande Destaque
      let logoBottomY = isStory ? 700 : 450;
      try {
        const mcLogoImg = new Image();
        await new Promise((resolve) => {
          mcLogoImg.onload = resolve;
          mcLogoImg.onerror = resolve;
          mcLogoImg.src = "${logoDataUrl}";
        });

        if (mcLogoImg.width > 0) {
          const logoW = isStory ? 600 : 380;
          const logoH = (mcLogoImg.height / mcLogoImg.width) * logoW;
          const logoX = (width - logoW) / 2;
          const logoY = isStory ? 240 : 110;
          logoBottomY = logoY + logoH;

          ctx.save();
          ctx.shadowColor = 'rgba(255, 95, 0, 0.5)';
          ctx.shadowBlur = 40;
          ctx.drawImage(mcLogoImg, logoX, logoY, logoW, logoH);
          ctx.restore();
        }
      } catch (e) {
        console.warn('Erro ao carregar logo:', e);
      }

      // 4. Headline Principal Direta e Forte
      const headStartY = isStory ? logoBottomY + 115 : logoBottomY + 46;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // "Economize Todos os Dias"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = isStory ? '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Economize Todos os Dias', width / 2, headStartY);

      // "Cadastre-se no Melhor Cupom" (Gradiente Laranja Vibrante)
      const line2Y = headStartY + (isStory ? 84 : 54);
      const grad = ctx.createLinearGradient(width * 0.2, line2Y, width * 0.8, line2Y);
      grad.addColorStop(0, '#FF8A00');
      grad.addColorStop(0.5, '#FFB800');
      grad.addColorStop(1, '#FF5F00');
      ctx.fillStyle = grad;
      ctx.font = isStory ? '900 70px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Cadastre-se no Melhor Cupom', width / 2, line2Y);
      ctx.restore();

      // 5. Selo Elegante e Minimalista: "🎁 100% GRÁTIS • ATÉ 50% OFF"
      const pillY = line2Y + (isStory ? 85 : 52);
      const pillW = isStory ? 540 : 410;
      const pillH = isStory ? 58 : 42;
      const pillX = (width - pillW) / 2;

      ctx.save();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34D399';
      ctx.font = isStory ? '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '900 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎁 100% GRÁTIS • DESCONTOS DE ATÉ 50% OFF', width / 2, pillY + pillH / 2 + 1);
      ctx.restore();

      // 6. Subtítulo Limpo
      const subY = pillY + pillH + (isStory ? 65 : 38);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#9CA3AF';
      ctx.font = isStory ? '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Restaurantes, comércio local e grandes lojas online em um só lugar.', width / 2, subY);
      ctx.restore();

      // Se for Story, card de benefícios
      let afterPerksY = subY;
      if (isStory) {
        const cardY = subY + 50;
        const cardW = 860;
        const cardH = 290;
        const cardX = (width - cardW) / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 28);
        ctx.fill();
        ctx.stroke();

        const perks = [
          '🍔 Restaurantes, hamburguerias, pizzarias e lojas da sua cidade',
          '🛍️ Achadinhos virais da Shopee, Magalu, Shein e Mercado Livre',
          '🎟️ Resgate cupons em 1 clique sem custo direto no celular',
          '👑 Clube VIP com ofertas exclusivas e descontos turbinados'
        ];

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '600 25px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        perks.forEach((perk, idx) => {
          ctx.fillStyle = '#E5E7EB';
          ctx.fillText(perk, cardX + 44, cardY + 48 + (idx * 64));
        });
        ctx.restore();
        afterPerksY = cardY + cardH;
      }

      // 7. Botão de Ação Sofisticado e Limpo
      const btnY = isStory ? afterPerksY + 65 : subY + 48;
      const btnW = isStory ? 680 : 530;
      const btnH = isStory ? 94 : 68;
      const btnX = (width - btnW) / 2;

      ctx.save();
      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
      btnGrad.addColorStop(0, '#FF5F00');
      btnGrad.addColorStop(1, '#E04F00');
      ctx.fillStyle = btnGrad;
      ctx.shadowColor = 'rgba(255, 95, 0, 0.6)';
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, btnH / 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;
      ctx.font = isStory ? '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '900 23px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Criar Conta Grátis & Economizar', width / 2, btnY + btnH / 2);
      ctx.restore();

      // 8. Rodapé Minimalista
      const footY = isStory ? 1730 : 965;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#E5E7EB';
      ctx.font = isStory ? '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('omelhorcupom.com.br', width / 2, footY);

      ctx.fillStyle = '#FF7A29';
      ctx.font = isStory ? '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('@omelhorcupom.com.br', width / 2, footY + (isStory ? 42 : 30));
      ctx.restore();

      window.renderReady = true;
    }
    window.addEventListener('load', () => setTimeout(draw, 50));
  </script>
</body>
</html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.renderReady === true, { timeout: 10000 });

    const outPath = path.join(__dirname, `../public/artes/folder-cadastro-usuario-${fmt.name}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`✅ Salvo: ${outPath} (${width}x${height})`);
    await page.close();
  }

  await browser.close();
  console.log('🎉 Todos os folders de cadastro para usuários gerados com sucesso!');
}

generateUserFlyers().catch(console.error);
