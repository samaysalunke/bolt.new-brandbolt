import React, { useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useLinkedInStore } from '../store/linkedinStore';

const Settings: React.FC = () => {
  const { user, signInWithLinkedIn, isLoading: authLoading, error: authError } = useAuthStore();
  const { 
    profile: linkedInProfile, 
    fetchLinkedInData, 
    isLoading: linkedInLoading,
    error: linkedInError,
    lastFetched
  } = useLinkedInStore();
  
  const isLinkedInConnected = user?.app_metadata?.provider === 'linkedin_oidc';

  useEffect(() => {
    if (isLinkedInConnected && !linkedInProfile) {
      fetchLinkedInData();
    }
  }, [isLinkedInConnected, linkedInProfile, fetchLinkedInData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and connections.</p>
      </div>

      <Card title="Account Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card title="LinkedIn Connection" 
        subtitle="Connect your LinkedIn account to enable posting and analytics">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Linkedin className="h-8 w-8 text-[#0A66C2]" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">LinkedIn Account</h3>
              <p className="text-sm text-gray-500">
                {isLinkedInConnected 
                  ? `Connected as ${linkedInProfile?.firstName} ${linkedInProfile?.lastName}` 
                  : 'Connect your LinkedIn account to get started'}
              </p>
              {(authError || linkedInError) && (
                <p className="text-sm text-red-600 mt-1">
                  {authError || linkedInError}
                </p>
              )}
              {lastFetched && (
                <p className="text-xs text-gray-400 mt-1">
                  Last synced: {new Date(lastFetched).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          {!isLinkedInConnected && (
            <Button
              variant="primary"
              size="sm"
              onClick={signInWithLinkedIn}
              isLoading={authLoading}
              icon={<Linkedin size={16} />}
            >
              Connect LinkedIn
            </Button>
          )}
          
          {isLinkedInConnected && (
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchLinkedInData}
                isLoading={linkedInLoading}
              >
                Refresh Data
              </Button>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
          )}
        </div>

        {isLinkedInConnected && linkedInProfile && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Profile Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {linkedInProfile.firstName} {linkedInProfile.lastName}
                </p>
              </div>
              {linkedInProfile.headline && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Headline</label>
                  <p className="mt-1 text-sm text-gray-900">{linkedInProfile.headline}</p>
                </div>
              )}
              {linkedInProfile.industry && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Industry</label>
                  <p className="mt-1 text-sm text-gray-900">{linkedInProfile.industry}</p>
                </div>
              )}
              {linkedInProfile.email && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{linkedInProfile.email}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settings;