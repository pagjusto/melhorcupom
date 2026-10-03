import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Store, 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  QrCode,
  MapPin,
  Coins,
  Globe,
  Zap,
  Tag,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import { getBrandLogo } from '../assets/brands';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'Todas as Categorias', icon: '✨' },
  { id: 'gastronomia', label: 'Gastronomia & Bares', icon: '🍔' },
  { id: 'moda', label: 'Moda & Roupas', icon: '👗' },
  { id: 'beleza', label: 'Beleza & Perfumaria', icon: '💄' },
  { id: 'fitness', label: 'Saúde & Fitness', icon: '💪' },
  { id: 'servicos', label: 'Tech & Informática', icon: '⚡' },
  { id: 'casa', label: 'Casa & Móveis', icon: '🛋️' },
  { id: 'lazer', label: 'Lazer & Cinema', icon: '🎬' },
  { id: 'outros', label: 'Outros Parceiros', icon: '📦' }
];

export const StoresView = ({ onSelectStore }) => {
  const { stores, openAuthModal } = useApp();
  const [search, setSearch] = useState('');
  const [storeTypeFilter, setStoreTypeFilter] = useState('all'); // 'all' | 'physical' | 'online'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Ordenar lojas priorizando as que contratam planos superiores (Ouro > Prata > Bronze > Free)
  const sortedStores = useMemo(() => {
    return [...stores].sort((a, b) => {
      const weights = { gold: 4, silver: 3, bronze: 2, free: 1 };
      const wA = weights[a.tier || 'free'] || 1;
      const wB = weights[b.tier || 'free'] || 1;
      if (wB !== wA) return wB - wA;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [stores]);

  const physicalStoresCount = useMemo(() => stores.filter(s => s.type === 'physical' && !s.isApiIntegrated).length, [stores]);
  const onlineStoresCount = useMemo(() => stores.filter(s => s.isApiIntegrated || s.type === 'online').length, [stores]);

  const filteredStores = useMemo(() => {
    return sortedStores.filter(store => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        store.name.toLowerCase().includes(q) ||
        (store.category && store.category.toLowerCase().includes(q)) ||
        (store.city && store.city.toLowerCase().includes(q)) ||
        (store.apiSource && store.apiSource.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (storeTypeFilter === 'physical' && (store.type !== 'physical' || store.isApiIntegrated)) return false;
      if (storeTypeFilter === 'online' && store.type !== 'online' && !store.isApiIntegrated) return false;

      if (selectedCategory !== 'all') {
        const storeCat = (store.category || '').toLowerCase();
        if (selectedCategory === 'casa') {
          if (!storeCat.includes('casa') && !storeCat.includes('móveis') && !storeCat.includes('moveis') && !storeCat.includes('construcao')) return false;
        } else if (selectedCategory === 'servicos') {
          if (!storeCat.includes('servico') && !storeCat.includes('tech') && !storeCat.includes('eletron')) return false;
        } else if (storeCat !== selectedCategory) {
          return false;
        }
      }

      return true;
    });
  }, [sortedStores, search, storeTypeFilter, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* 1. HEADER PRINCIPAL & BANNER CHAMATIVO */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Store size={14} />
            <span>Guia Comercial & Rede de Afiliados Oficiais</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Rede de Estabelecimentos Parceiros
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
            Conheça todas as marcas reais, redes e franquias credenciadas que oferecem cupons oficiais e cashback garantido para membros VIP.
          </p>

          {/* Barra de Estatísticas em Tempo Real */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
              <Building2 size={13} className="text-orange-400" />
              <span><strong>{stores.length}</strong> Marcas Reais</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <Tag size={13} />
              <span><strong>370+</strong> Cupons & Ofertas</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Coins size={13} />
              <span>Até <strong>10%</strong> de Cashback</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
              <ShieldCheck size={13} />
              <span>100% Verificadas</span>
            </div>
          </div>
        </div>

        {/* Banner Hero Chamativo "Seja um Parceiro" */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/40 via-[#FF5F00]/20 to-amber-900/30 border-2 border-[#FF5F00] p-6 sm:p-8 shadow-2xl shadow-orange-950/50 group">
          {/* Efeitos de Iluminação de Fundo */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#FF5F00]/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF5F00] via-[#FF7824] to-amber-400 p-0.5 shadow-xl shadow-orange-500/40 flex-shrink-0 animate-bounce">
                <div className="w-full h-full bg-[#181824] rounded-2xl flex items-center justify-center text-3xl sm:text-4xl">
                  🏪
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="bg-[#FF5F00] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-200" />
                    Para Comerciantes & Lojistas
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Adesão Grátis
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Tem um Comércio ou Negócio? <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">Seja Nosso Parceiro!</span>
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                  Coloque sua marca na vitrine para milhares de assinantes VIP com alto poder de compra da sua região. Crie ofertas, aumente seu ticket médio e valide cupons com QR Code direto no caixa do seu balcão.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-[11px] text-gray-300 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 size={13} /> Sem taxa de intermediação
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <CheckCircle2 size={13} /> Validador com Câmera PDV
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <CheckCircle2 size={13} /> R$ 5 por amigo no Caixa
                  </span>
                </div>
              </div>
            </div>

            {/* Botão Chamativo de Ação */}
            <div className="w-full lg:w-auto flex flex-col items-center flex-shrink-0">
              <button
                onClick={() => openAuthModal('merchant_register')}
                className="relative group/btn w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white font-black text-sm sm:text-base shadow-2xl shadow-orange-600/60 hover:shadow-orange-500/80 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border border-amber-300/60 cursor-pointer"
              >
                <div className="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 animate-pulse">
                  100% GRÁTIS
                </div>
                <Sparkles size={20} className="text-amber-200 group-hover/btn:rotate-12 transition-transform" />
                <span className="tracking-wide">SEJA UM PARCEIRO CREDENCIADO</span>
                <ArrowRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
              <span className="text-[11px] text-gray-400 mt-2 text-center font-medium">
                Cadastro rápido e descomplicado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE BUSCA + BOTÃO DE CADASTRO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14141E] p-4 rounded-2xl border border-white/10 shadow-inner">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar marca parceira por nome, categoria ou cidade (ex: McDonald's, Amazon, Nike, China in Box, Livrarias Curitiba)..."
            className="w-full bg-[#181824] border border-white/10 rounded-xl py-3 pl-11 pr-24 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FF5F00] transition-colors shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md cursor-pointer"
              >
                Limpar
              </button>
            )}
            <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
              {filteredStores.length} {filteredStores.length === 1 ? 'marca' : 'marcas'}
            </span>
          </div>
        </div>

        <button
          onClick={() => openAuthModal('merchant_register')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#FF5F00]/20 to-orange-500/20 hover:from-amber-500/30 hover:to-[#FF5F00]/30 border border-[#FF5F00]/50 hover:border-[#FF5F00] text-amber-300 hover:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
          title="Cadastrar meu estabelecimento no Melhor Cupom"
        >
          <PlusCircle size={16} className="text-[#FF5F00]" />
          <span>Cadastrar Minha Loja</span>
        </button>
      </div>

      {/* 2.1 FILTROS DE TIPO (TODAS / LOCAIS / ONLINE) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStoreTypeFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'all'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          Todas as Marcas ({stores.length})
        </button>
        <button
          onClick={() => setStoreTypeFilter('physical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'physical'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          🏪 Comércios Locais & Franquias ({physicalStoresCount})
        </button>
        <button
          onClick={() => setStoreTypeFilter('online')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'online'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-white border border-emerald-500/20'
          }`}
        >
          ⚡ Grandes Marcas & E-commerces ({onlineStoresCount})
        </button>
      </div>

      {/* 2.2 FILTROS POR CATEGORIA */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_CHIPS.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                isActive
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. LISTA / GRID DE LOJAS PARCEIRAS */}
      {filteredStores.length === 0 ? (
        <div className="bg-[#171722] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white mb-1">Nenhuma loja encontrada</h3>
          <p className="text-xs text-gray-400 mb-6">
            Não encontramos nenhum estabelecimento com os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStoreTypeFilter('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-[#FF5F00] hover:bg-[#E04F00] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Ver todas as {stores.length} marcas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          
          {/* Card Chamativo: "Sua Loja Aqui" */}
          <div
            onClick={() => openAuthModal('merchant_register')}
            className="bg-gradient-to-b from-[#FF5F00]/15 via-[#181824] to-[#181824] hover:from-[#FF5F00]/30 hover:to-[#202030] border-2 border-dashed border-[#FF5F00]/70 hover:border-[#FF5F00] rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-orange-950/40 hover:-translate-y-1 relative"
            title="Clique para cadastrar sua loja"
          >
            <div className="w-full flex justify-center">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5F00] text-white text-[9px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                Sua Marca Aqui
              </span>
            </div>

            <div className="my-3 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-[#FF5F00]/40 group-hover:border-[#FF5F00] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 text-[#FF5F00]">
              <PlusCircle size={32} />
            </div>

            <div className="w-full">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-white transition-colors">
                Seja Parceiro
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Cadastre sua loja grátis
              </p>
            </div>
          </div>

          {/* Cards das Lojas Cadastradas */}
          {filteredStores.map((store) => {
            const storeLogo = getBrandLogo(store.name) || getBrandLogo(store.id) || getBrandLogo(store.apiSource) || store.logoImage;
            const isOnlineStore = store.isApiIntegrated || store.type === 'online';

            return (
              <div
                key={store.id}
                onClick={() => onSelectStore?.(store)}
                className={`bg-gradient-to-b from-[#181824] via-[#14141E] to-[#12121A] hover:from-[#202030] hover:to-[#181824] rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group cursor-pointer shadow-lg hover:-translate-y-1 relative overflow-hidden select-none ${
                  store.tier === 'gold'
                    ? 'border border-amber-400/50 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                    : store.tier === 'silver'
                    ? 'border border-slate-300/40 hover:border-slate-300 hover:shadow-[0_0_25px_rgba(203,213,225,0.3)]'
                    : store.tier === 'bronze'
                    ? 'border border-[#CD7F32]/40 hover:border-[#CD7F32] hover:shadow-[0_0_25px_rgba(205,127,50,0.35)]'
                    : 'border border-white/10 hover:border-[#FF5F00]/60 hover:shadow-xl hover:shadow-orange-950/30'
                }`}
                title={`Ver cupons e ofertas oficiais de ${store.name}`}
              >
                {/* Glow sutil de fundo ao passar mouse */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5F00]/10 rounded-full blur-xl group-hover:bg-[#FF5F00]/25 transition-all pointer-events-none" />

                {/* Badges superiores: Origem da API no topo esquerdo e Tier no topo direito */}
                <div className="w-full flex items-center justify-between gap-1 mb-2 relative z-10">
                  {store.apiSource || store.isApiIntegrated ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold tracking-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{store.apiSource || 'API Oficial'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/30 text-orange-300 text-[9px] font-bold tracking-tight">
                      <span>Local</span>
                    </span>
                  )}

                  {store.tier === 'gold' ? (
                    <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                      👑 OURO
                    </span>
                  ) : store.tier === 'silver' ? (
                    <span className="bg-gray-300 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                      🥈 PRATA
                    </span>
                  ) : store.tier === 'bronze' ? (
                    <span className="bg-[#CD7F32] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                      🥉 BRONZE
                    </span>
                  ) : (
                    <span className="bg-white/10 text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      CREDENCIADO
                    </span>
                  )}
                </div>

                {/* Logo da Marca Oficial com tratamento e fundo nítido em branco */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 flex items-center justify-center overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-orange-500/20 relative z-10">
                  {storeLogo ? (
                    <>
                      <img
                        src={storeLogo}
                        alt={store.name}
                        className="w-full h-full object-contain p-1 rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                          if (fb) fb.style.display = 'flex';
                        }}
                      />
                      <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-3xl">
                        {store.logo || '🛍️'}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl sm:text-4xl">{store.logo || '🏪'}</span>
                  )}
                </div>

                {/* Informações da Marca */}
                <div className="w-full mt-3 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      {store.name}
                    </h3>

                    {/* Localização ou Escopo Nacional */}
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                      {isOnlineStore ? (
                        <>
                          <Globe size={11} className="text-blue-400 flex-shrink-0" />
                          <span className="truncate">Nacional (Online)</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={11} className="text-orange-400 flex-shrink-0" />
                          <span className="truncate">{store.city ? store.city.split('-')[0].trim() : 'Brasil'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges de Cupons e Cashback */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-1 w-full">
                    {store.cashbackRate && (
                      <span className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                        <Coins size={10} className="text-amber-400" />
                        <span>{store.cashbackRate}</span>
                      </span>
                    )}

                    <span className="text-[10px] text-gray-400 group-hover:text-orange-300 font-semibold transition-colors flex items-center justify-center gap-1">
                      <Tag size={10} />
                      <span>{store.couponsCount ? `${store.couponsCount} cupons` : 'Ver ofertas'}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. SEÇÃO INFORMATIVA DE VANTAGENS DO PARCEIRO */}
      <div className="bg-[#14141E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Por que anunciar no Melhor Cupom?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Transformamos clientes em frequentadores assíduos do seu comércio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center font-bold mb-3">
              <Users size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Clientes Assinantes VIP</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Consumidores dispostos a gastar no comércio local todos os dias em busca dos melhores descontos.
            </p>
          </div>

          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
              <QrCode size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Validação Rápida no Caixa</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Escaneie o QR Code pela câmera do celular ou digite o código de 6 dígitos. Sem burocracia nem aparelhos extras.
            </p>
          </div>

          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold mb-3">
              <TrendingUp size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Divulgue & Ganhe R$ 5,00</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Convide clientes e amigos para o clube e receba créditos reais no seu Caixa para abater planos ou sacar.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => openAuthModal('merchant_register')}
            className="px-7 py-3.5 rounded-2xl bg-[#FF5F00] hover:bg-[#E04F00] text-white font-black text-sm shadow-xl shadow-orange-600/30 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Cadastrar Meu Estabelecimento Gratuitamente</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};
