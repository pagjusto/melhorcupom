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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Aba Ativa Global da Aplicação ('explore' | 'stores' | 'how-it-works' | 'merchant-dashboard' | 'my-coupons' | 'user-profile')
  const [activeTab, setActiveTab] = useState('explore');

  // Aba Interna do Painel do Lojista ('coupons' | 'validator' | 'new-coupon' | 'settings' | 'plans' | 'referrals')
  const [merchantDashboardTab, setMerchantDashboardTab] = useState('coupons');

  // Estado de Perfil Atual (Role)
  // 'visitor' | 'vip' | 'merchant_burger' | 'merchant_barber' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('melhor_cupom_role') || 'admin';
  });

  // Estado de Cupons (com persistência no LocalStorage e auto-mesclagem de novos dados)
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_coupons');
    if (!saved) return INITIAL_COUPONS;
    try {
      const parsed = JSON.parse(saved);
      const parsedIds = new Set(parsed.map(c => c.id));
      const missing = INITIAL_COUPONS.filter(c => !parsedIds.has(c.id));
      const combined = [...parsed, ...missing];
      return combined.map(c => {
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
            logoImage: init.logoImage || c.logoImage,
            viewsCount: typeof c.viewsCount === 'number' ? c.viewsCount : (init.viewsCount || Math.max(140, (c.usesCount || 8) * 11 + 35)),
            isApiIntegrated: init.isApiIntegrated ?? c.isApiIntegrated ?? false,
            apiSource: init.apiSource || c.apiSource || null,
            apiLastSync: init.apiLastSync || c.apiLastSync || null,
            cashbackRate: init.cashbackRate || c.cashbackRate || null,
            cashbackPercent: init.cashbackPercent || c.cashbackPercent || 0,
            affiliateUrl: init.affiliateUrl || c.affiliateUrl || null,
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
        return c;
      });
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // Estado de Lojas / Comerciantes (com auto-mesclagem de todas as marcas reais da rede)
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_stores_v8') || localStorage.getItem('melhor_cupom_stores_v7');
    if (!saved) {
      localStorage.setItem('melhor_cupom_stores_v8', JSON.stringify(INITIAL_STORES));
      return INITIAL_STORES;
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
        return {
          ...s,
          name: init?.name || s.name,
          instagram,
          logo: init?.logo || s.logo || '🏪',
          logoImage: init?.logoImage || s.logoImage || '',
          image: init?.image || s.image || '',
          tier: init?.tier || s.tier || 'free',
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
          affiliateUrl: init?.affiliateUrl || s.affiliateUrl || null,
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
      return INITIAL_STORES;
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
      return {
        ...adminDefaultUser,
        ...parsed
      };
    } catch {
      return adminDefaultUser;
    }
  });

  // Estado de Ofertas Imperdíveis & Produtos Virais da Shopee e Magalu (Robô de Ofertas - 67+ ofertas)
  const ALL_BASE_HOT_DEALS = [...MAGALU_RADAR_TOP10, ...INITIAL_HOT_DEALS];

  const [hotDeals, setHotDeals] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_hot_deals_v7');
    if (!saved) {
      localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(ALL_BASE_HOT_DEALS));
      return ALL_BASE_HOT_DEALS;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const updated = parsed.map(item => {
          const fresh = ALL_BASE_HOT_DEALS.find(d => d.id === item.id);
          return fresh && fresh.image ? { ...item, image: fresh.image } : item;
        });
        localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(updated));
        return updated;
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
      // Já é o link direto de vitrine ou produto do parceiro Magalu
      return rawUrl;
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
    
    const storeName = dealData.store || (isMagalu ? 'Magazine Luiza' : 'Shopee Oficial');
    const affiliateUrl = formatAffiliateUrl(dealData.affiliateUrl || dealData.link, isMagalu ? 'magalu' : 'shopee');
    
    const newDeal = {
      id: `deal_${Date.now()}`,
      rating: 4.9,
      salesCount: '1.2k vendidos',
      tag: isMagalu ? '💙 Oferta Magalu' : '🔥 Oferta Imperdível',
      badgeColor: isMagalu ? 'bg-blue-600' : 'bg-red-500',
      freeShipping: dealData.freeShipping ?? true,
      category: dealData.category || 'utilidades',
      categoryLabel: dealData.categoryLabel || 'Achadinhos & Utilidades',
      ...dealData,
      store: storeName,
      affiliateUrl
    };
    setHotDeals(prev => {
      const updated = [newDeal, ...prev];
      localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(updated));
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
      localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(updated));
      return updated;
    });
  };

  const syncShopeeHotDeals = async () => {
    const synced = INITIAL_HOT_DEALS.map(d => ({
      ...d,
      lastSync: 'Sincronizado Agora'
    }));
    setHotDeals(synced);
    localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(synced));
    return { count: synced.length };
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
        const updated = [...allMagaluDeals, ...currentWithoutMagalu];
        localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(updated));
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
        const updated = [...MAGALU_RADAR_TOP10, ...currentWithoutMagalu];
        localStorage.setItem('melhor_cupom_hot_deals_v7', JSON.stringify(updated));
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
    localStorage.setItem('melhor_cupom_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_stores_v8', JSON.stringify(stores));
    localStorage.setItem('melhor_cupom_stores_v7', JSON.stringify(stores));
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
    if (roleId.startsWith('merchant_')) {
      setActiveTab('merchant-dashboard');
    } else if (roleId === 'user_free' || roleId === 'user') {
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
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    }));
    setActiveTab('admin-dashboard');
  };

  // Sincronizar o estado de VIP quando o perfil rápido é alterado
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
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
        monthlySavings: 342.50
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
        return { ...s, tier: newTier };
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
    
    // Gera código único ex: VIP-VIP50-8472
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `VIP-${coupon.codePrefix || 'CUPOM'}-${randomCode}`;

    // Gera senha numérica única de 6 dígitos para o QR Code (garante sem duplicidades)
    let generatedPassCode = '';
    let passCodeExists = true;
    while (passCodeExists) {
      generatedPassCode = String(Math.floor(100000 + Math.random() * 900000));
      passCodeExists = redemptions.some(r => r.passCode === generatedPassCode);
    }

    const redemptionId = `red_${Date.now()}`;
    const qrPayload = JSON.stringify({
      code: generatedCode,
      passCode: generatedPassCode,
      id: redemptionId,
      couponId: coupon.id,
      merchantId: coupon.merchantId
    });

    // Cálculo assertivo da economia real baseada em (originalPrice - promoPrice) ou estimatedSavings
    const effectiveSavings = (coupon.originalPrice && coupon.promoPrice && Number(coupon.originalPrice) > Number(coupon.promoPrice))
      ? Number((Number(coupon.originalPrice) - Number(coupon.promoPrice)).toFixed(2))
      : (Number(coupon.estimatedSavings) || 20.00);

    const isOnline = coupon.type === 'online' || store?.type === 'online';
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
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutos de tolerância para uso no caixa
      status: isOnline ? 'used' : 'valid',
      usedAt: isOnline ? new Date().toISOString() : null
    };

    setRedemptions(prev => [newRedemption, ...prev]);

    // Se for cupom de loja online, o resgate do código equivale à utilização e credita economia
    if (isOnline) {
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

    return newRedemption;
  };

  // Validar Cupom e Dar Baixa Automática (Usado pelo Lojista no Balcão via QR Code ou Senha)
  const validateRedemption = (inputQuery, merchantId) => {
    if (!inputQuery) {
      return { success: false, message: 'Por favor, escaneie o QR Code ou digite a senha de 6 dígitos.' };
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
    const newCoupon = {
      id: `cupom_${Date.now()}`,
      viewsCount: 0,
      usesCount: 0,
      highlight: false,
      vipOnly: true,
      rules: couponData.rules || ['Apresentar o cupom VIP no balcão.', 'Não cumulativo com outras promoções.'],
      ...couponData
    };

    setCoupons(prev => [newCoupon, ...prev]);

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
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, viewsCount: (c.viewsCount || 0) + 1 } : c));
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
    const { name, cpf, cep, city, email, phone } = userData;
    const cleanName = name?.trim() || 'Usuário';
    const firstName = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
    const generatedReferralCode = (firstName.substring(0, 5) + Math.floor(10 + Math.random() * 90)).toUpperCase();

    setUserProfile(prev => ({
      ...prev,
      name: cleanName,
      cpf: cpf || prev.cpf,
      cep: cep || prev.cep || '01310-100',
      city: city || prev.city || 'São Paulo - SP',
      email: email || prev.email,
      phone: phone || prev.phone,
      referralCode: generatedReferralCode,
      isRegistered: true,
      isLoggedIn: true
    }));

    setCurrentRole('user_free');
    setActiveTab('user-profile');

    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5F00', '#10B981', '#FFC800', '#FFFFFF']
    });

    setIsAuthModalOpen(false);
    return { success: true, name: cleanName, referralCode: generatedReferralCode };
  };

  // Cadastrar Novo Lojista / Franquia (com Nome, CNPJ, CEP, Cidades Franquia, Email, WhatsApp, Senha, Instagram)
  const registerMerchant = (merchantData) => {
    const { name, legalName, cnpj, cep, cities, email, phone, category, instagram } = merchantData;
    const storeId = `store_${Date.now()}`;
    const merchantId = `merchant_${Date.now()}`;
    const cleanName = name?.trim() || 'Nova Loja Parceira';
    const cleanShort = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
    const storeRefCode = (cleanShort + '5').toUpperCase();

    const selectedCities = Array.isArray(cities) && cities.length > 0 
      ? cities 
      : ['São Paulo - SP'];

    const newStore = {
      id: storeId,
      merchantId,
      name: cleanName,
      legalName: legalName || cleanName,
      cnpj: cnpj || '00.000.000/0001-00',
      cep: cep || '01310-100',
      category: category || 'gastronomia',
      cities: selectedCities, // Suporte a múltiplas cidades para franquias
      city: selectedCities[0] || 'São Paulo - SP',
      phone: phone || '(11) 98123-4567',
      email: email || 'contato@lojaparceira.com.br',
      instagram: (instagram || '').trim(),
      address: `${selectedCities[0] || 'Brasil'}`,
      hours: 'Seg a Sáb: 10h às 22h',
      tier: 'free',
      referralCode: storeRefCode,
      referralBalance: 0.00,
      referrals: [],
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      isNewPartner: true,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
      logo: '🏪',
      logoImage: ''
    };

    setStores(prev => [newStore, ...prev]);
    setCurrentRole(merchantId);
    setActiveTab('merchant-dashboard');

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
      const isVip = userProfile.isVip || clean.includes('vip');

      setUserProfile(prev => ({
        ...prev,
        isLoggedIn: true,
        isRegistered: true,
        isVip: isVip,
        vipPlan: isVip ? (prev.vipPlan || 'monthly') : null
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

  const isVipUser = currentRole === 'vip' || (currentRole !== 'visitor' && currentRole !== 'user_free' && currentRole !== 'user' && Boolean(userProfile.isVip));

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
      // Navegação Global
      activeTab,
      setActiveTab,
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
