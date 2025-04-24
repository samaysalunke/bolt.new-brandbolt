import React from 'react';
import { ExternalLink } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { ProfileData } from '../../types';

interface ProfileScoreCardProps {
  profileData: ProfileData;
}

const ProfileScoreCard: React.FC<ProfileScoreCardProps> = ({ profileData }) => {
  const scoreCategories = [
    { name: 'Experience', value: profileData.experience },
    { name: 'Education', value: profileData.education },
    { name: 'Skills', value: profileData.skills },
    { name: 'Recommendations', value: profileData.recommendations },
    { name: 'Activity', value: profileData.activity }
  ];

  return (
    <Card 
      title="LinkedIn Profile Score" 
      subtitle="Optimize your profile to increase visibility"
      headerAction={
        <Button 
          variant="outline" 
          size="sm"
          icon={<ExternalLink size={16} />}
          iconPosition="right"
        >
          Full Audit
        </Button>
      }
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Overall Score</span>
          <span className="text-2xl font-bold text-blue-600">{profileData.completeness}%</span>
        </div>
        <ProgressBar 
          value={profileData.completeness} 
          size="lg" 
          variant={profileData.completeness > 70 ? 'success' : 'warning'}
        />
      </div>
      
      <div className="space-y-4">
        {scoreCategories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">{category.name}</span>
              <span className="text-sm font-medium">{category.value}%</span>
            </div>
            <ProgressBar 
              value={category.value} 
              size="sm" 
              variant={category.value > 80 ? 'success' : category.value > 50 ? 'default' : 'warning'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileScoreCard;