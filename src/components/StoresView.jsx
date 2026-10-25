import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CityEmptyState } from './CityEmptyState';
import { 
  Search, 
  Store, 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  QrCode, 
  MapPin, 
  Coins, 
  Globe, 
  Zap, 
  Tag, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Pencil, 
  Upload, 
  RotateCcw, 
  Check, 
  X,
  Sliders,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBrandLogo } from '../assets/brands';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'Todas as Categorias', icon: '✨' },
  { id: 'gastronomia', label: 'Gastronomia & Bares', icon: '🍔' },
  { id: 'moda', label: 'Moda & Roupas', icon: '👗' },
  { id: 'beleza', label: 'Beleza & Perfumaria', icon: '💄' },
  { id: 'fitness', label: 'Saúde & Fitness', icon: '💪' },
  { id: 'servicos', label: 'Tech & Informática', icon: '⚡' },
  { id: 'casa', label: 'Casa & Móveis', icon: '🛋️' },
  { id: 'lazer', label: 'Lazer & Cinema', icon: '🎬' },
  { id: 'outros', label: 'Outros Parceiros', icon: '📦' }
];

// Helper para obter a logo real e confiável da marca (resolvendo marcas oficiais e evitando links quebrados)
export const getEffectiveStoreLogo = (store) => {
  if (!store) return '';
  const raw = store.logoImage;
  const isCustomUserUpload = store.hasCustomLogo && typeof raw === 'string' && raw.startsWith('data:image/');
  if (isCustomUserUpload) {
    return raw;
  }
  const brandLogo = getBrandLogo(store.name) || getBrandLogo(store.id) || getBrandLogo(store.apiSource);
  if (brandLogo) {
    return brandLogo;
  }
  if (typeof raw === 'string' && raw.length > 0 && !raw.includes('/src/') && !raw.includes('cdn.lomadee.com.br')) {
    return raw;
  }
  return '';
};

// Helper para verificar se a loja possui ajustes manuais de enquadramento salvos pelo Administrador
const hasCustomStoreLogoSettings = (store) => {
  return Boolean(
    store?.logoFit || 
    (store?.logoScale !== undefined && store?.logoScale !== 100) || 
    store?.logoPadding !== undefined || 
    store?.logoBg
  );
};

// Helper para gerar o style do logo respeitando ajustes manuais salvos
const getStoreLogoStyle = (store, override = {}) => {
  const fit = override.logoFit ?? store?.logoFit ?? 'contain';
  const scale = override.logoScale ?? store?.logoScale ?? 100;
  const padding = override.logoPadding ?? store?.logoPadding ?? 6;

  const style = {
    objectFit: fit,
    padding: `${padding}px`
  };
  if (scale !== 100) {
    style.transform = `scale(${scale / 100})`;
  }
  return style;
};

// Helper para enquadramento inteligente e preenchimento harmônico dos logos (padrão)
const getStoreLogoFit = (store, storeLogo) => {
  const name = (store?.name || '').toLowerCase();
  const id = (store?.id || '').toLowerCase();
  const url = (storeLogo || '').toLowerCase();

  // 1. Logos com margens brancas embutidas no arquivo original da Lomadee/Awin (ex: Drogaria Rosário):
  if (name.includes('rosário') || name.includes('rosario') || id.includes('ros_rio')) {
    return 'w-full h-full object-contain scale-145 p-0';
  }

  // 2. Selos e ícones de app com fundo colorido próprio (PneuBest, Friopeças, Speedmax, Eco Flame):
  // Preenchem 100% do quadrinho arredondado de ponta a ponta sem bordas brancas:
  if (
    url.includes('apenas_icone') ||
    name.includes('pneubest') ||
    name.includes('speedmax') ||
    name.includes('eco flame') ||
    name.includes('friopecas') ||
    name.includes('friopeças')
  ) {
    return 'w-full h-full object-cover scale-102 p-0';
  }

  // 3. Logos de marcas oficiais (Balaroti, Toymania, Homedock, Kidy, Sottile Casa, Terabyte, etc.):
  // Sem o padding duplo antigo, aproveitam a largura máxima da caixa mantendo proporção e legibilidade:
  return 'w-full h-full object-contain p-1.5';
};

