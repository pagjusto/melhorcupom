import React, { useState } from 'react';
import { 
  MapPin, 
  Globe, 
  Copy, 
  Check, 
  Gift, 
  Sparkles, 
  Coins, 
  Store, 
  Share2, 
  Building2,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';

export const CityEmptyState = ({
  cityName = '',
  onResetCity,
  isRegistered = false,
  referralCode = null,
  onOpenReferralModal,
  onOpenAuthModal,
  onOpenMerchantRegister,
  totalOffersCount = '370+'
}) => {
  const [copied, setCopied] = useState(false);

  const isCitySpecific = Boolean(cityName && cityName.trim() && cityName !== 'Todas as Cidades');
  const displayCity = isCitySpecific ? cityName.trim() : 'sua região';

  // O link de afiliado só é disponibilizado se o usuário estiver devidamente cadastrado e logado
  const activeReferralCode = isRegistered && referralCode ? referralCode : null;
  const referralUrl = activeReferralCode ? `https://melhorcupom.com.br/convite/${activeReferralCode}` : '';

  const handleCopyLink = () => {
    if (!activeReferralCode) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(referralUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!activeReferralCode) return;
    const text = isCitySpecific
      ? `Olá! O Clube VIP Melhor Cupom está chegando em ${displayCity}! Economize até 50% em estabelecimentos parceiros ou cadastre seu comércio para receber mais clientes. Acesse pelo meu convite: ${referralUrl}`
      : `Olá! Conheça o Clube VIP Melhor Cupom e economize até 50% em restaurantes, lazer e compras! Cadastre-se pelo meu link de convite: ${referralUrl}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 animate-fade-in">
      {/* CARD PRINCIPAL LIMPO & AMIGÁVEL */}
      <div className="relative overflow-hidden bg-[#161622] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/70">
        
        {/* Glow atmosférico suave */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          
          {/* Ícone de Localização com Destaque Amigável */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#FF5F00] via-[#FF7A29] to-amber-400 p-0.5 shadow-xl shadow-orange-950/60">
              <div className="w-full h-full bg-[#181826] rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl text-[#FF5F00]">
                📍
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          {/* Badge de Expansão */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Sparkles size={13} className="text-amber-400" />
              <span>{isCitySpecific ? 'Cidade em Fase de Expansão' : 'Sem Resultados no Filtro'}</span>
            </span>
          </div>

          {/* Título Principal */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight font-display mb-2.5">
            {isCitySpecific ? (
              <>
                Ainda não temos comércios credenciados em{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">
                  {displayCity}
                </span>
              </>
            ) : (
              'Nenhum cupom encontrado com os filtros atuais'
            )}
          </h2>

          {/* Texto Explicativo Amigável */}
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
            {isCitySpecific ? (
              <>
                Nossa rede está em rápida expansão pelo Brasil! Enquanto credenciamos os primeiros comércios parceiros de <strong className="text-white">{displayCity}</strong>, você pode explorar todas as marcas nacionais ou ser o primeiro a indicar comércios locais e lucrar com nosso modelo de afiliados.
              </>
            ) : (
              'Tente selecionar outra categoria ou limpe os filtros para visualizar todas as ofertas disponíveis no momento.'
            )}
          </p>

          {/* OPÇÃO 1: BOTÃO PROMINENTE "VER TODAS AS CIDADES" */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={onResetCity}
              className="w-full sm:w-auto bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <Globe size={17} />
              <span>Ver Todas as Cidades</span>
              <span className="bg-black/25 text-amber-200 text-[11px] px-2 py-0.5 rounded-full font-bold ml-1">
                {totalOffersCount} Ofertas
              </span>
            </button>
            
            {onOpenMerchantRegister && (
              <button
                onClick={onOpenMerchantRegister}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/15 font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store size={16} className="text-orange-400" />
                <span>Cadastrar Minha Loja {isCitySpecific ? `em ${displayCity}` : ''}</span>
              </button>
            )}
          </div>

          {/* OPÇÃO 2: SEÇÃO DE AFILIADO - INDICAR COMÉRCIO DA MINHA CIDADE */}
          <div className="relative text-left bg-gradient-to-br from-[#24130A] via-[#1B121A] to-[#141420] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
            
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FF5F00] p-0.5 flex-shrink-0">
                  <div className="w-full h-full bg-[#18120C] rounded-[14px] flex items-center justify-center text-xl">
                    🎁
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      Programa Oficial de Afiliados
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    Indicar Comércio da Minha Cidade
                  </h3>
                </div>
              </div>

              {/* Destaque do Ganho por Assinatura */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black shadow-sm">
                <TrendingUp size={14} />
                <span>Ganhe por Assinatura Ativada</span>
              </div>
            </div>

            {/* Como Funciona no Modelo de Afiliados Existente */}
            <div className="bg-black/35 rounded-2xl p-3.5 sm:p-4 border border-white/10 mb-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                Indique seu restaurante, barbearia, academia ou comércio favorito em <strong className="text-amber-300">{displayCity}</strong>. No modelo de afiliados do Melhor Cupom, você recebe <strong className="text-emerald-400">comissão direta no seu Caixa de Afiliado</strong> a cada nova assinatura gerada pelo seu link:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-2 rounded-xl">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>R$ 3,00 no Caixa</strong> por cada amigo assinante VIP</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-2 rounded-xl">
                  <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
                  <span><strong>R$ 5,00 no Caixa</strong> por comércio parceiro cadastrado</span>
                </div>
              </div>
            </div>

            {/* EXIGÊNCIA DE CADASTRO PRÉVIO PARA DISPONIBILIZAR O LINK DE AFILIADO */}
            {!isRegistered ? (
              <div className="bg-[#12121A] border-2 border-dashed border-amber-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Lock size={16} />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">
                        Link de Afiliado Exclusivo
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Disponível imediatamente após cadastro gratuito
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                    🔒 Bloqueado
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-black/50 border border-white/10 rounded-xl px-3.5 py-3 text-xs font-mono text-gray-400 select-none">
                  <Lock size={14} className="text-amber-400 flex-shrink-0" />
                  <span className="truncate">melhorcupom.com.br/convite/SEU-CODIGO-CADASTRADO</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Para gerar seu código pessoal de afiliado, divulgar comércios e receber comissões automáticas no seu Caixa, faça seu cadastro gratuito:
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal && onOpenAuthModal('user_register')}
                    className="flex-1 bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    <UserPlus size={16} />
                    <span>Cadastrar Grátis para Ter Meu Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                    className="bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/15 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogIn size={15} className="text-amber-400" />
                    <span>Já Tenho Cadastro • Fazer Login</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Caixa com o Link de Afiliado Real Ativo */}
                <div className="space-y-1.5 mb-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400" />
                      Seu Link Exclusivo de Afiliado para Divulgar:
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">
                      Código: {activeReferralCode}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#12121A] p-2 rounded-2xl border border-white/15 focus-within:border-amber-500/70 transition-colors">
                    <div className="flex-1 px-3 py-1.5 text-xs font-mono text-gray-200 truncate select-all">
                      {referralUrl}
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
                        copied
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-[#FF5F00] hover:bg-[#E04F00] text-white shadow-md'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Botões de Ação do Afiliado */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    <Share2 size={14} />
                    <span>Indicar Comércio no WhatsApp</span>
                  </button>

                  {onOpenReferralModal && (
                    <button
                      type="button"
                      onClick={onOpenReferralModal}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-amber-300 hover:text-white border border-amber-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Coins size={14} className="text-amber-400" />
                      <span>Ver Meu Caixa & Painel de Afiliado</span>
                    </button>
                  )}
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default CityEmptyState;
