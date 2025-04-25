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
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false
};

// Track initialization promise to prevent multiple calls
let initializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  initializeAuth: async () => {
    const currentState = get();
    
    // Don't re-initialize if already initialized and not loading
    if (currentState.isInitialized && !currentState.isLoading) {
      return;
    }

    try {
      set({ isLoading: true, error: null });
      console.log('Initializing auth...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      console.log('Session check:', {
        hasSession: !!session,
        provider: session?.user?.app_metadata?.provider,
        userId: session?.user?.id
      });

      // If no session, set initialized state and return
      if (!session) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null
        });
        return;
      }

      // Get user data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        throw userError;
      }

      // If no user, set initialized state and return
      if (!user) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null
        });
        return;
      }

      console.log('Auth initialized with user:', {
        id: user.id,
        email: user.email,
        provider: user.app_metadata.provider
      });

      // Set successful auth state
      set({ 
        session, 
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Set error state but mark as initialized
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

  signIn: async (email: string, password: string) => {
    console.log('Starting sign in...', { isLoading: get().isLoading });
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Sign in successful:', { user: data?.user, session: data?.session });
      
      if (data?.user && data?.session) {
        set({ 
          user: data.user, 
          session: data.session,
          isAuthenticated: true,
          error: null,
          isLoading: false
        });
        console.log('Auth state updated:', { 
          isAuthenticated: true, 
          isLoading: false,
          user: data.user.id 
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        error: (error as Error).message,
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false
      });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  signInWithLinkedIn: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Starting LinkedIn sign-in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'openid profile email',
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('LinkedIn sign-in error:', error);
        throw error;
      }

      console.log('LinkedIn OAuth initiated:', data);
      
    } catch (error) {
      console.error('LinkedIn sign-in error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in with LinkedIn',
        isLoading: false
      });
    }
  },
}));