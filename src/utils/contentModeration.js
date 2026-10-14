/**
 * contentModeration.js - Sistema Anti-Pornografia, Conteúdo Explícito e Trolls/Zueiras
 * 
 * Protege a plataforma (formulários de cadastro, cupons) e impede que o robô do Instagram
 * publique qualquer conteúdo ofensivo, pornográfico ou pegadinhas de internet.
 */

// Normalizador avançado contra tentativas de evasão (leetspeak, espaçamento forçado, acentos)
export const normalizeTextForSafety = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  return rawText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    // Substituições comuns de Leetspeak
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[7+]/g, 't')
    .replace(/[8]/g, 'b')
    // Remove pontuações e símbolos mantendo apenas letras e espaços
    .replace(/[^a-z\s]/g, '')
    // Reduz múltiplos espaços para um só
    .replace(/\s+/g, ' ')
    .trim();
};

// Versão compactada sem nenhum espaço (para pegar "p o r n o" ou "c u c a b e l u d o")
export const compactTextForSafety = (normalizedText) => {
  return normalizedText.replace(/\s+/g, '');
};

// =========================================================================
// BANCO DE PALAVRAS E PADRÕES BLOQUEADOS
// =========================================================================

// 1. Pornografia, Conteúdo Adulto, Prostituição e Termos Sexuais Explícitos
const EXPLICIT_ADULT_TERMS = [
  'porn', 'porno', 'pornografia', 'hentai', 'sexo', 'sexual', 'erotico', 'erotica',
  'anal', 'oral', 'vaginal', 'penis', 'vagina', 'clitoris', 'buceta', 'boceta', 'xoxota',
  'piroca', 'pica', 'pauzao', 'caralho', 'rola', 'boquete', 'mamada', 'siririca',
  'masturba', 'gozar', 'gozada', 'orgasmo', 'orgia', 'suruba', 'gangbang', 'milf',
  'acompanhante', 'garota de programa', 'garotadeprograma', 'prostituta', 'prostituto',
  'putaria', 'puta', 'putedo', 'bordel', 'cabaré', 'cabare', 'strip', 'stripper', 'striptease',
  'webcamgirl', 'camgirl', 'onlyfans', 'privacy', 'xvideos', 'pornhub', 'redtube',
  'sexshop', 'dildo', 'vibrador', 'fetichismo', 'fetiche', 'bdsm', 'incesto', 'zoofilia',
  'pedofilia', 'novinha', 'novinhas', 'nude', 'nudes', 'pelada', 'pelado', 'safada', 'safado'
];

// 2. Pegadinhas / Trolls / Nomes Fictícios Clássicos de Zueira Brasileira
const TROLL_PRANK_NAMES = [
  'paulatejano', 'paula tejano', 'paul tejano',
  'tomasturbando', 'tomas turbando', 'thomas turbando',
  'cucabeludo', 'cuca beludo', 'cuca beluda',
  'jacintopinto', 'jacinto pinto', 'jacinto pinto aquino rego',
  'isadorapinto', 'isadora pinto',
  'miapica', 'mia pica',
  'oscaralho', 'oscar alho',
  'suelenvado', 'suelen vado',
  'deidecosta', 'deide costa',
  'benjamimarola', 'benjamim arola', 'benjamin arola',
  'humbertinho', 'humberto arola',
  'chupacu', 'chupa cu', 'chupadora',
  'simas turbo', 'simasturbo',
  'fukushima', 'tomei no', 'tomeino',
  'safadão', 'safadao', 'comi tua mae', 'comituamae',
  'teste fake', 'lojafake', 'loja fake'
];

// 3. Ofensas Graves, Discriminação e Discurso de Ódio
const HATE_SPEECH_TERMS = [
  'nazista', 'nazismo', 'hitler', 'suastica', 'fascista',
  'estupro', 'estuprador', 'estuprar', 'assassino', 'terrorista',
  'macaco', 'preto fedido', 'viado', 'bicha', 'traveco', 'sapatão', 'sapatao',
  'arrombado', 'filho da puta', 'filhadoputa', 'filhodaputa', 'cuzao', 'cusao'
];

// 4. Drogas Ilícitas e Substâncias Proibidas
const ILLEGAL_SUBSTANCES = [
  'cocaina', 'crack', 'lsd', 'heroina', 'maconha', 'baseado', 'beck', 'cannabis',
  'metanfetamina', 'trafico', 'traficante', 'biqueira', 'droga', 'drogas'
];

/**
 * Verifica se um texto contém termos proibidos, impróprios ou piadas ofensivas.
 * Retorna { safe: boolean, reason?: string, matched?: string }
 */
