import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockData';
import { 
  X, 
  User, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Building2, 
  ShieldCheck, 
  Shield,
  Plus, 
  AlertCircle,
  ArrowRight,
  LogIn,
  Check,
  Globe,
  Tag,
  Percent,
  RefreshCw,
  Upload,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Trash2,
  ZoomIn,
  Star,
  Image as ImageIcon
} from 'lucide-react';

import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { validateStoreSafety, validateUserSafety } from '../utils/contentModeration';
import { ImageFramingModal } from './ImageFramingModal';
import { notifyPartnerRegistration } from '../utils/partnerNotification';
import { PartnerWelcomeModal } from './PartnerWelcomeModal';

const BANNER_PRESETS = [
  { name: 'Burger Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80' },
  { name: 'Chopp & Petiscos', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&auto=format&fit=crop&q=80' },
  { name: 'Corte & Barba', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&auto=format&fit=crop&q=80' },
  { name: 'Pizza Italiana', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=700&auto=format&fit=crop&q=80' },
  { name: 'Steak & Carnes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80' },
  { name: 'Crossfit & Fitness', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80' },
  { name: 'Moda & Sneakers', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80' }
];

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    registerUser,
    registerMerchant,
    loginAccount,
    setActiveTab,
    openLegalModal,
    addCoupon
  } = useApp();

  // Formulário Usuário
  const [userForm, setUserForm] = useState({
    name: '',
    cpf: '',
    cep: '',
    city: '',
    email: '',
    phone: '',
    password: ''
  });

  // Formulário Lojista / Franquia
  const [merchantForm, setMerchantForm] = useState({
    name: '',
    legalName: '',
    cnpj: '',
    cep: '',
    storeType: 'physical', // 'physical' | 'online'
    isOnline: false,
    cities: ['São Paulo - SP'],
    email: '',
    phone: '',
    instagram: '',
    category: 'gastronomia',
    logoImage: '',
    password: ''
  });

  // Modal de Boas-Vindas & Entrega de Acesso / Arte Oficial para Parceiros
  const [partnerWelcomeData, setPartnerWelcomeData] = useState(null);
  const [isNotifyingPartner, setIsNotifyingPartner] = useState(false);

  // Modal de Ajuste de Zoom & Enquadramento Interativo para Logo e Capa
  const [framingModalState, setFramingModalState] = useState({
    isOpen: false,
    imageSrc: '',
    targetType: 'banner' // 'banner' | 'logo'
  });

  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Primeiro Cupom Opcional no Próprio Cadastro
  const [includeCoupon, setIncludeCoupon] = useState(true);
  const [couponForm, setCouponForm] = useState({
    title: '',
    category: 'gastronomia',
    description: '',
    originalPrice: '',
    promoPrice: '',
    discountBadge: '30% OFF',
    discountType: 'percentage',
    type: 'physical', // 'physical' | 'online'
    banner: BANNER_PRESETS[0].url,
    logoImage: '',
    code: '',
    limitType: 'one', // 'one' | 'custom' | 'unlimited'
    customMaxUses: 2,
    validityType: 'days', // 'days' | 'unlimited'
    validityDays: 30,
    affiliateUrl: '',
    rules: 'Apresentar o cupom VIP no balcão.\nNão cumulativo com outras promoções.\nVálido para consumo no local.'
  });

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFramingModalState({
          isOpen: true,
          imageSrc: reader.result,
          targetType: 'banner'
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFramingModalState({
          isOpen: true,
          imageSrc: reader.result,
          targetType: 'logo'
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleFramingConfirm = (framedDataUrl) => {
    if (framingModalState.targetType === 'logo') {
      setMerchantForm(prev => ({ ...prev, logoImage: framedDataUrl }));
      setCouponForm(prev => ({ ...prev, logoImage: framedDataUrl }));
    } else {
      setCouponForm(prev => ({ ...prev, banner: framedDataUrl }));
    }
    setFramingModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleCouponPriceChange = (field, val) => {
    const updated = { ...couponForm, [field]: val };
    const orig = parseFloat((field === 'originalPrice' ? val : updated.originalPrice).replace(',', '.'));
    const promo = parseFloat((field === 'promoPrice' ? val : updated.promoPrice).replace(',', '.'));
    if (!isNaN(orig) && !isNaN(promo) && orig > promo && orig > 0) {
      const pct = Math.round(((orig - promo) / orig) * 100);
      updated.discountBadge = `${pct}% OFF`;
    }
    setCouponForm(updated);
  };

  const handleGenerateCouponCode = () => {
    const prefix = (merchantForm.name || couponForm.title || 'CUPOM')
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 5) || 'PROMO';
    const num = Math.floor(10 + Math.random() * 90);
    setCouponForm(prev => ({ ...prev, code: `${prefix}${num}` }));
  };

  // Formulário Login Único (sem seletor de usuário ou lojista)
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  const [customCityInput, setCustomCityInput] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Exibir Modal de Boas-Vindas com Arte e Acesso via WhatsApp se parceiro acabou de cadastrar
  if (partnerWelcomeData) {
    return (
      <PartnerWelcomeModal
        data={partnerWelcomeData}
        onClose={() => {
          setPartnerWelcomeData(null);
          closeAuthModal();
          if (setActiveTab) setActiveTab('merchant-dashboard');
        }}
        onGoToDashboard={() => {
          setPartnerWelcomeData(null);
          closeAuthModal();
          if (setActiveTab) setActiveTab('merchant-dashboard');
        }}
      />
    );
  }

  if (!isAuthModalOpen) return null;

  // Formatações e Máscaras
  const formatCPF = (val) => {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  };

  const formatCNPJ = (val) => {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      .substring(0, 18);
  };

  const formatCEP = (val) => {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const formatPhone = (val) => {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  // Alternar Loja Online / Atuação Nacional (Abrange Todos os Locais)
  const handleSetOnlineStore = (enableOnline) => {
    if (enableOnline) {
      setMerchantForm(prev => ({
        ...prev,
        storeType: 'online',
        isOnline: true,
        cities: ['Todas as Cidades (Online / Brasil Todo)']
      }));
    } else {
      setMerchantForm(prev => ({
        ...prev,
        storeType: 'physical',
        isOnline: false,
        cities: prev.cities.some(c => c.includes('Todas as Cidades') || c.includes('Online')) ? ['São Paulo - SP'] : prev.cities
      }));
    }
  };

  // Busca rápida de CEP via ViaCEP com preenchimento automático de cidade
  const handleCepLookup = async (cepValue, target) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro && data.localidade && data.uf) {
          const detectedCity = `${data.localidade} - ${data.uf}`;
          if (target === 'user') {
            setUserForm(prev => ({ ...prev, city: detectedCity }));
          } else if (target === 'merchant') {
            setMerchantForm(prev => {
              if (prev.storeType === 'online' || prev.isOnline) return prev;
              const currentCities = prev.cities || [];
              const withoutDefault = currentCities.filter(c => c !== 'São Paulo - SP' || detectedCity === 'São Paulo - SP');
              return {
                ...prev,
                cities: [detectedCity, ...withoutDefault.filter(c => c !== detectedCity)]
              };
            });
          }
        }
      } catch (err) {
        console.error('Erro na consulta do CEP:', err);
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  // Gerenciamento de Cidades para Lojistas / Franquias
  const handleAddCity = (cityToAdd) => {
    const trimmed = cityToAdd.trim();
    if (!trimmed) return;

    if (
      trimmed.toLowerCase().includes('todas as cidades') || 
      trimmed.toLowerCase().includes('online') || 
      trimmed.toLowerCase().includes('todo o brasil') ||
      trimmed.toLowerCase().includes('todos os locais')
    ) {
      handleSetOnlineStore(true);
      setCustomCityInput('');
      return;
    }

    setMerchantForm(prev => {
      const filtered = prev.cities.filter(c => !c.includes('Todas as Cidades') && !c.includes('Online'));
      if (!filtered.includes(trimmed)) {
        return {
          ...prev,
          storeType: 'physical',
          isOnline: false,
          cities: [...filtered, trimmed]
        };
      }
      return {
        ...prev,
        storeType: 'physical',
        isOnline: false,
        cities: filtered
      };
    });
    setCustomCityInput('');
  };

  const handleRemoveCity = (cityToRemove) => {
    if (merchantForm.storeType === 'online' || merchantForm.isOnline) {
      handleSetOnlineStore(false);
      return;
    }
    if (merchantForm.cities.length <= 1) {
      setErrorMsg('O estabelecimento precisa atender pelo menos 1 cidade ou ser Loja Online.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setMerchantForm(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== cityToRemove)
    }));
  };

  // Submissão do Cadastro de Usuário
  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.cpf || !userForm.email || !userForm.city) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (Nome, CPF, Cidade e E-mail).');
      return;
    }
    if (userForm.cpf.replace(/\D/g, '').length < 11) {
      setErrorMsg('CPF inválido. Digite os 11 dígitos do seu CPF.');
      return;
    }

    // Filtro Anti-Pornografia, Explícito e Trolls
    const safetyCheck = validateUserSafety(userForm);
    if (!safetyCheck.safe) {
      setErrorMsg(`⚠️ Bloqueio de Conteúdo: ${safetyCheck.reason} Por favor, utilize dados reais e respeitosos.`);
      return;
    }

    registerUser(userForm);
  };

  // Submissão do Cadastro de Lojista
  const handleSubmitMerchant = async (e) => {
    e.preventDefault();
    if (!merchantForm.name || !merchantForm.cnpj || !merchantForm.email || !merchantForm.phone) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (Nome da Loja, CNPJ, E-mail e WhatsApp).');
      return;
    }
    if (merchantForm.cnpj.replace(/\D/g, '').length < 14) {
      setErrorMsg('CNPJ inválido. Digite os 14 dígitos do CNPJ.');
      return;
    }
    const isOnline = merchantForm.storeType === 'online' || merchantForm.isOnline;
    const finalCities = isOnline 
      ? ['Todas as Cidades (Online / Brasil Todo)'] 
      : merchantForm.cities;

    if (!isOnline && finalCities.length === 0) {
      setErrorMsg('Adicione ao menos uma cidade de atuação da loja ou selecione a opção de Loja Online.');
      return;
    }

    // Filtro Anti-Pornografia, Explícito e Trolls para Lojas
    const logoImg = merchantForm.logoImage || couponForm.logoImage || '';
    const cleanIg = (merchantForm.instagram || '')
      .replace(/https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/instagram\.com\//i, '')
      .replace(/[/?#].*$/, '')
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9._]/g, '')
      .trim();
    const finalInstagram = cleanIg ? `@${cleanIg}` : '';

    const payload = {
      ...merchantForm,
      instagram: finalInstagram,
      logoImage: logoImg,
      cities: finalCities,
      storeType: isOnline ? 'online' : 'physical',
      isOnline,
      keepAuthModalOpen: true // Manter aberto para exibir o modal de entrega com WhatsApp e Arte
    };

    const safetyCheck = validateStoreSafety(payload);
    if (!safetyCheck.safe) {
      setErrorMsg(`⚠️ Bloqueio de Segurança: ${safetyCheck.reason} Por favor, utilize um nome e termos comerciais legítimos.`);
      return;
    }

    setIsNotifyingPartner(true);
    setErrorMsg('');

    try {
      const regResult = registerMerchant(payload);

      // Se o lojista preencheu o 1º cupom, cadastrar automaticamente com todos os dados
      if (includeCoupon && couponForm.title.trim() && regResult?.store) {
        const orig = couponForm.originalPrice ? parseFloat(couponForm.originalPrice.replace(',', '.')) : null;
        const promo = couponForm.promoPrice ? parseFloat(couponForm.promoPrice.replace(',', '.')) : null;
        const computedSavings = (orig && promo && orig > promo)
          ? Number((orig - promo).toFixed(2))
          : 20;

        let badge = couponForm.discountBadge?.trim() || '';
        if (!badge) {
          if (orig && promo && orig > promo) {
            const pct = Math.round(((orig - promo) / orig) * 100);
            badge = `${pct}% OFF`;
          } else {
            badge = 'SUPER OFERTA';
          }
        }

        const cleanStoreName = regResult.store.name || merchantForm.name || 'CUPOM';
        const storeCodePrefix = cleanStoreName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 5) || 'PROMO';
        const finalCode = couponForm.code.trim().toUpperCase() || `${storeCodePrefix}${Math.floor(10 + Math.random() * 90)}`;

        let finalExpiresAt = null;
        if (couponForm.validityType === 'days') {
          const days = Math.max(1, parseInt(couponForm.validityDays) || 30);
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + days);
          finalExpiresAt = targetDate.toISOString().split('T')[0];
        } else {
          finalExpiresAt = 'unlimited';
        }

        const maxUses = couponForm.limitType === 'one' ? 1 : couponForm.limitType === 'custom' ? (parseInt(couponForm.customMaxUses) || 2) : null;

        const rulesArray = couponForm.rules.trim()
          ? couponForm.rules.split('\n').map(r => r.trim()).filter(Boolean)
          : ['Apresentar o cupom VIP no balcão.', 'Não cumulativo com outras promoções.', 'Válido para consumo no local.'];

        addCoupon({
          storeId: regResult.store.id,
          merchantId: regResult.store.merchantId,
          storeName: regResult.store.name,
          storeLogoImage: logoImg,
          logoImage: logoImg,
          title: couponForm.title.trim(),
          description: couponForm.description.trim() || 'Oferta especial de inauguração para clientes VIP.',
          code: finalCode,
          originalPrice: orig,
          promoPrice: promo,
          discountBadge: badge,
          discountValue: badge,
          discountType: couponForm.discountType || 'percentage',
          estimatedSavings: computedSavings,
          category: couponForm.category || regResult.store.category || merchantForm.category || 'gastronomia',
          city: regResult.store.city || 'São Paulo - SP',
          cities: regResult.store.cities || [regResult.store.city || 'São Paulo - SP'],
          banner: couponForm.banner || BANNER_PRESETS[0].url,
          type: couponForm.type || regResult.store.type || 'physical',
          validityType: couponForm.validityType,
          validityDays: couponForm.validityType === 'days' ? (parseInt(couponForm.validityDays) || 30) : null,
          expiresAt: finalExpiresAt,
          maxUsesPerUser: maxUses,
          affiliateUrl: couponForm.affiliateUrl || '',
          rules: rulesArray
        });
      }

      // Notificação via WhatsApp + Criação da Arte com a logo do parceiro + Download do arquivo
      const targetStore = regResult?.store || { ...payload, name: merchantForm.name, logoImage: logoImg };
      const welcomeData = await notifyPartnerRegistration({
        store: targetStore,
        email: merchantForm.email,
        password: merchantForm.password,
        phone: merchantForm.phone,
        instagram: merchantForm.instagram
      });

      // Exibir o modal de entrega interativo
      setPartnerWelcomeData(welcomeData);
    } catch (err) {
      console.error('[handleSubmitMerchant Error]:', err);
      if (setActiveTab) {
        setActiveTab('merchant-dashboard');
      }
      closeAuthModal();
    } finally {
      setIsNotifyingPartner(false);
    }
  };

  // Submissão do Login Unificado (sem seletor de usuário ou lojista)
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!loginForm.identifier.trim()) {
      setErrorMsg('Por favor, informe seu e-mail, CPF ou CNPJ.');
      return;
    }

    const result = loginAccount(loginForm.identifier, loginForm.password);
    if (result && !result.success) {
      setErrorMsg(result.error || 'Credenciais inválidas.');
    } else if (result && result.success) {
      setErrorMsg('');
    }
  };

  // Se houver entrega de boas-vindas do parceiro, renderizar a tela exclusiva de entrega
  if (partnerWelcomeData) {
    return (
      <PartnerWelcomeModal
        data={partnerWelcomeData}
        onClose={() => {
          setPartnerWelcomeData(null);
          closeAuthModal();
          if (setActiveTab) setActiveTab('merchant-dashboard');
        }}
        onGoToDashboard={() => {
          setPartnerWelcomeData(null);
          closeAuthModal();
          if (setActiveTab) setActiveTab('merchant-dashboard');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#161622] border-2 border-[#FF5F00] rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/80 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fechar Modal */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Top Header com Abas */}
        <div className="bg-gradient-to-r from-[#2B1307] via-[#1E110A] to-[#161622] p-5 sm:p-6 border-b border-white/10 relative overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={logoMelhorCupom} 
              alt="Melhor Cupom" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                {authModalMode === 'login' ? 'Acesso ao Sistema' : 'Portal de Acesso'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {authModalMode === 'login' ? 'Entrar na sua Conta' : authModalMode === 'user_register' ? 'Criar Conta de Usuário' : 'Cadastrar Loja ou Franquia'}
              </h2>
            </div>
          </div>

          {/* Seletor de Abas apenas para Cadastro; no Login não há seletor de usuário ou lojista */}
          {authModalMode !== 'login' ? (
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthModalMode('user_register'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authModalMode === 'user_register'
                    ? 'bg-[#FF5F00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={14} />
                <span>Sou Usuário</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthModalMode('merchant_register'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authModalMode === 'merchant_register'
                    ? 'bg-amber-500 text-black shadow-md font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Store size={14} />
                <span>Sou Lojista / Franquia</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthModalMode('login'); setErrorMsg(''); }}
                className="px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 text-gray-400 hover:text-white transition-all"
              >
                <LogIn size={14} />
                <span>Já tenho conta</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-black/30 px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300">
              <span>Informe seu e-mail, CPF ou CNPJ para acessar seu painel</span>
              <button
                type="button"
                onClick={() => { setAuthModalMode('user_register'); setErrorMsg(''); }}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Criar nova conta</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Notificação de Erro */}
        {errorMsg && (
          <div className="bg-red-500/20 border-b border-red-500/40 text-red-300 px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conteúdo Rolável */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-grow space-y-5">
          
          {/* ================= ABA 1: CADASTRO DE USUÁRIO ================= */}
          {authModalMode === 'user_register' && (
            <form onSubmit={handleSubmitUser} className="space-y-4">
              
              {/* Destaque Bônus Divulgue & Ganhe */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
                  🎁
                </div>
                <div className="text-xs">
                  <div className="font-black text-amber-300">Cadastro Gratuito + Código de Indicação</div>
                  <div className="text-gray-300 text-[11px] mt-0.5">
                    Ao criar sua conta, você recebe seu link exclusivo para indicar amigos e ganhar <strong>R$ 3,00 por assinatura</strong> para trocar por VIP grátis!
                  </div>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo de Souza"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid: CPF & CEP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={userForm.cpf}
                    onChange={(e) => setUserForm({ ...userForm, cpf: formatCPF(e.target.value) })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-300 block">CEP *</label>
                    {isSearchingCep && (
                      <span className="text-[10px] text-amber-400 animate-pulse">Buscando cidade...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    placeholder="00000-000"
                    value={userForm.cep}
                    onChange={(e) => {
                      const masked = formatCEP(e.target.value);
                      setUserForm({ ...userForm, cep: masked });
                      handleCepLookup(masked, 'user');
                    }}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Cidade de Residência */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 block">
                    Cidade de Residência *
                  </label>
                  {isSearchingCep ? (
                    <span className="text-[10px] text-amber-400 animate-pulse">Detectando pelo CEP...</span>
                  ) : userForm.city ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓ Preenchido pelo CEP</span>
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    list="user-popular-cities"
                    placeholder="Digite o CEP acima ou sua cidade..."
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder-gray-500"
                  />
                  <datalist id="user-popular-cities">
                    {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades').map((city, idx) => (
                      <option key={idx} value={city} />
                    ))}
                  </datalist>
                </div>
                {/* Sugestões rápidas caso ainda não preenchido */}
                {!userForm.city && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">Exemplos rápidos:</span>
                    {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades').slice(0, 4).map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUserForm(prev => ({ ...prev, city }))}
                        className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-2 py-0.5 rounded-md border border-white/5 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid: E-mail & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="(11) 98765-4321"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: formatPhone(e.target.value) })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Criar Senha de Acesso *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Aceite dos Termos e Privacidade */}
              <div className="text-[11px] text-gray-400 text-center px-2 pt-1 leading-relaxed">
                Ao cadastrar-se, você concorda com nossos{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-orange-400 font-bold hover:underline cursor-pointer"
                >
                  Termos de Uso
                </button>
                {' '}e{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Política de Privacidade (LGPD)
                </button>.
              </div>

              {/* Botão de Concluir */}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01]"
              >
                <Sparkles size={16} />
                <span>Finalizar Cadastro de Usuário</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-center text-[11px] text-gray-400 pt-1">
                Já tem cadastro?{' '}
                <button 
                  type="button" 
                  onClick={() => setAuthModalMode('login')} 
                  className="text-orange-400 font-bold hover:underline"
                >
                  Entrar na conta
                </button>
              </div>

            </form>
          )}

          {/* ================= ABA 2: CADASTRO DE LOJISTA / FRANQUIA ================= */}
          {authModalMode === 'merchant_register' && (
            <form onSubmit={handleSubmitMerchant} className="space-y-4">

              {/* Destaque Franquias & Cidades */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                  🏢
                </div>
                <div className="text-xs">
                  <div className="font-black text-amber-300">Suporte a Franquias & Redes Multi-Cidades</div>
                  <div className="text-gray-300 text-[11px] mt-0.5 leading-relaxed">
                    Você pode selecionar uma ou <strong>múltiplas cidades de atuação</strong>. Suas ofertas aparecerão automaticamente no feed de cada uma das cidades cadastradas!
                  </div>
                </div>
              </div>

              {/* Nome Fantasia da Loja */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Nome da Loja (Nome Fantasia) *
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Seu Restaurante, Barbearia ou Franquia"
                    value={merchantForm.name}
                    onChange={(e) => setMerchantForm({ ...merchantForm, name: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Razão Social / Responsável */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Razão Social ou Nome do Responsável *
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Razão Social da Empresa Ltda"
                    value={merchantForm.legalName}
                    onChange={(e) => setMerchantForm({ ...merchantForm, legalName: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid: CNPJ & CEP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    placeholder="00.000.000/0001-00"
                    value={merchantForm.cnpj}
                    onChange={(e) => setMerchantForm({ ...merchantForm, cnpj: formatCNPJ(e.target.value) })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-300 block">
                      {merchantForm.storeType === 'online' || merchantForm.isOnline ? 'CEP da Sede / Distribuição (Opcional)' : 'CEP Sede / Matriz *'}
                    </label>
                    {isSearchingCep && (
                      <span className="text-[10px] text-amber-400 animate-pulse">Detectando cidade...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required={merchantForm.storeType !== 'online' && !merchantForm.isOnline}
                    maxLength={9}
                    placeholder="00000-000"
                    value={merchantForm.cep}
                    onChange={(e) => {
                      const masked = formatCEP(e.target.value);
                      setMerchantForm({ ...merchantForm, cep: masked });
                      if (merchantForm.storeType !== 'online' && !merchantForm.isOnline) {
                        handleCepLookup(masked, 'merchant');
                      }
                    }}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* ================= MODALIDADE & CIDADES DE ATUAÇÃO ================= */}
              <div className="bg-[#101017] p-4 rounded-2xl border border-white/10 space-y-3.5">
                
                {/* 1. SELETOR DE MODALIDADE: LOJA FÍSICA VS LOJA ONLINE (TODOS OS LOCAIS) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>Modalidade de Atuação da Loja:</span>
                    </label>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      {merchantForm.storeType === 'online' || merchantForm.isOnline ? '🌐 Nacional' : '🏬 Local / Franquias'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Botão Opção 1: Loja Física */}
                    <button
                      type="button"
                      onClick={() => handleSetOnlineStore(false)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        merchantForm.storeType !== 'online' && !merchantForm.isOnline
                          ? 'bg-[#FF5F00]/15 border-[#FF5F00] text-white shadow-md shadow-orange-600/10 ring-1 ring-[#FF5F00]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl mt-0.5">🏬</span>
                      <div>
                        <div className="text-xs font-black text-white">Loja Física / Franquia</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                          Atendimento no balcão em cidades específicas.
                        </div>
                      </div>
                    </button>

                    {/* Botão Opção 2: Loja Online que Abrange Todos os Locais */}
                    <button
                      type="button"
                      onClick={() => handleSetOnlineStore(true)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        merchantForm.storeType === 'online' || merchantForm.isOnline
                          ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-[#FF5F00]/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl mt-0.5">🌐</span>
                      <div>
                        <div className="text-xs font-black text-emerald-300 flex items-center gap-1">
                          <span>Loja Online / E-commerce</span>
                          <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-extrabold uppercase">Todos os Locais</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                          Abrange todo o Brasil, delivery nacional ou vendas online.
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. CONTEÚDO ESPECÍFICO CONFORME A MODALIDADE */}
                {merchantForm.storeType === 'online' || merchantForm.isOnline ? (
                  /* Painel Informativo para Loja Online com Abrangência Nacional */
                  <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-3.5 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                        <Globe size={16} />
                        <span>Abrangência Nacional: Visível em Todos os Locais</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/25 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                        🇧🇷 100% Brasil
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Sua loja e suas ofertas serão <strong>exibidas para clientes de qualquer cidade ou estado do país</strong>. Os clientes poderão resgatar o cupom com link direto para seu site, WhatsApp ou aplicativo.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-3 py-1 rounded-lg text-xs font-bold">
                        <Globe size={13} className="text-emerald-400" />
                        <span>Todas as Cidades (Online / Brasil Todo)</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSetOnlineStore(false)}
                        className="text-[11px] text-gray-400 hover:text-white underline ml-auto"
                      >
                        Mudar para loja física por cidade
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Painel para Loja Física / Franquias (Seleção por Cidades) */
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#FF5F00]" />
                        <span>Cidades de Atuação ({merchantForm.cities.length}):</span>
                      </label>
                      <span className="text-[10px] text-gray-400">
                        Suas ofertas aparecem no feed dessas cidades
                      </span>
                    </div>

                    {/* Chips das Cidades Selecionadas */}
                    <div className="flex flex-wrap gap-1.5">
                      {merchantForm.cities.map((city, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1.5 bg-[#FF5F00]/20 border border-[#FF5F00]/40 text-orange-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        >
                          <span>{city}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCity(city)}
                            className="hover:text-white hover:bg-white/10 rounded p-0.5"
                            title={`Remover ${city}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Seletor rápido de Cidades Populares + Atalho para Loja Online */}
                    <div>
                      <div className="text-[11px] text-gray-400 mb-1.5">Adicione rapidamente com 1 clique:</div>
                      <div className="flex flex-wrap gap-1">
                        {/* Botão em destaque de Loja Online (Todos os Locais) */}
                        <button
                          type="button"
                          onClick={() => handleSetOnlineStore(true)}
                          className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-md px-2.5 py-1 flex items-center gap-1 transition-all shadow-sm"
                          title="Sua loja atende todo o Brasil online"
                        >
                          <Globe size={11} className="text-emerald-400" />
                          <span>🌐 Loja Online (Todos os Locais / Brasil)</span>
                        </button>

                        {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades' && !merchantForm.cities.includes(c)).slice(0, 7).map((city, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddCity(city)}
                            className="text-[10px] bg-white/5 hover:bg-white/15 text-gray-300 border border-white/10 rounded-md px-2 py-1 flex items-center gap-1 transition-colors"
                          >
                            <Plus size={10} className="text-emerald-400" />
                            <span>{city}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campo para Adicionar Outra Cidade Personalizada */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Adicionar outra cidade (ex: Jundiaí - SP)"
                        value={customCityInput}
                        onChange={(e) => setCustomCityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCity(customCityInput);
                          }
                        }}
                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5F00]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCity(customCityInput)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Categoria do Estabelecimento */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Segmento / Categoria Principal *
                </label>
                <select
                  value={merchantForm.category}
                  onChange={(e) => setMerchantForm({ ...merchantForm, category: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Grid: E-mail Comercial & WhatsApp Comercial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    E-mail Comercial *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="comercial@loja.com"
                      value={merchantForm.email}
                      onChange={(e) => setMerchantForm({ ...merchantForm, email: e.target.value })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    WhatsApp da Loja *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="(11) 98123-4567"
                      value={merchantForm.phone}
                      onChange={(e) => setMerchantForm({ ...merchantForm, phone: formatPhone(e.target.value) })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Instagram Oficial da Loja */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5 flex items-center justify-between">
                  <span>Instagram Oficial (@) (Opcional)</span>
                  <span className="text-[10px] text-fuchsia-400 font-bold">Para marcar seu perfil nas divulgações</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">@</span>
                  <input
                    type="text"
                    placeholder="Ex: seurestaurante.oficial"
                    value={(merchantForm.instagram || '').replace(/^@/, '')}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/^@/, '').trim();
                      setMerchantForm({ ...merchantForm, instagram: clean ? `@${clean}` : '' });
                    }}
                    className="w-full bg-[#101017] border border-white/10 focus:border-fuchsia-500 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Senha do Lojista */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Senha / PIN de Validação no Balcão *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 dígitos"
                    value={merchantForm.password}
                    onChange={(e) => setMerchantForm({ ...merchantForm, password: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Seção: Criar 1º Cupom no Cadastro */}
              <div className="bg-[#12121c] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 relative overflow-hidden transition-all shadow-2xl space-y-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* Cabeçalho com Toggle */}
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#FF5F00] p-0.5 shadow-lg flex-shrink-0">
                      <div className="w-full h-full bg-[#181824] rounded-[14px] flex items-center justify-center text-amber-400">
                        <Tag size={20} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">Criar Meu 1º Cupom Agora</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Configure seu primeiro cupom completo com capa, logo e regras para atrair clientes imediatamente.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={includeCoupon}
                      onChange={(e) => setIncludeCoupon(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                  </label>
                </div>

                {includeCoupon && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* 1. UPLOAD E ENQUADRAMENTO DA CAPA / BANNER */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📸 1. Capa / Banner da Oferta *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                        >
                          <Upload size={13} />
                          <span>Upload do Computador</span>
                        </button>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Preview do Banner com Overlays */}
                      <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border-2 border-dashed border-[#FF5F00]/50 group bg-black/60 shadow-lg">
                        <img
                          src={couponForm.banner}
                          alt="Pré-visualização da Capa"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

                        {/* Tag de Desconto Simulada */}
                        <div className="absolute top-3 left-3 bg-[#FF5F00] text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg">
                          {couponForm.discountBadge || '30% OFF'}
                        </div>

                        {/* Tag de Validade Simulada */}
                        <div className="absolute top-3 right-3 sm:right-64">
                          <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-bold border border-white/20 shadow-md">
                            <Clock size={12} className="text-orange-400" />
                            <span>
                              {couponForm.validityType === 'unlimited' ? '♾️ Ilimitado' : `${couponForm.validityDays || 30} dias`}
                            </span>
                          </span>
                        </div>

                        {/* Logo da Empresa no Banner Simulado */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-[#181822] overflow-hidden flex items-center justify-center shadow-lg border border-white/10">
                            {(couponForm.logoImage || merchantForm.logoImage) ? (
                              <img
                                src={couponForm.logoImage || merchantForm.logoImage}
                                alt="Logo Loja"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl">🏪</span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-white drop-shadow-md">
                            {merchantForm.name || 'Sua Loja'}
                          </span>
                        </div>

                        {/* Preços De / Por Simulados */}
                        {couponForm.originalPrice && couponForm.promoPrice && (
                          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-xl text-right shadow-xl">
                            <span className="text-[10px] text-gray-400 line-through block">
                              De R$ {parseFloat(couponForm.originalPrice.replace(',', '.')).toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-xs font-black text-emerald-400">
                              Por R$ {parseFloat(couponForm.promoPrice.replace(',', '.')).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        )}

                        {/* Botão de Ajustar Zoom & Enquadramento */}
                        {couponForm.banner && (
                          <button
                            type="button"
                            onClick={() => setFramingModalState({ isOpen: true, imageSrc: couponForm.banner, targetType: 'banner' })}
                            className="absolute top-3 right-3 bg-black/80 hover:bg-black text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-400/40 hover:border-amber-400 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xl cursor-pointer"
                            title="Ajustar zoom, enquadramento e corte da foto de capa"
                          >
                            <ZoomIn size={13} className="text-amber-400" />
                            <span>Ajustar Zoom & Corte</span>
                          </button>
                        )}
                      </div>

                      {/* Presets Rápidos de Banner */}
                      <div className="mt-2.5">
                        <span className="text-[11px] text-gray-400 block mb-1.5">Ou escolha uma imagem de alta qualidade pronta:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {BANNER_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCouponForm({ ...couponForm, banner: preset.url })}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                couponForm.banner === preset.url
                                  ? 'bg-[#FF5F00] text-white border-[#FF5F00] font-bold shadow-md'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. LOGO DA MARCA COM AJUSTE DE ZOOM */}
                    <div className="bg-[#101018] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-amber-400" />
                          <span>2. Logo da Marca / Estabelecimento (Badge e Card) *</span>
                        </label>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>

                      {(couponForm.logoImage || merchantForm.logoImage) ? (
                        <div className="flex items-center gap-3 p-2 bg-[#141420] border border-white/10 rounded-xl">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#181824] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-md">
                            <img
                              src={couponForm.logoImage || merchantForm.logoImage}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Logo carregada</span>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setFramingModalState({ isOpen: true, imageSrc: couponForm.logoImage || merchantForm.logoImage, targetType: 'logo' })}
                                className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-lg border border-amber-500/30 transition-colors"
                              >
                                <ZoomIn size={12} className="text-amber-400" />
                                <span>Ajustar Zoom & Enquadramento</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="text-[11px] text-[#FF5F00] hover:underline font-bold cursor-pointer"
                              >
                                Trocar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMerchantForm(prev => ({ ...prev, logoImage: '' }));
                                  setCouponForm(prev => ({ ...prev, logoImage: '' }));
                                }}
                                className="text-[11px] text-gray-400 hover:text-red-400 cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="w-full bg-[#141420] border-2 border-dashed border-white/20 hover:border-amber-400 rounded-xl py-3 px-4 text-xs text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
                        >
                          <Upload size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="font-bold">Fazer Upload da Logo da Loja (Ajuste de Zoom automático)</span>
                        </button>
                      )}
                    </div>

                    {/* 3. TÍTULO E CATEGORIA */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-300 block mb-1">
                          Título Chamativo da Oferta *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 50% OFF no 2º Burger Especial ou Sobremesa Grátis"
                          value={couponForm.title}
                          onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                          className="w-full bg-[#101017] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">
                          Categoria da Oferta
                        </label>
                        <select
                          value={couponForm.category}
                          onChange={(e) => setCouponForm({ ...couponForm, category: e.target.value })}
                          className="w-full bg-[#101017] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                        >
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 4. DESCRIÇÃO DETALHADA */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Descrição Detalhada do Benefício
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Explique exatamente o que o cliente ganha e quais produtos participam..."
                        value={couponForm.description}
                        onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                        className="w-full bg-[#101017] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* 5. PREÇOS DE / POR & DESCONTO CALCULADO */}
                    <div className="bg-[#101018] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <DollarSign size={15} className="text-amber-400" />
                          <span>Preços da Oferta: De (Normal) e Por (Promoção)</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* De */}
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">De: Preço Normal (R$)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">R$</span>
                            <input
                              type="text"
                              placeholder="Ex: 80,00"
                              value={couponForm.originalPrice}
                              onChange={(e) => handleCouponPriceChange('originalPrice', e.target.value)}
                              className="w-full bg-[#141420] border border-white/10 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Por */}
                        <div>
                          <label className="text-xs text-emerald-400 font-bold block mb-1">Por: Preço Promocional (R$)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs font-bold text-emerald-400">R$</span>
                            <input
                              type="text"
                              placeholder="Ex: 48,00"
                              value={couponForm.promoPrice}
                              onChange={(e) => handleCouponPriceChange('promoPrice', e.target.value)}
                              className="w-full bg-[#141420] border border-emerald-500/40 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-emerald-300 font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Tag Selo */}
                        <div>
                          <label className="text-xs text-gray-300 block mb-1 flex items-center justify-between">
                            <span>Selo de Desconto (Badge)</span>
                            {couponForm.discountBadge && (
                              <span className="text-[10px] text-amber-400 font-bold">Auto-calculado</span>
                            )}
                          </label>
                          <div className="relative">
                            <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                              type="text"
                              placeholder="Ex: 40% OFF"
                              value={couponForm.discountBadge}
                              onChange={(e) => setCouponForm({ ...couponForm, discountBadge: e.target.value })}
                              className="w-full bg-[#141420] border border-white/10 focus:border-amber-400 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Feedback de Economia */}
                      {couponForm.originalPrice && couponForm.promoPrice && (
                        parseFloat(couponForm.originalPrice.replace(',', '.')) > parseFloat(couponForm.promoPrice.replace(',', '.')) ? (
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-fade-in text-xs">
                            <div className="flex items-center gap-1.5 text-emerald-300">
                              <Sparkles size={14} className="text-emerald-400" />
                              <span>Economia real calculada: <strong>R$ {(parseFloat(couponForm.originalPrice.replace(',', '.')) - parseFloat(couponForm.promoPrice.replace(',', '.'))).toFixed(2).replace('.', ',')}</strong> por cliente</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                              ⚡ {Math.round(((parseFloat(couponForm.originalPrice.replace(',', '.')) - parseFloat(couponForm.promoPrice.replace(',', '.'))) / parseFloat(couponForm.originalPrice.replace(',', '.'))) * 100)}% OFF
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* 6. MODALIDADE DE ATENDIMENTO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCouponForm({ ...couponForm, type: 'physical' })}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          couponForm.type === 'physical'
                            ? 'bg-[#FF5F00]/20 border-[#FF5F00] text-white ring-1 ring-[#FF5F00]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Store size={18} className={couponForm.type === 'physical' ? 'text-[#FF5F00]' : 'text-gray-500'} />
                        <div>
                          <div className="text-xs font-black">Loja Física / Presencial</div>
                          <div className="text-[10px] text-gray-400">Validação rápida por QR Code no balcão</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCouponForm({ ...couponForm, type: 'online' })}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          couponForm.type === 'online'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Globe size={18} className={couponForm.type === 'online' ? 'text-emerald-400' : 'text-gray-500'} />
                        <div>
                          <div className="text-xs font-black text-emerald-300">Loja Online / E-commerce</div>
                          <div className="text-[10px] text-gray-400">Cupom de desconto com link direto</div>
                        </div>
                      </button>
                    </div>

                    {/* Link Oficial / Afiliado se Loja Online */}
                    {couponForm.type === 'online' && (
                      <div className="animate-fade-in">
                        <label className="text-xs font-bold text-gray-300 block mb-1">
                          Link do Site Oficial ou Afiliado (Opcional)
                        </label>
                        <input
                          type="url"
                          placeholder="Ex: https://www.seusite.com.br"
                          value={couponForm.affiliateUrl}
                          onChange={(e) => setCouponForm({ ...couponForm, affiliateUrl: e.target.value })}
                          className="w-full bg-[#101017] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}

                    {/* 7. LIMITE DE RESGATES POR CPF */}
                    <div className="bg-[#101018] border border-white/10 rounded-2xl p-4 space-y-2.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users size={14} className="text-amber-400" />
                        <span>Limite de Resgates por CPF</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setCouponForm({ ...couponForm, limitType: 'one' })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            couponForm.limitType === 'one'
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-black text-white">1 por CPF</div>
                          <div className="text-[10px] text-gray-400">Anti-fraude padrão</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCouponForm({ ...couponForm, limitType: 'custom' })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            couponForm.limitType === 'custom'
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-black text-white">Mais de 1 por CPF</div>
                          <div className="text-[10px] text-gray-400">Defina quantidade</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCouponForm({ ...couponForm, limitType: 'unlimited' })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            couponForm.limitType === 'unlimited'
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-black text-white">Uso Ilimitado</div>
                          <div className="text-[10px] text-gray-400">Sempre que visitar</div>
                        </button>
                      </div>

                      {couponForm.limitType === 'custom' && (
                        <div className="pt-2 flex items-center justify-between gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 animate-fade-in">
                          <span className="text-xs text-gray-300">Quantidade máxima permitida por CPF:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCouponForm(prev => ({
                                ...prev,
                                customMaxUses: Math.max(2, (Number(prev.customMaxUses) || 2) - 1)
                              }))}
                              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-amber-300">
                              {couponForm.customMaxUses}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCouponForm(prev => ({
                                ...prev,
                                customMaxUses: (Number(prev.customMaxUses) || 2) + 1
                              }))}
                              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 8. VALIDADE DA OFERTA */}
                    <div className="bg-[#101018] border border-white/10 rounded-2xl p-4 space-y-2.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-400" />
                        <span>Validade da Oferta</span>
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCouponForm({ ...couponForm, validityType: 'days' })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            couponForm.validityType === 'days'
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-black text-white">Tempo Determinado</div>
                          <div className="text-[10px] text-gray-400">Válido por {couponForm.validityDays} dias</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCouponForm({ ...couponForm, validityType: 'unlimited' })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            couponForm.validityType === 'unlimited'
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-black text-white">Permanente</div>
                          <div className="text-[10px] text-gray-400">Sem data limite de expiração</div>
                        </button>
                      </div>

                      {couponForm.validityType === 'days' && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-gray-400">Duração:</span>
                          {[15, 30, 60, 90].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setCouponForm({ ...couponForm, validityDays: d })}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                couponForm.validityDays === d
                                  ? 'bg-[#FF5F00] text-white border-[#FF5F00] font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                              }`}
                            >
                              {d} dias
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 9. CÓDIGO DO CUPOM & REGRAS */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-300">
                          Código do Cupom
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateCouponCode}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={11} />
                          <span>Gerar Código</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: PROMO30 ou BURGER50"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="w-full bg-[#101017] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none font-mono font-bold tracking-wider uppercase"
                      />
                    </div>

                    {/* Regras e Condições */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Regras de Uso (uma por linha)
                      </label>
                      <textarea
                        rows={2}
                        value={couponForm.rules}
                        onChange={(e) => setCouponForm({ ...couponForm, rules: e.target.value })}
                        className="w-full bg-[#101017] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                        placeholder="Apresentar o cupom no balcão.&#10;Não cumulativo com outras promoções.&#10;Válido para consumo no local."
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Aceite dos Termos e Privacidade Comercial */}
              <div className="text-[11px] text-gray-400 text-center px-2 pt-1 leading-relaxed">
                Ao cadastrar sua loja, você concorda com nossos{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Termos de Uso
                </button>
                {' '}e{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Política de Privacidade (LGPD)
                </button>.
              </div>

              {/* Botão de Concluir */}
              <button
                type="submit"
                disabled={isNotifyingPartner}
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-[#FF5F00] to-amber-500 hover:from-emerald-400 hover:to-[#E04F00] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01] cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isNotifyingPartner ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-white" />
                    <span>Gerando Arte Oficial e WhatsApp...</span>
                  </>
                ) : includeCoupon && couponForm.title.trim() ? (
                  <>
                    <Tag size={18} />
                    <span>Cadastrar Loja e Publicar Cupom Agora 🚀</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <Store size={18} />
                    <span>Cadastrar Minha Loja Gratuitamente</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-gray-400 pt-1">
                Já é parceiro cadastrado?{' '}
                <button 
                  type="button" 
                  onClick={() => setAuthModalMode('login')} 
                  className="text-amber-400 font-bold hover:underline"
                >
                  Entrar no painel
                </button>
              </div>

            </form>
          )}

          {/* ================= ABA 3: ENTRAR (LOGIN UNIFICADO) ================= */}
          {authModalMode === 'login' && (
            <form onSubmit={handleSubmitLogin} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    E-mail, CPF ou CNPJ *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="Digite seu e-mail, CPF ou CNPJ"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    O sistema identifica automaticamente se a conta pertence a um Usuário ou Estabelecimento Parceiro.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-300 block">
                      Senha de Acesso *
                    </label>
                    <button 
                      type="button"
                      onClick={() => alert('Para redefinir sua senha, entre em contato com nosso suporte.')}
                      className="text-[11px] text-orange-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="Sua senha ou PIN"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botão Único de Login (Sem Seletor) */}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-[#FF5F00] via-[#FF7518] to-[#FF8F00] hover:from-[#E04F00] hover:to-[#E57A00] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01]"
              >
                <LogIn size={18} />
                <span>Entrar na Conta</span>
                <ArrowRight size={16} />
              </button>

              {/* Link para cadastro */}
              <div className="border-t border-white/10 pt-4 text-center text-xs text-gray-400 space-y-1">
                <div>Ainda não possui uma conta?</div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('user_register')}
                    className="text-orange-400 font-bold hover:underline"
                  >
                    Cadastrar Usuário
                  </button>
                  <span className="text-gray-600">•</span>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('merchant_register')}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Cadastrar Loja Parceira
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#12121A] border-t border-white/10 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck size={15} />
            <span>Dados 100% protegidos com criptografia</span>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-white hover:text-gray-300 font-bold px-3 py-1"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Modal Interativo de Ajuste de Zoom e Enquadramento da Logo e Capa */}
      <ImageFramingModal
        isOpen={framingModalState.isOpen}
        imageSrc={framingModalState.imageSrc}
        targetType={framingModalState.targetType}
        onClose={() => setFramingModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleFramingConfirm}
      />
    </div>
  );
};
