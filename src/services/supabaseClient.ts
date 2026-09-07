/**
 * SEVAMITRA - Supabase Client Bridge
 * Project ID: kzplzrzhzbdkcgpccmjo
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
export const SUPABASE_PROJECT_ID = 'kzplzrzhzbdkcgpccmjo';
export const SUPABASE_URL =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  env.SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_XUjEcVg90Nq9Cp1apr7Mlg_Jjh2k_Zb';

export const SUPABASE_SECRET_KEY =
  env.SUPABASE_SECRET_KEY || 'sb_secret_Rr2vnPS2OkrAish_VxJpXQ_ut8StWMs';

export const SUPABASE_JWKS_URL =
  env.SUPABASE_JWKS_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co/auth/v1/.well-known/jwks.json`;

export const DATABASE_CONFIG = {
  host: env.DATABASE_HOST || `db.${SUPABASE_PROJECT_ID}.supabase.co`,
  port: parseInt(env.DATABASE_PORT || '5432', 10),
  database: env.DATABASE_NAME || 'postgres',
  user: env.DATABASE_USER || 'postgres',
};

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


