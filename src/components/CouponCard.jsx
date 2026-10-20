import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Sparkles, 
  MapPin, 
  Globe, 
  Clock, 
  Heart, 
  ArrowUpRight, 
  Tag, 
  Crown, 
  Award, 
  Medal, 
  Users, 
  Eye, 
  Coins, 
  Zap, 
  ExternalLink,
  Pencil
} from 'lucide-react';
import { getBrandLogo } from '../assets/brands';
import { getCouponBanner } from '../utils/bannerResolver';
import { AdminEditOfferBannerModal } from './AdminEditOfferBannerModal';

export const CouponCard = ({ coupon, store, onSelectCoupon }) => {
  const { 
    isVipUser, 
    userProfile, 
    redemptions, 
    toggleFavorite, 
    setIsSubscriptionModalOpen, 
    recordCouponView,
    currentRole 
  } = useApp();

  const [isEditingBanner, setIsEditingBanner] = useState(false);

  const isFavorite = userProfile.savedCouponIds.includes(coupon.id);
  // Regra de Negócio: Apenas parceiros com adminPaidPlan ativo possuem plano (Bronze, Prata, Ouro).
  // Sem plano pago explicitamente aprovado, o cupom não exibe badge ou medalha de plano.
  const isExplicitPaid = Boolean(
    store?.adminPaidPlan && 
    (store?.tier === 'gold' || store?.tier === 'silver' || store?.tier === 'bronze')
  );
  const storeTier = isExplicitPaid ? store.tier : 'free';

  // Verificar histórico de resgates deste cupom pelo usuário logado
  const userUsesCount = redemptions?.filter(r => 
    r.couponId === coupon.id && 
    (r.userName === userProfile.name || (userProfile.cpf && r.userCpf === userProfile.cpf))
  ).length || 0;

  const maxUses = coupon.maxUsesPerUser;
  const isLimited = maxUses !== null && maxUses !== undefined && maxUses !== '' && maxUses !== 0 && maxUses !== 'unlimited';
  const isLimitReached = isVipUser && isLimited && userUsesCount >= maxUses;

  const handleAction = () => {
    if (recordCouponView) {
      recordCouponView(coupon.id);
    }
    if (!isVipUser) {
      setIsSubscriptionModalOpen(true);
    } else {
      onSelectCoupon(coupon);
    }
  };

  const storeName = coupon.storeName || store?.name || 'Loja Parceira';
  const brandLogo = getBrandLogo(coupon.storeId) || 
                    getBrandLogo(storeName) || 
                    getBrandLogo(coupon.apiSource) || 
                    getBrandLogo(store?.id) || 
                    getBrandLogo(store?.name);

  const customLogo = (coupon.customStoreLogoImage || 
                      (typeof coupon.logoImage === 'string' && coupon.logoImage.startsWith('data:') ? coupon.logoImage : null) || 
                      (typeof coupon.storeLogo === 'string' && coupon.storeLogo.startsWith('data:') ? coupon.storeLogo : null));

  const storeLogo = (coupon.isAvulso && customLogo)
    ? customLogo
    : (brandLogo || customLogo || coupon.storeLogoImage || coupon.logoImage || store?.logoImage);
  const bannerImage = getCouponBanner(coupon, store);

  const isHighlighted = Boolean(coupon.highlight || store?.highlight || store?.isFeatured);

  // Efeito Visual de Destaque:
  // Se estiver em DESTAQUE (o cupom ou a loja parceira), recebe a aura e borda luminosa Ouro de Destaque VIP.
  // Caso não esteja em destaque, segue estritamente o plano do parceiro (Gold, Silver, Bronze, Free).
  const visualTier = (isHighlighted || storeTier === 'gold') ? 'gold' : storeTier;

  const tierConfig = {
    gold: {
      cardClass: 'ticket-card-gold ring-1 ring-amber-400/60 shadow-[0_4px_20px_rgba(245,158,11,0.2)]',
      logoBorder: 'border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
      auraBg: 'bg-gradient-to-b from-amber-400/15 via-transparent to-amber-500/15',
    },
    silver: {
      cardClass: 'ticket-card-silver ring-1 ring-slate-300/35 shadow-[0_4px_20px_rgba(203,213,225,0.12)]',
      logoBorder: 'border-2 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.5)]',
      auraBg: 'bg-gradient-to-b from-slate-200/12 via-transparent to-slate-300/12',
    },
    bronze: {
      cardClass: 'ticket-card-bronze ring-1 ring-[#CD7F32]/40 shadow-[0_4px_20px_rgba(205,127,50,0.12)]',
      logoBorder: 'border-2 border-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.6)]',
      auraBg: 'bg-gradient-to-b from-[#CD7F32]/12 via-transparent to-[#CD7F32]/15',
    },
    free: {
      cardClass: 'ticket-card-free border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
      // Borda de Free é expressamente branca:
      logoBorder: 'border-2 border-white shadow-md',
      auraBg: null, // Menos free: sem aura no hover
    }
  }[visualTier] || {
    cardClass: 'ticket-card-free border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
    logoBorder: 'border-2 border-white shadow-md',
    auraBg: null,
  };

  return (
    <div className={`ticket-card flex flex-col justify-between group overflow-hidden transition-all duration-300 relative ${tierConfig.cardClass}`}>
      
      {/* Aura Luminosa interna no Hover (Apenas Gold, Silver, Bronze - Menos Free) */}
      {tierConfig.auraBg && (
        <div className={`absolute inset-0 ${tierConfig.auraBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10`} />
      )}
      
      {/* 1. BANNER DA OFERTA (Foto de Capa Real e Vibrante) */}
      <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-black">
        <img
          src={bannerImage}
          alt={coupon.title}
          style={{
            objectFit: coupon.bannerFit || 'cover',
            objectPosition: coupon.bannerPosition || 'center',
            transform: coupon.bannerScale && coupon.bannerScale !== 100 ? `scale(${coupon.bannerScale / 100})` : undefined
          }}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17171E] via-transparent to-black/40 pointer-events-none" />

        {/* Tag de Desconto no Topo do Banner */}
        <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1 items-start">
          {isHighlighted && (
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black px-1.5 py-0.5 rounded-md font-black text-[9px] tracking-tight shadow-md flex items-center gap-1 animate-pulse">
              <Crown size={9} />
              <span>DESTAQUE</span>
            </div>
          )}
          <div className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white px-2 py-0.5 rounded-md font-black text-[10px] sm:text-[11px] tracking-tight shadow-md flex items-center gap-1">
            <Tag size={10} />
            <span>{coupon.discountBadge}</span>
          </div>
        </div>

        {/* Topo Direito: Ícone de Medalha do Plano da Loja + Botão ADM Editar Capa + Botão de Favoritar */}
        <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1">
          {/* Botão ADM para editar capa da oferta */}
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingBanner(true);
              }}
              className="p-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-md border border-white/30 transition-all hover:scale-115 cursor-pointer z-30"
              title="Editar capa e enquadramento desta oferta"
            >
              <Pencil size={11} />
            </button>
          )}

          {/* Ícone da Medalha na cor da assinatura da loja parceira ou Coroa de Destaque */}
          {isHighlighted && (
            <div 
              className="p-1 rounded-md backdrop-blur-md bg-black/60 border border-amber-400/60 shadow-sm text-amber-400 flex items-center justify-center transition-transform hover:scale-105"
              title="Oferta em Destaque"
            >
              <Crown size={12} className="text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]" />
            </div>
          )}

          {!isHighlighted && isExplicitPaid && storeTier === 'gold' && (
            <div 
              className="p-1 rounded-md backdrop-blur-md bg-black/60 border border-amber-400/60 shadow-sm text-amber-400 flex items-center justify-center transition-transform hover:scale-105"
              title="Loja Parceira Ouro"
            >
              <Crown size={12} className="text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]" />
            </div>
          )}

          {!isHighlighted && isExplicitPaid && storeTier === 'silver' && (
            <div 
              className="p-1 rounded-md backdrop-blur-md bg-black/60 border border-slate-300/50 shadow-sm text-slate-300 flex items-center justify-center transition-transform hover:scale-105"
              title="Loja Parceira Prata"
            >
              <Medal size={12} className="text-slate-300 drop-shadow-[0_0_4px_rgba(203,213,225,0.4)]" />
            </div>
          )}

          {!isHighlighted && isExplicitPaid && storeTier === 'bronze' && (
            <div 
              className="p-1 rounded-md backdrop-blur-md bg-black/60 border border-[#CD7F32]/60 shadow-sm text-[#CD7F32] flex items-center justify-center transition-transform hover:scale-105"
              title="Loja Parceira Bronze"
            >
              <Medal size={12} className="text-[#CD7F32] drop-shadow-[0_0_4px_rgba(205,127,50,0.7)]" />
            </div>
          )}

          {/* Botão de Favoritar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(coupon.id);
            }}
            className={`p-1 rounded-md backdrop-blur-md transition-all ${
              isFavorite
                ? 'text-red-500 bg-black/60 shadow-sm'
                : 'text-white/80 hover:text-white bg-black/40 hover:bg-black/60'
            }`}
            title="Favoritar cupom"
          >
            <Heart size={12} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* 2. LOGO DA EMPRESA COM BORDA RESPECTIVA DA ASSINATURA */}
        {(() => {
          const isDarkLogo = Boolean(
            typeof storeLogo === 'string' && (storeLogo.includes('omens') || storeLogo.includes('boteco') || storeLogo.includes('corleone') || storeLogo.includes('trackfield'))
          );
          return (
            <div className={`absolute bottom-1.5 left-2 w-8 h-8 rounded-lg shadow-lg flex items-center justify-center overflow-hidden z-20 ${tierConfig.logoBorder} ${
              isDarkLogo ? 'bg-[#12121A]' : 'bg-white'
            }`}>
              {storeLogo ? (
                <>
                  <img 
                    src={storeLogo} 
                    alt={storeName} 
                    className="w-full h-full object-contain p-0.5 rounded-md"
                    onError={(e) => {
                      if (brandLogo && e.currentTarget.src !== brandLogo) {
                        e.currentTarget.src = brandLogo;
                      } else {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.card-logo-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <span className="card-logo-fallback hidden w-full h-full items-center justify-center text-sm bg-white text-black">
                    {store?.logo || '🏪'}
                  </span>
                </>
              ) : (
                <span className="text-base">{store?.logo || '🏪'}</span>
              )}
            </div>
          );
        })()}

        {/* Modalidade / Cidade badge no banner */}
        <div className="absolute bottom-1.5 right-1.5 z-10">
          <span className="inline-flex items-center gap-0.5 bg-black/70 backdrop-blur-md text-[9px] font-bold text-gray-200 px-1.5 py-0.5 rounded-full border border-white/10">
            {coupon.type === 'physical' ? (
              <>
                <MapPin size={9} className="text-[#FF5F00]" />
                <span className="max-w-[100px] truncate">{store?.city || coupon.city || 'Loja Física'}</span>
              </>
            ) : (
              <>
                <Globe size={9} className="text-blue-400" />
                <span>Online</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-2.5 pt-2 pb-2 sm:p-3 sm:pt-2 sm:pb-2.5 flex-grow flex flex-col justify-between">
        <div>
          {/* Identificação da Loja com Nome Branco Original */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 line-clamp-1">
              {isExplicitPaid && storeTier === 'gold' ? (
                <>
                  <Crown size={10} fill="currentColor" className="text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{storeName}</span>
                  <span className="text-[7px] bg-amber-400/20 text-amber-300 font-extrabold px-1 py-0.2 rounded border border-amber-400/40">
                    OURO
                  </span>
                </>
              ) : isExplicitPaid && storeTier === 'silver' ? (
                <>
                  <Award size={10} className="text-slate-300 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{storeName}</span>
                  <span className="text-[7px] bg-slate-400/20 text-slate-200 font-extrabold px-1 py-0.2 rounded border border-slate-400/40">
                    PRATA
                  </span>
                </>
              ) : isExplicitPaid && storeTier === 'bronze' ? (
                <>
                  <Medal size={10} className="text-[#CD7F32] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{storeName}</span>
                  <span className="text-[7px] bg-[#CD7F32]/20 text-[#E09858] font-extrabold px-1 py-0.2 rounded border border-[#CD7F32]/50">
                    BRONZE
                  </span>
                </>
              ) : (
                <span className="text-[11px] font-bold text-white uppercase tracking-wider line-clamp-1 truncate">
                  {storeName}
                </span>
              )}
            </div>
            {store?.rating && (
              <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5 ml-1 flex-shrink-0">
                ★ {store.rating}
              </span>
            )}
          </div>

          {/* Título da Oferta */}
          <h3 className="text-xs font-black text-white leading-tight mb-1 transition-colors line-clamp-2">
            {coupon.title}
          </h3>

          {/* Descrição curta */}
          <p className="text-[10px] text-gray-400 line-clamp-1 sm:line-clamp-2 leading-tight mb-1.5">
            {coupon.description}
          </p>
        </div>

        <div>
          {/* Tag de Cashback Oficial para E-commerces Integrados */}
          {(coupon.cashbackRate || store?.cashbackRate) && (
            <div className="mb-1.5 flex items-center justify-between py-0.5 px-1.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/30 rounded-md text-[9px] shadow-sm">
              <div className="flex items-center gap-1 text-emerald-300 font-extrabold text-[9px]">
                <Coins size={10} className="text-emerald-400" />
                <span>Cashback:</span>
              </div>
              <span className="text-emerald-300 font-black text-[10px]">
                {coupon.cashbackRate || store?.cashbackRate}
              </span>
            </div>
          )}

          {/* Preços De / Por com Economia Real */}
          {coupon.originalPrice && coupon.promoPrice && Number(coupon.originalPrice) > Number(coupon.promoPrice) ? (
            <div className="flex items-center justify-between py-1 px-2 bg-emerald-500/10 rounded-md text-[10px] border border-emerald-500/25">
              <div className="flex items-baseline gap-1">
                <span className="text-gray-400 line-through text-[9px]">
                  R$ {Number(coupon.originalPrice).toFixed(0)}
                </span>
                <span className="font-extrabold text-white text-[10px]">
                  Por <span className="text-emerald-400 font-black text-[11px] sm:text-xs">R$ {Number(coupon.promoPrice).toFixed(2).replace('.', ',')}</span>
                </span>
              </div>
              <span className="text-[8px] font-black text-emerald-300 bg-emerald-500/20 px-1 py-0.2 rounded border border-emerald-500/30">
                -R$ {(Number(coupon.originalPrice) - Number(coupon.promoPrice)).toFixed(0)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Linha de Perfuração Perfurada com Recortes Laterais estilo Cupom */}
      <div className="ticket-perforation my-0.5">
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />
      </div>

      {/* Bottom Footer & Ação */}
      <div className="p-2.5 pt-1.5 pb-2.5 sm:p-3 sm:pt-1.5 sm:pb-2.5 bg-[#13131A]">
        <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1.5">
          <span className="flex items-center gap-1">
            <Clock size={10} className={coupon.validityType === 'unlimited' || coupon.expiresAt === 'unlimited' || !coupon.expiresAt ? 'text-emerald-400' : 'text-gray-500'} />
            {coupon.validityType === 'unlimited' || coupon.expiresAt === 'unlimited' || !coupon.expiresAt ? (
              <span className="text-emerald-400 font-bold">Ilimitada</span>
            ) : coupon.validityDays ? (
              <span>{coupon.validityDays}d</span>
            ) : (
              <span>{new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 font-semibold text-blue-300 bg-blue-500/10 px-1 py-0.2 rounded text-[8px]" title="Visualizações por usuários">
              <Eye size={9} className="text-blue-400" />
              <span>{(coupon.viewsCount || Math.max(140, (coupon.usesCount || 8) * 11 + 35)).toLocaleString('pt-BR')}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 font-bold text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded text-[8px]">
              <Users size={9} className="text-amber-400" />
              {coupon.maxUsesPerUser === 1
                ? '1x CPF'
                : coupon.maxUsesPerUser > 1
                ? `${coupon.maxUsesPerUser}x CPF`
                : 'Ilimitado'}
            </span>
          </div>
        </div>

        {/* Botão de Resgate ou Paywall */}
        {isVipUser ? (
          isLimitReached ? (
            <button
              onClick={handleAction}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 border border-white/10 transition-all cursor-pointer"
            >
              <span>🔒 Limite Atingido</span>
            </button>
          ) : (
            <button
              onClick={handleAction}
              className="w-full bg-[#FF5F00] hover:bg-[#E55400] text-white py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 shadow-md shadow-orange-600/30 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span className="truncate">
                {(() => {
                  const isLinkOnly = coupon.isLinkOnly || (!coupon.code && (!coupon.codePrefix || coupon.codePrefix === 'MELHORVIP') && (coupon.type === 'online' || coupon.title?.toLowerCase().includes('pelo link')));
                  if (isLinkOnly) return '🔗 Seguir para Loja';
                  if (coupon.type === 'online' || coupon.isApiIntegrated || coupon.apiSource || store?.isApiIntegrated || store?.apiSource || storeTier === 'api') {
                    return '🎟️ Pegar Cupom';
                  }
                  return '🎟️ Resgatar Cupom VIP';
                })()}
              </span>
              <ArrowUpRight size={11} className="flex-shrink-0" />
            </button>
          )
        ) : (
          <button
            onClick={handleAction}
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#2A1810] to-[#1E1712] hover:from-[#351E14] hover:to-[#281E17] border border-[#FF5F00]/50 text-orange-300 py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-all hover:border-[#FF5F00] shadow-sm cursor-pointer"
          >
            <Lock size={11} className="text-[#FF5F00] flex-shrink-0" />
            <span className="truncate">Desbloquear Cupom VIP</span>
          </button>
        )}
      </div>

      {/* Modal Administrativo para Edição e Enquadramento da Capa da Oferta */}
      {isEditingBanner && (
        <AdminEditOfferBannerModal
          coupon={coupon}
          store={store}
          isOpen={isEditingBanner}
          onClose={() => setIsEditingBanner(false)}
        />
      )}

    </div>
  );
};
