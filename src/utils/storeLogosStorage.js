// src/utils/storeLogosStorage.js
// Gerenciador de Armazenamento Seguro, Permanente e Ilimitado de Logos Customizadas de Parceiros (IndexedDB + LocalStorage)

const DB_NAME = 'melhor_cupom_assets_v2';
const STORE_NAME = 'custom_partner_logos';

const openIDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return resolve(null);
    }
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

/**
 * Identifica o radical universal de uma marca para vincular variações (ex: "Amazon Brasil" -> "amazon")
 */
export const getBrandRootKey = (str) => {
  if (!str) return '';
  const clean = String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  if (!clean) return '';

  const roots = [
    'amazon', 'magalu', 'shopee', 'shein', 'mercadolivre', 'meli', 'nike', 'adidas', 'kabum',
    'samsung', 'drogasil', 'drogaraia', 'aliexpress', 'casasbahia', 'netshoes', 'mcdonalds',
    'corleone', 'outback', 'smartfit', 'botecobelmonte', 'belmonte', 'trackfield', 'pinguim',
    'fogodechao', 'centauro', 'boticario', 'iplace', 'cinemark', 'burgerking', 'starbucks',
    'cacaushow', 'madero', 'subway', 'spoleto', 'sephora', 'paodeacucar', 'petz', 'fastshop',
    'electrolux', 'brastemp', 'lenovo', 'dafiti', 'zattini', 'booking', 'decolar', 'loccitane',
    'philips', 'camicado', 'tokstok', 'paguemenos', 'cobasi', 'cea', 'renner', 'riachuelo',
    'natura', 'carrefour', 'puma', 'underarmour', 'oakley', 'rayban', 'eudora', 'qdb', 'belezanaweb',
    'manual', 'gazin', 'toymania', 'balaroti', 'homedock', 'kidy', 'terabyte', 'sottile', 'rosario'
  ];

  for (const r of roots) {
    if (clean.includes(r)) return r;
  }
  return '';
};

/**
 * Normaliza e gera todas as chaves de identificação da loja para busca universal
 */
export const getStoreLogoKeys = (storeId, storeName = '') => {
  const keys = [];
  if (storeId) {
    const cleanId = String(storeId).toLowerCase().trim();
    keys.push(cleanId);
    const withoutPrefix = cleanId.replace(/^store_awin_/, '').replace(/^store_/, '');
    if (withoutPrefix && withoutPrefix !== cleanId) {
      keys.push(withoutPrefix);
      keys.push(`store_${withoutPrefix}`);
      keys.push(`store_awin_${withoutPrefix}`);
    }
  }
  if (storeName) {
    const cleanName = String(storeName).toLowerCase().trim();
    keys.push(cleanName);
    const slug = cleanName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (slug) {
      keys.push(slug);
      const simplified = slug
        .replace(/(brasil|esportes|supermercados|chocolateria|oficial|academias|rio|leblon|bh|batel|steakhouse|cinemas|games|tech|calcados|viagens|moveis|design)$/g, '')
        .trim();
      if (simplified && simplified.length >= 3) {
        keys.push(simplified);
      }
    }
  }

  const rootFromId = getBrandRootKey(storeId);
  if (rootFromId) keys.push(rootFromId);
  const rootFromName = getBrandRootKey(storeName);
  if (rootFromName) keys.push(rootFromName);

  return [...new Set(keys.filter(Boolean))];
};

/**
 * Salva a logo e os ajustes de enquadramento no IndexedDB (imune à limitação de 5MB do LocalStorage)
 */
export const persistCustomLogoToIDB = async (key, logoData) => {
  if (!key || !logoData) return false;
  try {
    const db = await openIDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const cleanKey = String(key).toLowerCase().trim();
      store.put({ key: cleanKey, ...logoData, updatedAt: new Date().toISOString() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
};

/**
 * Carrega todos os logos e enquadramentos salvos no IndexedDB
 */
export const loadAllCustomLogosFromIDB = async () => {
  try {
    const db = await openIDB();
    if (!db) return {};
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const map = {};
        if (Array.isArray(req.result)) {
          req.result.forEach(item => {
            if (item && item.key) {
              map[item.key] = item;
            }
          });
        }
        resolve(map);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
};
