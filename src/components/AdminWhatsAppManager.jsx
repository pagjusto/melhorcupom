import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  MapPin, 
  Search, 
  Plus, 
  Check, 
  Copy, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Store, 
  X, 
  Building2, 
  Tag,
  AlertCircle,
  HelpCircle,
  Users,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Diretório base de estabelecimentos e potenciais parceiros locais por cidade
const DEFAULT_COMMERCE_DIRECTORY = [
  // SÃO PAULO - SP
  {
    id: 'comm_sp_1',
    name: 'Pizzaria Veridiana Jardins',
    category: 'gastronomia',
    city: 'São Paulo - SP',
    neighborhood: 'Jardins',
    phone: '(11) 98123-4567',
    responsible: 'Gerente Carlos',
    status: 'pending',
    type: 'Pizzaria Tradicional',
    rating: 4.8
  },
  {
    id: 'comm_sp_2',
    name: 'Café Santo Grão Oscar Freire',
    category: 'gastronomia',
    city: 'São Paulo - SP',
    neighborhood: 'Cerqueira César',
    phone: '(11) 97234-5678',
    responsible: 'Juliana (Coord. Marketing)',
    status: 'pending',
    type: 'Cafeteria & Bistrô',
    rating: 4.9
  },
  {
    id: 'comm_sp_3',
    name: 'Barbearia Corleone Faria Lima',
    category: 'beleza',
    city: 'São Paulo - SP',
    neighborhood: 'Itaim Bibi',
    phone: '(11) 98345-6789',
    responsible: 'Mestre Barbeiro Rodrigo',
    status: 'pending',
    type: 'Barbearia Premium',
    rating: 4.8
  },
  {
    id: 'comm_sp_4',
    name: 'Academia Bio Ritmo Paulista',
    category: 'fitness',
    city: 'São Paulo - SP',
    neighborhood: 'Bela Vista',
    phone: '(11) 99456-7890',
    responsible: 'Coord. Comercial Vanessa',
    status: 'pending',
    type: 'Academia & Fitness',
    rating: 4.7
  },
  {
    id: 'comm_sp_5',
    name: 'Momo Gelato Vila Madalena',
    category: 'gastronomia',
    city: 'São Paulo - SP',
    neighborhood: 'Vila Madalena',
    phone: '(11) 98567-8901',
    responsible: 'Felipe (Sócio)',
    status: 'pending',
    type: 'Gelateria Artesanal',
    rating: 4.9
  },

  // RIO DE JANEIRO - RJ
  {
    id: 'comm_rio_1',
    name: 'Churrascaria Palace Copacabana',
    category: 'gastronomia',
    city: 'Rio de Janeiro - RJ',
    neighborhood: 'Copacabana',
    phone: '(21) 98111-2233',
    responsible: 'Sr. Antônio',
    status: 'pending',
    type: 'Churrascaria Tradicional',
    rating: 4.8
  },
  {
    id: 'comm_rio_2',
    name: 'Bar do David Chapéu Mangueira',
    category: 'gastronomia',
    city: 'Rio de Janeiro - RJ',
    neighborhood: 'Leme',
    phone: '(21) 97222-3344',
    responsible: 'David Bispo',
    status: 'pending',
    type: 'Boteco Premiado',
    rating: 4.9
  },
  {
    id: 'comm_rio_3',
    name: 'Studio Leblon Pilates & Fisioterapia',
    category: 'fitness',
    city: 'Rio de Janeiro - RJ',
    neighborhood: 'Leblon',
    phone: '(21) 99333-4455',
    responsible: 'Dra. Camila',
    status: 'pending',
    type: 'Saúde & Bem-Estar',
    rating: 4.9
  },
  {
    id: 'comm_rio_4',
    name: 'Armazém do Café Ipanema',
    category: 'gastronomia',
    city: 'Rio de Janeiro - RJ',
    neighborhood: 'Ipanema',
    phone: '(21) 98444-5566',
    responsible: 'Gerente Marcos',
    status: 'pending',
    type: 'Cafeteria & Grãos Especiais',
    rating: 4.7
  },

  // CURITIBA - PR
  {
    id: 'comm_cwb_1',
    name: 'Madalosso Restaurante',
    category: 'gastronomia',
    city: 'Curitiba - PR',
    neighborhood: 'Santa Felicidade',
    phone: '(41) 98877-6655',
    responsible: 'Coordenação Comercial',
    status: 'pending',
    type: 'Restaurante Típico Italiano',
    rating: 4.9
  },
  {
    id: 'comm_cwb_2',
    name: 'Bar do Alemão Largo da Ordem',
    category: 'gastronomia',
    city: 'Curitiba - PR',
    neighborhood: 'São Francisco',
    phone: '(41) 99988-7766',
    responsible: 'Gerência de Atendimento',
    status: 'pending',
    type: 'Chopperia & Gastronomia Alemã',
    rating: 4.8
  },
  {
    id: 'comm_cwb_3',
    name: 'Barba Urbana Batel',
    category: 'beleza',
    city: 'Curitiba - PR',
    neighborhood: 'Batel',
    phone: '(41) 97766-5544',
    responsible: 'Lucas Barbeiro',
    status: 'pending',
    type: 'Barbearia & Estilo Masculino',
    rating: 4.8
  },

  // BELO HORIZONTE - MG
  {
    id: 'comm_bh_1',
    name: 'Dona Lucinha Restaurante',
    category: 'gastronomia',
    city: 'Belo Horizonte - MG',
    neighborhood: 'Funcionários',
    phone: '(31) 98765-1234',
    responsible: 'Márcia Lucinha',
    status: 'pending',
    type: 'Comida Mineira Raiz',
    rating: 4.9
  },
  {
    id: 'comm_bh_2',
    name: 'Cervejaria Stadt Júpiter Lourdes',
    category: 'gastronomia',
    city: 'Belo Horizonte - MG',
    neighborhood: 'Lourdes',
    phone: '(31) 97654-2345',
    responsible: 'Mestre Cervejeiro André',
    status: 'pending',
    type: 'Brewpub & Petiscaria',
    rating: 4.8
  },

  // CAMPINAS - SP
  {
    id: 'comm_camp_1',
    name: 'Giovannetti Cambuí',
    category: 'gastronomia',
    city: 'Campinas - SP',
    neighborhood: 'Cambuí',
    phone: '(19) 98122-3344',
    responsible: 'Gerente Marcelo',
    status: 'pending',
    type: 'Chopperia & Lanches Tradicionais',
    rating: 4.8
  },
  {
    id: 'comm_camp_2',
    name: 'CrossFit Campinas Taquaral',
    category: 'fitness',
    city: 'Campinas - SP',
    neighborhood: 'Taquaral',
    phone: '(19) 99233-4455',
    responsible: 'Coach Thiago',
    status: 'pending',
    type: 'Centro de Treinamento',
    rating: 4.9
  },

  // SANTOS - SP
  {
    id: 'comm_santos_1',
    name: 'Restaurante Vista ao Mar Santos',
    category: 'gastronomia',
    city: 'Santos - SP',
    neighborhood: 'Ponta da Praia',
    phone: '(13) 98811-9988',
    responsible: 'Sr. Manuel',
    status: 'pending',
    type: 'Frutos do Mar & Peixes',
    rating: 4.8
  }
];

