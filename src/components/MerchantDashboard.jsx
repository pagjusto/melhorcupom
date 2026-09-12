import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockData';
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
  Lock
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
    switchRole 
  } = useApp();

  // Identificar loja correspondente ao role
  const merchantId = currentRole.startsWith('merchant_') ? currentRole : 'merchant_burger';
  const currentStore = stores.find(s => s.merchantId === merchantId) || stores[0];

  // Cupons desta loja
  const storeCoupons = coupons.filter(c => c.merchantId === currentStore.merchantId);
  const storeRedemptions = redemptions.filter(r => r.merchantId === currentStore.merchantId);

  // Tabs internas do Painel
  const [activeTab, setActiveTab] = useState(prefilledCode ? 'validator' : 'coupons'); // 'coupons' | 'validator' | 'new-coupon' | 'settings'
  
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

    const rulesArray = formData.rules.split('\n').filter(r => r.trim().length > 0);

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
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#FF5F00] bg-[#FF5F00]/15 px-2.5 py-0.5 rounded-full border border-[#FF5F00]/30">
                  Lojista Parceiro Oficial
                </span>
                <span className="text-xs text-gray-400">ID: {currentStore.merchantId}</span>
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
                      <div className="mt-4 pt-3 border-t border-emerald-500/30 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 block">Cliente VIP:</span>
                          <span className="font-bold text-white">{validationResult.redemption.userName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Desconto a aplicar:</span>
                          <span className="font-black text-emerald-400 text-sm">
                            {validationResult.redemption.discountBadge}
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

                  <div className="text-xs text-gray-500 space-y-1 py-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span>Validade: {coupon.expiresAt}</span>
                      <span className="text-orange-400 font-bold">{coupon.usesCount || 0} resgates</span>
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

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Regras e Condições (uma por linha)
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

    </div>
  );
};
