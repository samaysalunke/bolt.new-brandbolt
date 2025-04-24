import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { SubscriptionTier } from '../types';

interface SubscriptionState {
  currentPlan: SubscriptionTier | null;
  isLoading: boolean;
  error: string | null;
  subscribe: (plan: SubscriptionTier) => Promise<void>;
  getCurrentPlan: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentPlan: null,
  isLoading: false,
  error: null,

  subscribe: async (plan: SubscriptionTier) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate period end (30 days from now)
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      // Create or update subscription
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active',
          current_period_end: currentPeriodEnd.toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      set({ currentPlan: plan });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentPlan: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (subscription) {
        set({ currentPlan: subscription.plan });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));