import React, { useEffect } from 'react';
import { Linkedin, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLinkedInStore } from '../store/linkedinStore';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { signInWithLinkedIn, isLoading: authLoading, user, isInitialized } = useAuthStore();
  const { 
    profile,
    isLoading: linkedInLoading,
    error: linkedInError,
    lastFetched,
    fetchLinkedInData 
  } = useLinkedInStore();

  useEffect(() => {
    if (user?.app_metadata?.provider === 'linkedin_oidc') {
      console.log('Fetching LinkedIn data for user:', {
        id: user.id,
        provider: user.app_metadata.provider
      });
      fetchLinkedInData();
    }
  }, [user, fetchLinkedInData]);

  const handleLinkedInConnect = async () => {
    try {
      console.log('Starting LinkedIn connection...');
      await signInWithLinkedIn();
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
    }
  };

  // Only show loading state when auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show LinkedIn data if user is connected
  if (user?.app_metadata?.provider === 'linkedin_oidc') {
    if (linkedInError) {
      return (
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-red-700 font-medium">Error Loading LinkedIn Data</h2>
              <p className="text-red-600 mt-1">{linkedInError}</p>
              <Button
                onClick={fetchLinkedInData}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LinkedIn Dashboard</h1>
            {profile && (
              <p className="text-gray-600 mt-1">
                Welcome back, {profile.firstName} {profile.lastName}
              </p>
            )}
          </div>
          <Button
            onClick={fetchLinkedInData}
            variant="secondary"
            size="sm"
            isLoading={linkedInLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${linkedInLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {lastFetched && (
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {new Date(lastFetched).toLocaleString()}
          </p>
        )}

        {profile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h2>
            <div className="space-y-4">
              {profile.picture && (
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={profile.picture}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-24 h-24 rounded-full"
                  />
                </div>
              )}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{profile.firstName} {profile.lastName}</span>
              </div>
              {profile.headline && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Headline</span>
                  <span className="font-medium">{profile.headline}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{profile.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show connect button for non-connected users
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <Linkedin className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to BrandBolt
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect with LinkedIn to get started
        </p>
        <Button
          onClick={handleLinkedInConnect}
          isLoading={authLoading}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          <Linkedin className="h-5 w-5" />
          Connect with LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;