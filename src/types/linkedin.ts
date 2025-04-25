export interface LinkedInPost {
  id: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  impressions_count: number;
  created_at: string;
  content: string;
  media_url?: string;
} 