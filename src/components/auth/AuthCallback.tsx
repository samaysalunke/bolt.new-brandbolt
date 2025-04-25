import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    let authStateSubscription: { data: { subscription: { unsubscribe: () => void } } };

    const handleCallback = async () => {
      try {
        console.log('Starting auth callback process...', {
          pathname: location.pathname,
          search: location.search,
          fullUrl: window.location.href,
          timestamp: new Date().toISOString()
        });

        if (!mounted) return;
        setIsLoading(true);
        setError(null);

        // Check for error in URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (error) {
          console.error('Error in URL params:', { error, errorDescription });
          throw new Error(errorDescription || error);
        }

        // First, try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Initial session check:', { 
          hasSession: !!session, 
          error: sessionError,
          sessionExpiry: session?.expires_at,
          provider: session?.user?.app_metadata?.provider
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log('No session found, waiting for auth state change...');
          // Wait for auth state change
          const timeout = 15000; // 15 seconds timeout
          const sessionPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
              reject(new Error('Session establishment timeout - please try again'));
            }, timeout);

            authStateSubscription = supabase.auth.onAuthStateChange((event, newSession) => {
              console.log('Auth state changed:', { 
                event, 
                hasSession: !!newSession,
                timestamp: new Date().toISOString()
              });
              
              if (newSession) {
                clearTimeout(timer);
                resolve(newSession);
              } else if (event === 'SIGNED_OUT') {
                clearTimeout(timer);
                reject(new Error('Sign in failed - please try again'));
              }
            });
          });

          await sessionPromise;
        }

        // Now update the auth store
        console.log('Updating auth store...');
        await getCurrentUser();
        
        if (!mounted) return;

        // Get the pre-auth path from localStorage
        const preAuthPath = localStorage.getItem('preAuthPath') || '/';
        localStorage.removeItem('preAuthPath');

        console.log('Authentication successful, redirecting to:', preAuthPath);
        navigate(preAuthPath, { replace: true });
      } catch (error) {
        console.error('Error in auth callback:', error);
        if (!mounted) return;
        
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        // Clear any partial auth state
        await supabase.auth.signOut();
        
        setTimeout(() => {
          if (mounted) {
            navigate('/auth?error=' + encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed'));
          }
        }, 3000);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    handleCallback();

    return () => {
      mounted = false;
      authStateSubscription?.data.subscription.unsubscribe();
    };
  }, [navigate, searchParams, getCurrentUser, location]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Authentication Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <p className="text-sm text-gray-500 text-center mt-4">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          ) : (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          {isLoading ? 'Completing authentication...' : 'Authentication successful!'}
        </h2>
        <p className="text-gray-600 text-center">
          {isLoading 
            ? 'Please wait while we process your login.'
            : 'Redirecting you to your dashboard...'}
        </p>
      </div>
    </div>
  );
};