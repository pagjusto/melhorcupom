// src/utils/partnerNotification.js
// Utilitário de Geração de Arte Oficial e Notificação Transacional de Boas-Vindas via WhatsApp para Novos Parceiros

import { renderStoreArtworkToCanvas } from './instagramAutoPublisher';

/**
 * Formata telefone para padrão internacional WhatsApp (DDI 55 + DDD + Número)
 */
export const formatPhoneForWhatsApp = (phoneStr) => {
  const digits = (phoneStr || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  return `55${digits}`;
};

/**
 * Monta o texto oficial do WhatsApp com credenciais de login e instruções da arte
 */
export const buildPartnerWelcomeMessage = ({ storeName, email, password, instagram, imageUrl }) => {
  const cleanInstagram = instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : '@seuperfil';

  return `🎉 *BEM-VINDO AO MELHOR CUPOM! SEU CADASTRO DE PARCEIRO FOI REALIZADO COM SUCESSO!* 🏪✨

Olá, *${storeName}*! Seu comércio agora faz parte oficial da nossa rede de parceiros credenciados.

🔐 *SEUS DADOS DE ACESSO AO PAINEL DO LOJISTA:*
📧 *E-mail de Login:* ${email}
🔑 *Senha de Acesso:* ${password}
🌐 *Acesse o seu Painel:* https://www.omelhorcupom.com.br

📸 *SUA ARTE OFICIAL DE DIVULGAÇÃO:*
${imageUrl ? `👉 Link da sua arte em alta resolução para download:\n${imageUrl}\n\n` : ''}Acabamos de gerar o criativo oficial com a sua logo para você divulgar nas redes sociais! O arquivo também foi baixado no seu aparelho.

🚀 *COMO POSTAR NO INSTAGRAM:*
1. Abra seu Instagram e poste essa arte no seu *Feed* ou *Stories*.
2. Na legenda, marque *@omelhorcupom.com.br* e o seu perfil *${cleanInstagram}*.
3. Avise seus clientes que eles já podem resgatar cupons da sua loja gratuitamente pelo site oficial!

Boas vendas e conte com o Melhor Cupom para turbinar seu movimento! 🤝🔥`;
};

/**
 * Gera a arte oficial em alta resolução (1080x1080 Feed) com a logo do parceiro
 */
export const generatePartnerArtwork = async (store) => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    await renderStoreArtworkToCanvas(canvas, 'feed', store);
    return canvas.toDataURL('image/png', 1.0);
  } catch (err) {
    console.warn('[generatePartnerArtwork Error]', err);
    return '';
  }
};

/**
 * Dispara o download automático do arquivo PNG da arte no aparelho do parceiro
 */
export const downloadArtworkFile = (dataUrl, storeName) => {
  if (!dataUrl) return;
  try {
    const link = document.createElement('a');
    const cleanSlug = (storeName || 'parceiro')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');
    link.download = `melhorcupom-arte-${cleanSlug}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.warn('[downloadArtworkFile Error]', err);
  }
};

/**
 * Processo completo de notificação do parceiro:
 * 1. Gera e baixa a arte
 * 2. Tenta upload em CDN via backend
 * 3. Abre WhatsApp com mensagem formatada
 */
export const notifyPartnerRegistration = async ({ store, email, password, phone, instagram }) => {
  const storeName = store?.name || 'Comércio Parceiro';
  const cleanPhone = formatPhoneForWhatsApp(phone || store?.phone);

  // 1. Gerar Arte Oficial com Logo
  const artworkDataUrl = await generatePartnerArtwork(store);

  // 2. Baixar imagem automaticamente no dispositivo do parceiro
  if (artworkDataUrl) {
    downloadArtworkFile(artworkDataUrl, storeName);
  }

  // 3. Tentar hospedar a imagem via API serverless para obter link público
  let publicImageUrl = '';
  try {
    const res = await fetch('/api/send-partner-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeName,
        email,
        password,
        phone: cleanPhone,
        instagram,
        imageBase64: artworkDataUrl
      })
    });
    const data = await res.json();
    if (data?.imageUrl) {
      publicImageUrl = data.imageUrl;
    }
  } catch (apiErr) {
    console.warn('[notifyPartnerRegistration API fallback]', apiErr);
  }

  // 4. Montar a mensagem final
  const message = buildPartnerWelcomeMessage({
    storeName,
    email,
    password,
    instagram,
    imageUrl: publicImageUrl
  });

  const whatsappUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  // 5. Abrir WhatsApp em nova aba
  try {
    window.open(whatsappUrl, '_blank');
  } catch (e) {
    console.warn('[WhatsApp open blocked]', e);
  }

  return {
    success: true,
    storeName,
    email,
    password,
    phone: cleanPhone,
    whatsappUrl,
    message,
    artworkDataUrl,
    publicImageUrl
  };
};
