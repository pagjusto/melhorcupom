import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Instagram,
  Send,
  Copy,
  Check,
  Plus,
  Trash2,
  DollarSign,
  Users,
  Store,
  Sparkles,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Gift,
  Link as LinkIcon,
  Download,
  Award,
  Wallet,
  Lock,
  Search,
  MapPin,
  Globe,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MIN_WITHDRAWAL_AMOUNT = 250;

// Catálogo de Páginas "Mil Grau" e Guias de Cidades do Brasil com alto engajamento local
const BRAZIL_MILGRAU_PAGES = [
  // Santa Catarina (SC)
  { handle: '@videiramilgrau_sc', name: 'Videira Mil Grau', city: 'Videira - SC', state: 'SC', followers: '28k+', code: 'VIDEIRAMG5' },
  { handle: '@videiramilgrau', name: 'Videira Mil Grau Oficial', city: 'Videira - SC', state: 'SC', followers: '25k+', code: 'VIDEIRA5' },
  { handle: '@chapecomilgrauoficial', name: 'Chapecó Mil Grau', city: 'Chapecó - SC', state: 'SC', followers: '115k+', code: 'CHAPECOMG5' },
  { handle: '@floripamilgrauoficial', name: 'Floripa Mil Grau', city: 'Florianópolis - SC', state: 'SC', followers: '320k+', code: 'FLORIPAMG5' },
  { handle: '@joinville.milgrau', name: 'Joinville Mil Grau', city: 'Joinville - SC', state: 'SC', followers: '140k+', code: 'JOINVILLEMG5' },
  { handle: '@blumilgrau', name: 'Blumenau Mil Grau', city: 'Blumenau - SC', state: 'SC', followers: '165k+', code: 'BLUMILGRAU5' },
  { handle: '@lages_milgrau', name: 'Lages Mil Grau', city: 'Lages - SC', state: 'SC', followers: '64k+', code: 'LAGESMG5' },
  { handle: '@balneariomilgrau_', name: 'Balneário Camboriú Mil Grau', city: 'Balneário Camboriú - SC', state: 'SC', followers: '190k+', code: 'BCMILGRAU5' },
  { handle: '@itajaimilgr4u', name: 'Itajaí Mil Grau', city: 'Itajaí - SC', state: 'SC', followers: '82k+', code: 'ITAJAIMG5' },
  { handle: '@criciumamilgrau_', name: 'Criciúma Mil Grau', city: 'Criciúma - SC', state: 'SC', followers: '95k+', code: 'CRICIUMAMG5' },
  { handle: '@jaraguamilgrau', name: 'Jaraguá do Sul Mil Grau', city: 'Jaraguá do Sul - SC', state: 'SC', followers: '58k+', code: 'JARAGUAMG5' },
  { handle: '@tubaraomilgrau', name: 'Tubarão Mil Grau', city: 'Tubarão - SC', state: 'SC', followers: '46k+', code: 'TUBARAOMG5' },
  { handle: '@concordiamilgrau', name: 'Concórdia Mil Grau', city: 'Concórdia - SC', state: 'SC', followers: '35k+', code: 'CONCORDIAMG5' },
  { handle: '@joacabamilgrau', name: 'Joaçaba & Meio-Oeste Mil Grau', city: 'Joaçaba - SC', state: 'SC', followers: '31k+', code: 'JOACABAMG5' },
  { handle: '@cacadormilgrau', name: 'Caçador Mil Grau', city: 'Caçador - SC', state: 'SC', followers: '34k+', code: 'CACADORMG5' },

  // Paraná & Rio Grande do Sul (Sul)
  { handle: '@curitibamilgrau', name: 'Curitiba Mil Grau', city: 'Curitiba - PR', state: 'PR', followers: '410k+', code: 'CURITIBAMG5' },
  { handle: '@campinamilgrau', name: 'Campina Mil Grau', city: 'Campina Grande do Sul - PR', state: 'PR', followers: '45k+', code: 'CAMPINAPR5' },
  { handle: '@londrinamilgrau', name: 'Londrina Mil Grau', city: 'Londrina - PR', state: 'PR', followers: '130k+', code: 'LONDRINAMG5' },
  { handle: '@milgraumfc', name: 'Maringá Mil Grau', city: 'Maringá - PR', state: 'PR', followers: '92k+', code: 'MARINGAMG5' },
  { handle: '@cascavelmilgrau', name: 'Cascavel Mil Grau', city: 'Cascavel - PR', state: 'PR', followers: '88k+', code: 'CASCAVELMG5' },
  { handle: '@pontagrossamilgrau', name: 'Ponta Grossa Mil Grau', city: 'Ponta Grossa - PR', state: 'PR', followers: '76k+', code: 'PGMILGRAU5' },
  { handle: '@poamilgrau', name: 'Porto Alegre Mil Grau', city: 'Porto Alegre - RS', state: 'RS', followers: '280k+', code: 'POAMILGRAU5' },
  { handle: '@caxiasmilgrau', name: 'Caxias do Sul Mil Grau', city: 'Caxias do Sul - RS', state: 'RS', followers: '110k+', code: 'CAXIAXMG5' },
  { handle: '@passofundomilgrau', name: 'Passo Fundo Mil Grau', city: 'Passo Fundo - RS', state: 'RS', followers: '67k+', code: 'PASSOFUNDOMG5' },

  // São Paulo (SP)
  { handle: '@sorocabamilgrau', name: 'Sorocaba Mil Grau', city: 'Sorocaba - SP', state: 'SP', followers: '175k+', code: 'SOROCABAMG5' },
  { handle: '@spmilgrau', name: 'São Paulo Mil Grau', city: 'São Paulo - SP', state: 'SP', followers: '520k+', code: 'SPMILGRAU5' },
  { handle: '@campinasmilgrau', name: 'Campinas Mil Grau', city: 'Campinas - SP', state: 'SP', followers: '210k+', code: 'CAMPINASMG5' },
  { handle: '@santosmilgrau', name: 'Santos & Baixada Mil Grau', city: 'Santos - SP', state: 'SP', followers: '160k+', code: 'SANTOSMG5' },
  { handle: '@ribeiraomilgrau', name: 'Ribeirão Preto Mil Grau', city: 'Ribeirão Preto - SP', state: 'SP', followers: '145k+', code: 'RIBEIRAOMG5' },
  { handle: '@sjcmilgrau', name: 'São José dos Campos Mil Grau', city: 'São José dos Campos - SP', state: 'SP', followers: '125k+', code: 'SJCMILGRAU5' },
  { handle: '@baurumilgrau', name: 'Bauru Mil Grau', city: 'Bauru - SP', state: 'SP', followers: '85k+', code: 'BAURUMG5' },
  { handle: '@jundiaimilgrau', name: 'Jundiaí Mil Grau', city: 'Jundiaí - SP', state: 'SP', followers: '94k+', code: 'JUNDIAIMG5' },

  // MG, RJ, Centro-Oeste e Nordeste
  { handle: '@goianiamilgraus', name: 'Goiânia Mil Graus', city: 'Goiânia - GO', state: 'GO', followers: '290k+', code: 'GOIANIAMG5' },
  { handle: '@bhmilgrau', name: 'BH Mil Grau', city: 'Belo Horizonte - MG', state: 'MG', followers: '380k+', code: 'BHMILGRAU5' },
  { handle: '@uberlandiamilgrau', name: 'Uberlândia Mil Grau', city: 'Uberlândia - MG', state: 'MG', followers: '135k+', code: 'UBERLANDIAMG5' },
  { handle: '@rjmilgrau', name: 'Rio de Janeiro Mil Grau', city: 'Rio de Janeiro - RJ', state: 'RJ', followers: '440k+', code: 'RJMILGRAU5' },
  { handle: '@niteroimilgrau', name: 'Niterói Mil Grau', city: 'Niterói - RJ', state: 'RJ', followers: '118k+', code: 'NITEROIMG5' },
  { handle: '@brasiliamilgrau', name: 'Brasília Mil Grau', city: 'Brasília - DF', state: 'DF', followers: '260k+', code: 'BRASILIAMG5' },
  { handle: '@campina1000graus', name: 'Campina Grande 1000 Graus', city: 'Campina Grande - PB', state: 'PB', followers: '185k+', code: 'CAMPINA1000G5' },
  { handle: '@salvadormilgrau', name: 'Salvador Mil Grau', city: 'Salvador - BA', state: 'BA', followers: '310k+', code: 'SALVADORMG5' },
  { handle: '@fortalezamilgrau', name: 'Fortaleza Mil Grau', city: 'Fortaleza - CE', state: 'CE', followers: '340k+', code: 'FORTALEZAMG5' },
  { handle: '@recifemilgrau', name: 'Recife Mil Grau', city: 'Recife - PE', state: 'PE', followers: '295k+', code: 'RECIFEMG5' }
];

