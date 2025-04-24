import React from 'react';
import { MoreHorizontal, Calendar, Eye, MessageCircle, Share } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Post } from '../../types';

interface RecentPostsCardProps {
  posts: Post[];
}

const RecentPostsCard: React.FC<RecentPostsCardProps> = ({ posts }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      default:
        return null;
    }
  };

  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case 'text':
        return <Badge variant="default">Text</Badge>;
      case 'article':
        return <Badge variant="info">Article</Badge>;
      case 'carousel':
        return <Badge variant="warning">Carousel</Badge>;
      case 'poll':
        return <Badge variant="success">Poll</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <Card 
      title="Recent Posts" 
      subtitle="Review and manage your LinkedIn content"
      headerAction={
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all
        </button>
      }
    >
      <div className="space-y-4">
        {posts.slice(0, 3).map((post) => (
          <div 
            key={post.id} 
            className="group border border-gray-200 hover:border-blue-200 rounded-lg p-3 transition-all hover:bg-blue-50/30"
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-2">
                {getStatusBadge(post.status)}
                {getPostTypeBadge(post.type)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <p className="mt-2 text-sm text-gray-800 line-clamp-2">
              {post.content}
            </p>
            
            <div className="mt-3 flex items-center justify-between">
              {post.publishDate ? (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={14} className="mr-1" /> 
                  {formatDate(post.publishDate)}
                </div>
              ) : (
                <span className="text-xs text-gray-500">No date set</span>
              )}
              
              {post.metrics && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye size={14} className="mr-1" /> 
                    {post.metrics.impressions.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MessageCircle size={14} className="mr-1" /> 
                    {post.metrics.comments}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Share size={14} className="mr-1" /> 
                    {post.metrics.shares}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentPostsCard;