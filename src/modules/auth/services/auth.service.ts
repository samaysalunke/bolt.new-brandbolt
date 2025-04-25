import { supabase } from '../../../lib/supabase';
import { AuthResponse, PasswordResetResponse, AuthError } from '../types/auth.types';

class AuthService {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      return {
        success: true,
        data: {
          user: data.user!,
          session: data.session!,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      return {
        success: true,
        data: {
          user: data.user!,
          session: data.session!,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<PasswordResetResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getSession(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw this.handleAuthError(error);
      }

      if (!session) {
        return {
          success: false,
          error: 'No active session found',
        };
      }

      return {
        success: true,
        data: {
          user: session.user!,
          session,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw this.handleAuthError(error);
      }

      if (!user) {
        return {
          success: false,
          error: 'No user found',
        };
      }

      const { data: { session } } = await supabase.auth.getSession();

      return {
        success: true,
        data: {
          user: user!,
          session: session!,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleAuthError(error: any): AuthError {
    console.error('Auth error:', error);
    return {
      message: error.message,
      code: error.code,
      status: error.status,
    };
  }

  private handleError(error: any): { success: false; error: string } {
    console.error('Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export const authService = new AuthService(); 