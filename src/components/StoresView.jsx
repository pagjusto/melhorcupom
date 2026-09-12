import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export const StoresView = ({ onSelectStore }) => {
  const { stores } = useApp();
  const [search, setSearch] = useState('');

  // Ordenar lojas priorizando as que contratam planos superiores (Ouro > Prata > Bronze > Free)
  const sortedStores = [...stores].sort((a, b) => {
    const weights = { gold: 4, silver: 3, bronze: 2, free: 1 };
    const wA = weights[a.tier || 'free'] || 1;
    const wB = weights[b.tier || 'free'] || 1;
    if (wB !== wA) return wB - wA;
    return (b.rating || 0) - (a.rating || 0);
  });

  const filteredStores = sortedStores.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-white font-display">
          Rede de Estabelecimentos Parceiros
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Conheça as marcas e comércios parceiros cadastrados no Melhor Cupom.
        </p>

        {/* Campo de Busca Rápida de Estabelecimento */}
        <div className="mt-6 max-w-md mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar loja parceira pelo nome..."
            className="w-full bg-[#161622] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5F00] transition-colors shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <div className="bg-[#171722] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white mb-1">Nenhuma loja encontrada</h3>
          <p className="text-xs text-gray-400">
            Tente buscar utilizando outro termo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onSelectStore?.(store)}
              className="bg-[#181824] hover:bg-[#202030] border border-white/10 hover:border-[#FF5F00]/60 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-orange-950/20 hover:-translate-y-1"
              title={`Ver cupons de ${store.name}`}
            >
              {/* Logo do Estabelecimento */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#111118] border border-white/10 group-hover:border-[#FF5F00]/50 flex items-center justify-center overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                {store.logoImage ? (
                  <img
                    src={store.logoImage}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl">{store.logo || '🏪'}</span>
                )}
              </div>

              {/* Nome do Estabelecimento */}
              <h3 className="mt-3.5 text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                {store.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
