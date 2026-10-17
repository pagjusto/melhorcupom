// Background Service Worker (Manifest V3) - Melhor Cupom

importScripts('data/catalog.js');

// Atualiza o Badge do ícone no Chrome quando o usuário navega
function checkTabAndSetBadge(tabId, url) {
  if (!url) {
    chrome.action.setBadgeText({ text: '', tabId });
    return;
  }

  try {
    const urlObj = new URL(url);
    const store = findStoreByHostname(urlObj.hostname);

    if (store && store.coupons && store.coupons.length > 0) {
      const count = String(store.coupons.length);
      chrome.action.setBadgeText({ text: count, tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#FF5F00', tabId });
      chrome.action.setTitle({
        title: `🔥 ${store.name}: ${count} cupons disponíveis no Melhor Cupom!`,
        tabId
      });
    } else {
      chrome.action.setBadgeText({ text: '', tabId });
      chrome.action.setTitle({
        title: 'Melhor Cupom — Alerta Automático de Cupons & Descontos',
        tabId
      });
    }
  } catch (e) {
    chrome.action.setBadgeText({ text: '', tabId });
  }
}

// Ouvir quando uma aba é atualizada ou navega para nova URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkTabAndSetBadge(tabId, tab.url);
  }
});

// Ouvir quando o usuário troca de aba ativa
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      checkTabAndSetBadge(activeInfo.tabId, tab.url);
    }
  });
});

// Mensagens entre Content Script, Popup e Background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_STORE_FOR_URL') {
    const store = findStoreByHostname(request.hostname);
    sendResponse({ store });
    return true;
  }

  if (request.type === 'TRACK_COUPON_COPY') {
    chrome.storage.local.get(['totalSavings', 'copiedCount'], (res) => {
      const newCount = (res.copiedCount || 0) + 1;
      const newSavings = (res.totalSavings || 0) + 25.0; // Economia estimada
      chrome.storage.local.set({ copiedCount: newCount, totalSavings: newSavings });
    });
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'OPEN_URL') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
    return true;
  }
});
