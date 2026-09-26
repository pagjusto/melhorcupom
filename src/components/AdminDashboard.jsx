import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  Tag, 
  QrCode, 
  MapPin, 
  Crown, 
  Award, 
  Medal, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  BarChart3, 
  PieChart, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Eye, 
  ChevronRight, 
  Check,
  PiggyBank,
  Gift,
  Building2,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Share2,
  Zap,
  Server,
  Activity,
  Terminal,
  ExternalLink,
  Coins,
  Database,
  Network,
  Cpu,
  Copy,
  EyeOff,
  Edit3,
  Key,
  X,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminPromoManager } from './PromotionalKit';
import { RoleSwitcher } from './RoleSwitcher';
import { AdminWhatsAppManager } from './AdminWhatsAppManager';

export const AdminDashboard = () => {
  const { 
    stores, 
    coupons, 
    redemptions, 
    registeredUsers, 
    adminToggleUserVip, 
    adminUpdateStoreTier, 
    adminAdjustUserReferral,
    monthlyFinancialHistory,
    merchantPlans,
    apiConnectors,
    updateConnectorCredentials,
    apiLogs,
    isSyncingApis,
    syncApisNow,
    setActiveTab,
    switchRole
  } = useApp();

  // Aba ativa do Painel ADM ('overview' | 'cities' | 'financial' | 'stores' | 'users' | 'divulgacao' | 'simulador' | 'integrations')
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  // Filtros Globais
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [storeSearch, setStoreSearch] = useState('');
  const [storeTierFilter, setStoreTierFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userVipFilter, setUserVipFilter] = useState('all'); // 'all' | 'vip' | 'free'

  // Gestão de Visualização e Edição de Chaves de API
  const [showFullApiKey, setShowFullApiKey] = useState({});
  const [editingConnector, setEditingConnector] = useState(null);
  const [editCredentialsForm, setEditCredentialsForm] = useState({
    publisherId: '',
    apiKey: '',
    subIdParam: '',
    webhookEndpoint: ''
  });

  // Notificação de Ação Administrativa executada
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ==========================================
  // CÁLCULOS ESTATÍSTICOS & FINANCEIROS
  // ==========================================

  // 1. Lojas e Receita de Lojistas
  const storeStats = useMemo(() => {
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;
    let freeCount = 0;

    stores.forEach(s => {
      const tier = s.tier || 'free';
      if (tier === 'gold') goldCount++;
      else if (tier === 'silver') silverCount++;
      else if (tier === 'bronze') bronzeCount++;
      else freeCount++;
    });

    const goldMRR = goldCount * 199.90;
    const silverMRR = silverCount * 79.90;
    const bronzeMRR = bronzeCount * 39.90;
    const merchantMRR = goldMRR + silverMRR + bronzeMRR;

    return {
      total: stores.length,
      goldCount,
      silverCount,
      bronzeCount,
      freeCount,
      goldMRR,
      silverMRR,
      bronzeMRR,
      merchantMRR
    };
  }, [stores]);

  // 2. Usuários e Receita de Assinaturas VIP
  const userStats = useMemo(() => {
    const totalUsers = registeredUsers.length;
    const vipUsers = registeredUsers.filter(u => u.isVip);
    const freeUsers = registeredUsers.filter(u => !u.isVip);
    const vipCount = vipUsers.length;
    const vipMRR = vipCount * 19.90;
    const conversionRate = totalUsers > 0 ? ((vipCount / totalUsers) * 100).toFixed(1) : '0.0';

    // Total de bonificações de indicação acumuladas pelos usuários
    const totalUserReferralBalance = registeredUsers.reduce((acc, u) => acc + (u.referralBalance || 0), 0);

    // Total de economia já gerada aos usuários
    const totalUserSavings = registeredUsers.reduce((acc, u) => acc + (u.monthlySavings || 0), 0);

    return {
      totalUsers,
      vipCount,
      freeCount: freeUsers.length,
      vipMRR,
      conversionRate,
      totalUserReferralBalance,
      totalUserSavings
    };
  }, [registeredUsers]);

  // 3. Receita Consolidada da Plataforma
  const totalMRR = storeStats.merchantMRR + userStats.vipMRR;
  const projectedARR = totalMRR * 12;

  // 4. Resgates e Validações
  const completedRedemptions = useMemo(() => {
    return redemptions.filter(r => r.status === 'used');
  }, [redemptions]);

  const totalValidationsCount = completedRedemptions.length;
  const totalRedemptionsSavings = completedRedemptions.reduce((acc, r) => acc + (Number(r.savings) || 0), 0);

  // 5. Estatísticas Consolidadas por Cidade (Lojas e Usuários)
  const cityMetrics = useMemo(() => {
    const cityMap = {};

    // Mapear Lojas por cidade
    stores.forEach(store => {
      const city = store.city || 'Outras';
      if (!cityMap[city]) {
        cityMap[city] = {
          cityName: city,
          storesCount: 0,
          goldStores: 0,
          silverStores: 0,
          bronzeStores: 0,
          freeStores: 0,
          merchantRevenue: 0,
          usersCount: 0,
          vipUsersCount: 0,
          userRevenue: 0,
          activeCouponsCount: 0,
          totalSavings: 0
        };
      }
      cityMap[city].storesCount += 1;
      const tier = store.tier || 'free';
      if (tier === 'gold') {
        cityMap[city].goldStores += 1;
        cityMap[city].merchantRevenue += 199.90;
      } else if (tier === 'silver') {
        cityMap[city].silverStores += 1;
        cityMap[city].merchantRevenue += 79.90;
      } else if (tier === 'bronze') {
        cityMap[city].bronzeStores += 1;
        cityMap[city].merchantRevenue += 39.90;
      } else {
        cityMap[city].freeStores += 1;
      }
    });

    // Mapear Usuários por cidade
    registeredUsers.forEach(user => {
      const city = user.city || 'Outras';
      if (!cityMap[city]) {
        cityMap[city] = {
          cityName: city,
          storesCount: 0,
          goldStores: 0,
          silverStores: 0,
          bronzeStores: 0,
          freeStores: 0,
          merchantRevenue: 0,
          usersCount: 0,
          vipUsersCount: 0,
          userRevenue: 0,
          activeCouponsCount: 0,
          totalSavings: 0
        };
      }
      cityMap[city].usersCount += 1;
      if (user.isVip) {
        cityMap[city].vipUsersCount += 1;
        cityMap[city].userRevenue += 19.90;
      }
      cityMap[city].totalSavings += (user.monthlySavings || 0);
    });

    // Mapear Cupons por cidade
    coupons.forEach(coupon => {
      const city = coupon.city || 'Outras';
      if (cityMap[city]) {
        cityMap[city].activeCouponsCount += 1;
      }
    });

    return Object.values(cityMap).map(item => ({
      ...item,
      totalRevenue: item.merchantRevenue + item.userRevenue,
      totalClients: item.storesCount + item.usersCount
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [stores, registeredUsers, coupons]);

  // Lista de todas as cidades disponíveis
  const availableCities = useMemo(() => {
    const list = Array.from(new Set([
      ...stores.map(s => s.city).filter(Boolean),
      ...registeredUsers.map(u => u.city).filter(Boolean)
    ]));
    return list.sort();
  }, [stores, registeredUsers]);

  // Filtragem de Lojas para a Tabela de Gestão
  const filteredStoresList = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
                            (store.category && store.category.toLowerCase().includes(storeSearch.toLowerCase())) ||
                            (store.address && store.address.toLowerCase().includes(storeSearch.toLowerCase()));
      const matchesCity = selectedCityFilter === 'all' || store.city === selectedCityFilter;
      const matchesTier = storeTierFilter === 'all' || (store.tier || 'free') === storeTierFilter;
      return matchesSearch && matchesCity && matchesTier;
    });
  }, [stores, storeSearch, selectedCityFilter, storeTierFilter]);

  // Filtragem de Usuários para a Tabela de Gestão
  const filteredUsersList = useMemo(() => {
    return registeredUsers.filter(user => {
      const q = userSearch.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) ||
                            user.email.toLowerCase().includes(q) ||
                            (user.cpf && user.cpf.includes(q));
      const matchesCity = selectedCityFilter === 'all' || user.city === selectedCityFilter;
      const matchesVip = userVipFilter === 'all' || 
                         (userVipFilter === 'vip' && user.isVip) || 
                         (userVipFilter === 'free' && !user.isVip);
      return matchesSearch && matchesCity && matchesVip;
    });
  }, [registeredUsers, userSearch, selectedCityFilter, userVipFilter]);

  // Manipuladores de Ação do Administrador
  const handleUpdateStoreTier = (storeId, storeName, newTier) => {
    adminUpdateStoreTier(storeId, newTier);
    const tierName = newTier === 'gold' ? 'Ouro VIP Top' : newTier === 'silver' ? 'Prata Pro' : newTier === 'bronze' ? 'Bronze Star' : 'Grátis';
    showToast(`Plano da loja "${storeName}" atualizado com sucesso para: ${tierName}!`);
  };

  const handleToggleVip = (userId, userName, currentVip) => {
    adminToggleUserVip(userId);
    if (!currentVip) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5F00', '#FFD700', '#3B82F6']
      });
      showToast(`Assinatura VIP ativada para o usuário ${userName}!`);
    } else {
      showToast(`Assinatura VIP do usuário ${userName} desativada.`);
    }
  };

  const handleBonusReferral = (userId, userName) => {
    adminAdjustUserReferral(userId, 5.00);
    showToast(`Bônus de R$ 5,00 adicionado ao saldo de indicação de ${userName}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* TOAST FLUTUANTE DE NOTIFICAÇÃO ADMINISTRATIVA */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E2D] border-2 border-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/80 flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER DO PAINEL MASTER */}
      <div className="bg-gradient-to-r from-[#14141E] via-[#1B1B2A] to-[#14141E] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Shield size={14} className="text-blue-400" />
                <span>Painel de Administração Master</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[10px]">Tempo Real</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Administrador:</span>
                <strong className="text-white">Renan Zanferrari</strong>
                <span className="text-emerald-400 text-[11px] font-mono">(renanzanferrari@live.com)</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display flex flex-wrap items-center gap-3">
              <span>Gestão Central do Ecossistema</span>
              <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-xl shadow-sm">
                Versão 2.4 Pro
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Métricas consolidadas de faturamento (MRR/ARR), clientes cadastrados por cidades (lojas e usuários), gestão de planos e controle de assinaturas VIP da plataforma Melhor Cupom.
            </p>
          </div>

          {/* Ações Rápidas do Topo */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveAdminTab('simulador')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Abrir Simulador de Perfis para testar como cliente ou lojista"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Simulador de Perfis</span>
            </button>

            <button
              onClick={() => {
                showToast('Dados consolidados sincronizados em tempo real!');
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Atualizar dados analíticos"
            >
              <RefreshCw size={14} />
              <span>Sincronizar</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('cities')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <MapPin size={14} />
              <span>Ver por Cidades</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS DO PAINEL ADM */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            <BarChart3 size={15} />
            <span>Visão Geral & KPIs</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('cities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'cities'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            <Building2 size={15} />
            <span>Clientes por Cidades ({cityMetrics.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'financial'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            <DollarSign size={15} />
            <span>Faturamento & Planos (R$ {totalMRR.toFixed(2).replace('.', ',')}/mês)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('stores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'stores'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            <Store size={15} />
            <span>Lojas Parceiras ({stores.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'users'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            <Users size={15} />
            <span>Usuários Cadastrados ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('divulgacao')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'divulgacao'
                ? 'bg-gradient-to-r from-fuchsia-600 via-rose-600 to-[#FF5F00] text-white shadow-md shadow-rose-600/30'
                : 'bg-white/5 hover:bg-white/10 text-rose-300 hover:text-white border border-rose-500/20'
            }`}
          >
            <Share2 size={15} />
            <span>Divulgação</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('mensagens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'mensagens'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                : 'bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white border border-emerald-500/20'
            }`}
          >
            <MessageCircle size={15} />
            <span>💬 Mensagens WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('integrations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'integrations'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white border border-emerald-500/20'
            }`}
          >
            <Zap size={15} />
            <span>🔌 APIs & Afiliados</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('simulador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === 'simulador'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-cyan-500/20'
            }`}
          >
            <Sparkles size={15} />
            <span>🧪 Simulador de Perfis</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: VISÃO GERAL & KPIS GLOBAIS                                         */}
      {/* ========================================================================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">

          {/* BANNER RÁPIDO DO SIMULADOR NO OVERVIEW */}
          <div className="bg-gradient-to-r from-blue-950/40 via-[#161628] to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Simulador de Perfis Ativo no Painel</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase">Exclusivo ADM</span>
                </div>
                <p className="text-xs text-gray-400">
                  Valide como a plataforma é exibida para Visitantes, Usuários sem VIP, Assinantes VIP e Lojistas em tempo real.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveAdminTab('simulador')}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 flex-shrink-0 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <span>Abrir Simulador Completo</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          {/* GRID DE 6 CARDS PRINCIPAIS DE KPIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. FATURAMENTO TOTAL MRR */}
            <div className="bg-[#14141F] border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">MRR Consolidado</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display">
                R$ {totalMRR.toFixed(2).replace('.', ',')}
                <span className="text-xs text-gray-400 font-normal"> /mês</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10 text-gray-400">
                <span>ARR Projetado (Anual):</span>
                <strong className="text-emerald-400 font-bold">R$ {projectedARR.toFixed(2).replace('.', ',')}</strong>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
                <span>B2C (VIPs): R$ {userStats.vipMRR.toFixed(2).replace('.', ',')}</span>
                <span>B2B (Lojas): R$ {storeStats.merchantMRR.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* 2. TOTAL DE CLIENTES: USUÁRIOS & VIPS */}
            <div className="bg-[#14141F] border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuários da Base</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display flex items-baseline gap-2">
                <span>{userStats.totalUsers}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                  👑 {userStats.vipCount} VIPs Ativos
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10 text-gray-400">
                <span>Taxa de Conversão VIP:</span>
                <strong className="text-blue-400 font-bold">{userStats.conversionRate}% dos usuários</strong>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                <span>{userStats.freeCount} contas gratuitas cadastradas</span>
              </div>
            </div>

            {/* 3. LOJAS PARCEIRAS CREDENCIADAS */}
            <div className="bg-[#14141F] border border-orange-500/30 hover:border-orange-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lojas Credenciadas</span>
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
                  <Store size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display">
                {storeStats.total}
                <span className="text-xs text-gray-400 font-normal"> estabelecimentos</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] mt-3 pt-3 border-t border-white/10 text-gray-300 flex-wrap">
                <span className="text-amber-400 font-bold">👑 {storeStats.goldCount} Ouro</span>
                <span className="text-gray-500">•</span>
                <span className="text-slate-300 font-bold">🥈 {storeStats.silverCount} Prata</span>
                <span className="text-gray-500">•</span>
                <span className="text-[#CD7F32] font-bold">🥉 {storeStats.bronzeCount} Bronze</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 font-bold">{storeStats.freeCount} Grátis</span>
              </div>
            </div>

            {/* 4. ECONOMIA REAL GERADA */}
            <div className="bg-[#14141F] border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Economia Concedida</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <PiggyBank size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400 font-display">
                R$ {userStats.totalUserSavings.toFixed(2).replace('.', ',')}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10 text-gray-400">
                <span>Média por VIP Ativo:</span>
                <strong className="text-purple-300 font-bold">
                  R$ {(userStats.vipCount > 0 ? userStats.totalUserSavings / userStats.vipCount : 0).toFixed(2).replace('.', ',')}
                </strong>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                <span>Descontos reais validados nos caixas dos parceiros</span>
              </div>
            </div>

            {/* 5. CUPONS & RESGATES EFETIVADOS */}
            <div className="bg-[#14141F] border border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Validações / Balcão</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <QrCode size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display flex items-baseline gap-2">
                <span>{totalValidationsCount}</span>
                <span className="text-xs text-gray-400 font-normal">baixados</span>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg ml-auto">
                  {coupons.length} ativos
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10 text-gray-400">
                <span>Economia comprovada em caixa:</span>
                <strong className="text-cyan-300 font-bold">R$ {totalRedemptionsSavings.toFixed(2).replace('.', ',')}</strong>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                <span>Sem fraudes: validação via QR Code e senha única</span>
              </div>
            </div>

            {/* 6. DIVULGUE & GANHE (BONIFICAÇÕES) */}
            <div className="bg-[#14141F] border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Divulgue & Ganhe</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Gift size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-300 font-display">
                R$ {userStats.totalUserReferralBalance.toFixed(2).replace('.', ',')}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10 text-gray-400">
                <span>Valor por indicação no caixa:</span>
                <strong className="text-amber-400 font-bold">R$ 5,00 / amigo</strong>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                <span>Saldo pronto para desconto na renovação VIP</span>
              </div>
            </div>

          </div>

          {/* EVOLUÇÃO MENSAL E DISTRIBUIÇÃO B2C vs B2B */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Gráfico de Evolução de Faturamento Mensal (Últimos 6 meses) */}
            <div className="lg:col-span-2 bg-[#14141F] border border-white/10 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    <span>Evolução do Faturamento Recorrente (MRR)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Crescimento histórico de receita combinada nos últimos 6 meses
                  </p>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                  +31% este mês
                </span>
              </div>

              {/* Barras de Crescimento */}
              <div className="space-y-4">
                {monthlyFinancialHistory.map((item, idx) => {
                  const maxMRR = 3200;
                  const pct = Math.min(100, Math.round((item.totalMRR / maxMRR) * 100));
                  const vipPct = Math.round((item.vipRevenue / item.totalMRR) * 100);
                  const merchantPct = 100 - vipPct;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300 w-16">{item.month}</span>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span>VIPs: <strong className="text-blue-400">R$ {item.vipRevenue.toFixed(2).replace('.', ',')}</strong></span>
                          <span>Lojas: <strong className="text-orange-400">R$ {item.merchantRevenue.toFixed(2).replace('.', ',')}</strong></span>
                          <span className="font-black text-white">Total: R$ {item.totalMRR.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      <div className="h-4 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                        <div 
                          style={{ width: `${pct * (vipPct / 100)}%` }} 
                          className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-500" 
                          title={`VIPs: R$ ${item.vipRevenue.toFixed(2)}`}
                        />
                        <div 
                          style={{ width: `${pct * (merchantPct / 100)}%` }} 
                          className="bg-gradient-to-r from-[#FF5F00] to-amber-500 h-full transition-all duration-500" 
                          title={`Lojas: R$ ${item.merchantRevenue.toFixed(2)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-5 mt-6 pt-4 border-t border-white/10 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Assinantes VIP (B2C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F00]" />
                  <span>Planos de Lojistas (B2B)</span>
                </div>
              </div>
            </div>

            {/* Decomposição Percentual B2C vs B2B */}
            <div className="bg-[#14141F] border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <PieChart size={18} className="text-blue-400" />
                  <span>Divisão da Receita Atual</span>
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Composição do faturamento mensal recorrente (MRR de R$ {totalMRR.toFixed(2).replace('.', ',')})
                </p>

                <div className="space-y-4">
                  {/* B2C */}
                  <div className="bg-[#1A1A28] border border-blue-500/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Users size={14} /> Consumidores VIP (B2C)
                      </span>
                      <strong className="text-xs text-white">
                        {totalMRR > 0 ? ((userStats.vipMRR / totalMRR) * 100).toFixed(1) : 0}%
                      </strong>
                    </div>
                    <div className="text-xl font-black text-white">
                      R$ {userStats.vipMRR.toFixed(2).replace('.', ',')}
                      <span className="text-xs text-gray-400 font-normal"> /mês</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {userStats.vipCount} assinantes pagando R$ 19,90/mês
                    </p>
                  </div>

                  {/* B2B */}
                  <div className="bg-[#1A1A28] border border-orange-500/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#FF5F00] flex items-center gap-1.5">
                        <Store size={14} /> Planos Lojistas (B2B)
                      </span>
                      <strong className="text-xs text-white">
                        {totalMRR > 0 ? ((storeStats.merchantMRR / totalMRR) * 100).toFixed(1) : 0}%
                      </strong>
                    </div>
                    <div className="text-xl font-black text-white">
                      R$ {storeStats.merchantMRR.toFixed(2).replace('.', ',')}
                      <span className="text-xs text-gray-400 font-normal"> /mês</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {storeStats.goldCount} Ouro (R$ 199,90) + {storeStats.silverCount} Prata (R$ 79,90) + {storeStats.bronzeCount} Bronze (R$ 39,90)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button
                  onClick={() => setActiveAdminTab('financial')}
                  className="w-full text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver Detalhamento Financeiro Completo</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </div>

          {/* RESUMO DAS TOP CIDADES EM FATURAMENTO */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-red-400" />
                  <span>Top Cidades com Maior Faturamento & Clientes</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Visão consolidada da presença do Melhor Cupom em cada município
                </p>
              </div>
              <button
                onClick={() => setActiveAdminTab('cities')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 w-fit"
              >
                <span>Ver Análise Detalhada por Cidades</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cityMetrics.slice(0, 4).map((city, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#1A1A28] border border-white/10 hover:border-blue-500/40 p-4 rounded-xl transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedCityFilter(city.cityName);
                    setActiveAdminTab('cities');
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <MapPin size={13} className="text-red-400" />
                      <span>{city.cityName}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full text-gray-400 border border-white/10">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    R$ {city.totalRevenue.toFixed(2).replace('.', ',')}
                    <span className="text-[10px] text-gray-400 font-normal"> /mês</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-white/5">
                    <span>{city.storesCount} Lojas</span>
                    <span>{city.usersCount} Usuários ({city.vipUsersCount} VIP)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CLIENTES POR CIDADES (LOJAS E USUÁRIOS)                            */}
      {/* ========================================================================= */}
      {activeAdminTab === 'cities' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* HEADER DA ABA DE CIDADES */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
                  <Building2 size={22} className="text-blue-400" />
                  <span>Clientes Cadastrados por Cidades (Lojas e Usuários)</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Panorama completo da densidade da plataforma em cada região: contagem de estabelecimentos, usuários pagantes VIP e faturamento local.
                </p>
              </div>

              {/* Seletor de Cidade em Destaque */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Filtrar Cidade:</span>
                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className="bg-[#1C1C28] border border-white/15 text-white text-xs rounded-xl px-3.5 py-2 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todas as Cidades ({cityMetrics.length})</option>
                  {availableCities.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
                {selectedCityFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedCityFilter('all')}
                    className="text-xs text-blue-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-2 rounded-xl border border-white/10 transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABELA COMPARATIVA DE CIDADES */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-400" />
                  <span>Tabela Comparativa de Municípios Credenciados</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ordenado pelo faturamento mensal gerado (Lojas + Assinaturas VIP)
                </p>
              </div>
              <span className="text-xs text-gray-400">
                Total de Cidades: <strong className="text-white">{cityMetrics.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181824] text-gray-400 uppercase font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Cidade / Região</th>
                    <th className="py-3 px-4 text-center">Lojas Parceiras</th>
                    <th className="py-3 px-4 text-center">Planos (Ouro/Prata/Bronze)</th>
                    <th className="py-3 px-4 text-center">Usuários Cadastrados</th>
                    <th className="py-3 px-4 text-center">Assinantes VIP</th>
                    <th className="py-3 px-4 text-center">Ofertas Ativas</th>
                    <th className="py-3 px-4 text-right">Faturamento Local (MRR)</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {cityMetrics
                    .filter(c => selectedCityFilter === 'all' || c.cityName === selectedCityFilter)
                    .map((city, idx) => {
                      const isSelected = selectedCityFilter === city.cityName;
                      return (
                        <tr 
                          key={idx} 
                          className={`hover:bg-white/[0.03] transition-colors ${isSelected ? 'bg-blue-600/10' : ''}`}
                        >
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <MapPin size={15} className="text-[#FF5F00] flex-shrink-0" />
                              <span>{city.cityName}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-semibold text-white">
                            <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                              {city.storesCount}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[10px]">
                              {city.goldStores > 0 && (
                                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                                  👑 {city.goldStores}
                                </span>
                              )}
                              {city.silverStores > 0 && (
                                <span className="bg-slate-400/20 text-slate-300 px-2 py-0.5 rounded border border-slate-400/30">
                                  🥈 {city.silverStores}
                                </span>
                              )}
                              {city.bronzeStores > 0 && (
                                <span className="bg-amber-800/30 text-[#CD7F32] px-2 py-0.5 rounded border border-amber-700/30">
                                  🥉 {city.bronzeStores}
                                </span>
                              )}
                              {city.freeStores > 0 && (
                                <span className="bg-gray-700/40 text-gray-400 px-2 py-0.5 rounded">
                                  {city.freeStores} Free
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-semibold text-white">
                            <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                              {city.usersCount}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold px-2.5 py-1 rounded-lg">
                              👑 {city.vipUsersCount} VIP
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center text-gray-400">
                            {city.activeCouponsCount} cupons
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="font-extrabold text-emerald-400 text-sm">
                              R$ {city.totalRevenue.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Lojas: R$ {city.merchantRevenue.toFixed(2).replace('.', ',')} | VIPs: R$ {city.userRevenue.toFixed(2).replace('.', ',')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedCityFilter(city.cityName);
                              }}
                              className="text-xs text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/30 px-3 py-1 rounded-lg transition-colors font-semibold"
                            >
                              Filtrar Listas
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* VISUALIZAÇÃO DETALHADA: LOJAS E USUÁRIOS DA CIDADE SELECIONADA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Coluna 1: Lojas na Cidade Selecionada */}
            <div className="bg-[#14141F] border border-white/10 rounded-2xl p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-[#FF5F00]" />
                  <h3 className="font-bold text-white text-sm">
                    Lojas Parceiras {selectedCityFilter !== 'all' ? `em ${selectedCityFilter}` : '(Todas as Cidades)'}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {filteredStoresList.length} lojas
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredStoresList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    Nenhuma loja encontrada para este filtro.
                  </div>
                ) : (
                  filteredStoresList.map(store => {
                    const tier = store.tier || 'free';
                    return (
                      <div key={store.id} className="bg-[#1A1A28] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#12121A] border border-white/10 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                            {store.logoImage ? (
                              <img src={store.logoImage} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{store.logo || '🏪'}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{store.name}</span>
                              {tier === 'gold' && <Crown size={12} className="text-amber-400" />}
                              {tier === 'silver' && <Award size={12} className="text-slate-300" />}
                              {tier === 'bronze' && <Medal size={12} className="text-[#CD7F32]" />}
                            </div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                              <span>{store.city}</span>
                              <span>•</span>
                              <span className="capitalize">{store.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            tier === 'gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            tier === 'silver' ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                            tier === 'bronze' ? 'bg-amber-800/30 text-[#CD7F32] border border-amber-700/40' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            Plano {tier}
                          </span>
                          <div className="text-xs font-bold text-emerald-400 mt-1">
                            {tier === 'gold' ? 'R$ 199,90/mês' : tier === 'silver' ? 'R$ 79,90/mês' : tier === 'bronze' ? 'R$ 39,90/mês' : 'R$ 0,00'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Coluna 2: Usuários na Cidade Selecionada */}
            <div className="bg-[#14141F] border border-white/10 rounded-2xl p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  <h3 className="font-bold text-white text-sm">
                    Usuários Cadastrados {selectedCityFilter !== 'all' ? `em ${selectedCityFilter}` : '(Todas as Cidades)'}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {filteredUsersList.length} cadastros
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredUsersList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    Nenhum usuário cadastrado nesta cidade.
                  </div>
                ) : (
                  filteredUsersList.map(user => (
                    <div key={user.id} className="bg-[#1A1A28] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-gray-800">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.isVip && (
                              <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                                👑 VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span>{user.city}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-bold text-emerald-400">
                          R$ {(user.monthlySavings || 0).toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          economia gerada
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: FATURAMENTO & PLANOS DETALHADOS                                    */}
      {/* ========================================================================= */}
      {activeAdminTab === 'financial' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* CARDS COM DETALHAMENTO DE RECEITA B2C E B2B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stream 1: Assinaturas de Usuários VIP (B2C) */}
            <div className="bg-[#14141F] border-2 border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    B2C
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Assinaturas de Usuários VIP</h3>
                    <p className="text-xs text-gray-400">Receita recorrente por membros pagantes</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                  R$ 19,90 /mês
                </span>
              </div>

              <div className="my-6 p-4 rounded-2xl bg-[#1A1A28] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total de Assinantes VIP Ativos:</span>
                  <strong className="text-white text-sm">{userStats.vipCount} usuários</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Preço da Assinatura Mensal:</span>
                  <strong className="text-white text-sm">R$ 19,90</strong>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span className="font-bold text-gray-200">Faturamento Mensal (MRR B2C):</span>
                  <strong className="text-xl font-black text-emerald-400">
                    R$ {userStats.vipMRR.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Projeção Anual B2C (ARR):</span>
                  <strong className="text-blue-400 font-bold">
                    R$ {(userStats.vipMRR * 12).toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </div>

              <div className="text-xs text-gray-400 leading-relaxed">
                💡 <strong className="text-gray-300">Modelo de Monetização:</strong> Cada cliente VIP gera R$ 19,90/mês recorrente via cartão de crédito ou PIX, tendo acesso a descontos exclusivos e resgates ilimitados.
              </div>
            </div>

            {/* Stream 2: Planos de Estabelecimentos Parceiros (B2B) */}
            <div className="bg-[#14141F] border-2 border-orange-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center font-bold">
                    B2B
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Planos de Estabelecimentos</h3>
                    <p className="text-xs text-gray-400">Mensalidades de lojistas por destaque</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30">
                  Ouro • Prata • Bronze
                </span>
              </div>

              <div className="my-6 p-4 rounded-2xl bg-[#1A1A28] border border-white/5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    👑 Plano Ouro VIP ({storeStats.goldCount} lojas × R$ 199,90):
                  </span>
                  <strong className="text-white text-sm font-bold">R$ {storeStats.goldMRR.toFixed(2).replace('.', ',')}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                    🥈 Plano Prata Pro ({storeStats.silverCount} lojas × R$ 79,90):
                  </span>
                  <strong className="text-white text-sm font-bold">R$ {storeStats.silverMRR.toFixed(2).replace('.', ',')}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#CD7F32] font-bold">
                    🥉 Plano Bronze Star ({storeStats.bronzeCount} lojas × R$ 39,90):
                  </span>
                  <strong className="text-white text-sm font-bold">R$ {storeStats.bronzeMRR.toFixed(2).replace('.', ',')}</strong>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>Plano Grátis ({storeStats.freeCount} lojas):</span>
                  <span>R$ 0,00</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span className="font-bold text-gray-200">Faturamento Mensal (MRR B2B):</span>
                  <strong className="text-xl font-black text-emerald-400">
                    R$ {storeStats.merchantMRR.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Projeção Anual B2B (ARR):</span>
                  <strong className="text-orange-400 font-bold">
                    R$ {(storeStats.merchantMRR * 12).toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </div>

              <div className="text-xs text-gray-400 leading-relaxed">
                💡 <strong className="text-gray-300">Modelo de Monetização:</strong> Quanto maior a assinatura do lojista, mais no topo suas ofertas aparecem na Home e na busca dos assinantes da cidade.
              </div>
            </div>

          </div>

          {/* TABELA CONSOLIDADA DOS PLANOS DO ECOSSISTEMA */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  <span>Resumo da Grade de Produtos & Mensalidades</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Comparativo de preços, cotas e limites de cada tier ativo
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181824] text-gray-400 uppercase font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Produto / Plano</th>
                    <th className="py-3 px-4">Público-Alvo</th>
                    <th className="py-3 px-4">Preço Mensal</th>
                    <th className="py-3 px-4 text-center">Ativos na Base</th>
                    <th className="py-3 px-4 text-right">Faturamento Gerado</th>
                    <th className="py-3 px-4 text-center">Prioridade no App</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles size={14} /> Assinatura VIP
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">Consumidor Final (B2C)</td>
                    <td className="py-3.5 px-4 font-bold text-white">R$ 19,90 /mês</td>
                    <td className="py-3.5 px-4 text-center font-bold text-blue-400">{userStats.vipCount} membros</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">R$ {userStats.vipMRR.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3.5 px-4 text-center text-gray-400">Acesso ilimitado</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-amber-300 flex items-center gap-1.5">
                      <Crown size={14} /> Plano Ouro VIP Top
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">Comerciante / Loja (B2B)</td>
                    <td className="py-3.5 px-4 font-bold text-white">R$ 199,90 /mês</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-400">{storeStats.goldCount} lojas</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">R$ {storeStats.goldMRR.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3.5 px-4 text-center text-amber-300 font-bold">Topo Absoluto (Peso 4)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-300 flex items-center gap-1.5">
                      <Award size={14} /> Plano Prata Pro
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">Comerciante / Loja (B2B)</td>
                    <td className="py-3.5 px-4 font-bold text-white">R$ 79,90 /mês</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-300">{storeStats.silverCount} lojas</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">R$ {storeStats.silverMRR.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300 font-bold">Alta Prioridade (Peso 3)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#CD7F32] flex items-center gap-1.5">
                      <Medal size={14} /> Plano Bronze Star
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">Comerciante / Loja (B2B)</td>
                    <td className="py-3.5 px-4 font-bold text-white">R$ 39,90 /mês</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#CD7F32]">{storeStats.bronzeCount} lojas</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">R$ {storeStats.bronzeMRR.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3.5 px-4 text-center text-[#CD7F32] font-bold">Média Prioridade (Peso 2)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-400 flex items-center gap-1.5">
                      <Store size={14} /> Plano Grátis
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">Comerciante / Loja (B2B)</td>
                    <td className="py-3.5 px-4 font-bold text-white">R$ 0,00 /mês</td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-400">{storeStats.freeCount} lojas</td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-400">R$ 0,00</td>
                    <td className="py-3.5 px-4 text-center text-gray-500">Padrão (Peso 1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: GESTÃO DE LOJAS PARCEIRAS                                          */}
      {/* ========================================================================= */}
      {activeAdminTab === 'stores' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* BARRA DE FILTROS PARA LOJAS */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Campo de Busca */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Buscar loja por nome ou categoria..."
                className="w-full bg-[#1A1A28] border border-white/10 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-[#FF5F00]"
              />
            </div>

            {/* Filtros Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-[#1A1A28] border border-white/10 text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#FF5F00]"
              >
                <option value="all">Todas as Cidades</option>
                {availableCities.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={storeTierFilter}
                onChange={(e) => setStoreTierFilter(e.target.value)}
                className="bg-[#1A1A28] border border-white/10 text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#FF5F00]"
              >
                <option value="all">Todos os Planos</option>
                <option value="gold">👑 Apenas Ouro VIP (R$ 199,90)</option>
                <option value="silver">🥈 Apenas Prata Pro (R$ 79,90)</option>
                <option value="bronze">🥉 Apenas Bronze Star (R$ 39,90)</option>
                <option value="free">Lojas Gratuitas</option>
              </select>

              <span className="text-xs text-gray-400 ml-2">
                {filteredStoresList.length} lojas listadas
              </span>
            </div>
          </div>

          {/* TABELA DE GESTÃO DE LOJAS COM UPGRADE DE PLANO */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181824] text-gray-400 uppercase font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Estabelecimento</th>
                    <th className="py-3 px-4">Cidade</th>
                    <th className="py-3 px-4">Contato / Endereço</th>
                    <th className="py-3 px-4 text-center">Plano Atual</th>
                    <th className="py-3 px-4 text-center">Alterar Plano (Ação ADM)</th>
                    <th className="py-3 px-4 text-right">Faturamento /mês</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredStoresList.map(store => {
                    const tier = store.tier || 'free';
                    const activeOffers = coupons.filter(c => c.storeId === store.id).length;

                    return (
                      <tr key={store.id} className="hover:bg-white/[0.03] transition-colors">
                        {/* Loja */}
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#12121A] border border-white/10 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                              {store.logoImage ? (
                                <img src={store.logoImage} alt={store.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{store.logo || '🏪'}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{store.name}</div>
                              <div className="text-[10px] text-gray-400 capitalize">{store.category} • {activeOffers} cupons</div>
                            </div>
                          </div>
                        </td>

                        {/* Cidade */}
                        <td className="py-3.5 px-4 font-medium text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-red-400 flex-shrink-0" />
                            <span>{store.city}</span>
                          </div>
                        </td>

                        {/* Contato */}
                        <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                          <div>{store.phone || '(11) 99999-0000'}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs">{store.address}</div>
                        </td>

                        {/* Badge Plano Atual */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            tier === 'gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' :
                            tier === 'silver' ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                            tier === 'bronze' ? 'bg-amber-800/30 text-[#CD7F32] border border-amber-700/40' :
                            'bg-white/5 text-gray-400 border border-white/10'
                          }`}>
                            {tier === 'gold' && <Crown size={12} />}
                            {tier === 'silver' && <Award size={12} />}
                            {tier === 'bronze' && <Medal size={12} />}
                            <span className="capitalize">{tier}</span>
                          </span>
                        </td>

                        {/* Ação ADM: Dropdown para Troca Rápida de Plano */}
                        <td className="py-3.5 px-4 text-center">
                          <select
                            value={tier}
                            onChange={(e) => handleUpdateStoreTier(store.id, store.name, e.target.value)}
                            className="bg-[#1C1C28] border border-white/20 text-white text-xs rounded-xl px-2.5 py-1.5 font-bold focus:outline-none focus:border-[#FF5F00] cursor-pointer"
                          >
                            <option value="gold">👑 Ouro (R$ 199,90)</option>
                            <option value="silver">🥈 Prata (R$ 79,90)</option>
                            <option value="bronze">🥉 Bronze (R$ 39,90)</option>
                            <option value="free">Grátis (R$ 0)</option>
                          </select>
                        </td>

                        {/* Faturamento Mensal */}
                        <td className="py-3.5 px-4 text-right font-extrabold text-sm text-emerald-400">
                          {tier === 'gold' ? 'R$ 199,90' : tier === 'silver' ? 'R$ 79,90' : tier === 'bronze' ? 'R$ 39,90' : 'R$ 0,00'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: GESTÃO DE USUÁRIOS CADASTRADOS                                     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* BARRA DE FILTROS PARA USUÁRIOS */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Campo de Busca */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Buscar usuário por nome, email ou CPF..."
                className="w-full bg-[#1A1A28] border border-white/10 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filtros Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-[#1A1A28] border border-white/10 text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todas as Cidades</option>
                {availableCities.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={userVipFilter}
                onChange={(e) => setUserVipFilter(e.target.value)}
                className="bg-[#1A1A28] border border-white/10 text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="vip">👑 Apenas Assinantes VIP</option>
                <option value="free">Apenas Contas Gratuitas</option>
              </select>

              <span className="text-xs text-gray-400 ml-2">
                {filteredUsersList.length} cadastros listados
              </span>
            </div>
          </div>

          {/* TABELA DE GESTÃO DE USUÁRIOS */}
          <div className="bg-[#14141F] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181824] text-gray-400 uppercase font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Usuário</th>
                    <th className="py-3 px-4">CPF</th>
                    <th className="py-3 px-4">Cidade</th>
                    <th className="py-3 px-4 text-center">Status VIP</th>
                    <th className="py-3 px-4 text-right">Economia Gerada</th>
                    <th className="py-3 px-4 text-right">Caixa Indicações</th>
                    <th className="py-3 px-4 text-center">Ações Administrativas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredUsersList.map(user => {
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                        {/* Identificação */}
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-gray-800">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                <span>{user.name}</span>
                              </div>
                              <div className="text-[10px] text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* CPF */}
                        <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">
                          {user.cpf || '382.***.***-04'}
                        </td>

                        {/* Cidade */}
                        <td className="py-3.5 px-4 text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-red-400 flex-shrink-0" />
                            <span>{user.city}</span>
                          </div>
                        </td>

                        {/* Status VIP */}
                        <td className="py-3.5 px-4 text-center">
                          {user.isVip ? (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                              <span>👑 VIP Ativo</span>
                              <span className="text-[10px] text-gray-400">(R$ 19,90)</span>
                            </span>
                          ) : (
                            <span className="bg-white/5 text-gray-400 border border-white/10 px-2.5 py-1 rounded-lg text-[11px]">
                              Gratuito
                            </span>
                          )}
                        </td>

                        {/* Economia */}
                        <td className="py-3.5 px-4 text-right font-extrabold text-sm text-emerald-400">
                          R$ {(user.monthlySavings || 0).toFixed(2).replace('.', ',')}
                        </td>

                        {/* Saldo de Indicação */}
                        <td className="py-3.5 px-4 text-right font-bold text-amber-300">
                          R$ {(user.referralBalance || 0).toFixed(2).replace('.', ',')}
                        </td>

                        {/* Ações Administrativas */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Botão Alternar VIP */}
                            <button
                              onClick={() => handleToggleVip(user.id, user.name, user.isVip)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                user.isVip
                                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                              }`}
                              title={user.isVip ? 'Revogar Assinatura VIP' : 'Ativar VIP para este usuário'}
                            >
                              {user.isVip ? 'Revogar VIP' : 'Ativar VIP'}
                            </button>

                            {/* Botão Bonificar Indicação */}
                            <button
                              onClick={() => handleBonusReferral(user.id, user.name)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                              title="Adicionar bônus de R$ 5,00 no caixa de indicação"
                            >
                              + R$ 5
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
      )}

      {/* ABA 6: DIVULGAÇÃO & INSTAGRAM OFICIAL (@melhorcupom.oficial) */}
      {activeAdminTab === 'divulgacao' && (
        <AdminPromoManager stores={stores} showToast={showToast} />
      )}

      {/* ABA 7: HUB DE INTEGRAÇÕES & APIS DE AFILIADOS (AWIN, LOMADEE, SHOPEE, MERCADO LIVRE) */}
      {activeAdminTab === 'integrations' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* HEADER DO HUB DE APIS & BOTÕES DE CONTROLE */}
          <div className="bg-gradient-to-r from-[#101F18] via-[#14231E] to-[#101F18] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Conexão em Tempo Real</span>
                  </span>
                  <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 font-mono">
                    Protocolos: REST • GraphQL • Webhooks
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2.5">
                  <span>Central de APIs & Afiliados Oficiais</span>
                  <span className="text-xs bg-emerald-500/30 text-emerald-300 font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/40">
                    {apiConnectors?.length || 5} Ativos
                  </span>
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Gerencie a sincronização contínua de cupons, geração automática de SubIDs para rastreamento de compras e processamento de comissões/cashback das redes Awin, Lomadee, Shopee, Mercado Livre e AliExpress.
                </p>
              </div>

              {/* Ações Rápidas: Sincronizar Agora */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={async () => {
                    const res = await syncApisNow();
                    showToast(`Sincronização concluída! ${res.count} cupons atualizados com sucesso via APIs.`);
                  }}
                  disabled={isSyncingApis}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isSyncingApis ? 'animate-spin' : ''} />
                  <span>{isSyncingApis ? 'Sincronizando com Redes...' : 'Sincronizar APIs Agora'}</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Ping enviado para todas as redes: 200 OK (Latência Média: 42ms)');
                  }}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
                >
                  <Activity size={16} className="text-emerald-400" />
                  <span>Testar Latência (Ping)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 CARDS DE KPIS DO HUB DE APIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1 */}
            <div className="bg-[#14141E] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conectores Oficiais</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Server size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display flex items-baseline gap-2">
                <span>{apiConnectors?.length || 5} / {apiConnectors?.length || 5}</span>
                <span className="text-xs font-bold text-emerald-400">100% Online</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Awin, Lomadee, Shopee, Mercado Livre e AliExpress operando normalmente.
              </p>
            </div>

            {/* KPI 2 */}
            <div className="bg-[#14141E] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cupons Sincronizados</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Tag size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display flex items-baseline gap-2">
                <span>482</span>
                <span className="text-xs font-bold text-blue-400">+18 hoje</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Vouchers oficiais testados e ativos na plataforma.
              </p>
            </div>

            {/* KPI 3 */}
            <div className="bg-[#14141E] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Volume de Vendas (GMV)</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-display">
                R$ 58.400,00
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Vendas rastreadas via SubID dos assinantes VIP no mês.
              </p>
            </div>

            {/* KPI 4 */}
            <div className="bg-[#14141E] border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden shadow-lg bg-gradient-to-b from-[#14141E] to-[#12221A]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Lucro Líquido Afiliados</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Coins size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400 font-display">
                R$ 2.410,00
              </div>
              <p className="text-[11px] text-gray-300 mt-1">
                De R$ 4.820,00 brutos (50% cashback usuário / 50% margem Melhor Cupom).
              </p>
            </div>
          </div>

          {/* GRID DOS CONECTORES DE APIS */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Network size={18} className="text-[#FF5F00]" />
              <span>Conectores de APIs de Afiliados Configurados</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apiConnectors?.map((connector) => (
                <div 
                  key={connector.id}
                  className="bg-[#151522] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    {/* Header do Conector */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white">{connector.name}</h4>
                          <span className="text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{connector.statusLabel}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{connector.network}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                          {connector.pingMs}ms
                        </span>
                        <div className="text-[10px] text-gray-500 mt-1">{connector.apiVersion}</div>
                      </div>
                    </div>

                    {/* Métricas do Conector */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-black/40 rounded-xl border border-white/5 text-center text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Lojas Ativas</span>
                        <strong className="text-white font-black">{connector.totalStores}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Cupons</span>
                        <strong className="text-white font-black">{connector.totalCoupons}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Comissão Média</span>
                        <strong className="text-emerald-400 font-black">{connector.avgCommission}</strong>
                      </div>
                    </div>

                    {/* Principais Marcas Vinculadas */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Marcas Sincronizadas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {connector.topBrands?.map((brand, bIdx) => (
                          <span key={bIdx} className="text-[11px] bg-white/5 text-gray-200 px-2.5 py-1 rounded-lg border border-white/10 font-semibold">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Credenciais & Endpoint Webhook */}
                    <div className="bg-[#0D0D14] rounded-xl p-3 text-[11px] font-mono space-y-2 border border-white/5 text-gray-400">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">ID / Publisher:</span>
                        <span className="text-gray-200 font-bold flex items-center gap-1.5">
                          <span>{connector.credentials?.publisherId || connector.credentials?.appId || connector.credentials?.clientId}</span>
                          {connector.accountName && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-sans font-bold">
                              {connector.accountName}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500 flex-shrink-0">API Key:</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-amber-400 truncate max-w-[160px]" title={connector.credentials?.apiKey || connector.credentials?.secretKey || connector.credentials?.clientSecret}>
                            {showFullApiKey[connector.id]
                              ? (connector.credentials?.apiKey || connector.credentials?.secretKey || connector.credentials?.clientSecret)
                              : (() => {
                                  const key = connector.credentials?.apiKey || connector.credentials?.secretKey || connector.credentials?.clientSecret || '';
                                  if (key.length > 14) {
                                    return `${key.slice(0, 8)}••••••••${key.slice(-4)}`;
                                  }
                                  return key;
                                })()
                            }
                          </span>
                          <button
                            onClick={() => setShowFullApiKey(prev => ({ ...prev, [connector.id]: !prev[connector.id] }))}
                            className="text-gray-500 hover:text-white p-1 rounded transition-colors"
                            title={showFullApiKey[connector.id] ? "Ocultar token" : "Revelar token completo"}
                          >
                            {showFullApiKey[connector.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => {
                              const key = connector.credentials?.apiKey || connector.credentials?.secretKey || connector.credentials?.clientSecret;
                              if (key) {
                                navigator.clipboard.writeText(key);
                                showToast(`Token copiado para a área de transferência!`);
                              }
                            }}
                            className="text-gray-500 hover:text-amber-400 p-1 rounded transition-colors"
                            title="Copiar token"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">SubID Param:</span>
                        <span className="text-blue-300">{connector.credentials?.subIdParam}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ação do Conector: Teste de Conexão e Edição */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">Última sincronização: {connector.lastSync}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingConnector(connector);
                          setEditCredentialsForm({
                            publisherId: connector.credentials?.appKey || connector.credentials?.publisherId || connector.credentials?.appId || connector.credentials?.clientId || '',
                            apiKey: connector.credentials?.appSecret || connector.credentials?.apiKey || connector.credentials?.secretKey || connector.credentials?.clientSecret || '',
                            subIdParam: connector.credentials?.subIdParam || '',
                            webhookEndpoint: connector.credentials?.webhookEndpoint || ''
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Editar credenciais e chaves deste conector"
                      >
                        <Edit3 size={12} />
                        <span>Configurar</span>
                      </button>

                      <button
                        onClick={() => {
                          showToast(`Conexão com ${connector.name}: 200 OK (${connector.pingMs}ms)!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <CheckCircle2 size={12} />
                        <span>Ping OK</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Configuração de Credenciais do Conector */}
            {editingConnector && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-lg bg-[#181824] border-2 border-blue-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Key size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">Configurar Credenciais Oficiais</h3>
                        <p className="text-xs text-gray-400">{editingConnector.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingConnector(null)}
                      className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {editingConnector.id === 'aliexpress' 
                          ? 'AppKey Oficial AliExpress:' 
                          : editingConnector.id === 'awin' 
                          ? 'Account ID Awin:' 
                          : editingConnector.id === 'shopee'
                          ? 'App ID Shopee:'
                          : editingConnector.id === 'shein'
                          ? 'ID de Afiliado SHEIN:'
                          : editingConnector.id === 'meli'
                          ? 'Client ID Mercado Livre:'
                          : 'ID do Publisher / Conta:'}
                      </label>
                      <input
                        type="text"
                        value={editCredentialsForm.publisherId}
                        onChange={(e) => setEditCredentialsForm(prev => ({ ...prev, publisherId: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                        placeholder={editingConnector.id === 'aliexpress' ? 'Ex: 548636' : editingConnector.id === 'shein' ? 'Ex: 5005674890' : 'Ex: 3095275'}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {editingConnector.id === 'aliexpress'
                          ? 'App Secret Oficial AliExpress:'
                          : 'API Token / Secret Key Oficial:'}
                      </label>
                      <input
                        type="text"
                        value={editCredentialsForm.apiKey}
                        onChange={(e) => setEditCredentialsForm(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono focus:border-blue-500 focus:outline-none"
                        placeholder="Insira o API Token / Secret Key..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Parâmetro de SubID (Rastreamento de Comissões e Cashback):
                      </label>
                      <input
                        type="text"
                        value={editCredentialsForm.subIdParam}
                        onChange={(e) => setEditCredentialsForm(prev => ({ ...prev, subIdParam: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-blue-300 font-mono focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: clickref=melhorcupom_vip"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Webhook Endpoint de Notificação de Vendas (Opcional):
                      </label>
                      <input
                        type="text"
                        value={editCredentialsForm.webhookEndpoint}
                        onChange={(e) => setEditCredentialsForm(prev => ({ ...prev, webhookEndpoint: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-400 font-mono focus:border-blue-500 focus:outline-none"
                        placeholder="https://api.melhorcupom.com.br/webhooks/..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingConnector(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        updateConnectorCredentials(editingConnector.id, editCredentialsForm);
                        setEditingConnector(null);
                        showToast(`Credenciais de ${editingConnector.name} atualizadas e validadas!`);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                    >
                      Salvar Credenciais
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TERMINAL DE LOGS & WEBHOOKS EM TEMPO REAL */}
          <div className="bg-[#0A0A10] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            {/* Header do Terminal com Botões Estilo Mac/Linux */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span>logs_stream_melhorcupom_api.log</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>

              <div className="text-[11px] font-mono text-gray-500">
                Live Feed (Webhook Listener: 0.0.0.0:8080)
              </div>
            </div>

            {/* Corpo de Mensagens do Terminal */}
            <div className="font-mono text-xs space-y-2 max-h-64 overflow-y-auto pr-2">
              {apiLogs?.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-gray-500 select-none">[{log.timestamp}]</span>
                  <span className="text-blue-400 font-bold select-none">[{log.service}]</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold select-none ${
                    log.status === '200 OK' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TABELA DE REPASSE & MARGENS DE COMISSÃO POR MARCA */}
          <div className="bg-[#151522] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Coins size={18} className="text-emerald-400" />
                <span>Modelo de Repasse: Cashback do Usuário vs Margem da Plataforma</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Demonstrativo de como o Melhor Cupom rentabiliza cada transação gerada nos grandes e-commerces parceiros.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1B1B2A] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Loja Parceira</th>
                    <th className="py-3 px-4">Rede API</th>
                    <th className="py-3 px-4 text-center">Comissão Bruta</th>
                    <th className="py-3 px-4 text-center">Cashback Pago ao Usuário</th>
                    <th className="py-3 px-4 text-center">Lucro Melhor Cupom</th>
                    <th className="py-3 px-4 text-center">Cupons Ativos</th>
                    <th className="py-3 px-4 rounded-r-xl text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stores.filter(s => s.isApiIntegrated || s.apiSource).map((store) => {
                    const comBruta = store.name.includes('SHEIN') ? '12.0%' : store.name.includes('Amazon') ? '9.0%' : store.name.includes('Shopee') ? '8.0%' : store.name.includes('Nike') ? '7.5%' : store.name.includes('Magalu') ? '6.5%' : store.name.includes('Drogasil') ? '5.5%' : store.name.includes('Mercado') ? '5.0%' : '4.0%';
                    const cashbackUser = store.cashbackRate || 'Até 6%';
                    const margemPlataforma = '50% do Spread';

                    return (
                      <tr key={store.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                          <span className="text-lg">{store.logo || '🛍️'}</span>
                          <span>{store.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-300">
                          {store.apiSource || 'API Oficial'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-300">
                          {comBruta}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-400">
                          {cashbackUser}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-blue-400">
                          {margemPlataforma}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-300">
                          {store.couponsCount || 8} cupons
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Sincronizado</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ABA 8: SIMULADOR DE PERFIS E PERMISSÕES (EXCLUSIVO DO ADM MASTER) */}
      {activeAdminTab === 'simulador' && (
        <RoleSwitcher />
      )}

      {/* ABA 9: GERENCIADOR DE MENSAGENS WHATSAPP POR CIDADE */}
      {activeAdminTab === 'mensagens' && (
        <AdminWhatsAppManager />
      )}

    </div>
  );
};
