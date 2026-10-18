import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  X, 
  CheckCircle2, 
  BellRing, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Puzzle,
  ChevronRight,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { useApp } from '../context/AppContext';

export const ExtensionBanner = () => {
  const { isExtensionModalOpen, setIsExtensionModalOpen, openExtensionModal, closeExtensionModal } = useApp();
  const [copiedPath, setCopiedPath] = useState(false);

  // Controle de exibição do popup flutuante que surge enquanto o usuário navega
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('melhor_cupom_extension_popup_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const extensionPath = 'C:\\Users\\pagju\\.gemini\\antigravity\\scratch\\melhor-cupom\\chrome-extension';

  // O popup surge automaticamente após 2.5 segundos de navegação
  useEffect(() => {
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(extensionPath);
    setCopiedPath(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#FFB703', '#10B981']
    });
    setTimeout(() => setCopiedPath(false), 3000);
  };

  const handleDismissPopup = (e) => {
    e?.stopPropagation?.();
    setIsPopupVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('melhor_cupom_extension_popup_dismissed', 'true');
    } catch {}
  };

  const handleOpenModal = () => {
    openExtensionModal();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#3B82F6', '#10B981']
    });
  };

  return (
    <>
      {/* 1. POPUP FLUTUANTE QUE APARECE ENQUANTO NAVEGA PELO SITE */}
      {isPopupVisible && !isDismissed && (
        <aside 
          aria-label="Notificação da Extensão"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-[370px] w-[calc(100%-2.5rem)] animate-slide-up group"
        >
          {/* Brilho neon de fundo */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FF5F00] via-amber-500 to-orange-600 opacity-40 blur-lg group-hover:opacity-75 transition duration-500 pointer-events-none" />

          {/* Cartão do Popup */}
          <div className="relative bg-[#13131F]/95 border-2 border-[#FF5F00]/60 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-left space-y-3.5">
            
            {/* Topo: Logo Oficial + Badge + Botão Fechar */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <img 
                  src={logoMelhorCupom} 
                  alt="Melhor Cupom" 
                  className="h-7 w-auto object-contain drop-shadow" 
                />
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                  Extensão Chrome
                </span>
              </div>

              <button
                onClick={handleDismissPopup}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimizar aviso"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo com Gancho Rápido */}
            <div className="space-y-1.5">
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <span className="text-base animate-bounce">⚡</span>
                <span>Avisa cupons enquanto você navega!</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Nossa extensão acende na tela ao entrar na <strong className="text-white">Shopee</strong>, <strong className="text-white">Mercado Livre</strong>, <strong className="text-white">Magalu</strong> e +50 lojas para aplicar descontos no checkout!
              </p>
            </div>

            {/* Mini Demonstração em Pílula */}
            <div className="bg-black/50 border border-orange-500/30 rounded-xl p-2 px-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] text-emerald-300 font-bold">4 cupons disponíveis</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Até R$ 50 OFF
              </span>
            </div>

            {/* Ações do Popup */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleOpenModal}
                className="flex-1 bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-black py-2.5 px-3 rounded-xl text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Download size={14} />
                <span>Instalar Extensão Grátis</span>
                <ChevronRight size={13} />
              </button>

              <button
                onClick={handleDismissPopup}
                className="text-[11px] text-gray-400 hover:text-white px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                Depois
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* 2. BOTÃO FLUTUANTE DISCRETO QUANDO O POPUP FOR MINIMIZADO */}
      {isDismissed && (
        <button
          onClick={() => {
            setIsDismissed(false);
            setIsPopupVisible(true);
          }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-[#171226] to-[#21142B] border border-[#FF5F00]/50 hover:border-[#FF5F00] text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer group"
          title="Abrir detalhes da Extensão para Chrome do Melhor Cupom"
        >
          <div className="w-6 h-6 rounded-full bg-[#FF5F00] text-white flex items-center justify-center shadow-sm">
            <Puzzle size={13} className="group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xs font-bold text-gray-200 group-hover:text-amber-300 transition-colors">
            Extensão Chrome
          </span>
          <span className="text-[9px] bg-emerald-500 text-black font-black uppercase px-1.5 py-0.5 rounded-full">
            Avisa Cupons
          </span>
        </button>
      )}

      {/* 3. MODAL COMPLETO COM TUTORIAL DE INSTALAÇÃO PASSO A PASSO & PRÉVIA */}
      {isExtensionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#14141E] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Botão Fechar Modal */}
            <button
              onClick={closeExtensionModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5F00] to-amber-500 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                <Puzzle size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Extensão Melhor Cupom para Chrome
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  Descontos automáticos aplicados no carrinho enquanto você navega nas lojas parceiras!
                </p>
              </div>
            </div>

            {/* Prévia Visual da Extensão em Ação */}
            <div className="mb-6 bg-[#161626] border border-orange-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <img src={logoMelhorCupom} alt="Melhor Cupom" className="h-6 w-auto object-contain" />
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Extensão Ativa no Navegador
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ao Vivo no Site
                </span>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2.5 text-xs text-gray-200">
                🎉 <strong className="text-white">Alerta em Tempo Real:</strong> Quando você entra na <strong>Shopee</strong>, <strong>Mercado Livre</strong>, <strong>Magalu</strong> ou <strong>SHEIN</strong>, a extensão abre automaticamente mostrando os melhores cupons testados!
              </div>
            </div>

            {/* 3 Passos Ilustrados de Instalação */}
            <div className="space-y-4 mb-6">
              
              {/* Passo 1 */}
              <div className="bg-[#1A1A28] border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">Abra a página de Extensões do Google Chrome</h4>
                  <p className="text-xs text-gray-300">
                    No seu Chrome, digite na barra de endereços: <code className="bg-black/60 text-amber-300 px-2 py-0.5 rounded font-mono text-xs select-all">chrome://extensions</code> e aperte Enter.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="bg-[#1A1A28] border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">Ative a chave "Modo do Desenvolvedor"</h4>
                  <p className="text-xs text-gray-300">
                    No canto superior direito da página do Chrome, ative a chavinha <strong>"Modo do desenvolvedor"</strong>.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="bg-[#1A1A28] border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-black text-white">Clique em "Carregar sem compactação"</h4>
                  <p className="text-xs text-gray-300">
                    Clique no botão no canto superior esquerdo e selecione a pasta da extensão no seu computador:
                  </p>
                  
                  {/* Caixa de Cópia do Caminho da Pasta */}
                  <div className="flex items-center justify-between gap-2 bg-black/60 border border-orange-500/30 rounded-xl p-2.5 px-3">
                    <span className="font-mono text-xs text-amber-300 truncate select-all">
                      {extensionPath}
                    </span>
                    <button
                      onClick={handleCopyPath}
                      className="bg-[#FF5F00] hover:bg-[#E04F00] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer shadow-md"
                    >
                      {copiedPath ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedPath ? 'Copiado!' : 'Copiar Caminho'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Como Testar */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl p-4 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>Como Testar Após Instalar:</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Abra uma nova aba e acesse <strong className="text-white">shopee.com.br</strong> ou <strong className="text-white">mercadolivre.com.br</strong>. O balão com a logo do Melhor Cupom surgirá no canto superior com os cupons ativos prontos para copiar!
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeExtensionModal}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Entendi, Fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
