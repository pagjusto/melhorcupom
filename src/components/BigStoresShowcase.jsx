import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ExternalLink, 
  Coins, 
  Tag, 
  ShieldCheck,
  Search,
  X,
  Store,
  ShoppingBag
} from 'lucide-react';
import { getBrandLogo } from '../assets/brands';

const STORE_GROUPS = [
  { id: 'all', label: 'Todas as Lojas & Cupons', icon: '✨' },
  { id: 'imperdiveis', label: 'Ofertas Imperdíveis', icon: '🔥', badge: '67+ Virais', isDirectPage: true, targetStore: 'all' },
  { id: 'shopee', label: 'Shopee Oficial', icon: '🧡', badge: 'Achadinhos', isDirectPage: true, targetStore: 'shopee' },
  { id: 'magalu', label: 'Magazine Luiza', icon: '🛍️', badge: 'Radar Top 10', isDirectPage: true, targetStore: 'magalu' },
  { id: 'amazon', label: 'Amazon Brasil', icon: '📦' },
  { id: 'tech', label: 'Smartphones & Tech', icon: '⚡' },
  { id: 'moda', label: 'Tênis & Moda', icon: '👟' },
  { id: 'casa', label: 'Casa & Eletro', icon: '🏠' }
];

const QUICK_SEARCH_CHIPS = [
  { label: '🔥 Ofertas Imperdíveis', query: 'imperdivel', icon: '🔥' },
  { label: 'Shopee', query: 'Shopee', icon: '🧡' },
  { label: 'Magazine Luiza', query: 'Magazine Luiza', icon: '🛍️' },
  { label: 'Amazon', query: 'Amazon', icon: '📦' },
  { label: 'Nike', query: 'Nike', icon: '✔️' },
  { label: 'SHEIN', query: 'SHEIN', icon: '🖤' },
  { label: 'AliExpress', query: 'AliExpress', icon: '🔴' },
  { label: 'Mercado Livre', query: 'Mercado Livre', icon: '🤝' },
  { label: 'Samsung', query: 'Samsung', icon: '📱' },
  { label: 'Smartphones & Tech', query: 'Smartphone', icon: '⚡' },
  { label: 'Tênis & Corrida', query: 'Tênis', icon: '👟' },
  { label: 'Smart TVs & Eletro', query: 'TV', icon: '📺' }
];

