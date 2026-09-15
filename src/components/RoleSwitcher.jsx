import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Sparkles, 
  Store, 
  User, 
  UserCheck, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Crown, 
  Building2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoleSwitcher = () => {
  const { 
    currentRole, 
    startSimulation, 
    exitSimulation, 
    resetToFactoryDefaults, 
    stores 
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  const customStores = (stores || []).filter(
    s => s.merchantId !== 'merchant_burger' && s.merchantId !== 'merchant_barber'
  );

  const roles = [
    {
      id: 'admin',
      name: 'Painel ADM Master (Renan Zanferrari)',
      roleType: 'Administrador Geral',
      icon: Shield,
      badge: 'Master Admin',
      badgeColor: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      accentColor: 'border-blue-500/50 hover:border-blue-400 shadow-blue-950/40',
      iconBg: 'bg-blue-600/20 text-blue-400',
      description: 'Seu perfil master: visão consolidada de faturamento, gestão de lojistas, usuários cadastrados e métricas por cidade.',
      targetTab: 'admin-dashboard'
    },
    {
      id: 'visitor',
      name: 'Visitante da Plataforma',
      roleType: 'Público Geral (Não-Logado)',
      icon: User,
      badge: 'Sem Login',
      badgeColor: 'bg-gray-800 text-gray-300 border-gray-700',
      accentColor: 'border-white/10 hover:border-white/20 shadow-black/40',
      iconBg: 'bg-white/10 text-gray-300',
      description: 'Experiência de um novo visitante que ainda não fez login: vê os cupons com visualização limitada e botões de login/cadastro.',
      targetTab: 'explore'
    },
    {
      id: 'user_free',
      name: 'Usuário Cadastrado (Sem VIP)',
      roleType: 'Cliente Free',
      icon: UserCheck,
      badge: 'Plano Gratuito',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentColor: 'border-amber-500/30 hover:border-amber-400 shadow-amber-950/20',
      iconBg: 'bg-amber-500/20 text-amber-400',
      description: 'Conta cadastrada com perfil, carteira de indicações (R$ 5,00 por amigo), mas ainda sem a assinatura VIP de R$ 19,90.',
      targetTab: 'user-profile'
    },
    {
      id: 'vip',
      name: 'Assinante VIP Completo',
      roleType: 'Assinante Fidelidade (R$ 19,90)',
      icon: Crown,
      badge: 'Membro VIP',
      badgeColor: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40',
      accentColor: 'border-orange-500/40 hover:border-orange-400 shadow-orange-950/30',
      iconBg: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      description: 'Todos os cupons desbloqueados com QR Code ativo, extrato detalhado de economia e prioridade máxima nas ofertas.',
      targetTab: 'explore'
    },
    {
      id: 'merchant_burger',
      name: 'Lojista: Smash Burger Club',
      roleType: 'Hamburgueria Física (Plano Ouro)',
      icon: Store,
      badge: 'Parceiro Ouro',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      accentColor: 'border-orange-500/30 hover:border-orange-400 shadow-orange-950/30',
      iconBg: 'bg-orange-500/20 text-orange-400',
      description: 'Painel do lojista: publicação de cupons, validador de balcão (código de 6 dígitos e QR Code) e métricas de vendas.',
      targetTab: 'merchant-dashboard'
    },
    {
      id: 'merchant_barber',
      name: 'Lojista: Barbearia Don Corleone',
      roleType: 'Barbearia Física (Plano Prata)',
      icon: Store,
      badge: 'Parceiro Prata',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentColor: 'border-purple-500/30 hover:border-purple-400 shadow-purple-950/20',
      iconBg: 'bg-purple-500/20 text-purple-400',
      description: 'Painel do comerciante do ramo de beleza e bem-estar, com validações no caixa e kit de divulgação para redes sociais.',
      targetTab: 'merchant-dashboard'
    },
    ...customStores.map(store => ({
      id: store.merchantId || store.id,
      name: `Lojista: ${store.name}`,
      roleType: `${store.category || 'Comércio'} (${store.city || 'Brasil'})`,
      icon: Building2,
      badge: `Plano ${(store.tier || 'free').toUpperCase()}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentColor: 'border-emerald-500/30 hover:border-emerald-400 shadow-emerald-950/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      description: `Painel da loja parceira ${store.name}, localizada em ${store.city || 'Brasil'}.`,
      targetTab: 'merchant-dashboard'
    }))
  ];

  const handleSelectRole = (role) => {
    if (role.id === 'admin') {
      exitSimulation();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#6366F1', '#10B981']
      });
    } else {
      startSimulation(role.id);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF5F00', '#F59E0B', '#3B82F6']
      });
    }
  };

  const handleExecuteReset = () => {
    resetToFactoryDefaults();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* CABEÇALHO DO SIMULADOR */}
      <div className="bg-gradient-to-r from-[#161626] via-[#1B1B32] to-[#161626] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-blue-400" />
              <span>Ambiente de Testes do Administrador Master</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2">
              <span>Simulador de Perfis e Permissões</span>
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                Exclusivo ADM
              </span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Como Administrador Master (<strong className="text-white">Renan Zanferrari</strong>), você pode simular instantaneamente como qualquer cliente, assinante VIP ou lojista enxerga a plataforma. Ao selecionar um perfil, você poderá navegar nas telas daquele usuário e retornar ao seu Painel ADM a qualquer momento através do banner de simulação no topo.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <div className="text-xs text-gray-400 font-medium">Perfil Ativo Agora:</div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-white font-extrabold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{roles.find(r => r.id === currentRole)?.name || currentRole}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE CARDS DOS PERFIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;

          return (
            <div
              key={role.id}
              className={`rounded-2xl p-5 border transition-all relative flex flex-col justify-between group ${
                isActive
                  ? 'bg-gradient-to-b from-[#1C1C2E] to-[#161624] border-[#FF5F00] shadow-lg shadow-orange-950/30 ring-2 ring-orange-500/40'
                  : `bg-[#13131D] ${role.accentColor}`
              }`}
            >
              <div>
                {/* Topo do Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md ${role.iconBg}`}>
                    <Icon size={20} />
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                {/* Título e Papel */}
                <div className="text-xs text-gray-400 font-semibold mb-0.5">{role.roleType}</div>
                <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                  {role.name}
                </h3>

                {/* Descrição */}
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Botão de Ação */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                {isActive ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/30">
                    <Check size={14} />
                    <span>Perfil Ativo Agora</span>
                  </div>
                ) : (
                  <button
                    data-sim-role={role.id}
                    onClick={() => handleSelectRole(role)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-white/10 hover:bg-[#FF5F00] border border-white/10 hover:border-[#FF5F00] transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-orange-600/30 cursor-pointer"
                  >
                    <span>{role.id === 'admin' ? 'Retornar ao ADM Master' : `Simular ${role.name}`}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FERRAMENTA DE RESET / RESTAURAR DADOS DE FÁBRICA */}
      <div className="bg-[#14141E] border border-red-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center flex-shrink-0">
            <RotateCcw size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Restaurar Dados Padrão de Fábrica</span>
              <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Zona de Testes</span>
            </div>
            <p className="text-xs text-gray-400">
              Restaura a lista inicial de cupons, lojas, usuários e histórico de resgates simulados, limpando alterações de teste.
            </p>
          </div>
        </div>

        <div>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Resetar Dados</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExecuteReset}
                className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                Confirmar Reset Total
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