const INITIAL_INSTAGRAM_PARTNERS = [
  {
    id: 'ig_partner_videira',
    handle: '@videiramilgrau_sc',
    name: 'Videira Mil Grau (Videira - SC)',
    followers: '28k+',
    code: 'VIDEIRAMG5',
    pixKey: 'A definir no saque',
    whatsapp: '',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  },
  {
    id: 'ig_partner_chapeco',
    handle: '@chapecomilgrauoficial',
    name: 'Chapecó Mil Grau (Chapecó - SC)',
    followers: '115k+',
    code: 'CHAPECOMG5',
    pixKey: 'A definir no saque',
    whatsapp: '',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  },
  {
    id: 'ig_partner_floripa',
    handle: '@floripamilgrauoficial',
    name: 'Floripa Mil Grau (Florianópolis - SC)',
    followers: '320k+',
    code: 'FLORIPAMG5',
    pixKey: 'A definir no saque',
    whatsapp: '',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  },
  {
    id: 'ig_partner_curitiba',
    handle: '@curitibamilgrau',
    name: 'Curitiba Mil Grau (Curitiba - PR)',
    followers: '410k+',
    code: 'CURITIBAMG5',
    pixKey: 'A definir no saque',
    whatsapp: '',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  },
  {
    id: 'ig_partner_1',
    handle: '@achadinhos.brasil',
    name: 'Achadinhos & Ofertas Brasil',
    followers: '145k',
    code: 'ACHADINHOS5',
    pixKey: 'contato@achadinhosbrasil.com.br',
    whatsapp: '(11) 98877-6655',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  }
];

