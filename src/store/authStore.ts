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
  isLoading: true,
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
    
    // If already initialized and not loading, no need to initialize again
    if (currentState.isInitialized && !currentState.isLoading) {
      console.log('Auth already initialized, skipping...', {
        isAuthenticated: currentState.isAuthenticated,
        hasUser: !!currentState.user
      });
      return;
    }

    // If there's an existing initialization in progress, wait for it
    if (initializationPromise) {
      console.log('Auth initialization already in progress, waiting...');
      await initializationPromise;
      return;
    }

    console.log('Starting new auth initialization...');
    try {
      // Create new initialization promise
      initializationPromise = (async () => {
        set({ isLoading: true, error: null });
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Got session:', { hasSession: !!session, error: sessionError });
        
        if (sessionError) throw sessionError;

        if (!session) {
          console.log('No session found, setting unauthenticated state');
          set({ 
            session: null, 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true
          });
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Got user:', { hasUser: !!user, error: userError });
        
        if (userError) throw userError;

        if (!user) {
          console.log('No user found, setting unauthenticated state');
          set({ 
            session: null, 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true
          });
          return;
        }

        // Log user data if they're connected with LinkedIn
        if (user.app_metadata?.provider === 'linkedin_oidc') {
          console.log('LinkedIn User Data:', {
            id: user.id,
            email: user.email,
            provider: user.app_metadata.provider,
            hasAccessToken: !!session.provider_token,
            identities: user.identities,
            lastSignIn: user.last_sign_in_at,
          });
        }

        console.log('Auth initialization successful:', { 
          userId: user.id,
          isAuthenticated: true
        });

        set({ 
          session, 
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null
        });
      })();

      await initializationPromise;
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        session: null, 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Failed to initialize auth'
      });
    } finally {
      initializationPromise = null;
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
      set({ user: null, session: null, isAuthenticated: false });
    } catch (error) {
      console.error('Sign out error:', error);
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

  signInWithLinkedIn: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Initiating LinkedIn sign-in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'openid profile email w_member_social',
        }
      });

      if (error) throw error;
      
      // After successful OAuth, update the auth state
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // Log LinkedIn authentication success
        console.log('LinkedIn Authentication Success:', {
          provider: user?.app_metadata?.provider,
          hasAccessToken: !!session.provider_token,
          tokenExpiry: session.expires_at,
        });
        
        set({ 
          session, 
          user, 
          isAuthenticated: true,
          isLoading: false,
          error: null 
        });
      }
    } catch (error) {
      console.error('LinkedIn sign-in error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to sign in with LinkedIn' });
    } finally {
      set({ isLoading: false });
    }
  },
}));