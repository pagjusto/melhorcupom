// api/send-partner-welcome.js
// Vercel Serverless Function: Notificação Transacional de Boas-Vindas ao Lojista Parceiro via WhatsApp
// Entrega: E-mail, Senha de Acesso ao Painel e Link Direto da Arte Oficial de Parceria com a Logo do Lojista

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Provedor 1: Freeimage.host (CDN iili.io)
async function uploadToFreeimage(buffer) {
  const form = new FormData();
  form.append('key', '6d207e02198a847aa98d0a2a901485a5');
  form.append('action', 'upload');
  form.append('source', buffer.toString('base64'));
  form.append('format', 'json');

  const res = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Freeimage HTTP ${res.status}`);
  const json = await res.json();
  const url = json?.image?.url || json?.image?.display_url || '';
  if (url.startsWith('https://')) return url;
  throw new Error('Freeimage não retornou URL HTTPS válida');
}

// Provedor 2: Uguu.se (Fallback rápido)
async function uploadToUguu(buffer, filename = 'arte-parceria.png') {
  const form = new FormData();
  form.append('files[]', new Blob([buffer], { type: 'image/png' }), filename);
  const res = await fetch('https://uguu.se/upload', {
    method: 'POST',
    headers: { 'User-Agent': BROWSER_UA },
    body: form
  });
  if (!res.ok) throw new Error(`Uguu HTTP ${res.status}`);
  const json = await res.json();
  const url = json?.files?.[0]?.url || '';
  if (url.startsWith('https://')) return url;
  throw new Error('Uguu não retornou URL HTTPS válida');
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  maxDuration: 60
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const storeName = body.storeName || 'Comércio Parceiro';
    const email = body.email || '';
    const password = body.password || '';
    const phone = body.phone || '';
    const instagram = body.instagram || '';
    const imageBase64 = body.imageBase64 || '';

    // 1. Hospedar a imagem da arte em CDN pública caso fornecida
    let publicImageUrl = '';
    if (imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imageBuffer = Buffer.from(cleanBase64, 'base64');
        
        try {
          publicImageUrl = await uploadToFreeimage(imageBuffer);
        } catch (freeimageErr) {
          console.warn('[Welcome Partner] Fallback para Uguu:', freeimageErr.message);
          publicImageUrl = await uploadToUguu(imageBuffer, `melhor-cupom-${Date.now()}.png`);
        }
      } catch (uploadErr) {
        console.warn('[Welcome Partner] Erro no upload da imagem:', uploadErr.message);
      }
    }

    // 2. Limpar telefone para padrão internacional (DDI 55 + DDD + Número)
    const cleanDigits = phone.replace(/\D/g, '');
    const targetPhone = cleanDigits.startsWith('55') && cleanDigits.length >= 12
      ? cleanDigits
      : (cleanDigits ? `55${cleanDigits}` : '');

    const cleanInstagram = instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : '@seuperfil';

    // 3. Montar mensagem formatada oficial para o WhatsApp do Parceiro
    const welcomeMessage = 
`🎉 *BEM-VINDO AO MELHOR CUPOM! SEU CADASTRO DE PARCEIRO FOI REALIZADO COM SUCESSO!* 🏪✨

Olá, *${storeName}*! Seu comércio agora faz parte oficial da nossa rede de estabelecimentos parceiros credenciados.

🔐 *SEUS DADOS DE ACESSO AO PAINEL DO LOJISTA:*
📧 *E-mail de Login:* ${email}
🔑 *Senha de Acesso:* ${password}
🌐 *Acesse o seu Painel:* https://www.omelhorcupom.com.br

📸 *SUA ARTE OFICIAL DE DIVULGAÇÃO:*
${publicImageUrl ? `👉 Link da sua arte em alta resolução para download:\n${publicImageUrl}\n\n` : ''}Acabamos de gerar o criativo oficial com a sua logo para você divulgar nas redes sociais! O arquivo também foi baixado no seu aparelho.

🚀 *COMO POSTAR NO INSTAGRAM:*
1. Abra seu Instagram e poste essa arte no seu *Feed* ou *Stories*.
2. Na legenda, marque *@omelhorcupom.com.br* e o seu perfil *${cleanInstagram}*.
3. Avise seus clientes que eles já podem resgatar cupons da sua loja gratuitamente pelo site oficial!

Boas vendas e conte com o Melhor Cupom para turbinar seu movimento! 🤝🔥`;

    const whatsappUrl = targetPhone 
      ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(welcomeMessage)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(welcomeMessage)}`;

    // 4. Integração opcional com API de WhatsApp Gateway (Evolution API, Z-API ou Webhook) se configurada
    const gatewayUrl = process.env.WHATSAPP_API_URL || process.env.EVOLUTION_API_URL;
    const gatewayKey = process.env.WHATSAPP_API_KEY || process.env.EVOLUTION_API_KEY;

    if (gatewayUrl && targetPhone) {
      try {
        // Enviar mensagem e mídia se houver gateway configurado
        await fetch(gatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(gatewayKey ? { 'apikey': gatewayKey, 'Authorization': `Bearer ${gatewayKey}` } : {})
          },
          body: JSON.stringify({
            number: targetPhone,
            text: welcomeMessage,
            media: publicImageUrl || undefined,
            caption: `Parceria Oficial ${storeName} + Melhor Cupom`
          })
        }).catch(err => console.warn('[WhatsApp Gateway]', err));
      } catch (gwErr) {
        console.warn('[WhatsApp Gateway Error]', gwErr);
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: publicImageUrl,
      phone: targetPhone,
      whatsappUrl,
      message: welcomeMessage
    });

  } catch (err) {
    console.error('[send-partner-welcome error]', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Erro ao processar notificação de boas-vindas do parceiro'
    });
  }
}
