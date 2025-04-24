import React from 'react';
import ContentComposer from '../components/content/ContentComposer';
import TemplateGallery from '../components/content/TemplateGallery';

const Content: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Creator</h1>
        <p className="text-gray-600">Create, optimize, and schedule your LinkedIn content.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ContentComposer />
        <TemplateGallery />
      </div>
    </div>
  );
};

export default Content;