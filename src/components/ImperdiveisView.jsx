import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ExternalLink, 
  Share2, 
  Search, 
  Flame, 
  Tag, 
  Truck, 
  Star, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  ShoppingBag,
  Lock,
  Crown
} from 'lucide-react';
import { BRAND_LOGOS } from '../assets/brands';

export const ImperdiveisView = () => {
  const { 
    hotDeals = [], 
    isVipUser, 
    setIsSubscriptionModalOpen 
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('discount'); // 'discount' | 'price_asc' | 'popular'
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'all', label: '🔥 Todas as Ofertas', icon: 'Flame' },
    { id: 'tech', label: '📱 Tecnologia & Gadgets', icon: 'Zap' },
    { id: 'casa', label: '🏠 Casa & Cozinha', icon: 'Home' },
    { id: 'beleza', label: '💄 Beleza & Skincare', icon: 'Sparkles' },
    { id: 'moda', label: '✈️ Moda & Viagem', icon: 'ShoppingBag' }
  ];

  const filteredDeals = useMemo(() => {
    return hotDeals
      .filter(deal => {
        const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          deal.title.toLowerCase().includes(q) || 
          (deal.categoryLabel && deal.categoryLabel.toLowerCase().includes(q)) ||
          (deal.description && deal.description.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        if (sortBy === 'price_asc') return a.promoPrice - b.promoPrice;
        if (sortBy === 'popular') return (parseFloat(b.salesCount) || 0) - (parseFloat(a.salesCount) || 0);
        return 0;
      });
  }, [hotDeals, selectedCategory, searchQuery, sortBy]);

  const handleShareWhatsApp = (deal) => {
    const text = `🔥 *OFERTA IMPERDÍVEL SHOPEE* 🔥\n\n*${deal.title}*\n\n❌ De: R$ ${deal.originalPrice.toFixed(2).replace('.', ',')}\n✅ *Por apenas: R$ ${deal.promoPrice.toFixed(2).replace('.', ',')} (${deal.discountBadge})*\n\n🚚 Frete Grátis Shopee\n⭐ Avaliação: ${deal.rating} estrelas\n\n👉 Aproveite antes que acabe: ${deal.affiliateUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = (deal) => {
    navigator.clipboard.writeText(deal.affiliateUrl);
    setCopiedId(deal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* 1. HERO BANNER DAS OFERTAS IMPERDÍVEIS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B1005] via-[#1B0B04] to-[#120803] border-2 border-orange-500/60 p-6 sm:p-10 shadow-2xl shadow-orange-950/70">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5F00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5F00] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-600/40 animate-pulse">
                <Flame size={14} />
                <span>OFERTAS IMPERDÍVEIS</span>
              </span>
              <span className="text-xs bg-white/10 text-orange-200 border border-white/15 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <img src={BRAND_LOGOS.shopee} alt="Shopee" className="h-3.5 w-auto object-contain" />
                <span>Achadinhos & Ofertas Oficiais Shopee</span>
              </span>
              <span className="text-[11px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock size={11} />
                <span>Atualizado Hoje</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight tracking-tight">
              Os Achadinhos Mais Desejados com até <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">70% de Desconto</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Produtos virais, utilidades inteligentes, gadgets e cosméticos selecionados a dedo pelo nosso robô de ofertas com os maiores descontos da Shopee Brasil e frete grátis garantido.
            </p>
          </div>

          {/* Destaque / Estatística do Robô */}
          <div className="bg-black/50 border border-orange-500/40 rounded-2xl p-5 text-center sm:text-left flex flex-row lg:flex-col items-center lg:items-start justify-between gap-4 backdrop-blur-md">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Robô de Ofertas Shopee</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display flex items-baseline gap-1 mt-0.5">
                <span>{hotDeals.length}</span>
                <span className="text-xs font-bold text-orange-400">Produtos no Ar</span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              <CheckCircle2 size={13} />
              <span>Links Verificados com Frete Grátis</span>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER DE BLOQUEIO / CONVITE VIP QUANDO O USUÁRIO NÃO É ASSINANTE */}
      {!isVipUser && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-600/25 to-[#1c110b] border-2 border-[#FF5F00] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-950/60 relative overflow-hidden animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-[#FF5F00] text-black font-black flex items-center justify-center text-2xl shadow-lg shadow-orange-600/40 flex-shrink-0">
                <Crown size={28} className="text-white fill-white" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 bg-[#FF5F00] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  <Lock size={11} />
                  <span>Benefício Exclusivo para Assinantes VIP</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Desbloqueie os Links e Descontos Secretos da Shopee
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                  As Ofertas Imperdíveis são garimpadas diariamente com até 70% de desconto pelo nosso robô e estão disponíveis apenas para membros com assinatura ativa.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white font-extrabold px-6 py-4 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-600/40 transition-all transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              <Sparkles size={18} className="text-amber-200" />
              <span>Assinar VIP por R$ 19,90/mês para Liberar</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. BARRA DE BUSCA, CATEGORIAS & ORDENAÇÃO */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Busca de Produtos */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por smartwatch, fone, mini processador, organizador, câmera..."
              className="w-full bg-[#161622] border border-white/10 focus:border-orange-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 transition-colors focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-white/10 px-2 py-0.5 rounded-md"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Seletor de Ordenação */}
          <div className="flex items-center gap-2 bg-[#161622] border border-white/10 rounded-2xl px-3 py-2">
            <Filter size={14} className="text-orange-400" />
            <span className="text-xs text-gray-400 font-bold hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="discount" className="bg-[#161622]">Maior Desconto (%)</option>
              <option value="price_asc" className="bg-[#161622]">Menor Preço (R$)</option>
              <option value="popular" className="bg-[#161622]">Mais Vendidos</option>
            </select>
          </div>
        </div>

        {/* Pílulas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-[#161622] text-gray-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. GRID DE OFERTAS IMPERDÍVEIS */}
      {filteredDeals.length === 0 ? (
        <div className="bg-[#161622] border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-black text-white">Nenhuma oferta encontrada para essa busca</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Tente pesquisar por outros termos como "fone", "smartwatch", "cozinha" ou limpe os filtros.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="bg-[#FF5F00] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Ver Todas as Ofertas Imperdíveis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="group bg-[#151522] border border-white/10 hover:border-orange-500/60 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              {/* Badge de Destaque Superior */}
              {deal.tag && (
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-[10px] font-black uppercase text-white px-2.5 py-1 rounded-full shadow-lg ${deal.badgeColor || 'bg-red-500'} flex items-center gap-1`}>
                    {deal.tag}
                  </span>
                </div>
              )}

              {/* Selo de Desconto Flutuante */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-black/85 text-amber-300 border border-amber-400/40 text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-md shadow-md">
                  {deal.discountBadge}
                </span>
              </div>

              {/* Imagem do Produto */}
              <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                <img
                  src={deal.image}
                  alt={deal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = '1';
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&auto=format&fit=crop&q=80';
                    }
                  }}
                />
                {deal.freeShipping && (
                  <div className="absolute bottom-2 left-2 bg-emerald-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm">
                    <Truck size={12} />
                    <span>Frete Grátis</span>
                  </div>
                )}
              </div>

              {/* Corpo da Oferta */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-orange-400/90">{deal.categoryLabel}</span>
                      <span className="text-gray-600">•</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        deal.store && deal.store.toLowerCase().includes('magalu') 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {deal.store || 'Shopee Oficial'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{deal.rating}</span>
                      <span className="text-gray-500">({deal.salesCount})</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-black text-white leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {deal.title}
                  </h3>

                  {deal.description && (
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {deal.description}
                    </p>
                  )}
                </div>

                {/* Preços e Economia */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-400 line-through">
                      De R$ {deal.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Economize R$ {deal.savings.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-[11px] text-gray-300 font-bold">Por</span>
                    <span className="text-2xl font-black text-white font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200">
                      R$ {deal.promoPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-2 flex items-center gap-2">
                  {isVipUser ? (
                    <>
                      <a
                        href={deal.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-[#FF5F00] via-[#FF7700] to-[#FF8C00] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                      >
                        <span>Pegar Oferta</span>
                        <ExternalLink size={13} />
                      </a>

                      {/* Compartilhar no WhatsApp */}
                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(deal)}
                        title="Compartilhar oferta no WhatsApp"
                        className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                      >
                        <Share2 size={15} />
                      </button>

                      {/* Copiar Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(deal)}
                        title="Copiar Link de Afiliado"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === deal.id ? <Check size={15} className="text-emerald-400" /> : <Tag size={15} />}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-[#FF5F00] hover:to-amber-500 text-amber-300 hover:text-white border border-amber-500/40 hover:border-[#FF5F00] font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-orange-600/30"
                    >
                      <Lock size={14} className="text-amber-400" />
                      <span>Desbloquear Oferta com Assinatura VIP</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. BANNER INFORMATIVO DE TRANSPARÊNCIA */}
      <div className="bg-[#14141E] border border-white/10 rounded-3xl p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-orange-400">
          <Sparkles size={16} />
          <span>Como funciona a curadoria de Ofertas Imperdíveis?</span>
        </div>
        <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
          O robô do <strong>Melhor Cupom</strong> monitora diariamente os produtos mais vendidos e com maiores avaliações positivas na Shopee Brasil. Ao clicar no produto, você é redirecionado com segurança para o vendedor oficial e garante cupons de frete grátis aplicáveis no app.
        </p>
      </div>

    </div>
  );
};
