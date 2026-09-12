import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, Store, User, RotateCcw, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentRole, switchRole, resetToFactoryDefaults, isVipUser } = useApp();

  const roles = [
    {
      id: 'visitor',
      name: 'Visitante (Não-Pagante)',
      icon: User,
      badge: 'Bloqueado',
      badgeColor: 'bg-gray-700 text-gray-300',
      description: 'Vê o catálogo, mas cupons exigem assinatura'
    },
    {
      id: 'vip',
      name: 'Assinante VIP Ouro',
      icon: Sparkles,
      badge: 'Membro Ativo',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold',
      description: 'Acesso liberado a todos os cupons e QR Codes'
    },
    {
      id: 'merchant_burger',
      name: 'Lojista: Smash Burger',
      icon: Store,
      badge: 'Parceiro',
      badgeColor: 'bg-orange-600 text-white',
      description: 'Painel da hamburgueria: criar cupons e validar balcão'
    },
    {
      id: 'merchant_barber',
      name: 'Lojista: Barbearia Don Corleone',
      icon: Store,
      badge: 'Parceiro',
      badgeColor: 'bg-purple-600 text-white',
      description: 'Painel da barbearia: criar ofertas e validar no caixa'
    },
    {
      id: 'admin',
      name: 'Visão Geral / Admin',
      icon: Shield,
      badge: 'Gestão',
      badgeColor: 'bg-blue-600 text-white',
      description: 'Visualizar métricas e ecossistema completo'
    }
  ];

  return (
    <div className="bg-[#121217] border-b border-white/10 px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full text-gray-300 font-medium border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Simulador de Perfis:
          </span>
          <span className="hidden lg:inline text-gray-500">
            Alterne entre cliente e lojista para testar os fluxos em tempo real
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map(role => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => switchRole(role.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-[#FF5F00] text-white shadow-sm ring-2 ring-orange-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                }`}
                title={role.description}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{role.name}</span>
                {isActive && <Check size={13} className="text-white ml-0.5" />}
              </button>
            );
          })}

          <button
            onClick={resetToFactoryDefaults}
            className="flex items-center gap-1 px-2.5 py-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
            title="Resetar todos os cupons e histórico para os valores iniciais"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Resetar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
