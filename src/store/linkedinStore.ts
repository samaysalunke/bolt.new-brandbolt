import { create } from 'zustand';
import { linkedInService } from '../services/linkedinService';
import { supabase } from '../lib/supabase';

interface LinkedInProfile {
  id: string;
  linkedin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string;
  headline?: string;
  industry?: string;
}

interface LinkedInPost {
  id: string;
  post_urn: string;
  content: string;
  visibility: string;
  published_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  impressions_count: number;
  engagement_rate: number;
}

interface LinkedInAnalytics {
  date: string;
  followers_count: number;
  impressions_count: number;
  engagement_rate: number;
  profile_views: number;
}

interface LinkedInState {
  profile: LinkedInProfile | null;
  posts: LinkedInPost[];
  analytics: LinkedInAnalytics[];
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;
  syncData: () => Promise<void>;
  loadProfile: () => Promise<void>;
  loadPosts: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
}

export const useLinkedInStore = create<LinkedInState>((set, get) => ({
  profile: null,
  posts: [],
  analytics: [],
  isLoading: false,
  error: null,
  lastSynced: null,

  syncData: async () => {
    try {
      set({ isLoading: true, error: null });
      await linkedInService.syncAll();
      await Promise.all([
        get().loadProfile(),
        get().loadPosts(),
        get().loadAnalytics(),
      ]);
      set({ lastSynced: new Date() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sync LinkedIn data' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async () => {
    try {
      const { data, error } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error loading LinkedIn profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load LinkedIn profile' });
    }
  },

  loadPosts: async () => {
    try {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      set({ posts: data });
    } catch (error) {
      console.error('Error loading LinkedIn posts:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load LinkedIn posts' });
    }
  },

  loadAnalytics: async () => {
    try {
      const { data, error } = await supabase
        .from('linkedin_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      set({ analytics: data });
    } catch (error) {
      console.error('Error loading LinkedIn analytics:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load LinkedIn analytics' });
    }
  },
})); 