const PREDEFINED_TEMPLATES = [
  {
    id: 'convite_gratis',
    name: '1. Cadastro Gratuito & Link (Oficial)',
    badge: 'Alta Conversão',
    text: `Olá, equipe da {loja}! Tudo bem?\n\nMe chamo Renan e sou administrador da plataforma *Melhor Cupom* aqui em {cidade}.\n\nEstamos selecionando comércios de destaque em {cidade} para cadastrar ofertas exclusivas e atrair centenas de novos clientes para o seu estabelecimento, sem nenhuma taxa de adesão !\n\nSe você nao esta no melhor cupom , voce esta perdendo !\ncadastre gratuitamente uma oferta de cupom para milhares de possiveis clientes novos !\nwww.omelhorcupom.com.br`
  },
  {
    id: 'proposta_irrecusavel_balcao',
    name: '2. Lotar Balcão & Risco Zero',
    badge: 'Proposta Irrecusável',
    text: `Olá, {responsavel} da {loja}! Tudo bem?\n\nAqui é o Renan, do *Melhor Cupom* em {cidade}.\n\nTenho uma proposta irrecusável: queremos colocar novos clientes pagantes dentro da {loja} já nesta semana, sem você gastar nem 1 centavo com anúncio ou mensalidade!\n\nNossos membros VIP são pessoas da sua região que pagam para ter acesso a descontos exclusivos e estão buscando lugares como a {loja} em {cidade}. Você só oferece a vantagem quando o cliente for consumir no seu estabelecimento!\n\nÉ risco ZERO e faturamento direto no seu caixa.\n\nSe você não está no Melhor Cupom, você está perdendo vendas todos os dias!\n\nCadastre gratuitamente a sua oferta agora:\nwww.omelhorcupom.com.br`
  },
  {
    id: 'destaque_ouro_gratis',
    name: '3. Topo Ouro Grátis (30 Dias)',
    badge: 'Vaga VIP Topo',
    text: `Olá, equipe da {loja}! Tudo bem?\n\nAqui é o Renan, diretor da plataforma *Melhor Cupom* em {cidade}.\n\nEstamos liberando uma condição exclusiva e irrecusável de lançamento: selecionamos a {loja} para ganhar **30 dias de Destaque Ouro no Topo do App 100% Grátis** na categoria de {categoria}!\n\nSua marca vai aparecer em primeiro lugar para milhares de pessoas que buscam onde comer, comprar e contratar serviços em {cidade}.\n\nNão perca essa vaga para o seu concorrente. Garanta seu topo gratuito agora:\nwww.omelhorcupom.com.br\n(Vagas limitadas para comércios em {cidade})`
  },
  {
    id: 'zero_taxa_lucro_total',
    name: '4. Zero Taxa & 100% no seu Bolso',
    badge: 'Sem Comissão',
    text: `Olá equipe da {loja}, tudo bem?\n\nMe chamo Renan, do *Melhor Cupom* em {cidade}.\n\nVocê sabia que a maioria dos apps convencionais chegam a tirar até 27% do seu faturamento em taxas e comissões?\n\nNo *Melhor Cupom* a nossa proposta é simples e irrecusável:\n✅ Taxa de adesão: ZERO\n✅ Taxa de comissão: ZERO\n✅ 100% do valor da conta do cliente fica no seu caixa!\n\nNós trazemos clientes qualificados até a {loja} e você não divide 1 centavo do seu lucro com ninguém.\n\nCadastre sua oferta gratuita em menos de 2 minutos:\nwww.omelhorcupom.com.br`
  },
  {
    id: 'conversa_rapida',
    name: '5. Áudio Rápido (Conversa 2 Min)',
    badge: 'Aproximação Direta',
    text: `Olá, {responsavel} da {loja}! Tudo bem?\n\nAqui é o Renan do *Melhor Cupom* em {cidade}.\n\nEstamos direcionando centenas de membros VIP para comércios parceiros na nossa cidade, sem cobrar nenhuma taxa de entrada.\n\nSe você não está no Melhor Cupom, seu comércio está deixando dinheiro na mesa todos os dias!\n\nPodemos conversar 2 minutinhos para eu te mostrar como funciona na prática? Dá uma olhada no site oficial:\nwww.omelhorcupom.com.br\n\nPosso te mandar um áudio de 1 minuto explicando como ativar hoje?`
  },
  {
    id: 'custom',
    name: '6. Mensagem Personalizada',
    badge: 'Customizada',
    text: `Olá {loja}, aqui é o Renan do Melhor Cupom em {cidade}! Tenho uma proposta irrecusável para trazer novos clientes para a {loja} com custo ZERO e sem comissões. Cadastre grátis em www.omelhorcupom.com.br ou responda aqui para falarmos 2 minutos!`
  }
];

