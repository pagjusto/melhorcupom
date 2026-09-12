import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Sparkles, 
  QrCode, 
  PiggyBank, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

export const HowItWorksView = () => {
  const { setIsSubscriptionModalOpen, switchRole } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-16">
      
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#FF5F00]/20 text-[#FF5F00] border border-[#FF5F00]/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={13} />
          <span>O MODELO GANHA-GANHA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display">
          Como o <span className="text-[#FF5F00]">Melhor Cupom</span> funciona?
        </h1>
        <p className="text-gray-300 text-base mt-4 leading-relaxed">
          Uma plataforma inteligente onde lojistas ganham novos clientes sem pagar anúncios caros, e os assinantes economizam centenas de reais todos os meses.
        </p>
      </div>

      {/* Grid: Usuário vs Lojista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna 1: Para Usuários Pagantes */}
        <div className="bg-[#181824] border-2 border-[#FF5F00]/30 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#FF5F00]/20 text-[#FF5F00] flex items-center justify-center text-2xl mb-6 shadow-inner">
              👑
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              Para Usuários (Assinantes VIP)
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Você investe um valor simbólico de <strong className="text-orange-400">R$ 14,90 por mês</strong> e tem acesso livre aos melhores descontos da sua cidade.
            </p>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-white block">Assine o Clube VIP:</strong>
                  Tenha acesso imediato a todas as promoções de restaurantes, academias e lojas.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-white block">Gere o QR Code no balcão:</strong>
                  Ao consumir no local, clique em "Resgatar" e mostre a tela do celular ao atendente.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-white block">Economia imediata na conta:</strong>
                  Desconto de até 50% aplicado na hora. Recupere o valor da sua assinatura no 1º uso!
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10">
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="w-full bg-[#FF5F00] hover:bg-[#E04F00] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Quero Assinar o VIP por R$ 14,90</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Coluna 2: Para Lojistas Parceiros */}
        <div className="bg-[#181824] border-2 border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-6 shadow-inner">
              🏪
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              Para Lojistas & Comerciantes
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Cadastre sua loja gratuitamente e atraia clientes com alto poder de consumo nos dias e horários que você mais precisa.
            </p>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-white block">Cadastre suas ofertas exclusivas:</strong>
                  Defina porcentagem, desconto em reais, dias de validade e regras de consumo mínimo.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-white block">Público pagante e qualificado:</strong>
                  Apenas membros que pagam assinatura têm acesso, garantindo clientes decididos a gastar.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-white block">Validação à prova de fraude:</strong>
                  O caixa digita ou lê o QR Code em nosso validador seguro para dar baixa instantânea.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10">
            <button
              onClick={() => {
                switchRole('merchant_burger');
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold py-3.5 px-6 rounded-2xl border border-white/15 text-sm transition-all flex items-center justify-center gap-2"
            >
              <Store size={16} className="text-orange-400" />
              <span>Acessar Painel do Comerciante</span>
            </button>
          </div>
        </div>

      </div>

      {/* FAQ Rápido */}
      <div className="bg-[#14141C] border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-black text-white text-center mb-6">
          Perguntas Frequentes (FAQ)
        </h3>

        <div className="space-y-4 text-sm">
          <div className="bg-white/5 p-4 rounded-2xl">
            <h4 className="font-bold text-white mb-1">Qual o prazo de validade do QR Code gerado?</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              O QR Code gerado pelo membro VIP fica ativo por 20 minutos para que o atendente dê a baixa no caixa do estabelecimento.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl">
            <h4 className="font-bold text-white mb-1">O lojista paga alguma mensalidade?</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Não. O lojista parceiro apenas oferece a condição comercial exclusiva para os membros VIP do Melhor Cupom, gerando movimento para o seu negócio sem custos fixos de anúncio.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl">
            <h4 className="font-bold text-white mb-1">Como faço para cancelar minha assinatura VIP?</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Com 1 clique dentro da área do membro ou entrando em contato com nosso suporte. Não há período de carência ou multas.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