export const checkContentSafety = (text) => {
  if (!text || typeof text !== 'string') return { safe: true };

  const normalized = normalizeTextForSafety(text);
  const compacted = compactTextForSafety(normalized);

  // 1. Checar Nomes de Trolls / Pegadinhas
  for (const troll of TROLL_PRANK_NAMES) {
    const trollNorm = normalizeTextForSafety(troll);
    const trollComp = compactTextForSafety(trollNorm);
    if (normalized.includes(trollNorm) || compacted.includes(trollComp)) {
      return {
        safe: false,
        category: 'troll',
        reason: 'Nome ou termo de pegadinha/troll identificado.',
        matched: troll
      };
    }
  }

  // 2. Checar Pornografia e Conteúdo Adulto Explícito
  for (const adult of EXPLICIT_ADULT_TERMS) {
    const adultNorm = normalizeTextForSafety(adult);
    const adultComp = compactTextForSafety(adultNorm);

    // Para palavras muito curtas (ex: 'pau', 'cu', 'sexo'), exige casamento de palavra completa
    if (adultNorm.length <= 4) {
      const words = normalized.split(/\s+/);
      if (words.includes(adultNorm)) {
        return {
          safe: false,
          category: 'adult',
          reason: 'Conteúdo adulto ou explícito detectado.',
          matched: adult
        };
      }
    } else {
      if (normalized.includes(adultNorm) || compacted.includes(adultComp)) {
        return {
          safe: false,
          category: 'adult',
          reason: 'Conteúdo adulto ou sexual explícito detectado.',
          matched: adult
        };
      }
    }
  }

  // 3. Checar Discurso de Ódio e Ofensas Graves
  for (const hate of HATE_SPEECH_TERMS) {
    const hateNorm = normalizeTextForSafety(hate);
    if (normalized.includes(hateNorm) || compacted.includes(compactTextForSafety(hateNorm))) {
      return {
        safe: false,
        category: 'hate_speech',
        reason: 'Termo ofensivo ou discriminatório detectado.',
        matched: hate
      };
    }
  }

  // 4. Checar Drogas e Ilícitos
  for (const drug of ILLEGAL_SUBSTANCES) {
    const drugNorm = normalizeTextForSafety(drug);
    const words = normalized.split(/\s+/);
    if (words.includes(drugNorm) || normalized.includes(drugNorm)) {
      return {
        safe: false,
        category: 'illegal',
        reason: 'Menção a substâncias ou atividades ilícitas.',
        matched: drug
      };
    }
  }

  return { safe: true };
};

/**
 * Valida todos os campos de um novo lojista antes de permitir o cadastro e antes de postar no Instagram.
 */
export const validateStoreSafety = (storeData) => {
  if (!storeData) return { safe: false, reason: 'Dados da loja inválidos.' };

  const fieldsToCheck = [
    { name: 'Nome da Loja', value: storeData.name },
    { name: 'Razão Social', value: storeData.legalName },
    { name: 'Instagram', value: storeData.instagram },
    { name: 'Endereço', value: storeData.address },
    { name: 'Descrição / Detalhes', value: storeData.description },
    { name: 'E-mail Comercial', value: storeData.email }
  ];

  for (const field of fieldsToCheck) {
    if (field.value) {
      const result = checkContentSafety(field.value);
      if (!result.safe) {
        return {
          safe: false,
          field: field.name,
          reason: `O campo "${field.name}" contém termos proibidos ou impróprios.`,
          detail: result
        };
      }
    }
  }

  return { safe: true };
};

/**
 * Valida dados de um cupom ou oferta
 */
export const validateCouponSafety = (couponData) => {
  if (!couponData) return { safe: false, reason: 'Dados do cupom inválidos.' };

  const fieldsToCheck = [
    { name: 'Título do Cupom', value: couponData.title },
    { name: 'Descrição da Oferta', value: couponData.description },
    { name: 'Código do Cupom', value: couponData.code },
    { name: 'Regras da Promoção', value: Array.isArray(couponData.rules) ? couponData.rules.join(' ') : couponData.rules }
  ];

  for (const field of fieldsToCheck) {
    if (field.value) {
      const result = checkContentSafety(field.value);
      if (!result.safe) {
        return {
          safe: false,
          field: field.name,
          reason: `O campo "${field.name}" contém termos proibidos ou impróprios.`,
          detail: result
        };
      }
    }
  }

  return { safe: true };
};

/**
 * Valida dados de cadastro de um usuário consumidor
 */
export const validateUserSafety = (userData) => {
  if (!userData) return { safe: false, reason: 'Dados do usuário inválidos.' };

  const fieldsToCheck = [
    { name: 'Nome', value: userData.name },
    { name: 'E-mail', value: userData.email }
  ];

  for (const field of fieldsToCheck) {
    if (field.value) {
      const result = checkContentSafety(field.value);
      if (!result.safe) {
        return {
          safe: false,
          field: field.name,
          reason: `O campo "${field.name}" contém termos impróprios ou pegadinha.`,
          detail: result
        };
      }
    }
  }

  return { safe: true };
};
