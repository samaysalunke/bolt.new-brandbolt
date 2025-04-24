import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  popularity: 'high' | 'medium' | 'low';
}

const TemplateGallery: React.FC = () => {
  const templates: Template[] = [
    {
      id: '1',
      title: 'How-to Guide',
      category: 'Education',
      description: 'Step-by-step instructions for solving a common problem',
      popularity: 'high'
    },
    {
      id: '2',
      title: 'Industry Insight',
      category: 'Thought Leadership',
      description: 'Share your perspective on recent trends or news',
      popularity: 'medium'
    },
    {
      id: '3',
      title: 'Personal Win',
      category: 'Achievement',
      description: 'Celebrate accomplishments while providing value',
      popularity: 'high'
    },
    {
      id: '4',
      title: 'Question Prompt',
      category: 'Engagement',
      description: 'Start conversations with thought-provoking questions',
      popularity: 'medium'
    },
    {
      id: '5',
      title: 'Data Insight',
      category: 'Analytics',
      description: 'Share interesting statistics with your analysis',
      popularity: 'medium'
    },
    {
      id: '6',
      title: 'Career Lesson',
      category: 'Professional Development',
      description: "Share what you've learned in your career journey",
      popularity: 'high'
    }
  ];

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">Popular</span>;
      case 'medium':
        return <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">Trending</span>;
      default:
        return null;
    }
  };

  return (
    <Card title="Content Templates" subtitle="Pre-designed formats for LinkedIn posts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <div 
            key={template.id}
            className="border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all hover:bg-blue-50/30"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{template.title}</h3>
              {getPopularityBadge(template.popularity)}
            </div>
            <p className="mt-1 text-xs text-blue-600">{template.category}</p>
            <p className="mt-2 text-sm text-gray-600">{template.description}</p>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
              >
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TemplateGallery;