import React, { useEffect, useRef } from 'react';
import Card from '../common/Card';
import Tabs from '../common/Tabs';
import { ContentStats } from '../../types';

interface EngagementGraphProps {
  stats: ContentStats;
}

// Mock implementation of a chart using HTML/CSS
// In a real app, you would use a library like Chart.js or Recharts
const EngagementGraph: React.FC<EngagementGraphProps> = ({ stats }) => {
  const [timeframe, setTimeframe] = React.useState('daily');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  // Calculate maximum values for chart scaling
  const getMaxValues = () => {
    const data = timeframe === 'daily' ? stats.daily : 
                 timeframe === 'weekly' ? stats.weekly : stats.monthly;
    
    const maxImpressions = Math.max(...data.map(d => d.impressions));
    const maxEngagement = Math.max(...data.map(d => d.engagement * 100)); // Scale up for visibility
    
    return { maxImpressions, maxEngagement };
  };

  // Draw chart (simplified)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get data for selected timeframe
    const data = timeframe === 'daily' ? stats.daily : 
                 timeframe === 'weekly' ? stats.weekly : stats.monthly;
    
    const { maxImpressions, maxEngagement } = getMaxValues();
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw impressions line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (item.impressions / maxImpressions) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw engagement line
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - ((item.engagement * 100) / maxEngagement) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw dots for each data point
    data.forEach((item, index) => {
      // Impressions dots
      const xImpressions = padding + (chartWidth / (data.length - 1)) * index;
      const yImpressions = padding + chartHeight - (item.impressions / maxImpressions) * chartHeight;
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(xImpressions, yImpressions, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Engagement dots
      const xEngagement = padding + (chartWidth / (data.length - 1)) * index;
      const yEngagement = padding + chartHeight - ((item.engagement * 100) / maxEngagement) * chartHeight;
      
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(xEngagement, yEngagement, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // X-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    const labels = timeframe === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                   timeframe === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    labels.forEach((label, index) => {
      const x = padding + (chartWidth / (labels.length - 1)) * index;
      ctx.fillText(label, x, canvas.height - 15);
    });
  }, [timeframe, stats]);

  return (
    <Card 
      title="Engagement Performance" 
      subtitle="Track your content's reach and engagement"
    >
      <div className="mb-4">
        <Tabs 
          tabs={tabs} 
          defaultTab="daily" 
          onChange={(id) => setTimeframe(id)}
          variant="pills"
        />
      </div>
      
      <div className="mt-6 relative">
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Impressions</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Engagement Rate</span>
          </div>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={250} 
          className="w-full h-auto"
        ></canvas>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Avg Impressions</p>
          <p className="text-xl font-semibold">
            {Math.round(stats[timeframe as keyof ContentStats].reduce((acc, curr) => acc + curr.impressions, 0) / stats[timeframe as keyof ContentStats].length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Engagement</p>
          <p className="text-xl font-semibold">
            {(stats[timeframe as keyof ContentStats].reduce((acc, curr) => acc + curr.engagement, 0) / stats[timeframe as keyof ContentStats].length).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EngagementGraph;