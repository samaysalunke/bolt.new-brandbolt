import React from 'react';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Suggestion } from '../../types';

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

const SuggestionsCard: React.FC<SuggestionsCardProps> = ({ suggestions }) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="success">Low</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'profile':
        return <Badge variant="info">Profile</Badge>;
      case 'content':
        return <Badge variant="default">Content</Badge>;
      case 'engagement':
        return <Badge variant="success">Engagement</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      title="Personalized Suggestions" 
      subtitle="Based on your LinkedIn activity"
    >
      <div className="space-y-4">
        {suggestions.slice(0, 3).map((suggestion) => (
          <div 
            key={suggestion.id} 
            className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
              {getPriorityBadge(suggestion.priority)}
            </div>
            <p className="mt-1 text-sm text-gray-600">{suggestion.description}</p>
            <div className="mt-2 flex justify-between items-center">
              {getCategoryBadge(suggestion.category)}
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Apply now <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {suggestions.length > 3 && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all suggestions ({suggestions.length})
          </button>
        </div>
      )}
    </Card>
  );
};

export default SuggestionsCard;