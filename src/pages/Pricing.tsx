import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionTier } from '../types';
import PricingCard from '../components/pricing/PricingCard';
import { useSubscriptionStore } from '../store/subscriptionStore';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { subscribe, isLoading, error } = useSubscriptionStore();

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'price_free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic Profile Audit',
        '3 Content Ideas per Week',
        'Basic Analytics',
        'Community Support'
      ],
      limits: {
        auditReports: 1,
        ideasPerWeek: 3,
        scheduledPosts: 0,
        teamMembers: 1
      }
    },
    {
      id: 'price_pro',
      name: 'Pro',
      price: 999,
      interval: 'month',
      features: [
        'Advanced Profile Audit',
        '10 Content Ideas per Week',
        'Post Scheduling',
        'Advanced Analytics',
        'Priority Support',
        'Custom Templates'
      ],
      limits: {
        auditReports: -1,
        ideasPerWeek: 10,
        scheduledPosts: 30,
        teamMembers: 1
      }
    },
    {
      id: 'price_enterprise',
      name: 'Enterprise',
      price: 4999,
      interval: 'month',
      features: [
        'Custom Benchmarks',
        'Unlimited Content Ideas',
        'Team Dashboard',
        'API Access',
        'Dedicated Support',
        'Custom Integrations'
      ],
      limits: {
        auditReports: -1,
        ideasPerWeek: -1,
        scheduledPosts: -1,
        teamMembers: -1
      }
    }
  ];

  const handleSelectPlan = async (plan: SubscriptionTier) => {
    if (plan.name === 'Free') {
      navigate('/dashboard');
      return;
    }

    await subscribe(plan);
    navigate('/dashboard');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Start growing your LinkedIn presence with BrandBolt
        </p>
        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 max-w-7xl mx-auto">
        {subscriptionTiers.map((tier, index) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isPopular={index === 1}
            onSelectPlan={handleSelectPlan}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required for free plan.
        </p>
      </div>
    </div>
  );
};

export default Pricing