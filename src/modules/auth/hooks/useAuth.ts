import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { supabase } from '../../../lib/supabase';

// Singleton subscription reference
let globalAuthSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
let subscriberCount = 0;
let instanceCounter = 0; // Track unique instances

export const useAuth = () => {
  const navigate = useNavigate();
  const { initializeAuth, isAuthenticated, isInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(false);
  const initializePromiseRef = useRef<Promise<void> | null>(null);
  const instanceId = useRef(++instanceCounter);

  useEffect(() => {
    const id = instanceId.current;
    console.log(`[useAuth ${id}] Mount effect starting`, {
      hasGlobalSubscription: !!globalAuthSubscription,
      subscriberCount,
      instanceId: id,
      isAuthenticated,
      isInitialized,
      isLoading,
      pathname: window.location.pathname
    });

    mountedRef.current = true;
    subscriberCount++;

    const initializeApp = async () => {
      if (!mountedRef.current || initializePromiseRef.current) {
        console.log(`[useAuth ${id}] Skipping initialization`, {
          isMounted: mountedRef.current,
          hasInitPromise: !!initializePromiseRef.current,
          instanceId: id
        });
        return;
      }
      
      try {
        console.log(`[useAuth ${id}] Starting app initialization`);
        setIsLoading(true);
        initializePromiseRef.current = initializeAuth();
        await initializePromiseRef.current;
        console.log(`[useAuth ${id}] App initialization complete`, {
          isAuthenticated,
          pathname: window.location.pathname,
          instanceId: id
        });
      } catch (error) {
        console.error(`[useAuth ${id}] Error initializing app:`, error);
      } finally {
        if (mountedRef.current) {
          console.log(`[useAuth ${id}] Setting loading to false after initialization`);
          setIsLoading(false);
        }
      }
    };

    // Set up the global subscription if it doesn't exist
    if (!globalAuthSubscription) {
      console.log(`[useAuth ${id}] Setting up global auth subscription`, {
        instanceId: id,
        subscriberCount
      });
      globalAuthSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[Auth State Change] Event received`, { 
          event, 
          hasSession: !!session,
          timestamp: new Date().toISOString(),
          pathname: window.location.pathname,
          subscriberCount,
          triggeringInstanceId: id
        });

        try {
          // Don't set loading if unmounted
          if (mountedRef.current) {
            console.log(`[useAuth ${id}] Setting loading state before auth update`);
            setIsLoading(true);
          }
          
          await initializeAuth();
          
          if (!mountedRef.current) {
            console.log(`[useAuth ${id}] Skipping navigation - component unmounted`);
            return;
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log(`[useAuth ${id}] Processing sign in/token refresh`, {
              currentPath: window.location.pathname,
              event
            });
            // Only navigate if we're not already on the home page
            if (window.location.pathname !== '/') {
              navigate('/', { replace: true });
            }
          } else if (event === 'SIGNED_OUT') {
            console.log(`[useAuth ${id}] Processing sign out`);
            navigate('/auth', { replace: true });
          }
        } catch (error) {
          console.error(`[useAuth ${id}] Error handling auth state change:`, error);
          if (event === 'SIGNED_IN') {
            navigate('/auth', { replace: true });
          }
        } finally {
          if (mountedRef.current) {
            console.log(`[useAuth ${id}] Setting loading to false after auth state change`);
            setIsLoading(false);
          }
        }
      });
    }

    // Initialize app
    initializeApp();

    return () => {
      console.log(`[useAuth ${id}] Cleanup`, {
        subscriberCount: subscriberCount - 1,
        instanceId: id,
        hasGlobalSubscription: !!globalAuthSubscription
      });
      mountedRef.current = false;
      subscriberCount--;

      // Only clean up the global subscription when there are no more subscribers
      if (subscriberCount === 0 && globalAuthSubscription?.data?.subscription) {
        console.log(`[useAuth ${id}] Cleaning up global auth subscription - no more subscribers`, {
          instanceId: id,
          finalCleanup: true
        });
        globalAuthSubscription.data.subscription.unsubscribe();
        globalAuthSubscription = null;
        initializePromiseRef.current = null;
      }
    };
  }, [initializeAuth, navigate, isAuthenticated]);

  const requireAuth = (path: string) => {
    if (isInitialized && !isAuthenticated && !path.startsWith('/auth')) {
      console.log(`[useAuth ${instanceId.current}] Requiring auth - redirecting to /auth`, {
        isInitialized,
        isAuthenticated,
        path
      });
      navigate('/auth', { replace: true });
    }
  };

  const requireNoAuth = (path: string) => {
    if (isInitialized && isAuthenticated && path.startsWith('/auth') && !path.includes('/callback')) {
      console.log(`[useAuth ${instanceId.current}] Requiring no auth - redirecting to /`, {
        isInitialized,
        isAuthenticated,
        path
      });
      navigate('/', { replace: true });
    }
  };

  return {
    isAuthenticated,
    isInitialized,
    isLoading,
    requireAuth,
    requireNoAuth,
  };
}; 