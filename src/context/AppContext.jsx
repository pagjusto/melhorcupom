import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COUPONS, INITIAL_STORES, CATEGORIES, SUBSCRIPTION_PLANS, MERCHANT_PLANS } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Aba Ativa Global da Aplicação ('explore' | 'stores' | 'how-it-works' | 'merchant-dashboard' | 'my-coupons' | 'user-profile')
  const [activeTab, setActiveTab] = useState('explore');

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
          banner: c.banner || init?.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80'
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

  // Histórico de Resgates no Sistema (para validação do Lojista)
  const [redemptions, setRedemptions] = useState(() => {
    const saved = localStorage.getItem('melhor_cupom_redemptions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'red_sample_1',
        code: 'VIP-MELHOR-8491',
        couponId: 'cupom_1',
        couponTitle: '50% OFF no 2º Combo Burger Especial',
        merchantId: 'merchant_burger',
        storeName: 'Smash Burger Club',
        userName: 'Lucas Silva',
        discountBadge: '50% OFF',
        savings: 28.00,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'valid', // 'valid' | 'used' | 'expired'
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: 'red_sample_2',
        code: 'VIP-MELHOR-3129',
        couponId: 'cupom_2',
        couponTitle: '40% OFF no Combo Corte + Barboterapia',
        merchantId: 'merchant_barber',
        storeName: 'Barbearia Don Corleone',
        userName: 'Lucas Silva',
        discountBadge: '40% OFF',
        savings: 45.00,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'used',
        usedAt: new Date(Date.now() - 1800000).toISOString(),
      }
    ];
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

  // Sincronizar o estado de VIP quando o perfil rápido é alterado
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'vip') {
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

    // Cálculo assertivo da economia real baseada em (originalPrice - promoPrice) ou estimatedSavings
    const effectiveSavings = (coupon.originalPrice && coupon.promoPrice && Number(coupon.originalPrice) > Number(coupon.promoPrice))
      ? Number((Number(coupon.originalPrice) - Number(coupon.promoPrice)).toFixed(2))
      : (Number(coupon.estimatedSavings) || 20.00);

    const newRedemption = {
      id: `red_${Date.now()}`,
      code: generatedCode,
      couponId: coupon.id,
      couponTitle: coupon.title,
      merchantId: coupon.merchantId,
      storeName: store ? store.name : 'Loja Parceira',
      userName: userProfile.name,
      userCpf: userProfile.cpf || '382.***.***-04',
      maxUsesPerUser: coupon.maxUsesPerUser,
      discountBadge: coupon.discountBadge,
      originalPrice: coupon.originalPrice,
      promoPrice: coupon.promoPrice,
      savings: effectiveSavings,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutos de tolerância para uso no caixa
      status: 'valid'
    };

    setRedemptions(prev => [newRedemption, ...prev]);

    // Atualizar contagem de usos do cupom
    setCoupons(prev => prev.map(c => {
      if (c.id === coupon.id) {
        return { ...c, usesCount: (c.usesCount || 0) + 1 };
      }
      return c;
    }));

    // Incrementar economia do usuário com valor assertivo
    setUserProfile(prev => ({
      ...prev,
      monthlySavings: Number((prev.monthlySavings + effectiveSavings).toFixed(2))
    }));

    // Celebrar resgate
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#FF5F00', '#10B981']
    });

    return newRedemption;
  };

  // Validar Cupom (Usado pelo Lojista no Balcão)
  const validateRedemption = (code, merchantId) => {
    const cleanCode = code.trim().toUpperCase();
    const found = redemptions.find(r => r.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Código de cupom não encontrado no sistema.' };
    }

    if (found.status === 'used') {
      return { 
        success: false, 
        message: `Este cupom já foi utilizado e baixado em ${new Date(found.usedAt).toLocaleTimeString('pt-BR')}.` 
      };
    }

    if (found.status === 'expired') {
      return { success: false, message: 'Este cupom expirou antes de ser validado.' };
    }

    // Verificar se pertence ao lojista atual (ou se é admin/modo teste)
    if (merchantId && found.merchantId !== merchantId) {
      return { 
        success: false, 
        message: `Atenção: Este cupom pertence ao parceiro "${found.storeName}". Não é válido para este estabelecimento.` 
      };
    }

    // Atualizar status para 'used'
    const now = new Date().toISOString();
    setRedemptions(prev => prev.map(r => {
      if (r.id === found.id) {
        return { ...r, status: 'used', usedAt: now };
      }
      return r;
    }));

    const cpfDisplay = found.userCpf ? ` (CPF: ${found.userCpf})` : '';
    const limitInfo = found.maxUsesPerUser === 1
      ? ' • Limite: 1 por CPF'
      : found.maxUsesPerUser > 1
      ? ` • Limite: até ${found.maxUsesPerUser} por CPF`
      : ' • Limite: Ilimitado por CPF';

    return { 
      success: true, 
      redemption: { ...found, status: 'used', usedAt: now },
      message: `Cupom validado com sucesso! Aplique o desconto de "${found.discountBadge}" para ${found.userName}${cpfDisplay}${limitInfo}.`
    };
  };

  // Adicionar Novo Cupom (Criado pelo Lojista)
  const addCoupon = (couponData) => {
    const newCoupon = {
      id: `cupom_${Date.now()}`,
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

  // Login Unificado (identifica automaticamente se é Lojista ou Usuário e redireciona à devida página)
  const loginAccount = (identifier = '', password = '') => {
    const raw = (identifier || '').trim();
    const clean = raw.toLowerCase();
    const digits = raw.replace(/\D/g, '');

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
      isLoggedIn: false
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
    setCoupons(INITIAL_COUPONS);
    setStores(INITIAL_STORES);
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
      toggleFavorite,
      resetToFactoryDefaults,
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
      // Navegação Global
      activeTab,
      setActiveTab
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
