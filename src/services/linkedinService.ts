import { supabase } from '../lib/supabase';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string[];
  email: string;
  headline?: string;
  industry?: string;
  vanityName?: string;
}

interface LinkedInPost {
  id: string;
  content: string;
  visibility: string;
  published: string;
  engagement: {
    numLikes: number;
    numComments: number;
    numShares: number;
    impressionCount: number;
  };
}

interface LinkedInAnalytics {
  date: string;
  followersCount: number;
  impressionsCount: number;
  engagementRate: number;
  profileViews: number;
}

type LinkedInApiResponse = LinkedInProfile | LinkedInPost | LinkedInAnalytics | any;

class LinkedInService {
  private accessToken: string | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.provider_token) {
      this.accessToken = session.provider_token;
    }
  }

  private async refreshToken() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.provider_token) {
      this.accessToken = session.provider_token;
    } else {
      throw new Error('No LinkedIn access token available');
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit = {}): Promise<LinkedInApiResponse> {
    if (!this.accessToken) {
      await this.refreshToken();
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (response.status === 401) {
      await this.refreshToken();
      return this.fetchWithRetry(url, options);
    }

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    return response.json();
  }

  async syncProfile() {
    try {
      // Fetch basic profile info
      const profileData = await this.fetchWithRetry(
        'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture,headline,vanityName,industry)'
      );

      // Fetch email address
      const emailData = await this.fetchWithRetry(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
      );

      const email = emailData.elements[0]['handle~'].emailAddress;

      // Store in database
      const { data: profile, error } = await supabase
        .from('linkedin_profiles')
        .upsert({
          linkedin_id: profileData.id,
          first_name: profileData.firstName.localized.en_US,
          last_name: profileData.lastName.localized.en_US,
          email,
          profile_picture_url: profileData.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
          headline: profileData.headline?.localized?.en_US,
          industry: profileData.industry,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error syncing LinkedIn profile:', error);
      throw error;
    }
  }

  async syncPosts() {
    try {
      const { data: profile } = await supabase
        .from('linkedin_profiles')
        .select('id, linkedin_id')
        .single();

      if (!profile) throw new Error('LinkedIn profile not found');

      // Fetch posts
      const postsData = await this.fetchWithRetry(
        `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${profile.linkedin_id})&count=50`
      );

      // Process each post
      for (const post of postsData.elements) {
        const { data: postData, error } = await supabase
          .from('linkedin_posts')
          .upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            linkedin_profile_id: profile.id,
            post_urn: post.id,
            content: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text,
            visibility: post.visibility.com_linkedin_ugc_MemberNetworkVisibility,
            published_at: new Date(post.created.time).toISOString(),
            likes_count: post.socialDetail?.totalSocialActivityCounts?.numLikes || 0,
            comments_count: post.socialDetail?.totalSocialActivityCounts?.numComments || 0,
            shares_count: post.socialDetail?.totalSocialActivityCounts?.numShares || 0,
          }, {
            onConflict: 'post_urn'
          })
          .select()
          .single();

        if (error) throw error;
      }

      return postsData.elements.length;
    } catch (error) {
      console.error('Error syncing LinkedIn posts:', error);
      throw error;
    }
  }

  async syncAnalytics() {
    try {
      const { data: profile } = await supabase
        .from('linkedin_profiles')
        .select('id, linkedin_id')
        .single();

      if (!profile) throw new Error('LinkedIn profile not found');

      // Fetch analytics
      const analyticsData = await this.fetchWithRetry(
        `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${profile.linkedin_id}&timeIntervals.timeGranularityType=DAY&timeIntervals.timeRange.start=${Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60}`
      );

      // Process analytics data
      for (const day of analyticsData.elements) {
        const { data: analytics, error } = await supabase
          .from('linkedin_analytics')
          .upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            linkedin_profile_id: profile.id,
            date: new Date(day.timeRange.start * 1000).toISOString().split('T')[0],
            followers_count: day.totalFollowerCount,
            impressions_count: day.totalShareStatistics.impressionCount,
            engagement_rate: (
              (day.totalShareStatistics.likeCount +
                day.totalShareStatistics.commentCount +
                day.totalShareStatistics.shareCount) /
              day.totalShareStatistics.impressionCount
            ) * 100,
            profile_views: day.totalShareStatistics.clickCount,
          }, {
            onConflict: 'linkedin_profile_id, date'
          })
          .select()
          .single();

        if (error) throw error;
      }

      return analyticsData.elements.length;
    } catch (error) {
      console.error('Error syncing LinkedIn analytics:', error);
      throw error;
    }
  }

  async syncAll() {
    await this.syncProfile();
    await this.syncPosts();
    await this.syncAnalytics();
  }
}

export const linkedInService = new LinkedInService(); 