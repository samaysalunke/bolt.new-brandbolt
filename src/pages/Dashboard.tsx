import React, { useEffect } from 'react';
import { useLinkedInStore } from '../store/linkedinStore';
import { RefreshCw, Users, Eye, BarChart2, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    profile,
    posts,
    analytics,
    isLoading,
    error,
    lastSynced,
    syncData,
    loadProfile,
    loadPosts,
    loadAnalytics,
  } = useLinkedInStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadProfile(), loadPosts(), loadAnalytics()]);
    };
    loadData();
  }, [loadProfile, loadPosts, loadAnalytics]);

  const getLatestAnalytics = () => {
    if (!analytics.length) return null;
    return analytics[0];
  };

  const getEngagementRate = () => {
    if (!analytics.length) return 0;
    return analytics[0].engagement_rate.toFixed(2);
  };

  const getTotalEngagement = () => {
    if (!posts.length) return 0;
    return posts.reduce((total, post) => 
      total + post.likes_count + post.comments_count + post.shares_count, 0
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">LinkedIn Dashboard</h1>
        <button
          onClick={() => syncData()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {lastSynced && (
        <p className="text-sm text-gray-500 mb-6">
          Last synced: {formatDate(lastSynced.toISOString())}
        </p>
      )}

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Followers</h3>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getLatestAnalytics()?.followers_count.toLocaleString() || 0}
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Profile Views</h3>
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getLatestAnalytics()?.profile_views.toLocaleString() || 0}
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Engagement Rate</h3>
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getEngagementRate()}%
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Engagement</h3>
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getTotalEngagement().toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-4">
                <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(post.published_at)}</span>
                  <div className="flex items-center gap-4">
                    <span>{post.likes_count} likes</span>
                    <span>{post.comments_count} comments</span>
                    <span>{post.shares_count} shares</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Trend</h2>
          <div className="space-y-4">
            {analytics.slice(0, 7).map((day) => (
              <div key={day.date} className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-600">{formatDate(day.date)}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span>{day.impressions_count.toLocaleString()} impressions</span>
                  <span>{day.engagement_rate.toFixed(2)}% engagement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;