import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isInitialized: false
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First check if we have a session in storage
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw sessionError;
      }

      if (!session) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true
        });
        return;
      }

      // If we have a session, get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true
        });
        return;
      }

      set({ 
        session, 
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        session: null, 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Failed to initialize auth'
      });
    }
  },

  getCurrentUser: async () => {
    const { isInitialized } = get();
    if (!isInitialized) {
      await get().initializeAuth();
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          error: sessionError.message 
        });
        return;
      }

      if (!session) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          error: userError.message 
        });
        return;
      }

      if (!user) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        return;
      }

      set({ 
        session, 
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      set({ 
        session: null, 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
      });
      
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('User already registered');
        }
        throw error;
      }
      
      if (data?.user?.identities?.length === 0) {
        set({ error: 'Email not confirmed' });
      } else {
        set({ user: data.user, session: data.session });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid login credentials');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed');
        } else {
          throw error;
        }
      }

      set({ user: data.user, session: data.session });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, isAuthenticated: false });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));