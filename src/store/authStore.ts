import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  linkLinkedIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  skipAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  skipAuth: async () => {
    const mockUser = {
      id: 'dev-user',
      email: 'dev@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
    } as Session;

    set({ user: mockUser, session: mockSession, error: null });
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

  signInWithLinkedIn: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
          scopes: 'openid profile email w_member_social',
          queryParams: {
            prompt: 'consent',
            access_type: 'offline',
          },
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No OAuth URL returned');

      // Store the current URL to redirect back after auth
      localStorage.setItem('preAuthPath', window.location.pathname);
      
      // Redirect to LinkedIn
      window.location.href = data.url;
    } catch (error) {
      set({ error: (error as Error).message });
      set({ isLoading: false });
    }
  },

  linkLinkedIn: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${import.meta.env.VITE_APP_URL}/settings`,
          scopes: 'openid profile email w_member_social',
          queryParams: {
            prompt: 'consent',
            access_type: 'offline',
          },
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No OAuth URL returned');

      // Store the current URL to redirect back after auth
      localStorage.setItem('preAuthPath', window.location.pathname);
      
      // Redirect to LinkedIn
      window.location.href = data.url;
    } catch (error) {
      set({ error: (error as Error).message });
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user, session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({ user, session });
    } catch (error) {
      set({ error: (error as Error).message });
      set({ user: null, session: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));