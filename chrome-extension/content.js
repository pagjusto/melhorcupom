// Content Script - Melhor Cupom
// Roda nas páginas que o usuário navega e exibe o alerta quando há cupons disponíveis

(function() {
  // Evitar injeção duplicada
  if (window.__MELHOR_CUPOM_INJECTED__) return;
  window.__MELHOR_CUPOM_INJECTED__ = true;

  const currentHost = window.location.hostname;
  const store = findStoreByHostname(currentHost);

  if (!store || !store.coupons || store.coupons.length === 0) {
    return;
  }

  // Notificar o background script para acender o badge no ícone
  try {
    chrome.runtime.sendMessage({
      type: 'STORE_FOUND',
      storeId: store.id,
      count: store.coupons.length
    });
  } catch (e) {}

  // Verificar se o usuário já fechou o alerta nesta sessão
  const isDismissed = sessionStorage.getItem('mc_dismissed_' + store.id);

  // Aguardar 1.5s após o carregamento da página para não atrapalhar
  setTimeout(() => {
    if (!isDismissed) {
      showFloatingAlert(store);
    }
  }, 1500);

  // Exibe o Card Flutuante Discreto no Canto Superior Direito
  function showFloatingAlert(storeData) {
    if (document.getElementById('melhor-cupom-root')) return;

    const root = document.createElement('div');
    root.id = 'melhor-cupom-root';

    const bestCoupon = storeData.coupons[0];
    const totalCount = storeData.coupons.length;

    root.innerHTML = `
      <div class="mc-alert-bubble">
        <div class="mc-glow-bar"></div>
        <div class="mc-header">
          <div class="mc-brand">
            <img src="${chrome.runtime.getURL('icons/logo.png')}" alt="Melhor Cupom" class="mc-brand-logo-img" />
          </div>
          <button class="mc-close-btn" id="mc-btn-close" title="Fechar por enquanto">✕</button>
        </div>

        <div class="mc-content">
          <div class="mc-title">
            🎉 Encontramos <strong>${totalCount} ${totalCount === 1 ? 'cupom' : 'cupons'}</strong> para a <span class="mc-store-name">${storeData.name}</span>!
          </div>

          <div class="mc-best-deal">
            <div class="mc-deal-left">
              <span class="mc-deal-badge">${bestCoupon.discount}</span>
              <span class="mc-deal-desc">${bestCoupon.title}</span>
            </div>
            <button class="mc-copy-quick-btn" id="mc-quick-copy" data-code="${bestCoupon.code}">
              Copiar: ${bestCoupon.code}
            </button>
          </div>
        </div>

        <div class="mc-actions">
          <button class="mc-btn-primary" id="mc-btn-see-all">
            🏷️ Ver Todos os ${totalCount} Cupons
          </button>
          <button class="mc-btn-secondary" id="mc-btn-site">
            Visitar Site
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Eventos
    document.getElementById('mc-btn-close').addEventListener('click', () => {
      sessionStorage.setItem('mc_dismissed_' + storeData.id, 'true');
      root.remove();
    });

    document.getElementById('mc-quick-copy').addEventListener('click', (e) => {
      const code = e.currentTarget.getAttribute('data-code');
      copyToClipboard(code, bestCoupon.discount);
    });

    document.getElementById('mc-btn-see-all').addEventListener('click', () => {
      root.remove();
      openCouponDrawer(storeData);
    });

    document.getElementById('mc-btn-site').addEventListener('click', () => {
      window.open('https://www.omelhorcupom.com.br', '_blank');
    });
  }

  // Abre a Gaveta Lateral com Todos os Cupons da Loja
  function openCouponDrawer(storeData) {
    if (document.getElementById('melhor-cupom-drawer-root')) return;

    const drawerWrapper = document.createElement('div');
    drawerWrapper.id = 'melhor-cupom-drawer-root';

    const couponsHtml = storeData.coupons.map((c, idx) => `
      <div class="mc-coupon-card">
        <div class="mc-card-top">
          <span class="mc-card-discount">${c.discount}</span>
          <span class="mc-card-expires">✓ ${c.expires || 'Verificado'}</span>
        </div>
        <div class="mc-card-title">${c.title}</div>
        <div class="mc-card-desc">${c.description}</div>
        <div class="mc-coupon-code-box">
          <span class="mc-code-text">${c.code}</span>
          <button class="mc-copy-btn" data-code="${c.code}" data-discount="${c.discount}">
            Copiar Código
          </button>
        </div>
      </div>
    `).join('');

    drawerWrapper.innerHTML = `
      <div class="mc-drawer-overlay" id="mc-drawer-overlay"></div>
      <div class="mc-drawer">
        <div class="mc-drawer-header">
          <div class="mc-drawer-title-box">
            <img src="${chrome.runtime.getURL('icons/logo.png')}" alt="Melhor Cupom" class="mc-drawer-logo-img" />
            <div>
              <div class="mc-drawer-title">${storeData.name}</div>
              <div class="mc-drawer-sub">${storeData.coupons.length} cupons e ofertas oficiais</div>
            </div>
          </div>
          <button class="mc-close-btn" id="mc-drawer-close">✕</button>
        </div>

        <div class="mc-drawer-body">
          ${couponsHtml}
        </div>

        <div class="mc-drawer-footer">
          <a href="https://www.omelhorcupom.com.br" target="_blank" class="mc-footer-link">
            🔥 Ver mais descontos e lojas no Clube VIP Melhor Cupom →
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(drawerWrapper);

    // Fechar drawer
    const closeDrawer = () => drawerWrapper.remove();
    document.getElementById('mc-drawer-close').addEventListener('click', closeDrawer);
    document.getElementById('mc-drawer-overlay').addEventListener('click', closeDrawer);

    // Botões de copiar cada cupom
    drawerWrapper.querySelectorAll('.mc-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        const discount = e.currentTarget.getAttribute('data-discount');
        copyToClipboard(code, discount);

        e.currentTarget.textContent = '✓ Copiado!';
        e.currentTarget.classList.add('mc-copied');
        setTimeout(() => {
          e.currentTarget.textContent = 'Copiar Código';
          e.currentTarget.classList.remove('mc-copied');
        }, 3000);
      });
    });
  }

  // Copia código e exibe toast de comemoração
  function copyToClipboard(text, discount) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`🎉 Cupom "${text}" (${discount}) copiado! Cole no carrinho.`);

      try {
        chrome.runtime.sendMessage({
          type: 'TRACK_COUPON_COPY',
          code: text
        });
      } catch (e) {}
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast(`🎉 Cupom "${text}" copiado!`);
    });
  }

  // Toast flutuante de sucesso
  function showToast(message) {
    const existing = document.getElementById('melhor-cupom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'melhor-cupom-toast';
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast) toast.remove();
    }, 3500);
  }

  // Ouvir ordens do popup para abrir a gaveta
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'OPEN_COUPON_DRAWER') {
      openCouponDrawer(store);
    }
  });

})();