const PITCH_TEMPLATES = [
  {
    id: 'pitch_milgrau',
    title: '🔥 Mensagem Universal • Páginas "Mil Grau" & Cidades (Sem nome p/ enviar p/ todas)',
    badge: 'Universal • Páginas da Cidade',
    getText: () => `Fala, galera! Tudo certo por aí? 🔥🚀

Acompanhamos o trabalho gigante de vocês movimentando a cidade e sabemos a força que a página tem tanto com a galera quanto com os comércios locais!

Aqui é da direção do *Melhor Cupom (@omelhorcupom.com.br)*! Nós somos a plataforma onde os comércios da cidade divulgam cupons exclusivos e os seguidores economizam até 50% todos os dias em lanches, restaurantes, serviços e nas grandes lojas (Shopee, Magalu, SHEIN, Amazon).

Queremos convidar a página de vocês para se tornar *Divulgador Oficial Parceiro* na cidade e faturar alto com a sua audiência:

💰 *QUANTO A PÁGINA GANHA NO CAIXA:*
🏪 *+R$ 5,00 de saldo* por cada *Comércio / Empresa da cidade* que se cadastrar e assinar VIP pelo link de divulgador de vocês!
🙋‍♂️ *+R$ 3,00 de saldo* por cada *Seguidor / Usuário* que ativar o Clube VIP pelo link de divulgador de vocês!
🏦 *Saque Direto no PIX:* Todo valor entra na hora no *Saldo do Caixa* do painel de vocês. Bateu *R$ 250,00 de saldo*, o saque via PIX já fica liberado direto pra conta da página!

📲 *COMO SE CADASTRAR E PEGAR SEU LINK DE DIVULGADOR (leva 1 minuto):*
1️⃣ Acesse o nosso site oficial: 👉 https://omelhorcupom.com.br
2️⃣ Crie a conta gratuita da página de vocês
3️⃣ Acesse o menu *"Meu Perfil / Indique & Ganhe"* para pegar o seu *Link Exclusivo de Divulgador* e acompanhar o saldo em tempo real!

💡 *Simulação rápida pra cidade:*
Com apenas 20 comércios da cidade divulgando cupom (R$ 100) + 50 seguidores no clube VIP (R$ 150), vocês já batem *R$ 250,00* e sacam no PIX!

Bora cadastrar a página hoje e pegar o link de divulgador de vocês? Qualquer dúvida estamos à disposição! 🤝🔥`
  },
  {
    id: 'pitch_completo',
    title: '🔥 Proposta Universal Completa (Páginas de Ofertas, Humor e Notícias)',
    badge: 'Universal • Completo',
    getText: () => `Olá, equipe! Tudo bem por aí? 👋✨

Acompanhamos o perfil de vocês e vimos que o público da página adora boas oportunidades e economia!

Somos do *Melhor Cupom (@omelhorcupom.com.br)*, o clube oficial de descontos locais e nacionais (com cupons de até 50% OFF em restaurantes, comércios e achadinhos virais da Shopee, Magalu e SHEIN).

Queremos convidar a página de vocês para se cadastrar como *Divulgador Parceiro Oficial* e monetizar com a sua audiência:

💰 *COMO FUNCIONA O SEU SALDO DE DIVULGADOR:*
✅ *+R$ 5,00 de saldo* por cada *Empresa / Comércio* que se cadastrar e assinar VIP pelo seu link de divulgador!
✅ *+R$ 3,00 de saldo* por cada *Usuário / Seguidor* que assinar o Clube VIP pelo seu link de divulgador!
🏦 *Saque via PIX:* Todo valor acumula automaticamente no *Saldo do Caixa* da conta de vocês na plataforma. Ao atingir a partir de *R$ 250,00 de saldo*, vocês já podem solicitar o *Saque direto no PIX* pelo painel!

📲 *COMO SE CADASTRAR E PEGAR SEU LINK DE DIVULGADOR:*
1️⃣ Acesse o nosso site oficial: 👉 https://omelhorcupom.com.br
2️⃣ Faça o cadastro gratuito do perfil da página
3️⃣ Dentro do seu painel (*Meu Perfil → Indique & Ganhe*), copie o seu *Link Exclusivo de Divulgador* para colocar nos Stories e na Bio!

📈 *Simulação rápida para a página de vocês:*
• Com apenas 50 seguidores no clube (R$ 150) + 20 comércios que se cadastrarem e assinarem VIP (R$ 100), vocês já batem *R$ 250,00 de saldo* e liberam o saque no PIX!

Vamos ativar essa parceria hoje? Faça o cadastro lá no site e nos avise aqui para enviarmos o Kit de Artes dos Stories! 🤝🚀`
  },
  {
    id: 'pitch_curto_dm',
    title: '⚡ Abordagem Universal Curta p/ Direct (Sem nome • Copiar e Colar)',
    badge: 'Universal • Rápido',
    getText: () => `Opa, galera! Tudo ótimo por aí? 🚀

Aqui é da direção do *@omelhorcupom.com.br*! Estamos selecionando grandes páginas das cidades para o nosso *Programa Oficial de Divulgadores Parceiros*.

Funciona assim: vocês se cadastram no site, pegam o *Link de Divulgador* exclusivo da página e acumulam saldo em dinheiro a cada indicação:
🏪 *+R$ 5,00 de saldo* por cada *Empresa / Comércio* que se cadastrar e assinar VIP pelo link de vocês!
🙋‍♂️ *+R$ 3,00 de saldo* por cada *Usuário / Seguidor* que ativar o Clube VIP pelo link de vocês!
💸 *Saque no PIX:* Atingindo *R$ 250,00 de saldo acumulado* no painel, é só solicitar o saque direto para a chave PIX da página!

📲 *Para pegar o Link de Divulgador da página agora mesmo:*
Basta acessar 👉 https://omelhorcupom.com.br , criar sua conta gratuita e copiar seu link na aba *"Meu Perfil / Indique & Ganhe"*!

Bora ativar? Assim que cadastrarem me avisa aqui pra eu liberar o Kit de Stories pra vocês! 💰🔥`
  }
];

