import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Globe, Star, Tag, ArrowRight } from 'lucide-react';

export const StoresView = ({ onSelectStore }) => {
  const { stores, coupons } = useApp();

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
        {stores.map((store) => {
          const storeCoupons = coupons.filter(c => c.storeId === store.id);

          return (
            <div
              key={store.id}
              className="bg-[#181824] border border-white/10 rounded-3xl overflow-hidden hover:border-[#FF5F00]/50 transition-all group flex flex-col justify-between"
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
                  
                  {/* Badge */}
                  {store.badge && (
                    <span className="absolute top-3 right-3 bg-[#FF5F00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {store.badge}
                    </span>
                  )}

                  {/* Logo Emoji */}
                  <div className="absolute -bottom-4 left-5 w-14 h-14 rounded-2xl bg-[#181824] border-2 border-[#FF5F00] flex items-center justify-center text-3xl shadow-xl">
                    {store.logo}
                  </div>
                </div>

                {/* Conteúdo da Loja */}
                <div className="p-6 pt-7">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">
                      {store.name}
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
