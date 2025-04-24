import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.search);
      const code = hashParams.get('code');
      
      if (!code) {
        setError('No authentication code found');
        return;
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        
        if (data.session) {
          const redirectTo = localStorage.getItem('preAuthPath') || '/';
          localStorage.removeItem('preAuthPath');
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error('Error exchanging code for session:', error);
        setError('Failed to authenticate. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/auth')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Authenticating...</h2>
          <p className="mt-2 text-gray-600">Please wait while we complete your sign in.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;