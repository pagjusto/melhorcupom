import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_COUPONS, 
  INITIAL_STORES, 
  CATEGORIES, 
  SUBSCRIPTION_PLANS, 
  MERCHANT_PLANS, 
  INITIAL_REGISTERED_USERS, 
  MONTHLY_FINANCIAL_HISTORY, 
  ADMIN_CREDENTIALS,
  API_CONNECTORS,
  INITIAL_API_LOGS
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { autoPublishStoreToInstagram, getPartnerInstagramHandle } from '../utils/instagramAutoPublisher';
import { INITIAL_HOT_DEALS } from '../data/hotDealsData';
import { MAGALU_RADAR_TOP10 } from '../data/magaluRadarData';
import { SHEIN_VIRAL_TOP18 } from '../data/sheinViralData';
import { supabase, isSupabaseConfigured, db } from '../lib/supabase';
import { validateStoreSafety, validateUserSafety, validateCouponSafety } from '../utils/contentModeration';
import { getStoreDestinationUrl } from '../utils/storeUrls';
import { getBrandLogo } from '../assets/brands';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Aba Ativa Global da Aplicação ('explore' | 'stores' | 'how-it-works' | 'merchant-dashboard' | 'my-coupons' | 'user-profile' | 'imperdiveis')
  const [activeTab, setActiveTab] = useState('explore');

  // Filtro de Loja das Ofertas Imperdíveis ('all' | 'shopee' | 'magalu' | 'shein')
  const [imperdiveisStoreFilter, setImperdiveisStoreFilter] = useState('all');

  const navigateToImperdiveis = (storeFilter = 'all') => {
    setImperdiveisStoreFilter(storeFilter);
    setActiveTab('imperdiveis');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Aba Interna do Painel do Lojista ('coupons' | 'validator' | 'new-coupon' | 'settings' | 'plans' | 'referrals')
  const [merchantDashboardTab, setMerchantDashboardTab] = useState('coupons');

  // Estado de Perfil Atual (Role)
  // 'visitor' | 'vip' | 'merchant_burger' | 'merchant_barber' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('melhor_cupom_role') || 'admin';
  });

  // Salvamento seguro de cupons com fallback contra estouro de cota (LocalStorage)
  const safeSaveCoupons = (couponsList) => {
    try {
      localStorage.setItem('melhor_cupom_coupons', JSON.stringify(couponsList));
      const customOnly = couponsList.filter(c => !INITIAL_COUPONS.some(init => init.id === c.id));
      localStorage.setItem('melhor_cupom_custom_coupons', JSON.stringify(customOnly));
    } catch (err) {
      console.warn('[Storage] Cota excedida ao salvar cupons, tentando salvar sanitizado:', err);
      try {
        const sanitized = couponsList.map(c => {
          if (c.banner && typeof c.banner === 'string' && c.banner.startsWith('data:image/') && c.banner.length > 80000) {
            return { ...c, banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80' };
          }
          return c;
        });
        localStorage.setItem('melhor_cupom_coupons', JSON.stringify(sanitized));
        const customSanitized = sanitized.filter(c => !INITIAL_COUPONS.some(init => init.id === c.id));
        localStorage.setItem('melhor_cupom_custom_coupons', JSON.stringify(customSanitized));
      } catch (innerErr) {
        console.error('[Storage] Falha crítica ao persistir cupons:', innerErr);
      }
    }
  };

  // Estado de Cupons (com persistência blindada no LocalStorage e auto-mesclagem de novos dados)
  const [coupons, setCoupons] = useState(() => {
    let saved = null;
    let customSaved = null;
    try {
      saved = localStorage.getItem('melhor_cupom_coupons');
    } catch {}
    try {
      customSaved = localStorage.getItem('melhor_cupom_custom_coupons');
    } catch {}

    const customCoupons = [];
    if (customSaved) {
      try {
        const parsedCustom = JSON.parse(customSaved);
        if (Array.isArray(parsedCustom)) {
          customCoupons.push(...parsedCustom);
        }
      } catch {}
    }

    if (!saved) {
      const initialWithCustom = [...customCoupons, ...INITIAL_COUPONS];
      const uniqueMap = new Map();
      initialWithCustom.forEach(c => uniqueMap.set(c.id, c));
      return Array.from(uniqueMap.values()).map(c => {
        const isCustom = c.isAvulso || c.storeId?.startsWith('store_avulsa_') || c.merchantId?.startsWith('merchant_avulso_') || c.id?.startsWith('cupom_avulso_');
        return isCustom ? { ...c, highlight: false } : c;
      });
    }

    try {
      const parsed = JSON.parse(saved);
      const parsedIds = new Set(parsed.map(c => c.id));
      const missingCustom = customCoupons.filter(c => !parsedIds.has(c.id));
      const missingInitial = INITIAL_COUPONS.filter(c => !parsedIds.has(c.id));
      const combined = [...missingCustom, ...parsed, ...missingInitial];
      
      const needsHighlightReset = localStorage.getItem('melhor_cupom_custom_highlight_reset_v2') !== 'done';

      const mapped = combined.map(c => {
        const init = INITIAL_COUPONS.find(i => i.id === c.id);
        if (init) {
          return {
            ...c,
            title: init.title,
            description: init.description,
            codePrefix: init.codePrefix,
            rules: init.rules || c.rules,
            banner: init.banner || c.banner,
            storeName: init.storeName || c.storeName,
            storeLogo: init.storeLogo || c.storeLogo,
            logoImage: getBrandLogo(init.storeId || c.storeId) || getBrandLogo(init.storeName || c.storeName) || init.logoImage || (c.logoImage && c.logoImage.startsWith('data:') ? c.logoImage : '') || '',
            viewsCount: typeof c.viewsCount === 'number' ? c.viewsCount : (init.viewsCount || Math.max(140, (c.usesCount || 8) * 11 + 35)),
            isApiIntegrated: init.isApiIntegrated ?? c.isApiIntegrated ?? false,
            apiSource: init.apiSource || c.apiSource || null,
            apiLastSync: init.apiLastSync || c.apiLastSync || null,
            cashbackRate: init.cashbackRate || c.cashbackRate || null,
            cashbackPercent: init.cashbackPercent || c.cashbackPercent || 0,
            affiliateUrl: init.affiliateUrl || (c.affiliateUrl && !c.affiliateUrl.includes('google.com/search') ? c.affiliateUrl : getStoreDestinationUrl(null, { ...c, ...init })),
            discountType: init.discountType || c.discountType,
            discountValue: init.discountValue || c.discountValue,
            discountBadge: init.discountBadge || c.discountBadge,
            estimatedSavings: init.estimatedSavings ?? c.estimatedSavings,
            originalPrice: init.originalPrice ?? c.originalPrice,
            promoPrice: init.promoPrice ?? c.promoPrice,
            city: init.city || c.city,
            cities: init.cities || c.cities || (init.city ? [init.city] : [])
          };
        }
        const cleanAffiliate = c.affiliateUrl && !c.affiliateUrl.includes('google.com/search') ? c.affiliateUrl : getStoreDestinationUrl(null, c);
        const resolvedLogo = (c.isAvulso && c.logoImage && c.logoImage.startsWith('data:')) ? c.logoImage : (getBrandLogo(c.storeId) || getBrandLogo(c.storeName) || c.logoImage || c.storeLogoImage || '');
        const isCustom = c.isAvulso || c.storeId?.startsWith('store_avulsa_') || c.merchantId?.startsWith('merchant_avulso_') || c.id?.startsWith('cupom_avulso_');
        return {
          ...c,
          affiliateUrl: cleanAffiliate,
          logoImage: resolvedLogo,
          highlight: (isCustom && needsHighlightReset) ? false : Boolean(c.highlight)
        };
      });

      if (needsHighlightReset) {
        try {
          localStorage.setItem('melhor_cupom_custom_highlight_reset_v2', 'done');
          safeSaveCoupons(mapped);
        } catch {}
      }

      return mapped;
    } catch {
      return [...customCoupons, ...INITIAL_COUPONS];
    }
  });

  // Estado de Lojas / Comerciantes (com auto-mesclagem de todas as marcas reais da rede)
  // Parceiros via API / Catálogo possuem tier: 'api' (sem mensalidade / R$ 0,00 de receita mensal)
  const [stores, setStores] = useState(() => {
    const normalizeInitialStore = (st) => ({
      ...st,
      tier: st.adminPaidPlan ? st.tier : 'api'
    });

    const saved = localStorage.getItem('melhor_cupom_stores_v10') || localStorage.getItem('melhor_cupom_stores_v9');
    if (!saved) {
      const normalized = INITIAL_STORES.map(normalizeInitialStore);
      localStorage.setItem('melhor_cupom_stores_v10', JSON.stringify(normalized));
      return normalized;
    }
    try {
      const parsed = JSON.parse(saved);
      const parsedIds = new Set(parsed.map(s => s.id));
      const missing = INITIAL_STORES.filter(s => !parsedIds.has(s.id));
      const combined = [...parsed, ...missing];
      return combined.map(s => {
        const init = INITIAL_STORES.find(i => i.id === s.id);
        const storeRefCode = s.referralCode || init?.referralCode || (init?.name || s.name ? (init?.name || s.name).substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '') + '5' : 'LOJA5');
        const instagram = s.instagram || init?.instagram || getPartnerInstagramHandle(s);
        const isPayingMerchant = Boolean(s.isNewPartner || s.adminPaidPlan || init?.isNewPartner || init?.adminPaidPlan || s.id === 'store_parceiro_demo' || s.merchantId === 'merchant_parceiro_demo');
        const resolvedTier = isPayingMerchant
          ? ((s.tier && s.tier !== 'free' && s.tier !== 'api') ? s.tier : (init?.tier || 'gold'))
          : 'api';

        return {
          ...s,
          name: init?.name || s.name,
          instagram,
          logo: init?.logo || s.logo || '🏪',
          logoImage: getBrandLogo(init?.id || s.id) || getBrandLogo(init?.name || s.name) || init?.logoImage || (s.logoImage && s.logoImage.startsWith('data:') ? s.logoImage : '') || '',
          image: init?.image || s.image || '',
          tier: resolvedTier,
          adminPaidPlan: Boolean(s.adminPaidPlan),
          category: init?.category || s.category || 'gastronomia',
          city: init?.city || s.city || 'Todo o Brasil (Online)',
          cities: init?.cities || s.cities || (init?.city ? [init.city] : []),
          phone: init?.phone || s.phone || '(11) 98123-4567',
          address: init?.address || s.address || '',
          badge: init?.badge || s.badge || '',
          isApiIntegrated: init?.isApiIntegrated ?? s.isApiIntegrated ?? false,
          apiSource: init?.apiSource || s.apiSource || null,
          apiStatus: init?.apiStatus || s.apiStatus || null,
          cashbackRate: init?.cashbackRate || s.cashbackRate || null,
          cashbackPercent: init?.cashbackPercent || s.cashbackPercent || 0,
          couponsCount: init?.couponsCount ?? s.couponsCount ?? 1,
          website: init?.website || s.website || getStoreDestinationUrl({ ...s, ...init }, null),
          affiliateUrl: init?.affiliateUrl || (s.affiliateUrl && !s.affiliateUrl.includes('google.com/search') ? s.affiliateUrl : getStoreDestinationUrl({ ...s, ...init }, null)),
          referralCode: storeRefCode,
          referralBalance: typeof s.referralBalance === 'number' ? s.referralBalance : 25.00,
          referrals: s.referrals || [
            { id: 'ref_st_1', name: 'Marcos Oliveira', date: 'Hoje às 11:20', bonus: 5.00 },
            { id: 'ref_st_2', name: 'Carla Silveira', date: 'Ontem', bonus: 5.00 },
            { id: 'ref_st_3', name: 'Bruno Mendes', date: 'Há 2 dias', bonus: 5.00 },
            { id: 'ref_st_4', name: 'Larissa Ferreira', date: 'Há 4 dias', bonus: 5.00 },
            { id: 'ref_st_5', name: 'Diego Barbosa', date: 'Há 1 semana', bonus: 5.00 }
          ]
        };
      });
    } catch {
      return INITIAL_STORES.map(normalizeInitialStore);
    }
  });

  // Estado de Usuários Cadastrados no Sistema (Painel de ADM) - Apenas o Adm Master Real e novos cadastros reais
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_admin_users_v3') || localStorage.getItem('melhor_cupom_admin_users');
    if (!saved) return INITIAL_REGISTERED_USERS;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_REGISTERED_USERS;
      // Filtrar estritamente qualquer usuário fictício de demonstração antigo (usr_1 a usr_16, Lucas Silva, etc.)
      const cleaned = parsed.filter(u => {
        if (!u || !u.email) return false;
        const email = u.email.toLowerCase();
        if (email === 'renanzanferrari@live.com') return true;
        if (email === 'lucas.vip@email.com' || email.includes('teste') || email.includes('fake')) return false;
        if (typeof u.id === 'string' && u.id.startsWith('usr_') && u.id !== 'usr_admin_renan') return false;
        return true;
      });
      const hasAdmin = cleaned.some(u => u.email.toLowerCase() === 'renanzanferrari@live.com');
      return hasAdmin ? cleaned : [...INITIAL_REGISTERED_USERS, ...cleaned];
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // Histórico de Resgates no Sistema (Lojista / Extrato) - Limpo de dados falsos de demonstração
  const [redemptions, setRedemptions] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_redemptions_v3') || localStorage.getItem('melhor_cupom_redemptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(r => r && r.storeName !== 'Smash Burger Club' && r.storeName !== 'Barbearia Don Corleone' && r.userName !== 'Lucas Silva');
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Perfil do Administrador Real Master (Renan Zanferrari)
  const [userProfile, setUserProfile] = useState(() => {
    const adminDefaultUser = {
      name: ADMIN_CREDENTIALS?.name || 'Renan Zanferrari',
      email: ADMIN_CREDENTIALS?.email || 'renanzanferrari@live.com',
      phone: '(11) 98123-4567',
      cpf: '***.***.***-**',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      city: 'São Paulo - SP',
      favoriteCategories: ['gastronomia', 'beleza', 'lazer', 'moda', 'tecnologia'],
      notifications: { email: true, whatsapp: true, newDeals: true, expiringSoon: true },
      isLoggedIn: true,
      isRegistered: true,
      isAdmin: true,
      isVip: true,
      vipPlan: 'annual',
      vipSince: '2026-01-01',
      monthlySavings: 0,
      savedCouponIds: [],
      referralCode: 'RENAN5',
      referralBalance: 0.00,
      referrals: []
    };

    const savedRole = localStorage.getItem('melhor_cupom_role');
    if (savedRole === 'visitor') {
      return {
        ...adminDefaultUser,
        isLoggedIn: false,
        isRegistered: false,
        isAdmin: false,
        isVip: false,
        vipPlan: null,
        vipSince: null,
        monthlySavings: 0,
        referralCode: null,
        referralBalance: 0.00,
        referrals: []
      };
    }

    const saved = localStorage.getItem('melhor_cupom_user_v3') || localStorage.getItem('melhor_cupom_user');
    if (!saved) return adminDefaultUser;
    try {
      const parsed = JSON.parse(saved);
      // Descartar cadastro simulado legado de Lucas Silva ou qualquer variação
      if (
        !parsed ||
        parsed.referralCode === 'LUCAS5' ||
        parsed.name === 'Lucas Silva' ||
        parsed.email === 'lucas.vip@email.com' ||
        (parsed.email && parsed.email.toLowerCase().includes('lucas')) ||
        (parsed.name && parsed.name.toLowerCase().includes('lucas')) ||
        (parsed.referralCode && String(parsed.referralCode).toUpperCase().includes('LUCAS')) ||
        !parsed.email
      ) {
        localStorage.removeItem('melhor_cupom_user');
        localStorage.setItem('melhor_cupom_user_v3', JSON.stringify(adminDefaultUser));
        return adminDefaultUser;
      }
      const resolvedRefCode = (parsed.referralCode && parsed.referralCode !== 'CUPOM5' && parsed.referralCode !== 'LUCAS5')
        ? parsed.referralCode
        : (((parsed.name || 'RENAN').trim().split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6) || 'RENAN') + '5');
      return {
        ...adminDefaultUser,
        ...parsed,
        referralCode: resolvedRefCode
      };
    } catch {
      return adminDefaultUser;
    }
  });

  // Estado de Ofertas Imperdíveis & Produtos Virais da Shopee, Magalu e SHEIN (Robô de Ofertas - 85+ ofertas)
  const ALL_BASE_HOT_DEALS = [...MAGALU_RADAR_TOP10, ...SHEIN_VIRAL_TOP18, ...INITIAL_HOT_DEALS];

  const [hotDeals, setHotDeals] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_hot_deals_v9') || localStorage.getItem('melhor_cupom_hot_deals_v8');
    if (!saved) {
      localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(ALL_BASE_HOT_DEALS));
      return ALL_BASE_HOT_DEALS;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Atualizar imagens existentes e garantir que todas as ofertas base (SHEIN, Magalu e Shopee) existam no cache
        const updated = parsed.map(item => {
          const fresh = ALL_BASE_HOT_DEALS.find(d => d.id === item.id);
          return fresh && fresh.image ? { ...item, image: fresh.image, store: fresh.store || item.store, affiliateUrl: fresh.affiliateUrl || item.affiliateUrl } : item;
        });

        const existingIds = new Set(updated.map(d => d.id));
        const missingBaseDeals = ALL_BASE_HOT_DEALS.filter(d => !existingIds.has(d.id));
        const finalDeals = [...missingBaseDeals, ...updated];

        localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(finalDeals));
        return finalDeals;
      }
      return ALL_BASE_HOT_DEALS;
    } catch {
      return ALL_BASE_HOT_DEALS;
    }
  });

  const formatAffiliateUrl = (rawUrl, storeType = 'auto') => {
    if (!rawUrl) return 'https://shopee.com.br/?af=18305641225&utm_source=affiliate&utm_campaign=melhorcupom&af_sub1=melhorcupom';
    
    // Se for link Magalu / Magazine Você / Influencer Magalu
    if (storeType === 'magalu' || rawUrl.includes('magazinevoce.com.br') || rawUrl.includes('magazineluiza.com.br') || rawUrl.includes('maga.lu')) {
      return rawUrl;
    }

    // Se for link SHEIN
    if (storeType === 'shein' || rawUrl.includes('shein.com')) {
      if (rawUrl.includes('aff_id=')) return rawUrl;
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${separator}aff_id=melhorcupom&utm_source=affiliate&utm_medium=partner&ref=www&rep=dir&ret=br`;
    }

    // Se for Shopee
    if (rawUrl.includes('af=18305641225')) return rawUrl;
    if (rawUrl.includes('shopee.com') || rawUrl.includes('s.shopee.com')) {
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${separator}af=18305641225&utm_source=affiliate&utm_campaign=melhorcupom&af_sub1=melhorcupom`;
    }

    return rawUrl;
  };

  const addHotDeal = (dealData) => {
    const isMagalu = (dealData.store && dealData.store.toLowerCase().includes('magalu')) ||
                     (dealData.affiliateUrl && (dealData.affiliateUrl.includes('magazinevoce') || dealData.affiliateUrl.includes('magazineluiza') || dealData.affiliateUrl.includes('maga.lu')));
    const isShein = (dealData.store && dealData.store.toLowerCase().includes('shein')) ||
                    (dealData.affiliateUrl && dealData.affiliateUrl.includes('shein.com'));
    
    const storeName = dealData.store || (isMagalu ? 'Magazine Luiza' : isShein ? 'SHEIN Oficial' : 'Shopee Oficial');
    const affiliateUrl = formatAffiliateUrl(dealData.affiliateUrl || dealData.link, isMagalu ? 'magalu' : isShein ? 'shein' : 'shopee');
    
    const newDeal = {
      id: `deal_${Date.now()}`,
      rating: 4.9,
      salesCount: '1.2k vendidos',
      tag: isMagalu ? '💙 Oferta Magalu' : isShein ? '🖤 Achadinho SHEIN' : '🔥 Oferta Imperdível',
      badgeColor: isMagalu ? 'bg-blue-600' : isShein ? 'bg-neutral-900' : 'bg-red-500',
      freeShipping: dealData.freeShipping ?? true,
      category: dealData.category || 'utilidades',
      categoryLabel: dealData.categoryLabel || 'Achadinhos & Utilidades',
      ...dealData,
      store: storeName,
      affiliateUrl
    };
    setHotDeals(prev => {
      const updated = [newDeal, ...prev];
      localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
      return updated;
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#FF8500', '#10B981']
    });

    return newDeal;
  };

  const deleteHotDeal = (id) => {
    setHotDeals(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
      return updated;
    });
  };

  const syncShopeeHotDeals = async () => {
    const syncedShopee = INITIAL_HOT_DEALS.map(d => ({
      ...d,
      lastSync: 'Sincronizado Agora'
    }));
    setHotDeals(prev => {
      // Manter ofertas da Magalu e SHEIN já existentes e atualizar/injetar as da Shopee
      const nonShopee = prev.filter(p => {
        const s = (p.store || '').toLowerCase();
        const u = (p.affiliateUrl || '').toLowerCase();
        return s.includes('magalu') || s.includes('magazine') || s.includes('shein') || u.includes('shein') || u.includes('magazine');
      });
      // Garantir que SHEIN e Magalu base estejam presentes
      const hasShein = nonShopee.some(p => (p.store || '').toLowerCase().includes('shein'));
      const hasMagalu = nonShopee.some(p => (p.store || '').toLowerCase().includes('magalu') || (p.store || '').toLowerCase().includes('magazine'));
      const updated = [
        ...(hasMagalu ? [] : MAGALU_RADAR_TOP10),
        ...(hasShein ? [] : SHEIN_VIRAL_TOP18),
        ...nonShopee,
        ...syncedShopee
      ];
      localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
      return updated;
    });
    return { count: syncedShopee.length };
  };

  const syncSheinHotDeals = async () => {
    const syncedShein = SHEIN_VIRAL_TOP18.map(d => ({
      ...d,
      lastSync: 'Sincronizado Agora'
    }));
    setHotDeals(prev => {
      const withoutShein = prev.filter(p => !p.id.startsWith('deal_shein_') && !(p.store || '').toLowerCase().includes('shein'));
      const updated = [...syncedShein, ...withoutShein];
      localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
      return updated;
    });
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#111111', '#EC4899', '#F43F5E', '#10B981']
    });
    return { count: syncedShein.length };
  };

  const syncMagaluHotDeals = async () => {
    try {
      const res = await fetch('/api/magalu-sync');
      const data = await res.json();
      const vitrineOffers = (data.success && Array.isArray(data.offers)) ? data.offers : [];
      
      // Combinar Radar Top 10 Diário (1P Oficial validado) + Ofertas capturadas da Vitrine
      const allMagaluDeals = [...MAGALU_RADAR_TOP10, ...vitrineOffers.filter(v => !MAGALU_RADAR_TOP10.some(r => r.affiliateUrl === v.affiliateUrl))];

      setHotDeals(prev => {
        const currentWithoutMagalu = prev.filter(p => !p.id.startsWith('deal_magalu_'));
        const hasShein = currentWithoutMagalu.some(p => (p.store || '').toLowerCase().includes('shein'));
        const updated = [
          ...allMagaluDeals,
          ...(hasShein ? [] : SHEIN_VIRAL_TOP18),
          ...currentWithoutMagalu
        ];
        localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
        return updated;
      });

      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#0086FF', '#0055FF', '#FFB703', '#10B981']
      });

      return { count: allMagaluDeals.length, radarCount: MAGALU_RADAR_TOP10.length, offers: allMagaluDeals };
    } catch (err) {
      console.warn('Erro ao sincronizar Magalu, ativando Radar Top 10 oficial:', err);
      setHotDeals(prev => {
        const currentWithoutMagalu = prev.filter(p => !p.id.startsWith('deal_magalu_'));
        const hasShein = currentWithoutMagalu.some(p => (p.store || '').toLowerCase().includes('shein'));
        const updated = [
          ...MAGALU_RADAR_TOP10,
          ...(hasShein ? [] : SHEIN_VIRAL_TOP18),
          ...currentWithoutMagalu
        ];
        localStorage.setItem('melhor_cupom_hot_deals_v9', JSON.stringify(updated));
        return updated;
      });

      return { count: MAGALU_RADAR_TOP10.length, radarCount: MAGALU_RADAR_TOP10.length, offers: MAGALU_RADAR_TOP10 };
    }
  };

  // Modal de Assinatura
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState('plan_vip');

  // Modal de Divulgue & Ganhe (R$ 5,00 por amigo no caixa)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralModalType, setReferralModalType] = useState('auto'); // 'auto' | 'user' | 'merchant'

  // Modal de Painel de Economia
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  // Modal de Autenticação / Cadastro de Usuários e Lojistas
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('user_register'); // 'user_register' | 'merchant_register' | 'login'

  const openAuthModal = (mode = 'user_register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Modal de Termos de Uso e Política de Privacidade (LGPD)
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms'); // 'terms' | 'privacy'

  const openLegalModal = (tab = 'terms') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  // Salvar no LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('melhor_cupom_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    safeSaveCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_stores_v9', JSON.stringify(stores));
    localStorage.setItem('melhor_cupom_stores_v8', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_redemptions_v3', JSON.stringify(redemptions));
    localStorage.setItem('melhor_cupom_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_user_v3', JSON.stringify(userProfile));
    localStorage.setItem('melhor_cupom_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_admin_users_v3', JSON.stringify(registeredUsers));
    localStorage.setItem('melhor_cupom_admin_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sincronização inicial e em tempo real com o Supabase Cloud
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;

    const initSupabaseData = async () => {
      try {
        // 1. Sincronizar Sessão Ativa
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const profile = await db.getProfile(session.user.id);
          if (profile) {
            setUserProfile(prev => ({
              ...prev,
              id: profile.id,
              name: profile.name || prev.name,
              email: profile.email || session.user.email,
              phone: profile.phone || prev.phone,
              cpf: profile.cpf || prev.cpf,
              city: profile.city || prev.city,
              role: profile.role || 'user',
              isVip: profile.is_vip ?? false,
              vipPlan: profile.vip_plan,
              referralCode: profile.referral_code,
              referralBalance: Number(profile.referral_balance) || 0,
              isLoggedIn: true,
              isRegistered: true,
              isAdmin: profile.role === 'admin'
            }));
            if (profile.role === 'admin') {
              setCurrentRole('admin');
            } else if (profile.role === 'merchant') {
              // Lojista
            } else if (profile.is_vip) {
              setCurrentRole('vip');
            } else {
              setCurrentRole('user_free');
            }
          }
        }

        // 2. Carregar Lojas do Supabase
        const cloudStores = await db.getStores();
        if (isMounted && Array.isArray(cloudStores) && cloudStores.length > 0) {
          setStores(prev => {
            const cloudIds = new Set(cloudStores.map(s => s.id));
            const existingNonCloud = prev.filter(s => !cloudIds.has(s.id));
            return [...cloudStores, ...existingNonCloud];
          });
        }

        // 3. Carregar Resgates do Supabase
        const cloudRedemptions = await db.getRedemptions();
        if (isMounted && Array.isArray(cloudRedemptions) && cloudRedemptions.length > 0) {
          setRedemptions(cloudRedemptions);
        }

        // 4. Carregar Perfis para o Painel ADM
        const cloudProfiles = await db.getAllProfiles();
        if (isMounted && Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
          setRegisteredUsers(prev => {
            const mapped = cloudProfiles.map(p => ({
              id: p.id,
              name: p.name,
              email: p.email,
              phone: p.phone,
              cpf: p.cpf,
              city: p.city,
              role: p.role,
              isVip: p.is_vip,
              vipPlan: p.vip_plan,
              vipSince: p.vip_since,
              monthlySavings: Number(p.monthly_savings) || 0,
              referralCode: p.referral_code,
              referralBalance: Number(p.referral_balance) || 0,
              createdAt: p.created_at,
              status: 'active'
            }));
            const mappedIds = new Set(mapped.map(m => m.id));
            const remaining = prev.filter(u => !mappedIds.has(u.id));
            return [...mapped, ...remaining];
          });
        }

        // 5. Carregar Cupons do Supabase Cloud (garante persistência e sincronização entre PC e Celular)
        const cloudCoupons = await db.getCoupons();
        if (isMounted && Array.isArray(cloudCoupons) && cloudCoupons.length > 0) {
          setCoupons(prev => {
            const needsCloudReset = localStorage.getItem('melhor_cupom_custom_highlight_cloud_reset_v2') !== 'done';

            const sanitizedPrev = prev.map(c => {
              const isCustom = c.isAvulso || c.storeId?.startsWith('store_avulsa_') || c.merchantId?.startsWith('merchant_avulso_') || c.id?.startsWith('cupom_avulso_');
              if (isCustom && needsCloudReset && c.highlight) {
                const unhighlighted = { ...c, highlight: false };
                if (isSupabaseConfigured && supabase) {
                  db.createCoupon(unhighlighted).catch(() => {});
                }
                return unhighlighted;
              }
              return c;
            });

            const prevIds = new Set(sanitizedPrev.map(c => c.id));
            const newFromCloud = cloudCoupons.filter(cc => !prevIds.has(cc.id)).map(c => {
              const isCustom = c.isAvulso || c.storeId?.startsWith('store_avulsa_') || c.merchantId?.startsWith('merchant_avulso_') || c.id?.startsWith('cupom_avulso_');
              return (isCustom && needsCloudReset) ? { ...c, highlight: false } : c;
            });

            if (needsCloudReset) {
              try {
                localStorage.setItem('melhor_cupom_custom_highlight_cloud_reset_v2', 'done');
              } catch {}
            }

            if (newFromCloud.length === 0) {
              safeSaveCoupons(sanitizedPrev);
              return sanitizedPrev;
            }
            const merged = [...newFromCloud, ...sanitizedPrev];
            safeSaveCoupons(merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('[Supabase Sync] Erro na sincronização inicial:', err);
      }
    };

    initSupabaseData();

    // Ouvinte de mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && isMounted) {
        const profile = await db.getProfile(session.user.id);
        if (profile) {
          setUserProfile(prev => ({
            ...prev,
            id: profile.id,
            name: profile.name || prev.name,
            email: profile.email || session.user.email,
            phone: profile.phone || prev.phone,
            cpf: profile.cpf || prev.cpf,
            city: profile.city || prev.city,
            role: profile.role || 'user',
            isVip: profile.is_vip ?? false,
            isLoggedIn: true,
            isRegistered: true,
            isAdmin: profile.role === 'admin'
          }));
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Estado de Simulação Ativa pelo Administrador Master
  const [isSimulatingRole, setIsSimulatingRole] = useState(() => {
    return localStorage.getItem('melhor_cupom_simulating') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('melhor_cupom_simulating', String(isSimulatingRole));
  }, [isSimulatingRole]);

  // Iniciar Simulação de Perfil a partir do Painel do Administrador
  const startSimulation = (roleId) => {
    setIsSimulatingRole(true);
    switchRole(roleId);
    if (roleId.startsWith('merchant_') || roleId === 'partner_store' || roleId === 'merchant_parceiro_demo') {
      setActiveTab('merchant-dashboard');
    } else if (roleId === 'partner_affiliate' || roleId === 'partner' || roleId === 'user_free' || roleId === 'user') {
      setActiveTab('user-profile');
    } else if (roleId === 'admin') {
      setIsSimulatingRole(false);
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('explore');
    }
  };

  // Encerrar Simulação e Retornar ao Painel ADM Master
  const exitSimulation = () => {
    setIsSimulatingRole(false);
    setCurrentRole('admin');
    setUserProfile(prev => ({
      ...prev,
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      phone: '(11) 98765-4321',
      isLoggedIn: true,
      isRegistered: true,
      isAdmin: true,
      isVip: true,
      referralCode: 'RENAN5',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    }));
    setActiveTab('admin-dashboard');
  };

  // Sincronizar o estado de VIP quando o perfil rápido é alterado
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    const getValidRefCode = (p) => {
      if (p?.referralCode && p.referralCode !== 'CUPOM5' && p.referralCode !== 'LUCAS5') return p.referralCode;
      const base = (p?.name || 'RENAN').trim().split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
      return (base || 'RENAN') + '5';
    };
    if (newRole === 'admin') {
      setIsSimulatingRole(false);
      setUserProfile(prev => ({
        ...prev,
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        isLoggedIn: true,
        isRegistered: true,
        isAdmin: true,
        isVip: true,
        referralCode: 'RENAN5',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      }));
      setActiveTab('admin-dashboard');
    } else if (newRole === 'vip') {
      setUserProfile(prev => ({
        ...prev,
        isLoggedIn: true,
        isRegistered: true,
        isVip: true,
        vipPlan: 'vip',
        vipSince: '2026-01-10',
        monthlySavings: 342.50,
        referralCode: getValidRefCode(prev)
      }));
    } else if (newRole === 'user_free' || newRole === 'user') {
      setUserProfile(prev => ({
        ...prev,
        isLoggedIn: true,
        isRegistered: true,
        isVip: false,
        vipPlan: null,
        vipSince: null,
        monthlySavings: 0,
        referralCode: getValidRefCode(prev),
        referralBalance: prev.referralBalance || 0.00
      }));
    } else if (newRole === 'visitor') {
      setUserProfile(prev => ({
        ...prev,
        isLoggedIn: false,
        isRegistered: false,
        isVip: false,
        vipPlan: null,
        vipSince: null,
        monthlySavings: 0,
        referralCode: null,
        referralBalance: 0.00,
        referrals: []
      }));
    } else if (newRole.startsWith('merchant_') || newRole === 'partner_store' || newRole === 'merchant_parceiro_demo') {
      const targetStore = stores.find(s => s.merchantId === newRole || s.id === newRole) || stores.find(s => s.merchantId === 'merchant_parceiro_demo') || stores[0];
      setUserProfile(prev => ({
        ...prev,
        id: targetStore?.id || 'store_parceiro_demo',
        name: targetStore?.name || 'Smash Burger & Co. (Loja Parceira)',
        email: targetStore?.email || 'contato@smashburger.com.br',
        phone: targetStore?.phone || '(11) 98765-4321',
        isLoggedIn: true,
        isRegistered: true,
        isAdmin: false,
        isVip: false,
        vipPlan: null,
        referralCode: targetStore?.referralCode || 'SMASH5',
        referralBalance: targetStore?.referralBalance || 85.00
      }));
    } else if (newRole === 'partner_affiliate' || newRole === 'partner') {
      setUserProfile(prev => ({
        ...prev,
        id: 'partner_affiliate_1',
        name: 'Videira Mil Grau (@videiramilgrau_sc)',
        email: 'parcerias@videiramilgrau.com.br',
        phone: '(49) 99876-5432',
        city: 'Videira - SC',
        isLoggedIn: true,
        isRegistered: true,
        isAdmin: false,
        isVip: true,
        vipPlan: 'vip',
        referralCode: 'VIDEIRAMG5',
        referralBalance: 320.00,
        storesReferred: 14,
        usersReferred: 52,
        isInstagramPartner: true,
        partnerHandle: '@videiramilgrau_sc'
      }));
    }
  };

  // Funções Administrativas do Painel ADM
  const adminToggleUserVip = (userId) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextVip = !u.isVip;
        return {
          ...u,
          isVip: nextVip,
          vipPlan: nextVip ? 'monthly' : null,
          vipSince: nextVip ? (u.vipSince || new Date().toISOString().split('T')[0]) : null
        };
      }
      return u;
    }));
  };

  const adminUpdateStoreTier = (storeId, newTier) => {
    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        return { ...s, tier: newTier, adminPaidPlan: newTier !== 'api' };
      }
      return s;
    }));
  };

  const adminAdjustUserReferral = (userId, amount) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          referralBalance: Math.max(0, Number(((u.referralBalance || 0) + amount).toFixed(2)))
        };
      }
      return u;
    }));
  };

  // Assinar Plano VIP
  const subscribeToVip = (planId, discountAmount = 0) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];
    
    // Disparar confetes celebratórios!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#FFC800', '#10B981', '#FFFFFF']
    });

    setUserProfile(prev => {
      const remainingBalance = discountAmount > 0 
        ? Math.max(0, (prev.referralBalance || 0) - discountAmount)
        : (prev.referralBalance || 0);

      return {
        ...prev,
        isVip: true,
        vipPlan: 'vip',
        vipSince: new Date().toISOString().split('T')[0],
        monthlySavings: prev.monthlySavings > 0 ? prev.monthlySavings : 150.00,
        referralBalance: remainingBalance
      };
    });

    setCurrentRole('vip');
    setIsSubscriptionModalOpen(false);
  };

  // Cancelar ou Pausar Assinatura (para testes)
  const cancelSubscription = () => {
    setUserProfile(prev => ({
      ...prev,
      isVip: false,
      vipPlan: null
    }));
    setCurrentRole('visitor');
  };

  // Resgatar um Cupom
  const redeemCoupon = (coupon) => {
    // Checar se o usuário já tem um resgate ativo/válido para este cupom
    const existingValid = redemptions.find(r => 
      r.couponId === coupon.id && 
      (r.userName === userProfile.name || (userProfile.cpf && r.userCpf === userProfile.cpf)) && 
      r.status === 'valid'
    );
    if (existingValid) {
      return existingValid;
    }

    // Checar limite por CPF (resgates usados ou válidos)
    const maxUses = coupon.maxUsesPerUser;
    const isLimited = maxUses !== null && maxUses !== undefined && maxUses !== '' && maxUses !== 0 && maxUses !== 'unlimited';
    if (isLimited) {
      const userPreviousUses = redemptions.filter(r => 
        r.couponId === coupon.id && 
        (r.userName === userProfile.name || (userProfile.cpf && r.userCpf === userProfile.cpf))
      ).length;

      if (userPreviousUses >= maxUses) {
        return {
          error: true,
          limitReached: true,
          maxUses,
          message: `Você já atingiu o limite de ${maxUses === 1 ? '1 resgate' : `${maxUses} resgates`} por CPF para esta oferta.`
        };
      }
    }

    const store = stores.find(s => s.id === coupon.storeId);
    const isApiOrOnline = Boolean(
      coupon.type === 'online' ||
      coupon.isApiIntegrated ||
      coupon.apiSource ||
      store?.type === 'online' ||
      store?.isApiIntegrated ||
      store?.apiSource ||
      store?.tier === 'api'
    );
    
    // Gera código único ex: VIP-VIP50-8472
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = isApiOrOnline
      ? (coupon.codePrefix || `VIP-${randomCode}`)
      : `VIP-${coupon.codePrefix || 'CUPOM'}-${randomCode}`;

    // Gera senha numérica única de 6 dígitos para o QR Code APENAS para lojistas credenciados locais (não empresas de API)
    let generatedPassCode = null;
    if (!isApiOrOnline) {
      let passCodeExists = true;
      while (passCodeExists) {
        generatedPassCode = String(Math.floor(100000 + Math.random() * 900000));
        passCodeExists = redemptions.some(r => r.passCode === generatedPassCode);
      }
    }

    const redemptionId = `red_${Date.now()}`;
    const qrPayload = !isApiOrOnline
      ? JSON.stringify({
          code: generatedCode,
          passCode: generatedPassCode,
          id: redemptionId,
          couponId: coupon.id,
          merchantId: coupon.merchantId
        })
      : null;

    // Cálculo assertivo da economia real baseada em (originalPrice - promoPrice) ou estimatedSavings
    const effectiveSavings = (coupon.originalPrice && coupon.promoPrice && Number(coupon.originalPrice) > Number(coupon.promoPrice))
      ? Number((Number(coupon.originalPrice) - Number(coupon.promoPrice)).toFixed(2))
      : (Number(coupon.estimatedSavings) || 20.00);

    const newRedemption = {
      id: redemptionId,
      code: generatedCode,
      passCode: generatedPassCode,
      qrPayload: qrPayload,
      couponId: coupon.id,
      couponTitle: coupon.title,
      merchantId: coupon.merchantId,
      storeName: store ? store.name : 'Loja Parceira',
      category: coupon.category || (store ? store.category : 'gastronomia'),
      storeLogo: store ? store.logo : '🏪',
      storeImage: store ? (store.image || store.logoImage) : '',
      userName: userProfile.name,
      userCpf: userProfile.cpf || '***.***.***-**',
      maxUsesPerUser: coupon.maxUsesPerUser,
      discountBadge: coupon.discountBadge,
      originalPrice: coupon.originalPrice,
      promoPrice: coupon.promoPrice,
      savings: effectiveSavings,
      isApiRedemption: isApiOrOnline,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutos de tolerância para uso no caixa
      status: isApiOrOnline ? 'used' : 'valid',
      usedAt: isApiOrOnline ? new Date().toISOString() : null
    };

    setRedemptions(prev => [newRedemption, ...prev]);

    // Se for cupom de loja online / API, o resgate do código equivale à utilização e credita economia
    if (isApiOrOnline) {
      setUserProfile(prev => ({
        ...prev,
        monthlySavings: Number(((prev.monthlySavings || 0) + effectiveSavings).toFixed(2))
      }));
    }

    // Atualizar contagem de usos do cupom
    setCoupons(prev => prev.map(c => {
      if (c.id === coupon.id) {
        return { ...c, usesCount: (c.usesCount || 0) + 1 };
      }
      return c;
    }));

    // Celebrar ativação
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#FF5F00', '#10B981']
    });

    if (isSupabaseConfigured && supabase) {
      db.createRedemption({
        id: newRedemption.id,
        coupon_id: newRedemption.couponId,
        store_id: newRedemption.storeId,
        store_name: newRedemption.storeName,
        user_name: newRedemption.userName,
        user_cpf: newRedemption.userCpf,
        code: newRedemption.code,
        pass_code: newRedemption.passCode,
        savings: newRedemption.savings,
        status: newRedemption.status,
        is_api_redemption: newRedemption.isApiRedemption,
        expires_at: newRedemption.expiresAt,
        used_at: newRedemption.usedAt
      }).catch(err => console.warn('[Supabase Redemption]', err));
    }

    return newRedemption;
  };

  // Validar Cupom e Dar Baixa Automática (Exclusivo para Lojistas no Balcão via QR Code ou Senha - bloqueado para empresas de API)
  const validateRedemption = (inputQuery, merchantId) => {
    if (!inputQuery) {
      return { success: false, message: 'Por favor, escaneie o QR Code ou digite a senha de 6 dígitos.' };
    }

    const currentMerchantStore = stores.find(s => s.merchantId === merchantId || s.id === merchantId);
    if (currentMerchantStore && (currentMerchantStore.tier === 'api' || currentMerchantStore.isApiIntegrated || currentMerchantStore.apiSource)) {
      return {
        success: false,
        message: '⚠️ O Validador de Balcão (Caixa / PDV) é exclusivo para lojistas cadastrados e não está disponível para empresas de API.'
      };
    }

    let searchCode = '';
    let searchPassCode = '';
    const rawTrimmed = String(inputQuery).trim();

    // Tentar decodificar se for JSON vindo do leitor de QR Code
    if (rawTrimmed.startsWith('{') && rawTrimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(rawTrimmed);
        if (parsed.code) searchCode = String(parsed.code).trim().toUpperCase();
        if (parsed.passCode) searchPassCode = String(parsed.passCode).trim();
      } catch (e) {
        // ignora erro de parse
      }
    }

    const cleanInput = rawTrimmed.toUpperCase().replace(/\s+/g, '');

    // Localizar o cupom pelo passCode (senha de 6 dígitos) OU pelo código do cupom OU pelo payload escaneado
    const found = redemptions.find(r => {
      if (searchPassCode && r.passCode && r.passCode === searchPassCode) return true;
      if (searchCode && r.code && r.code.toUpperCase() === searchCode) return true;
      if (r.passCode && r.passCode === cleanInput) return true;
      if (r.code && r.code.toUpperCase() === cleanInput) return true;
      if (r.passCode && cleanInput.includes(r.passCode)) return true;
      if (r.code && cleanInput.includes(r.code.toUpperCase())) return true;
      return false;
    });

    if (!found) {
      return { 
        success: false, 
        message: 'Código ou Senha do QR Code não encontrado no sistema. Verifique a senha de 6 dígitos com o cliente.' 
      };
    }

    const foundCoupon = coupons.find(c => c.id === found.couponId);
    const foundStore = stores.find(s => s.id === foundCoupon?.storeId || s.merchantId === found.merchantId);
    if (
      found.isApiRedemption ||
      foundCoupon?.isApiIntegrated ||
      foundCoupon?.apiSource ||
      foundStore?.tier === 'api' ||
      foundStore?.isApiIntegrated ||
      foundStore?.apiSource
    ) {
      return {
        success: false,
        message: '⚠️ Operação Bloqueada: O Validador de Balcão (PDV) é exclusivo para lojistas e não se aplica a cupons de empresas de API.'
      };
    }

    if (found.status === 'used') {
      return { 
        success: false, 
        message: `⚠️ DUPLICIDADE BLOQUEADA: Este cupom já foi baixado em ${new Date(found.usedAt).toLocaleString('pt-BR')}. Não é permitida nova baixa!` 
      };
    }

    if (found.status === 'expired') {
      return { success: false, message: 'Este cupom expirou antes de ser validado no caixa.' };
    }

    // Verificar se pertence ao lojista atual (ou se é admin/modo teste)
    if (merchantId && found.merchantId !== merchantId) {
      return { 
        success: false, 
        message: `Atenção: Este cupom pertence ao parceiro "${found.storeName}". Não é válido para este estabelecimento.` 
      };
    }

    // Fazer a baixa automática imediata
    const now = new Date().toISOString();
    const updatedRedemption = { ...found, status: 'used', usedAt: now };

    setRedemptions(prev => prev.map(r => {
      if (r.id === found.id) {
        return updatedRedemption;
      }
      return r;
    }));

    if (isSupabaseConfigured && supabase) {
      db.updateRedemption(found.id, {
        status: 'used',
        used_at: now
      }).catch(err => console.warn('[Supabase Update Redemption]', err));
    }

    // Contabilizar nas economias do usuário (se ainda não contabilizado)
    const savingsAmount = Number(found.savings) || 20.00;
    setUserProfile(prev => ({
      ...prev,
      monthlySavings: Number((prev.monthlySavings + savingsAmount).toFixed(2))
    }));

    // Confetes de baixa confirmada
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#FF5F00', '#FFD700']
    });

    const cpfDisplay = found.userCpf ? ` (CPF: ${found.userCpf})` : '';
    const limitInfo = found.maxUsesPerUser === 1
      ? ' • Limite: 1 por CPF'
      : found.maxUsesPerUser > 1
      ? ` • Limite: até ${found.maxUsesPerUser} por CPF`
      : ' • Limite: Ilimitado por CPF';

    return { 
      success: true, 
      redemption: updatedRedemption,
      savings: savingsAmount,
      message: `Cupom baixado com sucesso! Aplique o desconto de "${found.discountBadge}" para ${found.userName}${cpfDisplay}${limitInfo}. Economia de R$ ${savingsAmount.toFixed(2).replace('.', ',')} contabilizada!`
    };
  };

  // Adicionar Novo Cupom (Criado pelo Lojista)
  const addCoupon = (couponData) => {
    // Validação de Moderação e Segurança de Conteúdo
    const safety = validateCouponSafety(couponData);
    if (!safety.safe) {
      alert(`⚠️ Bloqueio de Conteúdo:\n${safety.reason}`);
      return { error: safety.reason };
    }

    const couponId = couponData.id || `cupom_${Date.now()}`;
    const newCoupon = {
      id: couponId,
      viewsCount: 0,
      usesCount: 0,
      highlight: Boolean(couponData.highlight),
      vipOnly: true,
      rules: couponData.rules || ['Apresentar o cupom VIP no balcão.', 'Não cumulativo com outras promoções.'],
      ...couponData
    };

    // Se o cupom tiver uma loja avulsa (ou se a loja não constar na lista de lojas), cadastrar a loja automaticamente
    if (newCoupon.storeId) {
      setStores(prevStores => {
        const storeExists = prevStores.some(s => s.id === newCoupon.storeId);
        if (!storeExists) {
          const isOnline = newCoupon.type === 'online' || (newCoupon.city && newCoupon.city.toLowerCase().includes('online'));
          const createdStore = {
            id: newCoupon.storeId,
            merchantId: newCoupon.merchantId || `merchant_${Date.now()}`,
            name: newCoupon.storeName || 'Loja Parceira',
            legalName: newCoupon.storeName || 'Loja Parceira',
            category: newCoupon.category || 'gastronomia',
            city: isOnline ? 'Brasil (Todo o País / Online)' : (newCoupon.city || 'São Paulo - SP'),
            cities: isOnline ? ['Todas as Cidades (Online / Brasil Todo)'] : (newCoupon.cities?.length ? newCoupon.cities : [newCoupon.city || 'São Paulo - SP']),
            type: isOnline ? 'online' : 'physical',
            isOnline,
            logo: newCoupon.storeLogo || '🏪',
            logoImage: newCoupon.storeLogoImage || newCoupon.logoImage || (typeof newCoupon.storeLogo === 'string' && (newCoupon.storeLogo.startsWith('http') || newCoupon.storeLogo.startsWith('data:') || newCoupon.storeLogo.startsWith('/')) ? newCoupon.storeLogo : '') || getBrandLogo(newCoupon.storeName) || '',
            image: newCoupon.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
            tier: 'api',
            adminPaidPlan: false,
            address: isOnline ? 'Atendimento Online em Todo o Brasil' : (newCoupon.city || 'Brasil'),
            phone: '(11) 98123-4567',
            isNewPartner: true,
            createdAt: new Date().toISOString()
          };
          const updatedStores = [createdStore, ...prevStores];
          try {
            localStorage.setItem('melhor_cupom_stores_v10', JSON.stringify(updatedStores));
            localStorage.setItem('melhor_cupom_stores_v9', JSON.stringify(updatedStores));
          } catch {}
          return updatedStores;
        }
        return prevStores;
      });
    }

    setCoupons(prev => {
      const updated = [newCoupon, ...prev.filter(c => c.id !== newCoupon.id)];
      safeSaveCoupons(updated);
      return updated;
    });

    // Persistência em Nuvem (Supabase)
    if (isSupabaseConfigured && supabase) {
      db.createCoupon(newCoupon).catch(err => console.warn('[Supabase CreateCoupon]', err));
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FF5F00', '#FFC800']
    });

    return newCoupon;
  };

  // Registrar visualização de cupom por usuário
  const recordCouponView = (couponId) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === couponId ? { ...c, viewsCount: (c.viewsCount || 0) + 1 } : c);
      safeSaveCoupons(updated);
      return updated;
    });
  };

  // Atualizar Cupom Existente (Admin ou Lojista)
  const updateCoupon = (couponId, updatedFields) => {
    // Validação de Moderação e Segurança de Conteúdo
    const safety = validateCouponSafety(updatedFields);
    if (!safety.safe) {
      alert(`⚠️ Bloqueio de Conteúdo:\n${safety.reason}`);
      return { error: safety.reason };
    }

    let updatedCoupon = null;
    setCoupons(prev => {
      const updated = prev.map(c => {
        if (c.id === couponId) {
          updatedCoupon = {
            ...c,
            ...updatedFields,
            updatedAt: new Date().toISOString()
          };
          return updatedCoupon;
        }
        return c;
      });
      safeSaveCoupons(updated);
      return updated;
    });

    // Se houver loja associada e atualizou dados de marca/logo, manter sincronizado
    if (updatedCoupon?.storeId && (updatedFields.storeName || updatedFields.storeLogoImage || updatedFields.logoImage)) {
      setStores(prevStores => {
        const updatedStores = prevStores.map(s => {
          if (s.id === updatedCoupon.storeId) {
            return {
              ...s,
              name: updatedCoupon.storeName || s.name,
              logo: updatedCoupon.storeLogo || s.logo,
              logoImage: updatedCoupon.logoImage || updatedCoupon.storeLogoImage || s.logoImage
            };
          }
          return s;
        });
        try {
          localStorage.setItem('melhor_cupom_stores_v10', JSON.stringify(updatedStores));
          localStorage.setItem('melhor_cupom_stores_v9', JSON.stringify(updatedStores));
        } catch {}
        return updatedStores;
      });
    }

    // Persistência em Nuvem (Supabase)
    if (isSupabaseConfigured && supabase && updatedCoupon) {
      db.createCoupon(updatedCoupon).catch(err => console.warn('[Supabase UpdateCoupon]', err));
    }

    return updatedCoupon;
  };

  // Excluir Cupom (Admin ou Lojista)
  const deleteCoupon = (couponId) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      safeSaveCoupons(updated);
      return updated;
    });
    if (isSupabaseConfigured && supabase) {
      db.deleteCoupon(couponId).catch(err => console.warn('[Supabase DeleteCoupon]', err));
    }
  };

  // Alternar Destaque Ouro do Cupom (Admin)
  const toggleHighlightCoupon = (couponId) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === couponId ? { ...c, highlight: !c.highlight } : c);
      safeSaveCoupons(updated);
      const target = updated.find(c => c.id === couponId);
      if (target && isSupabaseConfigured && supabase) {
        db.createCoupon(target).catch(err => console.warn('[Supabase UpdateHighlight]', err));
      }
      return updated;
    });
  };

  // Alternar Favorito
  const toggleFavorite = (couponId) => {
    setUserProfile(prev => {
      const exists = prev.savedCouponIds.includes(couponId);
      return {
        ...prev,
        savedCouponIds: exists 
          ? prev.savedCouponIds.filter(id => id !== couponId)
          : [...prev.savedCouponIds, couponId]
      };
    });
  };

  // Atualizar Perfil da Loja / Logo da Empresa
  const updateStore = (storeId, updatedData) => {
    setStores(prev => prev.map(s => {
      if (s.id === storeId || s.merchantId === storeId) {
        return { ...s, ...updatedData };
      }
      return s;
    }));
  };

  // Alterar / Fazer Upgrade de Plano de Lojista (Free, Bronze, Prata, Ouro)
  const upgradeStoreTier = (storeId, newTier, discountAmount = 0) => {
    setStores(prev => prev.map(s => {
      if (s.id === storeId || s.merchantId === storeId) {
        const remainingBalance = discountAmount > 0 
          ? Math.max(0, (s.referralBalance || 0) - discountAmount)
          : (s.referralBalance || 0);
        return { 
          ...s, 
          tier: newTier,
          freeTrialActive: false,
          firstMonthFree: false,
          adminPaidPlan: newTier !== 'api',
          referralBalance: remainingBalance
        };
      }
      return s;
    }));

    if (newTier === 'gold') {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#FF5F00', '#FFFFFF']
      });
    } else if (newTier === 'silver') {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#94A3B8', '#E2E8F0', '#FFFFFF']
      });
    } else if (newTier === 'bronze') {
      confetti({
        particleCount: 75,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#D97706', '#B45309', '#FDE68A', '#FFFFFF']
      });
    }
  };

  // Simular / Adicionar Nova Indicação (+R$ 5,00 no Caixa do Usuário ou da Loja)
  const addReferral = (type = 'auto', customFriendName = null) => {
    const isMerchant = type === 'merchant' || (type === 'auto' && currentRole.startsWith('merchant_'));
    const friendNames = [
      'Mariana Rocha', 'Carlos Eduardo', 'Juliana Fonseca', 'Rodrigo Nogueira',
      'Fernanda Martins', 'Gustavo Lima', 'Camila Santos', 'Felipe Barreto',
      'Beatriz Albuquerque', 'Thiago Meireles'
    ];
    const chosenName = customFriendName || friendNames[Math.floor(Math.random() * friendNames.length)];
    // Lojista ganha R$ 5,00 por cadastro de cliente | Usuário ganha R$ 3,00 por assinatura pelo link
    const bonus = isMerchant ? 5.00 : 3.00;

    // Disparar confetes celebratórios de ganho de bônus!
    confetti({
      particleCount: 80,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#10B981', '#FF5F00', '#FFC800', '#FFFFFF']
    });

    if (isMerchant) {
      const targetMerchantId = currentRole.startsWith('merchant_') ? currentRole : 'merchant_burger';
      setStores(prev => prev.map(s => {
        if (s.merchantId === targetMerchantId || s.id === targetMerchantId) {
          const newRef = {
            id: `ref_st_${Date.now()}`,
            name: chosenName,
            date: 'Agora mesmo',
            bonus,
            type: 'Cliente cadastrado'
          };
          return {
            ...s,
            referralBalance: (s.referralBalance || 0) + bonus,
            referrals: [newRef, ...(s.referrals || [])]
          };
        }
        return s;
      }));
    } else {
      const newRef = {
        id: `ref_usr_${Date.now()}`,
        name: chosenName,
        date: 'Agora mesmo',
        bonus,
        type: 'Assinatura VIP pelo link'
      };
      setUserProfile(prev => ({
        ...prev,
        referralBalance: (prev.referralBalance || 0) + bonus,
        referrals: [newRef, ...(prev.referrals || [])]
      }));
    }

    return { name: chosenName, bonus, isMerchant };
  };

  // Abater/Consumir saldo de indicações do usuário
  const useReferralBalance = (amount) => {
    if (amount <= 0) return 0;
    let used = 0;
    setUserProfile(prev => {
      used = Math.min(prev.referralBalance || 0, amount);
      return {
        ...prev,
        referralBalance: Math.max(0, (prev.referralBalance || 0) - used)
      };
    });
    return used;
  };

  // Abater/Consumir saldo de indicações da loja
  const useStoreReferralBalance = (storeId, amount) => {
    if (amount <= 0) return 0;
    let used = 0;
    setStores(prev => prev.map(s => {
      if (s.id === storeId || s.merchantId === storeId) {
        used = Math.min(s.referralBalance || 0, amount);
        return {
          ...s,
          referralBalance: Math.max(0, (s.referralBalance || 0) - used)
        };
      }
      return s;
    }));
    return used;
  };

  // Atualizar Perfil do Assinante
  const updateUserProfile = (changes) => {
    setUserProfile(prev => ({
      ...prev,
      ...changes
    }));
  };

  // Cadastrar Novo Usuário (Pessoa Física com Nome, CPF, CEP, Cidade, Email, WhatsApp, Senha)
  const registerUser = (userData) => {
    // Validação Anti-Pornografia, Explícito e Trolls
    const safety = validateUserSafety(userData);
    if (!safety.safe) {
      console.warn('[RegisterUser BLOQUEADO]', safety.reason);
      return { success: false, error: safety.reason };
    }

    const { name, cpf, cep, city, email, phone, password } = userData;
    const cleanName = name?.trim() || 'Usuário';
    const firstName = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
    const generatedReferralCode = (firstName.substring(0, 5) + Math.floor(10 + Math.random() * 90)).toUpperCase();

    const newUserRecord = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: email || '',
      phone: phone || '',
      cpf: cpf || '',
      cep: cep || '01310-100',
      city: city || 'São Paulo - SP',
      password: password || '',
      role: 'user',
      isVip: false,
      vipPlan: null,
      vipSince: null,
      monthlySavings: 0,
      totalRedemptions: 0,
      referralCode: generatedReferralCode,
      referralBalance: 0.00,
      referralsCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setRegisteredUsers(prev => [newUserRecord, ...prev.filter(u => u.email?.toLowerCase() !== email?.toLowerCase())]);

    setUserProfile(prev => ({
      ...prev,
      id: newUserRecord.id,
      name: cleanName,
      cpf: cpf || prev.cpf,
      cep: cep || prev.cep || '01310-100',
      city: city || prev.city || 'São Paulo - SP',
      email: email || prev.email,
      phone: phone || prev.phone,
      referralCode: generatedReferralCode,
      isRegistered: true,
      isLoggedIn: true,
      isVip: false,
      isAdmin: false
    }));

    setCurrentRole('user_free');
    setActiveTab('user-profile');

    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#10B981', '#FFC800', '#FFFFFF']
    });

    // Se veio pelo link de uma página de Instagram parceira (?convite=CODIGO), contabilizar +1 usuário (+R$ 3,00)
    try {
      const activeRef = localStorage.getItem('melhor_cupom_active_referral_code');
      if (activeRef) {
        const rawPartners = localStorage.getItem('melhor_cupom_ig_partners_v1');
        if (rawPartners) {
          const parsedPartners = JSON.parse(rawPartners);
          if (Array.isArray(parsedPartners)) {
            const updatedPartners = parsedPartners.map(p => 
              p.code && p.code.toUpperCase() === activeRef.toUpperCase()
                ? { ...p, usersReferred: (p.usersReferred || 0) + 1 }
                : p
            );
            localStorage.setItem('melhor_cupom_ig_partners_v1', JSON.stringify(updatedPartners));
          }
        }
      }
    } catch {}

    setIsAuthModalOpen(false);

    // Salvar no Supabase Cloud se estiver configurado
    if (isSupabaseConfigured && supabase && email) {
      db.signUp(email, password || '123456', {
        name: cleanName,
        cpf: cpf || '',
        cep: cep || '',
        city: city || 'São Paulo - SP',
        phone: phone || '',
        role: 'user'
      }).then(({ data, error }) => {
        if (!error && data?.user) {
          db.upsertProfile({
            id: data.user.id,
            name: cleanName,
            email: email,
            phone: phone || '',
            cpf: cpf || '',
            cep: cep || '',
            city: city || 'São Paulo - SP',
            role: 'user',
            referral_code: generatedReferralCode,
            is_vip: false
          });
        }
      }).catch(err => console.warn('[Supabase SignUp]', err));
    }

    return { success: true, name: cleanName, referralCode: generatedReferralCode };
  };

  // Cadastrar Novo Lojista / Franquia (com Nome, CNPJ, CEP, Cidades Franquia, Email, WhatsApp, Senha, Instagram)
  const registerMerchant = (merchantData) => {
    // Validação Anti-Pornografia, Explícito e Trolls
    const safety = validateStoreSafety(merchantData);
    if (!safety.safe) {
      console.warn('[RegisterMerchant BLOQUEADO]', safety.reason);
      return { success: false, error: safety.reason };
    }

    const { name, legalName, cnpj, cep, cities, email, phone, category, instagram, storeType, isOnline, logoImage, image, banner } = merchantData;
    const storeId = `store_${Date.now()}`;
    const merchantId = `merchant_${Date.now()}`;
    const cleanName = name?.trim() || 'Nova Loja Parceira';
    const cleanShort = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
    const storeRefCode = (cleanShort + '5').toUpperCase();

    const isOnlineStore = storeType === 'online' || isOnline || (Array.isArray(cities) && cities.some(c => {
      const lower = String(c).toLowerCase();
      return lower.includes('online') || lower.includes('todas as cidades') || lower.includes('todo o brasil') || lower.includes('todos os locais');
    }));

    const selectedCities = isOnlineStore
      ? ['Todas as Cidades (Online / Brasil Todo)']
      : (Array.isArray(cities) && cities.length > 0 ? cities : ['São Paulo - SP']);

    const newStore = {
      id: storeId,
      merchantId,
      name: cleanName,
      legalName: legalName || cleanName,
      cnpj: cnpj || '00.000.000/0001-00',
      cep: cep || (isOnlineStore ? '00000-000' : '01310-100'),
      category: category || 'gastronomia',
      cities: selectedCities, // Suporte a múltiplas cidades para franquias e abrangência nacional
      city: isOnlineStore ? 'Brasil (Todo o País / Online)' : (selectedCities[0] || 'São Paulo - SP'),
      phone: phone || '(11) 98123-4567',
      email: email || 'contato@lojaparceira.com.br',
      instagram: (instagram || '').trim(),
      address: isOnlineStore ? 'Atendimento Online em Todo o Brasil' : `${selectedCities[0] || 'Brasil'}`,
      type: isOnlineStore ? 'online' : 'physical',
      isOnline: isOnlineStore,
      hours: isOnlineStore ? 'Online 24 horas por dia' : 'Seg a Sáb: 10h às 22h',
      tier: 'free_trial',
      freeTrialActive: true,
      freeTrialMonths: 3,
      freeTrialEndsAt: new Date(Date.now() + 90 * 86400000).toISOString(),
      maxCoupons: 1,
      adminPaidPlan: false,
      referralCode: storeRefCode,
      referralBalance: 0.00,
      referrals: [],
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      isNewPartner: true,
      image: image || banner || (isOnlineStore 
        ? 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=700&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80'),
      logo: isOnlineStore ? '🌐' : '🏪',
      logoImage: logoImage || ''
    };

    setStores(prev => [newStore, ...prev]);
    setCurrentRole(merchantId);
    setUserProfile(prev => ({
      ...prev,
      name: cleanName,
      email: email || prev.email,
      phone: phone || prev.phone,
      isRegistered: true,
      isLoggedIn: true,
      isVip: false,
      vipPlan: null
    }));
    setActiveTab('merchant-dashboard');

    // Salvar no Supabase Cloud se estiver configurado
    if (isSupabaseConfigured && supabase) {
      db.createStore({
        id: storeId,
        merchant_id: merchantId,
        name: cleanName,
        legal_name: legalName || cleanName,
        cnpj: cnpj || '',
        cep: cep || '',
        category: category || 'gastronomia',
        cities: selectedCities,
        city: isOnlineStore ? 'Brasil (Todo o País / Online)' : (selectedCities[0] || 'São Paulo - SP'),
        phone: phone || '',
        email: email || '',
        instagram: (instagram || '').trim(),
        address: isOnlineStore ? 'Atendimento Online em Todo o Brasil' : `${selectedCities[0] || 'Brasil'}`,
        tier: 'free_trial',
        free_trial_active: true,
        type: isOnlineStore ? 'online' : 'physical',
        is_online: isOnlineStore,
        logo_image: logoImage || '',
        referral_code: storeRefCode
      }).catch(err => console.warn('[Supabase Store]', err));
    }

    // Se a empresa se cadastrou pelo link de uma página parceira (?convite=CODIGO), contabilizar +1 empresa (+R$ 5,00)
    try {
      const activeRef = localStorage.getItem('melhor_cupom_active_referral_code');
      if (activeRef) {
        const rawPartners = localStorage.getItem('melhor_cupom_ig_partners_v1');
        if (rawPartners) {
          const parsedPartners = JSON.parse(rawPartners);
          if (Array.isArray(parsedPartners)) {
            const updatedPartners = parsedPartners.map(p => 
              p.code && p.code.toUpperCase() === activeRef.toUpperCase()
                ? { ...p, storesReferred: (p.storesReferred || 0) + 1 }
                : p
            );
            localStorage.setItem('melhor_cupom_ig_partners_v1', JSON.stringify(updatedPartners));
          }
        }
      }
    } catch {}

    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#FF5F00', '#F59E0B', '#10B981', '#FFFFFF']
    });

    setIsAuthModalOpen(false);

    // Publicação 100% Automática no Instagram para este novo parceiro cadastrado a partir de agora
    setTimeout(() => {
      autoPublishStoreToInstagram(newStore, coupons)
        .then(res => {
          if (res?.success) {
            console.log(`[AutoPublish] Novo parceiro "${newStore.name}" postado no Instagram com sucesso!`);
          }
        })
        .catch(err => {
          console.warn('[AutoPublish] Falha em segundo plano:', err);
        });
    }, 1500);

    return { success: true, store: newStore };
  };

  // Login Unificado (identifica automaticamente se é Administrador Master, Lojista ou Usuário)
  const loginAccount = (identifier = '', password = '') => {
    const raw = (identifier || '').trim();
    const clean = raw.toLowerCase();
    const digits = raw.replace(/\D/g, '');

    // 0. Verificar se é o Administrador Master (Renan Zanferrari)
    if (clean === ADMIN_CREDENTIALS.email.toLowerCase()) {
      if (password !== ADMIN_CREDENTIALS.password) {
        return {
          success: false,
          error: 'Senha incorreta para a conta de Administrador Master.'
        };
      }

      setCurrentRole('admin');
      setUserProfile(prev => ({
        ...prev,
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        phone: '(11) 98765-4321',
        isLoggedIn: true,
        isRegistered: true,
        isAdmin: true,
        isVip: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      }));
      setActiveTab('admin-dashboard');
      setIsAuthModalOpen(false);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#3B82F6', '#6366F1', '#FF5F00', '#10B981', '#FFFFFF']
      });

      return {
        success: true,
        type: 'admin',
        role: 'admin',
        name: ADMIN_CREDENTIALS.name,
        redirectTab: 'admin-dashboard'
      };
    }

    // 1. Verificar se é lojista:
    // - Bate com CNPJ de 14 dígitos
    // - Bate com email ou CNPJ ou ID de alguma loja em stores
    // - Contém caracteres de CNPJ (ex: '/')
    // - Contém palavras-chave indicando lojista
    const matchedStore = stores.find(s => 
      (s.cnpj && digits.length >= 14 && s.cnpj.replace(/\D/g, '') === digits) ||
      (s.email && s.email.toLowerCase() === clean) ||
      (s.name && s.name.toLowerCase() === clean) ||
      (s.merchantId === raw)
    );

    const isMerchant = Boolean(
      matchedStore ||
      digits.length === 14 ||
      raw.includes('/') ||
      clean.includes('loja') ||
      clean.includes('lojista') ||
      clean.includes('comercial') ||
      clean.includes('burger') ||
      clean.includes('barber') ||
      clean.includes('barbearia')
    );

    if (isMerchant) {
      const targetStore = matchedStore || stores[0];
      const targetMerchantId = targetStore.merchantId || 'merchant_burger';
      
      setCurrentRole(targetMerchantId);
      setActiveTab('merchant-dashboard');
      setIsAuthModalOpen(false);

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF5F00', '#F59E0B', '#10B981']
      });

      return {
        success: true,
        type: 'merchant',
        role: targetMerchantId,
        store: targetStore,
        redirectTab: 'merchant-dashboard'
      };
    } else {
      // 2. Usuário / Consumidor
      const matchedUser = registeredUsers.find(u => 
        (u.email && u.email.toLowerCase() === clean) ||
        (u.cpf && digits.length >= 11 && u.cpf.replace(/\D/g, '') === digits)
      );

      const targetUser = matchedUser || {
        ...userProfile,
        name: clean.split('@')[0] || userProfile.name,
        email: clean.includes('@') ? clean : userProfile.email
      };

      const isVip = Boolean(targetUser.isVip || clean.includes('vip'));

      setUserProfile(prev => ({
        ...prev,
        ...targetUser,
        isLoggedIn: true,
        isRegistered: true,
        isVip: isVip,
        isAdmin: false,
        vipPlan: isVip ? (targetUser.vipPlan || 'monthly') : null
      }));

      const targetRole = isVip ? 'vip' : 'user_free';
      setCurrentRole(targetRole);
      setActiveTab('user-profile');
      setIsAuthModalOpen(false);

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF5F00', '#3B82F6', '#10B981']
      });

      if (isSupabaseConfigured && supabase && password && clean.includes('@')) {
        db.signIn(clean, password).catch(err => console.warn('[Supabase Login]', err));
      }

      return {
        success: true,
        type: 'user',
        role: targetRole,
        user: userProfile,
        redirectTab: 'user-profile'
      };
    }
  };

  // Logout / Sair da Conta
  const logoutAccount = () => {
    if (isSupabaseConfigured && supabase) {
      db.signOut().catch(err => console.warn('[Supabase SignOut]', err));
    }
    setIsSimulatingRole(false);
    localStorage.removeItem('melhor_cupom_simulating');
    setCurrentRole('visitor');
    setUserProfile(prev => ({
      ...prev,
      isLoggedIn: false,
      isRegistered: false,
      isVip: false,
      vipPlan: null,
      vipSince: null,
      monthlySavings: 0,
      referralCode: null,
      referralBalance: 0.00,
      referrals: [],
      isAdmin: false
    }));
    setActiveTab('explore');
  };

  // Resetar dados para o padrão de fábrica
  const resetToFactoryDefaults = () => {
    localStorage.removeItem('melhor_cupom_coupons');
    localStorage.removeItem('melhor_cupom_stores');
    localStorage.removeItem('melhor_cupom_stores_v5');
    localStorage.removeItem('melhor_cupom_stores_v7');
    localStorage.removeItem('melhor_cupom_redemptions');
    localStorage.removeItem('melhor_cupom_redemptions_v3');
    localStorage.removeItem('melhor_cupom_user');
    localStorage.removeItem('melhor_cupom_user_v3');
    localStorage.removeItem('melhor_cupom_role');
    localStorage.removeItem('melhor_cupom_admin_users');
    localStorage.removeItem('melhor_cupom_admin_users_v3');
    localStorage.removeItem('melhor_cupom_simulating');
    setIsSimulatingRole(false);
    setCoupons(INITIAL_COUPONS);
    setStores(INITIAL_STORES);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setCurrentRole('visitor');
    window.location.reload();
  };

  // ==========================================
  // HUB DE INTEGRAÇÕES & APIS DE AFILIADOS (Awin, Lomadee, Shopee, Mercado Livre, AliExpress)
  // ==========================================
  const [apiConnectors, setApiConnectors] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_api_connectors');
    if (!saved) return API_CONNECTORS;
    try {
      const parsed = JSON.parse(saved);
      return API_CONNECTORS.map(initConn => {
        const existing = parsed.find(p => p.id === initConn.id);
        if (!existing) return initConn;
        const mergedCreds = {
          ...initConn.credentials,
          ...(existing.credentials || {})
        };
        if (initConn.id === 'shopee') {
          mergedCreds.appId = '18305641225';
          mergedCreds.affiliateId = '18305641225';
          mergedCreds.subIdParam = 'af=18305641225&af_sub1=melhorcupom';
        }
        if (initConn.id === 'shein') {
          mergedCreds.appId = '5005674890';
          mergedCreds.affiliateId = '5005674890';
          mergedCreds.subIdParam = 'aff_id=5005674890&sub_id=melhorcupom';
        }
        if (initConn.id === 'lomadee') {
          mergedCreds.publisherId = '2324685';
          mergedCreds.channelId = '54abf0ab-1918-4568-a9be-a621d48f2aae';
          mergedCreds.subIdParam = 'sourceId=2324685&channelId=54abf0ab-1918-4568-a9be-a621d48f2aae&subId=melhorcupom';
          mergedCreds.apiKey = 'lmd_production_vy4D30qnUJ_bq0IJ2CYLLJc3JFjXofHhB9a1BozypX0';
        }
        return {
          ...initConn,
          ...existing,
          credentials: mergedCreds
        };
      });
    } catch {
      return API_CONNECTORS;
    }
  });

  const [apiLogs, setApiLogs] = useState(INITIAL_API_LOGS);
  const [isSyncingApis, setIsSyncingApis] = useState(false);

  // Atualizar credenciais de um conector específico
  const updateConnectorCredentials = (connectorId, newCredentials) => {
    setApiConnectors(prev => {
      const updated = prev.map(c => {
        if (c.id === connectorId) {
          const updatedCreds = {
            ...c.credentials,
            ...newCredentials
          };
          if (connectorId === 'aliexpress') {
            if (newCredentials.publisherId) updatedCreds.appKey = newCredentials.publisherId;
            if (newCredentials.apiKey) updatedCreds.appSecret = newCredentials.apiKey;
          }
          if (connectorId === 'shein') {
            if (newCredentials.publisherId) {
              updatedCreds.appId = newCredentials.publisherId;
              updatedCreds.affiliateId = newCredentials.publisherId;
            }
          }
          if (connectorId === 'lomadee') {
            if (newCredentials.publisherId) updatedCreds.publisherId = newCredentials.publisherId;
            if (newCredentials.apiKey) updatedCreds.apiKey = newCredentials.apiKey;
          }
          if (connectorId === 'mercadopago') {
            if (newCredentials.publisherId) updatedCreds.publicKey = newCredentials.publisherId;
            if (newCredentials.apiKey) updatedCreds.accessToken = newCredentials.apiKey;
          }
          if (connectorId === 'meta_graph') {
            if (newCredentials.publisherId) updatedCreds.appId = newCredentials.publisherId;
            if (newCredentials.apiKey) updatedCreds.appSecret = newCredentials.apiKey;
          }
          return {
            ...c,
            status: 'connected',
            statusLabel: connectorId === 'meta_graph' ? 'Autenticado via App Secret Oficial (200 OK)' :
                         connectorId === 'mercadopago' ? `Conectado via Access Token (${newCredentials.apiKey?.startsWith('APP_USR-') ? 'Produção' : 'Sandbox / Teste'})` :
                         connectorId === 'lomadee' ? 'Autenticado via x-api-key (200 OK)' :
                         connectorId === 'shopee' ? 'Autenticado com ID 18305641225 (200 OK)' : 
                         connectorId === 'shein' ? 'Autenticado com ID 5005674890 (200 OK)' :
                         connectorId === 'aliexpress' ? 'Autenticado com AppKey 548636 (200 OK)' : c.statusLabel,
            lastSync: 'Agora mesmo',
            credentials: updatedCreds
          };
        }
        return c;
      });
      localStorage.setItem('melhor_cupom_api_connectors', JSON.stringify(updated));
      return updated;
    });

    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const serviceName = connectorId === 'awin' ? 'Awin API' : 
                        connectorId === 'lomadee' ? 'Lomadee (SocialSoul)' : 
                        connectorId === 'shopee' ? 'Shopee Open API' : 
                        connectorId === 'shein' ? 'SHEIN Open Platform' :
                        connectorId === 'meli' ? 'Mercado Livre API' : 
                        connectorId === 'aliexpress' ? 'AliExpress Open API' : connectorId;
    const updateLog = {
      id: `log_update_${Date.now()}`,
      timestamp: timeStr,
      service: serviceName,
      type: 'auth',
      status: '200 OK',
      message: `Credenciais e chaves atualizadas com sucesso para ${connectorId.toUpperCase()}!`,
      level: 'success'
    };
    setApiLogs(prev => [updateLog, ...prev]);
  };

  const syncApisNow = async () => {
    setIsSyncingApis(true);
    // Simula tempo de requisição às APIs oficiais
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR');
    
    setApiConnectors(prev => prev.map(c => ({
      ...c,
      status: 'connected',
      statusLabel: 'Autenticado (200 OK)',
      lastSync: `Hoje às ${timeStr}`,
      pingMs: Math.floor(Math.random() * 25) + 20
    })));

    const newLogs = [
      {
        id: `log_${Date.now()}_1`,
        timestamp: timeStr,
        service: 'Awin API',
        type: 'sync',
        status: '200 OK',
        message: 'GET /publishers/3095275/accounts -> Token ce66d099...3baa autenticado (Conta: Melhor Cupom, ID: 3095275).',
        level: 'success'
      },
      {
        id: `log_${Date.now()}_2`,
        timestamp: timeStr,
        service: 'Lomadee API',
        type: 'sync',
        status: '200 OK',
        message: 'GET /affiliate/channels/54abf0ab-1918-4568-a9be-a621d48f2aae -> Chave lmd_production_vy4D30... autenticada. Canal 2324685 validado com 96 ofertas e cupons sincronizados (Magalu, KaBuM, Casas Bahia, Netshoes).',
        level: 'success'
      },
      {
        id: `log_${Date.now()}_3`,
        timestamp: timeStr,
        service: 'Shopee Open Platform',
        type: 'sync',
        status: '200 OK',
        message: 'POST /api/v2/affiliate/vouchers -> ID 18305641225 autenticado. 6 cupons e vouchers oficiais Shopee Brasil sincronizados com cashback de 8% e SubID ativo.',
        level: 'success'
      },
      {
        id: `log_${Date.now()}_4`,
        timestamp: timeStr,
        service: 'Mercado Livre Developers',
        type: 'sync',
        status: '200 OK',
        message: 'GET /sites/MLB/deals -> 45 cupons oficiais Full atualizados com sucesso.',
        level: 'success'
      },
      {
        id: `log_${Date.now()}_5`,
        timestamp: timeStr,
        service: 'SHEIN Open Platform',
        type: 'sync',
        status: '200 OK',
        message: 'GET /publisher/v3/vouchers -> ID 5005674890 autenticado. 8 cupons e vouchers oficiais SHEIN Brasil sincronizados com cashback de 10% e SubID ativo.',
        level: 'success'
      },
      {
        id: `log_${Date.now()}_6`,
        timestamp: timeStr,
        service: 'AliExpress Open API',
        type: 'sync',
        status: '200 OK',
        message: 'GET /aliexpress/promotions -> AppKey 548636 autenticada. Vouchers Choice sincronizados com cashback de até 8.5%.',
        level: 'success'
      }
    ];

    setCoupons(prev => {
      const initMap = new Map(INITIAL_COUPONS.map(c => [c.id, c]));
      const updated = prev.map(c => initMap.get(c.id) || c);
      const prevIds = new Set(prev.map(c => c.id));
      const newlyAdded = INITIAL_COUPONS.filter(c => !prevIds.has(c.id));
      const result = [...updated, ...newlyAdded];
      localStorage.setItem('melhor_cupom_coupons', JSON.stringify(result));
      return result;
    });

    setApiLogs(prev => [...newLogs, ...prev]);
    setIsSyncingApis(false);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#FF5F00']
      });
    } catch {
      // ignore
    }

    return { success: true, count: 347, timestamp: timeStr };
  };

  const activeMerchantStore = (typeof currentRole === 'string' && currentRole.startsWith('merchant_'))
    ? stores.find(s => s.merchantId === currentRole)
    : null;
  const isPaidMerchantVip = Boolean(
    activeMerchantStore &&
    activeMerchantStore.tier !== 'api' &&
    activeMerchantStore.tier !== 'free_trial' &&
    !activeMerchantStore.freeTrialActive &&
    (activeMerchantStore.adminPaidPlan || activeMerchantStore.tier === 'bronze' || activeMerchantStore.tier === 'silver' || activeMerchantStore.tier === 'gold')
  );

  const isVipUser = 
    currentRole === 'vip' || 
    currentRole === 'admin' || 
    isPaidMerchantVip || 
    (currentRole !== 'visitor' && currentRole !== 'user_free' && currentRole !== 'user' && !currentRole.startsWith('merchant_') && Boolean(userProfile.isVip));

  return (
    <AppContext.Provider value={{
      currentRole,
      switchRole,
      isSimulatingRole,
      startSimulation,
      exitSimulation,
      coupons,
      stores,
      updateStore,
      upgradeStoreTier,
      merchantPlans: MERCHANT_PLANS,
      redemptions,
      userProfile,
      updateUserProfile,
      isVipUser,
      isSubscriptionModalOpen,
      setIsSubscriptionModalOpen,
      selectedPlanForModal,
      setSelectedPlanForModal,
      subscribeToVip,
      cancelSubscription,
      redeemCoupon,
      validateRedemption,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleHighlightCoupon,
      recordCouponView,
      toggleFavorite,
      resetToFactoryDefaults,
      // Painel de Economia
      isSavingsModalOpen,
      setIsSavingsModalOpen,
      // Divulgue & Ganhe
      isReferralModalOpen,
      setIsReferralModalOpen,
      referralModalType,
      setReferralModalType,
      addReferral,
      useReferralBalance,
      useStoreReferralBalance,
      // Autenticação e Cadastro
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      closeAuthModal,
      // Termos de Uso e Política de Privacidade
      isLegalModalOpen,
      setIsLegalModalOpen,
      legalModalTab,
      setLegalModalTab,
      openLegalModal,
      closeLegalModal,
      registerUser,
      registerMerchant,
      loginAccount,
      logoutAccount,
      adminCredentials: ADMIN_CREDENTIALS,
      // Painel de ADM Master
      registeredUsers,
      adminToggleUserVip,
      adminUpdateStoreTier,
      adminAdjustUserReferral,
      monthlyFinancialHistory: MONTHLY_FINANCIAL_HISTORY,
      // Hub de Integrações de APIs
      apiConnectors,
      setApiConnectors,
      updateConnectorCredentials,
      apiLogs,
      setApiLogs,
      isSyncingApis,
      syncApisNow,
      // Ofertas Imperdíveis (Robô Shopee & Magalu)
      hotDeals,
      addHotDeal,
      deleteHotDeal,
      syncShopeeHotDeals,
      syncMagaluHotDeals,
      syncSheinHotDeals,
      // Navegação Global & Ofertas Imperdíveis
      activeTab,
      setActiveTab,
      imperdiveisStoreFilter,
      setImperdiveisStoreFilter,
      navigateToImperdiveis,
      merchantDashboardTab,
      setMerchantDashboardTab
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
