import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { 
  Sparkles, 
  Utensils, 
  ShoppingBag, 
  Scissors, 
  Dumbbell, 
  Wrench, 
  Ticket,
  MapPin,
  Globe,
  Flame
} from 'lucide-react';

const ICONS_MAP = {
  Sparkles,
  Utensils,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Wrench,
  Ticket
};

export const CategoryPills = ({ 
  selectedCategory, 
  setSelectedCategory,
  typeFilter,
  setTypeFilter,
  highDiscountOnly,
  setHighDiscountOnly
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Categorias Principais em Linha Única sem Barra de Rolagem */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-1.5 lg:gap-2 overflow-x-auto md:overflow-x-visible scrollbar-none pb-1 md:pb-0">
        {CATEGORIES.map(cat => {
          const Icon = ICONS_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              title={cat.name}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 rounded-xl font-bold text-[10px] sm:text-[11px] lg:text-xs transition-all duration-200 text-center whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF5F00] to-[#FF7B29] text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-400/50'
                  : 'bg-[#181822] text-gray-300 hover:text-white hover:bg-[#222230] border border-white/5'
              }`}
            >
              <Icon size={13} className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#FF5F00]'}`} />
              <span className="truncate">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-filtros Rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium mr-1">Modalidade:</span>
          
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-white/15 text-white font-bold'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setTypeFilter('physical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'physical'
                ? 'bg-white/15 text-white font-bold'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <MapPin size={13} className="text-orange-400" />
            <span>Lojas Físicas (Balcão)</span>
          </button>

          <button
            onClick={() => setTypeFilter('online')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'online'
                ? 'bg-white/15 text-white font-bold'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Globe size={13} className="text-blue-400" />
            <span>Lojas Online</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => setHighDiscountOnly(!highDiscountOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              highDiscountOnly
                ? 'bg-red-500/20 text-red-400 border-red-500/40 ring-1 ring-red-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
            }`}
          >
            <Flame size={14} className={highDiscountOnly ? 'text-red-400' : 'text-orange-400'} />
            <span>Apenas Super Descontos (40%+ OFF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
