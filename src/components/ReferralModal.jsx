import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Gift, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Store, 
  User,
  ExternalLink,
  Coins
} from 'lucide-react';

export const ReferralModal = () => {
  const { 
    isReferralModalOpen, 
    setIsReferralModalOpen, 
    currentRole, 
    userProfile, 
    stores, 
    addReferral,
    setIsSubscriptionModalOpen
  } = useApp();

  const isMerchantRole = currentRole.startsWith('merchant_');
  const merchantId = isMerchantRole ? currentRole : 'merchant_burger';
  const currentStore = stores.find(s => s.merchantId === merchantId) || stores[0];

  // Tab para alternar visualização caso seja lojista (Perfil Pessoal vs Loja)
  const [activeView, setActiveView] = useState(isMerchantRole ? 'store' : 'user');
  const [copiedLink, setCopiedLink] = useState(false);
  const [justEarned, setJustEarned] = useState(null);

  if (!isReferralModalOpen) return null;

  const isStoreView = activeView === 'store' && isMerchantRole;

  // Dados do Referrer selecionado
  const referralCode = isStoreView ? (currentStore.referralCode || 'SMASH5') : (userProfile.referralCode || 'LUCAS5');
  const referralBalance = isStoreView ? (currentStore.referralBalance || 0) : (userProfile.referralBalance || 0);
  const referralsList = isStoreView ? (currentStore.referrals || []) : (userProfile.referrals || []);
  const ownerName = isStoreView ? currentStore.name : userProfile.name;

  const referralUrl = `https://melhorcupom.com.br/convite/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = isStoreView
      ? `Olá! Conheça o Clube VIP do Melhor Cupom e aproveite ofertas exclusivas no ${currentStore.name} e dezenas de estabelecimentos com 30% a 50% OFF! Acesse pelo meu convite: ${referralUrl}`
      : `Opa! Estou economizando muito no Clube VIP Melhor Cupom em restaurantes, barbearias e lazer com até 50% OFF. Cadastre-se pelo meu link de convite: ${referralUrl}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSimulateInvite = () => {
    const res = addReferral(isStoreView ? 'merchant' : 'user');
    setJustEarned(res);
    setTimeout(() => setJustEarned(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#161622] border-2 border-amber-500/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fechar Modal */}
        <button 
          onClick={() => setIsReferralModalOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Top Header com Gradiente Temático Divulgue & Ganhe */}
        <div className="bg-gradient-to-r from-[#381504] via-[#2A1408] to-[#161622] p-6 sm:p-7 border-b border-white/10 relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FF5F00] to-amber-400 p-0.5 shadow-xl flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#1A120B] rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl">
                🎁
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                <span>Programa Oficial Divulgue & Ganhe</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Ganhe R$ 5,00 a cada indicação
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg">
                Cada amigo que se cadastrar usando seu link gera <strong>R$ 5,00 direto no seu Caixa</strong> para abater ou pagar assinaturas!
              </p>
            </div>
          </div>

          {/* Abas Alternadoras (Apenas para perfil Lojista) */}
          {isMerchantRole && (
            <div className="flex items-center gap-2 mt-5 bg-black/40 p-1 rounded-xl border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveView('store')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeView === 'store'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Store size={14} />
                <span>Link da Loja ({currentStore.name})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeView === 'user'
                    ? 'bg-[#FF5F00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={14} />
                <span>Meu Link de Usuário ({userProfile.name})</span>
              </button>
            </div>
          )}
        </div>

        {/* Notificação Toast de Bônus Concedido na Simulação */}
        {justEarned && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Novo amigo cadastrado com sucesso! <strong>+{justEarned.name}</strong> gerou <strong>+R$ 5,00</strong> no seu Caixa!</span>
            </div>
            <span className="text-emerald-400 text-sm font-black">+R$ 5,00</span>
          </div>
        )}

        {/* Conteúdo Rolável */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-grow">
          
          {/* 1. CARD DE SALDO NO CAIXA */}
          <div className="bg-gradient-to-r from-[#201A15] via-[#1A1820] to-[#161622] rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Coins size={16} />
                  <span>Seu Caixa de Indicações ({ownerName})</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-display">
                    R$ {referralBalance.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Disponível no Caixa
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isStoreView 
                    ? 'Use seu saldo para abater nas mensalidades dos planos Bronze, Prata ou Ouro.'
                    : 'Use seu saldo para pagar ou abater na Assinatura VIP de R$ 19,90.'}
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsReferralModalOpen(false);
                    setIsSubscriptionModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>Usar Saldo em Assinatura</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. SEU LINK EXCLUSIVO DE DIVULGAÇÃO */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
              🔗 Seu Link Exclusivo de Indicação:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="flex-grow bg-[#101017] border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-amber-300 font-mono select-all">
                <span className="text-gray-500 select-none">https://</span>
                <span className="text-white font-bold truncate">melhorcupom.com.br/convite/{referralCode}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
                  copiedLink
                    ? 'bg-emerald-500 text-white shadow-emerald-700/40'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all whitespace-nowrap"
              >
                <Share2 size={16} />
                <span>Compartilhar no WhatsApp</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Seu código exclusivo de indicação é <strong>{referralCode}</strong>.
            </p>
          </div>

          {/* 3. SIMULADOR DE TESTE RÁPIDO (+R$ 5,00) */}
          <div className="bg-[#12121A] rounded-2xl p-4 sm:p-5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Quer ver funcionando na prática?</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  Teste Imediato
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Simule um amigo se cadastrando pelo seu link para receber <strong>+R$ 5,00 agora</strong> no seu caixa.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateInvite}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all flex-shrink-0"
            >
              <Zap size={16} />
              <span>Simular Indicação (+R$ 5,00)</span>
            </button>
          </div>

          {/* 4. PASSO A PASSO COMO FUNCIONA */}
          <div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Como funciona o Divulgue & Ganhe:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#13131A] p-4 rounded-2xl border border-white/5 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div className="text-xs font-bold text-white">Compartilhe o Link</div>
                <p className="text-[11px] text-gray-400">
                  Envie seu link exclusivo para amigos, familiares e redes sociais.
                </p>
              </div>

              <div className="bg-[#13131A] p-4 rounded-2xl border border-white/5 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div className="text-xs font-bold text-white">Amigo se Cadastra</div>
                <p className="text-[11px] text-gray-400">
                  O convidado clica no seu link e realiza o cadastro gratuito na plataforma.
                </p>
              </div>

              <div className="bg-[#13131A] p-4 rounded-2xl border border-white/5 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div className="text-xs font-bold text-white">R$ 5,00 no seu Caixa</div>
                <p className="text-[11px] text-gray-400">
                  O bônus de R$ 5,00 entra imediatamente no seu caixa para usar em assinaturas!
                </p>
              </div>
            </div>
          </div>

          {/* 5. HISTÓRICO DE INDICAÇÕES REALIZADAS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Amigos Cadastrados via seu Link ({referralsList.length}):
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">
                Total ganho: R$ {(referralsList.length * 5).toFixed(2).replace('.', ',')}
              </span>
            </div>

            {referralsList.length === 0 ? (
              <div className="text-center py-6 bg-[#101017] rounded-2xl border border-white/5 text-gray-500 text-xs">
                Nenhum amigo cadastrado ainda. Compartilhe seu link para começar a lucrar!
              </div>
            ) : (
              <div className="space-y-2">
                {referralsList.map((ref) => (
                  <div 
                    key={ref.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#101017] border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-white">{ref.name}</div>
                        <div className="text-[10px] text-gray-400">{ref.date} • Cadastro Concluído</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                        +R$ {ref.bonus.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-4 sm:p-5 bg-[#12121A] border-t border-white/10 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Sem limite de indicações • Saldo não expira</span>
          </span>
          <button
            type="button"
            onClick={() => setIsReferralModalOpen(false)}
            className="text-white hover:text-gray-300 font-bold px-3 py-1"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
