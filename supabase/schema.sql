-- =========================================================================
-- ESQUEMA DO BANCO DE DADOS SUPABASE - O MELHOR CUPOM (omelhorcupom.com.br)
-- Cole este script no SQL Editor do seu projeto Supabase e clique em "RUN".
-- =========================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS DE USUÁRIOS E ASSINANTES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  cpf TEXT,
  cep TEXT,
  city TEXT DEFAULT 'São Paulo - SP',
  role TEXT DEFAULT 'user', -- 'admin' | 'merchant' | 'user' | 'vip'
  is_vip BOOLEAN DEFAULT FALSE,
  vip_plan TEXT, -- 'monthly' | 'annual'
  vip_since TIMESTAMPTZ,
  monthly_savings NUMERIC(10,2) DEFAULT 0.00,
  referral_code TEXT UNIQUE,
  referral_balance NUMERIC(10,2) DEFAULT 0.00,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE LOJAS E PARCEIROS (FÍSICAS, ONLINE & FRANQUIAS)
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  merchant_id TEXT,
  name TEXT NOT NULL,
  legal_name TEXT,
  cnpj TEXT,
  cep TEXT,
  category TEXT DEFAULT 'gastronomia',
  cities TEXT[] DEFAULT ARRAY['São Paulo - SP'],
  city TEXT DEFAULT 'São Paulo - SP',
  phone TEXT,
  email TEXT,
  instagram TEXT,
  address TEXT,
  hours TEXT DEFAULT 'Seg a Sáb: 10h às 22h',
  tier TEXT DEFAULT 'free_trial', -- 'free_trial' | 'bronze' | 'silver' | 'gold' | 'api'
  free_trial_active BOOLEAN DEFAULT TRUE,
  free_trial_months INT DEFAULT 3,
  free_trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
  max_coupons INT DEFAULT 1,
  admin_paid_plan BOOLEAN DEFAULT FALSE,
  referral_code TEXT,
  referral_balance NUMERIC(10,2) DEFAULT 0.00,
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  logo_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE CUPONS DE DESCONTO
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  store_id TEXT REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_badge TEXT NOT NULL, -- Ex: '20% OFF'
  original_price NUMERIC(10,2),
  promo_price NUMERIC(10,2),
  category TEXT DEFAULT 'gastronomia',
  type TEXT DEFAULT 'physical', -- 'physical' | 'online'
  code TEXT,
  rules TEXT[] DEFAULT ARRAY['Apresentar no caixa ou no site'],
  max_uses_per_user INT DEFAULT 1,
  uses_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE RESGATES E BAIXAS DE CUPONS (HISTÓRICO / AUDITORIA)
CREATE TABLE IF NOT EXISTS public.redemptions (
  id TEXT PRIMARY KEY,
  coupon_id TEXT,
  store_id TEXT,
  store_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_cpf TEXT,
  code TEXT NOT NULL,
  pass_code TEXT NOT NULL, -- Senha de 6 dígitos para o caixa
  savings NUMERIC(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'valid', -- 'valid' | 'used' | 'expired'
  is_api_redemption BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ
);

-- 6. HABILITAR SEGURANÇA POR LINHA (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE ACESSO (POLICIES)

-- Profiles: leitura pública para referências, edição pelo próprio usuário ou admin
CREATE POLICY "Leitura pública de perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuário insere/atualiza próprio perfil" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Stores: leitura pública de todas as lojas aprovadas, inserção por lojistas cadastrados
CREATE POLICY "Leitura pública de lojas" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Lojistas cadastram suas lojas" ON public.stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Lojistas atualizam suas lojas" ON public.stores FOR UPDATE USING (true);

-- Coupons: leitura pública de cupons ativos
CREATE POLICY "Leitura pública de cupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Lojistas gerenciam seus cupons" ON public.coupons FOR ALL USING (true);

-- Redemptions: criação e baixa de cupons
CREATE POLICY "Leitura de resgates" ON public.redemptions FOR SELECT USING (true);
CREATE POLICY "Inserção de resgates" ON public.redemptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Baixa no caixa de resgates" ON public.redemptions FOR UPDATE USING (true);

-- 8. TRIGGER AUTOMÁTICO: CRIAR PERFIL AO CADASTRAR NO AUTH DO SUPABASE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    phone,
    cpf,
    city,
    role,
    referral_code
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    COALESCE(NEW.raw_user_meta_data->>'city', 'São Paulo - SP'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    UPPER(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'name', 'CUPOM') FROM 1 FOR 5) || FLOOR(10 + RANDOM() * 89)::TEXT)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
