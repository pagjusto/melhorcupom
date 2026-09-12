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
  UserPlus,
  LogIn,
  Settings,
  Gift
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, selectedCity, setSelectedCity }) => {
  const { 
    currentRole, 
    userProfile, 
    stores,
    isVipUser, 
    setIsSubscriptionModalOpen,
    setIsReferralModalOpen,
    openAuthModal,
    switchRole,
    logoutAccount
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMerchantRole = currentRole.startsWith('merchant_');
  const isUserLoggedIn = isVipUser || userProfile?.isLoggedIn;
  const merchantId = isMerchantRole ? currentRole : 'merchant_burger';
  const currentStore = stores.find(s => s.merchantId === merchantId) || stores[0];
  const activeReferralBalance = isMerchantRole
    ? (currentStore?.referralBalance || 0)
    : (userProfile.referralBalance || 0);

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

              {/* Portal do Lojista: Apenas para Lojistas logados */}
              {isMerchantRole && (
                <button
                  onClick={() => setActiveTab('merchant-dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'merchant-dashboard'
                      ? 'bg-[#FF5F00]/20 text-[#FF5F00] font-semibold border border-[#FF5F00]/30'
                      : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                  }`}
                >
                  <Store size={16} />
                  <span>Portal do Lojista</span>
                </button>
              )}
            </div>
          </div>

          {/* User Status / Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Botão em Destaque: Divulgue & Ganhe (Apenas para Usuários ou Lojistas Logados) */}
            {(isUserLoggedIn || isMerchantRole) && (
              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="relative bg-gradient-to-r from-amber-500/15 via-[#FF5F00]/20 to-amber-500/15 hover:from-amber-500/25 hover:to-[#FF5F00]/30 border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-950/20 group transform hover:-translate-y-0.5"
                title="Abrir Programa Divulgue & Ganhe (R$ 5,00 por amigo no Caixa)"
              >
                <span className="text-base group-hover:scale-125 transition-transform animate-bounce">🎁</span>
                <div className="text-left leading-tight">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Divulgue & Ganhe</div>
                  <div className="text-xs font-black text-amber-300">
                    Caixa: R$ {activeReferralBalance.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </button>
            )}

            {isMerchantRole ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('merchant-dashboard')}
                  className="bg-[#FF5F00] hover:bg-[#E04F00] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/30 transition-all"
                >
                  <QrCode size={15} />
                  <span>Painel do Lojista</span>
                </button>
                <button
                  onClick={logoutAccount}
                  className="text-gray-400 hover:text-red-400 px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors text-xs font-bold"
                  title="Sair da conta"
                >
                  Sair
                </button>
              </div>
            ) : isUserLoggedIn ? (
              <div className="flex items-center gap-2.5">
                {isVipUser ? (
                  <>
                    {/* Economia Acumulada */}
                    <div className="hidden lg:flex bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <PiggyBank size={15} />
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Economia</div>
                        <div className="text-xs font-extrabold text-emerald-400">
                          R$ {userProfile.monthlySavings.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>

                    {/* Badge VIP */}
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-amber-400 text-sm">👑</span>
                      <div className="text-xs font-bold text-amber-400 leading-tight">VIP</div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="relative group bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1"
                  >
                    <Sparkles size={13} className="text-amber-200" />
                    <span>Assinar VIP</span>
                  </button>
                )}

                {/* Botão Meus Cupons */}
                <button
                  onClick={() => setActiveTab('my-coupons')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'my-coupons'
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <Tag size={13} />
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
                  title="Configurar Perfil do Usuário"
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

                {/* Sair */}
                <button
                  onClick={logoutAccount}
                  className="text-gray-400 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs font-bold"
                  title="Sair da conta"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Botão Login */}
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-white/5 hover:bg-white/10 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10 hover:border-white/20"
                  title="Fazer login na sua conta"
                >
                  <LogIn size={14} className="text-gray-300" />
                  <span>Login</span>
                </button>

                {/* Botão Cadastro */}
                <button
                  onClick={() => openAuthModal('user_register')}
                  className="bg-white/5 hover:bg-white/10 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10 hover:border-orange-500/50"
                  title="Criar conta gratuita de usuário"
                >
                  <UserPlus size={14} className="text-[#FF5F00]" />
                  <span>Cadastro</span>
                </button>

                {/* Botão Assinar VIP */}
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="relative group bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <Sparkles size={15} className="text-amber-200 animate-spin-slow" />
                  <span>Assinar VIP</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Quick Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Referral Pill on Mobile (Apenas para logados) */}
            {(isUserLoggedIn || isMerchantRole) && (
              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1"
                title="Divulgue & Ganhe"
              >
                <span>🎁</span>
                <span>R$ {activeReferralBalance.toFixed(0)}</span>
              </button>
            )}

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
          {/* Divulgue & Ganhe no Mobile Drawer (Apenas para logados) */}
          {(isUserLoggedIn || isMerchantRole) && (
            <button
              onClick={() => { 
                setIsReferralModalOpen(true); 
                setMobileMenuOpen(false); 
              }}
              className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <span>Divulgue & Ganhe (R$ 5/amigo)</span>
              </div>
              <span className="text-xs bg-amber-500/30 border border-amber-500/50 px-2 py-0.5 rounded-full font-black">
                Caixa: R$ {activeReferralBalance.toFixed(2).replace('.', ',')}
              </span>
            </button>
          )}

          {/* Atalhos de Conta no Mobile Drawer */}
          {!isUserLoggedIn && !isMerchantRole ? (
            <div className="grid grid-cols-2 gap-2 pb-1">
              <button
                onClick={() => { 
                  openAuthModal('login'); 
                  setMobileMenuOpen(false); 
                }}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
              >
                <LogIn size={14} className="text-gray-300" />
                <span>Login</span>
              </button>

              <button
                onClick={() => { 
                  openAuthModal('user_register'); 
                  setMobileMenuOpen(false); 
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF5F00] to-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <UserPlus size={14} />
                <span>Cadastro</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  {isMerchantRole ? '🏪' : '👤'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white truncate max-w-[150px]">
                    {isMerchantRole ? currentStore?.name : userProfile.name}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {isMerchantRole ? 'Painel do Lojista' : isVipUser ? 'Membro VIP' : 'Conta de Usuário'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logoutAccount();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded-lg bg-red-500/10"
              >
                Sair
              </button>
            </div>
          )}

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
          {/* Portal do Lojista: Apenas para Lojistas logados */}
          {isMerchantRole && (
            <button
              onClick={() => { 
                setActiveTab('merchant-dashboard'); 
                setMobileMenuOpen(false); 
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-orange-400 font-semibold hover:bg-orange-500/10 flex items-center gap-2"
            >
              <Store size={16} />
              <span>Portal do Lojista (Validador e Cupons)</span>
            </button>
          )}

          {/* Atalhos para Usuários Logados */}
          {isUserLoggedIn && (
            <>
              <button
                onClick={() => { setActiveTab('user-profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5 flex items-center gap-2"
              >
                <User size={16} />
                <span>Meu Perfil</span>
              </button>

              <button
                onClick={() => { setActiveTab('my-coupons'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-400 font-semibold hover:bg-emerald-500/10 flex items-center gap-2"
              >
                <Tag size={16} />
                <span>Meus Cupons Resgatados</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
