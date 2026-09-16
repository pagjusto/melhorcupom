import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Copy, 
  Check, 
  MapPin, 
  Globe, 
  Clock, 
  AlertCircle, 
  Store, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
  Navigation,
  KeyRound,
  CheckCircle2,
  Coins,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CouponDetailModal = ({ coupon, store, onClose, onTestValidateAtMerchant }) => {
  const { redeemCoupon, redemptions, userProfile, isVipUser, setIsSubscriptionModalOpen } = useApp();
  const [activeRedemption, setActiveRedemption] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 min in seconds
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Histórico de resgates deste cupom pelo usuário logado
  const pastUserRedemptions = redemptions.filter(r => 
    r.couponId === coupon?.id && 
    (r.userName === userProfile?.name || (userProfile?.cpf && r.userCpf === userProfile?.cpf))
  );

  // Contato WhatsApp e Localização do Estabelecimento
  const storePhone = store?.phone || '(11) 98123-4567';
  const cleanPhone = storePhone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o cupom "${coupon?.title}" no Melhor Cupom e gostaria de tirar uma dúvida.`
  );
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${whatsappMessage}`;

  const storeAddress = store?.address || coupon?.address || `${store?.name || ''}, ${store?.city || coupon?.city || 'Brasil'}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`;

  useEffect(() => {
    if (!coupon) return;

    if (!isVipUser) {
      onClose();
      setIsSubscriptionModalOpen(true);
      return;
    }

    // 1. Verificar se já existe resgate válido para este cupom
    const existing = redemptions.find(r => 
      r.couponId === coupon.id && 
      (r.userName === userProfile.name || (userProfile.cpf && r.userCpf === userProfile.cpf)) && 
      r.status === 'valid'
    );

    if (existing) {
      setActiveRedemption(existing);
      setIsLimitReached(false);
    } else {
      // 2. Verificar se o usuário já atingiu a cota de uso por CPF
      const userUses = redemptions.filter(r => 
        r.couponId === coupon.id && 
        (r.userName === userProfile.name || (userProfile.cpf && r.userCpf === userProfile.cpf))
      ).length;

      const maxUses = coupon.maxUsesPerUser;
      const isLimited = maxUses !== null && maxUses !== undefined && maxUses !== '' && maxUses !== 0 && maxUses !== 'unlimited';

      if (isLimited && userUses >= maxUses) {
        setIsLimitReached(true);
      } else {
        const created = redeemCoupon(coupon);
        if (created?.limitReached) {
          setIsLimitReached(true);
        } else {
          setActiveRedemption(created);
          setIsLimitReached(false);
        }
      }
    }
  }, [coupon, isVipUser]);

  // Timer regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!coupon) return null;
  if (!isLimitReached && !activeRedemption) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isOnlineCoupon = coupon.type === 'online' || coupon.isApiIntegrated;
  const couponCode = coupon.codePrefix || activeRedemption?.code || 'MELHORVIP';
  const affiliateDestinationUrl = coupon.affiliateUrl || store?.affiliateUrl || 'https://www.google.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartRedirect = () => {
    try {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
    } catch {
      // ignore
    }

    setIsRedirecting(true);
    setRedirectProgress(20);

    setTimeout(() => setRedirectProgress(55), 300);
    setTimeout(() => setRedirectProgress(85), 700);
    setTimeout(() => {
      setRedirectProgress(100);
      try {
        window.open(affiliateDestinationUrl, '_blank');
      } catch {
        // ignore
      }
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      {/* OVERLAY ANIMADO DE REDIRECIONAMENTO & ATIVAÇÃO DE CASHBACK */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#161622] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-emerald-950/70 space-y-6">
            
            {/* Logo da Loja Pulsando */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-ping pointer-events-none" />
              <div className="relative w-full h-full rounded-2xl bg-[#1C1C2A] border-2 border-emerald-400 p-2 flex items-center justify-center shadow-xl overflow-hidden">
                {store?.logoImage ? (
                  <>
                    <img 
                      src={store.logoImage} 
                      alt={store.name} 
                      className="w-full h-full object-cover rounded-xl" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.overlay-logo-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <span className="overlay-logo-fallback hidden w-full h-full items-center justify-center text-3xl">
                      {store?.logo || '🛍️'}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl">{store?.logo || '🛍️'}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ativação Automática VIP</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Redirecionando para {store?.name || 'a Loja Oficial'}...
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Estamos registrando seu SubID exclusivo para garantir seu desconto e rastreamento de Cashback.
              </p>
            </div>

            {/* Checklist de Validação em Tempo Real */}
            <div className="bg-black/40 rounded-2xl p-4 text-left space-y-2.5 text-xs text-gray-300 border border-white/5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Cupom <strong className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">{couponCode}</strong> copiado!</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Cashback ativado via API oficial ({coupon.apiSource || store?.apiSource || 'Awin / Lomadee'})</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <span className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" />
                <span>SubID injetado com segurança: melhorcupom_vip</span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#FF5F00] transition-all duration-300"
                  style={{ width: `${redirectProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>{redirectProgress}% concluído</span>
                <span className="text-emerald-400 font-bold">
                  {redirectProgress === 100 ? '✓ Loja aberta!' : 'Conectando...'}
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2 pt-1">
              <a
                href={affiliateDestinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsRedirecting(false);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <span>Ir para a Loja Oficial Agora</span>
                <ExternalLink size={16} />
              </a>

              <button
                onClick={() => setIsRedirecting(false)}
                className="w-full text-xs text-gray-400 hover:text-white py-2 cursor-pointer transition-colors"
              >
                Voltar aos detalhes
              </button>
            </div>

          </div>
        </div>
      )}

      <div 
        className="relative w-full max-w-lg bg-[#181822] border-2 border-[#FF5F00]/50 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/60 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header com Imagem e Fechar */}
        <div className="relative h-40 bg-[#26150D] overflow-hidden">
          <img 
            src={coupon.banner || store?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700'} 
            alt={coupon.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181822] via-[#181822]/40 to-black/50" />
          
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-md"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-3 left-6 flex items-center gap-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#181822] flex items-center justify-center overflow-hidden shadow-xl">
              {store?.logoImage ? (
                <>
                  <img 
                    src={store.logoImage} 
                    alt={store?.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.modal-hdr-logo-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="modal-hdr-logo-fallback hidden w-full h-full items-center justify-center text-2xl">
                    {store?.logo || '🏪'}
                  </span>
                </>
              ) : (
                <span className="text-2xl">{store?.logo || '🏪'}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">{store?.name}</h3>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                {coupon.type === 'physical' ? (
                  <>
                    <MapPin size={12} className="text-orange-400" />
                    <span className="line-clamp-1">{store?.address}</span>
                  </>
                ) : (
                  <>
                    <Globe size={12} className="text-blue-400" />
                    <span>Válido para compra online</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Corpo do Ticket de Resgate */}
        <div className="p-6">
          
          {/* Badge & Título */}
          <div className="text-center mb-5">
            <div className="inline-block bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-2 shadow-md">
              {coupon.discountBadge}
            </div>
            <h2 className="text-xl font-extrabold text-white leading-snug">
              {coupon.title}
            </h2>

            {/* Preços De / Por com Economia Real ou Economia Estimada */}
            {coupon.originalPrice && coupon.promoPrice ? (
              <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
                <span className="text-gray-400 line-through text-xs sm:text-sm">
                  De R$ {Number(coupon.originalPrice).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-white font-extrabold text-sm sm:text-base">
                  Por <span className="text-emerald-400 font-black">R$ {Number(coupon.promoPrice).toFixed(2).replace('.', ',')}</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 font-black text-xs px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                  Economia de R$ {(Number(coupon.originalPrice) - Number(coupon.promoPrice)).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-bold mt-1">
                Economia garantida de R$ {(coupon.estimatedSavings || 20).toFixed(2).replace('.', ',')}
              </p>
            )}

            {/* Tags de Regra por CPF e Validade */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Users size={13} className="text-amber-400" />
                <span>
                  Regra: <strong>{coupon.maxUsesPerUser === 1 ? '1 resgate por CPF' : coupon.maxUsesPerUser > 1 ? `Até ${coupon.maxUsesPerUser} resgates por CPF` : 'Uso Ilimitado por CPF'}</strong>
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Clock size={13} className="text-orange-400" />
                <span>
                  Validade: <strong>{coupon.validityType === 'unlimited' || coupon.expiresAt === 'unlimited' || !coupon.expiresAt ? 'Ilimitada' : coupon.validityDays ? `${coupon.validityDays} dias` : new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}</strong>
                </span>
              </span>
            </div>
          </div>

          {isLimitReached ? (
            /* TELA QUANDO LIMITE POR CPF JÁ FOI ATINGIDO */
            <div className="space-y-5 animate-fade-in">
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🔒
                </div>
                <h3 className="text-lg font-black text-white">
                  Limite por CPF Atingido
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Esta oferta possui limite de <strong>{coupon.maxUsesPerUser === 1 ? '1 resgate por CPF' : `${coupon.maxUsesPerUser} resgates por CPF`}</strong>.
                  O seu CPF (<strong>{userProfile.cpf || '382.***.***-04'}</strong>) já atingiu o total de utilizações permitidas para esta promoção.
                </p>
              </div>

              {pastUserRedemptions.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-gray-300 block">
                    Comprovante(s) de resgate deste CPF:
                  </span>
                  <div className="space-y-1.5">
                    {pastUserRedemptions.map(r => (
                      <div key={r.id} className="flex items-center justify-between text-xs bg-[#101017] p-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-orange-400 font-bold">{r.code}</span>
                        <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span className="text-emerald-400 font-bold">✓ Baixado</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de Ação: WhatsApp & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
                  title="Enviar mensagem para o estabelecimento no WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Mandar WhatsApp</span>
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
                  title="Abrir rota no Google Maps / Waze"
                >
                  <Navigation size={15} className="text-white fill-current flex-shrink-0" />
                  <span>Como Chegar (GPS)</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30"
              >
                Explorar Outros Cupons Disponíveis
              </button>
            </div>
          ) : isOnlineCoupon ? (
            /* ======================================================== */
            /* FLUXO EXCLUSIVO DE CUPOM ONLINE / E-COMMERCE INTEGRADO   */
            /* ======================================================== */
            <div className="space-y-4 animate-fade-in">
              {/* Badge de Integração Oficial via API */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sincronizado via API Oficial ({coupon.apiSource || store?.apiSource || 'Awin / Lomadee'})</span>
                </span>
                <span className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                  Verificado hoje
                </span>
              </div>

              {/* Destaque de Cashback Garantido */}
              {(coupon.cashbackRate || store?.cashbackRate) && (
                <div className="p-4 bg-gradient-to-r from-emerald-500/20 via-[#101F18] to-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl text-center shadow-lg">
                  <div className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center justify-center gap-1.5 mb-0.5">
                    <Coins size={15} className="text-emerald-400" />
                    <span>Cashback Garantido na sua Conta</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    {coupon.cashbackRate || store?.cashbackRate}
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 max-w-xs mx-auto leading-relaxed">
                    Comprando pelo link rastreado do Melhor Cupom, você recebe parte do valor de volta na sua carteira VIP.
                  </p>
                </div>
              )}

              {/* Caixa de Código com Cópia Rápida */}
              <div className="p-5 bg-gradient-to-b from-white/10 via-black/40 to-white/5 border-2 border-dashed border-[#FF5F00] rounded-2xl text-center space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Zap size={14} className="text-[#FF5F00]" />
                  <span>Código Promocional Exclusivo:</span>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-orange-400 bg-black/70 px-6 py-2.5 rounded-xl border border-orange-500/40 tracking-widest select-all shadow-inner">
                    {couponCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-[#FF5F00] hover:bg-[#E04F00] text-white p-3 rounded-xl transition-all shadow-lg flex items-center justify-center hover:scale-105 cursor-pointer"
                    title="Copiar código promocional"
                  >
                    {copied ? <Check size={22} className="text-emerald-300" /> : <Copy size={22} />}
                  </button>
                </div>

                <p className="text-xs text-gray-300">
                  {copied ? (
                    <strong className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} /> Código copiado! Agora clique no botão abaixo para ir à loja oficial.
                    </strong>
                  ) : (
                    'Copie o código promocional acima e cole na tela de pagamento da loja oficial.'
                  )}
                </p>
              </div>

              {/* Botão Master: Copiar e Ir para Loja Oficial */}
              <button
                onClick={handleStartRedirect}
                className="w-full bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-xl shadow-orange-950/60 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles size={18} className="text-amber-200" />
                <span>Copiar Cupom & Ir para a Loja Oficial</span>
                <ExternalLink size={18} />
              </button>

              {/* Regras e Condições de Uso Online */}
              <div className="bg-white/5 rounded-2xl p-4 text-xs space-y-2 text-gray-300 border border-white/5">
                <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <ShieldCheck size={16} className="text-[#FF5F00]" />
                  <span>Regras da Oferta Online:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-400 pl-1 leading-relaxed">
                  {coupon.rules?.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                  <li>Para garantir o cashback, complete a compra na mesma janela do navegador sem fechar o link rastreado.</li>
                  <li>Não utilize cupons ou extensões de terceiros para não anular a comissão de cashback.</li>
                </ul>
              </div>

              {/* Botão Concluído / Fechar */}
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all border border-white/10 cursor-pointer"
              >
                Concluído / Voltar ao Catálogo
              </button>
            </div>
          ) : (
            /* ======================================================== */
            /* FLUXO DE LOJA FÍSICA (COM QR CODE E SENHA DE 6 DÍGITOS)  */
            /* ======================================================== */
            <>
              {/* Área do Cupom / QR Code Box */}
              <div className="bg-[#101017] border-2 border-dashed border-[#FF5F00]/40 rounded-2xl p-5 text-center relative mb-5">
                
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  Apresente o QR Code ao atendente ou informe a senha de 6 dígitos abaixo:
                </div>

                {/* Renderização do QR Code oficial */}
                <div className="inline-block p-3 bg-white rounded-2xl shadow-xl my-2">
                  <QRCodeSVG 
                    value={activeRedemption.qrPayload || activeRedemption.code} 
                    size={155} 
                    level="H" 
                    includeMargin={false}
                  />
                </div>

                {/* Senha Obrigatória do QR Code para Ofertas Locais */}
                <div className="my-3 p-3.5 bg-gradient-to-r from-orange-500/20 via-black/60 to-orange-500/20 border-2 border-[#FF5F00] rounded-2xl text-center shadow-lg">
                  <div className="text-[11px] font-black text-orange-300 uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1">
                    <KeyRound size={15} className="text-[#FF5F00]" />
                    <span>Senha de Validação do QR Code:</span>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-black text-white tracking-[0.25em] py-1 select-all">
                    {activeRedemption.passCode || '849201'}
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1 max-w-xs mx-auto leading-tight">
                    Apresente o QR Code no caixa para leitura. Caso a câmera do lojista não consiga escanear, informe esta <strong>Senha de 6 dígitos</strong> para baixa manual.
                  </p>
                </div>

                {/* Status de Baixa Confirmada */}
                {activeRedemption.status === 'used' && (
                  <div className="my-3 p-3 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl text-center animate-fade-in">
                    <div className="text-emerald-400 font-black text-sm flex items-center justify-center gap-1.5 mb-0.5">
                      <CheckCircle2 size={18} />
                      <span>CUPOM BAIXADO NO CAIXA COM SUCESSO!</span>
                    </div>
                    <div className="text-[11px] text-emerald-200">
                      Economia de R$ {Number(activeRedemption.savings || 20).toFixed(2).replace('.', ',')} creditada na sua carteira.
                    </div>
                  </div>
                )}

                {/* Código em Destaque */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="bg-white/10 border border-white/20 font-mono text-xl sm:text-2xl font-black text-orange-400 tracking-wider px-4 py-2 rounded-xl">
                    {activeRedemption.code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-[#FF5F00] hover:bg-[#E04F00] text-white p-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center cursor-pointer"
                    title="Copiar código"
                  >
                    {copied ? <Check size={20} className="text-emerald-300" /> : <Copy size={20} />}
                  </button>
                </div>

                {/* Timer de Validade do Resgate */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Clock size={13} className="animate-spin-slow" />
                  <span>Código ativo por: <strong>{formattedTime}</strong> min</span>
                </div>
              </div>

              {/* Botões de Ação Rápida: WhatsApp e Como Chegar (Localização) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {/* Botão WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 transform hover:scale-[1.02]"
                  title="Enviar mensagem para o estabelecimento no WhatsApp"
                >
                  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Mandar WhatsApp</span>
                </a>

                {/* Botão de Localização / Como Chegar */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-blue-950/40 transform hover:scale-[1.02]"
                  title="Abrir rota no Google Maps / Waze"
                >
                  <Navigation size={16} className="text-white fill-current flex-shrink-0" />
                  <span>Como Chegar (GPS)</span>
                </a>
              </div>

              {/* Regras e Condições de Uso */}
              <div className="bg-white/5 rounded-2xl p-4 text-xs space-y-2 mb-6 text-gray-300">
                <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <ShieldCheck size={16} className="text-[#FF5F00]" />
                  <span>Regras de Utilização:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-400 pl-1">
                  {coupon.rules?.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                  <li>Apresentação obrigatória do aplicativo no momento da compra.</li>
                </ul>
              </div>

              {/* Ações e Atalho para Teste do Lojista */}
              <div className="space-y-3">
                {onTestValidateAtMerchant && coupon.type === 'physical' && (
                  <button
                    onClick={() => {
                      onClose();
                      onTestValidateAtMerchant(activeRedemption.code, coupon.merchantId);
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                  >
                    <Store size={15} className="text-orange-400" />
                    <span>Testar como Lojista: Abrir Validador com este Código</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 cursor-pointer"
                >
                  Concluído / Voltar
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
