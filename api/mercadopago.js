// api/mercadopago.js
// Vercel Serverless Function para integração com Mercado Pago (PIX com QR Code dinâmico Copia e Cola e Checkout Pro)
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Token padrão de produção ou via variável de ambiente (Mercado Pago Oficial)
const DEFAULT_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-2945252384184793-100917-5b668ed5078efa4f7d3225c19178bb63-62315625';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  },
  maxDuration: 30
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Teste de status e verificação de chave
  if (req.method === 'GET') {
    const accessToken = req.query?.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN || DEFAULT_ACCESS_TOKEN;
    const isConfigured = !!accessToken && accessToken.length > 10;
    const isTestToken = accessToken.startsWith('TEST-');
    const isProdToken = accessToken.startsWith('APP_USR-');

    return res.status(200).json({
      status: 'online',
      configured: isConfigured,
      mode: isProdToken ? 'production' : isTestToken ? 'sandbox' : (isConfigured ? 'custom' : 'unconfigured'),
      message: isConfigured 
        ? `Mercado Pago ativo (${isProdToken ? 'Produção' : 'Sandbox / Teste'})` 
        : 'Mercado Pago aguardando Access Token de credencial'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const {
      action = 'create_pix', // 'create_pix' | 'create_preference' | 'check_status'
      accessToken: customToken,
      amount,
      description = 'Assinatura Melhor Cupom',
      payer = {},
      metadata = {},
      paymentId
    } = body;

    const token = customToken || process.env.MERCADOPAGO_ACCESS_TOKEN || DEFAULT_ACCESS_TOKEN;

    if (!token && action !== 'check_status') {
      return res.status(400).json({
        success: false,
        error: 'Credencial Access Token do Mercado Pago não configurada. Insira sua credencial nas configurações ou variável de ambiente.'
      });
    }

    const client = new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 15000 }
    });

    // 1. AÇÃO: CRIAR PAGAMENTO PIX DIRETO (QR CODE + COPIA E COLA)
    if (action === 'create_pix') {
      const parsedAmount = Number(parseFloat(amount).toFixed(2));
      if (!parsedAmount || parsedAmount <= 0) {
        return res.status(400).json({ success: false, error: 'Valor inválido para pagamento PIX.' });
      }

      const payment = new Payment(client);

      const payerEmail = payer.email || 'cliente@omelhorcupom.com.br';
      const payerFirstName = (payer.name || 'Cliente').split(' ')[0] || 'Cliente';
      const payerLastName = (payer.name || 'Melhor Cupom').split(' ').slice(1).join(' ') || 'VIP';

      const paymentData = {
        transaction_amount: parsedAmount,
        description: description.slice(0, 200),
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
          first_name: payerFirstName,
          last_name: payerLastName,
          identification: payer.cpf ? {
            type: 'CPF',
            number: payer.cpf.replace(/\D/g, '')
          } : undefined
        },
        metadata: {
          platform: 'melhor_cupom',
          site: 'https://www.omelhorcupom.com.br',
          ...metadata
        }
      };

      const paymentResponse = await payment.create({ body: paymentData });

      const txDetails = paymentResponse.point_of_interaction?.transaction_data;
      const qrCode = txDetails?.qr_code; // Código Copia e Cola
      const qrCodeBase64 = txDetails?.qr_code_base64; // Imagem em Base64 do QR Code
      const ticketUrl = txDetails?.ticket_url;

      return res.status(200).json({
        success: true,
        paymentId: paymentResponse.id,
        status: paymentResponse.status, // 'pending' | 'approved' etc.
        statusDetail: paymentResponse.status_detail,
        qrCode,
        qrCodeBase64,
        ticketUrl,
        amount: paymentResponse.transaction_amount,
        expirationDate: paymentResponse.date_of_expiration
      });
    }

    // 2. AÇÃO: CONSULTAR STATUS DO PAGAMENTO
    if (action === 'check_status') {
      if (!paymentId) {
        return res.status(400).json({ success: false, error: 'paymentId é obrigatório para consulta.' });
      }

      const payment = new Payment(client);
      const paymentResponse = await payment.get({ id: paymentId });

      return res.status(200).json({
        success: true,
        paymentId: paymentResponse.id,
        status: paymentResponse.status, // 'approved', 'pending', 'rejected'
        statusDetail: paymentResponse.status_detail,
        isApproved: paymentResponse.status === 'approved'
      });
    }

    // 3. AÇÃO: CRIAR PREFERÊNCIA DE CHECKOUT (CARTÃO / PIX / BOLETO NO MERCADO PAGO)
    if (action === 'create_preference') {
      const parsedAmount = Number(parseFloat(amount).toFixed(2));
      const preference = new Preference(client);

      const prefResponse = await preference.create({
        body: {
          items: [
            {
              id: metadata.planId || 'melhor_cupom_vip',
              title: description,
              unit_price: parsedAmount,
              quantity: 1,
              currency_id: 'BRL'
            }
          ],
          payer: {
            email: payer.email || 'cliente@omelhorcupom.com.br',
            name: payer.name || 'Cliente Melhor Cupom'
          },
          back_urls: {
            success: 'https://www.omelhorcupom.com.br/?status=success',
            failure: 'https://www.omelhorcupom.com.br/?status=failure',
            pending: 'https://www.omelhorcupom.com.br/?status=pending'
          },
          auto_return: 'approved',
          statement_descriptor: 'MELHORCUPOM'
        }
      });

      return res.status(200).json({
        success: true,
        preferenceId: prefResponse.id,
        initPoint: prefResponse.init_point,
        sandboxInitPoint: prefResponse.sandbox_init_point
      });
    }

    return res.status(400).json({ success: false, error: 'Ação não reconhecida.' });
  } catch (error) {
    console.error('Erro na API Mercado Pago:', error);
    const errMessage = error?.message || error?.cause?.description || 'Erro interno na comunicação com Mercado Pago.';
    return res.status(500).json({
      success: false,
      error: errMessage,
      details: error?.cause || null
    });
  }
}
