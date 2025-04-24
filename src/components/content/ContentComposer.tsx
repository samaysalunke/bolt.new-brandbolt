import React, { useState } from 'react';
import { Sparkles, Calendar, SendHorizonal, Save, Image, FilePlus, List, BarChart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Tabs from '../common/Tabs';

const ContentComposer: React.FC = () => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text');
  
  const contentTypes = [
    { id: 'text', label: 'Text Post' },
    { id: 'article', label: 'Article' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'poll', label: 'Poll' }
  ];

  const handleGenerate = () => {
    // Simulate AI-generated content
    const suggestions = [
      "Just wrapped up an insightful project on optimizing LinkedIn profiles for tech professionals. Three key takeaways: 1) Strategic keyword placement boosts visibility by 40%, 2) Weekly content consistency trumps sporadic posting, and 3) Engagement within the first hour matters most. What LinkedIn strategy has worked best for your professional growth?",
      "Excited to share that our team has launched a new feature that helps product managers track user feedback more effectively!",
      "One skill I've found invaluable in my career journey: the ability to translate complex technical concepts into business value. It's not just about what the technology does, but how it solves real problems for customers."
    ];
    
    setContent(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <Card title="Content Composer" subtitle="Create engaging LinkedIn content">
      <div className="mb-4">
        <Tabs 
          tabs={contentTypes} 
          defaultTab="text" 
          onChange={(id) => setContentType(id)}
          variant="buttons"
        />
      </div>
      
      <div className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to share?"
          className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            icon={<Sparkles size={16} />}
            onClick={handleGenerate}
          >
            Generate Ideas
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={<Image size={16} />}
          >
            Add Media
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={<FilePlus size={16} />}
          >
            Add Document
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={<List size={16} />}
          >
            Templates
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={<BarChart size={16} />}
          >
            Analyze
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            icon={<Save size={16} />}
          >
            Save Draft
          </Button>
          <Button 
            variant="outline" 
            icon={<Calendar size={16} />}
          >
            Schedule
          </Button>
        </div>
        
        <Button 
          variant="primary" 
          icon={<SendHorizonal size={16} />}
          disabled={!content.trim()}
        >
          Post Now
        </Button>
      </div>
    </Card>
  );
};

export default ContentComposer;