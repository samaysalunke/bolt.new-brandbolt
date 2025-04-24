import { ProfileData, ContentStats, Post, Goal, Suggestion, User } from '../types';

// Mock user
export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
  linkedInConnected: true
};

// Mock profile data
export const mockProfileData: ProfileData = {
  completeness: 78,
  headline: 'Senior Product Manager | SaaS | User Experience | Growth',
  summary: 'Passionate product leader with 8+ years of experience building...',
  experience: 92,
  education: 100,
  skills: 75,
  recommendations: 60,
  activity: 65
};

// Mock content stats
export const mockContentStats: ContentStats = {
  daily: Array.from({ length: 7 }, (_, i) => ({
    impressions: 100 + Math.floor(Math.random() * 500),
    engagement: 1 + Math.floor(Math.random() * 10),
    followers: Math.floor(Math.random() * 5),
    comments: Math.floor(Math.random() * 15),
    shares: Math.floor(Math.random() * 8)
  })),
  weekly: Array.from({ length: 4 }, (_, i) => ({
    impressions: 500 + Math.floor(Math.random() * 2000),
    engagement: 5 + Math.floor(Math.random() * 25),
    followers: 3 + Math.floor(Math.random() * 15),
    comments: 10 + Math.floor(Math.random() * 50),
    shares: 5 + Math.floor(Math.random() * 20)
  })),
  monthly: Array.from({ length: 6 }, (_, i) => ({
    impressions: 2000 + Math.floor(Math.random() * 8000),
    engagement: 25 + Math.floor(Math.random() * 100),
    followers: 15 + Math.floor(Math.random() * 60),
    comments: 50 + Math.floor(Math.random() * 200),
    shares: 20 + Math.floor(Math.random() * 80)
  }))
};

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Excited to share that our team has launched a new feature that helps product managers track user feedback more effectively!',
    type: 'text',
    publishDate: '2025-05-20T10:00:00',
    status: 'published',
    metrics: {
      impressions: 1245,
      engagement: 4.5,
      followers: 7,
      comments: 12,
      shares: 5
    }
  },
  {
    id: '2',
    content: 'I\'ve been thinking about the future of remote work and compiled my thoughts into this article.',
    type: 'article',
    publishDate: '2025-05-10T14:30:00',
    status: 'published',
    metrics: {
      impressions: 3490,
      engagement: 6.2,
      followers: 14,
      comments: 23,
      shares: 18
    }
  },
  {
    id: '3',
    content: '5 Productivity Tips for Product Managers\n\n1. Time block your calendar\n2. Use the Eisenhower Matrix\n3. Batch similar tasks\n4. Practice saying no\n5. Reflect weekly',
    type: 'carousel',
    publishDate: '2025-04-28T09:15:00',
    status: 'published',
    metrics: {
      impressions: 4780,
      engagement: 8.1,
      followers: 23,
      comments: 31,
      shares: 27
    }
  },
  {
    id: '4',
    content: 'What\'s the most important skill for product managers in 2025?',
    type: 'poll',
    publishDate: '2025-06-05T11:00:00',
    status: 'scheduled'
  },
  {
    id: '5',
    content: 'Just finished reading "Inspired" by Marty Cagan. Highly recommend for all product people!',
    type: 'text',
    publishDate: '',
    status: 'draft'
  }
];

// Mock goals
export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Increase profile views',
    target: 500,
    current: 325,
    deadline: '2025-07-31',
    category: 'profile'
  },
  {
    id: '2',
    name: 'Grow followers',
    target: 1000,
    current: 678,
    deadline: '2025-08-15',
    category: 'followers'
  },
  {
    id: '3',
    name: 'Post consistency',
    target: 12,
    current: 5,
    deadline: '2025-06-30',
    category: 'posts'
  },
  {
    id: '4',
    name: 'Engagement rate',
    target: 5,
    current: 3.2,
    deadline: '2025-07-15',
    category: 'engagement'
  }
];

// Mock suggestions
export const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Add media to your profile',
    description: 'Profiles with media get 21x more views. Add presentations, videos, or documents.',
    category: 'profile',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Update your headline',
    description: 'Use keywords relevant to your industry to improve discoverability.',
    category: 'profile',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Try carousel posts',
    description: 'Your text posts perform well. Carousel posts can increase engagement by 2x.',
    category: 'content',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Engage with your network',
    description: 'Comment on 5 posts from your connections this week to boost visibility.',
    category: 'engagement',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Schedule posts consistently',
    description: 'Posting 2-3 times per week can increase your follower growth by 45%.',
    category: 'content',
    priority: 'low'
  }
];