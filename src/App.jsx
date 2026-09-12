import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/RoleSwitcher';
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
import { Sparkles, ArrowRight, ShieldCheck, Heart, ExternalLink, QrCode, MapPin, Crown, Award } from 'lucide-react';

const MainLayout = () => {
  const { 
    coupons, 
    stores, 
    currentRole, 
    isVipUser, 
    switchRole,
    setIsSubscriptionModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'stores' | 'how-it-works' | 'merchant-dashboard' | 'my-coupons'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'physical' | 'online'
  const [highDiscountOnly, setHighDiscountOnly] = useState(false);
  
  // Estado do Buscador de Cidade
  const [selectedCity, setSelectedCity] = useState('Todas as Cidades');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  
  // Modal de Detalhes / Resgate
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [prefilledValidatorCode, setPrefilledValidatorCode] = useState('');

  // Filtrar Cupons por Cidade, Categoria e Tipo
  const filteredCoupons = coupons.filter(coupon => {
    const store = stores.find(s => s.id === coupon.storeId);
    const couponCity = (coupon.city || store?.city || '').toLowerCase();
    const isOnline = coupon.type === 'online' || couponCity.includes('online');

    // 1. Filtro pela Cidade Selecionada
    if (selectedCity && selectedCity !== 'Todas as Cidades') {
      const cityTarget = selectedCity.toLowerCase();
      const matchesCity = couponCity.includes(cityTarget) || 
                          (store && store.city && store.city.toLowerCase().includes(cityTarget));
      
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
    // Quanto mais o lojista paga (Ouro=3, Prata=2, Free=1), mais no topo fica seu cupom!
    const storeA = stores.find(s => s.id === a.storeId);
    const storeB = stores.find(s => s.id === b.storeId);

    const TIER_WEIGHTS = { gold: 3, silver: 2, free: 1 };
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
    setActiveTab('merchant-dashboard');
  };

  const handleSelectStoreFromDirectory = (store) => {
    if (store.city) {
      setSelectedCity(store.city);
    }
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-gray-100 flex flex-col justify-between selection:bg-[#FF5F00] selection:text-white">
      
      {/* 1. Barra de Troca Rápida de Papéis (Simulador) */}
      <RoleSwitcher />

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white font-display flex flex-wrap items-center gap-2">
                    <span>Cupons VIP Disponíveis</span>
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
                      {filteredCoupons.length} ofertas
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedCity !== 'Todas as Cidades'
                      ? `Exibindo ofertas em ${selectedCity} e promoções nacionais online.`
                      : 'Exibindo ofertas de todas as regiões credenciadas e lojas online.'}
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
                  <span className="text-gray-400 text-[11px]">Lojas Gratuitas</span>
                  <span className="hidden md:inline text-gray-500">•</span>
                  <span className="hidden md:inline text-gray-400 text-[11px]">Quanto maior o plano contratado pelo parceiro, mais no topo suas ofertas aparecem!</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>Ordenação:</span>
                  <span className="text-[#FF5F00] font-bold">Prioridade de Destaque</span>
                </div>
              </div>

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

      </main>

      {/* 4. Rodapé Moderno & Completo */}
      <footer className="bg-[#111117] border-t border-white/10 pt-12 pb-8 mt-16 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <img 
                src="/logo-melhor-cupom.png" 
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
                      setActiveTab('merchant-dashboard');
                    }} 
                    className="hover:text-orange-400"
                  >
                    Validador de Balcão (PDV)
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
      {selectedCoupon && (
        <CouponDetailModal
          coupon={selectedCoupon}
          store={stores.find(s => s.id === selectedCoupon.storeId)}
          onClose={() => setSelectedCoupon(null)}
          onTestValidateAtMerchant={handleTestValidateAtMerchant}
        />
      )}

      <SubscriptionModal />

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
