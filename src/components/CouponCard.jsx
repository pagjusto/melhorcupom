import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Sparkles, 
  MapPin, 
  Globe, 
  Clock, 
  Heart, 
  ArrowUpRight, 
  Tag
} from 'lucide-react';

export const CouponCard = ({ coupon, store, onSelectCoupon }) => {
  const { isVipUser, userProfile, toggleFavorite, setIsSubscriptionModalOpen } = useApp();

  const isFavorite = userProfile.savedCouponIds.includes(coupon.id);

  const handleAction = () => {
    if (!isVipUser) {
      setIsSubscriptionModalOpen(true);
    } else {
      onSelectCoupon(coupon);
    }
  };

  const bannerImage = coupon.banner || store?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80';
  const storeLogo = store?.logoImage;

  return (
    <div className="ticket-card flex flex-col justify-between group overflow-hidden">
      
      {/* 1. BANNER DA OFERTA (definido no card / upload do lojista) */}
      <div className="relative h-44 w-full overflow-hidden bg-black/60">
        <img
          src={bannerImage}
          alt={coupon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17171E] via-transparent to-black/40" />

        {/* Tag de Desconto no Topo do Banner */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white px-3 py-1 rounded-xl font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-orange-950/60 flex items-center gap-1">
            <Tag size={13} />
            <span>{coupon.discountBadge}</span>
          </div>
        </div>

        {/* Botão de Favoritar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(coupon.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            isFavorite
              ? 'text-red-500 bg-black/60 shadow-md'
              : 'text-white/80 hover:text-white bg-black/40 hover:bg-black/60'
          }`}
          title="Favoritar cupom"
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* 2. LOGO DA EMPRESA (definida no perfil do lojista) */}
        <div className="absolute -bottom-3 left-4 w-12 h-12 rounded-xl bg-[#181822] border-2 border-[#FF5F00] shadow-xl flex items-center justify-center overflow-hidden z-20">
          {storeLogo ? (
            <img 
              src={storeLogo} 
              alt={store?.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-2xl">{store?.logo || '🏪'}</span>
          )}
        </div>

        {/* Modalidade / Cidade badge no banner */}
        <div className="absolute bottom-2 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-[11px] font-bold text-gray-200 px-2.5 py-0.5 rounded-full border border-white/10">
            {coupon.type === 'physical' ? (
              <>
                <MapPin size={11} className="text-[#FF5F00]" />
                <span className="max-w-[130px] truncate">{store?.city || coupon.city || 'Loja Física'}</span>
              </>
            ) : (
              <>
                <Globe size={11} className="text-blue-400" />
                <span>Online (Todo Brasil)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-5 pt-5 pb-4">
        
        {/* Identificação da Loja */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider line-clamp-1">
            {store?.name || 'Loja Parceira'}
          </span>
          {store?.rating && (
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-0.5">
              ★ {store.rating}
            </span>
          )}
        </div>

        {/* Título da Oferta */}
        <h3 className="text-base font-black text-white leading-snug mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
          {coupon.title}
        </h3>

        {/* Descrição curta */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {coupon.description}
        </p>

        {/* Economia Estimada */}
        <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-white/5 rounded-xl text-gray-300 border border-white/5">
          <span className="text-gray-400">Economia estimada:</span>
          <span className="font-extrabold text-emerald-400">
            R$ {(coupon.estimatedSavings || 25).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Linha de Perfuração Perfurada com Recortes Laterais estilo Cupom */}
      <div className="ticket-perforation my-1">
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />
      </div>

      {/* Bottom Footer & Ação */}
      <div className="p-5 pt-3 bg-[#13131A]">
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Válido até {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="font-medium text-orange-400/80">
            {coupon.usesCount || 0} resgatados
          </span>
        </div>

        {/* Botão de Resgate ou Paywall */}
        {isVipUser ? (
          <button
            onClick={handleAction}
            className="w-full bg-[#FF5F00] hover:bg-[#E55400] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01]"
          >
            <span>🎟️ Resgatar Cupom VIP</span>
            <ArrowUpRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleAction}
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#2A1810] to-[#1E1712] hover:from-[#351E14] hover:to-[#281E17] border border-[#FF5F00]/50 text-orange-300 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:border-[#FF5F00] shadow-sm"
          >
            <Lock size={13} className="text-[#FF5F00]" />
            <span>Exclusivo VIP • Desbloquear Cupom</span>
          </button>
        )}
      </div>

    </div>
  );
};
