// Common Types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  linkedInConnected: boolean;
  subscription?: SubscriptionTier;
}

export interface ProfileData {
  completeness: number;
  headline: string;
  summary: string;
  experience: number;
  education: number;
  skills: number;
  recommendations: number;
  activity: number;
}

export interface ContentMetrics {
  impressions: number;
  engagement: number;
  followers: number;
  comments: number;
  shares: number;
}

export interface ContentStats {
  daily: ContentMetrics[];
  weekly: ContentMetrics[];
  monthly: ContentMetrics[];
}

export interface Post {
  id: string;
  content: string;
  type: 'text' | 'article' | 'carousel' | 'poll';
  publishDate: string;
  status: 'draft' | 'scheduled' | 'published';
  metrics?: ContentMetrics;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: 'engagement' | 'followers' | 'posts' | 'profile';
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'profile' | 'content' | 'engagement';
  priority: 'high' | 'medium' | 'low';
}

export interface SubscriptionTier {
  id: string;
  name: 'Free' | 'Pro' | 'Enterprise';
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    auditReports: number;
    ideasPerWeek: number;
    scheduledPosts: number;
    teamMembers: number;
  };
}

export interface PricingFeature {
  name: string;
  tiers: {
    free: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
  };
}