export const BigStoresShowcase = ({ onSelectCoupon, onSelectStore }) => {
  const { stores, coupons, hotDeals, navigateToImperdiveis } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  // Filtrar exclusivamente cupons das grandes lojas / APIs oficiais + Ofertas Imperdíveis (Shopee & Magalu)
  const allBigStoreCoupons = useMemo(() => {
    // 1. Cupons padrão de grandes lojas
    const baseBigCoupons = coupons.filter(c => {
      const store = stores.find(s => s.id === c.storeId);
      return c.isApiIntegrated || c.apiSource || store?.isApiIntegrated;
    });

    // 2. Converter hotDeals (Ofertas Imperdíveis Shopee & Magalu) em formato de cupom compatível
    const convertedHotDeals = (hotDeals || []).map(deal => {
      const isMagalu = (deal.store && deal.store.toLowerCase().includes('magalu')) || 
                       (deal.affiliateUrl && (deal.affiliateUrl.includes('magazinevoce') || deal.affiliateUrl.includes('magazineluiza') || deal.affiliateUrl.includes('maga.lu')));
      const storeId = isMagalu ? 'store_magalu' : 'store_shopee';
      const storeName = isMagalu ? 'Magazine Luiza' : 'Shopee Oficial';
      const codePrefix = isMagalu ? 'MAGALU' : 'SHOPEE';
      const apiSource = isMagalu ? 'Magazine Você (1P Oficial)' : 'Shopee Oficial';

      return {
        id: deal.id,
        isHotDeal: true,
        isImperdivel: true,
        storeId,
        storeName,
        storeLogo: getBrandLogo(isMagalu ? 'magalu' : 'shopee'),
        title: deal.title,
        description: deal.description || `${deal.title} com ${deal.discountBadge || 'super desconto'} por apenas R$ ${Number(deal.promoPrice || 0).toFixed(2).replace('.', ',')}`,
        codePrefix,
        discountBadge: deal.discountBadge || '50% OFF',
        discountPercent: deal.discountPercent || 50,
        cashbackRate: deal.freeShipping ? 'Frete Grátis' : 'Até 8.5% de Volta',
        apiSource,
        affiliateUrl: deal.affiliateUrl,
        isApiIntegrated: true,
        originalPrice: deal.originalPrice,
        promoPrice: deal.promoPrice,
        savings: deal.savings || (deal.originalPrice && deal.promoPrice ? deal.originalPrice - deal.promoPrice : 0),
        image: deal.image,
        banner: deal.image,
        category: deal.category || 'tech',
        categoryLabel: deal.categoryLabel || (isMagalu ? 'Radar Magalu 1P' : 'Achadinhos Shopee'),
        type: 'online',
        rating: deal.rating || 4.9,
        salesCount: deal.salesCount || 'Mais Vendido',
        tag: deal.tag || (isMagalu ? '💙 Radar Magalu 1P' : '🔥 Oferta Imperdível')
      };
    });

    // Intercalar as ofertas imperdíveis e cupons das grandes redes para enriquecer todas as faixas do carrossel
    const seen = new Set();
    const result = [];
    const maxLen = Math.max(convertedHotDeals.length, baseBigCoupons.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < convertedHotDeals.length && !seen.has(convertedHotDeals[i].id)) {
        seen.add(convertedHotDeals[i].id);
        result.push(convertedHotDeals[i]);
      }
      if (i < baseBigCoupons.length && !seen.has(baseBigCoupons[i].id)) {
        seen.add(baseBigCoupons[i].id);
        result.push(baseBigCoupons[i]);
      }
    }

    return result;
  }, [coupons, stores, hotDeals]);

  // Filtrar cupons por grupo selecionado e por mercadoria/termo pesquisado
  const filteredCoupons = useMemo(() => {
    let list = allBigStoreCoupons;

    // 1. Filtro por Grupo Selecionado
    if (activeGroup !== 'all') {
      list = list.filter(item => {
        if (activeGroup === 'imperdiveis') {
          return item.isImperdivel || item.isHotDeal;
        }
        if (activeGroup === 'shopee') {
          return item.storeId === 'store_shopee' || (item.storeName || '').toLowerCase().includes('shopee');
        }
        if (activeGroup === 'magalu') {
          return item.storeId === 'store_magalu' || (item.storeName || '').toLowerCase().includes('magazine') || (item.storeName || '').toLowerCase().includes('magalu');
        }
        if (activeGroup === 'amazon') {
          return item.storeId === 'store_amazon' || (item.storeName || '').toLowerCase().includes('amazon');
        }
        if (activeGroup === 'tech') {
          return item.category === 'tech' || item.category === 'servicos' || /smart|tv|fone|led|watch|celular|alexa|notebook|pc|fio|bluetooth/i.test(item.title);
        }
        if (activeGroup === 'moda') {
          return item.category === 'moda' || /tênis|tenis|camisa|vestido|calça|jaqueta|nike|adidas|centauro|shein/i.test(item.title);
        }
        if (activeGroup === 'casa') {
          return item.category === 'casa' || /air fryer|fritadeira|aspirador|panela|cozinha|casa|travesseiro|eletro/i.test(item.title);
        }
        return true;
      });
    }

    // 2. Filtro por Busca digitada ou Chip
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      list = list.filter(coupon => {
        const store = stores.find(s => s.id === coupon.storeId);
        const storeName = (coupon.storeName || store?.name || '').toLowerCase();
        const storeCategory = (store?.category || coupon.category || '').toLowerCase();
        const apiSource = (coupon.apiSource || store?.apiSource || '').toLowerCase();
        const title = (coupon.title || '').toLowerCase();
        const desc = (coupon.description || '').toLowerCase();
        const badge = (coupon.discountBadge || '').toLowerCase();
        const code = (coupon.codePrefix || '').toLowerCase();
        const tag = (coupon.tag || '').toLowerCase();

        return (
          storeName.includes(term) ||
          storeCategory.includes(term) ||
          apiSource.includes(term) ||
          title.includes(term) ||
          desc.includes(term) ||
          badge.includes(term) ||
          code.includes(term) ||
          tag.includes(term) ||
          (term === 'imperdivel' && (coupon.isImperdivel || coupon.isHotDeal)) ||
          (term === 'ofertas imperdiveis' && (coupon.isImperdivel || coupon.isHotDeal))
        );
      });
    }

    return list;
  }, [allBigStoreCoupons, activeGroup, searchQuery, stores]);

  const isSearching = searchQuery.trim().length > 0;
  const isGridView = isSearching || activeGroup !== 'all';

  // Distribuir os cupons em 5 linhas distintas para o carrossel contínuo
  const { row1, row2, row3, row4, row5 } = useMemo(() => {
    const r1 = [];
    const r2 = [];
    const r3 = [];
    const r4 = [];
    const r5 = [];

    allBigStoreCoupons.forEach((coupon, index) => {
      const remainder = index % 5;
      if (remainder === 0) r1.push(coupon);
      else if (remainder === 1) r2.push(coupon);
      else if (remainder === 2) r3.push(coupon);
      else if (remainder === 3) r4.push(coupon);
      else r5.push(coupon);
    });

    // Função auxiliar para duplicar a lista garantindo looping infinito contínuo e suave com alto desempenho
    const duplicateForLoop = (list) => {
      if (list.length === 0) return [];
      const repeatCount = list.length < 10 ? 4 : list.length < 25 ? 3 : 2;
      return Array(repeatCount).fill(list).flat();
    };

    return {
      row1: duplicateForLoop(r1),
      row2: duplicateForLoop(r2),
      row3: duplicateForLoop(r3),
      row4: duplicateForLoop(r4),
      row5: duplicateForLoop(r5)
    };
  }, [allBigStoreCoupons]);

  if (allBigStoreCoupons.length === 0) return null;

  // Renderizador de Card de Oferta Estilo Card Completo e Ampliado
  const renderCard = (coupon, key, isGrid = false) => {
    const store = stores.find(s => s.id === coupon.storeId);
    const apiSource = coupon.apiSource || store?.apiSource || 'API Oficial';
    const cashbackRate = coupon.cashbackRate || store?.cashbackRate || 'Até 8.0% de Volta';
    const couponCode = coupon.codePrefix || 'MELHORVIP';
    
    // Suporte a nomes e logotipos originais das marcas e grandes lojas
    const storeName = coupon.storeName || store?.name || 'Loja Parceira';
    const storeLogo = coupon.storeLogo || getBrandLogo(coupon.storeId || storeName || apiSource) || store?.logoImage;

    return (
      <div
        key={key}
        onClick={() => onSelectCoupon && onSelectCoupon(coupon)}
        className={`${
          isGrid ? 'w-full' : 'w-[315px] sm:w-[345px]'
        } h-[142px] sm:h-[148px] flex-shrink-0 bg-gradient-to-br from-[#161626]/95 via-[#131320]/95 to-[#0F0F1A]/95 hover:from-[#1E1E34] hover:to-[#17172B] border border-white/10 hover:border-[#FF5F00]/80 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-950/40 cursor-pointer group relative overflow-hidden select-none`}
      >
        {/* Efeito Glow sutil no canto do card ao passar o mouse */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5F00]/10 rounded-full blur-2xl group-hover:bg-[#FF5F00]/25 transition-all pointer-events-none" />

        {/* 1. Header do Card: Thumbnail / Logo, Nome, Origem API e Badge de Desconto */}
        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Foto do Produto (para Ofertas Imperdíveis) ou Logo da Marca */}
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#FF5F00]/50 transition-colors shadow-inner relative">
              {coupon.image ? (
                <img 
                  src={coupon.image} 
                  alt={coupon.title} 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    if (storeLogo && e.currentTarget.src !== storeLogo) {
                      e.currentTarget.src = storeLogo;
                      e.currentTarget.className = "w-full h-full object-contain p-0.5 rounded-lg";
                    } else {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                      if (fb) fb.style.display = 'flex';
                    }
                  }}
                />
              ) : storeLogo ? (
                <>
                  <img 
                    src={storeLogo} 
                    alt={storeName} 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-contain p-0.5 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                  <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-base">
                    {store?.logo || (coupon.storeId === 'store_magalu' ? '🛍️' : '🧡')}
                  </span>
                </>
              ) : (
                <span className="text-base">{store?.logo || (coupon.storeId === 'store_magalu' ? '🛍️' : '🧡')}</span>
              )}
              <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-base">
                {store?.logo || (coupon.storeId === 'store_magalu' ? '🛍️' : '🧡')}
              </span>
            </div>

            {/* Nome da Loja & Tag da Rede de Afiliados */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                  {storeName}
                </h4>
                {coupon.isHotDeal && (
                  <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 font-black px-1 rounded flex-shrink-0">
                    🔥 HOT
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[130px]">{apiSource}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Badge de Desconto com Destaque */}
          <span className="bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1 flex-shrink-0">
            <Tag size={11} />
            <span>{coupon.discountBadge}</span>
          </span>
        </div>

        {/* 2. Corpo do Card: Título da Oferta em 2 Linhas com boa legibilidade */}
        <div className="my-1 relative z-10">
          <p className="text-xs sm:text-[13px] font-semibold text-gray-200 group-hover:text-white line-clamp-2 leading-snug" title={coupon.title}>
            {coupon.title}
          </p>
        </div>

        {/* 3. Rodapé do Card: Preço Promocional ou Código com Borda Tracejada, Cashback & Botão Pegar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Preço Promocional se for Hot Deal OU Caixa de Cupom com Borda Tracejada */}
            {coupon.promoPrice ? (
              <div className="font-mono text-[11px] font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                <span>R$ {Number(coupon.promoPrice).toFixed(2).replace('.', ',')}</span>
              </div>
            ) : (
              <div className="font-mono text-[11px] font-bold text-orange-300 bg-orange-500/10 border border-dashed border-orange-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                <span>{couponCode}</span>
              </div>
            )}

            {/* Cashback Ativado ou Frete Grátis */}
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5 truncate">
              {coupon.isHotDeal ? <Sparkles size={11} className="text-amber-400 flex-shrink-0" /> : <Coins size={11} className="text-amber-400 flex-shrink-0" />}
              <span className="truncate">{cashbackRate}</span>
            </span>
          </div>

          {/* Botão de Ação / Pegar Cupom ou Ver Oferta */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF5F00]/15 group-hover:bg-[#FF5F00] text-orange-400 group-hover:text-white border border-[#FF5F00]/30 group-hover:border-[#FF5F00] text-xs font-bold transition-all flex-shrink-0 shadow-sm">
            <span>{coupon.isHotDeal ? 'Ver Oferta' : 'Pegar'}</span>
            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-[#14141E] via-[#111119] to-[#0D0D13] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header da Vitrine */}
      <div className="relative z-10 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-display flex flex-wrap items-center gap-2.5">
              <span>Cupons das Grandes Lojas & E-commerces</span>
              <span className="text-xs bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                Ao Vivo
              </span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Super vitrine integrada com cupons oficiais, Ofertas Imperdíveis Shopee e Radar Magalu Top 10 diário em tempo real.
            </p>
          </div>
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{allBigStoreCoupons.length} ofertas e cupons ativos</span>
          </span>
        </div>
      </div>

      {/* SELETOR DE GRUPOS DE GRANDES LOJAS & OFERTAS IMPERDÍVEIS */}
      <div className="relative z-10 mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STORE_GROUPS.map((group) => {
          const isActive = activeGroup === group.id;
          return (
            <button
              key={group.id}
              onClick={() => {
                if (group.isDirectPage && navigateToImperdiveis) {
                  navigateToImperdiveis(group.targetStore || 'all');
                } else {
                  setActiveGroup(group.id);
                }
              }}
              title={group.isDirectPage ? 'Ver todas as ofertas ampliadas em tela cheia' : undefined}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white shadow-lg shadow-orange-600/30 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20 hover:border-orange-500/40'
              }`}
            >
              <span>{group.icon}</span>
              <span>{group.label}</span>
              {group.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-black/30 text-white' : 'bg-red-500/20 text-red-300'
                }`}>
                  {group.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CAMPO DE PESQUISA POR MERCADORIA OU POR LOJA */}
      <div className="relative z-10 mb-4 bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/10 shadow-inner">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#FF5F00]">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por mercadoria ou por grande loja (ex: Smartphone, Tênis, TV, Nike, Amazon...)"
              className="w-full bg-[#171725] hover:bg-[#1C1C2E] focus:bg-[#202035] border border-white/15 focus:border-[#FF5F00] text-white text-xs sm:text-sm pl-10 pr-28 py-2.5 rounded-xl placeholder-gray-400 focus:outline-none transition-all font-medium"
            />
            <div className="absolute inset-y-0 right-2.5 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <X size={15} />
                </button>
              )}
              <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono hidden sm:inline">
                {filteredCoupons.length} {filteredCoupons.length === 1 ? 'oferta' : 'ofertas'}
              </span>
            </div>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 flex-shrink-0"
            >
              <X size={14} />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Chips de Atalhos Rápidos por Mercadoria ou Loja */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/5">
          <span className="text-[11px] text-gray-400 font-medium mr-1 hidden sm:inline">
            Filtro rápido:
          </span>
          {QUICK_SEARCH_CHIPS.map((chip, idx) => {
            const isActive = searchQuery.toLowerCase() === chip.query.toLowerCase();
            return (
              <button
                key={idx}
                onClick={() => {
                  if (chip.query === 'imperdivel' && navigateToImperdiveis) {
                    navigateToImperdiveis('all');
                  } else if (chip.query === 'Shopee' && navigateToImperdiveis) {
                    navigateToImperdiveis('shopee');
                  } else if (chip.query === 'Magazine Luiza' && navigateToImperdiveis) {
                    navigateToImperdiveis('magalu');
                  } else {
                    setSearchQuery(isActive ? '' : chip.query);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTADOS DA BUSCA OU GRUPO FILTRADO OU CARROSSEL DE 5 LINHAS */}
      {isGridView ? (
        /* MODO GRID: Exibe as ofertas filtradas por Grupo ou Busca em grid */
        <div className="relative z-10 py-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-300 px-1 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 font-bold">
                ✓ {filteredCoupons.length} {filteredCoupons.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
              </span>
              {activeGroup !== 'all' && (
                <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Grupo: {STORE_GROUPS.find(g => g.id === activeGroup)?.label}
                </span>
              )}
              {searchQuery && (
                <span>para "<strong>{searchQuery}</strong>"</span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveGroup('all');
              }}
              className="text-orange-400 hover:text-orange-300 text-xs font-semibold underline cursor-pointer"
            >
              Ver todas as {allBigStoreCoupons.length} ofertas (Carrossel Contínuo)
            </button>
          </div>

          {filteredCoupons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {filteredCoupons.map((coupon, idx) => (
                <div key={`search-result-${coupon.id}-${idx}`} className="w-full">
                  {renderCard(coupon, `search-card-${coupon.id}-${idx}`, true)}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center space-y-2">
              <p className="text-sm text-gray-300 font-semibold">
                Nenhuma oferta encontrada para os filtros selecionados.
              </p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Tente buscar por marcas como <strong>Shopee</strong>, <strong>Magazine Luiza</strong>, <strong>Amazon</strong>, ou trocar de grupo.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveGroup('all');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5F00] hover:bg-[#E04F00] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Todas as Ofertas
              </button>
            </div>
          )}
        </div>
      ) : (
        /* MODO PADRÃO: 5 LINHAS DE OFERTAS PASSANDO HORIZONTALMENTE COM VELOCIDADE LENTA */
        <div className="relative z-10 space-y-3 sm:space-y-3.5 py-1 overflow-hidden">
          
          {/* Efeito de fade lateral (vignette) nas bordas esquerda e direita */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#14141E] via-[#14141E]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#14141E] via-[#14141E]/80 to-transparent z-20" />

          {/* LINHA 1 - Velocidade Lenta 180s */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-3.5 items-center animate-marquee-row-1"
              style={{ willChange: 'transform' }}
            >
              {row1.map((coupon, idx) => renderCard(coupon, `row1-${coupon.id}-${idx}`))}
            </div>
          </div>

          {/* LINHA 2 - Velocidade Lenta 210s */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-3.5 items-center animate-marquee-row-2"
              style={{ willChange: 'transform' }}
            >
              {row2.map((coupon, idx) => renderCard(coupon, `row2-${coupon.id}-${idx}`))}
            </div>
          </div>

          {/* LINHA 3 - Velocidade Lenta 165s */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-3.5 items-center animate-marquee-row-3"
              style={{ willChange: 'transform' }}
            >
              {row3.map((coupon, idx) => renderCard(coupon, `row3-${coupon.id}-${idx}`))}
            </div>
          </div>

          {/* LINHA 4 - Velocidade Lenta 195s */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-3.5 items-center animate-marquee-row-4"
              style={{ willChange: 'transform' }}
            >
              {row4.map((coupon, idx) => renderCard(coupon, `row4-${coupon.id}-${idx}`))}
            </div>
          </div>

          {/* LINHA 5 - Velocidade Lenta 175s */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-3.5 items-center animate-marquee-row-5"
              style={{ willChange: 'transform' }}
            >
              {row5.map((coupon, idx) => renderCard(coupon, `row5-${coupon.id}-${idx}`))}
            </div>
          </div>

        </div>
      )}

      {/* Rodapé informativo */}
      <div className="relative z-10 mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span><strong>Dica VIP:</strong> Pesquise qualquer produto ou loja no campo acima ou passe o mouse sobre os cupons para pausar!</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck size={13} />
          <span>Links verificados com SubID seguro e comissão garantida</span>
        </div>
      </div>

    </section>
  );
};
