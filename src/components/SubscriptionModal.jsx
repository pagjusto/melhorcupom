import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Lock, 
  ArrowRight,
  Coins,
  Gift
} from 'lucide-react';

import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

export const SubscriptionModal = () => {
  const { 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen, 
    subscribeToVip,
    selectedPlanForModal,
    setSelectedPlanForModal,
    userProfile,
    currentRole,
    setIsReferralModalOpen,
    openAuthModal
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card'
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useReferralBalance, setUseReferralBalance] = useState(true);

  if (!isSubscriptionModalOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanForModal) || SUBSCRIPTION_PLANS[0];
  const isVisitor = currentRole === 'visitor';
  const userBalance = userProfile?.referralBalance || 0;
  const discount = (useReferralBalance && userBalance > 0) ? Math.min(currentPlan.price, userBalance) : 0;
  const finalPrice = Math.max(0, currentPlan.price - discount);
  const isFree = finalPrice === 0 && discount > 0;

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136melhorcupom-vip-pagamentos@melhorcupom.com520400005303986540519.905802BR5925MELHOR CUPOM SERVICOS LTDA6009SAO PAULO62070503***630489A1');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      subscribeToVip(currentPlan.id, discount);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#16161F] border-2 border-[#FF5F00] rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fechar Modal */}
        <button 
          onClick={() => setIsSubscriptionModalOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Top Header Promocional */}
        <div className="bg-gradient-to-r from-[#2B1307] via-[#1E110A] to-[#16161F] p-6 sm:p-8 border-b border-white/10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img 
              src={logoMelhorCupom} 
              alt="Melhor Cupom" 
              className="h-20 w-auto object-contain drop-shadow-xl"
            />
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#FF5F00]/20 text-[#FF5F00] border border-[#FF5F00]/40 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles size={12} />
                <span>Acesso Ilimitado ao Clube VIP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Economize muito mais do que custa a assinatura
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Desbloqueie todos os cupons no balcão e online. Recupere o valor já na 1ª utilização!
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Card do Plano VIP Único */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
              1. Sua Assinatura de Membro VIP:
            </label>
            <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FF5F00]/15 via-amber-500/10 to-[#1D1D28] border-2 border-[#FF5F00] shadow-xl shadow-orange-600/15">
              <span className="absolute -top-3 right-5 bg-gradient-to-r from-amber-500 to-[#FF5F00] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider">
                {currentPlan.tag || 'Acesso Total'}
              </span>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white">{currentPlan.name}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Ativação Imediata
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-sm">
                    {currentPlan.billingInfo}
                  </p>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Valor da Assinatura</div>
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-3xl font-black text-white font-display">
                      R$ {currentPlan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-gray-400">/mês</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                    Sem fidelidade • Cancele quando quiser
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opção Alternativa para Visitantes: Adquirir créditos grátis no Divulgue & Ganhe */}
          {(isVisitor || userBalance === 0) && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-[#181824] border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl flex-shrink-0">
                    🎁
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-white">Prefere não pagar agora?</span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Créditos Grátis
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Ao invés de assinar, você também pode se cadastrar no <strong>Divulgue & Ganhe</strong> para adquirir créditos grátis e trocar por assinatura <span className="text-amber-300 font-semibold">(sendo neste caso ganha R$ 3,00 por assinatura pelo link)</span>!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubscriptionModalOpen(false);
                    if (!userProfile?.isRegistered) {
                      openAuthModal('user_register');
                    } else {
                      setIsReferralModalOpen(true);
                    }
                  }}
                  className="bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 transform hover:scale-105"
                >
                  <Sparkles size={14} />
                  <span>Cadastrar no Divulgue & Ganhe</span>
                </button>
              </div>
            </div>
          )}

          {/* Abatimento com Saldo do Caixa de Indicações (Exibido apenas quando houver saldo real disponível) */}
          {userBalance > 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-[#181824] border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl flex-shrink-0">
                    🎁
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-white">Saldo no Caixa de Indicações</span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        R$ {userBalance.toFixed(2).replace('.', ',')} disponível
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      Você acumulou este saldo indicando amigos no <strong>Divulgue & Ganhe</strong>. Deseja abater no valor da sua assinatura VIP?
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={useReferralBalance} 
                    onChange={(e) => setUseReferralBalance(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {useReferralBalance && discount > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-gray-300">
                    Desconto aplicado do seu Caixa: <strong className="text-emerald-400 font-mono">- R$ {discount.toFixed(2).replace('.', ',')}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Total a pagar hoje:</span>
                    <span className="text-sm font-black text-white bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vantagens Inclusas */}
          <div className="bg-[#121218] rounded-2xl p-4 border border-white/5 space-y-2">
            <div className="text-xs font-bold text-gray-300">O que você ganha com o Clube VIP:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                Acesso a mais de 100 cupons ativos
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                Descontos de 30% a 50% no balcão
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                Promoções Compre 1 Leve 2
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                Cancele quando quiser com 1 clique
              </span>
            </div>
          </div>

          {/* Se a assinatura saiu 100% grátis com saldo do Caixa */}
          {isFree ? (
            <div className="bg-[#121219] p-6 sm:p-7 rounded-2xl border-2 border-emerald-500 text-center space-y-4 animate-fade-in shadow-xl shadow-emerald-950/40">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
                🎉
              </div>
              <div>
                <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase px-3 py-0.5 rounded-full mb-2">
                  Saldo Suficiente no Caixa
                </span>
                <h3 className="text-xl font-black text-white">
                  Sua Assinatura VIP Saiu 100% GRÁTIS!
                </h3>
                <p className="text-xs text-gray-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Seu saldo de indicações cobre integralmente o valor de <strong>R$ {currentPlan.price.toFixed(2).replace('.', ',')}</strong>. Nenhum dado bancário ou chave PIX necessária!
                </p>
              </div>

              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 max-w-sm mx-auto text-xs space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Assinatura Mensal VIP:</span>
                  <span>R$ {currentPlan.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Saldo de Indicações Usado:</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="border-t border-white/10 pt-1 flex justify-between font-black text-sm text-white">
                  <span>Total a Pagar Hoje:</span>
                  <span className="text-emerald-400">R$ 0,00</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-700/40 transition-all flex items-center justify-center gap-2 text-sm sm:text-base transform hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={20} className="text-amber-200" />
                    <span>Ativar Assinatura VIP Grátis com Saldo (R$ 0,00)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Forma de Pagamento quando ainda há valor a pagar */
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  2. Forma de Pagamento Rápida & Segura:
                </label>
                {discount > 0 && (
                  <span className="text-xs font-bold text-emerald-400">
                    Valor com desconto: R$ {finalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Zap size={16} className="text-emerald-400" />
                  <span>PIX (Ativação Instantânea)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#FF5F00]/20 text-orange-300 border-[#FF5F00]'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <CreditCard size={16} className="text-orange-400" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>

              {/* Painel PIX */}
              {paymentMethod === 'pix' ? (
                <div className="bg-[#121219] p-5 rounded-2xl border border-white/10 text-center space-y-4">
                  <div className="inline-block p-3 bg-white rounded-2xl shadow-lg">
                    <QRCodeSVG 
                      value={`00020126580014br.gov.bcb.pix0136melhorcupom-vip-pagamentos@melhorcupom.com520400005303986540${finalPrice.toFixed(2)}5802BR5925MELHOR CUPOM SERVICOS LTDA6009SAO PAULO`} 
                      size={140} 
                    />
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    Pague <strong>R$ {finalPrice.toFixed(2).replace('.', ',')}</strong> escaneando o QR Code ou copiando o código Pix:
                  </div>

                  <div className="flex items-center gap-2 max-w-md mx-auto">
                    <input
                      type="text"
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136melhorcupom-vip-pagamentos@melhorcupom.com..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedPix ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedPix ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Simular Pagamento de R$ {finalPrice.toFixed(2).replace('.', ',')} (Ativar VIP)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Painel Cartão */
                <div className="bg-[#121219] p-5 rounded-2xl border border-white/10 space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Número do Cartão</label>
                    <input 
                      type="text" 
                      defaultValue="4532 •••• •••• 8912" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Validade</label>
                      <input 
                      type="text" 
                      defaultValue="08/29" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">CVV</label>
                      <input 
                      type="text" 
                      defaultValue="734" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Nome no Cartão</label>
                    <input 
                      type="text" 
                      defaultValue="LUCAS M SILVA" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full mt-2 bg-gradient-to-r from-[#FF5F00] to-[#FF8500] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/40 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Confirmar Pagamento de R$ {finalPrice.toFixed(2).replace('.', ',')}/mês</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Garantia & Segurança */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Garantia incondicional de 7 dias • Cancele quando quiser com 1 clique</span>
          </div>

        </div>

      </div>
    </div>
  );
};
