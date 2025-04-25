import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    autoRefreshToken: true,
    debug: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});

// Log initial auth state
supabase.auth.getSession().then(({ data: { session }, error }) => {
  console.log('Initial auth state:', {
    hasSession: !!session,
    error: error?.message,
    provider: session?.user?.app_metadata?.provider,
    redirectUrl: window.location.origin + '/auth/callback'
  });
});