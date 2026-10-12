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
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MIN_WITHDRAWAL_AMOUNT = 250;

const INITIAL_INSTAGRAM_PARTNERS = [
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
  },
  {
    id: 'ig_partner_2',
    handle: '@dicassp.oficial',
    name: 'Dicas & Gastronomia SP',
    followers: '88k',
    code: 'DICASSP5',
    pixKey: 'financeiro@dicassp.com.br',
    whatsapp: '(11) 97766-5544',
    usersReferred: 0,
    storesReferred: 0,
    paidAmount: 0,
    withdrawalRequested: false,
    createdAt: 'Ativo'
  }
];

const PITCH_TEMPLATES = [
  {
    id: 'pitch_completo',
    title: '🔥 Proposta Completa (Saldo no Caixa + Saque PIX acima de R$ 250)',
    badge: 'Mais Converte',
    getText: (partner) => `Olá, equipe do *${partner.handle}*! Tudo bem? 👋✨

Acompanho o perfil de vocês e vimos que o público de vocês adora boas oportunidades e economia!

Somos do *Melhor Cupom (@omelhorcupom.com.br)*, o clube oficial de descontos locais e nacionais (com cupons de até 50% OFF em restaurantes, comércios e achadinhos virais da Shopee, Magalu e SHEIN).

Queremos liberar uma *Parceria Oficial de Afiliado* exclusiva para a página *${partner.handle}* monetizar com a audiência de vocês:

💰 *COMO FUNCIONA O SEU SALDO DE AFILIADO:*
✅ *R$ 5,00 de saldo* por cada *Empresa / Comércio* que se cadastrar pelo link de vocês!
✅ *R$ 3,00 de saldo* por cada *Usuário / Seguidor* que assinar o Clube VIP pelo link de vocês!
🏦 *Saque via PIX:* Todo valor acumula automaticamente no *Saldo do Caixa* da conta de vocês na plataforma. Ao atingir a partir de *R$ 250,00 de saldo*, vocês já podem solicitar o *Saque direto no PIX* pelo painel!

🔗 *Já geramos o Link Exclusivo de Rastreamento da página de vocês:*
👉 https://www.omelhorcupom.com.br/?convite=${partner.code}
*(Código Oficial: ${partner.code})*

📈 *Simulação rápida para a página de vocês:*
• Com apenas 50 seguidores no clube (R$ 150) + 20 comércios cadastrados (R$ 100), vocês já batem *R$ 250,00 de saldo* e liberam o saque no PIX!
• Nós enviamos as artes prontas de Stories e Feed para vocês só postarem com o link!

Topam ativar essa parceria hoje? Basta criar o acesso da página no site para acompanhar o saldo em tempo real! 🤝🚀`
  },
  {
    id: 'pitch_curto_dm',
    title: '⚡ Abordagem Rápida para Direct (DM do Instagram)',
    badge: 'Ideal p/ 1º Contato',
    getText: (partner) => `Opa, galera do *${partner.handle}*! Tudo ótimo por aí? 🚀

Aqui é da direção do *@omelhorcupom.com.br*! Estamos selecionando grandes páginas do Instagram para o nosso *Programa de Páginas Parceiras*.

Vocês acumulam saldo em dinheiro no Caixa da plataforma a cada indicação:
🏪 *+R$ 5,00 de saldo* por cada empresa/comércio cadastrado pelo link de vocês
🙋‍♂️ *+R$ 3,00 de saldo* por cada seguidor que ativar o Clube VIP pelo link de vocês
💸 *Saque no PIX:* Atingindo *R$ 250,00 de saldo acumulado*, é só solicitar o saque direto para a chave PIX da página!

Já até reservamos o link personalizado da página de vocês:
👉 https://www.omelhorcupom.com.br/?convite=${partner.code}

Posso te mandar aqui o Kit de Stories pronto e ativar o painel de saldo de vocês? 💰🔥`
  },
  {
    id: 'pitch_foco_comercios',
    title: '🏪 Foco em Páginas da Cidade / Guia Local (Empresas R$ 5 + Usuários R$ 3)',
    badge: 'Páginas de Cidade',
    getText: (partner) => `Olá, pessoal do *${partner.handle}*! Tudo bem? 🌟

Vimos que a página de vocês tem uma força gigante com o público e com os comércios da região!

No *Melhor Cupom (@omelhorcupom.com.br)*, os comércios locais podem divulgar cupons para atrair clientes, e os seguidores economizam até 50% todos os dias.

Criamos um link exclusivo para o *${partner.handle}* acumular saldo divulgando para os seguidores e lojistas da cidade:
💵 *+R$ 5,00 no Caixa* por cada empresa/lojista que se cadastrar pelo seu link!
💵 *+R$ 3,00 no Caixa* por cada seguidor que assinar o Clube VIP pelo seu link!
🏦 *Saque via PIX:* O valor fica salvo no Caixa da sua conta e, a partir de *R$ 250,00 acumulados*, você solicita a transferência direto no seu PIX!

🔗 *Link Oficial da sua Página:*
https://www.omelhorcupom.com.br/?convite=${partner.code}

Vamos fechar essa parceria? 🤝🚀`
  }
];