const TOP_CITIES_QUICK = [
  'Todas as Cidades',
  'São Paulo - SP',
  'Rio de Janeiro - RJ',
  'Curitiba - PR',
  'Belo Horizonte - MG',
  'Campinas - SP',
  'Santos - SP',
  'Porto Alegre - RS',
  'Brasília - DF',
  'Salvador - BA'
];

export const AdminWhatsAppManager = () => {
  const { stores } = useApp();

  // Cidade selecionada para busca
  const [cityInput, setCityInput] = useState('São Paulo - SP');
  const [activeQuickCity, setActiveQuickCity] = useState('São Paulo - SP');
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'sent' | 'negotiating' | 'closed'

  // Modelos de Mensagem
  const [selectedTemplateId, setSelectedTemplateId] = useState('convite_gratis');
  const [customMessage, setCustomMessage] = useState(PREDEFINED_TEMPLATES[0].text);

  // Histórico de Contatos e Comércios Customizados salvos no LocalStorage
  const [contactHistory, setContactHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mc_admin_whatsapp_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customBusinesses, setCustomBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem('mc_admin_custom_businesses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal para Adicionar Novo Comércio na Cidade
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCommerceForm, setNewCommerceForm] = useState({
    name: '',
    category: 'gastronomia',
    city: 'São Paulo - SP',
    neighborhood: '',
    phone: '',
    responsible: ''
  });

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Salvar no LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mc_admin_whatsapp_history', JSON.stringify(contactHistory));
    } catch (e) {
      console.error(e);
    }
  }, [contactHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('mc_admin_custom_businesses', JSON.stringify(customBusinesses));
    } catch (e) {
      console.error(e);
    }
  }, [customBusinesses]);

  // Atualizar template quando selecionado
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = PREDEFINED_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setCustomMessage(tmpl.text);
    }
  };

  // Unificar Lojas do App + Diretório Extra + Comércios Customizados
  const allBusinesses = useMemo(() => {
    const fromStores = stores
      .filter(s => s.type !== 'online' && s.phone)
      .map(s => ({
        id: `store_${s.id}`,
        name: s.name,
        category: s.category || 'gastronomia',
        city: s.city || 'São Paulo - SP',
        neighborhood: s.address ? s.address.split('-')[0] : 'Centro',
        phone: s.phone,
        responsible: 'Responsável Comercial',
        type: s.tier === 'gold' ? 'Loja Parceira Ouro' : s.tier === 'silver' ? 'Loja Parceira Prata' : 'Loja Parceira',
        rating: s.rating || 4.8,
        isPartner: true,
        logoImage: s.logoImage,
        logo: s.logo
      }));

    return [...fromStores, ...DEFAULT_COMMERCE_DIRECTORY, ...customBusinesses];
  }, [stores, customBusinesses]);

  // Filtragem Dinâmica por Cidade e Termo de Busca
  const filteredBusinesses = useMemo(() => {
    return allBusinesses.filter(item => {
      // Filtro de Cidade
      if (cityInput.trim() && cityInput !== 'Todas as Cidades') {
        const cleanInput = cityInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const cleanItemCity = item.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        if (!cleanItemCity.includes(cleanInput) && !cleanInput.includes(cleanItemCity)) {
          return false;
        }
      }

      // Filtro de Busca por Nome/Bairro
      if (storeSearchQuery.trim()) {
        const term = storeSearchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesNeighborhood = (item.neighborhood || '').toLowerCase().includes(term);
        const matchesResp = (item.responsible || '').toLowerCase().includes(term);
        if (!matchesName && !matchesNeighborhood && !matchesResp) return false;
      }

      // Filtro de Categoria
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Filtro de Status
      const currentStatus = contactHistory[item.id]?.status || item.status || 'pending';
      if (statusFilter !== 'all' && currentStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [allBusinesses, cityInput, storeSearchQuery, selectedCategory, statusFilter, contactHistory]);

  // Compilador da Mensagem para uma Loja Específica
  const compileMessageForStore = (store) => {
    let msg = customMessage;
    msg = msg.replace(/{loja}/g, store.name);
    msg = msg.replace(/{cidade}/g, store.city.split('-')[0].trim());
    msg = msg.replace(/{categoria}/g, store.type || 'Comércio Local');
    msg = msg.replace(/{responsavel}/g, store.responsible || 'Responsável');
    return msg;
  };

  // Limpar e formatar telefone para WhatsApp URL (DDI 55 + DDD + Número)
  const getCleanPhoneForWhatsApp = (phoneStr) => {
    const digits = (phoneStr || '').replace(/\D/g, '');
    if (digits.startsWith('55')) return digits;
    return `55${digits}`;
  };

  // Ação de Abrir no WhatsApp Direto
  const handleOpenWhatsApp = (store) => {
    const cleanPhone = getCleanPhoneForWhatsApp(store.phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      alert(`Telefone inválido para ${store.name}: ${store.phone}`);
      return;
    }

    const message = compileMessageForStore(store);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Atualizar status de contato
    const now = new Date();
    const formattedDate = `Hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    setContactHistory(prev => ({
      ...prev,
      [store.id]: {
        status: 'sent',
        lastContactAt: formattedDate,
        lastMessage: message
      }
    }));

    // Abrir o WhatsApp
    window.open(whatsappUrl, '_blank');
    showToast(`WhatsApp de ${store.name} aberto com mensagem pronta!`);
  };

  // Ação de Copiar Mensagem
  const handleCopyMessage = (store) => {
    const message = compileMessageForStore(store);
    navigator.clipboard.writeText(message);
    showToast(`Mensagem personalizada para ${store.name} copiada!`);
  };

  // Ação de Copiar Telefone
  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    showToast(`Telefone ${phone} copiado!`);
  };

  // Alterar Status Manualmente
  const handleUpdateStatus = (storeId, newStatus) => {
    const now = new Date();
    const formattedDate = `Hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    setContactHistory(prev => ({
      ...prev,
      [storeId]: {
        ...(prev[storeId] || {}),
        status: newStatus,
        lastContactAt: prev[storeId]?.lastContactAt || formattedDate
      }
    }));

    if (newStatus === 'closed') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast('🎉 Parceria fechada com sucesso! Parabéns!');
    } else {
      showToast('Status de contato atualizado!');
    }
  };

  // Submissão do Formulário de Novo Comércio
  const handleCreateCommerce = (e) => {
    e.preventDefault();
    if (!newCommerceForm.name.trim() || !newCommerceForm.phone.trim()) {
      alert('Preencha o nome do comércio e o número de WhatsApp!');
      return;
    }

    const newId = `custom_comm_${Date.now()}`;
    const newStore = {
      id: newId,
      name: newCommerceForm.name.trim(),
      category: newCommerceForm.category,
      city: newCommerceForm.city || cityInput || 'São Paulo - SP',
      neighborhood: newCommerceForm.neighborhood.trim() || 'Bairro Comercial',
      phone: newCommerceForm.phone.trim(),
      responsible: newCommerceForm.responsible.trim() || 'Gerente',
      status: 'pending',
      type: 'Novo Comércio Cadastrado',
      rating: 5.0
    };

    setCustomBusinesses(prev => [newStore, ...prev]);
    setIsAddModalOpen(false);
    setNewCommerceForm({
      name: '',
      category: 'gastronomia',
      city: cityInput || 'São Paulo - SP',
      neighborhood: '',
      phone: '',
      responsible: ''
    });

    showToast(`Comércio "${newStore.name}" adicionado com sucesso à cidade ${newStore.city}!`);
  };

  // Estatísticas Rápidas
  const stats = useMemo(() => {
    let sentCount = 0;
    let negotiatingCount = 0;
    let closedCount = 0;
    let pendingCount = 0;

    filteredBusinesses.forEach(item => {
      const status = contactHistory[item.id]?.status || item.status || 'pending';
      if (status === 'sent') sentCount++;
      else if (status === 'negotiating') negotiatingCount++;
      else if (status === 'closed') closedCount++;
      else pendingCount++;
    });

    return {
      total: filteredBusinesses.length,
      sentCount,
      negotiatingCount,
      closedCount,
      pendingCount
    };
  }, [filteredBusinesses, contactHistory]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* TOAST DE FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E2D] border-2 border-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-r from-[#121B18] via-[#14231E] to-[#121B18] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <MessageCircle size={15} className="text-emerald-400" />
              <span>Disparador & Prospecção Comercial</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-[10px]">WhatsApp Direto</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display flex flex-wrap items-center gap-3">
              <span>Gerenciador de Mensagens de Divulgação</span>
              <span className="text-xs bg-emerald-600 text-white font-black px-3 py-1 rounded-xl uppercase tracking-wider">
                1-Click WhatsApp
              </span>
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Pesquise qualquer cidade para listar todas as lojas e estabelecimentos comerciais locais. Com um único clique, abra o WhatsApp da empresa com a mensagem de divulgação personalizada já preenchida!
            </p>
          </div>

          {/* Botão de Ação Rápida: Adicionar Comércio */}
          <button
            onClick={() => {
              setNewCommerceForm(prev => ({ ...prev, city: cityInput || 'São Paulo - SP' }));
              setIsAddModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-900/50 transition-all hover:scale-105 cursor-pointer flex-shrink-0"
          >
            <Plus size={18} />
            <span>+ Cadastrar Novo Comércio na Cidade</span>
          </button>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] text-gray-400 block mb-1">Comércios Encontrados</span>
            <strong className="text-xl sm:text-2xl font-black text-white font-mono">{stats.total}</strong>
            <span className="text-[10px] text-emerald-400 block mt-0.5">em {cityInput || 'todas'}</span>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] text-gray-400 block mb-1">Mensagens Enviadas</span>
            <strong className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{stats.sentCount}</strong>
            <span className="text-[10px] text-gray-500 block mt-0.5">via WhatsApp</span>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] text-gray-400 block mb-1">Em Negociação</span>
            <strong className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{stats.negotiatingCount}</strong>
            <span className="text-[10px] text-gray-500 block mt-0.5">interessados</span>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] text-gray-400 block mb-1">Parcerias Fechadas</span>
            <strong className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{stats.closedCount}</strong>
            <span className="text-[10px] text-cyan-300 block mt-0.5">novos parceiros</span>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE SELEÇÃO E BUSCA POR CIDADE */}
      <div className="bg-[#14141E] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Campo de Cidade */}
          <div className="relative flex-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin size={13} className="text-[#FF5F00]" />
              <span>Digite a Cidade para Buscar Lojas e Comércios:</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setActiveQuickCity('');
                }}
                placeholder="Digite a cidade (ex: São Paulo, Rio de Janeiro, Curitiba, Santos, Campinas...)"
                className="w-full bg-[#1A1A27] hover:bg-[#202032] focus:bg-[#232338] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm pl-10 pr-24 py-3 rounded-2xl placeholder-gray-500 focus:outline-none transition-all font-medium"
              />
              {cityInput && (
                <button
                  onClick={() => {
                    setCityInput('');
                    setActiveQuickCity('');
                  }}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Campo de Filtro de Nome do Estabelecimento */}
          <div className="w-full md:w-72">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Store size={13} className="text-blue-400" />
              <span>Filtrar por Nome da Loja / Bairro:</span>
            </label>
            <input
              type="text"
              value={storeSearchQuery}
              onChange={(e) => setStoreSearchQuery(e.target.value)}
              placeholder="Ex: Restaurante, Barbearia..."
              className="w-full bg-[#1A1A27] hover:bg-[#202032] focus:bg-[#232338] border border-white/15 focus:border-blue-500 text-white text-xs sm:text-sm px-3.5 py-3 rounded-2xl placeholder-gray-500 focus:outline-none transition-all font-medium"
            />
          </div>

        </div>

        {/* Chips de Cidades Rápidas */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
            <span>Cidades Populares:</span>
          </span>
          {TOP_CITIES_QUICK.map((city) => (
            <button
              key={city}
              onClick={() => {
                setCityInput(city);
                setActiveQuickCity(city);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cityInput.toLowerCase() === city.toLowerCase() || activeQuickCity === city
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Filtros Secundários: Categoria & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 font-bold flex items-center gap-1 text-[11px]">
              <Filter size={12} />
              <span>Categoria:</span>
            </span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'gastronomia', label: '🍕 Gastronomia' },
              { id: 'beleza', label: '✂️ Beleza & Barbearia' },
              { id: 'fitness', label: '💪 Fitness & Saúde' },
              { id: 'moda', label: '👕 Moda' },
              { id: 'servicos', label: '🛠️ Serviços' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5F00] text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-bold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1C1C2A] border border-white/15 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">⚪ Não Contatado ({stats.pendingCount})</option>
              <option value="sent">🟡 Mensagem Enviada ({stats.sentCount})</option>
              <option value="negotiating">🔵 Em Negociação ({stats.negotiatingCount})</option>
              <option value="closed">🟢 Parceria Fechada ({stats.closedCount})</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. EDITOR DE MENSAGEM DE DIVULGAÇÃO & PREVIEW ESTILO WHATSAPP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel Esquerdo: Seleção de Templates e Edição */}
        <div className="lg:col-span-7 bg-[#14141E] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <MessageSquare size={17} className="text-emerald-400" />
              <span>Modelo da Mensagem de Divulgação</span>
            </h3>
            <span className="text-[11px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              Personalizável
            </span>
          </div>

          {/* Botões dos 6 Modelos de Proposta Irrecusável */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PREDEFINED_TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-[#181825] border-white/5 hover:border-white/15 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold truncate">{tmpl.name}</span>
                  <span className="text-[9px] bg-emerald-900/60 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded border border-emerald-500/30 flex-shrink-0">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                  {tmpl.text}
                </p>
              </button>
            ))}
          </div>

          {/* Área de Texto Editável */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-gray-400">
                Texto da mensagem que será enviado pelo WhatsApp:
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                {customMessage.length} caracteres
              </span>
            </div>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-[#1A1A27] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm p-3.5 rounded-2xl placeholder-gray-500 focus:outline-none transition-all leading-relaxed font-sans resize-y"
            />
          </div>

          {/* Tags Dinâmicas para Inserir */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-gray-500 font-bold mr-1">Tags Dinâmicas:</span>
            {[
              { tag: '{loja}', desc: 'Nome do comércio' },
              { tag: '{cidade}', desc: 'Cidade da loja' },
              { tag: '{categoria}', desc: 'Ramo de atividade' },
              { tag: '{responsavel}', desc: 'Nome do contato' }
            ].map(({ tag, desc }) => (
              <button
                key={tag}
                onClick={() => setCustomMessage(prev => prev + ' ' + tag)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-300 hover:text-white border border-white/10 hover:border-emerald-500/40 text-[10px] font-mono font-bold transition-all cursor-pointer"
                title={`Inserir ${desc}`}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Painel Direito: Mockup Visual do Balão de WhatsApp */}
        <div className="lg:col-span-5 bg-[#0F1815] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Fundo com textura sutil de chat */}
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  <MessageCircle size={17} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Prévia no WhatsApp Web / Celular</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Pronto para envio imediato</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {cityInput ? cityInput.split('-')[0].trim() : 'Brasil'}
              </span>
            </div>

            {/* Balão Verde Estilo WhatsApp */}
            <div className="bg-[#005C4B] border border-emerald-400/30 rounded-2xl rounded-tr-sm p-4 text-white text-xs sm:text-[13px] leading-relaxed shadow-lg relative max-w-sm ml-auto font-sans">
              <div className="whitespace-pre-wrap">
                {filteredBusinesses[0] ? (
                  compileMessageForStore(filteredBusinesses[0])
                ) : (
                  customMessage
                    .replace(/{loja}/g, 'Comércio Local')
                    .replace(/{cidade}/g, cityInput.split('-')[0].trim() || 'São Paulo')
                    .replace(/{responsavel}/g, 'Gerente')
                )}
              </div>
              
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/70 mt-2 font-mono">
                <span>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-sky-300 font-black">✓✓</span>
              </div>
            </div>
          </div>

          {/* Dica de Utilização */}
          <div className="relative z-10 mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300/80 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
            <span>Ao clicar em <strong>"Abrir no WhatsApp"</strong> em qualquer comércio abaixo, o sistema já abre a conversa com o número oficial e este texto pronto!</span>
          </div>
        </div>

      </div>

      {/* 4. TABELA / GRID DE LOJAS E COMÉRCIOS ENCONTRADOS */}
      <div className="bg-[#14141E] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Building2 size={19} className="text-emerald-400" />
              <span>Comércios Encontrados em {cityInput || 'Todas as Cidades'}</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {filteredBusinesses.length} estabelecimentos
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Clique no botão verde de WhatsApp para iniciar o contato comercial de divulgação.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCityInput('Todas as Cidades');
                setStoreSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Ver Todas as Cidades
            </button>
          </div>
        </div>

        {/* LISTAGEM DE COMÉRCIOS */}
        {filteredBusinesses.length === 0 ? (
          <div className="bg-[#171722] border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="text-4xl">🔍</div>
            <h4 className="text-base font-bold text-white">Nenhum comércio encontrado para "{cityInput}"</h4>
            <p className="text-xs text-gray-400">
              Você pode cadastrar novos comércios para esta cidade usando o botão abaixo ou buscar por outra cidade.
            </p>
            <button
              onClick={() => {
                setNewCommerceForm(prev => ({ ...prev, city: cityInput || 'São Paulo - SP' }));
                setIsAddModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Cadastrar Novo Comércio em {cityInput || 'sua Cidade'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredBusinesses.map((item) => {
              const history = contactHistory[item.id] || {};
              const currentStatus = history.status || item.status || 'pending';
              const lastContactAt = history.lastContactAt || 'Não contatado';

              return (
                <div
                  key={item.id}
                  className="bg-[#181825] hover:bg-[#1D1D2E] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md group relative overflow-hidden"
                >
                  {/* Status no Topo do Card */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center text-xl flex-shrink-0">
                        {item.logoImage ? (
                          <img src={item.logoImage} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          item.logo || '🏪'
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <span className="text-emerald-400 font-semibold">{item.type || 'Comércio'}</span>
                          <span>•</span>
                          <span className="truncate">{item.neighborhood || 'Centro'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge de Status Editável */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          currentStatus === 'closed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : currentStatus === 'negotiating'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : currentStatus === 'sent'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        <option value="pending" className="bg-[#14141E] text-gray-300">⚪ Pendente</option>
                        <option value="sent" className="bg-[#14141E] text-amber-300">🟡 Msg Enviada</option>
                        <option value="negotiating" className="bg-[#14141E] text-blue-300">🔵 Em Negociação</option>
                        <option value="closed" className="bg-[#14141E] text-emerald-300">🟢 Fechada</option>
                      </select>
                    </div>
                  </div>

                  {/* Informações de Contato e Cidade */}
                  <div className="space-y-1.5 py-2.5 my-1 border-t border-b border-white/5 text-xs">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <Phone size={12} className="text-emerald-400" />
                        <span>WhatsApp:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-white text-xs">{item.phone}</strong>
                        <button
                          onClick={() => handleCopyPhone(item.phone)}
                          className="text-gray-500 hover:text-white p-0.5 rounded cursor-pointer"
                          title="Copiar telefone"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#FF5F00]" />
                        <span>Cidade:</span>
                      </span>
                      <span className="font-medium text-gray-300 truncate max-w-[170px]">{item.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-500" />
                        <span>Último Contato:</span>
                      </span>
                      <span className="font-medium text-gray-300">{lastContactAt}</span>
                    </div>
                  </div>

                  {/* Botões de Ação: WhatsApp Direto & Copiar Mensagem */}
                  <div className="pt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenWhatsApp(item)}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
                      title="Abrir WhatsApp com mensagem preenchida"
                    >
                      <MessageCircle size={15} />
                      <span>Abrir no WhatsApp</span>
                      <ExternalLink size={12} />
                    </button>

                    <button
                      onClick={() => handleCopyMessage(item)}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      title="Copiar mensagem personalizada desta loja"
                    >
                      <Copy size={13} />
                      <span className="hidden sm:inline">Copiar</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. MODAL PARA CADASTRAR NOVO COMÉRCIO / LEAD LOCAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171725] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cadastrar Novo Comércio Local</h3>
                  <p className="text-xs text-gray-400">Adicione para disparar mensagens no WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCommerce} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Nome do Estabelecimento / Loja *
                </label>
                <input
                  type="text"
                  required
                  value={newCommerceForm.name}
                  onChange={(e) => setNewCommerceForm({ ...newCommerceForm, name: e.target.value })}
                  placeholder="Ex: Restaurante Sabor da Vila, Hamburgueria Grill..."
                  className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCommerceForm.city}
                    onChange={(e) => setNewCommerceForm({ ...newCommerceForm, city: e.target.value })}
                    placeholder="Ex: São Paulo - SP"
                    className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Bairro / Região
                  </label>
                  <input
                    type="text"
                    value={newCommerceForm.neighborhood}
                    onChange={(e) => setNewCommerceForm({ ...newCommerceForm, neighborhood: e.target.value })}
                    placeholder="Ex: Moema, Pinheiros, Centro..."
                    className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    WhatsApp da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCommerceForm.phone}
                    onChange={(e) => setNewCommerceForm({ ...newCommerceForm, phone: e.target.value })}
                    placeholder="(11) 98888-7777"
                    className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl placeholder-gray-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCommerceForm.category}
                    onChange={(e) => setNewCommerceForm({ ...newCommerceForm, category: e.target.value })}
                    className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="gastronomia">Gastronomia & Bares</option>
                    <option value="beleza">Beleza & Barbearia</option>
                    <option value="fitness">Saúde & Fitness</option>
                    <option value="moda">Moda & Calçados</option>
                    <option value="servicos">Serviços & Tech</option>
                    <option value="lazer">Lazer & Experiências</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Nome do Responsável / Contato (Opcional)
                </label>
                <input
                  type="text"
                  value={newCommerceForm.responsible}
                  onChange={(e) => setNewCommerceForm({ ...newCommerceForm, responsible: e.target.value })}
                  placeholder="Ex: Carlos (Gerente), Ana (Sócia)..."
                  className="w-full bg-[#1C1C2E] border border-white/15 focus:border-emerald-500 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors shadow-lg shadow-emerald-900/50 cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>Salvar & Liberar Disparo</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
