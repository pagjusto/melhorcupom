import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { 
  X, 
  PiggyBank, 
  TrendingUp, 
  Tag, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  KeyRound, 
  Sparkles, 
  ChevronRight, 
  Store, 
  ArrowUpRight, 
  Search, 
  Calendar, 
  DollarSign, 
  Award,
  Crown,
  Share2,
  ExternalLink
} from 'lucide-react';

export const SavingsModal = ({ onSelectCoupon }) => {
  const { 
    isSavingsModalOpen, 
    setIsSavingsModalOpen, 
    userProfile, 
    redemptions, 
    coupons, 
    stores,
    isVipUser,
    setIsSubscriptionModalOpen,
    setActiveTab
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'used' | 'valid'
  const [searchQuery, setSearchQuery] = useState('');
  const [partialTab, setPartialTab] = useState('categories'); // 'categories' | 'stores' | 'status'

  if (!isSavingsModalOpen) return null;

  // Filtrar resgates do usuário logado
  const userRedemptions = redemptions.filter(r => r.userName === userProfile.name);
  
  // Totais e cálculos gerais
  const totalCount = userRedemptions.length;
  const usedRedemptions = userRedemptions.filter(r => r.status === 'used');
  const validRedemptions = userRedemptions.filter(r => r.status === 'valid');
  
  const usedSavings = usedRedemptions.reduce((acc, r) => acc + (Number(r.savings) || 20), 0);
  const validSavings = validRedemptions.reduce((acc, r) => acc + (Number(r.savings) || 20), 0);
  
  // Total Geral de Economia
  const totalSavings = userProfile.monthlySavings > 0 
    ? userProfile.monthlySavings 
    : (usedSavings + validSavings);

  const subscriptionCost = 19.90;
  const netProfit = Math.max(0, totalSavings - subscriptionCost);
  const roiPercentage = subscriptionCost > 0 
    ? Math.round((netProfit / subscriptionCost) * 100) 
    : 0;
  const avgSavingsPerCoupon = totalCount > 0 
    ? (totalSavings / totalCount) 
    : 0;

  // Filtro de lista
  const filteredList = userRedemptions.filter(r => {
    if (filterStatus === 'used' && r.status !== 'used') return false;
    if (filterStatus === 'valid' && r.status !== 'valid') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.couponTitle?.toLowerCase().includes(q);
      const matchStore = r.storeName?.toLowerCase().includes(q);
      const matchCode = r.code?.toLowerCase().includes(q);
      const matchPass = r.passCode?.includes(q);
      return matchTitle || matchStore || matchCode || matchPass;
    }
    return true;
  });

  // Cálculo da Economia Parcial por Categoria
  const categoryBreakdown = CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const items = userRedemptions.filter(r => {
      if (r.category === cat.id) return true;
      const cObj = coupons.find(cp => cp.id === r.couponId);
      if (cObj && cObj.category === cat.id) return true;
      return false;
    });
    const amount = items.reduce((acc, r) => acc + (Number(r.savings) || 20), 0);
    const pct = totalSavings > 0 ? Math.round((amount / totalSavings) * 100) : 0;
    return {
      ...cat,
      amount,
      count: items.length,
      percentage: pct
    };
  }).filter(c => c.count > 0 || c.amount > 0).sort((a, b) => b.amount - a.amount);

  // Se não houver itens com categoria expressa, agrupar por gastronomia / padrão
  const effectiveCategoryList = categoryBreakdown.length > 0 ? categoryBreakdown : [
    { id: 'gastronomia', name: 'Gastronomia & Bares', amount: totalSavings * 0.45, percentage: 45, count: 2 },
    { id: 'lazer', name: 'Lazer & Experiências', amount: totalSavings * 0.30, percentage: 30, count: 1 },
    { id: 'beleza', name: 'Beleza & Barbearia', amount: totalSavings * 0.25, percentage: 25, count: 1 }
  ];

  // Cálculo da Economia Parcial por Estabelecimento
  const storeMap = {};
  userRedemptions.forEach(r => {
    const storeKey = r.storeName || 'Loja Parceira';
    if (!storeMap[storeKey]) {
      const sObj = stores.find(s => s.merchantId === r.merchantId || s.name === r.storeName);
      storeMap[storeKey] = {
        name: storeKey,
        merchantId: r.merchantId,
        logo: sObj?.logo || r.storeLogo || '🏪',
        image: sObj?.logoImage || sObj?.image || r.storeImage || '',
        city: sObj?.city || 'São Paulo - SP',
        totalSavings: 0,
        count: 0
      };
    }
    storeMap[storeKey].totalSavings += (Number(r.savings) || 20);
    storeMap[storeKey].count += 1;
  });
  const storeList = Object.values(storeMap).sort((a, b) => b.totalSavings - a.totalSavings);

  // Compartilhar no WhatsApp
  const handleShareSavings = () => {
    const text = `Olha só: já economizei R$ ${totalSavings.toFixed(2).replace('.', ',')} no Clube VIP Melhor Cupom! O investimento na assinatura é de apenas R$ 19,90 e o retorno é real no bolso. Cadastre-se pelo meu link: melhorcupom.com.br/convite/${userProfile.referralCode || 'VIP'}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenCouponDetail = (redemption) => {
    const matched = coupons.find(c => c.id === redemption.couponId);
    if (matched && onSelectCoupon) {
      setIsSavingsModalOpen(false);
      onSelectCoupon(matched);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#13131D] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOPO / HEADER */}
        <div className="relative p-5 sm:p-7 bg-gradient-to-r from-[#17231E] via-[#151522] to-[#1E1714] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <PiggyBank size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black text-white font-display">
                    Painel de Economia & Extrato VIP
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <Sparkles size={11} />
                    <span>Transparência Total</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Demonstrações de economia geral, divisões parciais e histórico completo dos seus cupons.
                </p>
              </div>
            </div>

            {/* Botão Fechar */}
            <button
              onClick={() => setIsSavingsModalOpen(false)}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors border border-white/10"
              title="Fechar painel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CORPO DO PAINEL (SCROLL INTERNO) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 pr-3 sm:pr-6">
          
          {/* ================= 1. DEMONSTRAÇÃO GERAL DE ECONOMIA ================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={15} />
                <span>Demonstração de Economia Geral:</span>
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">
                Membro: <strong className="text-white">{userProfile.name}</strong>
              </span>
            </div>

            {/* Grid 4 Cards Métricos */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Economia Total */}
              <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-900/10 border border-emerald-500/40 p-4 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold mb-1">
                  <span>Economia Total</span>
                  <PiggyBank size={15} className="text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
                  R$ {totalSavings.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-1 flex items-center gap-1">
                  <span>✓ 100% no seu bolso</span>
                </div>
              </div>

              {/* Card 2: Assinatura VIP */}
              <div className="bg-[#181824] border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold mb-1">
                  <span>Custo Assinatura</span>
                  <Crown size={15} className="text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  R$ {subscriptionCost.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  Valor único mensal sem fidelidade
                </div>
              </div>

              {/* Card 3: Lucro Líquido Real */}
              <div className="bg-gradient-to-br from-[#FF5F00]/15 to-amber-900/10 border border-[#FF5F00]/40 p-4 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between text-[11px] text-orange-300 font-bold mb-1">
                  <span>Lucro Real Líquido</span>
                  <Sparkles size={15} className="text-[#FF5F00]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                  + R$ {netProfit.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-amber-300/80 mt-1 font-semibold">
                  Retorno de +{roiPercentage}% do valor pago
                </div>
              </div>

              {/* Card 4: Cupons Resgatados */}
              <div className="bg-[#181824] border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold mb-1">
                  <span>Resgates Realizados</span>
                  <Tag size={15} className="text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  {totalCount}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  Média R$ {avgSavingsPerCoupon.toFixed(2).replace('.', ',')} por cupom
                </div>
              </div>

            </div>
          </div>

          {/* ================= 2. DEMONSTRAÇÕES PARCIAIS DE ECONOMIA ================= */}
          <div className="bg-[#181824] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award size={15} />
                <span>Demonstrações de Economia Parcial:</span>
              </h3>

              {/* Seletor de visualização parcial */}
              <div className="flex items-center gap-1 bg-[#101017] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setPartialTab('categories')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    partialTab === 'categories'
                      ? 'bg-[#FF5F00] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Por Categoria
                </button>
                <button
                  onClick={() => setPartialTab('stores')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    partialTab === 'stores'
                      ? 'bg-[#FF5F00] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Por Estabelecimento
                </button>
                <button
                  onClick={() => setPartialTab('status')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    partialTab === 'status'
                      ? 'bg-[#FF5F00] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Por Status da Baixa
                </button>
              </div>
            </div>

            {/* ABA PARCIAL 1: POR CATEGORIA */}
            {partialTab === 'categories' && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-gray-400">
                  Veja a divisão proporcional de quanto você economizou em cada segmento:
                </p>
                <div className="space-y-2.5">
                  {effectiveCategoryList.map((cat, idx) => (
                    <div key={idx} className="bg-[#101017] p-3 rounded-xl border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({cat.count} resgate{cat.count !== 1 ? 's' : ''})</span>
                        </span>
                        <div className="text-right">
                          <span className="font-black text-emerald-400">
                            R$ {Number(cat.amount).toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1.5 font-semibold">
                            ({cat.percentage}%)
                          </span>
                        </div>
                      </div>
                      {/* Barra de Progresso Visual */}
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#FF5F00] to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA PARCIAL 2: POR ESTABELECIMENTO */}
            {partialTab === 'stores' && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-gray-400">
                  Economia acumulada em cada loja parceira credenciada:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {storeList.map((st, idx) => (
                    <div key={idx} className="bg-[#101017] p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                          {st.image ? (
                            <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{st.logo}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{st.name}</div>
                          <div className="text-[10px] text-gray-400 truncate">{st.count} resgate(s) efetuado(s)</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-emerald-400">
                          R$ {st.totalSavings.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[9px] text-gray-400">economizados</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA PARCIAL 3: POR STATUS DA BAIXA */}
            {partialTab === 'status' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                <div className="bg-[#101017] p-4 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Economia Concretizada</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {usedRedemptions.length} cupons
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-display">
                    R$ {usedSavings.toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Baixados e validados presencialmente no caixa ou PDV dos lojistas parceiros.
                  </p>
                </div>

                <div className="bg-[#101017] p-4 rounded-xl border border-amber-500/30">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>Economia em Aberto</span>
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {validRedemptions.length} cupons
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    R$ {validSavings.toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Cupons gerados com QR Code e Senha prontos para serem apresentados nas lojas.
                  </p>
                </div>
              </div>
            )}

            {/* Projeção Anual */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-400">
              <span>
                💡 Projeção Anual: Mantendo esse ritmo, sua economia será de <strong className="text-emerald-400">R$ {(totalSavings * 12).toFixed(2).replace('.', ',')}</strong> ao ano.
              </span>
              <button
                onClick={handleShareSavings}
                className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 underline"
              >
                <Share2 size={12} />
                <span>Compartilhar resultado</span>
              </button>
            </div>

          </div>

          {/* ================= 3. EXTRATO DE TODOS OS CUPONS RESGATADOS ================= */}
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={15} className="text-[#FF5F00]" />
                  <span>Todos os Cupons Resgatados ({filteredList.length}):</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Extrato com código, senha de validação e valor poupado em cada oferta.
                </p>
              </div>

              {/* Filtro de Status dos Cupons */}
              <div className="flex items-center gap-1 bg-[#181824] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-white/15 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Todos ({userRedemptions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('used')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterStatus === 'used'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Baixados ({usedRedemptions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('valid')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterStatus === 'valid'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Prontos ({validRedemptions.length})
                </button>
              </div>
            </div>

            {/* Barra de Busca rápida no extrato */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar no extrato por loja, cupom, código ou senha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Listagem de Linhas do Extrato */}
            {filteredList.length === 0 ? (
              <div className="p-8 text-center bg-[#101017] border border-white/5 rounded-2xl text-gray-500 text-xs">
                Nenhum cupom encontrado com os filtros selecionados.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredList.map((red) => {
                  const isUsed = red.status === 'used';
                  return (
                    <div 
                      key={red.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isUsed 
                          ? 'bg-[#151520] border-white/5' 
                          : 'bg-[#181824] border-[#FF5F00]/40 shadow-md shadow-orange-500/5'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Detalhes do Estabelecimento e Cupom */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                            {red.storeLogo || '🏪'}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-xs font-black text-white">{red.storeName}</span>
                              <span className="text-[10px] bg-[#FF5F00]/20 text-orange-300 font-black px-2 py-0.5 rounded-md">
                                {red.discountBadge}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isUsed 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-amber-500/20 text-amber-300 animate-pulse'
                              }`}>
                                {isUsed ? '✓ Baixado no Caixa' : '⏳ Pronto p/ Usar'}
                              </span>
                            </div>

                            <div className="text-xs text-gray-300 font-semibold line-clamp-1">
                              {red.couponTitle}
                            </div>

                            {/* Código e Senha de 6 dígitos */}
                            <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-mono">
                              <span>Código: <strong className="text-orange-400">{red.code}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-300">
                                <KeyRound size={11} className="text-[#FF5F00]" />
                                <span>Senha: <strong>{red.passCode}</strong></span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Economia Obtida e Ação */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 flex-shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                              Economia no Bolso
                            </div>
                            <div className="text-base sm:text-lg font-black text-emerald-400 font-display">
                              + R$ {Number(red.savings || 20).toFixed(2).replace('.', ',')}
                            </div>
                          </div>

                          {!isUsed && (
                            <button
                              type="button"
                              onClick={() => handleOpenCouponDetail(red)}
                              className="mt-1 bg-[#FF5F00] hover:bg-[#E04F00] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 transition-all"
                              title="Abrir QR Code e apresentar no balcão"
                            >
                              <QrCode size={13} />
                              <span>Ver QR Code</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* RODAPÉ DO PAINEL */}
        <div className="p-4 sm:p-5 bg-[#101017] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            Quanto mais você usa os cupons do Clube VIP, mais o seu dinheiro rende!
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsSavingsModalOpen(false);
                setActiveTab('explore');
              }}
              className="w-full sm:w-auto bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-600/30 transition-all"
            >
              <span>Explorar Mais Cupons VIP</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
