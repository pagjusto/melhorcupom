import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    registerUser,
    registerMerchant,
    loginAccount,
    setActiveTab
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
    cities: ['São Paulo - SP'],
    email: '',
    phone: '',
    category: 'gastronomia',
    password: ''
  });

  // Formulário Login Único (sem seletor de usuário ou lojista)
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  const [customCityInput, setCustomCityInput] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!merchantForm.cities.includes(trimmed)) {
      setMerchantForm(prev => ({
        ...prev,
        cities: [...prev.cities, trimmed]
      }));
    }
    setCustomCityInput('');
  };

  const handleRemoveCity = (cityToRemove) => {
    if (merchantForm.cities.length <= 1) {
      setErrorMsg('O estabelecimento precisa atender pelo menos 1 cidade.');
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

    registerUser(userForm);
  };

  // Submissão do Cadastro de Lojista
  const handleSubmitMerchant = (e) => {
    e.preventDefault();
    if (!merchantForm.name || !merchantForm.cnpj || !merchantForm.email) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (Nome da Loja, CNPJ e E-mail).');
      return;
    }
    if (merchantForm.cnpj.replace(/\D/g, '').length < 14) {
      setErrorMsg('CNPJ inválido. Digite os 14 dígitos do CNPJ.');
      return;
    }
    if (merchantForm.cities.length === 0) {
      setErrorMsg('Adicione ao menos uma cidade de atuação da loja ou franquia.');
      return;
    }

    registerMerchant(merchantForm);
    if (setActiveTab) {
      setActiveTab('merchant-dashboard');
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

  // Atalho de login rápido para testes
  const handleQuickLogin = (identifier, password) => {
    setLoginForm({ identifier, password });
    const result = loginAccount(identifier, password);
    if (result && !result.success) {
      setErrorMsg(result.error || 'Credenciais inválidas.');
    } else if (result && result.success) {
      setErrorMsg('');
    }
  };

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

              {/* Botão de Concluir */}
              <button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01]"
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
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
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
                    placeholder="Ex: Smash Burger Club ou Rede Pizzaria Bella"
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
                    placeholder="Ex: Smash Burger Alimentos Ltda"
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
                    <label className="text-xs font-bold text-gray-300 block">CEP Sede / Matriz *</label>
                    {isSearchingCep && (
                      <span className="text-[10px] text-amber-400 animate-pulse">Detectando cidade...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    placeholder="00000-000"
                    value={merchantForm.cep}
                    onChange={(e) => {
                      const masked = formatCEP(e.target.value);
                      setMerchantForm({ ...merchantForm, cep: masked });
                      handleCepLookup(masked, 'merchant');
                    }}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* ================= CIDADES DE ATUAÇÃO (MULTI-SELEÇÃO PARA FRANQUIAS) ================= */}
              <div className="bg-[#101017] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>Cidades de Atuação ({merchantForm.cities.length}):</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                    Franquias / Redes
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

                {/* Seletor rápido de Cidades Populares */}
                <div>
                  <div className="text-[11px] text-gray-400 mb-1.5">Adicione rapidamente com 1 clique:</div>
                  <div className="flex flex-wrap gap-1">
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

              {/* Botão de Concluir */}
              <button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01]"
              >
                <Store size={18} />
                <span>Cadastrar Estabelecimento e Começar</span>
                <ArrowRight size={16} />
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

              {/* Atalhos Rápidos para Demonstração */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-gray-400">
                <div className="text-[11px] font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Acesso rápido para demonstração:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lucas.vip@email.com', '123456')}
                    className="p-2.5 bg-black/40 hover:bg-black/60 rounded-xl text-left border border-white/5 hover:border-orange-500/40 transition-all group"
                  >
                    <div className="font-bold text-white text-xs flex items-center gap-1 group-hover:text-orange-400">
                      <User size={13} className="text-orange-400" />
                      <span>Conta Usuário</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">lucas.vip@email.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('comercial@smashburger.com.br', '123456')}
                    className="p-2.5 bg-black/40 hover:bg-black/60 rounded-xl text-left border border-white/5 hover:border-amber-500/40 transition-all group"
                  >
                    <div className="font-bold text-white text-xs flex items-center gap-1 group-hover:text-amber-400">
                      <Store size={13} className="text-amber-400" />
                      <span>Conta Lojista</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">Smash Burger (CNPJ)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('renanzanferrari@live.com', 'rEn@n1406')}
                    className="p-2.5 bg-blue-950/30 hover:bg-blue-900/40 rounded-xl text-left border border-blue-500/30 hover:border-blue-400 transition-all group"
                  >
                    <div className="font-bold text-white text-xs flex items-center gap-1 group-hover:text-blue-400">
                      <Shield size={13} className="text-blue-400" />
                      <span>ADM Master</span>
                    </div>
                    <div className="text-[10px] text-blue-300/80 truncate mt-0.5">renanzanferrari@live.com</div>
                  </button>
                </div>
              </div>

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
    </div>
  );
};
