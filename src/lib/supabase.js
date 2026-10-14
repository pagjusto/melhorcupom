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
  async createCoupon(coupon) {
    if (!isSupabaseConfigured || !supabase) return coupon;
    const { data, error } = await supabase
      .from('coupons')
      .insert([coupon])
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] createCoupon error:', error.message);
      return coupon;
    }
    return data;
  },

  async deleteCoupon(id) {
    if (!isSupabaseConfigured || !supabase) return true;
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    if (error) {
      console.warn('[Supabase] deleteCoupon error:', error.message);
      return false;
    }
    return true;
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
