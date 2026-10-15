import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockData';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Globe, 
  Store, 
  Upload, 
  Check, 
  Clock, 
  Users, 
  Search, 
  Star, 
  AlertCircle,
  Eye,
  Calendar,
  Layers,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { compressImage } from '../utils/imageCompressor';
import { getStoreDestinationUrl } from '../utils/storeUrls';

const BANNER_PRESETS = [
  { name: 'Burger Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80' },
  { name: 'Chopp & Petiscos', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&auto=format&fit=crop&q=80' },
  { name: 'Pizza Italiana', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=700&auto=format&fit=crop&q=80' },
  { name: 'Steak & Churrasco', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80' },
  { name: 'Corte & Barba', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&auto=format&fit=crop&q=80' },
  { name: 'Crossfit & Academia', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80' },
  { name: 'Moda & Sneakers', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80' },
  { name: 'Sushi & Japonês', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&auto=format&fit=crop&q=80' }
];

export const AdminCouponsManager = ({ showToast }) => {
  const { 
    stores = [], 
    coupons = [], 
    addCoupon, 
    deleteCoupon, 
    toggleHighlightCoupon 
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'physical' | 'online' | 'highlight'
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Modo de vínculo: 'existing' (loja cadastrada) ou 'custom' (loja/marca avulsa)
  const [storeLinkMode, setStoreLinkMode] = useState('existing');

  // Formulário de Criação de Cupom Avulso
  const [formData, setFormData] = useState({
    selectedStoreId: stores[0]?.id || '',
    customStoreName: '',
    customStoreLogoImage: '', // Upload da logo real que aparecerá no card
    title: '',
    description: '',
    originalPrice: '',
    promoPrice: '',
    discountBadge: '30% OFF',
    discountType: 'percentage',
    type: 'physical', // 'physical' | 'online'
    city: 'São Paulo - SP',
    category: 'gastronomia',
    banner: BANNER_PRESETS[0].url,
    code: '',
    limitType: 'one', // 'one' | 'custom' | 'unlimited'
    customMaxUses: 2,
    validityType: 'days', // 'days' | 'unlimited'
    validityDays: 30,
    highlight: false, // Borda Dourada no Topo
    rules: 'Apresentar o cupom VIP no balcão.\nNão cumulativo com outras promoções.\nVálido para consumo no local.',
    affiliateUrl: ''
  });

  // Atualizar cálculo de preços e desconto
  const handlePriceChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    const orig = parseFloat(field === 'originalPrice' ? val : updated.originalPrice);
    const promo = parseFloat(field === 'promoPrice' ? val : updated.promoPrice);

    if (orig && promo && orig > promo) {
      const pct = Math.round(((orig - promo) / orig) * 100);
      updated.discountBadge = `${pct}% OFF`;
    }
    setFormData(updated);
  };

  // Upload da Logo da Marca / Loja Avulsa com Compressão Automática
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, { maxWidth: 350, maxHeight: 350, quality: 0.8 });
        setFormData(prev => ({ ...prev, customStoreLogoImage: compressed }));
      } catch (err) {
        console.warn('Erro ao comprimir logo:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, customStoreLogoImage: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Upload de Banner Customizado com Compressão Automática (evita estouro de LocalStorage)
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, { maxWidth: 900, maxHeight: 550, quality: 0.72 });
        setFormData(prev => ({ ...prev, banner: compressed }));
      } catch (err) {
        console.warn('Compressão falhou, usando fallback direto:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, banner: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Gerar código aleatório
  const handleGenerateCode = () => {
    const prefix = storeLinkMode === 'existing'
      ? (stores.find(s => s.id === formData.selectedStoreId)?.name || 'CUPOM').substring(0, 4).toUpperCase().replace(/\s+/g, '')
      : (formData.customStoreName || 'CUPOM').substring(0, 4).toUpperCase().replace(/\s+/g, '');
    const rand = Math.floor(10 + Math.random() * 90);
    setFormData(prev => ({ ...prev, code: `${prefix}${rand}` }));
  };

  // Submissão do Formulário de Cupom Avulso
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Por favor, informe o título da oferta.');
      return;
    }

    let finalStoreId = formData.selectedStoreId;
    let finalStoreName = '';
    let finalStoreLogo = '';
    let finalMerchantId = null;

    if (storeLinkMode === 'existing') {
      const matchedStore = stores.find(s => s.id === formData.selectedStoreId);
      finalStoreName = matchedStore?.name || 'Loja Parceira';
      finalStoreLogo = matchedStore?.logoImage || matchedStore?.logo || '🏪';
      finalMerchantId = matchedStore?.merchantId || `merchant_${Date.now()}`;
    } else {
      if (!formData.customStoreName.trim()) {
        alert('Por favor, digite o nome do estabelecimento ou marca da oferta avulsa.');
        return;
      }
      finalStoreId = `store_avulsa_${Date.now()}`;
      finalStoreName = formData.customStoreName.trim();
      finalStoreLogo = formData.customStoreLogoImage || '';
      finalMerchantId = `merchant_avulso_${Date.now()}`;
    }

    const orig = formData.originalPrice ? parseFloat(formData.originalPrice) : null;
    const promo = formData.promoPrice ? parseFloat(formData.promoPrice) : null;
    const computedSavings = (orig && promo && orig > promo)
      ? Number((orig - promo).toFixed(2))
      : null;

    const isOnline = formData.type === 'online';
    const finalCity = isOnline ? 'Brasil (Todo o País / Online)' : formData.city;
    const finalCities = isOnline 
      ? ['Todas as Cidades (Online / Brasil Todo)'] 
      : [formData.city];

    let maxUses = 1;
    let limitRule = 'Limite de 1 utilização por CPF.';
    if (formData.limitType === 'custom') {
      maxUses = Math.max(2, Number(formData.customMaxUses) || 2);
      limitRule = `Limite de até ${maxUses} utilizações por CPF.`;
    } else if (formData.limitType === 'unlimited') {
      maxUses = null;
      limitRule = 'Uso ilimitado por CPF durante o período da oferta.';
    }

    const rulesArray = [
      limitRule,
      ...formData.rules.split('\n').filter(r => r.trim().length > 0)
    ];

    let finalExpiresAt = null;
    if (formData.validityType === 'days') {
      const days = Math.max(1, parseInt(formData.validityDays) || 30);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      finalExpiresAt = targetDate.toISOString().split('T')[0];
    } else {
      finalExpiresAt = 'unlimited';
    }

    const finalCode = formData.code.trim() 
      ? formData.code.trim().toUpperCase() 
      : `${finalStoreName.substring(0, 4).toUpperCase().replace(/\s+/g, '')}${Math.floor(10 + Math.random() * 90)}`;

    const newCouponPayload = {
      storeId: finalStoreId,
      merchantId: finalMerchantId,
      storeName: finalStoreName,
      storeLogo: finalStoreLogo,
      storeLogoImage: formData.customStoreLogoImage || (typeof finalStoreLogo === 'string' && (finalStoreLogo.startsWith('data:') || finalStoreLogo.startsWith('http')) ? finalStoreLogo : ''),
      logoImage: formData.customStoreLogoImage || (typeof finalStoreLogo === 'string' && (finalStoreLogo.startsWith('data:') || finalStoreLogo.startsWith('http')) ? finalStoreLogo : ''),
      title: formData.title.trim(),
      description: formData.description.trim() || `Oferta especial exclusiva de ${finalStoreName} para membros VIP.`,
      originalPrice: orig,
      promoPrice: promo,
      discountBadge: formData.discountBadge || '30% OFF',
      estimatedSavings: computedSavings,
      category: formData.category,
      city: finalCity,
      cities: finalCities,
      type: formData.type,
      banner: formData.banner,
      code: finalCode,
      affiliateUrl: formData.affiliateUrl?.trim() || getStoreDestinationUrl(
        storeLinkMode === 'existing' ? stores.find(s => s.id === finalStoreId) : { name: finalStoreName, id: finalStoreId },
        { title: formData.title.trim() }
      ),
      highlight: formData.highlight,
      vipOnly: true,
      maxUsesPerUser: maxUses,
      expiresAt: finalExpiresAt,
      rules: rulesArray,
      isAvulso: true,
      createdAt: new Date().toISOString()
    };

    const res = addCoupon(newCouponPayload);
    if (res && res.error) {
      return;
    }

    if (showToast) {
      showToast(`🎟️ Cupom "${newCouponPayload.title}" publicado com sucesso no site!`);
    }

    // Resetar formulário
    setFormData({
      selectedStoreId: stores[0]?.id || '',
      customStoreName: '',
      customStoreLogoImage: '',
      title: '',
      description: '',
      originalPrice: '',
      promoPrice: '',
      discountBadge: '30% OFF',
      discountType: 'percentage',
      type: 'physical',
      city: 'São Paulo - SP',
      category: 'gastronomia',
      banner: BANNER_PRESETS[0].url,
      code: '',
      limitType: 'one',
      customMaxUses: 2,
      validityType: 'days',
      validityDays: 30,
      highlight: false,
      rules: 'Apresentar o cupom VIP no balcão.\nNão cumulativo com outras promoções.\nVálido para consumo no local.',
      affiliateUrl: ''
    });

    setIsFormOpen(false);
  };

  // Filtragem da Lista de Cupons
  const filteredCoupons = coupons.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const st = stores.find(s => s.id === c.storeId);
    const storeName = (c.storeName || st?.name || '').toLowerCase();
    const title = (c.title || '').toLowerCase();
    const category = (c.category || '').toLowerCase();
    const city = (c.city || '').toLowerCase();

    const matchesSearch = !q || storeName.includes(q) || title.includes(q) || category.includes(q) || city.includes(q);
    if (!matchesSearch) return false;

    if (filterType === 'physical' && (c.type === 'online' || city.includes('online'))) return false;
    if (filterType === 'online' && c.type !== 'online' && !city.includes('online')) return false;
    if (filterType === 'highlight' && !c.highlight) return false;

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. HEADER DO GERENCIADOR DE CUPONS */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5F00] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30">
              <Tag size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">Central de Cupons Avulsos</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                  ADM Master
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Cadastre e publique cupons avulsos diretamente pelo painel administrativo para qualquer loja, parceiro ou promoção do site.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-gradient-to-r from-[#FF5F00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-xl shadow-orange-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus size={18} />
          <span>{isFormOpen ? 'Fechar Formulário' : '+ Novo Cupom Avulso'}</span>
        </button>
      </div>

      {/* 2. STATS RÁPIDOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#181824] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Tag size={13} className="text-[#FF5F00]" />
            <span>Total de Cupons</span>
          </div>
          <div className="text-2xl font-black text-white">{coupons.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Ativos no Clube VIP</div>
        </div>

        <div className="bg-[#181824] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Store size={13} className="text-blue-400" />
            <span>Cupons Presenciais</span>
          </div>
          <div className="text-2xl font-black text-white">
            {coupons.filter(c => c.type !== 'online' && !c.city?.toLowerCase().includes('online')).length}
          </div>
          <div className="text-[10px] text-blue-400/80 mt-0.5">Lojas Físicas / Balcão</div>
        </div>

        <div className="bg-[#181824] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Globe size={13} className="text-emerald-400" />
            <span>Cupons Online (Nacional)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {coupons.filter(c => c.type === 'online' || c.city?.toLowerCase().includes('online')).length}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Abrange Todos os Locais</div>
        </div>

        <div className="bg-[#181824] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Star size={13} className="text-amber-400" />
            <span>Destaques Ouro</span>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {coupons.filter(c => c.highlight).length}
          </div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">Topo do Feed com Borda Dourada</div>
        </div>
      </div>

      {/* 3. FORMULÁRIO DE CRIAÇÃO (QUANDO ABERTO) */}
      {isFormOpen && (
        <div className="bg-[#181824] border-2 border-[#FF5F00]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>➕ Criar e Publicar Novo Cupom Avulso</span>
              </h3>
              <p className="text-xs text-gray-400">
                Preencha os dados abaixo. O cupom ficará disponível imediatamente para todos os membros VIP.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl text-xs"
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Vínculo da Loja: Existente vs Marca Avulsa */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                1. Estabelecimento ou Marca Patrocinadora:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStoreLinkMode('existing')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    storeLinkMode === 'existing'
                      ? 'bg-[#FF5F00]/20 border-[#FF5F00] text-white ring-1 ring-[#FF5F00]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Store size={20} className={storeLinkMode === 'existing' ? 'text-[#FF5F00]' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-black">Vincular a Loja Credenciada</div>
                    <div className="text-[10px] text-gray-400">Escolha uma das lojas já cadastradas</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStoreLinkMode('custom')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    storeLinkMode === 'custom'
                      ? 'bg-gradient-to-r from-amber-500/20 to-[#FF5F00]/20 border-amber-400 text-white ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={20} className={storeLinkMode === 'custom' ? 'text-amber-400' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-black text-amber-300">Marca / Oferta Avulsa Própria</div>
                    <div className="text-[10px] text-gray-400">Criar com nome customizado de loja</div>
                  </div>
                </button>
              </div>

              {storeLinkMode === 'existing' ? (
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    Selecione a Loja Parceira *
                  </label>
                  <select
                    value={formData.selectedStoreId}
                    onChange={(e) => {
                      const st = stores.find(s => s.id === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        selectedStoreId: e.target.value,
                        category: st?.category || prev.category,
                        city: st?.city || prev.city,
                        type: st?.type || prev.type
                      }));
                    }}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.logo || '🏪'} {st.name} ({st.city || 'Nacional'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">
                      Nome da Marca / Estabelecimento Avulso *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Chopp Brahma Express, Clube da Picanha, Barbearia Vip"
                      value={formData.customStoreName}
                      onChange={(e) => setFormData({ ...formData, customStoreName: e.target.value })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-[#FF5F00]" />
                      <span>Logo da Marca (Card) *</span>
                    </label>
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {formData.customStoreLogoImage ? (
                      <div className="flex items-center gap-2 p-1.5 bg-[#101017] border border-white/10 rounded-xl">
                        <img
                          src={formData.customStoreLogoImage}
                          alt="Logo"
                          className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="text-[11px] text-[#FF5F00] hover:underline font-bold"
                        >
                          Trocar Logo
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, customStoreLogoImage: '' }))}
                          className="text-[10px] text-gray-400 hover:text-red-400 ml-auto p-1"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full bg-[#101017] border border-dashed border-white/20 hover:border-[#FF5F00] rounded-xl py-2 px-3 text-xs text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Upload size={14} className="text-[#FF5F00]" />
                        <span>Upload da Logo</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Título e Descrição da Oferta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Título da Oferta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2 Chopes em Dobro + Porção de Pastéis"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Categoria da Oferta
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Descrição Detalhada do Benefício
              </label>
              <textarea
                rows={2}
                placeholder="Descreva exatamente o que está incluso no desconto e como usufruir..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Preços De / Por e Tag de Desconto */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <label className="text-xs font-bold text-gray-300 block">
                Valores e Selo de Desconto:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Preço Normal (De: R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 80,00"
                      value={formData.originalPrice}
                      onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-emerald-400 font-bold block mb-1">Preço Promocional (Por: R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-emerald-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 48,00"
                      value={formData.promoPrice}
                      onChange={(e) => handlePriceChange('promoPrice', e.target.value)}
                      className="w-full bg-[#101017] border border-emerald-500/40 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-sm text-emerald-300 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Selo de Desconto</label>
                  <input
                    type="text"
                    placeholder="Ex: 40% OFF, R$ 32 OFF, 2x1"
                    value={formData.discountBadge}
                    onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modalidade de Atuação & Cidade */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <label className="text-xs font-bold text-gray-300 block">
                Modalidade de Atendimento:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'physical' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.type === 'physical'
                      ? 'bg-[#FF5F00]/20 border-[#FF5F00] text-white ring-1 ring-[#FF5F00]'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <Store size={18} className={formData.type === 'physical' ? 'text-[#FF5F00]' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-black">Loja Física / Presencial</div>
                    <div className="text-[10px] text-gray-400">Aparece na cidade selecionada</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'online' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.type === 'online'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <Globe size={18} className={formData.type === 'online' ? 'text-emerald-400' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-black text-emerald-300">Loja Online (Todos os Locais)</div>
                    <div className="text-[10px] text-gray-400">Abrange todo o Brasil / nacional</div>
                  </div>
                </button>
              </div>

              {formData.type === 'physical' && (
                <div className="pt-2">
                  <label className="text-xs text-gray-400 block mb-1">Cidade do Estabelecimento</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades').map((city, idx) => (
                      <option key={idx} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Link de Destino Oficial / Afiliado */}
              <div className="pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-400" />
                  <span>Link do Site Oficial ou de Afiliado (Opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder="Ex: https://www.omens.com.br ou https://www.tf.com.br"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none placeholder-gray-600"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Se deixado em branco, o sistema localiza automaticamente o site oficial direto da marca ou loja (sem pesquisas no Google).
                </p>
              </div>
            </div>

            {/* Banner da Oferta */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-300">
                  Banner da Oferta (Imagem em Destaque):
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-bold"
                >
                  <Upload size={13} />
                  <span>Upload Foto do Computador</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>

              {/* Preview do Banner */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/20 mb-3 bg-black">
                <img src={formData.banner} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#FF5F00] text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg">
                  {formData.discountBadge}
                </div>
                {formData.highlight && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-[#FF5F00] text-black px-2.5 py-1 rounded-xl text-xs font-black shadow-lg flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    <span>Destaque Ouro</span>
                  </div>
                )}
              </div>

              {/* Presets Rápidos */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-gray-400 flex-shrink-0">Modelos prontos:</span>
                {BANNER_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, banner: p.url })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                      formData.banner === p.url
                        ? 'bg-[#FF5F00] text-white border-orange-500'
                        : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Código, Limite por CPF e Destaque Ouro */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-300">Código do Cupom</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[10px] text-orange-400 hover:underline font-bold"
                  >
                    Gerar Auto
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: VIP40, CHOPP2X1"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Limite por CPF</label>
                <select
                  value={formData.limitType}
                  onChange={(e) => setFormData({ ...formData, limitType: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="one">1 uso por CPF (Mais seguro)</option>
                  <option value="custom">Até 2 usos por CPF</option>
                  <option value="unlimited">Ilimitado por CPF</option>
                </select>
              </div>

              {/* Destaque Ouro */}
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">Posicionamento no Site</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, highlight: !formData.highlight })}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    formData.highlight
                      ? 'bg-gradient-to-r from-amber-400 to-[#FF5F00] text-black border-amber-300 shadow-md font-black'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Star size={14} fill={formData.highlight ? 'currentColor' : 'none'} />
                  <span>{formData.highlight ? '⭐ Destaque Ouro Ativado' : 'Normal (Sem Destaque)'}</span>
                </button>
              </div>
            </div>

            {/* Regras e Condições */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Regras e Condições de Uso (uma por linha)
              </label>
              <textarea
                rows={2}
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none"
              />
            </div>

            {/* Botão de Envio */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF5F00] via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-8 py-3 rounded-xl text-sm shadow-xl shadow-orange-600/30 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Sparkles size={16} />
                <span>🚀 Publicar Cupom Avulso Agora</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. LISTAGEM E GERENCIAMENTO DOS CUPONS CADASTRADOS */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Cupons Cadastrados no Site</span>
              <span className="text-xs bg-white/10 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                {filteredCoupons.length} de {coupons.length}
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Gerencie, promova para o topo com destaque ouro ou exclua cupons do catálogo.
            </p>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar cupom, loja ou cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101017] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5F00]"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#101017] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="all">Todos os Tipos</option>
              <option value="physical">Apenas Físicos</option>
              <option value="online">Apenas Online (Nacional)</option>
              <option value="highlight">Apenas Destaques Ouro ⭐</option>
            </select>
          </div>
        </div>

        {/* Grid de Cupons */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-12 text-gray-400 space-y-3 bg-white/5 rounded-2xl border border-white/5">
            <Tag size={32} className="mx-auto text-gray-600" />
            <p className="text-sm font-bold">Nenhum cupom encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoupons.map((coupon) => {
              const store = stores.find(s => s.id === coupon.storeId);
              const storeName = coupon.storeName || store?.name || 'Loja Parceira';
              const storeLogo = coupon.storeLogo || store?.logo || '🏪';
              const isOnline = coupon.type === 'online' || coupon.city?.toLowerCase().includes('online');

              return (
                <div 
                  key={coupon.id}
                  className={`bg-[#12121A] rounded-2xl border overflow-hidden flex flex-col transition-all group ${
                    coupon.highlight 
                      ? 'border-amber-400/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Banner */}
                  <div className="relative h-36 w-full bg-black/60 overflow-hidden">
                    <img 
                      src={coupon.banner || coupon.image || BANNER_PRESETS[0].url} 
                      alt={coupon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Badge de Desconto */}
                    <div className="absolute top-2.5 left-2.5 bg-[#FF5F00] text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-md">
                      {coupon.discountBadge || 'OFERTA'}
                    </div>

                    {/* Badge Destaque Ouro */}
                    {coupon.highlight && (
                      <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-400 to-[#FF5F00] text-black px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Star size={11} fill="currentColor" />
                        <span>DESTAQUE</span>
                      </div>
                    )}

                    {/* Logo e Nome da Loja */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-2">
                      <span className="text-lg">{storeLogo}</span>
                      <span className="text-xs font-bold text-white drop-shadow truncate">{storeName}</span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                        {coupon.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {coupon.description}
                      </p>
                    </div>

                    {/* Preços e Local */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        {coupon.originalPrice && coupon.promoPrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] text-gray-500 line-through">
                              R$ {Number(coupon.originalPrice).toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-xs font-black text-emerald-400">
                              R$ {Number(coupon.promoPrice).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            Economia ~R$ {Number(coupon.estimatedSavings || 20).toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        {isOnline ? (
                          <>
                            <Globe size={11} className="text-blue-400" />
                            <span>Online (Brasil)</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={11} className="text-orange-400" />
                            <span className="truncate max-w-[100px]">{coupon.city?.split('-')[0]?.trim() || 'São Paulo'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Ações Administrativas */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleHighlightCoupon(coupon.id);
                          if (showToast) {
                            showToast(coupon.highlight ? '⭐ Destaque ouro removido.' : '⭐ Cupom promovido para Destaque Ouro!');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          coupon.highlight
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                            : 'bg-white/5 text-gray-400 hover:text-amber-300 hover:bg-white/10 border border-white/5'
                        }`}
                        title="Alternar Destaque Ouro"
                      >
                        <Star size={12} fill={coupon.highlight ? 'currentColor' : 'none'} />
                        <span>{coupon.highlight ? 'Em Destaque' : 'Destacar Ouro'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja excluir o cupom "${coupon.title}"?`)) {
                            deleteCoupon(coupon.id);
                            if (showToast) {
                              showToast(`🗑️ Cupom "${coupon.title}" excluído do site.`);
                            }
                          }
                        }}
                        className="p-1.5 rounded-xl text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 transition-colors"
                        title="Excluir Cupom"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
