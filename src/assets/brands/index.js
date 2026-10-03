import amazonLogo from './amazon.svg';
import mercadolivreLogo from './mercadolivre.svg';
import shopeeLogo from './shopee.svg';
import sheinLogo from './shein.svg';
import aliexpressLogo from './aliexpress.svg';
import magaluLogo from './magalu.svg';
import nikeLogo from './nike.svg';
import mcdonaldsLogo from './mcdonalds.svg';
import burgerkingLogo from './burgerking.svg';
import outbackLogo from './outback.svg';
import smartfitLogo from './smartfit.svg';
import starbucksLogo from './starbucks.svg';
import cacaushowLogo from './cacaushow.svg';
import cinemarkLogo from './cinemark.svg';
import boticarioLogo from './boticario.svg';
import centauroLogo from './centauro.svg';
import adidasLogo from './adidas.svg';
import samsungLogo from './samsung.svg';
import casasbahiaLogo from './casasbahia.svg';
import subwayLogo from './subway.svg';

export const BRAND_LOGOS = {
  amazon: amazonLogo,
  mercadolivre: mercadolivreLogo,
  meli: mercadolivreLogo,
  shopee: shopeeLogo,
  shein: sheinLogo,
  aliexpress: aliexpressLogo,
  magalu: magaluLogo,
  magazineluiza: magaluLogo,
  nike: nikeLogo,
  mcdonalds: mcdonaldsLogo,
  mcdonald: mcdonaldsLogo,
  burgerking: burgerkingLogo,
  bk: burgerkingLogo,
  outback: outbackLogo,
  smartfit: smartfitLogo,
  starbucks: starbucksLogo,
  cacaushow: cacaushowLogo,
  cinemark: cinemarkLogo,
  boticario: boticarioLogo,
  oboticario: boticarioLogo,
  centauro: centauroLogo,
  adidas: adidasLogo,
  samsung: samsungLogo,
  casasbahia: casasbahiaLogo,
  subway: subwayLogo
};

export const getBrandLogo = (identifier) => {
  if (!identifier) return null;
  const key = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, v] of Object.entries(BRAND_LOGOS)) {
    if (key.includes(k)) return v;
  }
  return null;
};