export const AdminInstagramPartners = ({ showToast }) => {
  const [partners, setPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_ig_partners_v1');
      const syncDone = localStorage.getItem('melhor_cupom_ig_milgrau_sync_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !syncDone) {
          const existingHandles = new Set(parsed.map(p => (p.handle || '').toLowerCase()));
          const toAdd = INITIAL_INSTAGRAM_PARTNERS.filter(p => !existingHandles.has(p.handle.toLowerCase()));
          const merged = [...toAdd, ...parsed];
          localStorage.setItem('melhor_cupom_ig_partners_v1', JSON.stringify(merged));
          localStorage.setItem('melhor_cupom_ig_milgrau_sync_v1', 'done');
          return merged;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_INSTAGRAM_PARTNERS;
  });

  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState('pitch_milgrau');
  const [copiedId, setCopiedId] = useState(null);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');

  // Formulário para adicionar nova página parceira
  const [newPartner, setNewPartner] = useState({
    handle: '',
    name: '',
    followers: '',
    code: '',
    pixKey: '',
    whatsapp: ''
  });

  const savePartners = (updated) => {
    setPartners(updated);
    localStorage.setItem('melhor_cupom_ig_partners_v1', JSON.stringify(updated));
  };

  const activePartner = useMemo(() => {
    return partners.find(p => p.id === selectedPartnerId) || partners[0] || {
      handle: '@sua.pagina',
      name: 'Página Parceira',
      code: 'PARCEIRO5',
      usersReferred: 0,
      storesReferred: 0,
      paidAmount: 0
    };
  }, [partners, selectedPartnerId]);

  const activeTemplate = PITCH_TEMPLATES.find(t => t.id === selectedTemplateId) || PITCH_TEMPLATES[0];
  const generatedMessage = activeTemplate.getText(activePartner);
  const partnerLink = `https://omelhorcupom.com.br/convite/${activePartner.code}`;

  // Totais financeiros de todas as páginas
  const totals = useMemo(() => {
    let totalUsers = 0;
    let totalStores = 0;
    let totalAccumulatedBalance = 0;
    let totalUnlockedForPix = 0;
    let totalPaid = 0;

    partners.forEach(p => {
      const u = p.usersReferred || 0;
      const s = p.storesReferred || 0;
      const earned = (u * 3) + (s * 5);
      const currentBalance = Math.max(0, earned - (p.paidAmount || 0));
      totalUsers += u;
      totalStores += s;
      totalAccumulatedBalance += currentBalance;
      if (currentBalance >= MIN_WITHDRAWAL_AMOUNT) {
        totalUnlockedForPix += currentBalance;
      }
      totalPaid += (p.paidAmount || 0);
    });

    return {
      totalUsers,
      totalStores,
      totalAccumulatedBalance,
      totalUnlockedForPix,
      totalPaid
    };
  }, [partners]);

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.handle.trim()) return;

    const cleanHandle = newPartner.handle.trim().startsWith('@')
      ? newPartner.handle.trim()
      : `@${newPartner.handle.trim()}`;

    const autoCode = (newPartner.code.trim() || cleanHandle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) + '5').toUpperCase();

    const created = {
      id: `ig_partner_${Date.now()}`,
      handle: cleanHandle,
      name: newPartner.name.trim() || cleanHandle,
      followers: newPartner.followers.trim() || '50k+',
      code: autoCode,
      pixKey: newPartner.pixKey.trim() || 'A definir no saque',
      whatsapp: newPartner.whatsapp.trim() || '',
      usersReferred: 0,
      storesReferred: 0,
      paidAmount: 0,
      withdrawalRequested: false,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    const updated = [created, ...partners];
    savePartners(updated);
    setSelectedPartnerId(created.id);
    setNewPartner({ handle: '', name: '', followers: '', code: '', pixKey: '', whatsapp: '' });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (showToast) {
      showToast(`Página ${cleanHandle} adicionada! Proposta de parceria pronta para enviar.`);
    }
  };

  const handleAdjustCount = (id, field, delta) => {
    const updated = partners.map(p => {
      if (p.id !== id) return p;
      const nextVal = Math.max(0, (p[field] || 0) + delta);
      return { ...p, [field]: nextVal };
    });
    savePartners(updated);
    if (delta > 0 && showToast) {
      showToast(
        field === 'storesReferred'
          ? '🏪 +1 Empresa cadastrada (+R$ 5,00 creditados no Saldo da página)!'
          : '🙋‍♂️ +1 Usuário cadastrado (+R$ 3,00 creditados no Saldo da página)!'
      );
    }
  };

  const handleSettlePayout = (partner) => {
    const earned = ((partner.usersReferred || 0) * 3) + ((partner.storesReferred || 0) * 5);
    const currentBalance = Math.max(0, earned - (partner.paidAmount || 0));

    if (currentBalance < MIN_WITHDRAWAL_AMOUNT) {
      if (showToast) {
        showToast(`Saque PIX liberado apenas acima de R$ ${MIN_WITHDRAWAL_AMOUNT},00. Saldo atual: R$ ${currentBalance.toFixed(2).replace('.', ',')}`, 'info');
      }
      return;
    }

    const updated = partners.map(p => {
      if (p.id !== partner.id) return p;
      return { ...p, paidAmount: earned, withdrawalRequested: false };
    });
    savePartners(updated);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#FF5F00']
    });

    if (showToast) {
      showToast(`✅ Saque PIX de R$ ${currentBalance.toFixed(2).replace('.', ',')} aprovado e pago para ${partner.handle}!`);
    }
  };

  const handleDeletePartner = (id) => {
    const updated = partners.filter(p => p.id !== id);
    savePartners(updated);
    if (selectedPartnerId === id && updated[0]) {
      setSelectedPartnerId(updated[0].id);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
    if (showToast) showToast('Copiado para a área de transferência!');
  };

  const handleSendWhatsApp = (partner, text) => {
    const digits = (partner.whatsapp || '').replace(/\D/g, '');
    const phoneParam = digits.length >= 10 ? `55${digits}` : '';
    const url = phoneParam
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleOpenInstagramDM = (handle) => {
    const clean = (handle || '').replace('@', '').trim();
    window.open(`https://www.instagram.com/${clean}/`, '_blank');
  };

  // Copiar a proposta universal e já abrir o Instagram da página para colar no Direct
  const handleSelectOrImportMilGrauPage = (item) => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedId('pitch_msg');
    setTimeout(() => setCopiedId(null), 2500);

    const existing = partners.find(
      p => (p.handle || '').toLowerCase() === (item.handle || '').toLowerCase()
    );
    if (existing) {
      setSelectedPartnerId(existing.id);
    } else {
      const cleanCode = (item.code || item.handle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) + '5').toUpperCase();
      const created = {
        id: `ig_partner_${Date.now()}`,
        handle: item.handle.startsWith('@') ? item.handle : `@${item.handle}`,
        name: item.city.includes(' - ') ? `${item.name} (${item.city})` : `${item.name} (${item.city}/${item.state})`,
        followers: item.followers || '50k+',
        code: cleanCode,
        pixKey: 'A definir no saque',
        whatsapp: '',
        usersReferred: 0,
        storesReferred: 0,
        paidAmount: 0,
        withdrawalRequested: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      const updated = [created, ...partners];
      savePartners(updated);
      setSelectedPartnerId(created.id);
    }

    handleOpenInstagramDM(item.handle);

    if (showToast) {
      showToast(`📋 Proposta universal copiada! Abrindo ${item.handle} p/ você só colar no Direct!`);
    }
  };

  // Filtro inteligente do catálogo de páginas Mil Grau do Brasil
  const filteredMilGrauCatalog = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase();
    return BRAZIL_MILGRAU_PAGES.filter(item => {
      if (selectedRegionFilter !== 'ALL') {
        if (selectedRegionFilter === 'SC' && item.state !== 'SC') return false;
        if (selectedRegionFilter === 'SUL' && !['SC', 'PR', 'RS'].includes(item.state)) return false;
        if (selectedRegionFilter === 'SP' && item.state !== 'SP') return false;
        if (selectedRegionFilter === 'OUTROS' && ['SC', 'PR', 'RS', 'SP'].includes(item.state)) return false;
      }
      if (!q) return true;
      return (
        item.city.toLowerCase().includes(q) ||
        item.handle.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
      );
    });
  }, [citySearchQuery, selectedRegionFilter]);

  // Gerador dinâmico de @ para qualquer cidade do Brasil digitada no buscador
  const smartCitySuggestions = useMemo(() => {
    const raw = citySearchQuery.trim();
    if (raw.length < 3) return [];
    const slug = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .replace(/milgrau.*$/, '');
    if (!slug) return [];
    const baseCode = `${slug.substring(0, 7).toUpperCase()}MG5`;
    return [
      {
        handle: `@${slug}milgrau`,
        name: `${raw} Mil Grau`,
        city: raw,
        state: 'BR',
        followers: 'Verificar no IG',
        code: baseCode
      },
      {
        handle: `@${slug}milgrau_sc`,
        name: `${raw} Mil Grau SC`,
        city: raw,
        state: 'SC',
        followers: 'Verificar no IG',
        code: `${slug.substring(0, 6).toUpperCase()}SC5`
      },
      {
        handle: `@${slug}_milgrau`,
        name: `${raw} Mil Grau Oficial`,
        city: raw,
        state: 'BR',
        followers: 'Verificar no IG',
        code: `${slug.substring(0, 6).toUpperCase()}OF5`
      },
      {
        handle: `@${slug}milgrauoficial`,
        name: `${raw} Mil Grau Oficial`,
        city: raw,
        state: 'BR',
        followers: 'Verificar no IG',
        code: `${slug.substring(0, 6).toUpperCase()}MG5`
      }
    ];
  }, [citySearchQuery]);

  // Gerar Criativo Visual Universal de Proposta Oficial (1080x1350) para enviar no Direct/WhatsApp de qualquer página
  const handleDownloadPartnerCard = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Fundo escuro premium
    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
    grad.addColorStop(0, '#180B05');
    grad.addColorStop(0.5, '#12121D');
    grad.addColorStop(1, '#090910');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Moldura neon laranja/dourada
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 6;
    ctx.strokeRect(35, 35, 1010, 1280);

    // Topo Badge
    ctx.fillStyle = '#FF5F00';
    ctx.beginPath();
    ctx.roundRect(220, 75, 640, 58, 29);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤝 CONVITE OFICIAL DE PARCERIA AFILIADA', 540, 113);

    // Título Universal para Páginas
    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 48px Inter, sans-serif';
    ctx.fillText('PÁGINAS & GUIAS DA CIDADE', 540, 205);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 40px Inter, sans-serif';
    ctx.fillText('ACUMULE SALDO DIVULGANDO', 540, 280);
    ctx.fillStyle = '#FF5F00';
    ctx.font = '900 48px Inter, sans-serif';
    ctx.fillText('O MELHOR CUPOM BRASIL', 540, 340);

    // Card 1: R$ 5,00 por Empresa
    ctx.fillStyle = 'rgba(255, 95, 0, 0.14)';
    ctx.strokeStyle = '#FF5F00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(90, 390, 900, 195, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 66px Inter, sans-serif';
    ctx.fillText('+ R$ 5,00 DE SALDO', 540, 480);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px Inter, sans-serif';
    ctx.fillText('POR CADA EMPRESA / COMÉRCIO QUE CADASTRAR E ASSINAR VIP', 540, 540);

    // Card 2: R$ 3,00 por Usuário
    ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(90, 615, 900, 195, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = '900 66px Inter, sans-serif';
    ctx.fillText('+ R$ 3,00 DE SALDO', 540, 705);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px Inter, sans-serif';
    ctx.fillText('POR CADA USUÁRIO / SEGUIDOR QUE ASSINAR PELO SEU LINK', 540, 765);

    // Card 3: Regra de Saque PIX acima de R$ 250,00
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(90, 840, 900, 115, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 30px Inter, sans-serif';
    ctx.fillText('🏦 SAQUE DIRETO NO PIX LIBERADO ACIMA DE R$ 250,00 DE SALDO!', 540, 908);

    // Caixa de Cadastro de Divulgador
    ctx.fillStyle = '#161625';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(90, 985, 900, 165, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '700 23px Inter, sans-serif';
    ctx.fillText('CADASTRE A PÁGINA E PEGUE SEU LINK DE DIVULGADOR EM:', 540, 1038);

    ctx.fillStyle = '#34D399';
    ctx.font = '900 42px monospace';
    ctx.fillText('omelhorcupom.com.br', 540, 1104);

    // Rodapé
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 25px Inter, sans-serif';
    ctx.fillText('📲 Crie sua conta • Pegue seu Link no Perfil • Saque via PIX', 540, 1235);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'proposta-universal-paginas-parceiras.png';
    a.click();

    if (showToast) {
      showToast('Arte universal da proposta baixada! Pode enviar para todas as páginas.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER DA CENTRAL DE PARCERIAS COM PÁGINAS DE INSTAGRAM */}
      <div className="bg-gradient-to-r from-[#2A0E24] via-[#1D1028] to-[#12121E] border-2 border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-[#FF5F00] text-white text-xs font-black uppercase tracking-wider">
                <Instagram size={14} />
                <span>Programa de Divulgadores para Páginas de Instagram</span>
              </span>
              <span className="text-xs text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 font-black">
                🏪 +R$ 5,00 / Empresa (Cadastro + VIP) • 🙋‍♂️ +R$ 3,00 / Usuário • 🏦 Saque PIX ≥ R$ 250,00
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Oferta Comercial Universal & Saldo de Divulgadores
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Mensagem <strong>100% universal (sem nome de página específica)</strong>: copie uma única vez e envie para quantas páginas quiser! Elas entram em <strong>omelhorcupom.com.br</strong>, criam a conta e pegam o próprio <strong>Link de Divulgador</strong> no perfil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopyText(generatedMessage, 'pitch_header')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              {copiedId === 'pitch_header' ? <Check size={17} /> : <Copy size={17} />}
              <span>{copiedId === 'pitch_header' ? '✅ Proposta Universal Copiada!' : '📋 Copiar Proposta Universal (Enviar p/ Todas)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPartnerCard}
              className="bg-gradient-to-r from-[#FF5F00] via-rose-600 to-fuchsia-600 hover:from-[#E04F00] hover:to-fuchsia-500 text-white font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-fuchsia-900/40 transition-all hover:scale-105 cursor-pointer"
            >
              <Download size={17} />
              <span>🎨 Baixar Card Universal da Oferta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPIS DE SALDO E SAQUES DAS PÁGINAS PARCEIRAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
            <span>Páginas Parceiras</span>
            <Instagram size={16} className="text-fuchsia-400" />
          </div>
          <div className="text-3xl font-black text-white font-display mt-1">
            {partners.length}
          </div>
          <span className="text-[11px] text-fuchsia-300 font-semibold block mt-1">
            Acumulando saldo via link
          </span>
        </div>

        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
            <span>Empresas Indicadas (+R$ 5)</span>
            <Store size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-display mt-1">
            {totals.totalStores} <span className="text-sm text-gray-400 font-normal">lojas</span>
          </div>
          <span className="text-[11px] text-amber-300 font-semibold block mt-1">
            Gerado em saldo: R$ {(totals.totalStores * 5).toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
            <span>Usuários Indicados (+R$ 3)</span>
            <Users size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-display mt-1">
            {totals.totalUsers} <span className="text-sm text-gray-400 font-normal">usuários</span>
          </div>
          <span className="text-[11px] text-emerald-300 font-semibold block mt-1">
            Gerado em saldo: R$ {(totals.totalUsers * 3).toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="bg-[#151522] border-2 border-emerald-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold uppercase">
            <span>Liberado p/ Saque (≥ R$ 250)</span>
            <Wallet size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-display mt-1">
            R$ {totals.totalUnlockedForPix.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-gray-400 font-semibold block mt-1">
            Em acúmulo (&lt; R$ 250): R$ {(totals.totalAccumulatedBalance - totals.totalUnlockedForPix).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* 2.5 RADAR & BUSCADOR DE PÁGINAS "MIL GRAU" DAS CIDADES DO BRASIL */}
      <div className="bg-gradient-to-br from-[#1A1325] via-[#151522] to-[#12121D] border-2 border-amber-500/35 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Flame size={14} className="text-orange-400" />
              <span>Radar Nacional • Páginas "Mil Grau" & Humor Regional</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🔎 Buscador de Instagrams "Mil Grau" das Cidades do Brasil</span>
            </h3>
            <p className="text-xs text-gray-300 max-w-3xl">
              Clique em <strong>"📋 Copiar Proposta & Abrir IG"</strong> em qualquer página abaixo: o sistema copia o convite universal (sem nomes específicos) e já abre o Instagram da página para você só dar <strong>Colar (Ctrl+V)</strong> no Direct!
            </p>
          </div>

          {/* Filtros rápidos de Região */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: `🇧🇷 Todas (${BRAZIL_MILGRAU_PAGES.length})` },
              { id: 'SC', label: '📍 Santa Catarina (SC)' },
              { id: 'SUL', label: '🧉 Sul (SC / PR / RS)' },
              { id: 'SP', label: '🏙️ São Paulo (SP)' },
              { id: 'OUTROS', label: '🔥 MG / RJ / GO / NE' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegionFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  selectedRegionFilter === tab.id
                    ? 'bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white border-amber-400 shadow-lg shadow-orange-950/50'
                    : 'bg-[#1D1D2E] text-gray-300 border-white/10 hover:border-amber-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Busca por Cidade ou @ + Botão Buscar no Instagram/Google */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
              placeholder="Digite o nome de qualquer cidade do Brasil (ex: Videira, Caçador, Joaçaba, Chapecó, Curitiba, Campinas...)"
              className="w-full bg-[#0F0F18] border border-white/15 focus:border-amber-400 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>
          {citySearchQuery.trim() && (
            <button
              type="button"
              onClick={() => {
                const q = encodeURIComponent(`site:instagram.com "${citySearchQuery.trim()}" "mil grau" OR "milgrau"`);
                window.open(`https://www.google.com/search?q=${q}`, '_blank');
              }}
              className="bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300 font-black px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Globe size={15} />
              <span>Buscar "{citySearchQuery.trim()} Mil Grau" no Google/IG</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>

        {/* Gerador Instantâneo caso o admin digite uma cidade que ainda não está na lista */}
        {smartCitySuggestions.length > 0 && filteredMilGrauCatalog.length === 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>Sugestões automáticas de @ para a cidade de "{citySearchQuery.trim()}":</span>
              </span>
              <span className="text-[11px] text-gray-400">
                Clique em <strong>Copiar & Abrir IG</strong> para já abrir o perfil com a proposta copiada!
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {smartCitySuggestions.map((sug) => (
                <div
                  key={sug.handle}
                  className="bg-[#141422] border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <div className="text-xs font-black text-white truncate">{sug.handle}</div>
                    <div className="text-[11px] text-gray-400">{sug.name}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectOrImportMilGrauPage(sug)}
                      className="flex-1 bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-400 text-white font-black py-1.5 px-2.5 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copiar & Abrir IG</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de Páginas Mil Grau Mapeadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredMilGrauCatalog.map((item) => {
            const isAlreadyAdded = partners.some(
              p => (p.handle || '').toLowerCase() === item.handle.toLowerCase()
            );
            const isSelected = (activePartner.handle || '').toLowerCase() === item.handle.toLowerCase();

            return (
              <div
                key={item.handle}
                className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/20 to-fuchsia-600/15 border-amber-400 shadow-lg'
                    : 'bg-[#11111C] border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                      <MapPin size={10} />
                      <span>{item.city.includes(' - ') ? item.city : `${item.city} - ${item.state}`}</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      👥 {item.followers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div>
                      <div className="text-xs sm:text-sm font-black text-white truncate">
                        {item.handle}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {item.name}
                      </div>
                    </div>
                    {isAlreadyAdded && (
                      <span className="text-[10px] font-black text-fuchsia-300 bg-fuchsia-500/20 px-2 py-0.5 rounded-md shrink-0">
                        Na Lista
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleSelectOrImportMilGrauPage(item)}
                    className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-[#FF5F00] to-fuchsia-600 hover:from-[#E04F00] hover:to-fuchsia-500 text-white"
                  >
                    <Copy size={12} />
                    <span>📋 Copiar Proposta & Abrir IG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInstagramDM(item.handle)}
                    className="bg-[#1E1E30] hover:bg-fuchsia-600/30 border border-white/10 hover:border-fuchsia-400 text-fuchsia-300 p-2 rounded-xl transition-all cursor-pointer"
                    title={`Abrir perfil ${item.handle} no Instagram`}
                  >
                    <Instagram size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. GERADOR DE PROPOSTA PRONTA PARA ENVIAR NO DIRECT / WHATSAPP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Cadastrar Nova Página e Selecionar Página */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#151522] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                <Plus size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  1. Adicionar Página p/ Controle de Saldo
                </h3>
                <p className="text-[11px] text-gray-400">
                  Opcional: registre páginas parceiras para acompanhar indicações e saques PIX
                </p>
              </div>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">@ da Página no Instagram *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.handle}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="Ex: @ofertas.sp"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Código Interno (Opcional)</label>
                  <input
                    type="text"
                    value={newPartner.code}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Ex: OFERTASSP5"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">WhatsApp da Página (Opcional)</label>
                  <input
                    type="text"
                    value={newPartner.whatsapp}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Chave PIX (p/ Saque ≥ R$ 250)</label>
                  <input
                    type="text"
                    value={newPartner.pixKey}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, pixKey: e.target.value }))}
                    placeholder="CPF, CNPJ, Email ou Celular"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fuchsia-600 to-[#FF5F00] hover:from-fuchsia-500 hover:to-[#E04F00] text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Adicionar Página na Lista</span>
              </button>
            </form>
          </div>

          {/* Lista Rápida de Seleção */}
          <div className="bg-[#151522] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
            <span className="text-xs font-black text-gray-300 uppercase tracking-wider block">
              Páginas na Lista (Clique p/ abrir no IG):
            </span>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {partners.map((p) => {
                const isSelected = p.id === activePartner.id;
                const earned = ((p.usersReferred || 0) * 3) + ((p.storesReferred || 0) * 5);
                const currentBalance = Math.max(0, earned - (p.paidAmount || 0));
                const canWithdraw = currentBalance >= MIN_WITHDRAWAL_AMOUNT;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPartnerId(p.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-fuchsia-500/15 border-fuchsia-500 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <span>{p.handle}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        🏪 {p.storesReferred || 0} lojas • 🙋‍♂️ {p.usersReferred || 0} usuários
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black block ${canWithdraw ? 'text-emerald-400' : 'text-amber-300'}`}>
                        Saldo: R$ {currentBalance.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {canWithdraw ? '🔓 Saque PIX Liberado' : `🔒 Meta R$ ${MIN_WITHDRAWAL_AMOUNT},00`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Texto Pronto Universal da Oferta */}
        <div className="lg:col-span-7 bg-[#151522] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  2. Proposta Universal Pronta (Sem nome específico • Envie para todas as páginas)
                </span>
                <h3 className="text-lg font-black text-white">
                  Convite Oficial p/ <span className="text-amber-400">Todas as Páginas Parceiras</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenInstagramDM(activePartner.handle)}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
                >
                  <Instagram size={14} />
                  <span>Abrir {activePartner.handle} no IG</span>
                </button>
              </div>
            </div>

            {/* Fluxo Universal de Cadastro da Página no Site */}
            <div className="bg-black/50 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <LinkIcon size={14} />
                  <span>Mensagem Única Universal (Copie 1 vez e cole em todas as páginas):</span>
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  Link no texto: https://omelhorcupom.com.br
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                O texto abaixo <strong>não cita o nome de nenhuma página específica</strong>. Você pode copiar uma única vez e sair colando no Direct/WhatsApp de dezenas de páginas seguidas! Cada página acessa <strong>https://omelhorcupom.com.br</strong>, se cadastra e pega o próprio <strong>Link de Divulgador</strong> no perfil.
              </p>
            </div>

            {/* Seletor de Modelo de Abordagem */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">
                Escolha o modelo de mensagem para enviar:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PITCH_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-orange-500/20 border-[#FF5F00] text-white'
                        : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-amber-300 block w-fit mb-1">
                      {tpl.badge}
                    </span>
                    <div className="text-xs font-bold leading-snug line-clamp-2">
                      {tpl.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Caixa de Texto Pronta para Copiar */}
            <div>
              <textarea
                rows={11}
                readOnly
                value={generatedMessage}
                className="w-full bg-[#0E0E17] border border-white/15 rounded-2xl p-4 text-xs text-gray-200 font-sans leading-relaxed focus:outline-none"
              />
            </div>
          </div>

          {/* Botões de Disparo Rápido */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleCopyText(generatedMessage, 'pitch_msg')}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedId === 'pitch_msg' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copiedId === 'pitch_msg' ? 'Proposta Copiada!' : '1. Copiar Proposta p/ Direct'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendWhatsApp(activePartner, generatedMessage)}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>2. Enviar pelo WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPartnerCard}
              className="bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-400 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>3. Baixar Imagem da Proposta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. TABELA DE CONTROLE DE SALDO ACUMULADO & LIBERAÇÃO DE SAQUE PIX (MÍNIMO R$ 250,00) */}
      <div className="bg-[#151522] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Wallet size={20} className="text-emerald-400" />
              <span>Carteira de Saldo das Páginas & Liberação de Saque PIX (Acima de R$ 250,00)</span>
            </h3>
            <p className="text-xs text-gray-400">
              Os valores ficam retidos como <strong>Saldo no Caixa</strong> de cada página. O botão de <strong>Aprovar Saque PIX</strong> só é liberado quando a página atinge <strong>R$ 250,00 ou mais</strong> de saldo.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-3">Página / Instagram</th>
                <th className="py-3 px-3">Código & Link</th>
                <th className="py-3 px-3 text-center">Empresas (+R$ 5)</th>
                <th className="py-3 px-3 text-center">Usuários (+R$ 3)</th>
                <th className="py-3 px-3">Progresso p/ Saque (Meta R$ 250)</th>
                <th className="py-3 px-3 text-right">Saldo em Caixa</th>
                <th className="py-3 px-3 text-center">Saque PIX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {partners.map((p) => {
                const earned = ((p.storesReferred || 0) * 5) + ((p.usersReferred || 0) * 3);
                const currentBalance = Math.max(0, earned - (p.paidAmount || 0));
                const canWithdraw = currentBalance >= MIN_WITHDRAWAL_AMOUNT;
                const progressPct = Math.min(100, Math.round((currentBalance / MIN_WITHDRAWAL_AMOUNT) * 100));
                const missingForWithdrawal = Math.max(0, MIN_WITHDRAWAL_AMOUNT - currentBalance);

                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-black text-white text-sm">{p.handle}</div>
                      <div className="text-[11px] text-gray-400">{p.name} • PIX: {p.pixKey || 'A definir'}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-mono font-bold text-xs">
                        {p.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustCount(p.id, 'storesReferred', -1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/15 text-gray-300 font-black cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-black text-amber-400 px-1.5">
                          {p.storesReferred || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjustCount(p.id, 'storesReferred', 1)}
                          className="w-5 h-5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-black cursor-pointer"
                          title="Simular +1 Empresa cadastrada (+R$ 5,00 no Saldo)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustCount(p.id, 'usersReferred', -1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/15 text-gray-300 font-black cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-black text-emerald-400 px-1.5">
                          {p.usersReferred || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjustCount(p.id, 'usersReferred', 1)}
                          className="w-5 h-5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-black cursor-pointer"
                          title="Simular +1 Usuário cadastrado (+R$ 3,00 no Saldo)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 min-w-[180px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={canWithdraw ? 'text-emerald-400 font-black' : 'text-gray-400 font-semibold'}>
                            {canWithdraw ? '✅ Meta de R$ 250 atingida!' : `Faltam R$ ${missingForWithdrawal.toFixed(2).replace('.', ',')}`}
                          </span>
                          <span className="font-bold text-white">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full transition-all duration-300 ${
                              canWithdraw ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-[#FF5F00] to-amber-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-black text-sm ${canWithdraw ? 'text-emerald-400' : 'text-amber-300'}`}>
                        R$ {currentBalance.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Já sacado: R$ {(p.paidAmount || 0).toFixed(2).replace('.', ',')}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSettlePayout(p)}
                          disabled={!canWithdraw}
                          title={canWithdraw ? 'Realizar pagamento PIX e zerar saldo atual' : 'Saque liberado apenas a partir de R$ 250,00'}
                          className={`px-3 py-1.5 rounded-xl font-black text-[11px] flex items-center gap-1 transition-all ${
                            canWithdraw
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-lg shadow-emerald-600/30'
                              : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                          }`}
                        >
                          {!canWithdraw && <Lock size={11} />}
                          <span>{canWithdraw ? 'Liberar PIX' : 'Mín. R$ 250'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePartner(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                          title="Remover página"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
