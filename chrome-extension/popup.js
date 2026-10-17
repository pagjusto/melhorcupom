// Popup Script - Melhor Cupom

document.addEventListener('DOMContentLoaded', async () => {
  const partnerSection = document.getElementById('partner-store-section');
  const exploreSection = document.getElementById('explore-section');
  const storeNameEl = document.getElementById('store-name');
  const storeCountEl = document.getElementById('store-count');
  const couponsListEl = document.getElementById('coupons-list');
  const searchInput = document.getElementById('search-input');
  const popularGrid = document.getElementById('popular-stores-grid');
  const savingsAmountEl = document.getElementById('savings-amount');

  // Carregar economia acumulada salva
  chrome.storage.local.get(['totalSavings', 'copiedCount'], (res) => {
    const savings = res.totalSavings || 50.0;
    savingsAmountEl.textContent = `R$ ${savings.toFixed(2).replace('.', ',')}`;
  });

  // Identificar a aba ativa atual
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentStore = null;

  if (tab && tab.url) {
    try {
      const urlObj = new URL(tab.url);
      currentStore = findStoreByHostname(urlObj.hostname);
    } catch (e) {}
  }

  // CENÁRIO 1: O usuário está no site de uma loja parceira
  if (currentStore && currentStore.coupons && currentStore.coupons.length > 0) {
    partnerSection.classList.remove('hidden');
    exploreSection.classList.add('hidden');

    storeNameEl.textContent = currentStore.name;
    storeCountEl.textContent = `${currentStore.coupons.length} cupons e ofertas disponíveis hoje`;

    renderCoupons(currentStore.coupons);
  } else {
    // CENÁRIO 2: O usuário está em outro site (ex: Google, YouTube, etc.)
    partnerSection.classList.add('hidden');
    exploreSection.classList.remove('hidden');

    renderPopularStores(MELHOR_CUPOM_STORES);

    // Filtro na barra de busca
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = MELHOR_CUPOM_STORES.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.domains.some(d => d.includes(term))
      );
      renderPopularStores(filtered);
    });
  }

  // Renderizar cupons da loja ativa
  function renderCoupons(coupons) {
    couponsListEl.innerHTML = '';

    coupons.forEach(coupon => {
      const item = document.createElement('div');
      item.className = 'coupon-item';

      item.innerHTML = `
        <div class="coupon-top">
          <span class="coupon-discount">${coupon.discount}</span>
          <span class="coupon-expires">✓ ${coupon.expires || 'Verificado'}</span>
        </div>
        <div class="coupon-title">${coupon.title}</div>
        <div class="coupon-footer">
          <span class="coupon-code">${coupon.code}</span>
          <button class="coupon-copy-btn" data-code="${coupon.code}">
            Copiar Código
          </button>
        </div>
      `;

      const copyBtn = item.querySelector('.coupon-copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(coupon.code).then(() => {
          copyBtn.textContent = '✓ Copiado!';
          copyBtn.classList.add('copied');

          // Incrementar economia salva
          chrome.storage.local.get(['totalSavings', 'copiedCount'], (res) => {
            const count = (res.copiedCount || 0) + 1;
            const savings = (res.totalSavings || 50.0) + 20.0;
            chrome.storage.local.set({ copiedCount: count, totalSavings: savings });
            savingsAmountEl.textContent = `R$ ${savings.toFixed(2).replace('.', ',')}`;
          });

          setTimeout(() => {
            copyBtn.textContent = 'Copiar Código';
            copyBtn.classList.remove('copied');
          }, 3000);
        });
      });

      couponsListEl.appendChild(item);
    });
  }

  // Renderizar lista de lojas em alta
  function renderPopularStores(stores) {
    popularGrid.innerHTML = '';

    if (stores.length === 0) {
      popularGrid.innerHTML = `
        <div style="text-align: center; padding: 20px; font-size: 11px; color: #9CA3AF;">
          Nenhuma loja encontrada para esta busca.
        </div>
      `;
      return;
    }

    stores.forEach(st => {
      const card = document.createElement('div');
      card.className = 'popular-card';

      const firstDomain = st.domains[0] || 'loja.com.br';
      const count = st.coupons ? st.coupons.length : 0;

      card.innerHTML = `
        <div class="popular-store-info">
          <div class="popular-store-icon" style="color: ${st.color || '#FF5F00'}">🏪</div>
          <div>
            <div class="popular-store-name">${st.name}</div>
            <div class="popular-store-cashback">${st.cashback || 'Cupons e ofertas'}</div>
          </div>
        </div>
        <span class="popular-count-badge">${count} cupons</span>
      `;

      card.addEventListener('click', () => {
        const targetUrl = st.affiliateUrl || `https://${firstDomain}`;
        chrome.tabs.create({ url: targetUrl });
      });

      popularGrid.appendChild(card);
    });
  }
});
