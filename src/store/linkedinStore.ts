import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  email: string;
  picture?: string;
}

interface LinkedInStats {
  followers: number;
  connections: number;
  profileViews: number;
  postImpressions: number;
  engagementRate: number;
}

interface LinkedInState {
  profile: LinkedInProfile | null;
  stats: LinkedInStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

interface LinkedInActions {
  fetchLinkedInData: () => Promise<void>;
  clearError: () => void;
}

const initialState: LinkedInState = {
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useLinkedInStore = create<LinkedInState & LinkedInActions>((set) => ({
  ...initialState,

  fetchLinkedInData: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching LinkedIn data...');

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error('No authenticated user found');
      }

      // Get user claims which contain LinkedIn profile data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('No user data available');
      }

      console.log('User data:', user);

      // Extract profile data from user metadata
      const profile: LinkedInProfile = {
        id: user.id,
        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        picture: user.user_metadata?.avatar_url,
      };

      // For now, we'll use placeholder stats since we don't have direct API access
      const stats: LinkedInStats = {
        followers: 0,
        connections: 0,
        profileViews: 0,
        postImpressions: 0,
        engagementRate: 0,
      };

      // Store in Supabase for persistence
      const { error: dbError } = await supabase
        .from('linkedin_profiles')
        .upsert({
          user_id: user.id,
          profile_data: profile,
          last_synced: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (dbError) {
        console.error('Database Error:', dbError);
        throw dbError;
      }

      set({
        profile,
        stats,
        lastFetched: new Date(),
        isLoading: false,
        error: null,
      });

      console.log('LinkedIn data fetched successfully:', { profile, stats });
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch LinkedIn data',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
})); 