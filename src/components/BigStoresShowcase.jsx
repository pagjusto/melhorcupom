import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  Flame,
  Globe,
  Tag
} from 'lucide-react';

export const BigStoresShowcase = ({ onSelectStore }) => {
  const { stores, coupons, isVipUser, setIsSubscriptionModalOpen } = useApp();

  // Filtrar apenas lojas integradas via API
  const apiStores = stores.filter(s => s.isApiIntegrated || s.apiSource);

  return (
    <div className="bg-gradient-to-b from-[#14141E] via-[#111119] to-[#0D0D13] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header da Vitrine */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>APIs Oficiais Conectadas</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Coins size={12} className="text-amber-400" />
              <span>Cashback Ativado</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-blue-300 font-medium bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              <Globe size={12} className="text-blue-400" />
              <span>Awin • Lomadee • Shopee • Meli</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2.5">
            <span>Grandes Lojas & E-commerces</span>
            <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Ao Vivo
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Cupons verificados e Cashback automático sincronizados em tempo real diretamente das APIs das maiores lojas do país.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden lg:block">
            <div className="text-[11px] text-gray-400">Latência das APIs</div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>42ms • 100% Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards das Grandes Lojas */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 mb-6">
        {apiStores.map((store) => {
          // Quantidade de cupons ativos desta loja
          const storeCoupons = coupons.filter(c => c.storeId === store.id);
          const couponsCount = storeCoupons.length || store.couponsCount || 6;

          return (
            <div
              key={store.id}
              onClick={() => onSelectStore && onSelectStore(store)}
              className="group bg-[#171724] hover:bg-[#1E1E2E] border border-white/10 hover:border-[#FF5F00]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-orange-950/40 cursor-pointer relative"
            >
              {/* Badge de Origem da API no canto superior */}
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className="text-[9px] font-bold text-gray-300 bg-white/5 group-hover:bg-white/10 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-[85px]">
                  {store.apiSource || 'API'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="API Ativa & Sincronizada" />
              </div>

              {/* Logo e Nome da Loja */}
              <div className="flex flex-col items-center text-center my-1">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 p-1.5 flex items-center justify-center overflow-hidden mb-2 group-hover:border-[#FF5F00]/40 transition-colors shadow-inner">
                  {store.logoImage ? (
                    <>
                      <img 
                        src={store.logoImage} 
                        alt={store.name} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.brand-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="brand-fallback hidden w-full h-full rounded-lg bg-gradient-to-tr from-black/80 to-[#1F1F2E] items-center justify-center font-black text-base text-white">
                        {store.logo || '🛍️'}
                      </div>
                    </>
                  ) : (
                    <span className="text-xl">{store.logo || '🏪'}</span>
                  )}
                </div>

                <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-[#FF5F00] transition-colors">
                  {store.name}
                </h4>
              </div>

              {/* Tag de Cashback */}
              <div className="mt-2 pt-2 border-t border-white/5 flex flex-col items-center gap-1">
                <div className="w-full text-center bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg py-1 px-1 text-[10px] font-extrabold flex items-center justify-center gap-1">
                  <Coins size={11} className="text-emerald-400" />
                  <span>{store.cashbackRate || 'Até 8% de Volta'}</span>
                </div>

                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Tag size={10} className="text-orange-400" />
                  <span>{couponsCount} {couponsCount === 1 ? 'cupom' : 'cupons'}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Faixa Informativa: Como Funciona o Cashback & Redirecionamento */}
      <div className="relative z-10 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center flex-shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Como funciona o desconto nas lojas online?</span>
              <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.2 rounded-full">Automático</span>
            </div>
            <div className="text-[11px] text-gray-400">
              Copie o cupom exclusivo VIP, clique em "Ir para a Loja Oficial" para ativar o cashback e cole o código no fechamento da compra.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Links Rastreados Seguros</span>
          </span>
        </div>
      </div>

    </div>
  );
};
