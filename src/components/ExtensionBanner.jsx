import React, { useState } from 'react';
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
  Puzzle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExtensionBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem('melhor_cupom_extension_banner_closed') === 'true';
    } catch {
      return false;
    }
  });

  const extensionPath = 'C:\\Users\\pagju\\.gemini\\antigravity\\scratch\\melhor-cupom\\chrome-extension';

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

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('melhor_cupom_extension_banner_closed', 'true');
    } catch {}
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#3B82F6', '#10B981']
    });
  };

  if (isDismissed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsDismissed(false);
            try {
              localStorage.removeItem('melhor_cupom_extension_banner_closed');
            } catch {}
          }}
          className="text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3.5 py-1.5 rounded-full border border-orange-500/30 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Puzzle size={13} className="text-orange-400" />
          <span>Ver Extensão para Chrome que avisa cupons</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* BANNER PRINCIPAL NA VITRINE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171226] via-[#21142B] to-[#12121D] border-2 border-[#FF5F00]/50 shadow-2xl shadow-orange-950/30 p-6 sm:p-8 transition-all hover:border-[#FF5F00] group">
        
        {/* Luz ambiente de fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão de Fechar discreto */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors z-20 cursor-pointer"
          title="Ocultar banner por enquanto"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* LADO ESQUERDO: TEXTOS E BENEFÍCIOS */}
          <div className="flex-1 space-y-4 max-w-2xl text-left">
            
            {/* Tag em Destaque */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Puzzle size={14} className="text-orange-400" />
              <span>Extensão Oficial para Google Chrome</span>
            </div>

            {/* Título Chamativo */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display leading-tight">
              Avisa automaticamente quando o site tem{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F00] via-[#FFB703] to-[#FF8400]">
                cupons e descontos!
              </span>
            </h2>

            {/* Descrição */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Você não precisa mais procurar cupons na internet. Ao navegar na <strong className="text-white">Shopee</strong>, <strong className="text-white">Mercado Livre</strong>, <strong className="text-white">Magalu</strong>, <strong className="text-white">SHEIN</strong>, <strong className="text-white">Amazon</strong> e +50 lojas, nossa extensão acende no seu navegador e avisa os melhores códigos no carrinho!
            </p>

            {/* Pílulas de Recursos */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-300 font-semibold">
              <span className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                <BellRing size={13} className="text-[#FF5F00]" />
                <span>Alerta instantâneo na tela</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                <Zap size={13} className="text-amber-400" />
                <span>Copia cupom com 1 clique</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>100% Grátis & Seguro</span>
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-600/40 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
              >
                <Download size={16} />
                <span>Instalar Extensão no Chrome Agora</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={handleOpenModal}
                className="bg-white/10 hover:bg-white/15 text-white font-bold px-4 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
              >
                Ver Como Funciona
              </button>
            </div>
          </div>

          {/* LADO DIREITO: MOCKUP VISUAL INTERATIVO DO ALERTA */}
          <div className="w-full lg:w-auto flex-shrink-0 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Efeito de brilho ao redor */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-1000" />

              {/* Simulação do Alerta Flutuante da Extensão */}
              <div className="relative bg-[#161626] border border-orange-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 backdrop-blur-xl">
                
                {/* Topo do Alerta */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center shadow-md">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Melhor<span className="text-[#FF5F00]">Cupom</span></div>
                      <div className="text-[10px] text-emerald-400 font-bold">Extensão Ativa no Navegador</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Ao Vivo
                  </span>
                </div>

                {/* Mensagem de Alerta da Loja */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>🎉</span>
                    <span>Encontramos 4 cupons para a <strong className="text-amber-300">Shopee</strong>!</span>
                  </div>
                  <div className="text-[11px] text-gray-300 mt-1">
                    Economize até <strong>R$ 50 OFF</strong> no seu carrinho de compras agora.
                  </div>
                </div>

                {/* Cupom em Destaque no Mockup */}
                <div className="flex items-center justify-between bg-black/50 border border-dashed border-white/20 rounded-xl p-2.5 px-3">
                  <div>
                    <span className="text-[10px] bg-[#FF5F00] text-white font-black px-1.5 py-0.5 rounded">
                      R$ 20 OFF
                    </span>
                    <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                      SHOPEEAPP20
                    </div>
                  </div>
                  <span className="text-[11px] bg-white text-black font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                    Copiar
                  </span>
                </div>

                <div className="text-center pt-1">
                  <span className="text-[10px] text-gray-400">
                    ⚡ Funciona automaticamente em Shopee, Mercado Livre, Magalu, Shein e mais!
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL COM TUTORIAL DE INSTALAÇÃO PASSO A PASSO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#14141E] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Botão Fechar Modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5F00] to-amber-500 text-white flex items-center justify-center shadow-lg">
                <Puzzle size={24} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Instalar Extensão no Google Chrome
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Siga os 3 passos rápidos para ativar os alertas automáticos no seu navegador.
                </p>
              </div>
            </div>

            {/* 3 Passos Ilustrados */}
            <div className="space-y-4 mb-6">
              
              {/* Passo 1 */}
              <div className="bg-[#1A1A28] border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">Abra as Extensões do Google Chrome</h4>
                  <p className="text-xs text-gray-300">
                    No seu Google Chrome, digite na barra de endereços: <code className="bg-black/60 text-amber-300 px-2 py-0.5 rounded font-mono text-xs">chrome://extensions</code> e aperte Enter.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="bg-[#1A1A28] border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#FF5F00] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">Ative o "Modo do Desenvolvedor"</h4>
                  <p className="text-xs text-gray-300">
                    No canto superior direito da página do Chrome, ative a chave <strong>"Modo do desenvolvedor"</strong>.
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

            {/* Teste Rápido */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>Como Testar Após Instalar:</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Abra uma nova aba e acesse <strong className="text-white">shopee.com.br</strong> ou <strong className="text-white">mercadolivre.com.br</strong>. O balão do Melhor Cupom surgirá no canto superior direito com os cupons ativos!
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
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
