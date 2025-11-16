import { createClient } from '@supabase/supabase-js';

// Client-side (browser) - uses anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const getClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (API routes) - uses service role key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const getServerClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});