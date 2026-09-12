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
  AlertTriangle
} from 'lucide-react';

export const CouponDetailModal = ({ coupon, store, onClose, onTestValidateAtMerchant }) => {
  const { redeemCoupon, redemptions, userProfile, isVipUser, setIsSubscriptionModalOpen } = useApp();
  const [activeRedemption, setActiveRedemption] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 min in seconds

  // Histórico de resgates deste cupom pelo usuário logado
  const pastUserRedemptions = redemptions.filter(r => 
    r.couponId === coupon?.id && 
    (r.userName === userProfile?.name || (userProfile?.cpf && r.userCpf === userProfile?.cpf))
  );

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

  const handleCopy = () => {
    navigator.clipboard.writeText(activeRedemption.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
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
            <div className="w-14 h-14 rounded-2xl bg-[#181822] border-2 border-[#FF5F00] flex items-center justify-center overflow-hidden shadow-xl">
              {store?.logoImage ? (
                <img src={store.logoImage} alt={store?.name} className="w-full h-full object-cover" />
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
            <p className="text-xs text-emerald-400 font-bold mt-1">
              Economia garantida de R$ {(coupon.estimatedSavings || 20).toFixed(2).replace('.', ',')}
            </p>

            {/* Tag de Regra por CPF */}
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Users size={13} className="text-amber-400" />
              <span>
                Regra: <strong>{coupon.maxUsesPerUser === 1 ? '1 resgate por CPF' : coupon.maxUsesPerUser > 1 ? `Até ${coupon.maxUsesPerUser} resgates por CPF` : 'Uso Ilimitado por CPF'}</strong>
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

              <button
                onClick={onClose}
                className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30"
              >
                Explorar Outros Cupons Disponíveis
              </button>
            </div>
          ) : (
            /* TELA NORMAL COM QR CODE QUANDO DENTRO DO LIMITE */
            <>
              {/* Área do Cupom / QR Code Box */}
              <div className="bg-[#101017] border-2 border-dashed border-[#FF5F00]/40 rounded-2xl p-5 text-center relative mb-5">
                
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  {coupon.type === 'physical' 
                    ? 'Apresente o QR Code ao atendente ou informe o código:'
                    : 'Copie o código promocional exclusivo abaixo:'
                  }
                </div>

                {/* Renderização do QR Code oficial */}
                {coupon.type === 'physical' && (
                  <div className="inline-block p-3 bg-white rounded-2xl shadow-xl my-2">
                    <QRCodeSVG 
                      value={activeRedemption.code} 
                      size={150} 
                      level="H" 
                      includeMargin={false}
                    />
                  </div>
                )}

                {/* Código em Destaque */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="bg-white/10 border border-white/20 font-mono text-xl sm:text-2xl font-black text-orange-400 tracking-wider px-4 py-2 rounded-xl">
                    {activeRedemption.code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-[#FF5F00] hover:bg-[#E04F00] text-white p-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center"
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
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/15 transition-all"
                  >
                    <Store size={15} className="text-orange-400" />
                    <span>Testar como Lojista: Abrir Validador com este Código</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30"
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
