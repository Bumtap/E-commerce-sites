import { createClient } from '@supabase/supabase-js';

// Default credentials provided for GMC marketplace Supabase project
const defaultUrl = 'https://gcrshkpaxiytbmifqujo.supabase.co';
const defaultKey = 'sb_publishable__O7TsitvEMAOBKwIUqKOHQ_cQ7ivzsC';

export const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || defaultUrl;

export const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || defaultKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
