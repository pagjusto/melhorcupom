import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COUPONS, INITIAL_STORES, CATEGORIES, SUBSCRIPTION_PLANS, MERCHANT_PLANS, INITIAL_REGISTERED_USERS, MONTHLY_FINANCIAL_HISTORY, ADMIN_CREDENTIALS } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Aba Ativa Global da Aplicação ('explore' | 'stores' | 'how-it-works' | 'merchant-dashboard' | 'my-coupons' | 'user-profile')
  const [activeTab, setActiveTab] = useState('explore');

  // Aba Interna do Painel do Lojista ('coupons' | 'validator' | 'new-coupon' | 'settings' | 'plans' | 'referrals')
  const [merchantDashboardTab, setMerchantDashboardTab] = useState('coupons');

  // Estado de Perfil Atual (Role)
  // 'visitor' | 'vip' | 'merchant_burger' | 'merchant_barber' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('melhor_cupom_role') || 'visitor';
  });

  // Estado de Cupons (com persistência no LocalStorage)
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_coupons');
    if (!saved) return INITIAL_COUPONS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(c => {
        const init = INITIAL_COUPONS.find(i => i.id === c.id);
        return {
          ...c,
          banner: c.banner || init?.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
          viewsCount: typeof c.viewsCount === 'number' ? c.viewsCount : (init?.viewsCount || Math.max(140, (c.usesCount || 8) * 11 + 35))
        };
      });
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // Estado de Lojas / Comerciantes
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_stores');
    if (!saved) return INITIAL_STORES;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(s => {
        const init = INITIAL_STORES.find(i => i.id === s.id);
        const storeRefCode = s.referralCode || init?.referralCode || (s.name ? s.name.substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '') + '5' : 'LOJA5');
        return {
          ...s,
          logoImage: s.logoImage || init?.logoImage || '',
          tier: s.tier || init?.tier || 'free',
          phone: s.phone || init?.phone || '(11) 98123-4567',
          address: s.address || init?.address || '',
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

  // Estado de Usuários Cadastrados no Sistema (Painel de ADM)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_admin_users');
    if (!saved) return INITIAL_REGISTERED_USERS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // Histórico de Resgates no Sistema (para validação do Lojista e Extrato do Usuário)
  const [redemptions, setRedemptions] = useState(() => {
    const SAMPLE_INITIAL_REDEMPTIONS = [
      // 1 pendente para teste no balcão do Smash Burger (Caixa / PDV)
      {
        id: 'red_sample_1',
        code: 'VIP-MELHOR-8491',
        passCode: '849201',
        qrPayload: JSON.stringify({ code: 'VIP-MELHOR-8491', passCode: '849201', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Lucas Silva',
        userCpf: '382.***.***-04',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'valid', // 'valid' | 'used' | 'expired'
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
      // Resgates efetivamente validados no balcão por QR Code ou Senha de 6 dígitos no Smash Burger
      {
        id: 'red_smash_used_1',
        code: 'VIP-SMASH50-1092',
        passCode: '109284',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-1092', passCode: '109284', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Mariana Souza',
        userCpf: '419.***.***-12',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'red_smash_used_2',
        code: 'VIP-SMASH50-3341',
        passCode: '334190',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-3341', passCode: '334190', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Carlos Eduardo',
        userCpf: '284.***.***-55',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(),
      },
      {
        id: 'red_smash_used_3',
        code: 'VIP-SMASH50-7819',
        passCode: '781923',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-7819', passCode: '781923', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Fernanda Lima',
        userCpf: '501.***.***-89',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      },
      {
        id: 'red_smash_used_4',
        code: 'VIP-SMASH50-9924',
        passCode: '992410',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-9924', passCode: '992410', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Rodrigo Alves',
        userCpf: '193.***.***-70',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 3 + 2400000).toISOString(),
      },
      {
        id: 'red_smash_used_5',
        code: 'VIP-SMASH50-5120',
        passCode: '512066',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-5120', passCode: '512066', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Juliana Rocha',
        userCpf: '328.***.***-34',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
      },
      {
        id: 'red_smash_used_6',
        code: 'VIP-SMASH50-6432',
        passCode: '643217',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-6432', passCode: '643217', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Thiago Martins',
        userCpf: '782.***.***-41',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 5 + 4800000).toISOString(),
      },
      {
        id: 'red_smash_used_7',
        code: 'VIP-SMASH50-8114',
        passCode: '811452',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-8114', passCode: '811452', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Patrícia Mendes',
        userCpf: '649.***.***-98',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 6 + 3600000).toISOString(),
      },
      {
        id: 'red_smash_used_8',
        code: 'VIP-SMASH50-2490',
        passCode: '249073',
        qrPayload: JSON.stringify({ code: 'VIP-SMASH50-2490', passCode: '249073', couponId: 'cupom_1', merchantId: 'merchant_burger' }),
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        category: 'gastronomia',
        userName: 'Rafael Costa',
        userCpf: '115.***.***-63',
        discountBadge: '50% OFF',
        originalPrice: 65.00,
        promoPrice: 32.50,
        savings: 32.50,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 7 + 1800000).toISOString(),
      },
      // Barbearia Don Corleone (usado no balcão)
      {
        id: 'red_sample_2',
        code: 'VIP-MELHOR-3129',
        passCode: '312940',
        qrPayload: JSON.stringify({ code: 'VIP-MELHOR-3129', passCode: '312940', couponId: 'cupom_2', merchantId: 'merchant_barber' }),
        couponId: 'cupom_2',
        couponTitle: '40% OFF no Combo Corte + Barboterapia',
        merchantId: 'merchant_barber',
        storeName: 'Barbearia Don Corleone',
        category: 'beleza',
        userName: 'Lucas Silva',
        userCpf: '382.***.***-04',
        discountBadge: '40% OFF',
        originalPrice: 110.00,
        promoPrice: 65.00,
        savings: 45.00,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      // Lojas online (cupons utilizados)
      {
        id: 'red_online_1',
        code: 'VIP-SNEAKER-5192',
        passCode: '519240',
        qrPayload: JSON.stringify({ code: 'VIP-SNEAKER-5192', passCode: '519240', couponId: 'cupom_5', merchantId: 'merchant_sneaker' }),
        couponId: 'cupom_5',
        couponTitle: 'R$ 150 OFF em Tênis Importados (Mínimo R$ 400)',
        merchantId: 'merchant_sneaker',
        storeName: 'Sneaker Lab Brasil',
        category: 'moda',
        userName: 'Camila Nogueira',
        userCpf: '712.***.***-05',
        discountBadge: 'R$ 150 OFF',
        originalPrice: 550.00,
        promoPrice: 400.00,
        savings: 150.00,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
      },
      {
        id: 'red_online_2',
        code: 'VIP-SNEAKER-8841',
        passCode: '884102',
        qrPayload: JSON.stringify({ code: 'VIP-SNEAKER-8841', passCode: '884102', couponId: 'cupom_5', merchantId: 'merchant_sneaker' }),
        couponId: 'cupom_5',
        couponTitle: 'R$ 150 OFF em Tênis Importados (Mínimo R$ 400)',
        merchantId: 'merchant_sneaker',
        storeName: 'Sneaker Lab Brasil',
        category: 'moda',
        userName: 'Felipe Miranda',
        userCpf: '531.***.***-87',
        discountBadge: 'R$ 150 OFF',
        originalPrice: 550.00,
        promoPrice: 400.00,
        savings: 150.00,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
      },
      // Outras lojas físicas parceiras
      {
        id: 'red_sample_3',
        code: 'VIP-MELHOR-5542',
        passCode: '554289',
        qrPayload: JSON.stringify({ code: 'VIP-MELHOR-5542', passCode: '554289', couponId: 'cupom_3', merchantId: 'merchant_trattoria' }),
        couponId: 'cupom_3',
        couponTitle: 'Compre 1 Pizza Grande e Ganhe Outra',
        merchantId: 'merchant_trattoria',
        storeName: 'Bella Napoli Trattoria',
        category: 'gastronomia',
        userName: 'Lucas Silva',
        userCpf: '382.***.***-04',
        discountBadge: 'Compre 1 Leve 2',
        originalPrice: 85.00,
        promoPrice: 0.00,
        savings: 85.00,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      },
      {
        id: 'red_sample_4',
        code: 'VIP-MELHOR-7721',
        passCode: '772153',
        qrPayload: JSON.stringify({ code: 'VIP-MELHOR-7721', passCode: '772153', couponId: 'cupom_4', merchantId: 'merchant_iron' }),
        couponId: 'cupom_4',
        couponTitle: 'Mensalidade com 50% de Desconto nos 2 Primeiros Meses',
        merchantId: 'merchant_iron',
        storeName: 'Iron Fitness Centro de Treinamento',
        category: 'fitness',
        userName: 'Lucas Silva',
        userCpf: '382.***.***-04',
        discountBadge: '50% OFF',
        originalPrice: 180.00,
        promoPrice: 90.00,
        savings: 90.00,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
      },
      {
        id: 'red_sample_5',
        code: 'VIP-MELHOR-9912',
        passCode: '991247',
        qrPayload: JSON.stringify({ code: 'VIP-MELHOR-9912', passCode: '991247', couponId: 'cupom_7', merchantId: 'merchant_escape' }),
        couponId: 'cupom_7',
        couponTitle: 'Entrada para 4 Pessoas com 40% OFF',
        merchantId: 'merchant_escape',
        storeName: 'Escape 60 & Jogos Imersivos',
        category: 'lazer',
        userName: 'Lucas Silva',
        userCpf: '382.***.***-04',
        discountBadge: '40% OFF',
        originalPrice: 225.00,
        promoPrice: 135.00,
        savings: 90.00,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 86400000 * 6 + 10800000).toISOString(),
      }
    ];

    const saved = localStorage.getItem('melhor_cupom_redemptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const burgerUsed = parsed.filter(r => r.merchantId === 'merchant_burger' && r.status === 'used');
        if (burgerUsed.length === 0) {
          const burgerItems = SAMPLE_INITIAL_REDEMPTIONS.filter(r => r.merchantId === 'merchant_burger' && r.status === 'used');
          return [...burgerItems, ...parsed];
        }
        return parsed;
      } catch (e) {
        return SAMPLE_INITIAL_REDEMPTIONS;
      }
    }
    return SAMPLE_INITIAL_REDEMPTIONS;
  });

  // Perfil do Usuário com Carteira / Saldo de Divulgue & Ganhe
  const [userProfile, setUserProfile] = useState(() => {
    const defaultUser = {
      name: 'Lucas Silva',
      email: 'lucas.vip@email.com',
      phone: '(11) 98452-1920',
      cpf: '382.***.***-04',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      city: 'São Paulo - SP',
      favoriteCategories: ['gastronomia', 'beleza', 'lazer'],
      notifications: { email: true, whatsapp: true, newDeals: true, expiringSoon: true },
      isVip: false,
      vipPlan: null, // 'monthly' | 'annual'
      vipSince: null,
      monthlySavings: 0,
      savedCouponIds: ['cupom_1', 'cupom_5'],
      referralCode: 'LUCAS5',
      referralBalance: 0.00, // Começa zerado para visitantes e novos usuários
      referrals: []
    };
    const saved = localStorage.getItem('melhor_cupom_user');
    if (!saved) return defaultUser;
    try {
      const parsed = JSON.parse(saved);
      // Se continha o saldo simulado antigo de 15.00 da versão anterior, zerar para visitante
      const isLegacySample = parsed.referralBalance === 15.00 && parsed.referrals?.length === 3;
      return {
        ...defaultUser,
        ...parsed,
        referralCode: parsed.referralCode || 'LUCAS5',
        referralBalance: isLegacySample ? 0.00 : (typeof parsed.referralBalance === 'number' ? parsed.referralBalance : 0.00),
        referrals: isLegacySample ? [] : (parsed.referrals || [])
      };
    } catch {
      return defaultUser;
    }
  });

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

  // Salvar no LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('melhor_cupom_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('melhor_cupom_admin_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sincronizar o estado de VIP quando o perfil rápido é alterado
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') {
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
    
    // Gera código único ex: VIP-SMASH50-8472
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
      userCpf: userProfile.cpf || '382.***.***-04',
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

    setCurrentRole('visitor');
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

  // Cadastrar Novo Lojista / Franquia (com Nome, CNPJ, CEP, Cidades Franquia, Email, WhatsApp, Senha)
  const registerMerchant = (merchantData) => {
    const { name, legalName, cnpj, cep, cities, email, phone, category } = merchantData;
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
      address: `${selectedCities[0] || 'Brasil'}`,
      hours: 'Seg a Sáb: 10h às 22h',
      tier: 'free',
      referralCode: storeRefCode,
      referralBalance: 0.00,
      referrals: [],
      rating: 5.0,
      reviewsCount: 1,
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
      const matchedUser = (userProfile.email?.toLowerCase() === clean || (userProfile.cpf && userProfile.cpf.replace(/\D/g, '') === digits));

      setUserProfile(prev => ({
        ...prev,
        isLoggedIn: true
      }));

      const targetRole = userProfile.isVip ? 'vip' : 'visitor';
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
    setCurrentRole('visitor');
    setUserProfile(prev => ({
      ...prev,
      isLoggedIn: false,
      isAdmin: false
    }));
    setActiveTab('explore');
  };

  // Resetar dados para o padrão de fábrica
  const resetToFactoryDefaults = () => {
    localStorage.removeItem('melhor_cupom_coupons');
    localStorage.removeItem('melhor_cupom_stores');
    localStorage.removeItem('melhor_cupom_redemptions');
    localStorage.removeItem('melhor_cupom_user');
    localStorage.removeItem('melhor_cupom_role');
    localStorage.removeItem('melhor_cupom_admin_users');
    setCoupons(INITIAL_COUPONS);
    setStores(INITIAL_STORES);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setCurrentRole('visitor');
    window.location.reload();
  };

  const isVipUser = currentRole === 'vip' || (currentRole !== 'visitor' && currentRole !== 'user_free' && currentRole !== 'user' && Boolean(userProfile.isVip));

  return (
    <AppContext.Provider value={{
      currentRole,
      switchRole,
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
