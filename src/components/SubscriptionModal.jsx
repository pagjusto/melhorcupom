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
  ArrowRight
} from 'lucide-react';

export const SubscriptionModal = () => {
  const { 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen, 
    subscribeToVip,
    selectedPlanForModal,
    setSelectedPlanForModal 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card'
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanForModal) || SUBSCRIPTION_PLANS[0];

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136melhorcupom-vip-pagamentos@melhorcupom.com520400005303986540519.905802BR5925MELHOR CUPOM SERVICOS LTDA6009SAO PAULO62070503***630489A1');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      subscribeToVip(currentPlan.id);
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
              src="/logo-melhor-cupom.png" 
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

          {/* Forma de Pagamento */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
              2. Forma de Pagamento Rápida & Segura:
            </label>
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
                    value="00020126580014br.gov.bcb.pix0136melhorcupom-vip-pagamentos@melhorcupom.com520400005303986540519.905802BR5925MELHOR CUPOM SERVICOS LTDA6009SAO PAULO" 
                    size={140} 
                  />
                </div>
                
                <div className="text-xs text-gray-300">
                  Escaneie o QR Code no app do seu banco ou copie a chave Pix:
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
                      <span>Simular Pagamento PIX Aprovado (Ativar VIP Agora)</span>
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
                      <span>Confirmar Assinatura por R$ {currentPlan.price.toFixed(2).replace('.', ',')}/mês</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

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
