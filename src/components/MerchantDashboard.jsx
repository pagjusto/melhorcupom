import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Store, 
  PlusCircle, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Tag, 
  Calendar, 
  Clock, 
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
  MapPin,
  Settings,
  KeyRound,
  Phone,
  Globe,
  Building2,
  Lock,
  Crown,
  Award,
  Medal,
  Heart,
  Zap,
  Shield,
  Gift,
  Copy,
  Coins,
  Share2
} from 'lucide-react';

const BANNER_PRESETS = [
  { name: 'Burger Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80' },
  { name: 'Chopp & Petiscos', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&auto=format&fit=crop&q=80' },
  { name: 'Corte & Barba', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&auto=format&fit=crop&q=80' },
  { name: 'Pizza Italiana', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=700&auto=format&fit=crop&q=80' },
  { name: 'Steak & Carnes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80' },
  { name: 'Crossfit & Fitness', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80' },
  { name: 'Moda & Sneakers', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80' }
];

export const MerchantDashboard = ({ prefilledCode }) => {
  const { 
    currentRole, 
    stores, 
    coupons, 
    redemptions, 
    validateRedemption, 
    addCoupon,
    updateStore,
    upgradeStoreTier,
    merchantPlans,
    switchRole,
    addReferral,
    setIsReferralModalOpen 
  } = useApp();

  // Identificar loja correspondente ao role
  const merchantId = currentRole.startsWith('merchant_') ? currentRole : 'merchant_burger';
  const currentStore = stores.find(s => s.merchantId === merchantId) || stores[0];

  // Cupons desta loja
  const storeCoupons = coupons.filter(c => c.merchantId === currentStore.merchantId);
  const storeRedemptions = redemptions.filter(r => r.merchantId === currentStore.merchantId);

  // Tabs internas do Painel
  const [activeTab, setActiveTab] = useState(prefilledCode ? 'validator' : 'coupons'); // 'coupons' | 'validator' | 'new-coupon' | 'settings' | 'plans' | 'referrals'
  const [copiedStoreLink, setCopiedStoreLink] = useState(false);
  const [useStoreBalanceForUpgrade, setUseStoreBalanceForUpgrade] = useState(true);
  const [merchantJustEarned, setMerchantJustEarned] = useState(null);
  
  // Plano de assinatura atual do lojista
  const currentPlan = merchantPlans?.find(p => p.id === (currentStore.tier || 'free')) || {
    id: 'free',
    name: 'Plano Grátis',
    priceLabel: 'R$ 0',
    period: '/mês',
    maxCoupons: 1
  };
  const isLimitReached = storeCoupons.length >= currentPlan.maxCoupons;
  const [planUpgradeSuccess, setPlanUpgradeSuccess] = useState('');

  // Estado do Validador de Balcão
  const [validationInput, setValidationInput] = useState(prefilledCode || '');
  const [validationResult, setValidationResult] = useState(null);

  // Upload refs
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Estado de Configurações da Loja
  const [storeSavedSuccess, setStoreSavedSuccess] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: currentStore.name || '',
    category: currentStore.category || 'gastronomia',
    city: currentStore.city || 'São Paulo - SP',
    address: currentStore.address || '',
    phone: currentStore.phone || '(11) 97123-4567',
    hours: currentStore.hours || 'Seg a Dom: 11h30 às 23h00',
    website: currentStore.website || 'https://www.melhorcupom.com.br',
    instagram: currentStore.instagram || '@' + (currentStore.merchantId?.replace('merchant_', '') || 'lojaparceira'),
    description: currentStore.description || `${currentStore.name} é um estabelecimento parceiro oficial do Clube VIP Melhor Cupom com descontos exclusivos para assinantes.`,
    cashierPin: currentStore.cashierPin || '1234',
    logoImage: currentStore.logoImage || '',
    coverImage: currentStore.image || ''
  });

  useEffect(() => {
    setStoreForm({
      name: currentStore.name || '',
      category: currentStore.category || 'gastronomia',
      city: currentStore.city || 'São Paulo - SP',
      address: currentStore.address || '',
      phone: currentStore.phone || '(11) 97123-4567',
      hours: currentStore.hours || 'Seg a Dom: 11h30 às 23h00',
      website: currentStore.website || 'https://www.melhorcupom.com.br',
      instagram: currentStore.instagram || '@' + (currentStore.merchantId?.replace('merchant_', '') || 'lojaparceira'),
      description: currentStore.description || `${currentStore.name} é um estabelecimento parceiro oficial do Clube VIP Melhor Cupom com descontos exclusivos para assinantes.`,
      cashierPin: currentStore.cashierPin || '1234',
      logoImage: currentStore.logoImage || '',
      coverImage: currentStore.image || ''
    });
  }, [currentStore]);

  // Formulário de Novo Cupom
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage', // 'percentage' | 'fixed' | 'bogo' | 'gift'
    discountValue: '30%',
    discountBadge: '30% OFF',
    estimatedSavings: 30.00,
    banner: BANNER_PRESETS[0].url,
    type: 'physical', // 'physical' | 'online'
    expiresAt: '2026-12-31',
    limitType: 'one', // 'one' | 'custom' | 'unlimited'
    customMaxUses: 2,
    rules: 'Apresentar o cupom VIP no balcão.\nVálido para consumo no local.\nNão cumulativo com outras promoções.'
  });

  // Upload da Logo da Empresa (Perfil do Lojista)
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreForm(prev => ({ ...prev, logoImage: reader.result }));
        updateStore(currentStore.id, { logoImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload da Foto de Capa da Loja
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreForm(prev => ({ ...prev, coverImage: reader.result }));
        updateStore(currentStore.id, { image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar Configurações Globais da Loja
  const handleSaveStore = (e) => {
    e.preventDefault();
    updateStore(currentStore.id, {
      name: storeForm.name,
      category: storeForm.category,
      city: storeForm.city,
      address: storeForm.address,
      phone: storeForm.phone,
      hours: storeForm.hours,
      website: storeForm.website,
      instagram: storeForm.instagram,
      description: storeForm.description,
      cashierPin: storeForm.cashierPin,
      logoImage: storeForm.logoImage,
      image: storeForm.coverImage
    });
    setStoreSavedSuccess(true);
    setTimeout(() => setStoreSavedSuccess(false), 3500);
  };

  // Upload do Banner da Oferta
  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, banner: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleValidate = (e) => {
    if (e) e.preventDefault();
    if (!validationInput.trim()) return;

    const result = validateRedemption(validationInput, currentStore.merchantId);
    setValidationResult(result);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let maxUses = 1;
    let limitRule = 'Limite de 1 utilização por CPF.';
    if (formData.limitType === 'custom') {
      maxUses = Math.max(2, Number(formData.customMaxUses) || 2);
      limitRule = `Limite de até ${maxUses} utilizações por CPF.`;
    } else if (formData.limitType === 'unlimited') {
      maxUses = null;
      limitRule = 'Uso ilimitado por CPF durante o período da oferta.';
    }

    const rulesArray = [
      limitRule,
      ...formData.rules.split('\n').filter(r => r.trim().length > 0)
    ];

    addCoupon({
      storeId: currentStore.id,
      merchantId: currentStore.merchantId,
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      discountBadge: formData.discountBadge,
      estimatedSavings: Number(formData.estimatedSavings) || 25,
      category: currentStore.category,
      city: currentStore.city || 'São Paulo - SP',
      banner: formData.banner,
      type: formData.type,
      maxUsesPerUser: maxUses,
      codePrefix: currentStore.name.substring(0, 5).toUpperCase().replace(/\s+/g, ''),
      expiresAt: formData.expiresAt,
      rules: rulesArray
    });

    // Resetar e voltar para lista
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '30%',
      discountBadge: '30% OFF',
      estimatedSavings: 30.00,
      banner: BANNER_PRESETS[0].url,
      type: 'physical',
      expiresAt: '2026-12-31',
      limitType: 'one',
      customMaxUses: 2,
      rules: 'Apresentar o cupom VIP no balcão.\nVálido para consumo no local.\nNão cumulativo com outras promoções.'
    });
    setActiveTab('coupons');
  };

  // Calcular métricas estimadas
  const totalUses = storeCoupons.reduce((acc, c) => acc + (c.usesCount || 0), 0);
  const estimatedRevenue = (totalUses * 65.00); // Ticket médio fictício de R$ 65

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header do Lojista */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            
            {/* Logo da Empresa com Botão de Upload */}
            <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
              <div className="w-16 h-16 rounded-2xl bg-[#232332] border-2 border-[#FF5F00] flex items-center justify-center overflow-hidden shadow-lg">
                {currentStore.logoImage ? (
                  <img src={currentStore.logoImage} alt={currentStore.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{currentStore.logo}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={18} />
              </div>
              <input 
                ref={logoInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="hidden" 
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {currentStore.tier === 'gold' ? (
                  <span className="text-xs uppercase font-black tracking-wider text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1.5 shadow-md shadow-amber-950/40">
                    <Crown size={13} fill="currentColor" className="text-amber-400 animate-pulse" />
                    <span>Plano Ouro VIP (Topo Absoluto)</span>
                  </span>
                ) : currentStore.tier === 'silver' ? (
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-200 bg-slate-500/20 px-3 py-0.5 rounded-full border border-slate-400/40 flex items-center gap-1.5">
                    <Award size={13} className="text-slate-300" />
                    <span>Plano Prata Pro (5 Ofertas)</span>
                  </span>
                ) : currentStore.tier === 'bronze' ? (
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-500 bg-amber-900/30 px-3 py-0.5 rounded-full border border-amber-700/50 flex items-center gap-1.5">
                    <Medal size={13} className="text-amber-500" />
                    <span>Plano Bronze Star (3 Ofertas)</span>
                  </span>
                ) : (
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-300 bg-gray-700/40 px-3 py-0.5 rounded-full border border-gray-600">
                    Plano Grátis (1 Oferta)
                  </span>
                )}

                {currentStore.tier !== 'gold' && (
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="text-xs bg-gradient-to-r from-amber-400 to-[#FF5F00] hover:from-amber-300 hover:to-orange-500 text-black font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 transition-all"
                  >
                    <Crown size={11} fill="currentColor" />
                    <span>Fazer Upgrade para Ouro 👑</span>
                  </button>
                )}

                <span className="text-xs text-gray-500">ID: {currentStore.merchantId}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {currentStore.name}
                </h1>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold underline ml-2"
                >
                  Alterar Logo
                </button>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <MapPin size={12} className="text-orange-400" />
                <span>{currentStore.address}</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">★ {currentStore.rating} ({currentStore.reviewsCount} avaliações)</span>
              </p>
            </div>
          </div>

          {/* Troca Rápida de Estabelecimento (para testar) */}
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <span className="text-xs text-gray-400 px-2 font-medium">Trocar Loja:</span>
            <button
              onClick={() => switchRole('merchant_burger')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStore.merchantId === 'merchant_burger'
                  ? 'bg-[#FF5F00] text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🍔 Smash Burger
            </button>
            <button
              onClick={() => switchRole('merchant_barber')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStore.merchantId === 'merchant_barber'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              💈 Barbearia
            </button>
          </div>
        </div>

        {/* Cards de Métricas do Parceiro */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-[#12121A] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Cupons Ativos</span>
              <Tag size={16} className="text-[#FF5F00]" />
            </div>
            <div className="text-2xl font-black text-white">{storeCoupons.length}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Disponíveis no app VIP</div>
          </div>

          <div className="bg-[#12121A] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Clientes VIP Atraídos</span>
              <Users size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalUses}</div>
            <div className="text-[11px] text-gray-400 mt-1">Resgates totais</div>
          </div>

          <div className="bg-[#12121A] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Faturamento Estimado</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Ticket médio R$ 65,00</div>
          </div>

          <div className="bg-[#12121A] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Validações no Balcão</span>
              <QrCode size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {storeRedemptions.filter(r => r.status === 'used').length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Cupons dados baixa</div>
          </div>
        </div>
      </div>

      {/* Navegação de Abas do Lojista */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'coupons'
              ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Tag size={16} />
          <span>Meus Cupons Cadastrados ({storeCoupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('validator')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'validator'
              ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <QrCode size={16} />
          <span>Validador de Balcão (Caixa / PDV)</span>
        </button>

        <button
          onClick={() => setActiveTab('new-coupon')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'new-coupon'
              ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <PlusCircle size={16} />
          <span>Criar Nova Oferta VIP</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#FF5F00] text-white shadow-lg shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Settings size={16} />
          <span>Configurações da Loja</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'plans'
              ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black shadow-lg shadow-amber-600/30'
              : 'bg-[#181824] text-amber-400 hover:text-amber-300 border border-amber-500/20'
          }`}
        >
          <Crown size={16} fill={activeTab === 'plans' ? 'currentColor' : 'none'} />
          <span>Planos & Destaque ({currentPlan.name.replace('Plano ', '')})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'referrals'
              ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black shadow-lg shadow-orange-600/30'
              : 'bg-[#181824] text-amber-300 hover:text-amber-200 border border-amber-500/30'
          }`}
        >
          <Gift size={16} />
          <span>Divulgue & Ganhe (Caixa: R$ {(currentStore.referralBalance || 0).toFixed(2).replace('.', ',')})</span>
        </button>
      </div>

      {/* ABA 1: VALIDADOR DE BALCÃO */}
      {activeTab === 'validator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
                <QrCode size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Validador de Cupons no Balcão</h2>
                <p className="text-xs text-gray-400">
                  Digite o código alfanumérico ou bipe o QR Code apresentado pelo cliente VIP.
                </p>
              </div>
            </div>

            <form onSubmit={handleValidate} className="space-y-4 my-6">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Código do Cupom VIP:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={validationInput}
                    onChange={(e) => setValidationInput(e.target.value.toUpperCase())}
                    placeholder="Ex: VIP-SMASH50-8491"
                    className="flex-1 bg-[#101017] border-2 border-white/15 focus:border-[#FF5F00] rounded-2xl px-4 py-3.5 text-base sm:text-lg font-mono font-bold text-white placeholder-gray-500 focus:outline-none uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-600/30 flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Validar & Baixar</span>
                  </button>
                </div>
              </div>
            </form>

            {validationResult && (
              <div className={`p-5 rounded-2xl border-2 transition-all animate-fade-in ${
                validationResult.success 
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                  : 'bg-red-500/15 border-red-500 text-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {validationResult.success ? (
                    <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-base font-black">
                      {validationResult.success ? 'CUPOM VALIDADO COM SUCESSO! 🎉' : 'NÃO FOI POSSÍVEL VALIDAR'}
                    </h4>
                    <p className="text-xs mt-1 text-gray-300">
                      {validationResult.message}
                    </p>

                    {validationResult.success && validationResult.redemption && (
                      <div className="mt-4 pt-3 border-t border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400 block">Cliente VIP:</span>
                          <span className="font-bold text-white">{validationResult.redemption.userName}</span>
                          {validationResult.redemption.userCpf && (
                            <span className="text-[10px] text-gray-400 block font-mono">CPF: {validationResult.redemption.userCpf}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-400 block">Desconto a aplicar:</span>
                          <span className="font-black text-emerald-400 text-sm">
                            {validationResult.redemption.discountBadge}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Regra por CPF:</span>
                          <span className="text-amber-300 font-bold">
                            {validationResult.redemption.maxUsesPerUser === 1
                              ? '1 uso por CPF'
                              : validationResult.redemption.maxUsesPerUser > 1
                              ? `Até ${validationResult.redemption.maxUsesPerUser} por CPF`
                              : 'Ilimitado por CPF'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 bg-white/5 rounded-2xl p-4 text-xs text-gray-400 flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#FF5F00] flex-shrink-0" />
              <span>
                Cada cupom possui um código exclusivo de uso único gerado em tempo real. Uma vez validado, ele não poderá ser reaproveitado por outro cliente.
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#181824] border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Cupons Emitidos para este Lojista:</span>
              <span className="text-xs text-orange-400 font-normal">Clique para testar</span>
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {storeRedemptions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  Nenhum cupom resgatado ainda. Experimente trocar para o perfil "Assinante VIP" e resgatar uma oferta!
                </div>
              ) : (
                storeRedemptions.map((red) => (
                  <div
                    key={red.id}
                    onClick={() => {
                      setValidationInput(red.code);
                      setValidationResult(null);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      red.status === 'valid'
                        ? 'bg-[#12121A] border-white/10 hover:border-[#FF5F00]'
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-extrabold text-orange-400">
                        {red.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        red.status === 'valid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {red.status === 'valid' ? 'Aguardando Baixa' : 'Já Utilizado'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 font-semibold line-clamp-1">
                      {red.couponTitle}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                      <span>Cliente: {red.userName}</span>
                      <span className="font-bold text-emerald-400">{red.discountBadge}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ABA 2: LISTAGEM DE CUPONS DA LOJA COM BANNER E LOGO */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">
              Ofertas Ativas no Clube VIP
            </h2>
            <button
              onClick={() => setActiveTab('new-coupon')}
              className="bg-[#FF5F00] hover:bg-[#E04F00] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle size={15} />
              <span>Criar Nova Oferta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeCoupons.map((coupon) => (
              <div 
                key={coupon.id}
                className="bg-[#181824] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FF5F00]/50 transition-all group"
              >
                {/* Banner do Cupom no Card do Lojista */}
                <div className="relative h-36 w-full bg-black/60 overflow-hidden">
                  <img
                    src={coupon.banner || currentStore.image}
                    alt={coupon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181824] via-transparent to-black/30" />
                  
                  <span className="absolute top-2.5 left-2.5 bg-[#FF5F00] text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-md">
                    {coupon.discountBadge}
                  </span>

                  {/* Logo da Empresa no canto */}
                  <div className="absolute -bottom-2 left-3 w-10 h-10 rounded-xl bg-[#181824] border-2 border-[#FF5F00] overflow-hidden shadow-lg flex items-center justify-center">
                    {currentStore.logoImage ? (
                      <img src={currentStore.logoImage} alt={currentStore.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{currentStore.logo}</span>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-4">
                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {coupon.description}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1.5 py-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span>Validade: {coupon.expiresAt}</span>
                      <span className="text-orange-400 font-bold">{coupon.usesCount || 0} resgates</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-gray-400">Limite de uso:</span>
                      <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {coupon.maxUsesPerUser === 1
                          ? '1 uso por CPF'
                          : coupon.maxUsesPerUser > 1
                          ? `${coupon.maxUsesPerUser} por CPF`
                          : 'Ilimitado por CPF'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setActiveTab('validator')}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-xl text-xs text-center transition-colors"
                  >
                    Ver Validações no Balcão
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: CRIAR NOVO CUPOM COM UPLOAD DE BANNER */}
      {activeTab === 'new-coupon' && (
        <div className="max-w-3xl mx-auto bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Criar Nova Oferta com Banner e Logo</h2>
              <p className="text-xs text-gray-400">
                Faça o upload do banner que chamará a atenção dos clientes VIP e aparecerá no card do cupom.
              </p>
            </div>
          </div>

          {isLimitReached ? (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-2 border-amber-500/40 rounded-3xl p-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg">
                👑
              </div>
              <h3 className="text-xl font-black text-white">
                Limite de Ofertas Atingido ({currentPlan.maxCoupons} {currentPlan.maxCoupons === 1 ? 'oferta' : 'ofertas'} no {currentPlan.name})
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                Seu estabelecimento está atualmente no <strong>{currentPlan.name}</strong>, que permite até <strong>{currentPlan.maxCoupons} {currentPlan.maxCoupons === 1 ? 'oferta ativa' : 'ofertas ativas'}</strong> simultaneamente.
                <br /><br />
                Para cadastrar mais ofertas, ter <strong>cupons ilimitados</strong> e posicionar sua marca no <strong>topo absoluto das buscas com borda dourada</strong>, faça o upgrade de plano agora mesmo!
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className="bg-gradient-to-r from-amber-400 to-[#FF5F00] hover:from-amber-300 hover:to-orange-500 text-black font-black px-6 py-3 rounded-2xl text-sm shadow-xl shadow-orange-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Crown size={16} fill="currentColor" />
                  <span>Ver Planos & Fazer Upgrade</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all"
                >
                  Ver Cupons Já Cadastrados
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateCoupon} className="space-y-6">
            
            {/* 1. UPLOAD DO BANNER DA OFERTA */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                📸 1. Banner da Oferta (Aparece no topo do Card do Cupom):
              </label>

              {/* Pré-visualização do Banner */}
              <div className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden border-2 border-dashed border-[#FF5F00]/50 group bg-black/60">
                <img 
                  src={formData.banner} 
                  alt="Pré-visualização do banner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Tag de Desconto Simulada */}
                <div className="absolute top-3 left-3 bg-[#FF5F00] text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg">
                  {formData.discountBadge || '50% OFF'}
                </div>

                {/* Logo da Empresa no Banner Simulado */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#181822] border-2 border-[#FF5F00] overflow-hidden flex items-center justify-center shadow-lg">
                    {currentStore.logoImage ? (
                      <img src={currentStore.logoImage} alt={currentStore.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{currentStore.logo}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white drop-shadow-md">{currentStore.name}</span>
                </div>

                {/* Botão de Trocar Imagem sobre o Banner */}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all backdrop-blur-md"
                >
                  <Upload size={14} className="text-orange-400" />
                  <span>Fazer Upload do Seu Computador</span>
                </button>

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>

              {/* Presets Rápidos de Banner */}
              <div className="mt-3">
                <span className="text-[11px] text-gray-400 block mb-1.5">Ou escolha uma imagem de alta qualidade pronta:</span>
                <div className="flex flex-wrap gap-1.5">
                  {BANNER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, banner: preset.url })}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        formData.banner === preset.url
                          ? 'bg-[#FF5F00] text-white border-[#FF5F00] font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. TÍTULO E DESCRIÇÃO */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Título Chamativo da Oferta *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 50% OFF no 2º Burger Especial ou Sobremesa Grátis"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Descrição Detalhada do Benefício
              </label>
              <textarea
                rows={3}
                placeholder="Explique exatamente o que o cliente ganha e quais produtos participam..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            {/* 3. DESCONTOS E MODALIDADE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Tag de Destaque (Badge) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 50% OFF, 2x1, R$ 30 OFF"
                  value={formData.discountBadge}
                  onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Economia Média Estimada (R$)
                </label>
                <input
                  type="number"
                  min="5"
                  step="0.5"
                  value={formData.estimatedSavings}
                  onChange={(e) => setFormData({ ...formData, estimatedSavings: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Modalidade
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="physical">Loja Física (QR Code Balcão)</option>
                  <option value="online">Loja Online (Link e Cupom)</option>
                </select>
              </div>
            </div>

            {/* 4. LIMITE DE USO POR CPF */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <Users size={15} className="text-[#FF5F00]" />
                  <span>Limite de Resgates por CPF do Assinante *</span>
                </label>
                <p className="text-[11px] text-gray-400">
                  Defina quantas vezes cada cliente VIP pode resgatar e utilizar esta oferta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Opção 1: 1 uso por CPF */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, limitType: 'one' })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.limitType === 'one'
                      ? 'bg-[#FF5F00]/15 border-[#FF5F00] shadow-md shadow-orange-600/15 ring-1 ring-[#FF5F00]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-white">1 uso por CPF</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.limitType === 'one' ? 'border-[#FF5F00] bg-[#FF5F00]' : 'border-gray-500'
                    }`}>
                      {formData.limitType === 'one' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Máxima segurança anti-fraude: cada cliente só aproveita 1 única vez.
                  </p>
                </button>

                {/* Opção 2: Mais de 1 uso por CPF */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, limitType: 'custom' })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.limitType === 'custom'
                      ? 'bg-[#FF5F00]/15 border-[#FF5F00] shadow-md shadow-orange-600/15 ring-1 ring-[#FF5F00]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-white">Mais de 1 por CPF</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.limitType === 'custom' ? 'border-[#FF5F00] bg-[#FF5F00]' : 'border-gray-500'
                    }`}>
                      {formData.limitType === 'custom' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Defina uma quantidade fixa de resgates permitidos por cliente.
                  </p>
                </button>

                {/* Opção 3: Uso Ilimitado por CPF */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, limitType: 'unlimited' })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.limitType === 'unlimited'
                      ? 'bg-[#FF5F00]/15 border-[#FF5F00] shadow-md shadow-orange-600/15 ring-1 ring-[#FF5F00]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-white">Uso Ilimitado</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.limitType === 'unlimited' ? 'border-[#FF5F00] bg-[#FF5F00]' : 'border-gray-500'
                    }`}>
                      {formData.limitType === 'unlimited' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Sem limite: o cliente pode gerar cupons sempre que visitar.
                  </p>
                </button>
              </div>

              {/* Ajuste de quantidade se for personalizado */}
              {formData.limitType === 'custom' && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in">
                  <div className="text-xs text-gray-300 font-semibold">
                    Quantidade máxima de resgates permitida por CPF:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        customMaxUses: Math.max(2, (Number(prev.customMaxUses) || 2) - 1)
                      }))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center text-sm transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={formData.customMaxUses}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMaxUses: Math.max(2, parseInt(e.target.value) || 2)
                      })}
                      className="w-16 text-center bg-[#101017] border border-white/20 rounded-lg py-1 text-sm font-bold text-white focus:outline-none focus:border-[#FF5F00]"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        customMaxUses: (Number(prev.customMaxUses) || 2) + 1
                      }))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center text-sm transition-colors"
                    >
                      +
                    </button>
                    <span className="text-xs font-bold text-orange-400 ml-1">resgates por cliente</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Outras Regras e Condições (uma por linha)
              </label>
              <textarea
                rows={3}
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-xs font-mono text-gray-300 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>Publicar Cupom com Banner & Logo</span>
              </button>
            </div>
          </form>
          )}
        </div>
      )}

      {/* ABA 4: CONFIGURAÇÕES DO PERFIL DA LOJA */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          
          {/* Header das Configurações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
                <Settings size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Configurações e Perfil da Loja</h2>
                <p className="text-xs text-gray-400">
                  Gerencie como seu estabelecimento aparece no catálogo VIP, sua marca, foto de capa e contatos.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback de Sucesso */}
          {storeSavedSuccess && (
            <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 animate-fade-in shadow-lg">
              <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
              <span>Dados da loja e perfil atualizados com sucesso! As ofertas já refletem as novas informações.</span>
            </div>
          )}

          <form onSubmit={handleSaveStore} className="space-y-6">
            
            {/* 1. IDENTIDADE VISUAL (FOTO DE CAPA E LOGO) */}
            <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={18} className="text-[#FF5F00]" />
                <span>Identidade Visual do Estabelecimento</span>
              </h3>

              {/* Banner de Capa */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">
                  Foto de Capa / Fachada da Loja:
                </label>
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border-2 border-dashed border-white/20 group bg-black/60">
                  <img
                    src={storeForm.coverImage || currentStore.image}
                    alt={storeForm.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20 transition-all backdrop-blur-md"
                  >
                    <Upload size={14} className="text-[#FF5F00]" />
                    <span>Fazer Upload da Capa</span>
                  </button>

                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />

                  {/* Logo Sobreposta na Capa */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-14 h-14 rounded-2xl bg-[#181824] border-2 border-[#FF5F00] overflow-hidden flex items-center justify-center cursor-pointer shadow-xl relative group/logo"
                      title="Clique para alterar a logo"
                    >
                      {storeForm.logoImage ? (
                        <img src={storeForm.logoImage} alt={storeForm.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{currentStore.logo}</span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera size={16} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white drop-shadow-md">{storeForm.name}</h4>
                      <p className="text-xs text-orange-400 font-semibold drop-shadow-md flex items-center gap-1">
                        <MapPin size={11} />
                        <span>{storeForm.city}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão para Logo Separado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#101017] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#20202E] border border-white/10 overflow-hidden flex items-center justify-center">
                    {storeForm.logoImage ? (
                      <img src={storeForm.logoImage} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{currentStore.logo}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Logo da Empresa</div>
                    <div className="text-[11px] text-gray-400">Aparece nos cupons, diretório de lojas e comprovantes de validação.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Upload size={14} className="text-[#FF5F00]" />
                  <span>Substituir Logo</span>
                </button>
              </div>
            </div>

            {/* 2. DADOS CADASTRAIS DA LOJA */}
            <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 size={18} className="text-[#FF5F00]" />
                <span>Informações do Estabelecimento</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Nome Fantasia da Loja *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Categoria Principal *
                  </label>
                  <select
                    value={storeForm.category}
                    onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Cidade do Estabelecimento *
                  </label>
                  <select
                    value={storeForm.city}
                    onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades').map((city, idx) => (
                      <option key={idx} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Seg a Dom: 11h30 às 23h00"
                    value={storeForm.hours}
                    onChange={(e) => setStoreForm({ ...storeForm, hours: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Endereço Físico Completo *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alameda dos Anapurus, 1420 - Moema, São Paulo - SP"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Descrição e Bio da Empresa
                </label>
                <textarea
                  rows={3}
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  placeholder="Apresente sua história, diferenciais gastronômicos ou serviços especiais..."
                />
              </div>
            </div>

            {/* 3. CONTATOS E SEGURANÇA DO CAIXA */}
            <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Phone size={18} className="text-[#FF5F00]" />
                <span>Canais de Contato & Segurança do Balcão</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    WhatsApp Comercial / Fone
                  </label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Instagram Oficial
                  </label>
                  <input
                    type="text"
                    value={storeForm.instagram}
                    onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                    placeholder="@sualoja"
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    PIN do Caixa / Operador
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input
                      type="password"
                      maxLength={6}
                      value={storeForm.cashierPin}
                      onChange={(e) => setStoreForm({ ...storeForm, cashierPin: e.target.value })}
                      placeholder="Ex: 1234"
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Website Oficial / Cardápio Digital
                </label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    value={storeForm.website}
                    onChange={(e) => setStoreForm({ ...storeForm, website: e.target.value })}
                    placeholder="https://suaempresa.com.br"
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Voltar aos Cupons
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold px-8 py-3 rounded-xl text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <Check size={18} />
                <span>Salvar Configurações da Loja</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 5: PLANOS & ASSINATURA DE LOJISTA (DO FREE AO OURO) */}
      {activeTab === 'plans' && (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
          
          {/* Header da Aba */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 font-bold text-xs mb-3 shadow-sm">
              <Crown size={14} fill="currentColor" />
              <span>Quanto mais você investe, mais no topo suas ofertas aparecem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Planos de Assinatura para Estabelecimentos
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Escolha o nível de visibilidade da sua empresa. Lojas nos planos superiores aparecem no topo absoluto das pesquisas e recebem estilização dourada nos cupons.
            </p>
          </div>

          {/* Feedback de Sucesso de Upgrade */}
          {planUpgradeSuccess && (
            <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 p-4 px-6 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in shadow-xl">
              <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0" />
              <span>{planUpgradeSuccess}</span>
            </div>
          )}

          {/* Card de Status da Assinatura Atual */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                  currentPlan.id === 'gold' 
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-400' 
                    : currentPlan.id === 'silver'
                    ? 'bg-slate-400/20 border-2 border-slate-300 text-slate-200'
                    : currentPlan.id === 'bronze'
                    ? 'bg-amber-800/30 border-2 border-amber-600 text-amber-400'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                }`}>
                  {currentPlan.id === 'gold' ? '👑' : currentPlan.id === 'silver' ? '🥈' : currentPlan.id === 'bronze' ? '🥉' : '🆓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Assinatura Ativa
                    </span>
                    <span className="text-xs text-gray-400">Renovação mensal</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                    <span>{currentPlan.name}</span>
                    {currentPlan.id === 'gold' && (
                      <span className="text-xs bg-amber-400 text-black font-black px-2 py-0.5 rounded-md">TOPO</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Investimento: <strong className="text-white">{currentPlan.priceLabel}</strong>{currentPlan.period}
                  </p>
                </div>
              </div>

              {/* Estatísticas de Utilização da Cota */}
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto text-center sm:text-right">
                <div className="bg-[#101017] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Ofertas Ativas</span>
                  <span className="text-lg font-black text-white">
                    {storeCoupons.length} / {currentPlan.maxCoupons === 9999 ? '∞ Ilimitadas' : currentPlan.maxCoupons}
                  </span>
                </div>
                <div className="bg-[#101017] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Prioridade no Feed</span>
                  <span className={`text-lg font-black ${
                    currentPlan.id === 'gold' 
                      ? 'text-amber-400' 
                      : currentPlan.id === 'silver' 
                      ? 'text-slate-300' 
                      : currentPlan.id === 'bronze'
                      ? 'text-amber-500'
                      : 'text-gray-400'
                  }`}>
                    {currentPlan.id === 'gold' 
                      ? '⭐ 1º Lugar (Topo)' 
                      : currentPlan.id === 'silver' 
                      ? '✨ 2º Lugar (Alta)' 
                      : currentPlan.id === 'bronze'
                      ? '🥉 3º Lugar (Bronze)'
                      : 'Padrão'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Desconto com Saldo do Caixa da Loja (Divulgue & Ganhe) */}
          {(currentStore.referralBalance || 0) > 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-[#FF5F00]/10 to-[#181824] border-2 border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
                  🎁
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      Caixa de Indicações da Loja: R$ {(currentStore.referralBalance || 0).toFixed(2).replace('.', ',')}
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Disponível para Abater
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                    Sua loja acumulou bônus indicando usuários no <strong>Divulgue & Ganhe</strong>. Você pode abater esse saldo no investimento dos planos Bronze, Prata ou Ouro!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-2xl border border-white/10 flex-shrink-0">
                <span className="text-xs font-bold text-gray-300">Abater no valor do plano:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useStoreBalanceForUpgrade} 
                    onChange={(e) => setUseStoreBalanceForUpgrade(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* Grid dos 4 Planos (Free, Bronze, Prata, Ouro) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(merchantPlans || []).map((plan) => {
              const isCurrent = currentPlan.id === plan.id;
              const isGold = plan.id === 'gold';
              const isSilver = plan.id === 'silver';
              const isBronze = plan.id === 'bronze';

              const storeBalance = currentStore.referralBalance || 0;
              const canDiscount = useStoreBalanceForUpgrade && storeBalance > 0 && plan.price > 0 && !isCurrent;
              const storeDiscount = canDiscount ? Math.min(plan.price, storeBalance) : 0;
              const finalPlanPrice = Math.max(0, plan.price - storeDiscount);

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                    isGold
                      ? 'bg-gradient-to-b from-[#2A1D0E] via-[#1B1612] to-[#14141B] border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50 transform lg:-translate-y-2'
                      : isSilver
                      ? 'bg-gradient-to-b from-[#1C1E26] to-[#14141B] border-2 border-slate-300/60 shadow-xl'
                      : isBronze
                      ? 'bg-gradient-to-b from-[#251810] to-[#14141B] border-2 border-amber-700/60 shadow-lg'
                      : 'bg-[#181824] border border-white/10'
                  }`}
                >
                  {/* Tag Superior */}
                  {isGold && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                      <Crown size={12} fill="currentColor" />
                      <span>Máximo Destaque & Conversão</span>
                    </div>
                  )}

                  {isSilver && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-900 font-black text-[10px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Award size={12} />
                      <span>Recomendado Médio</span>
                    </div>
                  )}

                  {isBronze && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black text-[10px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap border border-amber-600/40">
                      <Medal size={12} />
                      <span>Custo-Benefício</span>
                    </div>
                  )}

                  <div>
                    {/* Cabeçalho do Card */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xl font-black text-white">
                          {plan.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Plano Atual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 min-h-[32px]">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Preço com ou sem desconto do Caixa */}
                    <div className="py-4 border-y border-white/10 my-4 space-y-1">
                      {storeDiscount > 0 ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-gray-400 line-through">De R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              - R$ {storeDiscount.toFixed(2).replace('.', ',')} do Caixa
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-black text-white font-display">
                              R$ {finalPlanPrice.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-xs text-gray-400">{plan.period}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-black text-white font-display">
                            {plan.priceLabel}
                          </span>
                          <span className="text-xs text-gray-400">{plan.period}</span>
                        </div>
                      )}
                    </div>

                    {/* Destaque do Limite de Ofertas */}
                    <div className="mb-5 p-3 rounded-2xl bg-black/30 border border-white/5">
                      <div className="text-[11px] text-gray-400">Limite de Ofertas Ativas:</div>
                      <div className={`text-base font-black ${
                        isGold ? 'text-amber-400' : isSilver ? 'text-slate-200' : isBronze ? 'text-amber-500' : 'text-white'
                      }`}>
                        {plan.maxCoupons === 9999 ? '🔥 ILIMITADAS simultâneas' : `Até ${plan.maxCoupons} ${plan.maxCoupons === 1 ? 'oferta ativa' : 'ofertas ativas'}`}
                      </div>
                    </div>

                    {/* Lista de Benefícios */}
                    <div className="space-y-2.5 mb-6 text-xs">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        O que está incluso:
                      </span>
                      {plan.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-200">
                          <CheckCircle2 size={15} className={`flex-shrink-0 mt-0.5 ${
                            isGold ? 'text-amber-400' : isSilver ? 'text-slate-300' : isBronze ? 'text-amber-500' : 'text-emerald-400'
                          }`} />
                          <span>{perk}</span>
                        </div>
                      ))}

                      {plan.missingPerks.map((miss, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-500 line-through">
                          <XCircle size={15} className="text-gray-600 flex-shrink-0 mt-0.5" />
                          <span>{miss}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div className="pt-4 border-t border-white/10">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full bg-white/10 text-gray-400 font-bold py-3 rounded-2xl text-xs text-center cursor-default border border-white/5"
                      >
                        ✓ Seu Plano Ativo
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          upgradeStoreTier(currentStore.id, plan.id, storeDiscount);
                          const discountMsg = storeDiscount > 0 
                            ? ` com abatimento de R$ ${storeDiscount.toFixed(2).replace('.', ',')} do seu Caixa de Indicações!` 
                            : '!';
                          setPlanUpgradeSuccess(`🎉 Parabéns! Sua loja agora é "${plan.name}"${discountMsg} A visibilidade dos seus cupons foi atualizada imediatamente no catálogo.`);
                          setTimeout(() => setPlanUpgradeSuccess(''), 6000);
                        }}
                        className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                          isGold
                            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-amber-950/60 transform hover:scale-[1.02]'
                            : isSilver
                            ? 'bg-slate-200 hover:bg-white text-slate-900 shadow-md'
                            : isBronze
                            ? 'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-950/40'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isGold ? (
                          <>
                            <Crown size={15} fill="currentColor" />
                            <span>
                              {storeDiscount > 0 
                                ? `Contratar por R$ ${finalPlanPrice.toFixed(2).replace('.', ',')}` 
                                : 'Contratar Plano Ouro (Topo)'}
                            </span>
                          </>
                        ) : isSilver ? (
                          <>
                            <Award size={15} />
                            <span>
                              {storeDiscount > 0 
                                ? `Upgrade por R$ ${finalPlanPrice.toFixed(2).replace('.', ',')}` 
                                : 'Fazer Upgrade para Prata'}
                            </span>
                          </>
                        ) : isBronze ? (
                          <>
                            <Medal size={15} />
                            <span>
                              {storeDiscount > 0 
                                ? `Upgrade por R$ ${finalPlanPrice.toFixed(2).replace('.', ',')}` 
                                : 'Fazer Upgrade para Bronze'}
                            </span>
                          </>
                        ) : (
                          <span>Mudar para Plano Grátis</span>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Demonstração Visual: Como o seu cupom aparece */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 mt-10">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>Demonstração de Impacto Visual nos Cupons</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Compare visualmente como as ofertas da sua loja se destacam na tela dos milhares de assinantes VIP de acordo com o plano contratado:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Preview Grátis */}
              <div className="bg-[#13131A] rounded-2xl p-4 border border-white/5 space-y-3 opacity-75">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400">Card no Plano Grátis:</span>
                  <span className="text-[10px] text-gray-500">Normal</span>
                </div>
                <div className="relative h-28 rounded-xl overflow-hidden bg-black/60">
                  <img src={currentStore.image} alt="Exemplo" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">30% OFF</span>
                  <div className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white/70">
                    <Heart size={12} />
                  </div>
                </div>
                <div className="text-xs font-bold text-white">{currentStore.name}</div>
                <p className="text-[11px] text-gray-400">Listagem comum sem medalha, abaixo das lojas pagantes.</p>
              </div>

              {/* Preview Bronze */}
              <div className="bg-[#13131A] rounded-2xl p-4 border border-amber-700/60 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <Medal size={12} />
                    <span>Card no Plano Bronze:</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">3º Nível</span>
                </div>
                <div className="relative h-28 rounded-xl overflow-hidden bg-black/60">
                  <img src={currentStore.image} alt="Exemplo" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">30% OFF</span>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <div className="p-1 rounded-lg bg-black/60 border border-amber-700/60 text-amber-500 shadow-sm" title="Bronze">
                      <Medal size={12} />
                    </div>
                    <div className="p-1 rounded-lg bg-black/60 text-white/70">
                      <Heart size={12} />
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Medal size={11} className="text-amber-500" />
                  <span>{currentStore.name}</span>
                </div>
                <p className="text-[11px] text-gray-300">Borda bronze, medalha na cor bronze ao lado do coração e 3 cupons.</p>
              </div>

              {/* Preview Prata */}
              <div className="bg-[#13131A] rounded-2xl p-4 border border-slate-300/40 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Award size={12} />
                    <span>Card no Plano Prata:</span>
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold">2º Nível</span>
                </div>
                <div className="relative h-28 rounded-xl overflow-hidden bg-black/60">
                  <img src={currentStore.image} alt="Exemplo" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">30% OFF</span>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <div className="p-1 rounded-lg bg-black/60 border border-slate-300/50 text-slate-300 shadow-sm" title="Prata">
                      <Medal size={12} />
                    </div>
                    <div className="p-1 rounded-lg bg-black/60 text-white/70">
                      <Heart size={12} />
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">{currentStore.name}</div>
                <p className="text-[11px] text-gray-300">Borda prateada, medalha prata ao lado do coração e 5 ofertas.</p>
              </div>

              {/* Preview Ouro */}
              <div className="bg-gradient-to-b from-[#251A0E] to-[#13131A] rounded-2xl p-4 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Crown size={12} fill="currentColor" />
                    <span>Card no Plano Ouro:</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-black">⭐ Topo Absoluto</span>
                </div>
                <div className="relative h-28 rounded-xl overflow-hidden bg-black/60">
                  <img src={currentStore.image} alt="Exemplo" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">30% OFF</span>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <div className="p-1 rounded-lg bg-black/60 border border-amber-400/60 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]" title="Ouro">
                      <Medal size={12} />
                    </div>
                    <div className="p-1 rounded-lg bg-black/60 text-white/70">
                      <Heart size={12} />
                    </div>
                  </div>
                </div>
                <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Crown size={11} fill="currentColor" />
                  <span>{currentStore.name}</span>
                </div>
                <p className="text-[11px] text-amber-200/80 font-medium">Borda dourada, medalha de ouro com glow ao lado do coração e topo do feed.</p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ABA 6: PROGRAMA DIVULGUE & GANHE DA LOJA */}
      {activeTab === 'referrals' && (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
          {/* Header da Aba */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 font-bold text-xs mb-3 shadow-sm">
              <Gift size={14} />
              <span>Divulgue & Ganhe Exclusivo para Estabelecimentos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Transforme seus Clientes em Bônus para o Caixa da Loja
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Cada cliente que se cadastrar na plataforma usando o link exclusivo do <strong>{currentStore.name}</strong> gera <strong>R$ 5,00 direto no Caixa da sua Loja</strong> para abater ou pagar seus planos de destaque!
            </p>
          </div>

          {/* Toast de Bônus Simulado */}
          {merchantJustEarned && (
            <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 p-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-between animate-fade-in shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <span>Indicação simulada com sucesso! Cliente <strong>+{merchantJustEarned.name}</strong> cadastrou-se pelo link da sua loja e gerou <strong>+R$ 5,00</strong> no Caixa!</span>
              </div>
              <span className="text-emerald-400 text-base font-black">+R$ 5,00</span>
            </div>
          )}

          {/* Card de Saldo no Caixa da Loja */}
          <div className="bg-gradient-to-r from-[#201A15] via-[#1A1820] to-[#161622] rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Coins size={16} />
                  <span>Caixa de Indicações do Estabelecimento</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-display">
                    R$ {(currentStore.referralBalance || 0).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Disponível para Abater em Planos
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-2 max-w-lg">
                  Use esse saldo acumulado para abater mensalidades dos planos <strong>Bronze (R$ 39,90)</strong>, <strong>Prata (R$ 79,90)</strong> ou <strong>Ouro (R$ 199,90)</strong> e garantir o topo das buscas!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const res = addReferral('merchant');
                    setMerchantJustEarned(res);
                    setTimeout(() => setMerchantJustEarned(null), 4000);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all"
                >
                  <Zap size={16} />
                  <span>Simular Indicação (+R$ 5,00)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className="bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-black font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
                >
                  <Crown size={16} fill="currentColor" />
                  <span>Abater em Planos de Destaque</span>
                </button>
              </div>
            </div>
          </div>

          {/* Link e QR Code de Divulgação da Loja */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Link e Botões de Compartilhamento */}
            <div className="md:col-span-8 bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 size={18} className="text-[#FF5F00]" />
                  <span>Link Exclusivo de Divulgação da Loja</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Divulgue em redes sociais, stories do Instagram, na bio ou envie diretamente para sua lista de clientes no WhatsApp:
                </p>
              </div>

              <div className="bg-[#101017] border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-amber-300 font-mono">
                <span className="text-gray-500 select-none">https://</span>
                <span className="text-white font-bold truncate">
                  melhorcupom.com.br/convite/{currentStore.referralCode || 'SMASH5'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://melhorcupom.com.br/convite/${currentStore.referralCode || 'SMASH5'}`);
                    setCopiedStoreLink(true);
                    setTimeout(() => setCopiedStoreLink(false), 2500);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    copiedStoreLink
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {copiedStoreLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedStoreLink ? 'Link Copiado!' : 'Copiar Link da Loja'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Conheça o Clube VIP Melhor Cupom com descontos de 30% a 50% no ${currentStore.name} e dezenas de lojas! Cadastre-se pelo nosso convite: https://melhorcupom.com.br/convite/${currentStore.referralCode || 'SMASH5'}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Share2 size={16} />
                  <span>Compartilhar no WhatsApp dos Clientes</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Dica de Ouro para Lojistas:</span>
                </div>
                <p>
                  Imprima o QR Code ao lado e coloque nos displays de mesa e balcão com o texto: 
                  <em> "Escaneie aqui e ganhe descontos VIP nesta e em dezenas de lojas!"</em>. 
                  Com 40 clientes cadastrados, você ganha <strong>R$ 200,00</strong> no caixa — o suficiente para pagar integralmente o <strong>Plano Ouro VIP (R$ 199,90)</strong> e ficar no topo de tudo!
                </p>
              </div>
            </div>

            {/* QR Code para Imprimir no Balcão */}
            <div className="md:col-span-4 bg-[#181824] border border-white/10 rounded-3xl p-6 text-center flex flex-col items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">QR Code de Balcão / Mesa</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Escaneie para se cadastrar</div>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-xl my-4">
                <QRCodeSVG 
                  value={`https://melhorcupom.com.br/convite/${currentStore.referralCode || 'SMASH5'}`}
                  size={140}
                />
              </div>

              <div className="text-[11px] text-amber-300 font-mono font-bold mb-2">
                Código: {currentStore.referralCode || 'SMASH5'}
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs transition-all"
              >
                Imprimir QR Code
              </button>
            </div>

          </div>

          {/* Histórico de Indicações da Loja */}
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                <span>Clientes Cadastrados com o Link da Loja ({(currentStore.referrals || []).length})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-bold">
                Total Acumulado: R$ {(((currentStore.referrals || []).length) * 5).toFixed(2).replace('.', ',')}
              </span>
            </div>

            {(currentStore.referrals || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                Nenhum cliente cadastrado via link da loja ainda. Divulgue no balcão e WhatsApp para começar a faturar bônus!
              </div>
            ) : (
              <div className="space-y-2.5">
                {(currentStore.referrals || []).map((ref) => (
                  <div 
                    key={ref.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#101017] border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-white">{ref.name}</div>
                        <div className="text-[10px] text-gray-400">{ref.date} • Cadastro Concluído via Link da Loja</div>
                      </div>
                    </div>

                    <span className="font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      +R$ {ref.bonus.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
