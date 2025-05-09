import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Starting callback handling...');
        
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }

        if (!session) {
          console.error('No session found');
          throw new Error('No session found');
        }

        console.log('Callback successful:', {
          user: session.user.id,
          provider: session.user.app_metadata.provider,
          email: session.user.email
        });

        // Initialize auth state
        await initializeAuth();

        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to dashboard
        console.log('Redirecting to dashboard...');
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Callback error:', error);
        // For now, just redirect to home on error
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, initializeAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}; 