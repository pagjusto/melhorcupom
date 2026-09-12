import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  ArrowRight, 
  Coins, 
  Zap, 
  CheckCircle2,
  Store,
  Users
} from 'lucide-react';

export const ReferralBanner = () => {
  const { 
    currentRole, 
    userProfile, 
    stores, 
    setIsReferralModalOpen,
    addReferral,
    isVipUser 
  } = useApp();

  const isMerchantRole = currentRole.startsWith('merchant_');
  const isUserLoggedIn = isVipUser || userProfile?.isLoggedIn;

  // O card Destaque Divulgue & Ganhe só deve aparecer após o login e NÃO para visitantes
  if (!isUserLoggedIn && !isMerchantRole) {
    return null;
  }

  const merchantId = isMerchantRole ? currentRole : 'merchant_burger';
  const currentStore = stores.find(s => s.merchantId === merchantId) || stores[0];

  const referralCode = isMerchantRole 
    ? (currentStore.referralCode || 'SMASH5') 
    : (userProfile.referralCode || 'LUCAS5');

  const referralBalance = isMerchantRole 
    ? (currentStore.referralBalance || 0) 
    : (userProfile.referralBalance || 0);

  const referralUrl = `https://melhorcupom.com.br/convite/${referralCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const text = isMerchantRole
      ? `Conheça o Clube VIP Melhor Cupom com descontos de 30% a 50% no ${currentStore.name}! Cadastre-se pelo meu convite: ${referralUrl}`
      : `Economize até 50% nos melhores restaurantes, barbearias e lojas! Cadastre-se pelo meu link do Clube VIP: ${referralUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleQuickSimulate = (e) => {
    e.stopPropagation();
    addReferral(isMerchantRole ? 'merchant' : 'user');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2F1305] via-[#201018] to-[#141424] border-2 border-[#FF5F00]/50 shadow-2xl shadow-orange-950/40 p-6 sm:p-8 transition-all hover:border-[#FF5F00] group">
      
      {/* Luz ambiente de fundo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Textos & Destaque */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#FF5F00] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
              <Gift size={13} />
              <span>Destaque Divulgue & Ganhe</span>
            </span>

            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-black">
              <Coins size={13} />
              <span>{isMerchantRole ? 'R$ 5,00 por Cliente Cadastrado' : 'R$ 3,00 por Assinatura no Link'}</span>
            </span>

            {isMerchantRole ? (
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <Store size={12} />
                <span>Link da sua Loja</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <Users size={12} />
                <span>Link de Usuário</span>
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {isMerchantRole ? (
              <>Divulgue seu link e receba <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#FF5F00]">R$ 5,00 no seu Caixa</span> por cadastro!</>
            ) : (
              <>Divulgue seu link e receba <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#FF5F00]">R$ 3,00 no seu Caixa</span> por assinatura!</>
            )}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {isMerchantRole
              ? 'Compartilhe seu link exclusivo com clientes ou seguidores. O saldo acumula no Caixa da Loja para abater na mensalidade!'
              : 'Compartilhe seu link exclusivo com amigos. Adquira créditos grátis (R$ 3,00 por assinatura) para trocar pela sua Assinatura VIP 100% grátis!'}
          </p>

          {/* Atalho do link com 1-clique */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <div className="bg-black/50 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-amber-300 flex items-center gap-2">
              <span className="text-gray-500 text-[11px]">Seu link:</span>
              <span className="font-bold">melhorcupom.com.br/convite/{referralCode}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                copied 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 size={14} className="text-[#25D366]" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Lado Direito: Saldo no Caixa & Botões de Ação */}
        <div className="w-full lg:w-auto flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3.5 bg-black/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Coins size={14} className="text-amber-400" />
              <span>Saldo no seu Caixa</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white font-display">
                R$ {referralBalance.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Disponível
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {referralBalance >= 19.90 ? '🎉 Cobre 100% da Assinatura VIP!' : 'Acumule e abata em assinaturas'}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(true)}
              className="bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black px-6 py-3 rounded-xl text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Gift size={15} />
              <span>Abrir Painel Divulgue & Ganhe</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleQuickSimulate}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              title={isMerchantRole ? "Simular cliente se cadastrando pelo link da sua loja" : "Simular amigo assinando pelo seu link"}
            >
              <Zap size={14} className="text-emerald-400" />
              <span>{isMerchantRole ? 'Simular Indicação (+R$ 5,00)' : 'Simular Assinatura (+R$ 3,00)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
