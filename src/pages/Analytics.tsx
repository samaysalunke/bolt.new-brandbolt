import React from 'react';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import EngagementGraph from '../components/dashboard/EngagementGraph';
import { mockContentStats, mockPosts } from '../data/mockData';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'posts', label: 'Posts' },
    { id: 'followers', label: 'Followers' },
    { id: 'demographics', label: 'Demographics' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track and analyze your LinkedIn performance metrics.</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Tabs 
            tabs={tabs} 
            defaultTab="overview" 
            onChange={setActiveTab}
            variant="underline"
          />
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Impressions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24.5K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 12% from last month
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Avg. Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">4.2%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 0.8% from last month
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">New Followers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">78</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 15 more than last month
                  </p>
                </div>
              </div>
              
              <EngagementGraph stats={mockContentStats} />
              
              <Card title="Content Performance" subtitle="Analysis by post type">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Post Type</th>
                        <th className="px-4 py-3">Count</th>
                        <th className="px-4 py-3">Avg. Impressions</th>
                        <th className="px-4 py-3">Avg. Engagement</th>
                        <th className="px-4 py-3">Avg. Comments</th>
                        <th className="px-4 py-3">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-medium">Text Posts</td>
                        <td className="px-4 py-3">14</td>
                        <td className="px-4 py-3">1,245</td>
                        <td className="px-4 py-3">3.4%</td>
                        <td className="px-4 py-3">8</td>
                        <td className="px-4 py-3 text-blue-600">Add questions to increase engagement</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-medium">Articles</td>
                        <td className="px-4 py-3">3</td>
                        <td className="px-4 py-3">3,490</td>
                        <td className="px-4 py-3">5.2%</td>
                        <td className="px-4 py-3">15</td>
                        <td className="px-4 py-3 text-blue-600">Create more articles (high engagement)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-medium">Carousels</td>
                        <td className="px-4 py-3">5</td>
                        <td className="px-4 py-3">4,780</td>
                        <td className="px-4 py-3">6.8%</td>
                        <td className="px-4 py-3">24</td>
                        <td className="px-4 py-3 text-blue-600">Focus on this format (best performer)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Polls</td>
                        <td className="px-4 py-3">2</td>
                        <td className="px-4 py-3">2,340</td>
                        <td className="px-4 py-3">7.1%</td>
                        <td className="px-4 py-3">6</td>
                        <td className="px-4 py-3 text-blue-600">Use polls for market research</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === 'posts' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Post Performance</h3>
              {/* Post performance content here */}
            </div>
          )}
          
          {activeTab === 'followers' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Follower Growth</h3>
              {/* Follower growth content here */}
            </div>
          )}
          
          {activeTab === 'demographics' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Demographics</h3>
              {/* Demographics content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;