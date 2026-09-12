import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Check, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  PiggyBank, 
  ArrowRight,
  AlertCircle,
  Clock,
  Heart,
  Gift,
  Copy,
  Coins,
  Share2,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const UserProfileSettings = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    isVipUser, 
    setIsSubscriptionModalOpen,
    setIsSavingsModalOpen,
    cancelSubscription,
    addReferral 
  } = useApp();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'preferences' | 'subscription' | 'referrals'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [userJustEarned, setUserJustEarned] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '(11) 98452-1920',
    cpf: userProfile.cpf || '382.***.***-04',
    avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: userProfile.city || 'São Paulo - SP',
    favoriteCategories: userProfile.favoriteCategories || ['gastronomia', 'beleza'],
    notifications: userProfile.notifications || {
      email: true,
      whatsapp: true,
      newDeals: true,
      expiringSoon: true
    }
  });

  // Upload de Foto de Perfil
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (catId) => {
    setFormData(prev => {
      const exists = prev.favoriteCategories.includes(catId);
      return {
        ...prev,
        favoriteCategories: exists 
          ? prev.favoriteCategories.filter(id => id !== catId)
          : [...prev.favoriteCategories, catId]
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Header do Perfil com Avatar e Status */}
      <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            {/* Avatar com Botão de Troca */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-[#FF5F00] shadow-xl bg-black/40">
                <img 
                  src={formData.avatar} 
                  alt={formData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={22} />
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                {isVipUser ? (
                  <span className="bg-gradient-to-r from-amber-500 to-[#FF5F00] text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Membro VIP</span>
                  </span>
                ) : (
                  <span className="bg-gray-700 text-gray-300 text-[11px] font-bold px-3 py-0.5 rounded-full">
                    Plano Gratuito
                  </span>
                )}
                <span className="text-xs text-gray-400">Cidade: {formData.city}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {formData.name}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">{formData.email}</p>
            </div>
          </div>

          {/* Caixa de Indicações e Economia no Topo */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#12121A] border border-amber-500/30 rounded-2xl px-5 py-3 text-center sm:text-right shadow-md">
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1 sm:justify-end">
                <span>🎁</span>
                <span>Caixa de Indicações</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-display">
                R$ {(userProfile.referralBalance || 0).toFixed(2).replace('.', ',')}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                {(userProfile.referrals || []).length} amigos indicados
              </div>
            </div>

            {isVipUser && (
              <div 
                onClick={() => setIsSavingsModalOpen(true)}
                className="bg-[#12121A] hover:bg-[#161d19] border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl px-5 py-3 text-center sm:text-right shadow-md cursor-pointer transition-all group"
                title="Clique para abrir o Painel Completo de Economia"
              >
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center justify-center sm:justify-end gap-1">
                  <span>Economia com Cupons</span>
                  <span className="text-emerald-400 text-[11px] group-hover:translate-x-0.5 transition-transform">↗</span>
                </div>
                <div className="text-2xl font-black text-emerald-400 font-display">
                  R$ {userProfile.monthlySavings.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-emerald-300/80 font-medium">
                  Ver Extrato & Relatório Detalhado 📊
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegação entre Seções de Configuração */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <User size={16} />
          <span>Dados Pessoais</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <MapPin size={16} />
          <span>Cidade & Notificações</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'subscription'
              ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
              : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <CreditCard size={16} />
          <span>Minha Assinatura VIP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'referrals'
              ? 'bg-gradient-to-r from-amber-500 to-[#FF5F00] text-black font-black shadow-md shadow-orange-600/30'
              : 'bg-[#181824] text-amber-300 hover:text-amber-200 border border-amber-500/20'
          }`}
        >
          <Gift size={16} />
          <span>Divulgue & Ganhe (Caixa: R$ {(userProfile.referralBalance || 0).toFixed(2).replace('.', ',')})</span>
        </button>
      </div>

      {/* Feedback de Sucesso */}
      {savedSuccess && (
        <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 px-5 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 animate-fade-in">
          <Check size={18} className="text-emerald-400" />
          <span>Configurações do perfil atualizadas com sucesso!</span>
        </div>
      )}

      {/* FORMULÁRIO */}
      <form onSubmit={handleSave}>
        
        {/* ABA 1: DADOS PESSOAIS */}
        {activeTab === 'personal' && (
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white mb-2">Informações da Conta</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">CPF (para validação fiscal)</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full bg-[#101017] border border-white/10 focus:border-[#FF5F00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: CIDADE & NOTIFICAÇÕES */}
        {activeTab === 'preferences' && (
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Localização Preferencial</h3>
              <p className="text-xs text-gray-400 mb-4">
                Sua cidade padrão será usada para destacar os cupons perto de você automaticamente.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POPULAR_CITIES.filter(c => c !== 'Todas as Cidades').map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, city })}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      formData.city === city
                        ? 'bg-[#FF5F00]/15 border-[#FF5F00] text-white font-bold'
                        : 'bg-[#101017] border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className={formData.city === city ? 'text-[#FF5F00]' : 'text-gray-500'} />
                      <span>{city}</span>
                    </div>
                    {formData.city === city && <Check size={16} className="text-[#FF5F00]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-base font-bold text-white mb-2">Categorias de Maior Interesse</h3>
              <p className="text-xs text-gray-400 mb-3">
                Selecione as áreas que você mais consome para receber alertas prioritários:
              </p>
              
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                  const isFav = formData.favoriteCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isFav
                          ? 'bg-[#FF5F00] text-white shadow-md'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Bell size={16} className="text-[#FF5F00]" />
                <span>Alertas & Notificações</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#101017] border border-white/5 cursor-pointer">
                  <span className="text-xs text-gray-300">Receber novidades e novos cupons no WhatsApp</span>
                  <input
                    type="checkbox"
                    checked={formData.notifications.whatsapp}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, whatsapp: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#FF5F00] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#101017] border border-white/5 cursor-pointer">
                  <span className="text-xs text-gray-300">Alertar quando novos cupons chegarem na minha cidade</span>
                  <input
                    type="checkbox"
                    checked={formData.notifications.newDeals}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, newDeals: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#FF5F00] rounded"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        )}

        {/* ABA 3: MINHA ASSINATURA */}
        {activeTab === 'subscription' && (
          <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            {isVipUser ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-500/15 via-[#FF5F00]/15 to-transparent border border-amber-500/30 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black px-2.5 py-0.5 rounded-full">
                        Status: Ativo
                      </span>
                      <h3 className="text-xl font-black text-white mt-2">
                        Assinatura VIP
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Renovação mensal automática: <strong>R$ 19,90/mês</strong>
                      </p>
                    </div>

                    <div className="bg-[#121218] border border-white/10 p-4 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 uppercase">Economia Total Acumulada</div>
                      <div className="text-2xl font-black text-emerald-400">
                        R$ {userProfile.monthlySavings.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">Benefícios Ativos na sua Conta:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Acesso ilimitado a todos os cupons VIP
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Geração de QR Codes de balcão sem limites
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Participação nos sorteios mensais
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Atendimento prioritário via WhatsApp VIP
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => cancelSubscription()}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
                  >
                    Simular cancelamento de assinatura
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Alterar Forma de Pagamento
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FF5F00]/20 text-[#FF5F00] flex items-center justify-center text-3xl">
                  🔒
                </div>
                <h3 className="text-2xl font-black text-white">
                  Você ainda não possui uma assinatura VIP ativa
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                  Assine o Melhor Cupom por apenas R$ 19,90/mês para desbloquear descontos de até 50% em todas as lojas credenciadas.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white font-extrabold px-8 py-3 rounded-2xl text-sm shadow-lg shadow-orange-600/30"
                >
                  Assinar Clube VIP Agora
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA 4: PROGRAMA DIVULGUE & GANHE */}
        {activeTab === 'referrals' && (
          <div className="space-y-6 animate-fade-in">
            {/* Toast de Simulação */}
            {userJustEarned && (
              <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 p-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-between animate-fade-in shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span>Amigo <strong>+{userJustEarned.name}</strong> cadastrou-se pelo seu link e gerou <strong>+R$ 5,00</strong> no seu Caixa!</span>
                </div>
                <span className="text-emerald-400 text-base font-black">+R$ 5,00</span>
              </div>
            )}

            {/* Card Saldo no Caixa */}
            <div className="bg-gradient-to-r from-[#201A15] via-[#1A1820] to-[#161622] rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Coins size={16} />
                    <span>Seu Caixa de Indicações</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white font-display">
                      R$ {(userProfile.referralBalance || 0).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Disponível no Caixa
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 max-w-lg">
                    Cada amigo cadastrado rende <strong>R$ 5,00</strong>. Use esse dinheiro para pagar ou abater na sua Assinatura VIP de R$ 19,90!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const res = addReferral('user');
                      setUserJustEarned(res);
                      setTimeout(() => setUserJustEarned(null), 4000);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all"
                  >
                    <Zap size={16} />
                    <span>Simular Indicação (+R$ 5,00)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-[#FF5F00] hover:from-amber-400 hover:to-[#E04F00] text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
                  >
                    <Sparkles size={16} />
                    <span>Usar Saldo no Clube VIP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link de Divulgação */}
            <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 size={18} className="text-[#FF5F00]" />
                <span>Seu Link de Convite Pessoal</span>
              </h3>

              <div className="bg-[#101017] border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-amber-300 font-mono">
                <span className="text-gray-500 select-none">https://</span>
                <span className="text-white font-bold truncate">
                  melhorcupom.com.br/convite/{userProfile.referralCode || 'LUCAS5'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://melhorcupom.com.br/convite/${userProfile.referralCode || 'LUCAS5'}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    copiedLink
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Vem pro Melhor Cupom economizar até 50% em restaurantes, barbearias e lazer! Cadastre-se pelo meu convite: https://melhorcupom.com.br/convite/${userProfile.referralCode || 'LUCAS5'}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Share2 size={16} />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Extrato de Indicações */}
            <div className="bg-[#181824] border border-white/10 rounded-3xl p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Gift size={18} className="text-amber-400" />
                  <span>Amigos Cadastrados com seu Link ({(userProfile.referrals || []).length})</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  Total Acumulado: R$ {(((userProfile.referrals || []).length) * 5).toFixed(2).replace('.', ',')}
                </span>
              </div>

              {(userProfile.referrals || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  Nenhum amigo cadastrado ainda. Compartilhe seu link para começar a ganhar!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(userProfile.referrals || []).map((ref) => (
                    <div 
                      key={ref.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#101017] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <div className="font-bold text-white">{ref.name}</div>
                          <div className="text-[10px] text-gray-400">{ref.date} • Cadastro Concluído</div>
                        </div>
                      </div>

                      <span className="font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        +R$ {ref.bonus.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </form>

    </div>
  );
};
