import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { AuthState, AuthActions } from '../types/auth.types';

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const sessionResponse = await authService.getSession();
      if (!sessionResponse.success) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true
        });
        return;
      }

      const userResponse = await authService.getUser();
      if (!userResponse.success) {
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
        session: userResponse.data!.session, 
        user: userResponse.data!.user,
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

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signIn(email, password);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      set({ 
        user: response.data!.user, 
        session: response.data!.session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in',
        isLoading: false
      });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signUp(email, password);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      set({ 
        user: response.data!.user, 
        session: response.data!.session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up',
        isLoading: false
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signOut();
      
      if (!response.success) {
        throw new Error(response.error);
      }

      set({ 
        user: null, 
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.resetPassword(email);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      set({ isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset password',
        isLoading: false
      });
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updatePassword(newPassword);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      set({ isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update password',
        isLoading: false
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  getCurrentUser: async () => {
    const { isInitialized } = get();
    if (!isInitialized) {
      await get().initializeAuth();
      return;
    }

    try {
      const response = await authService.getUser();
      
      if (!response.success) {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          error: response.error
        });
        return;
      }

      set({ 
        session: response.data!.session, 
        user: response.data!.user,
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
})); 