export const StoresView = ({ onSelectStore }) => {
  const { stores, openAuthModal, userProfile, currentRole, isSimulatingRole, setIsReferralModalOpen, updateStore } = useApp();
  const [search, setSearch] = useState('');
  const [storeTypeFilter, setStoreTypeFilter] = useState('all'); // 'all' | 'physical' | 'online'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Estados para edição administrativa e ajuste de enquadramento da logo dos parceiros
  const [editingStore, setEditingStore] = useState(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(null);
  const [modalTab, setModalTab] = useState('adjust'); // 'adjust' | 'replace'
  const [logoInputMode, setLogoInputMode] = useState('upload'); // 'upload' | 'url'
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [previewLogo, setPreviewLogo] = useState('');

  // Controles de enquadramento fino
  const [logoFit, setLogoFit] = useState('contain'); // 'contain' | 'cover'
  const [logoScale, setLogoScale] = useState(100); // 50% a 250%
  const [logoPadding, setLogoPadding] = useState(6); // 0px a 24px
  const [logoBg, setLogoBg] = useState('#ffffff');

  const handleOpenEditLogo = (store) => {
    const currentImg = getEffectiveStoreLogo(store);
    
    // Herda valores já configurados pelo lojista/admin ou calcula padrões ideais
    const defaultFit = store.logoFit || 'contain';
    const defaultScale = store.logoScale !== undefined ? store.logoScale : 100;
    const defaultPadding = store.logoPadding !== undefined ? store.logoPadding : 6;
    const defaultBg = store.logoBg || '#ffffff';

    setEditingStore(store);
    setPreviewLogo(currentImg);
    setNewLogoUrl(typeof store.logoImage === 'string' && store.logoImage.startsWith('http') && !store.logoImage.includes('cdn.lomadee.com.br') ? store.logoImage : '');
    setLogoFit(defaultFit);
    setLogoScale(defaultScale);
    setLogoPadding(defaultPadding);
    setLogoBg(defaultBg);
    setModalTab('adjust');
    setLogoInputMode('upload');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Se for SVG, preserva vetor leve original
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result;
        if (svgContent) setPreviewLogo(svgContent);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Para PNG/JPG/WebP: redimensionar otimizado para 240x240 garantindo nitidez cristalina e peso ultraleve (<25KB)
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result;
      if (!rawBase64) return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 240;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const optimized = canvas.toDataURL('image/png');
        setPreviewLogo(optimized);
      };
      img.onerror = () => setPreviewLogo(rawBase64);
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = () => {
    if (!editingStore) return;
    const finalLogo = (previewLogo || newLogoUrl || '').trim();

    updateStore(editingStore.id, {
      ...(finalLogo ? { logoImage: finalLogo } : {}),
      hasCustomLogo: Boolean(finalLogo && finalLogo.startsWith('data:image/')),
      logoFit,
      logoScale,
      logoPadding,
      logoBg,
      storeName: editingStore.name
    });

    const savedName = editingStore.name;
    setSaveSuccessToast(`Ajustes e logo da marca "${savedName}" salvos com sucesso!`);
    setTimeout(() => setSaveSuccessToast(null), 3500);

    setEditingStore(null);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#FF5F00', '#10B981']
    });
  };

  const handleResetFraming = () => {
    setLogoFit('contain');
    setLogoScale(100);
    setLogoPadding(6);
    setLogoBg('#ffffff');
  };

  const handleResetToDefault = () => {
    if (!editingStore) return;
    const defaultLogo = getBrandLogo(editingStore.name) || getBrandLogo(editingStore.id) || getBrandLogo(editingStore.apiSource) || '';
    setPreviewLogo(defaultLogo);
    setNewLogoUrl('');
    handleResetFraming();
  };

  const isSimulationOrAdmin = currentRole === 'admin' || currentRole === 'merchant_parceiro_demo' || isSimulatingRole;

  // Ordenar lojas priorizando as que estão em DESTAQUE (⭐) e depois por plano (Ouro > Prata > Bronze > Credenciado)
  const sortedStores = useMemo(() => {
    return [...stores].sort((a, b) => {
      const isAHighlighted = Boolean(a.highlight || a.isFeatured);
      const isBHighlighted = Boolean(b.highlight || b.isFeatured);
      if (isBHighlighted !== isAHighlighted) {
        return isBHighlighted ? 1 : -1; // Lojas em destaque vêm sempre no topo
      }
      const weights = { gold: 10, silver: 5, bronze: 3, api: 1, free: 1 };
      const wA = weights[a.tier || 'api'] || 1;
      const wB = weights[b.tier || 'api'] || 1;
      if (wB !== wA) return wB - wA;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [stores]);

  const physicalStoresCount = useMemo(() => stores.filter(s => 
    s.type === 'physical' && 
    !s.isApiIntegrated && 
    !s.isSimulationOnly &&
    s.id !== 'store_parceiro_demo' && 
    s.merchantId !== 'merchant_parceiro_demo' &&
    !s.id?.includes('demo') &&
    !s.merchantId?.includes('demo') &&
    !s.name?.toLowerCase().includes('smash burger') &&
    !s.name?.toLowerCase().includes('loja parceira')
  ).length, [stores]);
  const onlineStoresCount = useMemo(() => stores.filter(s => s.isApiIntegrated || s.type === 'online').length, [stores]);

  const filteredStores = useMemo(() => {
    return sortedStores.filter(store => {
      // REGRA INVIOLÁVEL: Perfis de testes e simulação (Smash Burger, etc.) NUNCA devem aparecer no catálogo de lojas
      const isTestStore = 
        store.isSimulationOnly ||
        store.id === 'store_parceiro_demo' || 
        store.merchantId === 'merchant_parceiro_demo' ||
        store.id?.includes('demo') ||
        (store.merchantId && store.merchantId.includes('demo')) ||
        (store.name && store.name.toLowerCase().includes('smash burger')) ||
        (store.name && store.name.toLowerCase().includes('loja parceira'));

      if (isTestStore) {
        return false;
      }

      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        store.name.toLowerCase().includes(q) ||
        (store.category && store.category.toLowerCase().includes(q)) ||
        (store.city && store.city.toLowerCase().includes(q)) ||
        (Array.isArray(store.cities) && store.cities.some(c => c.toLowerCase().includes(q))) ||
        (store.address && store.address.toLowerCase().includes(q)) ||
        (store.apiSource && store.apiSource.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (storeTypeFilter === 'physical' && (store.type !== 'physical' || store.isApiIntegrated)) return false;
      if (storeTypeFilter === 'online' && store.type !== 'online' && !store.isApiIntegrated) return false;

      if (selectedCategory !== 'all') {
        const storeCat = (store.category || '').toLowerCase();
        if (selectedCategory === 'casa') {
          if (!storeCat.includes('casa') && !storeCat.includes('móveis') && !storeCat.includes('moveis') && !storeCat.includes('construcao')) return false;
        } else if (selectedCategory === 'servicos') {
          if (!storeCat.includes('servico') && !storeCat.includes('tech') && !storeCat.includes('eletron')) return false;
        } else if (storeCat !== selectedCategory) {
          return false;
        }
      }

      return true;
    });
  }, [sortedStores, search, storeTypeFilter, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8 relative">
      
      {/* Toast flutuante de sucesso ao salvar ajustes de parceiro */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <Check size={18} className="flex-shrink-0" />
          <span className="text-xs font-bold leading-snug">{saveSuccessToast}</span>
        </div>
      )}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Store size={14} />
            <span>Guia Comercial & Rede de Afiliados Oficiais</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Rede de Estabelecimentos Parceiros
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
            Conheça todas as marcas reais, redes e franquias credenciadas que oferecem cupons oficiais e cashback garantido para membros VIP.
          </p>

          {/* Barra de Estatísticas em Tempo Real */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
              <Building2 size={13} className="text-orange-400" />
              <span><strong>{stores.length}</strong> Marcas Reais</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <Tag size={13} />
              <span><strong>370+</strong> Cupons & Ofertas</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Coins size={13} />
              <span>Até <strong>10%</strong> de Cashback</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
              <ShieldCheck size={13} />
              <span>100% Verificadas</span>
            </div>
          </div>
        </div>

        {/* Banner Hero Chamativo "Seja um Parceiro" */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/40 via-[#FF5F00]/20 to-amber-900/30 border-2 border-[#FF5F00] p-6 sm:p-8 shadow-2xl shadow-orange-950/50 group">
          {/* Efeitos de Iluminação de Fundo */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#FF5F00]/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF5F00] via-[#FF7824] to-amber-400 p-0.5 shadow-xl shadow-orange-500/40 flex-shrink-0 animate-bounce">
                <div className="w-full h-full bg-[#181824] rounded-2xl flex items-center justify-center text-3xl sm:text-4xl">
                  🏪
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="bg-[#FF5F00] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-200" />
                    Para Comerciantes & Lojistas
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Tem um Comércio ou Negócio? <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">Seja Nosso Parceiro!</span>
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                  Coloque sua marca na vitrine para milhares de assinantes VIP com alto poder de compra da sua região. Crie ofertas, aumente seu ticket médio e valide cupons com QR Code direto no caixa do seu balcão.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-[11px] text-gray-300 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-black">
                    <CheckCircle2 size={13} /> 🎁 100% Grátis para Começar
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <CheckCircle2 size={13} /> Validador com Câmera PDV
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <CheckCircle2 size={13} /> R$ 5 por amigo no Caixa
                  </span>
                </div>
              </div>
            </div>

            {/* Botão Chamativo de Ação */}
            <div className="w-full lg:w-auto flex flex-col items-center flex-shrink-0">
              <button
                onClick={() => openAuthModal('merchant_register')}
                className="relative group/btn w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-[#FF5F00] via-[#FF7824] to-[#FF9E00] hover:from-[#E04F00] hover:to-[#FF8800] text-white font-black text-sm sm:text-base shadow-2xl shadow-orange-600/60 hover:shadow-orange-500/80 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border border-amber-300/60 cursor-pointer"
              >
                <Sparkles size={20} className="text-amber-200 group-hover/btn:rotate-12 transition-transform" />
                <span className="tracking-wide">CADASTRAR LOJA GRATUITAMENTE</span>
                <ArrowRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
              <span className="text-[11px] text-emerald-400 mt-2 text-center font-bold">
                🎁 Cadastro 100% Gratuito • Comece Agora
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE BUSCA + BOTÃO DE CADASTRO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14141E] p-4 rounded-2xl border border-white/10 shadow-inner">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar marca parceira por nome, categoria ou cidade (ex: McDonald's, Amazon, Nike, China in Box, Livrarias Curitiba)..."
            className="w-full bg-[#181824] border border-white/10 rounded-xl py-3 pl-11 pr-24 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FF5F00] transition-colors shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md cursor-pointer"
              >
                Limpar
              </button>
            )}
            <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
              {filteredStores.length} {filteredStores.length === 1 ? 'marca' : 'marcas'}
            </span>
          </div>
        </div>

        <button
          onClick={() => openAuthModal('merchant_register')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#FF5F00]/20 to-orange-500/20 hover:from-amber-500/30 hover:to-[#FF5F00]/30 border border-[#FF5F00]/50 hover:border-[#FF5F00] text-amber-300 hover:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
          title="Cadastrar meu estabelecimento no Melhor Cupom"
        >
          <PlusCircle size={16} className="text-[#FF5F00]" />
          <span>Cadastrar Minha Loja</span>
        </button>
      </div>

      {/* 2.1 FILTROS DE TIPO (TODAS / LOCAIS / ONLINE) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStoreTypeFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'all'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          Todas as Marcas ({stores.length})
        </button>
        <button
          onClick={() => setStoreTypeFilter('physical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'physical'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          🏪 Comércios Locais & Franquias ({physicalStoresCount})
        </button>
        <button
          onClick={() => setStoreTypeFilter('online')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            storeTypeFilter === 'online'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-white border border-emerald-500/20'
          }`}
        >
          ⚡ Grandes Marcas & E-commerces ({onlineStoresCount})
        </button>
      </div>

      {/* 2.2 FILTROS POR CATEGORIA */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_CHIPS.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                isActive
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. LISTA / GRID DE LOJAS PARCEIRAS */}
      {filteredStores.length === 0 ? (
        <CityEmptyState
          cityName={search.trim()}
          onResetCity={() => {
            setSearch('');
            setStoreTypeFilter('all');
            setSelectedCategory('all');
          }}
          isRegistered={Boolean(userProfile?.isRegistered && userProfile?.isLoggedIn && currentRole !== 'visitor')}
          referralCode={userProfile?.referralCode || null}
          onOpenReferralModal={() => setIsReferralModalOpen(true)}
          onOpenAuthModal={(mode) => openAuthModal(mode || 'user_register')}
          onOpenMerchantRegister={() => openAuthModal('merchant_register')}
          totalOffersCount={stores.length}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          
          {/* Card Chamativo: "Sua Loja Aqui" */}
          <div
            onClick={() => openAuthModal('merchant_register')}
            className="bg-gradient-to-b from-[#FF5F00]/15 via-[#181824] to-[#181824] hover:from-[#FF5F00]/30 hover:to-[#202030] border-2 border-dashed border-[#FF5F00]/70 hover:border-[#FF5F00] rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-orange-950/40 hover:-translate-y-1 relative"
            title="Clique para cadastrar sua loja"
          >
            <div className="w-full flex justify-center">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5F00] text-white text-[9px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                Sua Marca Aqui
              </span>
            </div>

            <div className="my-3 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-[#FF5F00]/40 group-hover:border-[#FF5F00] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 text-[#FF5F00]">
              <PlusCircle size={32} />
            </div>

            <div className="w-full">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-white transition-colors">
                Seja Parceiro
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Cadastre sua loja grátis
              </p>
            </div>
          </div>

          {/* Cards das Lojas Cadastradas */}
          {filteredStores.map((store) => {
            const isHighlighted = Boolean(store.highlight || store.isFeatured);
            const storeLogo = getEffectiveStoreLogo(store);
            const isOnlineStore = store.isApiIntegrated || store.type === 'online';
            const isPaidStore = Boolean(store.adminPaidPlan && (store.tier === 'gold' || store.tier === 'silver' || store.tier === 'bronze'));
            const tier = isPaidStore ? store.tier : 'api';

            return (
              <div
                key={store.id}
                onClick={() => onSelectStore?.(store)}
                className={`rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group cursor-pointer shadow-lg hover:-translate-y-1 relative overflow-hidden select-none ${
                  tier === 'gold'
                    ? 'bg-gradient-to-b from-[#181824] via-[#14141E] to-[#12121A] border border-amber-400/50 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                    : tier === 'silver'
                    ? 'bg-gradient-to-b from-[#181824] via-[#14141E] to-[#12121A] border border-slate-300/40 hover:border-slate-300 hover:shadow-[0_0_25px_rgba(203,213,225,0.3)]'
                    : tier === 'bronze'
                    ? 'bg-gradient-to-b from-[#181824] via-[#14141E] to-[#12121A] border border-[#CD7F32]/40 hover:border-[#CD7F32] hover:shadow-[0_0_25px_rgba(205,127,50,0.35)]'
                    : 'bg-gradient-to-b from-[#181824] via-[#14141E] to-[#12121A] border border-white/10 hover:border-[#FF5F00]/60 hover:shadow-xl hover:shadow-orange-950/30'
                } ${isHighlighted ? 'ring-2 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)]' : ''}`}
                title={`Ver cupons e ofertas oficiais de ${store.name}`}
              >
                {/* Glow sutil de fundo ao passar mouse */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl transition-all pointer-events-none ${
                  tier === 'gold' || isHighlighted ? 'bg-amber-400/15 group-hover:bg-amber-400/30' : tier === 'silver' ? 'bg-slate-300/15 group-hover:bg-slate-300/25' : tier === 'bronze' ? 'bg-[#CD7F32]/15 group-hover:bg-[#CD7F32]/25' : 'bg-[#FF5F00]/10 group-hover:bg-[#FF5F00]/25'
                }`} />

                {/* Badges superiores: Modalidade no topo esquerdo e Tier/Destaque no topo direito */}
                <div className="w-full flex items-center justify-between gap-1 mb-2 relative z-10">
                  {isOnlineStore ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[9px] font-bold tracking-tight">
                      <span>Online</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/30 text-orange-300 text-[9px] font-bold tracking-tight">
                      <span>Local</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {isHighlighted && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md animate-pulse">
                        ⭐ DESTAQUE
                      </span>
                    )}

                    {tier === 'gold' ? (
                      <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        👑 OURO
                      </span>
                    ) : tier === 'silver' ? (
                      <span className="bg-gray-300 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        🥈 PRATA
                      </span>
                    ) : tier === 'bronze' ? (
                      <span className="bg-[#CD7F32] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        🥉 BRONZE
                      </span>
                    ) : (
                      <span className="bg-white/10 text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        CREDENCIADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Container do Logo com botão de edição exclusiva para Administrador */}
                <div className="relative my-1">
                  {/* Logo da Marca Oficial com borda correspondente ao plano Bronze, Prata, Ouro */}
                  <div 
                    style={{ backgroundColor: store.logoBg || '#ffffff' }}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 relative z-10 ${
                      tier === 'gold'
                        ? 'border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : tier === 'silver'
                        ? 'border-2 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.4)]'
                        : tier === 'bronze'
                        ? 'border-2 border-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.4)]'
                        : 'border border-white/15'
                    }`}
                  >
                    {storeLogo ? (
                      <>
                        <img
                          key={`${store.id}_${storeLogo}_${store.logoScale}_${store.logoFit}_${store.logoPadding}_${store.logoBg}`}
                          src={storeLogo}
                          alt={store.name}
                          style={getStoreLogoStyle(store)}
                          className="w-full h-full transition-transform duration-150"
                          loading="lazy"
                          onLoad={(e) => {
                            e.currentTarget.style.display = 'block';
                            const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                            if (fb) fb.style.display = 'none';
                          }}
                          onError={(e) => {
                            const fbLogo = getBrandLogo(store.name) || getBrandLogo(store.id);
                            if (fbLogo && e.currentTarget.src !== fbLogo) {
                              e.currentTarget.src = fbLogo;
                              return;
                            }
                            e.currentTarget.style.display = 'none';
                            const fb = e.currentTarget.parentElement?.querySelector('.store-fallback-icon');
                            if (fb) fb.style.display = 'flex';
                          }}
                        />
                        <span className="store-fallback-icon hidden w-full h-full items-center justify-center text-3xl">
                          {store.logo || '🛍️'}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl">{store.logo || '🏪'}</span>
                    )}
                  </div>

                  {/* Botão ADM para editar logo de qualquer parceiro (incluindo API) */}
                  {(currentRole === 'admin' || isSimulationOrAdmin) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditLogo(store);
                      }}
                      className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center border-2 border-[#181824] transition-all hover:scale-125 cursor-pointer"
                      title={`Editar e ajustar logo da loja ${store.name}`}
                    >
                      <Pencil size={11} />
                    </button>
                  )}
                </div>

                {/* Informações da Marca */}
                <div className="w-full mt-3 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      {store.name}
                    </h3>

                    {/* Localização ou Escopo Nacional */}
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                      {isOnlineStore ? (
                        <>
                          <Globe size={11} className="text-blue-400 flex-shrink-0" />
                          <span className="truncate">Nacional (Online)</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={11} className="text-orange-400 flex-shrink-0" />
                          <span className="truncate">{store.city ? store.city.split('-')[0].trim() : 'Brasil'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges de Cupons e Cashback */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-1 w-full">
                    {store.cashbackRate && (
                      <span className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                        <Coins size={10} className="text-amber-400" />
                        <span>{store.cashbackRate}</span>
                      </span>
                    )}

                    <span className="text-[10px] text-gray-400 group-hover:text-orange-300 font-semibold transition-colors flex items-center justify-center gap-1">
                      <Tag size={10} />
                      <span>{store.couponsCount ? `${store.couponsCount} cupons` : 'Ver ofertas'}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. SEÇÃO INFORMATIVA DE VANTAGENS DO PARCEIRO */}
      <div className="bg-[#14141E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Por que anunciar no Melhor Cupom?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Transformamos clientes em frequentadores assíduos do seu comércio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center font-bold mb-3">
              <Users size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Clientes Assinantes VIP</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Consumidores dispostos a gastar no comércio local todos os dias em busca dos melhores descontos.
            </p>
          </div>

          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
              <QrCode size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Validação Rápida no Caixa</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Escaneie o QR Code pela câmera do celular ou digite o código de 6 dígitos. Sem burocracia nem aparelhos extras.
            </p>
          </div>

          <div className="bg-[#181824] border border-white/5 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold mb-3">
              <TrendingUp size={20} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Divulgue & Ganhe R$ 5,00</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Convide clientes e amigos para o clube e receba créditos reais no seu Caixa para abater planos ou sacar.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => openAuthModal('merchant_register')}
            className="px-7 py-3.5 rounded-2xl bg-[#FF5F00] hover:bg-[#E04F00] text-white font-black text-sm shadow-xl shadow-orange-600/30 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Cadastrar Meu Estabelecimento Gratuitamente</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* MODAL ADMINISTRATIVO PARA ENQUADRAMENTO E TROCA DE LOGO DE QUALQUER PARCEIRO / API */}
      {editingStore && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setEditingStore(null)}
        >
          <div 
            className="bg-[#151522] border-2 border-blue-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-4 text-left animate-scale-up my-auto max-h-[95vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Ajustar & Enquadrar Logo</h3>
                  <p className="text-xs text-blue-300 font-semibold truncate max-w-[260px]">{editingStore.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStore(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Prévia do Quadrinho com Atualização em Tempo Real */}
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between w-full px-2 text-[11px]">
                <span className="font-bold text-gray-400">Prévia em Tempo Real no Card</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-mono font-bold">
                  {logoFit === 'cover' ? 'Cobrir' : 'Conter'} • {logoScale}% • {logoPadding}px
                </span>
              </div>

              {/* Card de Prévia Idêntico à Vitrine */}
              <div 
                style={{ backgroundColor: logoBg || '#ffffff' }}
                className={`w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl relative transition-all duration-150 ${
                  editingStore.tier === 'gold'
                    ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : editingStore.tier === 'silver'
                    ? 'border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)]'
                    : editingStore.tier === 'bronze'
                    ? 'border-2 border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.3)]'
                    : 'border-2 border-blue-500/50'
                }`}
              >
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt={editingStore.name}
                    style={{
                      objectFit: logoFit,
                      transform: logoScale !== 100 ? `scale(${logoScale / 100})` : undefined,
                      padding: `${logoPadding}px`,
                      transition: 'transform 0.1s ease, padding 0.1s ease'
                    }}
                    className="w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-4xl">{editingStore.logo || '🏪'}</span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">
                Mova os controles abaixo para regular o tamanho, corte e respiro
              </span>
            </div>

            {/* Abas Superiores do Modal: Enquadramento vs Trocar Imagem */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('adjust')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'adjust' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sliders size={13} />
                <span>Ajustar Enquadramento</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('replace')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'replace' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload size={13} />
                <span>Substituir Imagem</span>
              </button>
            </div>

            {/* CONTEÚDO DA ABA 1: AJUSTE FINO DE ENQUADRAMENTO DA IMAGEM ATUAL */}
            {modalTab === 'adjust' && (
              <div className="space-y-3.5 bg-black/20 p-3.5 rounded-2xl border border-white/5">
                {/* 1. Modo de Enquadramento */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>1. Formato de Preenchimento:</span>
                    <span className="text-[10px] text-blue-300 font-semibold">{logoFit === 'contain' ? 'Conter (Sem cortes)' : 'Cobrir (Sem bordas)'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLogoFit('contain')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        logoFit === 'contain'
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Maximize2 size={13} />
                      <span>Conter (Proporcional)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoFit('cover')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        logoFit === 'cover'
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Sliders size={13} />
                      <span>Cobrir Quadrinho</span>
                    </button>
                  </div>
                </div>

                {/* 2. Zoom / Escala Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-300">2. Zoom / Escala da Imagem:</span>
                    <span className="text-amber-300 font-mono bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-black">
                      {logoScale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="230"
                    step="5"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  {/* Presets Rápidos de Zoom */}
                  <div className="flex items-center justify-between gap-1 mt-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setLogoScale(prev => Math.max(50, prev - 10))}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md font-bold transition-colors cursor-pointer"
                    >
                      -10%
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoScale(100)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoScale === 100 ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoScale(125)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoScale === 125 ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      125%
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoScale(145)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoScale === 145 ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                      title="Ideal para marcas com margens brancas embutidas (ex: Drogaria Rosário)"
                    >
                      145% (Rosário)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoScale(prev => Math.min(230, prev + 10))}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md font-bold transition-colors cursor-pointer"
                    >
                      +10%
                    </button>
                  </div>
                </div>

                {/* 3. Margem Interna (Padding) Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-300">3. Margem Interna (Respiro):</span>
                    <span className="text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-black">
                      {logoPadding}px {logoPadding === 0 ? '(Sem bordas)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={logoPadding}
                    onChange={(e) => setLogoPadding(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  {/* Presets Rápidos de Margem */}
                  <div className="flex items-center justify-between gap-1 mt-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setLogoPadding(0)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoPadding === 0 ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      0px (Encosta na borda)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoPadding(6)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoPadding === 6 ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      6px (Padrão)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoPadding(12)}
                      className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                        logoPadding === 12 ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      12px (Mais respiro)
                    </button>
                  </div>
                </div>

                {/* 4. Cor de Fundo da Caixa */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    4. Cor de Fundo do Quadrinho:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: 'Branco', value: '#ffffff', border: 'border-gray-300' },
                      { label: 'Escuro', value: '#151522', border: 'border-white/20' },
                      { label: 'Preto', value: '#000000', border: 'border-white/20' },
                      { label: 'Laranja Suave', value: '#FFF7ED', border: 'border-orange-300' },
                      { label: 'Transparente', value: 'transparent', border: 'border-dashed border-white/30' }
                    ].map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setLogoBg(c.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${c.border} ${
                          logoBg === c.value ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.value === 'transparent' ? '#1a1a24' : c.value, color: c.value === '#ffffff' || c.value === '#FFF7ED' ? '#000' : '#fff' }}
                      >
                        <span>{c.label}</span>
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

            {/* CONTEÚDO DA ABA 2: SUBSTITUIR IMAGEM (UPLOAD OU LINK) */}
            {modalTab === 'replace' && (
              <div className="space-y-3 bg-black/20 p-3.5 rounded-2xl border border-white/5">
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLogoInputMode('upload')}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      logoInputMode === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Upload size={13} />
                    <span>Enviar Foto / Arquivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoInputMode('url')}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      logoInputMode === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Globe size={13} />
                    <span>Link da Imagem (URL)</span>
                  </button>
                </div>

                {logoInputMode === 'upload' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Selecione a imagem da logo (PNG, JPG, SVG, WebP)
                    </label>
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-blue-500/40 hover:border-blue-400 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer transition-all">
                      <Upload size={24} className="text-blue-400 mb-1.5" />
                      <span className="text-xs font-black text-blue-300">Escolher Imagem do PC ou Celular</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Arquivos locais convertidos automaticamente</span>
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
                      value={newLogoUrl}
                      onChange={(e) => {
                        setNewLogoUrl(e.target.value);
                        setPreviewLogo(e.target.value);
                      }}
                      placeholder="https://exemplo.com/logo.png"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Botão Restaurar Logo Padrão da API */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>Restaurar logo original da marca</span>
                  </button>
                </div>
              </div>
            )}

            {/* Ações do Rodapé */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingStore(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveLogo}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check size={14} />
                <span>Salvar Ajustes do Parceiro</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
