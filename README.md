# 🎟️ Melhor Cupom - Plataforma VIP & Portal do Lojista

<div align="center">
  <img src="./public/logo-melhor-cupom.png" alt="Melhor Cupom Logo" width="380" />
  <p><strong>O clube exclusivo de benefícios onde lojistas disponibilizam descontos reais para membros pagantes.</strong></p>
</div>

---

## 💡 Sobre o Projeto

O **Melhor Cupom** é uma plataforma completa que une dois lados de um modelo de negócios altamente sustentável e vantajoso:

1. **Usuários Pagantes (Membros VIP)**: Assinam o clube por um valor simbólico (ex: R$ 14,90/mês ou R$ 119,90/ano) e desbloqueiam cupons agressivos (30% a 50% OFF, Compre 1 Leve 2, brindes) em estabelecimentos locais e online. Cada cupom gera um código exclusivo e um **QR Code** dinâmico com tolerância de uso para validação no caixa.
2. **Lojistas Parceiros (Comerciantes)**: Cadastram suas lojas sem custo de entrada para atrair clientes de alto padrão de consumo. O lojista define sua logo, cria ofertas com **upload de banner personalizado** e utiliza o **Validador de Balcão (PDV)** para dar baixa imediata nos cupons apresentados pelos clientes.

---

## ✨ Funcionalidades Principais

- 🏙️ **Buscador Orientado por Cidades**: Encontre ofertas em São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba ou em todo o Brasil (online) com autocomplete em tempo real.
- 🖼️ **Upload de Banner & Logo**: Lojistas personalizam a logo da sua marca no perfil e fazem o upload do banner de cada oferta criada.
- 🎟️ **Design de Ticket Perfurado**: Cards com visual autêntico de cupom/ingresso físico (recortes laterais e picote pontilhado).
- 📱 **Validação de Balcão com QR Code**: O cliente apresenta o QR Code ou código no balcão e o lojista valida e baixa no sistema em 1 clique.
- 💰 **Carteira com Cálculo de Economia**: Acompanhamento da economia real acumulada no mês em comparação ao custo da assinatura.
- 💳 **Checkout VIP Completo**: Planos Mensal e Anual com simulação de ativação instantânea via **PIX** (com chave copia e cola e QR Code) ou Cartão de Crédito.
- 🔄 **Simulador de Perfis (Barra Superior)**: Alterne instantaneamente entre *Visitante*, *Assinante VIP Ouro*, *Lojista Smash Burger*, *Lojista Barbearia* e *Admin*.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Estilização**: Tailwind CSS (com tema customizado e paleta oficial da marca)
- **Ícones**: Lucide React
- **QR Code**: `qrcode.react` (geração vetorial de QR Codes dinâmicos)
- **Efeitos**: Canvas Confetti (celebração de resgates e assinaturas)
- **Persistência**: LocalStorage (dados reativos com persistência entre abas e recargas)

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

### Passo a passo:

1. **Clone o repositório:**
```bash
git clone https://github.com/pagjusto/melhorcupom.git
cd melhor-cupom
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse no seu navegador:**
```
http://localhost:3000
```

5. **Gerar build de produção:**
```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
melhor-cupom/
├── public/
│   └── logo-melhor-cupom.png     # Logo oficial transparente
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Cabeçalho com logo, economia e seletor de cidade
│   │   ├── HeroBanner.jsx        # Banner central com logo grande e busca de cidades
│   │   ├── RoleSwitcher.jsx      # Simulador de perfis (Visitante, VIP, Lojistas)
│   │   ├── CouponCard.jsx        # Card de ticket com banner, logo da loja e descontos
│   │   ├── CouponDetailModal.jsx # Modal com QR Code dinâmico e código único
│   │   ├── SubscriptionModal.jsx # Checkout PIX / Cartão com ativação VIP
│   │   ├── MerchantDashboard.jsx # Painel do Lojista (Validador e Criação de Ofertas)
│   │   ├── CategoryPills.jsx     # Filtro por categorias e modalidade
│   │   ├── MyCouponsView.jsx     # Carteira e histórico do usuário
│   │   ├── StoresView.jsx        # Diretório de parceiros
│   │   └── HowItWorksView.jsx    # Explicação do modelo ganha-ganha
│   ├── context/
│   │   └── AppContext.jsx        # Gerenciamento de estado global e persistência
│   ├── data/
│   │   └── mockData.js           # Lojas, cidades e cupons pré-carregados
│   ├── App.jsx                   # Layout principal e rotas de abas
│   ├── index.css                 # Estilos Tailwind e efeitos de tickets
│   └── main.jsx
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para obter mais informações.
