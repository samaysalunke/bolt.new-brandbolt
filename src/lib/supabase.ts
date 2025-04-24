import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch (error) {
          return Promise.reject(error);
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      },
    },
  },
});