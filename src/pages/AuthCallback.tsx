import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the session from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error('No session found');
        }

        // Initialize auth state
        await initializeAuth();

        // Get the pre-auth path from localStorage
        const preAuthPath = localStorage.getItem('preAuthPath') || '/';
        localStorage.removeItem('preAuthPath');

        // Wait a moment to ensure the auth state is properly updated
        setTimeout(() => {
          navigate(preAuthPath, { replace: true });
        }, 100);
      } catch (error) {
        console.error('Error handling auth callback:', error);
        setError('Failed to authenticate. Please try again.');
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [initializeAuth, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <div className="text-gray-500">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <div className="mt-4 text-gray-500">Completing authentication...</div>
      </div>
    </div>
  );
}; 