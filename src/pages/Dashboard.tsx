import React from 'react';
import { Linkedin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { signInWithLinkedIn, isLoading, user } = useAuthStore();

  const handleLinkedInConnect = async () => {
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
    }
  };

  if (user?.app_metadata?.provider === 'linkedin_oidc') {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to BrandBolt!</h1>
            <p className="text-gray-600">
              You're connected with LinkedIn as {user.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          isLoading={isLoading}
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