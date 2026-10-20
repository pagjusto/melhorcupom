import spoletoLogo from './spoleto.svg';
import trackfieldLogo from './trackfield.jpg';
import burgerkingLogo from './burgerking.svg';
import cacaushowLogo from './cacaushow.svg';
import casasbahiaLogo from './casasbahia.svg';
import centauroLogo from './centauro.svg';
import cinemarkLogo from './cinemark.svg';
import drogasilLogo from './drogasil.svg';
import fogodechaoLogo from './fogodechao.png';
import kabumLogo from './kabum.svg';
import maderoLogo from './madero.png';
import magaluLogo from './magalu.svg';
import mercadolivreLogo from './mercadolivre.svg';
import outbackLogo from './outback.svg';
import samsungLogo from './samsung.svg';
import shopeeLogo from './shopee.svg';
import starbucksLogo from './starbucks.svg';
import adidasLogo from './adidas.svg';
import aliexpressLogo from './aliexpress.svg';
import appleLogo from './apple.svg';
import boticarioLogo from './boticario.svg';
import mcdonaldsLogo from './mcdonalds.svg';
import netshoesLogo from './netshoes.svg';
import nikeLogo from './nike.svg';
import paodeacucarLogo from './paodeacucar.svg';
import petzLogo from './petz.svg';
import sephoraLogo from './sephora.svg';
import sheinLogo from './shein.svg';
import smartfitLogo from './smartfit.svg';
import subwayLogo from './subway.svg';
import amazonLogo from './amazon.svg';
import pinguimLogo from './pinguim.png';
import belmonteLogo from './botecobelmonte.jpg';
import corleoneLogo from './corleone.jpg';
import omensLogo from './omens.svg';
import manualLogo from './manual.svg';

export const BRAND_LOGOS = {
  manual: manualLogo,
  'manual tratamento contra queda capilar': manualLogo,
  manualtratamentocontraquedacapilar: manualLogo,
  'manual brasil': manualLogo,
  manualbrasil: manualLogo,
  omens: omensLogo,
  'omens saúde masculina': omensLogo,
  omenssaudemasculina: omensLogo,
  amazon: amazonLogo,
  'amazon brasil': amazonLogo,
  amazonbrasil: amazonLogo,
  store_amazon: amazonLogo,
  mercadolivre: mercadolivreLogo,
  'mercado livre': mercadolivreLogo,
  meli: mercadolivreLogo,
  store_meli: mercadolivreLogo,
  storemeli: mercadolivreLogo,
  shopee: shopeeLogo,
  'shopee brasil': shopeeLogo,
  shopeebrasil: shopeeLogo,
  store_shopee: shopeeLogo,
  storeshopee: shopeeLogo,
  shein: sheinLogo,
  'shein brasil': sheinLogo,
  sheinbrasil: sheinLogo,
  store_shein: sheinLogo,
  storeshein: sheinLogo,
  aliexpress: aliexpressLogo,
  magalu: magaluLogo,
  magazineluiza: magaluLogo,
  'magazine luiza': magaluLogo,
  store_magalu: magaluLogo,
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
  subway: subwayLogo,
  kabum: kabumLogo,
  drogasil: drogasilLogo,
  sephora: sephoraLogo,
  petz: petzLogo,
  spoleto: spoletoLogo,
  netshoes: netshoesLogo,
  madero: maderoLogo,
  fogodechao: fogodechaoLogo,
  iplace: appleLogo,
  apple: appleLogo,
  paodeacucar: paodeacucarLogo,
  gpa: paodeacucarLogo,
  pinguim: pinguimLogo,
  choperiapinguim: pinguimLogo,
  belmonte: belmonteLogo,
  botecobelmonte: belmonteLogo,
  corleone: corleoneLogo,
  barbeariacorleone: corleoneLogo,
  trackfield: trackfieldLogo,
  trackandfield: trackfieldLogo,
  'track & field': trackfieldLogo
};

export const getBrandLogo = (identifier) => {
  if (!identifier || typeof identifier !== 'string') return null;
  const key = identifier.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  if (!key) return null;

  // 1. Busca exata prioritária
  if (BRAND_LOGOS[key]) return BRAND_LOGOS[key];

  // 2. Busca onde o identificador contém a chave da marca (ex: "loja magalu" contém "magalu")
  for (const [k, v] of Object.entries(BRAND_LOGOS)) {
    const cleanK = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (cleanK && cleanK.length >= 3 && key.includes(cleanK)) {
      return v;
    }
  }
  return null;
};
