import React, { useState } from 'react';
import { 
  X, 
  Pencil, 
  Upload, 
  Globe, 
  Sliders, 
  Maximize2, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Image, 
  Tag, 
  MoveVertical 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { getCouponBanner } from '../utils/bannerResolver';

const BANNER_GALLERY_PRESETS = [
  {
    category: '🍔 Gastronomia & Bebidas',
    images: [
      { label: 'Burger Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
      { label: 'Pizza & Massa', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
      { label: 'Restaurante & Drinks', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80' },
      { label: 'Sushi & Japonês', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80' },
      { label: 'Churrasco Nobre', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80' },
      { label: 'Cafeteria & Doce', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    category: '👗 Moda & Calçados',
    images: [
      { label: 'Loja de Moda', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80' },
      { label: 'Sneakers & Tênis', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80' },
      { label: 'Roupas Streetwear', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80' },
      { label: 'Acessórios & Bolsas', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    category: '⚡ Tech & Setup Gamer',
    images: [
      { label: 'Setup Gamer RGB', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' },
      { label: 'Hardware & GPU', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80' },
      { label: 'Smartphones & Tech', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80' },
      { label: 'Headphones & Som', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    category: '💄 Beleza & Perfumes',
    images: [
      { label: 'Skincare & Maquiagem', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80' },
      { label: 'Frascos de Perfumes', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80' },
      { label: 'Salão & Estética', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    category: '🛋️ Casa & Decoração',
    images: [
      { label: 'Sala Sofisticada', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80' },
      { label: 'Cozinha Moderna', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' },
      { label: 'Cama & Quarto', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    category: '💪 Saúde & Fitness',
    images: [
      { label: 'Academia & Treino', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
      { label: 'Suplementação', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
      { label: 'Farmácia & Cuidados', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80' }
    ]
  }
];

export const AdminEditOfferBannerModal = ({ coupon, store, isOpen, onClose }) => {
  const { updateCoupon } = useApp();

  const currentBanner = coupon ? getCouponBanner(coupon, store) : '';
  const [previewBanner, setPreviewBanner] = useState(currentBanner);
  const [modalTab, setModalTab] = useState('adjust'); // 'adjust' | 'gallery' | 'custom'
  const [customMode, setCustomMode] = useState('upload'); // 'upload' | 'url'
  const [customUrl, setCustomUrl] = useState(
    coupon?.banner && typeof coupon.banner === 'string' && coupon.banner.startsWith('http') ? coupon.banner : ''
  );

  // Controles de enquadramento da capa
  const [bannerFit, setBannerFit] = useState(coupon?.bannerFit || 'cover');
  const [bannerScale, setBannerScale] = useState(coupon?.bannerScale || 100);
  const [bannerPosition, setBannerPosition] = useState(coupon?.bannerPosition || 'center');

  if (!isOpen || !coupon) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setPreviewBanner(base64);
        setCustomUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const finalBanner = (previewBanner || customUrl || '').trim();
    if (!finalBanner) return;

    updateCoupon(coupon.id, {
      banner: finalBanner,
      image: finalBanner,
      bannerFit,
      bannerScale,
      bannerPosition
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#3B82F6', '#10B981']
    });

    onClose();
  };

  const handleResetFraming = () => {
    setBannerFit('cover');
    setBannerScale(100);
    setBannerPosition('center');
  };

  const handleResetToCategoryDefault = () => {
    // Limpa override e restaura banner padrão
    const cleanCoupon = { ...coupon, banner: null, image: null };
    const defaultBanner = getCouponBanner(cleanCoupon, store);
    setPreviewBanner(defaultBanner);
    setCustomUrl('');
    handleResetFraming();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#151522] border-2 border-orange-500/50 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative space-y-4 text-left animate-scale-up my-auto max-h-[95vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/40">
              <Pencil size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Editar Capa da Oferta</h3>
              <p className="text-xs text-orange-300 font-semibold truncate max-w-[280px]">
                {coupon.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Prévia ao Vivo em Formato de Card de Oferta */}
        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between w-full px-2 text-[11px]">
            <span className="font-bold text-gray-400">Prévia no Card da Oferta</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-md font-mono font-bold">
              {bannerFit === 'cover' ? 'Cobrir' : 'Conter'} • {bannerScale}% • {bannerPosition}
            </span>
          </div>

          {/* Banner Simulado */}
          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden bg-black relative shadow-xl border border-white/15">
            <img
              src={previewBanner}
              alt={coupon.title}
              style={{
                objectFit: bannerFit,
                objectPosition: bannerPosition,
                transform: bannerScale !== 100 ? `scale(${bannerScale / 100})` : undefined,
                transition: 'transform 0.1s ease'
              }}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-black/40 pointer-events-none" />

            {/* Badge de Desconto */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white px-2 py-0.5 rounded-md font-black text-[10px] tracking-tight shadow-md flex items-center gap-1">
              <Tag size={10} />
              <span>{coupon.discountBadge || 'OFERTA'}</span>
            </div>

            {/* Nome da Loja */}
            <div className="absolute bottom-2 left-3 z-10">
              <span className="text-[11px] font-black text-white drop-shadow-md">
                {coupon.storeName || store?.name || 'Loja Parceira'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-gray-400">
            Ajuste a imagem para destacar o produto ou refeição sem cortes indesejados
          </span>
        </div>

        {/* Abas Principais */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setModalTab('adjust')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              modalTab === 'adjust' ? 'bg-[#FF5F00] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Enquadramento & Zoom</span>
          </button>
          <button
            type="button"
            onClick={() => setModalTab('gallery')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              modalTab === 'gallery' ? 'bg-[#FF5F00] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Galeria Temática (1 Clique)</span>
          </button>
          <button
            type="button"
            onClick={() => setModalTab('custom')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              modalTab === 'custom' ? 'bg-[#FF5F00] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload size={13} />
            <span>Upload / Link</span>
          </button>
        </div>

        {/* CONTEÚDO DA ABA 1: AJUSTE FINO DE ENQUADRAMENTO */}
        {modalTab === 'adjust' && (
          <div className="space-y-3.5 bg-black/20 p-3.5 rounded-2xl border border-white/5">
            {/* 1. Modo de Enquadramento */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
                <span>1. Formato de Preenchimento da Capa:</span>
                <span className="text-[10px] text-orange-300 font-semibold">{bannerFit === 'cover' ? 'Cobrir 100%' : 'Conter Proporcional'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBannerFit('cover')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    bannerFit === 'cover'
                      ? 'bg-orange-600/30 border-orange-500 text-orange-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Sliders size={13} />
                  <span>Cobrir Card (Recomendado)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBannerFit('contain')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    bannerFit === 'contain'
                      ? 'bg-orange-600/30 border-orange-500 text-orange-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Maximize2 size={13} />
                  <span>Conter Proporcional</span>
                </button>
              </div>
            </div>

            {/* 2. Zoom / Escala Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-gray-300">2. Zoom / Aproximação:</span>
                <span className="text-amber-300 font-mono bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-black">
                  {bannerScale}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="220"
                step="5"
                value={bannerScale}
                onChange={(e) => setBannerScale(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF5F00]"
              />
              <div className="flex items-center justify-between gap-1 mt-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setBannerScale(prev => Math.max(70, prev - 10))}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md font-bold transition-colors cursor-pointer"
                >
                  -10%
                </button>
                <button
                  type="button"
                  onClick={() => setBannerScale(100)}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    bannerScale === 100 ? 'bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  100% Padrão
                </button>
                <button
                  type="button"
                  onClick={() => setBannerScale(125)}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    bannerScale === 125 ? 'bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  125%
                </button>
                <button
                  type="button"
                  onClick={() => setBannerScale(prev => Math.min(220, prev + 10))}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md font-bold transition-colors cursor-pointer"
                >
                  +10%
                </button>
              </div>
            </div>

            {/* 3. Foco Vertical / Posicionamento */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-300">3. Posição Vertical do Foco:</span>
                <span className="text-blue-300 font-mono text-[11px] font-bold">
                  {bannerPosition === 'top' ? 'Topo' : bannerPosition === 'bottom' ? 'Base' : 'Centro'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'top', label: '⬆️ Foco no Topo' },
                  { id: 'center', label: '⏺️ Foco no Centro' },
                  { id: 'bottom', label: '⬇️ Foco na Base' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setBannerPosition(pos.id)}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      bannerPosition === pos.id
                        ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-sm'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Redefinir Enquadramento Padrão */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetFraming}
                className="text-[11px] text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Redefinir enquadramento para valores padrão</span>
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: GALERIA TEMÁTICA DE ALTA RESOLUÇÃO */}
        {modalTab === 'gallery' && (
          <div className="space-y-3 bg-black/20 p-3.5 rounded-2xl border border-white/5 max-h-72 overflow-y-auto no-scrollbar">
            <span className="text-xs text-gray-300 font-bold block mb-1">
              Selecione uma foto profissional pronta em 1 clique:
            </span>

            {BANNER_GALLERY_PRESETS.map((section) => (
              <div key={section.category} className="space-y-1.5">
                <span className="text-[11px] font-bold text-orange-300 block">{section.category}</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {section.images.map((img) => {
                    const isSelected = previewBanner === img.url;
                    return (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => {
                          setPreviewBanner(img.url);
                          setCustomUrl(img.url);
                        }}
                        className={`group relative h-16 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-orange-500 border-white scale-102 shadow-lg' : 'border-white/10 opacity-75 hover:opacity-100 hover:border-white/40'
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[9px] font-bold text-white truncate w-full text-left">{img.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTEÚDO DA ABA 3: UPLOAD DO PC OU LINK URL */}
        {modalTab === 'custom' && (
          <div className="space-y-3 bg-black/20 p-3.5 rounded-2xl border border-white/5">
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCustomMode('upload')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  customMode === 'upload' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload size={13} />
                <span>Enviar Foto do PC / Celular</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomMode('url')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  customMode === 'url' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe size={13} />
                <span>Link da Imagem (URL)</span>
              </button>
            </div>

            {customMode === 'upload' ? (
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Selecione a foto de capa (PNG, JPG, WebP)
                </label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-orange-500/40 hover:border-orange-400 rounded-2xl bg-orange-500/5 hover:bg-orange-500/10 cursor-pointer transition-all">
                  <Upload size={24} className="text-orange-400 mb-1.5" />
                  <span className="text-xs font-black text-orange-300">Escolher Foto do Computador ou Celular</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Formato paisagem (horizontal) recomendado</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Cole o link direto da imagem
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setPreviewBanner(e.target.value);
                  }}
                  placeholder="https://exemplo.com/foto-capa.jpg"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Botão Restaurar Padrão */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetToCategoryDefault}
                className="text-[11px] text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Restaurar capa padrão automática</span>
              </button>
            </div>
          </div>
        )}

        {/* Rodapé de Ações */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF5F00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check size={14} />
            <span>Salvar Capa da Oferta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
