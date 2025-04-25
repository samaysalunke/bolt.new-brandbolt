import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePicture?: string;
  email: string;
  industry?: string;
  location?: string;
  connections?: number;
}

interface LinkedInPost {
  id: string;
  content: string;
  visibility: string;
  published_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
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
  posts: LinkedInPost[];
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
  posts: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useLinkedInStore = create<LinkedInState & LinkedInActions>((set) => ({
  ...initialState,

  fetchLinkedInData: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get the current session to check for LinkedIn token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.provider_token) {
        throw new Error('No LinkedIn access token available');
      }

      // Fetch LinkedIn profile data
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (!profileResponse.ok) {
        console.error('LinkedIn API Error:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText,
        });
        throw new Error('Failed to fetch LinkedIn data');
      }

      const profileData = await profileResponse.json();
      
      // Fetch posts data
      const postsResponse = await fetch(
        'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:' + profileData.id + ')',
        {
          headers: {
            'Authorization': `Bearer ${session.provider_token}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      if (!postsResponse.ok) {
        console.error('LinkedIn Posts API Error:', {
          status: postsResponse.status,
          statusText: postsResponse.statusText,
        });
      }

      const postsData = await postsResponse.json();
      console.log('LinkedIn Posts Data:', postsData);

      // Transform the profile data
      const profile: LinkedInProfile = {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        headline: profileData.localizedHeadline,
        profilePicture: profileData.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
        email: session.user?.email || '',
        industry: profileData.localizedIndustry,
      };

      // Transform the posts data
      const posts: LinkedInPost[] = postsData.elements?.map((post: any) => ({
        id: post.id,
        content: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
        visibility: post.visibility?.['com.linkedin.ugc.MemberNetworkVisibility'] || 'CONNECTIONS',
        published_at: new Date(post.created?.time || Date.now()).toISOString(),
        likes_count: post.socialDetail?.totalSocialActivityCounts?.numLikes || 0,
        comments_count: post.socialDetail?.totalSocialActivityCounts?.numComments || 0,
        shares_count: post.socialDetail?.totalSocialActivityCounts?.numShares || 0,
      })) || [];

      // Store in Supabase for persistence
      const { error: dbError } = await supabase
        .from('linkedin_profiles')
        .upsert({
          user_id: session.user.id,
          profile_data: profile,
          posts_data: posts,
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
        posts,
        lastFetched: new Date(),
        isLoading: false,
        error: null,
      });
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