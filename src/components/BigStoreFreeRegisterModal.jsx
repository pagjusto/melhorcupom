import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  Tag, 
  ArrowRight, 
  Mail, 
  User, 
  Lock, 
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BigStoreFreeRegisterModal = ({ coupon, store, onClose, onProceedToCoupon }) => {
  const { registerUser, openAuthModal } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!coupon) return null;

  const apiSource = coupon.apiSource || store?.apiSource || 'API Oficial';
  const cashbackRate = coupon.cashbackRate || store?.cashbackRate || 'Até 8.0% de Volta';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password || '123456',
        city: 'Todo o Brasil (Online)'
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5F00', '#10B981', '#3B82F6', '#FFA500']
      });

      // Abre imediatamente o cupom para o usuário após o cadastro
      if (onProceedToCoupon) {
        onProceedToCoupon(coupon);
      } else if (onClose) {
        onClose();
      }
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao criar seu cadastro. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onProceedToCoupon) {
      onProceedToCoupon(coupon);
    } else if (onClose) {
      onClose();
    }
  };

  const handleGoToLogin = () => {
    if (onClose) onClose();
    if (openAuthModal) openAuthModal('login');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#14141F] border-2 border-[#FF5F00] rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 p-5 sm:p-7 text-left space-y-4 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luzes de Fundo Atmosféricas */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
          title="Fechar"
        >
          <X size={18} />
        </button>

        {/* 1. Header do Modal com o Título Solicitado */}
        <div className="space-y-1.5 relative z-10 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} className="text-amber-400" />
            <span>Oferta das Grandes Lojas</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Cadastre-se grátis para não perder nenhuma oferta como esta!
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Crie sua conta gratuita em 30 segundos para salvar cupons, ativar cashback e receber alertas das melhores lojas do Brasil.
          </p>
        </div>

        {/* 2. Card Preview da Oferta Clicada */}
        <div className="relative z-10 bg-[#1A1A2A] border border-white/10 hover:border-orange-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo da Loja */}
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
              {store?.logoImage ? (
                <img 
                  src={store.logoImage} 
                  alt={store?.name || 'Loja'} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-xl">{store?.logo || '🛍️'}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {store?.name || 'Loja Parceira'}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold flex-shrink-0">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{apiSource}</span>
                </span>
              </div>
              <h4 className="text-xs text-gray-200 font-medium truncate mt-0.5" title={coupon.title}>
                {coupon.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mt-0.5">
                <Coins size={10} className="text-amber-400" />
                <span>{cashbackRate}</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className="bg-gradient-to-r from-[#FF5F00] to-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap inline-flex items-center gap-1">
              <Tag size={10} />
              <span>{coupon.discountBadge}</span>
            </span>
          </div>
        </div>

        {/* 3. Benefícios do Cadastro Gratuito */}
        <div className="relative z-10 grid grid-cols-2 gap-2 text-[11px] text-gray-300">
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>100% Gratuito para sempre</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>Cashback garantido</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>Sem necessidade de cartão</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>Alertas de novos cupons</span>
          </div>
        </div>

        {/* 4. Formulário de Cadastro Rápido */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-3 pt-1">
          {errorMsg && (
            <div className="p-2.5 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Seu Nome Completo:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={14} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ana Silva"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#FF5F00] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Seu Melhor E-mail:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: anasilva@gmail.com"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#FF5F00] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Crie uma Senha (opcional para salvar acesso):
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={14} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#FF5F00] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF5F00] via-[#FF7518] to-amber-500 hover:from-[#E04F00] hover:to-amber-600 text-white font-black py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-950/60 hover:shadow-orange-600/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap size={16} className="fill-current" />
            <span>{isSubmitting ? 'Cadastrando...' : 'Cadastrar-se Grátis & Acessar Cupom'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 5. Ações Alternativas (Skip para o cupom sem cadastro / Fazer Login) */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <button
            onClick={handleSkip}
            className="hover:text-white underline transition-colors cursor-pointer text-center sm:text-left"
          >
            👉 Continuar para o cupom sem cadastro
          </button>

          <button
            onClick={handleGoToLogin}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors cursor-pointer"
          >
            Já tem conta? Fazer Login
          </button>
        </div>

      </div>
    </div>
  );
};
