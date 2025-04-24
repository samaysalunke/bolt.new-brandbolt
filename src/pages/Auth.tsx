import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Linkedin, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, resetPassword, updatePassword, isLoading, error, skipAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetPasswordFlow, setIsResetPasswordFlow] = useState(false);

  useEffect(() => {
    // Check if we're in the password reset flow
    const hash = location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsResetPasswordFlow(true);
    }
  }, [location]);

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

  const handleSkip = async () => {
    await skipAuth();
    navigate('/');
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }

    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (error) {
      setValidationError((error as Error).message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) return;
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await updatePassword(password);
      navigate('/');
    } catch (error) {
      setValidationError((error as Error).message);
    }
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

      setIsButtonDisabled(true);
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
      setIsButtonDisabled(false);
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
      if (isExistingUser) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const getErrorMessage = (error: string) => {
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

  if (isResetPasswordFlow) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Linkedin className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {validationError && (
              <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3">
                <AlertCircle className="h-5 w-5" />
                <span>{validationError}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleUpdatePassword}>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your new password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Linkedin className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!resetEmailSent ? (
              <>
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>

                {validationError && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>{validationError}</span>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleResetPassword}>
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
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-4 text-green-600">
                  ✓ Password reset email sent
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Return to login
                </button>
              </div>
            )}
          </div>
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
          {(error || validationError) && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3">
              <AlertCircle className="h-5 w-5" />
              <span>{getErrorMessage(error || validationError)}</span>
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
                  isLoading={isLoading}
                  disabled={isButtonDisabled || cooldownTime > 0}
                >
                  {cooldownTime > 0 ? `Wait ${cooldownTime}s` : 'Continue'}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Development mode</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleSkip}
              >
                Skip Authentication
              </Button>
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
                    autoComplete={isExistingUser ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationError(null);
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minLength={6}
                    placeholder={isExistingUser ? "Enter your password" : "Create a password (min. 6 characters)"}
                  />
                </div>
                {isExistingUser && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                {isExistingUser ? 'Sign in' : 'Create account'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};