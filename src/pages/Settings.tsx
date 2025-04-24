import React from 'react';
import { Linkedin } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

const Settings: React.FC = () => {
  const { user, linkLinkedIn, isLoading, error } = useAuthStore();
  const isLinkedInConnected = user?.app_metadata?.provider === 'linkedin_oidc';

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
                  ? 'Your LinkedIn account is connected' 
                  : 'Connect your LinkedIn account to get started'}
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-1">
                  {error.includes('provider is not enabled')
                    ? 'LinkedIn authentication is not configured. Please contact support.'
                    : error}
                </p>
              )}
            </div>
          </div>
          
          {!isLinkedInConnected && (
            <Button
              variant="primary"
              size="sm"
              onClick={linkLinkedIn}
              isLoading={isLoading}
              icon={<Linkedin size={16} />}
            >
              Connect LinkedIn
            </Button>
          )}
          
          {isLinkedInConnected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connected
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Settings;