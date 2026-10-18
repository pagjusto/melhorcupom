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
  },
  {
    id: 'nike',
    name: 'Nike Brasil',
    domains: ['nike.com.br', 'nike.com'],
    color: '#111111',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.nike.com.br/?awin=melhorcupom',
    cashback: 'Até 7.5% de volta',
    coupons: [
      {
        code: 'VALE20',
        discount: '20% OFF',
        title: '20% OFF em Tênis Air Max, Pegasus e Roupas Dri-FIT',
        description: 'Desconto extra aplicado no carrinho em produtos selecionados.',
        expires: 'Válido hoje'
      },
      {
        code: 'PRIMEIRACOMPRA',
        discount: '10% OFF',
        title: '10% OFF no seu primeiro pedido no site oficial Nike',
        description: 'Válido para novos cadastros de membros Nike.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'adidas',
    name: 'Adidas Brasil',
    domains: ['adidas.com.br', 'adidas.com'],
    color: '#000000',
    logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.adidas.com.br/?awin=melhorcupom',
    cashback: 'Até 7% de volta',
    coupons: [
      {
        code: 'ADICLUB',
        discount: '15% OFF',
        title: '15% de Desconto exclusivo para membros adiClub',
        description: 'Válido em Ultraboost, Forum, Samba e vestuário esportivo.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung Oficial',
    domains: ['samsung.com.br', 'samsung.com'],
    color: '#1428A0',
    logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.samsung.com/br/?awin=melhorcupom',
    cashback: 'Até 7% de volta',
    coupons: [
      {
        code: 'SAMSUNG200',
        discount: 'R$ 200 OFF',
        title: 'R$ 200 OFF na linha Galaxy S, Z Flip e Galaxy Tab',
        description: 'Desconto no carrinho da Loja Online Oficial Samsung.',
        expires: 'Válido hoje'
      }
    ]
  },
  {
    id: 'sephora',
    name: 'Sephora Brasil',
    domains: ['sephora.com.br'],
    color: '#000000',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.sephora.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 6.5% de volta',
    coupons: [
      {
        code: 'SEPHORA15',
        discount: '15% OFF',
        title: '15% OFF em Perfumes Importados e Maquiagens de Luxo',
        description: 'Válido nas marcas Dior, Carolina Herrera, Lancôme e NARS.',
        expires: 'Válido hoje'
      },
      {
        code: 'BEMVINDA60',
        discount: 'R$ 60 OFF',
        title: 'R$ 60 OFF na 1ª compra acima de R$ 299',
        description: 'Desconto de boas-vindas com brindes exclusivos na sacola.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'boticario',
    name: 'O Boticário',
    domains: ['boticario.com.br'],
    color: '#00543D',
    logo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.boticario.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 8% de volta',
    coupons: [
      {
        code: 'BOTI20',
        discount: '20% OFF',
        title: '20% OFF nas linhas Malbec, Lily, Zaad e Elysée',
        description: 'Perfumaria e cuidados com frete grátis em pedidos acima de R$ 149.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'dell',
    name: 'Dell Computadores',
    domains: ['dell.com.br', 'dell.com'],
    color: '#007DB8',
    logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.dell.com/pt-br?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 5% de volta',
    coupons: [
      {
        code: 'DELL250PROMO',
        discount: 'R$ 250 OFF',
        title: 'R$ 250 OFF em Notebooks Inspiron e Monitores Dell',
        description: 'Válido para compras acima de R$ 2.500 no site oficial da Dell.',
        expires: 'Válido hoje'
      }
    ]
  },
  {
    id: 'drogaraia',
    name: 'Droga Raia Online',
    domains: ['drogaraia.com.br'],
    color: '#003B71',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.drogaraia.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 5% de volta',
    coupons: [
      {
        code: 'RAIADERMO20',
        discount: 'R$ 20 OFF',
        title: 'R$ 20 OFF em Dermocosméticos e Protetores Solares',
        description: 'Válido nas marcas La Roche-Posay, Vichy e CeraVe acima de R$ 130.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'puma',
    name: 'Puma Brasil',
    domains: ['puma.com.br', 'puma.com'],
    color: '#000000',
    logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.puma.com/br/pt?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 8% de volta',
    coupons: [
      {
        code: 'PUMA15VIP',
        discount: '15% OFF',
        title: '15% OFF em Tênis Suede, Corrida e Chuteiras',
        description: 'Válido em produtos selecionados no site oficial Puma.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'rayban',
    name: 'Ray-Ban Brasil',
    domains: ['ray-ban.com', 'rayban.com'],
    color: '#E30613',
    logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.ray-ban.com/brazil?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 7% de volta',
    coupons: [
      {
        code: 'RAYBAN20',
        discount: '20% OFF',
        title: '20% OFF em Óculos de Sol Clássicos & Polarizados',
        description: 'Modelos Aviator, Wayfarer e Clubmaster com garantia Luxottica.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'natura',
    name: 'Natura Oficial',
    domains: ['natura.com.br'],
    color: '#FF6B00',
    logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.natura.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 7.5% de volta',
    coupons: [
      {
        code: 'NATURA20VIP',
        discount: '20% OFF',
        title: '20% OFF em Perfumaria Essencial, Kaiak e Linha Ekos',
        description: 'Desconto extra cumulativo no carrinho da Natura.',
        expires: 'Válido hoje'
      }
    ]
  },
  {
    id: 'booking',
    name: 'Booking.com Viagens',
    domains: ['booking.com'],
    color: '#003580',
    logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.booking.com/?aid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 4% de volta',
    coupons: [
      {
        code: 'BOOKING15GENIUS',
        discount: '15% OFF',
        title: 'Até 15% OFF em Hotéis e Pousadas no Brasil',
        description: 'Tarifas promocionais com cancelamento grátis na maioria dos destinos.',
        expires: 'Disponível'
      }
    ]
  },
  {
    id: 'dafiti',
    name: 'Dafiti',
    domains: ['dafiti.com.br'],
    color: '#000000',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.dafiti.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 6% de volta',
    coupons: [
      {
        code: 'DAFITI20VIP',
        discount: '20% OFF',
        title: '20% OFF em Vestuário, Bolsas e Calçados Femininos e Masculinos',
        description: 'Válido para compras acima de R$ 220 de marcas selecionadas.',
        expires: 'Ativo'
      }
    ]
  },
  {
    id: 'cobasi',
    name: 'Cobasi Pet Shop',
    domains: ['cobasi.com.br'],
    color: '#009639',
    logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=100&auto=format&fit=crop&q=80',
    affiliateUrl: 'https://www.cobasi.com.br/?awinaffid=3095275&clickref=melhorcupom_vip',
    cashback: 'Até 6% de volta',
    coupons: [
      {
        code: 'COBASI15',
        discount: '15% OFF',
        title: '15% OFF em Rações Super Premium e Antipulgas',
        description: 'Royal Canin, Premier, Bravecto e Simparic com frete grátis.',
        expires: 'Válido hoje'
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
