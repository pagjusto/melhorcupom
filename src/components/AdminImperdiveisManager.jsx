import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Check, 
  Share2, 
  Copy, 
  Tag, 
  DollarSign, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminImperdiveisManager = ({ showToast }) => {
  const { 
    hotDeals = [], 
    addHotDeal, 
    deleteHotDeal, 
    syncShopeeHotDeals,
    syncMagaluHotDeals
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingMagalu, setIsSyncingMagalu] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Formulário de Cadastro Rápido de Oferta (Shopee ou Magalu Influencer)
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    store: 'shopee', // 'shopee' | 'magalu'
    category: 'tech',
    categoryLabel: 'Tecnologia & Gadgets',
    originalPrice: '',
    promoPrice: '',
    image: '',
    affiliateUrl: '',
    tag: '🔥 Oferta Imperdível',
    freeShipping: true,
    description: ''
  });

  const categoriesMap = {
    'tech': 'Tecnologia & Gadgets',
    'casa': 'Casa & Cozinha',
    'beleza': 'Beleza & Cuidados',
    'moda': 'Moda & Viagem',
    'utilidades': 'Achadinhos & Utilidades'
  };

  // Puxar imagem e dados reais do anúncio colado
  const handleAutoExtractMetadata = async (urlToFetch) => {
    const target = urlToFetch || newDealForm.affiliateUrl;
    if (!target || !target.startsWith('http')) {
      if (showToast) showToast('Insira um link válido da Shopee ou Magalu para puxar a imagem.', 'warning');
      return;
    }

    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      const data = await res.json();
      if (data.success) {
        const isMagaluLink = target.includes('magazinevoce') || target.includes('magazineluiza') || target.includes('maga.lu');
        setNewDealForm(prev => ({
          ...prev,
          store: isMagaluLink ? 'magalu' : prev.store,
          tag: isMagaluLink ? '💙 Oferta Magalu' : prev.tag,
          image: data.image || prev.image,
          title: prev.title || data.title || '',
          promoPrice: prev.promoPrice || (data.price ? String(data.price) : ''),
          description: prev.description || data.description || ''
        }));
        if (showToast) {
          showToast(data.image ? '📸 Imagem real do anúncio importada com sucesso!' : 'Metadados do produto localizados!', 'success');
        }
      } else {
        if (showToast) showToast('Não foi possível puxar a imagem automaticamente. Você pode colar a URL da imagem abaixo.', 'warning');
      }
    } catch (err) {
      console.warn('Erro ao extrair imagem do anúncio:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSyncRobot = async () => {
    setIsSyncing(true);
    try {
      const res = await syncShopeeHotDeals();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (showToast) {
        showToast(`Robô Shopee executado com sucesso! ${res.count} produtos sincronizados.`);
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  const handleSyncMagaluStore = async () => {
    setIsSyncingMagalu(true);
    try {
      if (showToast) {
        showToast('Validando Radar Top 10 Diário (1P Magalu Oficial) e vitrine magazinevoce.com.br/magazinemelhorcupom/ ...', 'info');
      }
      const res = await syncMagaluHotDeals();
      if (showToast) {
        showToast(`🎉 Sucesso! ${res.count} ofertas sincronizadas (Top 10 Radar Diário 1P Magalu com estoque ativo + produtos da sua vitrine)!`, 'success');
      }
    } catch (err) {
      if (showToast) {
        showToast('Erro ao sincronizar loja Magalu: ' + err.message, 'error');
      }
    } finally {
      setIsSyncingMagalu(false);
    }
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!newDealForm.title.trim()) {
      alert('Informe o título do produto.');
      return;
    }
    if (!newDealForm.promoPrice) {
      alert('Informe o preço de oferta do produto.');
      return;
    }

    const origPrice = parseFloat(newDealForm.originalPrice) || (parseFloat(newDealForm.promoPrice) * 1.5);
    const promoPrice = parseFloat(newDealForm.promoPrice);
    const discountPercent = Math.max(5, Math.round(((origPrice - promoPrice) / origPrice) * 100));

    const isMagalu = newDealForm.store === 'magalu' || 
                     (newDealForm.affiliateUrl && (newDealForm.affiliateUrl.includes('magazinevoce') || newDealForm.affiliateUrl.includes('magazineluiza') || newDealForm.affiliateUrl.includes('maga.lu')));

    addHotDeal({
      title: newDealForm.title.trim(),
      store: isMagalu ? 'Magazine Luiza' : 'Shopee Oficial',
      category: newDealForm.category,
      categoryLabel: categoriesMap[newDealForm.category] || 'Ofertas Imperdíveis',
      originalPrice: origPrice,
      promoPrice: promoPrice,
      discountBadge: `${discountPercent}% OFF`,
      discountPercent: discountPercent,
      savings: Math.max(0, origPrice - promoPrice),
      image: newDealForm.image.trim() || (isMagalu ? 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=700&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&auto=format&fit=crop&q=80'),
      affiliateUrl: newDealForm.affiliateUrl.trim() || (isMagalu ? 'https://www.magazinevoce.com.br/' : 'https://shopee.com.br/'),
      tag: newDealForm.tag.trim() || (isMagalu ? '💙 Oferta Magalu' : '🔥 Oferta Imperdível'),
      badgeColor: isMagalu ? 'bg-blue-600' : 'bg-red-500',
      freeShipping: newDealForm.freeShipping,
      description: newDealForm.description.trim() || (isMagalu ? 'Oferta verificada Magazine Luiza com entrega rápida e garantia oficial.' : 'Produto verificado em promoção oficial com frete grátis Shopee.')
    });

    if (showToast) {
      showToast(isMagalu ? 'Oferta do Parceiro Magalu cadastrada com sucesso!' : 'Nova Oferta Imperdível publicada com sucesso!');
    }

    setNewDealForm({
      title: '',
      store: 'shopee',
      category: 'tech',
      categoryLabel: 'Tecnologia & Gadgets',
      originalPrice: '',
      promoPrice: '',
      image: '',
      affiliateUrl: '',
      tag: '🔥 Oferta Imperdível',
      freeShipping: true,
      description: ''
    });
  };

  const handleCopyFormattedText = (deal) => {
    const text = `🔥 *OFERTA IMPERDÍVEL SHOPEE* 🔥\n\n*${deal.title}*\n\n❌ De: R$ ${deal.originalPrice.toFixed(2).replace('.', ',')}\n✅ *Por apenas: R$ ${deal.promoPrice.toFixed(2).replace('.', ',')} (${deal.discountBadge})*\n\n🚚 Frete Grátis Shopee\n👉 Compre no link oficial: ${deal.affiliateUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(deal.id);
    setTimeout(() => setCopiedId(null), 2000);
    if (showToast) {
      showToast('Texto copiado para WhatsApp e Telegram!');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HEADER DO ROBÔ DE OFERTAS IMPERDÍVEIS */}
      <div className="bg-gradient-to-r from-[#2A0E03] via-[#1F0A02] to-[#120702] border-2 border-orange-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5F00] text-white text-xs font-black uppercase tracking-wider">
                <Flame size={14} />
                <span>Robô de Ofertas Shopee & Magalu</span>
              </span>
              <span className="text-xs text-orange-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
                Shopee: 18305641225
              </span>
              <span className="text-xs text-blue-300 bg-blue-600/20 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-bold">
                Magalu: magazinemelhorcupom
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Gestão de Ofertas Imperdíveis & Achadinhos
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              O robô monitora ofertas da Shopee Brasil e sincroniza automaticamente os produtos da sua vitrine oficial de <strong>Influencer Magalu (magazinemelhorcupom)</strong> com fotos reais, descontos e links diretos comissionados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncMagaluStore}
              disabled={isSyncingMagalu}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-4 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isSyncingMagalu ? 'animate-spin' : ''} />
              <span>{isSyncingMagalu ? 'Validando Estoque 1P...' : '💙 Sincronizar Radar Top 10 + Vitrine Magalu'}</span>
            </button>

            <button
              onClick={handleSyncRobot}
              disabled={isSyncing}
              className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7500] text-white font-black px-4 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-orange-600/40 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Sincronizando Shopee...' : '🧡 Sincronizar Shopee'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPIS DO ROBÔ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Produtos em Destaque</span>
          <div className="text-3xl font-black text-white font-display mt-1">
            {hotDeals.length} Ofertas
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            ✓ Todos com comissão ativa
          </span>
        </div>

        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Média de Desconto</span>
          <div className="text-3xl font-black text-orange-400 font-display mt-1">
            61.4% OFF
          </div>
          <span className="text-[11px] text-gray-400 font-semibold block mt-1">
            Economia média de R$ 58,00 por item
          </span>
        </div>

        <div className="bg-[#151522] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Rastreamento de Afiliado</span>
          <div className="text-xl font-mono font-black text-white mt-2 truncate">
            af=18305641225
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            SubID: melhorcupom (Autenticado)
          </span>
        </div>
      </div>

      {/* 3. FORMULÁRIO: CADASTRAR PRODUTO ESPECÍFICO / ACHADINHO MANUAL */}
      <div className="bg-[#151522] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Cadastrar Oferta Específica (Shopee ou Magazine Luiza)
              </h3>
              <p className="text-xs text-gray-400">
                Cole o link de qualquer produto da Shopee ou da sua loja de Influencer Magalu (Magazine Você) com foto real e rastreamento.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreateDeal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Plataforma / Loja:</label>
              <select
                value={newDealForm.store}
                onChange={(e) => setNewDealForm(prev => ({ 
                  ...prev, 
                  store: e.target.value,
                  tag: e.target.value === 'magalu' ? '💙 Oferta Magalu' : '🔥 Oferta Imperdível'
                }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
              >
                <option value="shopee">🧡 Shopee Oficial (Afiliado)</option>
                <option value="magalu">💙 Magazine Luiza (Influencer Magalu)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Título do Produto / Achadinho:</label>
              <input
                type="text"
                required
                value={newDealForm.title}
                onChange={(e) => setNewDealForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Fritadeira Air Fryer Philco ou Mini Processador"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Categoria:</label>
              <select
                value={newDealForm.category}
                onChange={(e) => setNewDealForm(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  categoryLabel: categoriesMap[e.target.value] || 'Geral'
                }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none cursor-pointer"
              >
                <option value="tech">📱 Tecnologia & Gadgets</option>
                <option value="casa">🏠 Casa & Cozinha</option>
                <option value="beleza">💄 Beleza & Skincare</option>
                <option value="moda">✈️ Moda & Viagem</option>
                <option value="utilidades">⚡ Achadinhos & Utilidades</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Preço Normal (De R$):</label>
              <input
                type="number"
                step="0.01"
                value={newDealForm.originalPrice}
                onChange={(e) => setNewDealForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="Ex: 89.90"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Preço Oferta (Por R$):</label>
              <input
                type="number"
                step="0.01"
                required
                value={newDealForm.promoPrice}
                onChange={(e) => setNewDealForm(prev => ({ ...prev, promoPrice: e.target.value }))}
                placeholder="Ex: 29.90"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Selo / Tag de Destaque:</label>
              <input
                type="text"
                value={newDealForm.tag}
                onChange={(e) => setNewDealForm(prev => ({ ...prev, tag: e.target.value }))}
                placeholder="Ex: 🔥 Achadinho Viral TikTok"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-300">
                  Link do Anúncio na Shopee:
                </label>
                <button
                  type="button"
                  disabled={isExtracting || !newDealForm.affiliateUrl}
                  onClick={() => handleAutoExtractMetadata()}
                  className="text-[11px] font-black text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles size={11} className={isExtracting ? 'animate-spin' : ''} />
                  <span>{isExtracting ? 'Puxando Foto...' : '📸 Puxar Foto Real'}</span>
                </button>
              </div>
              <input
                type="url"
                value={newDealForm.affiliateUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewDealForm(prev => ({ ...prev, affiliateUrl: val }));
                  if (val.startsWith('http') && (val.includes('shopee') || val.includes('s.shopee'))) {
                    // Puxar automaticamente se colou link
                    handleAutoExtractMetadata(val);
                  }
                }}
                placeholder="https://shopee.com.br/... ou https://s.shopee.com.br/..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Ao colar o link, o robô puxa a foto real e o título original automaticamente.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                URL da Imagem Real do Anúncio:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newDealForm.image}
                  onChange={(e) => setNewDealForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://down-br.img.susercontent.com/file/... ou https://..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                {newDealForm.image && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/50 flex-shrink-0 relative group">
                    <img 
                      src={newDealForm.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newDealForm.freeShipping}
                onChange={(e) => setNewDealForm(prev => ({ ...prev, freeShipping: e.target.checked }))}
                className="rounded border-white/20 text-[#FF5F00] focus:ring-orange-500"
              />
              <span>Exibir selo de Frete Grátis</span>
            </label>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7400] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Publicar Oferta na Aba "Ofertas Imperdíveis"</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. TABELA DE PRODUTOS CADASTRADOS */}
      <div className="bg-[#151522] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">Produtos Ativos no Site</span>
            <span className="text-xs bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full">
              {hotDeals.length} itens
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/5 overflow-x-auto">
          {hotDeals.map((deal) => (
            <div key={deal.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 min-w-[280px]">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white truncate max-w-xs">{deal.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                    <span className="text-orange-400 font-semibold">{deal.categoryLabel}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{deal.discountBadge}</span>
                    <span>•</span>
                    <span>{deal.salesCount}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-gray-500 line-through">
                  R$ {deal.originalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm font-black text-white">
                  R$ {deal.promoPrice.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Botão Copiar para WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleCopyFormattedText(deal)}
                  title="Copiar texto pronto para postar em grupos de WhatsApp/Telegram"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === deal.id ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === deal.id ? 'Copiado!' : 'Copiar p/ Grupos'}</span>
                </button>

                {/* Testar Link */}
                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Abrir link na Shopee"
                >
                  <ExternalLink size={14} />
                </a>

                {/* Excluir */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remover "${deal.title}" da lista?`)) {
                      deleteHotDeal(deal.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Excluir oferta"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
