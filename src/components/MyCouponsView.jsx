import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CouponCard } from './CouponCard';
import { 
  Tag, 
  PiggyBank, 
  Clock, 
  CheckCircle2, 
  Heart, 
  QrCode, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const MyCouponsView = ({ onSelectCoupon, onOpenRedemptionModal }) => {
  const { 
    userProfile, 
    coupons, 
    stores, 
    redemptions, 
    isVipUser,
    setIsSubscriptionModalOpen 
  } = useApp();

  const [tab, setTab] = useState('active'); // 'active' | 'history' | 'favorites'

  if (!isVipUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FF5F00]/15 border-2 border-[#FF5F00] flex items-center justify-center text-4xl mb-6 shadow-xl">
          🔒
        </div>
        <h2 className="text-3xl font-black text-white mb-3 font-display">
          Sua Carteira VIP está bloqueada
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Assine o clube Melhor Cupom por apenas <strong className="text-orange-400">R$ 19,90/mês</strong> para salvar cupons favoritos, gerar QR Codes no balcão e acompanhar sua economia em tempo real.
        </p>
        <button
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-600/40 text-sm transition-all"
        >
          Desbloquear Clube VIP Agora
        </button>
      </div>
    );
  }

  // Cupons ativos emitidos pelo usuário
  const userRedemptions = redemptions.filter(r => r.userName === userProfile.name);
  const activeRedemptions = userRedemptions.filter(r => r.status === 'valid');
  const usedRedemptions = userRedemptions.filter(r => r.status === 'used');

  // Cupons favoritados
  const favoriteCoupons = coupons.filter(c => userProfile.savedCouponIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Banner de Economia Acumulada */}
      <div className="bg-gradient-to-r from-[#1D1712] via-[#161622] to-[#121816] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-3">
              <Sparkles size={14} />
              <span>CARTEIRA & HISTÓRICO DO MEMBRO VIP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Olá, {userProfile.name}!
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Você já economizou muito mais do que investiu na sua assinatura. Veja seus cupons prontos para uso:
            </p>
          </div>

          <div className="bg-[#0F1412] border border-emerald-500/30 rounded-2xl p-5 text-center shadow-lg">
            <div className="text-xs text-gray-400 font-semibold mb-1">ECONOMIA TOTAL ACUMULADA</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">
              R$ {userProfile.monthlySavings.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Assinatura: R$ 19,90 • <strong className="text-emerald-400">Lucro de R$ {(userProfile.monthlySavings - 19.90).toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'active'
              ? 'bg-[#FF5F00] text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <QrCode size={15} />
          <span>Prontos para Usar ({activeRedemptions.length})</span>
        </button>

        <button
          onClick={() => setTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'favorites'
              ? 'bg-[#FF5F00] text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Heart size={15} />
          <span>Cupons Salvos ({favoriteCoupons.length})</span>
        </button>

        <button
          onClick={() => setTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'history'
              ? 'bg-[#FF5F00] text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Clock size={15} />
          <span>Histórico de Utilizados ({usedRedemptions.length})</span>
        </button>
      </div>

      {/* TAB: ATIVOS / PRONTOS PARA USAR */}
      {tab === 'active' && (
        <div>
          {activeRedemptions.length === 0 ? (
            <div className="bg-[#181822] border border-white/10 rounded-3xl p-12 text-center">
              <Tag size={36} className="text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Nenhum cupom gerado no momento</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                Navegue pelo catálogo e clique em "Resgatar Cupom VIP" em qualquer oferta para gerar o código e QR Code.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRedemptions.map((red) => (
                <div 
                  key={red.id}
                  className="bg-[#181824] border-2 border-[#FF5F00]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#FF5F00] text-white text-xs font-black px-2.5 py-1 rounded-lg">
                        {red.discountBadge}
                      </span>
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <Clock size={12} />
                        Ativo para uso
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white mb-1">
                      {red.storeName}
                    </h4>
                    <p className="text-xs text-gray-300 mb-4">
                      {red.couponTitle}
                    </p>

                    <div className="bg-[#101017] border border-white/10 p-3 rounded-xl text-center mb-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Código no Caixa:</div>
                      <div className="font-mono text-lg font-black text-orange-400 tracking-wider">
                        {red.code}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const c = coupons.find(item => item.id === red.couponId);
                      if (c) onSelectCoupon(c);
                    }}
                    className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <QrCode size={14} />
                    <span>Ver QR Code Completo</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SALVOS / FAVORITOS */}
      {tab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCoupons.length === 0 ? (
            <div className="col-span-full bg-[#181822] border border-white/10 rounded-3xl p-12 text-center text-gray-400 text-xs">
              Você ainda não favoritou nenhum cupom. Clique no ícone de coração nos cupons do catálogo!
            </div>
          ) : (
            favoriteCoupons.map((coupon) => {
              const store = stores.find(s => s.id === coupon.storeId);
              return (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  store={store}
                  onSelectCoupon={onSelectCoupon}
                />
              );
            })
          )}
        </div>
      )}

      {/* TAB: HISTÓRICO UTILIZADOS */}
      {tab === 'history' && (
        <div className="space-y-3">
          {usedRedemptions.length === 0 ? (
            <div className="bg-[#181822] border border-white/10 rounded-3xl p-12 text-center text-gray-400 text-xs">
              Nenhum cupom utilizado até o momento.
            </div>
          ) : (
            usedRedemptions.map((red) => (
              <div 
                key={red.id}
                className="bg-[#181824] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{red.storeName}</h4>
                    <p className="text-gray-400">{red.couponTitle}</p>
                    <span className="text-[11px] text-gray-500 font-mono">Código: {red.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-400 text-sm">
                    Economia: R$ {red.savings.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Baixa efetuada em {new Date(red.usedAt || red.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
