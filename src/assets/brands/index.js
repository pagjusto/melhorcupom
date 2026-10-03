import amazonLogo from './amazon.svg';
import mercadolivreLogo from './mercadolivre.svg';
import shopeeLogo from './shopee.svg';
import sheinLogo from './shein.svg';
import aliexpressLogo from './aliexpress.svg';
import magaluLogo from './magalu.svg';
import nikeLogo from './nike.svg';

export const BRAND_LOGOS = {
  amazon: amazonLogo,
  mercadolivre: mercadolivreLogo,
  meli: mercadolivreLogo,
  shopee: shopeeLogo,
  shein: sheinLogo,
  aliexpress: aliexpressLogo,
  magalu: magaluLogo,
  nike: nikeLogo
};

export const getBrandLogo = (identifier) => {
  if (!identifier) return null;
  const key = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, v] of Object.entries(BRAND_LOGOS)) {
    if (key.includes(k)) return v;
  }
  return null;
};
