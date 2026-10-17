// Catálogo de Lojas Parceiras e Cupons Oficiais do Melhor Cupom
// Atualizado automaticamente e sincronizado com www.omelhorcupom.com.br

const MELHOR_CUPOM_STORES = [
  {
    id: 'shopee',
    name: 'Shopee Brasil',
    domains: ['shopee.com.br', 'shopee.com', 's.shopee.com'],
    color: '#EE4D2D',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://shopee.com.br/?af=18305641225&utm_source=affiliate&utm_campaign=melhorcupom&af_sub1=melhorcupom',
    cashback: 'Até 8.5% de volta',
    coupons: [
      {
        code: 'SHOPEEAPP20',
        discount: 'R$ 20 OFF',
        title: 'R$ 20 OFF em compras acima de R$ 60 no App',
        description: 'Válido para compras de produtos selecionados no aplicativo oficial Shopee.',
        expires: 'Válido hoje'
      },
      {
        code: 'FRETEGRATISBR',
        discount: 'Frete Grátis',
        title: 'Cupom de Frete Grátis sem valor mínimo',
        description: 'Válido para lojas oficiais e vendedores indicados com o selo Frete Grátis.',
        expires: 'Disponível'
      },
      {
        code: 'MELHORCUPOM15',
        discount: '15% OFF',
        title: '15% de Desconto em Moda, Beleza e Eletrônicos',
        description: 'Desconto direto aplicado no checkout.',
        expires: 'Exclusivo'
      },
      {
        code: 'ACHADINHOS50',
        discount: 'R$ 50 OFF',
        title: 'R$ 50 OFF nas compras acima de R$ 250',
        description: 'Oferta especial para grandes compras e produtos virais.',
        expires: 'Limitado'
      }
    ]
  },
  {
    id: 'mercadolivre',
    name: 'Mercado Livre',
    domains: ['mercadolivre.com.br', 'mercadolivre.com', 'mercadopago.com.br'],
    color: '#FFE600',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.mercadolivre.com.br?utm_source=melhorcupom',
    cashback: 'Até 5% de volta',
    coupons: [
      {
        code: 'MELI25OFF',
        discount: 'R$ 25 OFF',
        title: 'R$ 25 OFF em compras Full acima de R$ 150',
        description: 'Válido para produtos com envio Full e entrega rápida.',
        expires: 'Válido hoje'
      },
      {
        code: 'MODA20MELI',
        discount: '20% OFF',
        title: '20% OFF em Moda Masculina, Feminina e Calçados',
        description: 'Desconto em marcas selecionadas no Mercado Livre.',
        expires: 'Disponível'
      },
      {
        code: 'CASA10MELI',
        discount: '10% OFF',
        title: '10% de Desconto em Eletrodomésticos e Casa',
        description: 'Válido em itens de decoração, móveis e cozinha.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'magalu',
    name: 'Magazine Luiza',
    domains: ['magazineluiza.com.br', 'magazinevoce.com.br', 'maga.lu'],
    color: '#0086FF',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.magazinevoce.com.br/magazinemelhorcupom/',
    cashback: 'Até 6% de volta',
    coupons: [
      {
        code: 'MAGALU100',
        discount: 'R$ 100 OFF',
        title: 'R$ 100 OFF em Smartphones, Smart TVs e Notebooks',
        description: 'Válido em compras acima de R$ 1.500 vendidas e entregues por Magalu.',
        expires: 'Válido hoje'
      },
      {
        code: 'APPDESTAQUE10',
        discount: '10% OFF',
        title: '10% de Desconto em Portáteis e Eletrodomésticos',
        description: 'Airfryers, liquidificadores, aspiradores de pó e cafeteiras.',
        expires: 'Disponível'
      },
      {
        code: 'FRETEFACIL',
        discount: 'Frete Grátis',
        title: 'Frete Grátis para Retirada na Loja mais próxima',
        description: 'Economize o valor da entrega retirando em até 2 horas.',
        expires: 'Ilimitado'
      }
    ]
  },
  {
    id: 'shein',
    name: 'SHEIN Brasil',
    domains: ['shein.com', 'br.shein.com'],
    color: '#000000',
    logo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://br.shein.com/?aff_id=melhorcupom&utm_source=affiliate',
    cashback: 'Até 10% de volta',
    coupons: [
      {
        code: 'SHEIN15VIP',
        discount: '15% OFF',
        title: '15% de Desconto sem valor mínimo de compra',
        description: 'Válido em todo o site internacional e nacional.',
        expires: 'Válido hoje'
      },
      {
        code: 'BRVENDA20',
        discount: 'R$ 20 OFF',
        title: 'R$ 20 OFF nas compras nacionais acima de R$ 99',
        description: 'Envio rápido do Brasil sem taxas de importação.',
        expires: 'Disponível'
      },
      {
        code: 'FRETESHEIN',
        discount: 'Frete Grátis',
        title: 'Frete Grátis nas compras acima de R$ 49',
        description: 'Válido para todos os clientes.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon Brasil',
    domains: ['amazon.com.br', 'amazon.com'],
    color: '#FF9900',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.amazon.com.br/?tag=melhorcupom-20',
    cashback: 'Até 7% de volta',
    coupons: [
      {
        code: 'AMAZON20APP',
        discount: 'R$ 20 OFF',
        title: 'R$ 20 OFF na 1ª compra pelo aplicativo Amazon',
        description: 'Válido para contas selecionadas e novos compradores.',
        expires: 'Disponível'
      },
      {
        code: 'PRIMEFRETE',
        discount: 'Frete Grátis',
        title: 'Frete Grátis Ilimitado e Entrega em 1 dia para membros Prime',
        description: 'Aproveite também Prime Video e Prime Music.',
        expires: 'Ativo'
      },
      {
        code: 'LIVROS15',
        discount: '15% OFF',
        title: '15% OFF em Livros Físicos e eBooks Kindle',
        description: 'Mais de 10.000 títulos com desconto direto.',
        expires: 'Válido hoje'
      }
    ]
  },
  {
    id: 'kabum',
    name: 'KaBuM!',
    domains: ['kabum.com.br'],
    color: '#FF6500',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.kabum.com.br/?tag=melhorcupom',
    cashback: 'Até 4% de volta',
    coupons: [
      {
        code: 'KABUM5OFF',
        discount: '5% OFF',
        title: '5% de Desconto Adicional no PIX em Hardware e Periféricos',
        description: 'Placas de vídeo, processadores, memórias e monitores.',
        expires: 'Disponível'
      },
      {
        code: 'GAMER10',
        discount: '10% OFF',
        title: '10% OFF em Cadeiras Gamer e Headsets Selecionados',
        description: 'Marcas Razer, HyperX, Redragon e Husky.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'casasbahia',
    name: 'Casas Bahia',
    domains: ['casasbahia.com.br'],
    color: '#003399',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.casasbahia.com.br/?utm_source=melhorcupom',
    cashback: 'Até 5.5% de volta',
    coupons: [
      {
        code: 'CASA50',
        discount: 'R$ 50 OFF',
        title: 'R$ 50 OFF em Móveis, Sofás e Colchões',
        description: 'Em compras acima de R$ 600 vendidas pelas Casas Bahia.',
        expires: 'Válido hoje'
      },
      {
        code: 'BAHIAAPP10',
        discount: '10% OFF',
        title: '10% de Desconto em Eletrodomésticos no App',
        description: 'Geladeiras, lavadoras de roupa e fogões.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'centauro',
    name: 'Centauro',
    domains: ['centauro.com.br'],
    color: '#E30613',
    logo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.centauro.com.br/?utm_source=melhorcupom',
    cashback: 'Até 6% de volta',
    coupons: [
      {
        code: '15CENTAURO',
        discount: '15% OFF',
        title: '15% de Desconto em Tênis de Corrida e Roupas de Treino',
        description: 'Nike, Adidas, Puma, Mizuno, Asics e Under Armour.',
        expires: 'Disponível'
      },
      {
        code: 'PRIMEIRACOMPRA',
        discount: '10% OFF',
        title: '10% OFF no seu primeiro pedido do site',
        description: 'Sem valor mínimo de compra.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'drogasil',
    name: 'Drogasil',
    domains: ['drogasil.com.br'],
    color: '#008744',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.drogasil.com.br/?utm_source=melhorcupom',
    cashback: 'Até 4% de volta',
    coupons: [
      {
        code: 'DROGASIL15',
        discount: 'R$ 15 OFF',
        title: 'R$ 15 OFF em Dermocosméticos, Higiene e Vitaminas',
        description: 'Compras acima de R$ 120 com entrega em até 1h.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'cacaushow',
    name: 'Cacau Show',
    domains: ['cacaushow.com.br'],
    color: '#4B2810',
    logo: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.cacaushow.com.br/?utm_source=melhorcupom',
    cashback: 'Até 7% de volta',
    coupons: [
      {
        code: 'CACAULOVER15',
        discount: '15% OFF',
        title: '15% OFF em Trufas, Tabletes e Caixas de Bombom',
        description: 'Exclusivo para membros Cacau Lovers cadastrados.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'burgerking',
    name: 'Burger King',
    domains: ['burgerking.com.br', 'bk.com.br'],
    color: '#D62300',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.burgerking.com.br',
    cashback: 'Cupons no balcão',
    coupons: [
      {
        code: '2WHOPPER25',
        discount: '2 por R$ 25',
        title: '2 Whopper Especiais por apenas R$ 25,00',
        description: 'Apresente o código no balcão ou insira no totem BK.',
        expires: 'Válido hoje'
      },
      {
        code: 'BATATAREFRI',
        discount: 'Combo Free',
        title: 'Batata Média + Refrigerante Grátis no Combo Duplo',
        description: 'Válido em qualquer restaurante Burger King do Brasil.',
        expires: 'Disponível'
      }
    ]
  }
];

// Função utilitária para detectar a loja com base no domínio da aba atual
function findStoreByHostname(hostname) {
  if (!hostname) return null;
  const cleanHost = hostname.toLowerCase().replace(/^(www\.|m\.|app\.|br\.)/, '');

  return MELHOR_CUPOM_STORES.find(store => {
    return store.domains.some(domain => {
      const cleanDomain = domain.toLowerCase().replace(/^(www\.|m\.|app\.|br\.)/, '');
      return cleanHost === cleanDomain || cleanHost.endsWith('.' + cleanDomain);
    });
  }) || null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MELHOR_CUPOM_STORES, findStoreByHostname };
}
