import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { supabase } from '../../../lib/supabase';

export const useAuth = () => {
  const navigate = useNavigate();
  const { initializeAuth, isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { 
        event, 
        hasSession: !!session,
        timestamp: new Date().toISOString()
      });

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await initializeAuth();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, updating state');
        // No need to call initializeAuth here as it will reset the state
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  const requireAuth = (path: string) => {
    if (isInitialized && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  };

  const requireNoAuth = (path: string) => {
    if (isInitialized && isAuthenticated) {
      navigate('/', { replace: true });
    }
  };

  return {
    isAuthenticated,
    isInitialized,
    requireAuth,
    requireNoAuth,
  };
}; 