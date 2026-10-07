import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  X, 
  Search, 
  Printer, 
  CheckCircle2, 
  ExternalLink,
  Scale,
  Eye,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';

export const LegalModal = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'terms' | 'privacy'
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#14141E] border-2 border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/60 flex flex-col overflow-hidden text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER DO MODAL */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#161624] flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-600/30 text-white flex-shrink-0">
              {activeTab === 'terms' ? <Scale size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Documento Oficial
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  <span>Atualizado em Outubro de 2026</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                {activeTab === 'terms' ? 'Termos de Uso da Plataforma' : 'Política de Privacidade & LGPD'}
              </h2>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO E FECHAR */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              title="Imprimir documento"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS & BUSCA RÁPIDA */}
        <div className="px-5 sm:px-6 py-3 bg-[#111119] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'terms'
                  ? 'bg-gradient-to-r from-[#FF5F00] to-[#FF8400] text-white shadow-md shadow-orange-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <FileText size={14} />
              <span>Termos de Uso</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Lock size={14} />
              <span>Política de Privacidade (LGPD)</span>
            </button>
          </div>

          {/* Campo de Busca Interna */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no documento..."
              className="w-full bg-[#1A1A26] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* CONTEÚDO COM ROLAGEM */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-gray-300 scrollbar-thin scrollbar-thumb-orange-500/40">

          {/* ================= ABA 1: TERMOS DE USO ================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 text-xs text-orange-200">
                <strong>Resumo aos Usuários e Parceiros:</strong> Bem-vindo ao <strong>Melhor Cupom</strong>. Ao utilizar nosso site, cadastrar-se ou assinar os serviços, você concorda expressamente com os termos estabelecidos a seguir. Garantimos transparência, segurança e respeito aos seus direitos.
              </div>

              {/* Cláusula 1 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">1</span>
                  <span>Objeto e Funcionamento da Plataforma</span>
                </h3>
                <p>
                  O <strong>Melhor Cupom</strong> (operado sob a plataforma oficial www.omelhorcupom.com.br) é um serviço digital inovador de clube de benefícios, intermediação de cupons promocionais para comércio local e agregador de achadinhos virais com links de afiliados de grandes marketplaces (como Shopee Brasil e Magazine Luiza).
                </p>
                <p>
                  A plataforma conecta membros e usuários a estabelecimentos parceiros credenciados (restaurantes, barbearias, academias, óticas e varejo local) e plataformas de e-commerce, oferecendo vantagens econômicas reais.
                </p>
              </section>

              {/* Cláusula 2 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">2</span>
                  <span>Cadastro de Usuário e Segurança de Acesso</span>
                </h3>
                <p>
                  2.1. O cadastro no Melhor Cupom é gratuito para visualização de ofertas gerais e desbloqueio da aba <strong>Ofertas Imperdíveis</strong>.
                </p>
                <p>
                  2.2. O usuário compromete-se a fornecer informações verdadeiras e atualizadas (Nome completo, CPF, E-mail, WhatsApp e Cidade). O CPF é utilizado estritamente para prevenção a fraudes e controle de limites de resgate por cliente estabelecidos pelos lojistas parceiros.
                </p>
                <p>
                  2.3. A senha cadastrada é pessoal e intransferível, sendo de exclusiva responsabilidade do usuário a guarda e confidencialidade.
                </p>
              </section>

              {/* Cláusula 3 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">3</span>
                  <span>Regras de Resgate e Utilização dos Cupons nos Lojistas</span>
                </h3>
                <p>
                  3.1. Cada cupom gerado na plataforma possui código único alfanumérico e QR Code seguro dinâmico para validação no balcão do estabelecimento comercial.
                </p>
                <p>
                  3.2. O cupom deve ser apresentado pelo titular antes da emissão da conta ou no momento do atendimento no estabelecimento participante.
                </p>
                <p>
                  3.3. Os descontos não são cumulativos com outras promoções locais ativas no estabelecimento, exceto quando explicitamente indicado na descrição do cupom.
                </p>
                <p>
                  3.4. Respeito aos limites: certos cupons podem possuir limitação por CPF (ex: 1 uso por cliente ao mês) para garantir a viabilidade comercial dos estabelecimentos parceiros.
                </p>
              </section>

              {/* Cláusula 4 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">4</span>
                  <span>Assinaturas do Clube VIP, Pagamentos e Garantia de 7 Dias</span>
                </h3>
                <p>
                  4.1. O acesso a benefícios exclusivos do <strong>Clube VIP</strong> pode ser contratado através de planos mensais (R$ 19,90/mês) ou anuais com desconto.
                </p>
                <p>
                  4.2. Os pagamentos são processados com segurança através da operadora oficial <strong>Mercado Pago</strong> via PIX Instantâneo ou Cartão de Crédito.
                </p>
                <p>
                  4.3. <strong>Direito de Arrependimento (Artigo 49 do Código de Defesa do Consumidor):</strong> O assinante tem o direito de cancelar a contratação da assinatura VIP em até 7 (sete) dias corridos após a contratação, com reembolso integral de 100% dos valores pagos, sem qualquer multa ou burocracia.
                </p>
                <p>
                  4.4. O cancelamento pode ser efetuado a qualquer momento diretamente pelo painel de configurações do usuário, sem cláusula de fidelidade nos planos mensais.
                </p>
              </section>

              {/* Cláusula 5 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">5</span>
                  <span>Programa de Indicação (Divulgue & Ganhe)</span>
                </h3>
                <p>
                  5.1. Usuários e lojistas cadastrados recebem códigos de indicação exclusivos para convidar amigos e clientes.
                </p>
                <p>
                  5.2. O crédito gerado por indicações válidas é contabilizado no saldo da conta do participante e pode ser abatido em faturas, mensalidades ou resgatado conforme as normas vigentes do programa. Tentativas de cadastros fictícios geram anulação imediata dos bônus.
                </p>
              </section>

              {/* Cláusula 6 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">6</span>
                  <span>Links de Terceiros e Afiliados (Shopee e Magazine Luiza)</span>
                </h3>
                <p>
                  A seção de Ofertas Imperdíveis exibe produtos recomendados com links redirecionados para marketplaces oficiais parceiros. A compra, entrega, emissão de nota fiscal e garantia dos produtos físicos são de responsabilidade integral das lojas vendedoras e dos respectivos marketplaces.
                </p>
              </section>

              {/* Cláusula 7 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center">7</span>
                  <span>Foro e Legislação Aplicável</span>
                </h3>
                <p>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e o Código de Defesa do Consumidor (Lei nº 8.078/1990). Fica eleito o foro da comarca de domicílio do consumidor para dirimir quaisquer controvérsias.
                </p>
              </section>
            </div>
          )}

          {/* ================= ABA 2: POLÍTICA DE PRIVACIDADE & LGPD ================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200">
                <strong>Compromisso de Privacidade LGPD:</strong> O <strong>Melhor Cupom</strong> preza pela total segurança dos seus dados pessoais. Atuamos em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong>. Seus dados nunca são vendidos a terceiros.
              </div>

              {/* Cláusula 1 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">1</span>
                  <span>Quais Dados Coletamos</span>
                </h3>
                <p>Para proporcionar o funcionamento das ofertas e validação segura, coletamos:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-300">
                  <li><strong>Dados Cadastrais:</strong> Nome completo, endereço de e-mail, número de WhatsApp e senha criptografada.</li>
                  <li><strong>CPF (Cadastro de Pessoa Física):</strong> Solicitado exclusivamente para validação de cupons nominais e prevenção de fraudes no comércio local.</li>
                  <li><strong>Localização Selecionada (Cidade/Estado):</strong> Para filtrar e exibir estabelecimentos e cupons próximos de você.</li>
                  <li><strong>Histórico de Resgates:</strong> Cupons ativados e validados para contabilizar sua economia mensal no painel.</li>
                </ul>
              </section>

              {/* Cláusula 2 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">2</span>
                  <span>Finalidade do Tratamento dos Dados</span>
                </h3>
                <p>Os dados coletados destinam-se exclusivamente para:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                  <li>Permitir a autenticação e acesso à sua conta e benefícios exclusivos;</li>
                  <li>Gerar os códigos de desconto vinculados ao seu perfil e evitar duplicidade de uso;</li>
                  <li>Processar pagamentos de assinaturas de forma criptografada via Mercado Pago;</li>
                  <li>Enviar notificações transacionais sobre confirmação de pagamento ou resgates via WhatsApp ou e-mail (quando autorizado).</li>
                </ul>
              </section>

              {/* Cláusula 3 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">3</span>
                  <span>Compartilhamento Seguro de Informações</span>
                </h3>
                <p>
                  O Melhor Cupom <strong>NÃO comercializa, aluga ou cede bases de dados pessoais</strong> para anunciantes ou empresas de telemarketing.
                </p>
                <p>O compartilhamento ocorre unicamente nos seguintes casos indispensáveis:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                  <li><strong>Com o Estabelecimento Parceiro:</strong> No momento do resgate presencial, o lojista visualiza o nome e os dígitos parciais do CPF para confirmar a autenticidade do cupom no balcão.</li>
                  <li><strong>Com o Gateway de Pagamento (Mercado Pago):</strong> Para emissão de PIX e processamento bancário com certificação PCI-DSS.</li>
                </ul>
              </section>

              {/* Cláusula 4 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">4</span>
                  <span>Segurança da Informação e Armazenamento</span>
                </h3>
                <p>
                  Utilizamos criptografia SSL de 256 bits em todas as conexões (HTTPS), proteção contra ataques automatizados e armazenamento seguro em servidores de alta disponibilidade. Suas senhas são protegidas com algoritmos de hash unidirecional.
                </p>
              </section>

              {/* Cláusula 5 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">5</span>
                  <span>Seus Direitos como Titular de Dados (Art. 18 da LGPD)</span>
                </h3>
                <p>A qualquer momento, o usuário pode exercer seus direitos garantidos pela LGPD:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                  <li>Confirmar a existência de tratamento dos seus dados;</li>
                  <li>Acessar e atualizar suas informações cadastrais pelo painel da conta;</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                  <li>Revogar o consentimento e solicitar a exclusão definitiva da conta.</li>
                </ul>
              </section>

              {/* Cláusula 6 */}
              <section className="space-y-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center">6</span>
                  <span>Encarregado de Dados (DPO) e Canal de Atendimento</span>
                </h3>
                <p>
                  Para dúvidas sobre nossa política ou para solicitar a exclusão de seus dados, você pode entrar em contato diretamente com nossa equipe de privacidade pelo e-mail:
                </p>
                <div className="bg-[#1A1A26] border border-white/10 rounded-xl p-3 inline-block font-mono text-xs text-orange-400">
                  contato@omelhorcupom.com.br
                </div>
              </section>
            </div>
          )}

        </div>

        {/* FOOTER DO MODAL */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161624] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Documentação jurídica certificada para o comércio brasileiro.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-r from-[#FF5F00] to-[#FF8400] hover:from-[#E04F00] hover:to-[#FF7700] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            Entendi e Concordo
          </button>
        </div>

      </div>
    </div>
  );
};
