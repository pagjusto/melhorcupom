# 🚀 Extensão Oficial Melhor Cupom para Google Chrome

> **Avisa automaticamente quando você entra em qualquer loja que possui cupons e ofertas do Melhor Cupom!**

Esta extensão segue o padrão oficial **Manifest V3** do Google Chrome, o mesmo formato utilizado por extensões famosas como *Méliuz*, *Cuponomia* e *Honey*.

---

## ⚡ Como Instalar no Google Chrome em 3 Passos (Modo Desenvolvedor)

1. Abra o **Google Chrome** no seu computador.
2. Na barra de endereços, digite:
   ```text
   chrome://extensions
   ```
   e aperte **Enter**.
3. No canto superior direito da página, **ative a chavinha "Modo do desenvolvedor"**.
4. Clique no botão **"Carregar sem compactação"** (no canto superior esquerdo).
5. Selecione a pasta da extensão:
   ```text
   C:\Users\pagju\.gemini\antigravity\scratch\melhor-cupom\chrome-extension
   ```
6. **Pronto!** O ícone do **Melhor Cupom** aparecerá na barra de ferramentas do seu Chrome. Fixe-o clicando no ícone de "quebra-cabeça" ao lado da barra de endereços.

---

## 🧪 Como Testar Agora Mesmo:

1. Acesse qualquer um desses sites no seu Chrome:
   - [Shopee Brasil](https://shopee.com.br)
   - [Mercado Livre](https://www.mercadolivre.com.br)
   - [Magazine Luiza](https://www.magazineluiza.com.br)
   - [SHEIN Brasil](https://br.shein.com)
   - [Amazon Brasil](https://www.amazon.com.br)
   - [KaBuM!](https://www.kabum.com.br)
   - [Centauro](https://www.centauro.com.br)
   - [Casas Bahia](https://www.casasbahia.com.br)
   - [Drogasil](https://www.drogasil.com.br)
   - [Burger King](https://www.burgerking.com.br)
2. **O que acontece:**
   - O ícone da extensão no topo do Chrome acenderá com o número de cupons disponíveis (ex: `🔥 4`).
   - Um balão flutuante moderno do **Melhor Cupom** surgirá no canto superior direito do site informando os cupons disponíveis e permitindo copiar o código com 1 clique!
   - Se você clicar no botão **"Ver Todos os Cupons"**, uma gaveta lateral abrirá na própria página com todos os cupons oficiais e botões de copiar.

---

## 📁 Estrutura de Arquivos da Extensão:

* `manifest.json`: Configuração oficial Manifest V3.
* `background.js`: Service worker que monitora as abas e atualiza o badge do ícone.
* `content.js`: Script que injeta o balão/alerta no canto do site e gerencia a cópia do cupom.
* `content.css`: Estilos isolados com z-index máximo e glassmorphism (não desconfigura o site visitado).
* `popup.html` / `popup.js` / `popup.css`: Janelinha que abre ao clicar no ícone da extensão na barra de ferramentas.
* `data/catalog.js`: Base de dados de lojas, domínios, cupons e links de afiliados.
* `icons/`: Ícones e logos vetorizadas do Melhor Cupom.

---

## 💰 Como Ganhar Dinheiro com a Extensão (Monetização):

No arquivo `data/catalog.js`, cada loja possui o campo `affiliateUrl`. Quando o usuário clica para ir até a loja ou ativar uma oferta, seu link com o ID de afiliado (Shopee, Awin, Lomadee, Magazine Você, Mercado Livre) é acionado, gerando comissões para você a cada compra concluída!
