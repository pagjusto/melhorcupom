// src/components/PartnerWelcomeModal.jsx
// Modal de Confirmação e Entrega Transacional de Boas-Vindas para Novos Parceiros Credenciados

import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Instagram, 
  Lock, 
  Mail, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  Store, 
  X 
} from 'lucide-react';
import { downloadArtworkFile } from '../utils/partnerNotification';

export const PartnerWelcomeModal = ({ data, onClose, onGoToDashboard }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!data) return null;

  const {
    storeName,
    email,
    password,
    phone,
    whatsappUrl,
    message,
    artworkDataUrl
  } = data;

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPassword = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const handleCopyMessage = () => {
    if (navigator?.clipboard?.writeText && message) {
      navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleDownload = () => {
    if (artworkDataUrl) {
      downloadArtworkFile(artworkDataUrl, storeName);
    }
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#161622] border-2 border-[#FF5F00] rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Topo Festivo */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent text-center space-y-2 border-b border-white/10">
          <div className="inline-flex items-center gap-2 bg-[#FF5F00]/20 border border-[#FF5F00]/40 text-[#FF5F00] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="animate-spin" />
            <span>Novo Parceiro Credenciado</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Parabéns, {storeName}! 🎉
          </h2>
          <p className="text-sm text-gray-300 max-w-lg mx-auto">
            Seu cadastro foi realizado com sucesso! Enviamos a confirmação com seus dados de acesso e sua arte para o seu WhatsApp.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Card 1: Credenciais de Acesso ao Painel */}
          <div className="bg-[#101017] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={14} />
                <span>Seus Dados de Acesso ao Painel:</span>
              </span>
              <span className="text-[10px] text-gray-400">Guarde com segurança</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* E-mail */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-[10px] text-gray-400 block font-semibold">E-mail de Login:</span>
                  <span className="font-mono text-white truncate block font-bold">{email || 'contato@loja.com'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                  title="Copiar E-mail"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Senha */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-[10px] text-gray-400 block font-semibold">Senha de Acesso / PIN:</span>
                  <span className="font-mono text-amber-300 font-bold block truncate">
                    {showPassword ? password : '••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar Senha"
                  >
                    {copiedPassword ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Arte Oficial para o Instagram */}
          <div className="bg-[#101017] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Instagram size={15} className="text-rose-400" />
                <span>Arte Oficial com a Logo da sua Loja:</span>
              </span>
              <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded font-bold">
                1080 x 1080 px (Feed)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview da Arte */}
              <div className="sm:col-span-5 flex justify-center">
                {artworkDataUrl ? (
                  <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-xl bg-black group">
                    <img 
                      src={artworkDataUrl} 
                      alt={`Arte oficial ${storeName}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="bg-orange-500 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Baixar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-xs">
                    Gerando arte...
                  </div>
                )}
              </div>

              {/* Informações e Botão de Download */}
              <div className="sm:col-span-7 space-y-3">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Criamos automaticamente a arte promocional com o selo oficial de parceria e a logo de <strong>{storeName}</strong>. O download foi iniciado automaticamente no seu aparelho!
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={15} className="text-orange-400" />
                    <span>Baixar Arte Novamente (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold py-2 px-3 rounded-xl text-[11px] border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedMessage ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedMessage ? 'Mensagem Copiada!' : 'Copiar Texto Completo'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: WhatsApp Enviado com 1-Click */}
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle size={15} className="text-emerald-400" />
                <span>Notificação no WhatsApp:</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-mono font-bold">{phone || 'WhatsApp do parceiro'}</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Disparamos a notificação com seu e-mail, senha e o link da arte para o número cadastrado. Caso a janela não tenha aberto automaticamente, clique no botão abaixo:
            </p>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle size={17} />
              <span>Abrir WhatsApp com Meus Dados e Arte</span>
            </button>
          </div>
        </div>

        {/* Rodapé com Navegação para o Painel */}
        <div className="p-4 sm:p-6 bg-[#101017] border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            Você já está logado na sua conta de parceiro.
          </span>

          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full sm:w-auto bg-[#FF5F00] hover:bg-[#E64A00] text-white font-black py-3 px-6 rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
          >
            <Store size={16} />
            <span>Acessar Painel do Lojista</span>
          </button>
        </div>

      </div>
    </div>
  );
};
