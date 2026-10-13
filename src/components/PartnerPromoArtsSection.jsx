import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Eye, 
  Instagram, 
  ExternalLink,
  Layers,
  CheckCircle2,
  X,
  Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PartnerPromoArtsSection = ({ compact = false }) => {
  const { userProfile, currentRole, stores } = useApp();

  const isMerchantRole = typeof currentRole === 'string' && currentRole.startsWith('merchant_');
  const merchantStore = isMerchantRole ? stores.find(s => s.merchantId === currentRole) : null;
  const referralCode = isMerchantRole 
    ? (merchantStore?.referralCode || 'PARCEIRO5') 
    : (userProfile?.referralCode || 'CUPOM5');

  const referralLink = `https://www.omelhorcupom.com.br/convite/${referralCode}`;

  const [activeFormat, setActiveFormat] = useState('story'); // 'story' ou 'feed'
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const storyImgUrl = '/artes/folder-seja-parceiro-story.png';
  const feedImgUrl = '/artes/folder-seja-parceiro-feed.png';

  const captionText = `🚀 SEJA UM PARCEIRO NO MELHOR CUPOM! 🏪🎟️

Tem uma loja física, restaurante, cafeteria, barbearia ou franquia?
Cadastre sua empresa no Melhor Cupom e coloque suas ofertas na vitrine para milhares de clientes da sua cidade!

🎁 3 MESES 100% GRÁTIS!
✅ Crie já o primeiro cupom ativo da sua loja sem pagar nada
✅ Validador no balcão via QR Code no caixa (PDV)
✅ Sem mensalidade durante o período de degustação
✅ Mais clientes e aumento no faturamento!

👉 Cadastre sua loja agora pelo meu link exclusivo:
${referralLink}

#MelhorCupom #SejaUmParceiro #ComercioLocal #CuponsDeDesconto #LojasParceiras #Empreendedorismo #Promocao`;

  const handleDownload = (formatType) => {
    const isStory = formatType === 'story';
    const link = document.createElement('a');
    link.href = isStory ? storyImgUrl : feedImgUrl;
    link.download = isStory 
      ? `folder-seja-parceiro-story-1080x1920.png` 
      : `folder-seja-parceiro-feed-1080x1080.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const textEncoded = encodeURIComponent(
      `🚀 *SEJA UM PARCEIRO NO MELHOR CUPOM!*\n\nCadastre seu comércio e ganhe *3 MESES 100% GRÁTIS* para criar ofertas e atrair clientes!\n\n👉 Acesse agora: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
  };

  return (
    <div className={`bg-gradient-to-r from-[#201008] via-[#1A141D] to-[#12121A] border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden ${compact ? 'my-4' : 'my-6'}`}>
      {/* Luzes de Fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F00]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabeçalho */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles size={11} />
              <span>Artes Prontas para Divulgação</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {isMerchantRole ? 'Ganhe R$ 5 por loja indicada' : 'Ganhe R$ 3 por amigo indicado'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Folder Oficial: Seja um Parceiro</span>
            <span className="text-amber-400 font-normal text-xs sm:text-sm">(3 Meses Grátis)</span>
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
            Baixe as artes oficiais prontas para postar todos os dias nos <strong>Stories</strong> e no <strong>Feed</strong> do Instagram, WhatsApp ou grupos, convidando comerciantes para cadastrar suas lojas pelo seu link!
          </p>
        </div>

        {/* Seletor de Formato (Story / Feed) */}
        <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10 flex-shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveFormat('story')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFormat === 'story'
                ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Story (9:16)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFormat('feed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFormat === 'feed'
                ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Feed (1:1)</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal: Prévia da Arte + Ações */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Coluna 1: Imagem da Arte (Coluna 5) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div 
            onClick={() => setPreviewModalImg(activeFormat === 'story' ? storyImgUrl : feedImgUrl)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-black max-w-[260px] w-full transition-transform hover:scale-[1.02]"
            title="Clique para ampliar em tela cheia"
          >
            <img 
              src={activeFormat === 'story' ? storyImgUrl : feedImgUrl} 
              alt="Folder Seja um Parceiro"
              className={`w-full object-contain block ${activeFormat === 'story' ? 'aspect-[9/16]' : 'aspect-square'}`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
              <Eye size={18} />
              <span>Ver em Tamanho Real</span>
            </div>
            <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/40 text-[10px] text-amber-300 font-bold">
              {activeFormat === 'story' ? 'Story • 1080x1920' : 'Feed • 1080x1080'}
            </div>
          </div>

          <span className="text-[11px] text-gray-400 mt-2 text-center flex items-center gap-1">
            <Eye size={12} className="text-amber-400" />
            <span>Toque na arte para ampliar em alta resolução</span>
          </span>
        </div>

        {/* Coluna 2: Informações, Downloads e Legenda Pronta (Coluna 7) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Card dos Botões de Download */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              1. Baixar Arquivo em Alta Resolução (PNG HD):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDownload('story')}
                className="bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <Download size={15} />
                <span>Baixar para Story (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload('feed')}
                className="bg-white/10 hover:bg-white/20 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Baixar para Feed (1:1)</span>
              </button>
            </div>
          </div>

          {/* Legenda Pronta com Link do Usuário */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                2. Legenda Pronta (com seu link de indicação):
              </span>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
              >
                {copiedCaption ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCaption ? 'Copiada com Sucesso!' : 'Copiar Legenda'}</span>
              </button>
            </div>

            <div className="relative bg-[#101017] p-3 rounded-xl border border-white/5 text-xs text-gray-300 font-mono max-h-28 overflow-y-auto leading-relaxed select-all">
              {captionText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Share2 size={14} />
                <span>Enviar pelo WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => window.open('https://www.instagram.com', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Instagram size={14} />
                <span>Abrir Instagram</span>
              </button>
            </div>
          </div>

          {/* Dica para Postar */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-emerald-400" />
            <span>
              <strong>Dica de Postagem Diária:</strong> Poste o Story no seu Instagram, adicione o <strong>adesivo de Link</strong> com seu endereço <code>{referralLink}</code> e marque <strong>@omelhorcupom.com.br</strong>!
            </span>
          </div>

        </div>

      </div>

      {/* Modal de Zoom da Imagem em Tamanho Real */}
      {previewModalImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-lg max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute -top-12 right-0 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <img 
              src={previewModalImg} 
              alt="Arte Ampliada" 
              className="max-h-[82vh] w-auto rounded-2xl border-2 border-amber-400 shadow-2xl object-contain block"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDownload(previewModalImg.includes('story') ? 'story' : 'feed')}
                className="bg-amber-400 text-black font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Esta Imagem</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="bg-white/10 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-white/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
