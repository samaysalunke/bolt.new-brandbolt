import React from 'react';
import ProfileScoreCard from '../components/dashboard/ProfileScoreCard';
import SuggestionsCard from '../components/dashboard/SuggestionsCard';
import EngagementGraph from '../components/dashboard/EngagementGraph';
import RecentPostsCard from '../components/dashboard/RecentPostsCard';
import GoalsCard from '../components/dashboard/GoalsCard';
import { 
  mockProfileData, 
  mockContentStats, 
  mockPosts, 
  mockGoals, 
  mockSuggestions 
} from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome to BrandBolt</h1>
      <p className="text-gray-600">Enhance your LinkedIn presence and grow your personal brand.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileScoreCard profileData={mockProfileData} />
        </div>
        <div className="md:col-span-2">
          <EngagementGraph stats={mockContentStats} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentPostsCard posts={mockPosts} />
        </div>
        <div className="md:col-span-1">
          <SuggestionsCard suggestions={mockSuggestions} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <GoalsCard goals={mockGoals} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;