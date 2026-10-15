import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Cria o cliente Supabase apenas se as credenciais estiverem preenchidas
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Utilitários seguros para operações no Supabase com fallback gracioso.
 */
export const db = {
  // Autenticação
  async signUp(email, password, metadata = {}) {
    if (!isSupabaseConfigured || !supabase) return { error: { message: 'Supabase não configurado' } };
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured || !supabase) return { error: { message: 'Supabase não configurado' } };
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  async signOut() {
    if (!isSupabaseConfigured || !supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Perfis de Usuários (Tabela 'profiles')
  async getProfile(userId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('[Supabase] getProfile error:', error.message);
      return null;
    }
    return data;
  },

  async upsertProfile(profile) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] upsertProfile error:', error.message);
      return null;
    }
    return data;
  },

  async getAllProfiles() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[Supabase] getAllProfiles error:', error.message);
      return [];
    }
    return data || [];
  },

  // Lojas Parceiras (Tabela 'stores')
  async getStores() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[Supabase] getStores error:', error.message);
      return [];
    }
    return data || [];
  },

  async createStore(store) {
    if (!isSupabaseConfigured || !supabase) return store;
    const { data, error } = await supabase
      .from('stores')
      .insert([store])
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] createStore error:', error.message);
      return store;
    }
    return data;
  },

  async updateStore(storeId, updates) {
    if (!isSupabaseConfigured || !supabase) return updates;
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] updateStore error:', error.message);
      return updates;
    }
    return data;
  },

  // Cupons (Tabela 'coupons')
  async getCoupons() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[Supabase] getCoupons error:', error.message);
        return [];
      }
      if (!Array.isArray(data)) return [];

      return data.map(row => {
        let meta = {};
        const cleanRules = [];
        if (Array.isArray(row.rules)) {
          for (const r of row.rules) {
            if (typeof r === 'string' && r.startsWith('__META__:')) {
              try {
                meta = JSON.parse(r.replace('__META__:', ''));
              } catch {}
            } else {
              cleanRules.push(r);
            }
          }
        }

        return {
          id: row.id,
          storeId: row.store_id || meta.storeId || 'store_avulsa',
          merchantId: meta.merchantId || null,
          storeName: meta.storeName || 'Loja Parceira',
          storeLogo: meta.storeLogo || '🏪',
          title: row.title,
          description: row.description || '',
          originalPrice: row.original_price,
          promoPrice: row.promo_price,
          discountBadge: row.discount_badge || 'Oferta VIP',
          estimatedSavings: meta.estimatedSavings || (row.original_price && row.promo_price ? Number((row.original_price - row.promo_price).toFixed(2)) : null),
          category: row.category || meta.category || 'gastronomia',
          city: meta.city || 'São Paulo - SP',
          cities: meta.cities || [meta.city || 'São Paulo - SP'],
          type: row.type || meta.type || 'physical',
          banner: meta.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
          code: row.code || 'VIP10',
          highlight: Boolean(meta.highlight),
          vipOnly: true,
          maxUsesPerUser: row.max_uses_per_user || 1,
          expiresAt: row.expires_at || meta.expiresAt || null,
          rules: cleanRules.length > 0 ? cleanRules : ['Apresentar o cupom VIP no balcão.', 'Não cumulativo com outras promoções.'],
          isAvulso: Boolean(meta.isAvulso),
          fromCloud: true,
          createdAt: row.created_at
        };
      });
    } catch (err) {
      console.warn('[Supabase] getCoupons exception:', err);
      return [];
    }
  },

  async createCoupon(coupon) {
    if (!isSupabaseConfigured || !supabase) return coupon;
    try {
      // Metadados que não possuem coluna direta na tabela coupons
      const safeBanner = (coupon.banner && typeof coupon.banner === 'string' && coupon.banner.startsWith('data:') && coupon.banner.length > 60000) ? '' : coupon.banner;
      const safeStoreLogo = (coupon.storeLogo && typeof coupon.storeLogo === 'string' && coupon.storeLogo.startsWith('data:') && coupon.storeLogo.length > 60000) ? '' : coupon.storeLogo;

      const meta = {
        storeId: coupon.storeId || coupon.store_id,
        merchantId: coupon.merchantId,
        storeName: coupon.storeName,
        storeLogo: safeStoreLogo,
        category: coupon.category,
        city: coupon.city,
        cities: coupon.cities,
        type: coupon.type,
        banner: safeBanner,
        highlight: Boolean(coupon.highlight),
        isAvulso: Boolean(coupon.isAvulso),
        estimatedSavings: coupon.estimatedSavings,
        expiresAt: coupon.expiresAt
      };

      const rawRules = Array.isArray(coupon.rules) ? coupon.rules : (coupon.rules ? [coupon.rules] : []);
      const cleanRules = rawRules.filter(r => typeof r !== 'string' || !r.startsWith('__META__:'));
      const enrichedRules = [
        ...cleanRules,
        `__META__:${JSON.stringify(meta)}`
      ];

      // Verificar se store_id existe na tabela stores para não violar foreign key
      let safeStoreId = null;
      if (coupon.storeId && !String(coupon.storeId).startsWith('store_avulsa_')) {
        const { data: storeCheck } = await supabase
          .from('stores')
          .select('id')
          .eq('id', coupon.storeId)
          .maybeSingle();
        if (storeCheck?.id) {
          safeStoreId = storeCheck.id;
        }
      }

      const payload = {
        id: coupon.id || `cupom_${Date.now()}`,
        store_id: safeStoreId,
        title: coupon.title,
        description: coupon.description || null,
        discount_badge: coupon.discountBadge || coupon.discount_badge || 'Oferta VIP',
        original_price: coupon.originalPrice ? Number(coupon.originalPrice) : null,
        promo_price: coupon.promoPrice ? Number(coupon.promoPrice) : null,
        category: coupon.category || 'gastronomia',
        type: coupon.type || 'physical',
        code: coupon.code || null,
        rules: enrichedRules,
        max_uses_per_user: coupon.maxUsesPerUser || 1
      };

      const { data, error } = await supabase
        .from('coupons')
        .upsert([payload], { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('[Supabase] createCoupon error:', error.message);
        return coupon;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] createCoupon exception:', err);
      return coupon;
    }
  },

  async deleteCoupon(id) {
    if (!isSupabaseConfigured || !supabase) return true;
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) {
        console.warn('[Supabase] deleteCoupon error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteCoupon exception:', err);
      return false;
    }
  },

  // Resgates de Cupons (Tabela 'redemptions')
  async getRedemptions() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('redemptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[Supabase] getRedemptions error:', error.message);
      return [];
    }
    return data || [];
  },

  async createRedemption(redemption) {
    if (!isSupabaseConfigured || !supabase) return redemption;
    const { data, error } = await supabase
      .from('redemptions')
      .insert([redemption])
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] createRedemption error:', error.message);
      return redemption;
    }
    return data;
  },

  async updateRedemption(id, updates) {
    if (!isSupabaseConfigured || !supabase) return updates;
    const { data, error } = await supabase
      .from('redemptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] updateRedemption error:', error.message);
      return updates;
    }
    return data;
  }
};
