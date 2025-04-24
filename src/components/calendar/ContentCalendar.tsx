import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Post } from '../../types';

interface ContentCalendarProps {
  posts: Post[];
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ posts }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const getMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };
  
  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add padding for previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null, isPadding: true });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isPadding: false,
        posts: posts.filter(post => {
          if (!post.publishDate) return false;
          const postDate = new Date(post.publishDate);
          return postDate.getDate() === i && 
                 postDate.getMonth() === month &&
                 postDate.getFullYear() === year;
        })
      });
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  
  const renderPost = (post: Post) => {
    return (
      <div 
        key={post.id}
        className={`p-1 text-xs rounded mb-1 truncate ${
          post.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
      </div>
    );
  };

  return (
    <Card title="Content Calendar" subtitle="Schedule and manage your LinkedIn posts">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={goToPreviousMonth}
            icon={<ChevronLeft size={16} />}
          />
          <h3 className="text-lg font-medium">{getMonthName(currentMonth)}</h3>
          <Button 
            variant="ghost" 
            onClick={goToNextMonth}
            icon={<ChevronRight size={16} />}
          />
        </div>
        <Button 
          variant="primary"
          size="sm" 
          icon={<Plus size={16} />}
        >
          New Post
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div 
            key={index}
            className={`min-h-24 border rounded-md p-1 ${
              day.isPadding
                ? 'bg-gray-50'
                : 'hover:border-blue-300 cursor-pointer'
            }`}
          >
            {!day.isPadding && (
              <>
                <div className={`text-right font-medium text-sm mb-1 ${
                  new Date().toDateString() === day.date?.toDateString()
                    ? 'text-blue-600 bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center ml-auto'
                    : 'text-gray-700'
                }`}>
                  {day.date?.getDate()}
                </div>
                <div className="overflow-y-auto max-h-20">
                  {day.posts && day.posts.map(post => renderPost(post))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ContentCalendar;