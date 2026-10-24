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

/**
 * Normaliza chaves de identificação da loja para busca universal
 */
export const getStoreLogoKeys = (storeId, storeName = '') => {
  const keys = [];
  if (storeId) {
    keys.push(String(storeId).toLowerCase().trim());
  }
  if (storeName) {
    const cleanName = String(storeName).toLowerCase().trim();
    keys.push(cleanName);
    const slug = cleanName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (slug) keys.push(slug);
  }
  return [...new Set(keys)];
};
