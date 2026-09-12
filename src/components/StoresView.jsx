import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Globe, Star, Tag, ArrowRight, Crown, Award } from 'lucide-react';

export const StoresView = ({ onSelectStore }) => {
  const { stores, coupons } = useApp();

  // Ordenar lojas priorizando as que contratam planos superiores (Ouro > Prata > Free)
  const sortedStores = [...stores].sort((a, b) => {
    const weights = { gold: 3, silver: 2, free: 1 };
    const wA = weights[a.tier || 'free'] || 1;
    const wB = weights[b.tier || 'free'] || 1;
    if (wB !== wA) return wB - wA;
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-white font-display">
          Rede de Estabelecimentos Parceiros
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Conheça os comércios locais e lojas online que oferecem benefícios exclusivos para os membros do clube Melhor Cupom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStores.map((store) => {
          const storeCoupons = coupons.filter(c => c.storeId === store.id);
          const storeTier = store.tier || 'free';

          return (
            <div
              key={store.id}
              className={`bg-[#181824] rounded-3xl overflow-hidden transition-all group flex flex-col justify-between ${
                storeTier === 'gold'
                  ? 'border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:border-amber-400'
                  : storeTier === 'silver'
                  ? 'border border-slate-300/40 hover:border-slate-200'
                  : 'border border-white/10 hover:border-[#FF5F00]/50'
              }`}
            >
              <div>
                {/* Imagem de Capa */}
                <div className="relative h-44 overflow-hidden bg-black/40">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181824] via-transparent to-transparent" />
                  
                  {/* Badge de Tier ou Custom */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {storeTier === 'gold' && (
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Crown size={12} fill="currentColor" />
                        <span>Ouro VIP</span>
                      </span>
                    )}
                    {storeTier === 'silver' && (
                      <span className="bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Award size={12} />
                        <span>Prata Pro</span>
                      </span>
                    )}
                    {store.badge && storeTier === 'free' && (
                      <span className="bg-[#FF5F00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {store.badge}
                      </span>
                    )}
                  </div>

                  {/* Logo Imagem ou Emoji com borda por plano */}
                  <div className={`absolute -bottom-4 left-5 w-14 h-14 rounded-2xl bg-[#181824] flex items-center justify-center text-3xl shadow-xl overflow-hidden ${
                    storeTier === 'gold' 
                      ? 'border-2 border-amber-400 ring-2 ring-amber-400/30' 
                      : storeTier === 'silver'
                      ? 'border-2 border-slate-300'
                      : 'border-2 border-[#FF5F00]'
                  }`}>
                    {store.logoImage ? (
                      <img src={store.logoImage} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      store.logo
                    )}
                  </div>
                </div>

                {/* Conteúdo da Loja */}
                <div className="p-6 pt-7">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                      <span>{store.name}</span>
                      {storeTier === 'gold' && <Crown size={14} className="text-amber-400" fill="currentColor" />}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{store.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                    {store.type === 'physical' ? (
                      <>
                        <MapPin size={13} className="text-orange-400 flex-shrink-0" />
                        <span className="line-clamp-1">{store.address}</span>
                      </>
                    ) : (
                      <>
                        <Globe size={13} className="text-blue-400 flex-shrink-0" />
                        <span>Loja Online Oficial (Brasil)</span>
                      </>
                    )}
                  </p>

                  {/* Ofertas Disponíveis nesta loja */}
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Cupons Ativos ({storeCoupons.length}):
                    </span>
                    {storeCoupons.slice(0, 2).map((cp) => (
                      <div key={cp.id} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-xl text-gray-300">
                        <span className="line-clamp-1 text-gray-200">{cp.title}</span>
                        <span className="font-extrabold text-orange-400 whitespace-nowrap ml-2">
                          {cp.discountBadge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectStore(store)}
                  className="w-full mt-2 bg-white/5 hover:bg-[#FF5F00] hover:text-white text-gray-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Ver Todos os Cupons ({storeCoupons.length})</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
