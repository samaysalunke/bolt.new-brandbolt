import React from 'react';
import { PlusCircle } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { Goal } from '../../types';

interface GoalsCardProps {
  goals: Goal[];
}

const GoalsCard: React.FC<GoalsCardProps> = ({ goals }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const getDaysRemaining = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card 
      title="Your Goals" 
      subtitle="Track your LinkedIn growth metrics"
      headerAction={
        <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          <PlusCircle size={16} className="mr-1" /> New Goal
        </button>
      }
    >
      <div className="space-y-5">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{goal.name}</h4>
                <p className="text-xs text-gray-500">
                  Due {formatDate(goal.deadline)} 
                  <span className="ml-2 font-medium text-purple-600">
                    {getDaysRemaining(goal.deadline)} days left
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {goal.current} / {goal.target}
                </span>
                <p className="text-xs text-gray-500">
                  {Math.round((goal.current / goal.target) * 100)}% Complete
                </p>
              </div>
            </div>
            <ProgressBar 
              value={goal.current} 
              max={goal.target} 
              size="md"
              variant={((goal.current / goal.target) * 100) > 66 ? 'success' : 'default'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GoalsCard;