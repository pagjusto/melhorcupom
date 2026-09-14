import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';

export const StoresView = ({ onSelectStore }) => {
  const { stores, openAuthModal } = useApp();
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
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    (store.category && store.category.toLowerCase().includes(search.toLowerCase())) ||
    (store.city && store.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      
      {/* 1. HEADER PRINCIPAL & BANNER CHAMATIVO "SEJA PARCEIRO" */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Store size={14} />
            <span>Guia Comercial & Parceiros Credenciados</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Rede de Estabelecimentos Parceiros
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Conheça as marcas, restaurantes e serviços credenciados que oferecem descontos exclusivos para assinantes VIP.
          </p>
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

      {/* 2. BARRA DE BUSCA + BOTÃO DE ATALHO RÁPIDO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14141E] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar loja parceira pelo nome, cidade ou categoria (ex: Burguer, Don Corleone, Moda)..."
            className="w-full bg-[#181824] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5F00] transition-colors shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
            >
              Limpar
            </button>
          )}
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

      {/* 3. LISTA / GRID DE LOJAS PARCEIRAS */}
      {filteredStores.length === 0 ? (
        <div className="bg-[#171722] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white mb-1">Nenhuma loja encontrada</h3>
          <p className="text-xs text-gray-400 mb-6">
            Não encontramos nenhum estabelecimento com o termo digitado.
          </p>
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all"
          >
            Ver todas as lojas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          
          {/* Card Chamativo: "Sua Loja Aqui" */}
          <div
            onClick={() => openAuthModal('merchant_register')}
            className="bg-gradient-to-b from-[#FF5F00]/15 via-[#181824] to-[#181824] hover:from-[#FF5F00]/30 hover:to-[#202030] border-2 border-dashed border-[#FF5F00]/70 hover:border-[#FF5F00] rounded-3xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-orange-950/40 hover:-translate-y-1 relative"
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
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onSelectStore?.(store)}
              className={`bg-[#181824] rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-pointer shadow-lg hover:-translate-y-1 relative overflow-hidden ${
                store.tier === 'gold'
                  ? 'border border-amber-400/50 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                  : store.tier === 'silver'
                  ? 'border border-slate-300/40 hover:border-slate-300 hover:shadow-[0_0_25px_rgba(203,213,225,0.35)]'
                  : store.tier === 'bronze'
                  ? 'border border-[#CD7F32]/40 hover:border-[#CD7F32] hover:shadow-[0_0_25px_rgba(205,127,50,0.4)]'
                  : 'border border-white/10 hover:border-white/30 hover:shadow-xl hover:shadow-black/50'
              }`}
              title={`Ver cupons e ofertas de ${store.name}`}
            >
              {/* Badge do Plano da Loja (Ouro / Prata / Bronze) */}
              {store.tier === 'gold' && (
                <div className="absolute top-2.5 right-2.5 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                  👑 OURO
                </div>
              )}
              {store.tier === 'silver' && (
                <div className="absolute top-2.5 right-2.5 bg-gray-300 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                  🥈 PRATA
                </div>
              )}
              {store.tier === 'bronze' && (
                <div className="absolute top-2.5 right-2.5 bg-[#CD7F32] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                  🥉 BRONZE
                </div>
              )}

              {/* Logo do Estabelecimento com borda de sua assinatura (branca para free) */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#111118] flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 group-hover:scale-105 ${
                store.tier === 'gold'
                  ? 'border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : store.tier === 'silver'
                  ? 'border-2 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.4)]'
                  : store.tier === 'bronze'
                  ? 'border-2 border-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.5)]'
                  : 'border-2 border-white shadow-md'
              }`}>
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

              {store.city && (
                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5 truncate max-w-full">
                  <MapPin size={10} className="text-gray-500 flex-shrink-0" />
                  <span className="truncate">{store.city.split('-')[0].trim()}</span>
                </span>
              )}
            </div>
          ))}
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
