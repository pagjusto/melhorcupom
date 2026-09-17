import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ExternalLink, 
  Coins, 
  Globe, 
  Tag, 
  ShieldCheck,
  Pause,
  Play
} from 'lucide-react';

export const BigStoresShowcase = ({ onSelectCoupon, onSelectStore }) => {
  const { stores, coupons } = useApp();
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);

  // Filtrar exclusivamente cupons das grandes lojas / APIs oficiais
  const bigStoreCoupons = useMemo(() => {
    return coupons.filter(c => {
      const store = stores.find(s => s.id === c.storeId);
      return c.isApiIntegrated || c.apiSource || store?.isApiIntegrated;
    });
  }, [coupons, stores]);

  // Distribuir os cupons em 3 linhas distintas
  const { row1, row2, row3 } = useMemo(() => {
    const r1 = [];
    const r2 = [];
    const r3 = [];

    bigStoreCoupons.forEach((coupon, index) => {
      const remainder = index % 3;
      if (remainder === 0) r1.push(coupon);
      else if (remainder === 1) r2.push(coupon);
      else r3.push(coupon);
    });

    // Função auxiliar para duplicar a lista garantindo looping infinito contínuo e suave
    const duplicateForLoop = (list) => {
      if (list.length === 0) return [];
      // Repete 4 vezes para preencher larguras de tela ultra-wide sem cortes
      return [...list, ...list, ...list, ...list];
    };

    return {
      row1: duplicateForLoop(r1),
      row2: duplicateForLoop(r2),
      row3: duplicateForLoop(r3)
    };
  }, [bigStoreCoupons]);

  if (bigStoreCoupons.length === 0) return null;

  // Renderizador de Card Compacto de Oferta
  const renderCompactCard = (coupon, key) => {
    const store = stores.find(s => s.id === coupon.storeId);
    const apiSource = coupon.apiSource || store?.apiSource || 'API Oficial';
    const cashbackRate = coupon.cashbackRate || store?.cashbackRate || 'Até 8.0% de Volta';
    const couponCode = coupon.codePrefix || 'MELHORVIP';

    return (
      <div
        key={key}
        onClick={() => onSelectCoupon && onSelectCoupon(coupon)}
        className="w-[290px] sm:w-[335px] h-[72px] sm:h-[76px] flex-shrink-0 bg-[#151522]/95 hover:bg-[#1C1C2E] border border-white/10 hover:border-[#FF5F00]/80 rounded-2xl px-3 py-2 flex items-center justify-between gap-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-950/40 cursor-pointer group relative overflow-hidden select-none"
      >
        {/* Efeito Glow sutil no canto do card ao passar o mouse */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-[#FF5F00]/20 transition-all pointer-events-none" />

        {/* 1. Logo / Avatar da Grande Loja */}
        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#FF5F00]/50 transition-colors shadow-inner relative z-10">
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
              <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-base">
                {store?.logo || '🛍️'}
              </span>
            </>
          ) : (
            <span className="text-base">{store?.logo || '🛍️'}</span>
          )}
        </div>

        {/* 2. Informações Principais: Nome da Loja, Origem da API, Título e Cashback */}
        <div className="min-w-0 flex-1 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate max-w-[130px] sm:max-w-[150px]">
              {store?.name || 'Loja Parceira'}
            </h4>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold tracking-tight flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>{apiSource}</span>
            </span>
          </div>

          {/* Título da Oferta em linha única concisa */}
          <p className="text-[11px] font-medium text-gray-200 group-hover:text-white truncate leading-tight mt-0.5" title={coupon.title}>
            {coupon.title}
          </p>

          {/* Cashback & Cupom Preview */}
          <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <Coins size={10} className="text-amber-400" />
              <span>{cashbackRate}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="font-mono text-orange-300/90 font-bold text-[10px] bg-black/40 px-1 rounded border border-orange-500/20">
              {couponCode}
            </span>
          </div>
        </div>

        {/* 3. Badge de Desconto & Ação */}
        <div className="flex flex-col items-end justify-center flex-shrink-0 gap-1 relative z-10">
          <span className="bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-black text-[11px] sm:text-xs px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-0.5">
            <Tag size={10} />
            <span>{coupon.discountBadge}</span>
          </span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-orange-400 transition-colors">
            <span className="font-semibold hidden sm:inline">Pegar</span>
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
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3 Linhas de Ofertas Ao Vivo</span>
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

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-display flex flex-wrap items-center gap-2.5">
            <span>Cupons das Grandes Lojas & E-commerces</span>
            <span className="text-xs bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Ao Vivo
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Ofertas compactas passando continuamente em 3 faixas simultâneas com cupons oficiais e cashback ativado.
          </p>
        </div>

        {/* Status de Sincronização e Botão Pausar/Reproduzir */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden lg:block mr-2">
            <div className="text-[11px] text-gray-400">Status das APIs</div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>42ms • 100% Online</span>
            </div>
          </div>

          <button
            onClick={() => setIsGlobalPaused(!isGlobalPaused)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            title={isGlobalPaused ? 'Retomar movimento contínuo' : 'Pausar movimento'}
          >
            {isGlobalPaused ? (
              <>
                <Play size={14} className="text-emerald-400 fill-emerald-400" />
                <span>Continuar</span>
              </>
            ) : (
              <>
                <Pause size={14} className="text-amber-400 fill-amber-400" />
                <span>Pausar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TRACK DAS 3 LINHAS DE OFERTAS PASSANDO HORIZONTALMENTE */}
      <div className="relative z-10 space-y-2.5 sm:space-y-3 py-1 overflow-hidden">
        
        {/* Efeito de fade lateral (vignette) nas bordas esquerda e direita */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#14141E] via-[#14141E]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#14141E] via-[#14141E]/80 to-transparent z-20" />

        {/* LINHA 1 - Velocidade 45s */}
        <div className="overflow-hidden">
          <div 
            className={`flex gap-3 items-center ${isGlobalPaused ? 'animate-marquee-paused' : 'animate-marquee-row-1'}`}
            style={{ willChange: 'transform' }}
          >
            {row1.map((coupon, idx) => renderCompactCard(coupon, `row1-${coupon.id}-${idx}`))}
          </div>
        </div>

        {/* LINHA 2 - Velocidade 38s (movimento ligeiramente mais rápido) */}
        <div className="overflow-hidden">
          <div 
            className={`flex gap-3 items-center ${isGlobalPaused ? 'animate-marquee-paused' : 'animate-marquee-row-2'}`}
            style={{ willChange: 'transform' }}
          >
            {row2.map((coupon, idx) => renderCompactCard(coupon, `row2-${coupon.id}-${idx}`))}
          </div>
        </div>

        {/* LINHA 3 - Velocidade 42s (cadência alternada) */}
        <div className="overflow-hidden">
          <div 
            className={`flex gap-3 items-center ${isGlobalPaused ? 'animate-marquee-paused' : 'animate-marquee-row-3'}`}
            style={{ willChange: 'transform' }}
          >
            {row3.map((coupon, idx) => renderCompactCard(coupon, `row3-${coupon.id}-${idx}`))}
          </div>
        </div>

      </div>

      {/* Rodapé informativo */}
      <div className="relative z-10 mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span><strong>Dica VIP:</strong> Passe o mouse sobre qualquer cupom para congelar e ver detalhes. Clique no card para resgatar!</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck size={13} />
          <span>Links verificados com SubID seguro e comissão garantida</span>
        </div>
      </div>

    </section>
  );
};
