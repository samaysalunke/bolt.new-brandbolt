import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Linkedin, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../modules/auth/hooks/useAuth';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error: authError, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isLoading: hookLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  console.log('Auth component render:', {
    isAuthenticated,
    authLoading,
    hookLoading,
    hasAuthError: !!authError
  });

  // Navigate when authenticated
  useEffect(() => {
    console.log('Auth navigation effect:', {
      isAuthenticated,
      authLoading,
      hookLoading
    });
    
    if (isAuthenticated && !authLoading && !hookLoading) {
      console.log('Navigating to home...');
      navigate('/');
    }
  }, [isAuthenticated, authLoading, hookLoading, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const checkUserExists = async (email: string) => {
    try {
      setValidationError(null);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setValidationError('Please enter a valid email address');
        return;
      }

      if (cooldownTime > 0) {
        setValidationError(`Please wait ${cooldownTime} seconds before trying again`);
        return;
      }

      setIsCheckingUser(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) {
        if (error.message.includes('rate_limit')) {
          setCooldownTime(35);
          setValidationError('Please wait 35 seconds before requesting another email');
        } else {
          setValidationError(error.message);
        }
      } else {
        setIsExistingUser(!error);
        setShowPassword(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setValidationError('An error occurred while checking the email. Please try again.');
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }
    await checkUserExists(email);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!validatePassword(password)) {
      return;
    }

    try {
      console.log('Starting sign in submission...');
      setIsSigningIn(true);
      await signIn(email, password);
      console.log('Sign in submission complete');
    } catch (error) {
      console.error('Authentication error in component:', error);
      setValidationError(getErrorMessage((error as Error).message));
    } finally {
      setIsSigningIn(false);
    }
  };

  const getErrorMessage = (error: string | null) => {
    if (!error) return '';
    
    switch (error) {
      case 'Invalid login credentials':
        return 'The email or password you entered is incorrect. Please try again.';
      case 'Email not confirmed':
        return 'Please check your email to confirm your account before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.';
      default:
        return error;
    }
  };

  // Show loading state while checking authentication
  const isGlobalLoading = (authLoading || hookLoading) && !isSigningIn && !isCheckingUser;
  
  if (isGlobalLoading) {
    console.log('Rendering loading state', {
      authLoading,
      hookLoading,
      isSigningIn,
      isCheckingUser
    });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Linkedin className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to BrandBolt
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(authError || validationError) && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3">
              <AlertCircle className="h-5 w-5" />
              <span>{getErrorMessage(authError || validationError)}</span>
            </div>
          )}

          {!showPassword ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationError(null);
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isCheckingUser}
                  disabled={isButtonDisabled || cooldownTime > 0}
                >
                  {cooldownTime > 0 ? `Wait ${cooldownTime}s` : 'Continue'}
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleAuthSubmit}>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(false);
                      setIsExistingUser(null);
                      setPassword('');
                      setValidationError(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Change
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-900">{email}</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationError(null);
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minLength={6}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSigningIn}
              >
                Sign in
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};