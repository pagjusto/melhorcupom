import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Tag, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  PiggyBank, 
  Menu, 
  X, 
  QrCode, 
  PlusCircle, 
  Heart,
  ChevronDown,
  MapPin,
  User,
  Settings
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, selectedCity, setSelectedCity }) => {
  const { 
    currentRole, 
    userProfile, 
    isVipUser, 
    setIsSubscriptionModalOpen,
    switchRole 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMerchantRole = currentRole.startsWith('merchant_');

  return (
    <nav className="bg-[#14141B] border-b border-white/10 sticky top-[41px] z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('explore')} 
              className="flex items-center gap-3 group text-left"
            >
              <div className="relative">
                <img 
                  src="/logo-melhor-cupom.png" 
                  alt="Melhor Cupom" 
                  className="h-14 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'explore'
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Cupons & Ofertas
              </button>

              <button
                onClick={() => setActiveTab('stores')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'stores'
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Lojas Parceiras
              </button>

              <button
                onClick={() => setActiveTab('how-it-works')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'how-it-works'
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Como Funciona
              </button>

              <button
                onClick={() => {
                  if (!isMerchantRole) {
                    switchRole('merchant_burger');
                  }
                  setActiveTab('merchant-dashboard');
                }}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'merchant-dashboard'
                    ? 'bg-[#FF5F00]/20 text-[#FF5F00] font-semibold border border-[#FF5F00]/30'
                    : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                }`}
              >
                <Store size={16} />
                <span>Portal do Lojista</span>
              </button>

              {/* Indicador de Cidade Ativa */}
              <button
                onClick={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 transition-colors ml-2"
                title="Clique para escolher outra cidade"
              >
                <MapPin size={13} className="text-[#FF5F00]" />
                <span className="text-white max-w-[140px] truncate">{selectedCity || 'Todas as Cidades'}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* User Status / Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isVipUser ? (
              <div className="flex items-center gap-3">
                {/* Economia Acumulada */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <PiggyBank size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Economia este mês</div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      R$ {userProfile.monthlySavings.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                {/* Badge VIP */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl">
                  <span className="text-amber-400 animate-pulse">👑</span>
                  <div>
                    <div className="text-xs font-bold text-amber-400 leading-tight">Membro VIP</div>
                    <div className="text-[10px] text-gray-400">Acesso ilimitado</div>
                  </div>
                </div>

                {/* Botão Meus Cupons */}
                <button
                  onClick={() => setActiveTab('my-coupons')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'my-coupons'
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <Tag size={14} />
                  <span>Meus Cupons</span>
                </button>

                {/* Botão Meu Perfil / Configurações */}
                <button
                  onClick={() => setActiveTab('user-profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'user-profile'
                      ? 'bg-[#FF5F00] text-white border-[#FF5F00] shadow-md shadow-orange-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                  title="Configurar Perfil do Assinante"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span>Perfil</span>
                </button>
              </div>
            ) : isMerchantRole ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('merchant-dashboard')}
                  className="bg-[#FF5F00] hover:bg-[#E04F00] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
                >
                  <QrCode size={16} />
                  <span>Validar Cupom</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('user-profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'user-profile'
                      ? 'bg-[#FF5F00] text-white border-[#FF5F00] shadow-md shadow-orange-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                  title="Configurar Perfil"
                >
                  <User size={14} />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="relative group bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-amber-200 animate-spin-slow" />
                  <span>Assinar VIP por R$ 19,90</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isVipUser && !isMerchantRole && (
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="bg-[#FF5F00] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Seja VIP
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#14141B] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
          >
            Cupons & Ofertas
          </button>
          <button
            onClick={() => { setActiveTab('stores'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
          >
            Lojas Parceiras
          </button>
          <button
            onClick={() => { setActiveTab('how-it-works'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
          >
            Como Funciona
          </button>
          <button
            onClick={() => { 
              if (!isMerchantRole) switchRole('merchant_burger');
              setActiveTab('merchant-dashboard'); 
              setMobileMenuOpen(false); 
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-orange-400 font-semibold hover:bg-orange-500/10 flex items-center gap-2"
          >
            <Store size={16} />
            <span>Portal do Lojista (Validador e Cupons)</span>
          </button>
          <button
            onClick={() => { setActiveTab('user-profile'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5 flex items-center gap-2"
          >
            <User size={16} />
            <span>Meu Perfil de Assinante</span>
          </button>
          {isVipUser && (
            <button
              onClick={() => { setActiveTab('my-coupons'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-400 font-semibold hover:bg-emerald-500/10 flex items-center gap-2"
            >
              <Tag size={16} />
              <span>Meus Cupons Resgatados</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
