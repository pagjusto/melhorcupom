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
import kabumLogo from './kabum.svg';
import drogasilLogo from './drogasil.svg';
import sephoraLogo from './sephora.svg';
import petzLogo from './petz.svg';
import spoletoLogo from './spoleto.svg';
import netshoesLogo from './netshoes.svg';
import maderoLogo from './madero.png';
import fogodechaoLogo from './fogodechao.png';
import appleLogo from './apple.svg';
import paodeacucarLogo from './paodeacucar.svg';
import pinguimLogo from './pinguim.png';
import belmonteLogo from './botecobelmonte.jpg';
import corleoneLogo from './corleone.jpg';
import trackfieldLogo from './trackfield.jpg';
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

  for (const [k, v] of Object.entries(BRAND_LOGOS)) {
    const cleanK = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (cleanK && (key.includes(cleanK) || cleanK.includes(key))) {
      return v;
    }
  }
  return null;
};
