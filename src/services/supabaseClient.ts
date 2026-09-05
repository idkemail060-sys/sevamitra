/**
 * SEVAMITRA - Supabase Client Bridge
 * Project ID: kzplzrzhzbdkcgpccmjo
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
export const SUPABASE_PROJECT_ID = 'kzplzrzhzbdkcgpccmjo';
export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XUjEcVg90Nq9Cp1apr7Mlg_Jjh2k_Zb';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('xyzcompany')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

