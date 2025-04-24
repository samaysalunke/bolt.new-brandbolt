import React from 'react';
import ContentCalendar from '../components/calendar/ContentCalendar';
import { mockPosts } from '../data/mockData';

const Calendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
        <p className="text-gray-600">Schedule and plan your LinkedIn content strategy.</p>
      </div>
      
      <ContentCalendar posts={mockPosts} />
    </div>
  );
};

export default Calendar;