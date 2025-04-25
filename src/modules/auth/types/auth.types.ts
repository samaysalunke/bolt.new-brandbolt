import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
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

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    user: User;
    session: Session;
  };
}

export interface PasswordResetResponse {
  success: boolean;
  error?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
} 