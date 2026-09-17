import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryPills } from './components/CategoryPills';
import { CouponCard } from './components/CouponCard';
import { CouponDetailModal } from './components/CouponDetailModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MerchantDashboard } from './components/MerchantDashboard';
import { MyCouponsView } from './components/MyCouponsView';
import { StoresView } from './components/StoresView';
import { HowItWorksView } from './components/HowItWorksView';
import { UserProfileSettings } from './components/UserProfileSettings';
import { ReferralBanner } from './components/ReferralBanner';
import { ReferralModal } from './components/ReferralModal';
import { AuthModal } from './components/AuthModal';
import { SavingsModal } from './components/SavingsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BigStoresShowcase } from './components/BigStoresShowcase';
import { BigStoreFreeRegisterModal } from './components/BigStoreFreeRegisterModal';
import logoMelhorCupom from './assets/logo-melhor-cupom.png';
import { Sparkles, ArrowRight, ShieldCheck, Shield, Heart, ExternalLink, QrCode, MapPin, Crown, Award, Medal } from 'lucide-react';

const MainLayout = () => {
  const { 
    coupons, 
    stores, 
    currentRole, 
    userProfile,
    isVipUser, 
    switchRole,
    isSimulatingRole,
    exitSimulation,
    setIsSubscriptionModalOpen,
    recordCouponView,
    activeTab,
    setActiveTab,
    setMerchantDashboardTab
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'physical' | 'online'
  const [highDiscountOnly, setHighDiscountOnly] = useState(false);
  const [bigStoreFreeRegisterCoupon, setBigStoreFreeRegisterCoupon] = useState(null);
  
  // Estado do Buscador de Cidade
  const [selectedCity, setSelectedCity] = useState('Todas as Cidades');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState(null);
  
  // Modal de Detalhes / Resgate
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [prefilledValidatorCode, setPrefilledValidatorCode] = useState('');

  // Filtrar Cupons por Cidade, Categoria e Tipo
  const filteredCoupons = coupons.filter(coupon => {
    const store = stores.find(s => s.id === coupon.storeId);
    const couponCity = (coupon.city || store?.city || '').toLowerCase();
    const isOnline = coupon.type === 'online' || couponCity.includes('online');

    // REGRA DE OURO: Não misturar cupons das grandes lojas com os cupons comuns
    // Cupons de APIs/Grandes redes ficam exclusivamente na vitrine horizontal superior!
    const isBigStoreCoupon = coupon.isApiIntegrated || coupon.apiSource || store?.isApiIntegrated;
    if (isBigStoreCoupon && !selectedStoreFilter) {
      return false;
    }

    // Filtro por Loja específica (selecionada na aba Lojas Parceiras)
    if (selectedStoreFilter && coupon.storeId !== selectedStoreFilter.id) {
      return false;
    }

    // 1. Filtro pela Cidade Selecionada
    if (selectedCity && selectedCity !== 'Todas as Cidades') {
      const cityTarget = selectedCity.toLowerCase();
      const matchesCity = couponCity.includes(cityTarget) || 
                          (store && store.city && store.city.toLowerCase().includes(cityTarget)) ||
                          (store && Array.isArray(store.cities) && store.cities.some(c => c.toLowerCase().includes(cityTarget))) ||
                          (Array.isArray(coupon.cities) && coupon.cities.some(c => c.toLowerCase().includes(cityTarget)));
      
      // Cupons online são válidos em todo o Brasil
      if (!matchesCity && !isOnline) {
        return false;
      }
    }

    // 2. Busca por texto da Cidade
    if (citySearchQuery.trim()) {
      const q = citySearchQuery.toLowerCase();
      const matchesSearch = couponCity.includes(q) || 
                            (store && store.city && store.city.toLowerCase().includes(q)) ||
                            (store && Array.isArray(store.cities) && store.cities.some(c => c.toLowerCase().includes(q))) ||
                            (Array.isArray(coupon.cities) && coupon.cities.some(c => c.toLowerCase().includes(q))) ||
                            (store && store.address && store.address.toLowerCase().includes(q));
      
      if (!matchesSearch && !isOnline) {
        return false;
      }
    }

    // 3. Categoria
    if (selectedCategory !== 'all' && coupon.category !== selectedCategory) {
      return false;
    }

    // 4. Tipo (físico ou online)
    if (typeFilter !== 'all' && coupon.type !== typeFilter) {
      return false;
    }

    // 5. Apenas super descontos (40% ou mais)
    if (highDiscountOnly) {
      const isHigh = coupon.discountBadge.includes('40%') || 
                     coupon.discountBadge.includes('50%') || 
                     coupon.discountBadge.includes('2x1') ||
                     (coupon.estimatedSavings >= 40);
      if (!isHigh) return false;
    }

    return true;
  }).sort((a, b) => {
    // ALGORITMO DE DESTAQUE POR ASSINATURA:
    // Quanto mais o lojista paga (Ouro=4, Prata=3, Bronze=2, Free=1), mais no topo fica seu cupom!
    const storeA = stores.find(s => s.id === a.storeId);
    const storeB = stores.find(s => s.id === b.storeId);

    const TIER_WEIGHTS = { gold: 4, silver: 3, bronze: 2, free: 1 };
    const weightA = TIER_WEIGHTS[storeA?.tier || 'free'] || 1;
    const weightB = TIER_WEIGHTS[storeB?.tier || 'free'] || 1;

    if (weightB !== weightA) {
      return weightB - weightA; // Maior peso primeiro
    }

    // Critério secundário: maior quantidade de resgates
    return (b.usesCount || 0) - (a.usesCount || 0);
  });

  const handleTestValidateAtMerchant = (code, merchantId) => {
    setPrefilledValidatorCode(code);
    switchRole(merchantId || 'merchant_burger');
    if (setMerchantDashboardTab) {
      setMerchantDashboardTab('validator');
    }
    setActiveTab('merchant-dashboard');
  };

  const handleSelectStoreFromDirectory = (store) => {
    if (store.city) {
      setSelectedCity(store.city);
    }
    setSelectedStoreFilter(store);
    setActiveTab('explore');
  };

  const handleSelectBigStoreCoupon = (coupon) => {
    if (recordCouponView) {
      recordCouponView(coupon.id);
    }
    // Ao clicar em oferta de grandes lojas, sugere cadastro gratuito para visitantes
    if (currentRole === 'visitor' && !userProfile?.isRegistered) {
      setBigStoreFreeRegisterCoupon(coupon);
    } else {
      setSelectedCoupon(coupon);
    }
  };

  const getSimulatedRoleLabel = (role) => {
    if (role === 'visitor') return 'Visitante (Público Não-Logado)';
    if (role === 'user_free' || role === 'user') return 'Usuário Cadastrado (Sem VIP)';
    if (role === 'vip') return 'Assinante VIP (Membro Fidelidade)';
    if (role.startsWith('merchant_')) {
      const st = stores.find(s => s.merchantId === role || s.id === role);
      return `Lojista Parceiro (${st?.name || 'Comércio'})`;
    }
    return role;
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-gray-100 flex flex-col justify-between selection:bg-[#FF5F00] selection:text-white">
      
      {/* 1. Barra Superior de Modo Simulação (Visível APENAS quando o Administrador Master estiver testando outro perfil) */}
      {isSimulatingRole && currentRole !== 'admin' && (
        <div className="bg-gradient-to-r from-[#0B132B] via-[#101D3F] to-[#0B132B] border-b border-blue-500/40 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping flex-shrink-0" />
            <span className="font-black text-blue-300 tracking-wide uppercase text-[10px] bg-blue-500/20 px-2.5 py-0.5 rounded-md border border-blue-400/30">
              Modo Simulação ADM
            </span>
            <span className="text-gray-300 text-xs">
              Testando a plataforma como: <strong className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{getSimulatedRoleLabel(currentRole)}</strong>
            </span>
          </div>

          <button
            onClick={exitSimulation}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform hover:scale-105"
            title="Sair do modo de teste e retornar ao Painel de Administração Master"
          >
            <Shield size={14} />
            <span>Voltar ao Painel ADM Master</span>
          </button>
        </div>
      )}

      {/* 2. Barra de Navegação Principal com Seletor de Cidade */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* 3. Conteúdo Principal baseado na Aba Ativa */}
      <main className="flex-grow">
        
        {/* ABA: EXPLORAR CUPONS */}
        {activeTab === 'explore' && (
          <div>
            <HeroBanner 
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              citySearchQuery={citySearchQuery}
              setCitySearchQuery={setCitySearchQuery}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              
              {/* BANNER EM DESTAQUE: DIVULGUE & GANHE */}
              <ReferralBanner />

              {/* VITRINE DE GRANDES LOJAS & E-COMMERCES INTEGRADOS VIA API (CARROSSEL HORIZONTAL) */}
              <BigStoresShowcase 
                onSelectCoupon={handleSelectBigStoreCoupon} 
                onSelectStore={handleSelectStoreFromDirectory} 
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white font-display flex flex-wrap items-center gap-2">
                    <span>Cupons de Estabelecimentos Credenciados</span>
                    {selectedCity && selectedCity !== 'Todas as Cidades' ? (
                      <span className="text-xs bg-[#FF5F00] text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <MapPin size={12} />
                        <span>{selectedCity}</span>
                      </span>
                    ) : (
                      <span className="text-xs bg-white/10 text-gray-300 font-bold px-3 py-1 rounded-full border border-white/10">
                        Todas as Cidades
                      </span>
                    )}
                    <span className="text-xs bg-[#FF5F00]/20 text-[#FF5F00] font-bold px-2.5 py-1 rounded-full border border-[#FF5F00]/30">
                      {filteredCoupons.length} ofertas locais
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedCity !== 'Todas as Cidades'
                      ? `Exibindo ofertas de estabelecimentos credenciados em ${selectedCity}.`
                      : 'Exibindo ofertas exclusivas de comércios locais parceiros em todo o Brasil.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedCity !== 'Todas as Cidades' && (
                    <button
                      onClick={() => {
                        setSelectedCity('Todas as Cidades');
                        setCitySearchQuery('');
                      }}
                      className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                    >
                      Ver Todas as Cidades
                    </button>
                  )}
                  {!isVipUser && (
                    <button
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20 transition-colors"
                    >
                      <span>Desbloquear tudo por R$ 19,90</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtros de Categoria e Modalidade */}
              <CategoryPills
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                highDiscountOnly={highDiscountOnly}
                setHighDiscountOnly={setHighDiscountOnly}
              />

              {/* Indicador de Prioridade por Assinatura do Lojista */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#151520] border border-white/10 rounded-2xl p-3 px-4 mb-6 text-xs text-gray-400 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                    <Crown size={12} fill="currentColor" />
                    <span>Lojas Ouro</span>
                  </span>
                  <span className="text-gray-500">&gt;</span>
                  <span className="inline-flex items-center gap-1 text-slate-300 font-bold bg-slate-400/15 border border-slate-400/30 px-2 py-0.5 rounded-lg text-[11px]">
                    <Award size={12} />
                    <span>Lojas Prata</span>
                  </span>
                  <span className="text-gray-500">&gt;</span>
                  <span className="inline-flex items-center gap-1 text-[#CD7F32] font-bold bg-[#CD7F32]/15 border border-[#CD7F32]/35 px-2 py-0.5 rounded-lg text-[11px]">
                    <Medal size={12} />
                    <span>Lojas Bronze</span>
                  </span>
                  <span className="text-gray-500">&gt;</span>
                  <span className="text-gray-400 text-[11px]">Lojas Gratuitas</span>
                  <span className="hidden md:inline text-gray-500">•</span>
                  <span className="hidden md:inline text-gray-400 text-[11px]">Quanto maior o plano contratado pelo parceiro, mais no topo suas ofertas aparecem!</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>Ordenação:</span>
                  <span className="text-[#FF5F00] font-bold">Prioridade de Destaque</span>
                </div>
              </div>

              {/* Filtro Ativo de Loja Parceira */}
              {selectedStoreFilter && (
                <div className="bg-gradient-to-r from-[#FF5F00]/15 to-transparent border border-[#FF5F00]/40 rounded-2xl p-3 px-4 mb-6 flex items-center justify-between animate-fade-in shadow-md">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Exibindo ofertas exclusivas da loja:</span>
                    <strong className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>{selectedStoreFilter.logoImage ? '🏪' : selectedStoreFilter.logo}</span>
                      <span>{selectedStoreFilter.name}</span>
                    </strong>
                  </div>
                  <button
                    onClick={() => setSelectedStoreFilter(null)}
                    className="text-xs text-orange-400 hover:text-white font-bold bg-[#FF5F00]/20 hover:bg-[#FF5F00] px-3 py-1 rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>Limpar filtro de loja</span>
                    <span>✕</span>
                  </button>
                </div>
              )}

              {/* Grid de Cupons no formato de Ticket */}
              {filteredCoupons.length === 0 ? (
                <div className="bg-[#171722] border border-white/10 rounded-3xl p-16 text-center max-w-lg mx-auto">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold text-white mb-2">Nenhum cupom encontrado</h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Tente buscar por outro termo ou remova os filtros ativos para ver mais opções.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setTypeFilter('all');
                      setHighDiscountOnly(false);
                      setSelectedCity('Todas as Cidades');
                      setCitySearchQuery('');
                    }}
                    className="bg-[#FF5F00] text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                  >
                    Limpar Todos os Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCoupons.map((coupon) => {
                    const store = stores.find(s => s.id === coupon.storeId);
                    return (
                      <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        store={store}
                        onSelectCoupon={(c) => setSelectedCoupon(c)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Banner CTA intermediário */}
              {!isVipUser && (
                <div className="mt-16 bg-gradient-to-r from-[#2A150A] via-[#1E120A] to-[#171722] border-2 border-[#FF5F00]/50 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                    <span className="bg-[#FF5F00] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                      Economize centenas de reais todo mês
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
                      Pronto para começar a economizar?
                    </h3>
                    <p className="text-sm text-gray-300">
                      Assine o Melhor Cupom por apenas R$ 19,90/mês e tenha acesso imediato a todos os cupons no balcão e online.
                    </p>
                    <button
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-600/40 text-sm transition-all hover:scale-105"
                    >
                      <span>Quero Assinar o VIP Agora</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ABA: LOJAS PARCEIRAS */}
        {activeTab === 'stores' && (
          <StoresView onSelectStore={handleSelectStoreFromDirectory} />
        )}

        {/* ABA: COMO FUNCIONA */}
        {activeTab === 'how-it-works' && (
          <HowItWorksView />
        )}

        {/* ABA: PAINEL DO LOJISTA */}
        {activeTab === 'merchant-dashboard' && (
          <MerchantDashboard prefilledCode={prefilledValidatorCode} />
        )}

        {/* ABA: MEUS CUPONS */}
        {activeTab === 'my-coupons' && (
          <MyCouponsView onSelectCoupon={(c) => setSelectedCoupon(c)} />
        )}

        {/* ABA: CONFIGURAÇÕES DE PERFIL DO ASSINANTE */}
        {activeTab === 'user-profile' && (
          <UserProfileSettings />
        )}

        {/* ABA: PAINEL DE ADMINISTRAÇÃO MASTER */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}

      </main>

      {/* 4. Rodapé Moderno & Completo */}
      <footer className="bg-[#111117] border-t border-white/10 pt-12 pb-8 mt-16 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <img 
                src={logoMelhorCupom} 
                alt="Melhor Cupom" 
                className="h-12 w-auto object-contain"
              />
              <p className="text-gray-400 leading-relaxed text-xs">
                O clube exclusivo onde os melhores lojistas disponibilizam descontos reais para membros pagantes. Economia garantida em cada uso.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Navegação</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('explore')} className="hover:text-white">Cupons & Ofertas</button></li>
                <li><button onClick={() => setActiveTab('stores')} className="hover:text-white">Lojas Parceiras</button></li>
                <li><button onClick={() => setActiveTab('how-it-works')} className="hover:text-white">Como Funciona</button></li>
                <li><button onClick={() => setIsSubscriptionModalOpen(true)} className="hover:text-orange-400">Planos de Assinatura</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Para Lojistas</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      switchRole('merchant_burger');
                      if (setMerchantDashboardTab) setMerchantDashboardTab('new-coupon');
                      setActiveTab('merchant-dashboard');
                    }} 
                    className="hover:text-orange-400"
                  >
                    Cadastrar Nova Oferta
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      switchRole('merchant_burger');
                      if (setMerchantDashboardTab) setMerchantDashboardTab('validator');
                      setActiveTab('merchant-dashboard');
                    }} 
                    className="hover:text-orange-400"
                  >
                    Validador de Balcão (PDV)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      switchRole('merchant_burger');
                      if (setMerchantDashboardTab) setMerchantDashboardTab('settings');
                      setActiveTab('merchant-dashboard');
                    }} 
                    className="hover:text-orange-400"
                  >
                    Perfil da Loja & Configurações
                  </button>
                </li>
                <li><a href="#parceria" className="hover:text-white">Seja um Estabelecimento Parceiro</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Segurança & Suporte</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck size={16} />
                  <span>Plataforma 100% Segura</span>
                </div>
                <p className="text-gray-500">
                  Pagamentos criptografados via PIX e Cartão de Crédito. Garantia incondicional de satisfação de 7 dias.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-[11px]">
            <div>
              © 2026 Melhor Cupom Serviços e Tecnologia Ltda. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  switchRole('admin');
                  setActiveTab('admin-dashboard');
                }}
                className="hover:text-blue-400 text-gray-500 transition-colors flex items-center gap-1 font-medium"
              >
                <span>🛡️ Painel ADM</span>
              </button>
              <span>•</span>
              <span>Termos de Uso</span>
              <span>•</span>
              <span>Política de Privacidade</span>
              <span>•</span>
              <span className="text-[#FF5F00] font-semibold">Feito com base na logo oficial</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Modais Globais */}
      {bigStoreFreeRegisterCoupon && (
        <BigStoreFreeRegisterModal
          coupon={bigStoreFreeRegisterCoupon}
          store={stores.find(s => s.id === bigStoreFreeRegisterCoupon.storeId)}
          onClose={() => setBigStoreFreeRegisterCoupon(null)}
          onProceedToCoupon={(c) => {
            const targetCoupon = c || bigStoreFreeRegisterCoupon;
            setBigStoreFreeRegisterCoupon(null);
            setSelectedCoupon(targetCoupon);
          }}
        />
      )}

      {selectedCoupon && (
        <CouponDetailModal
          coupon={selectedCoupon}
          store={stores.find(s => s.id === selectedCoupon.storeId)}
          onClose={() => setSelectedCoupon(null)}
          onTestValidateAtMerchant={handleTestValidateAtMerchant}
        />
      )}

      <SubscriptionModal />
      <ReferralModal />
      <AuthModal />
      <SavingsModal onSelectCoupon={(coupon) => setSelectedCoupon(coupon)} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