export const AdminInstagramPartners = ({ showToast }) => {
  const [partners, setPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('melhor_cupom_ig_partners_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INSTAGRAM_PARTNERS;
  });

  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState('pitch_completo');
  const [copiedId, setCopiedId] = useState(null);

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
  const partnerLink = `https://www.omelhorcupom.com.br/?convite=${activePartner.code}`;

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
      showToast(`Página ${cleanHandle} cadastrada! Link ?convite=${autoCode} ativado.`);
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

  // Gerar Criativo Visual de Proposta Oficial (1080x1350) para enviar no Direct/WhatsApp da página
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

    // Nome da Página Convidada
    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 52px Inter, sans-serif';
    ctx.fillText(activePartner.handle, 540, 205);

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
    ctx.font = '700 28px Inter, sans-serif';
    ctx.fillText('POR CADA EMPRESA / COMÉRCIO CADASTRADO PELO SEU LINK', 540, 540);

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

    // Caixa do Link Exclusivo
    ctx.fillStyle = '#161625';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(90, 985, 900, 165, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '700 23px Inter, sans-serif';
    ctx.fillText('SEU LINK EXCLUSIVO DE RASTREAMENTO JÁ ESTÁ PRONTO:', 540, 1038);

    ctx.fillStyle = '#34D399';
    ctx.font = '900 33px monospace';
    ctx.fillText(`omelhorcupom.com.br/?convite=${activePartner.code}`, 540, 1102);

    // Rodapé
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 25px Inter, sans-serif';
    ctx.fillText('📲 Painel de Saldo em Tempo Real • Saque via PIX • @omelhorcupom.com.br', 540, 1235);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `proposta-parceria-${activePartner.handle.replace('@', '')}.png`;
    a.click();

    if (showToast) {
      showToast(`Arte da proposta para ${activePartner.handle} baixada com sucesso!`);
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
                <span>Programa de Afiliados para Páginas de Instagram</span>
              </span>
              <span className="text-xs text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 font-black">
                🏪 +R$ 5,00 / Empresa • 🙋‍♂️ +R$ 3,00 / Usuário • 🏦 Saque PIX a partir de R$ 250,00
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Oferta Comercial & Saldo de Afiliados para Páginas
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Cada indicação fica acumulada no <strong>Saldo do Caixa</strong> da página parceira (<code className="text-amber-300 font-mono">+R$ 5,00 por loja</code> e <code className="text-emerald-300 font-mono">+R$ 3,00 por usuário</code>). Quando o saldo acumulado atinge <strong>R$ 250,00 ou mais</strong>, a página libera a solicitação de saque via PIX!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPartnerCard}
              className="bg-gradient-to-r from-[#FF5F00] via-rose-600 to-fuchsia-600 hover:from-[#E04F00] hover:to-fuchsia-500 text-white font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-fuchsia-900/40 transition-all hover:scale-105 cursor-pointer"
            >
              <Download size={17} />
              <span>🎨 Baixar Card da Oferta p/ Enviar ({activePartner.handle})</span>
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
                  1. Cadastrar Página de Instagram
                </h3>
                <p className="text-[11px] text-gray-400">
                  Cria o código e o link exclusivo para a página acumular saldo
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
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Código do Link (Opcional)</label>
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
                <span>Gerar Link & Proposta para esta Página</span>
              </button>
            </form>
          </div>

          {/* Lista Rápida de Seleção */}
          <div className="bg-[#151522] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
            <span className="text-xs font-black text-gray-300 uppercase tracking-wider block">
              Selecione a Página para Gerar a Oferta:
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
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                          {p.code}
                        </span>
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

        {/* Coluna Direita: Texto Pronto da Oferta + Link de Afiliado da Página */}
        <div className="lg:col-span-7 bg-[#151522] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-400 block">
                  2. Proposta Pronta para Enviar (Regra de Saldo + Saque PIX ≥ R$ 250)
                </span>
                <h3 className="text-lg font-black text-white">
                  Convite Oficial para <span className="text-amber-400">{activePartner.handle}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenInstagramDM(activePartner.handle)}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
                >
                  <Instagram size={14} />
                  <span>Abrir Perfil no Instagram</span>
                </button>
              </div>
            </div>

            {/* Link Exclusivo da Página */}
            <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <LinkIcon size={14} />
                  <span>Link Exclusivo de Afiliado da Página ({activePartner.handle}):</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  Acumula Saldo Automaticamente
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-[#12121C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white select-all truncate">
                  {partnerLink}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(partnerLink, 'partner_link')}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedId === 'partner_link' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedId === 'partner_link' ? 'Link Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
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
