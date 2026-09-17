import React, { useRef, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Sparkles, 
  ExternalLink, 
  Coins, 
  Globe, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const BigStoresShowcase = ({ onSelectCoupon, onSelectStore }) => {
  const { stores, coupons } = useApp();
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filtrar exclusivamente cupons das grandes lojas / APIs oficiais
  const bigStoreCoupons = useMemo(() => {
    return coupons.filter(c => {
      const store = stores.find(s => s.id === c.storeId);
      return c.isApiIntegrated || c.apiSource || store?.isApiIntegrated;
    });
  }, [coupons, stores]);

  // Duplicar para looping contínuo suave da direita para a esquerda
  const carouselCoupons = useMemo(() => {
    if (bigStoreCoupons.length === 0) return [];
    return [...bigStoreCoupons, ...bigStoreCoupons];
  }, [bigStoreCoupons]);

  // Controles Manuais de Navegação
  const handleScrollManual = (direction) => {
    if (!scrollContainerRef.current) return;
    const distance = direction === 'left' ? -360 : 360;
    scrollContainerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  if (bigStoreCoupons.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-[#14141E] via-[#111119] to-[#0D0D13] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header da Vitrine de Cupons das Grandes Lojas */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cupons Online Oficiais</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Coins size={12} className="text-amber-400" />
              <span>Cashback Ativado</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-blue-300 font-medium bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              <Globe size={12} className="text-blue-400" />
              <span>Awin • Lomadee • Shopee • Mercado Livre</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex flex-wrap items-center gap-2.5">
            <span>Cupons das Grandes Lojas & E-commerces</span>
            <span className="text-xs bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Ao Vivo
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Ofertas verificadas e cashback exclusivo passando em tempo real diretamente das APIs das maiores redes do Brasil.
          </p>
        </div>

        {/* Controles de Navegação e Status */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden lg:block mr-2">
            <div className="text-[11px] text-gray-400">Latência das APIs</div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>42ms • 100% Online</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleScrollManual('left')}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Rolar para a esquerda"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScrollManual('right')}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Rolar para a direita"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Faixa / Track Carrossel Horizontal: Cupons passando da direita para a esquerda */}
      <div 
        className="relative z-10 overflow-x-auto scrollbar-none py-2"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          className={`flex gap-4 items-stretch ${isPaused ? 'animate-marquee-paused' : 'animate-marquee-left'}`}
          style={{ willChange: 'transform' }}
        >
          {carouselCoupons.map((coupon, index) => {
            const store = stores.find(s => s.id === coupon.storeId);
            const apiSource = coupon.apiSource || store?.apiSource || 'API Oficial';
            const cashbackRate = coupon.cashbackRate || store?.cashbackRate || 'Até 8.0% de Volta';
            const couponCode = coupon.codePrefix || 'MELHORVIP';

            return (
              <div
                key={`${coupon.id}-${index}`}
                onClick={() => onSelectCoupon && onSelectCoupon(coupon)}
                className="w-[320px] sm:w-[355px] flex-shrink-0 bg-[#161623] hover:bg-[#1B1B2B] border border-white/10 hover:border-[#FF5F00]/70 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-950/40 cursor-pointer group relative overflow-hidden"
              >
                {/* Efeito Glow Interno */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-[#FF5F00]/15 transition-all pointer-events-none" />

                {/* Topo do Card: Loja e Origem da API */}
                <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner group-hover:border-[#FF5F00]/40 transition-colors">
                      {store?.logoImage ? (
                        <>
                          <img 
                            src={store.logoImage} 
                            alt={store?.name || 'Loja'} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                              if (fb) fb.style.display = 'flex';
                            }}
                          />
                          <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-lg">
                            {store?.logo || '🛍️'}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg">{store?.logo || '🛍️'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                        {store?.name || 'Loja Parceira'}
                      </h4>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Globe size={10} className="text-blue-400" />
                        <span>Online (Todo Brasil)</span>
                      </span>
                    </div>
                  </div>

                  {/* Badge da API */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wide flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{apiSource}</span>
                  </span>
                </div>

                {/* Banner Miniatura com Tag de Desconto e Cashback */}
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-black/50 z-10">
                  <img 
                    src={coupon.banner || store?.image || 'https://images.unsplash.com/photo-1523474255658-40e4509be0d8?w=500&auto=format&fit=crop&q=80'} 
                    alt={coupon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Desconto em Destaque */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                      <Tag size={12} />
                      <span>{coupon.discountBadge}</span>
                    </span>
                  </div>

                  {/* Pill de Cashback */}
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-emerald-300/40">
                      <Coins size={12} />
                      <span>{cashbackRate}</span>
                    </span>
                  </div>
                </div>

                {/* Título da Oferta */}
                <div className="mb-3 relative z-10">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-orange-300 line-clamp-2 leading-snug transition-colors">
                    {coupon.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">
                    {coupon.description}
                  </p>
                </div>

                {/* Código Promocional + Botão de Ação */}
                <div className="space-y-2 pt-2 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-between bg-black/60 px-2.5 py-1.5 rounded-xl border border-orange-500/30">
                    <div className="text-[10px] text-gray-400 font-medium">CÓDIGO:</div>
                    <div className="font-mono text-xs font-black text-orange-400 tracking-wider">
                      {couponCode}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCoupon) onSelectCoupon(coupon);
                    }}
                    className="w-full bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white text-xs font-extrabold py-2.5 px-3 rounded-xl transition-all shadow-md shadow-orange-950/40 flex items-center justify-center gap-1.5 group-hover:shadow-orange-600/30 cursor-pointer"
                  >
                    <span>Pegar Cupom & Ir para a Loja</span>
                    <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Dica no Rodapé da Vitrine */}
      <div className="relative z-10 mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span><strong>Dica VIP:</strong> Os cupons passam automaticamente da direita para a esquerda. Passe o mouse sobre qualquer cupom para pausar!</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck size={13} />
          <span>Links oficiais rastreados com SubID seguro</span>
        </div>
      </div>

    </section>
  );
};
