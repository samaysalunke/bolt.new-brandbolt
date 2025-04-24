import React from 'react';
import { Check } from 'lucide-react';
import Button from '../common/Button';
import { SubscriptionTier } from '../../types';

interface PricingCardProps {
  tier: SubscriptionTier;
  isPopular?: boolean;
  isLoading?: boolean;
  onSelectPlan: (plan: SubscriptionTier) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  isPopular = false,
  isLoading = false,
  onSelectPlan,
}) => {
  return (
    <div className={`
      relative bg-white rounded-2xl shadow-lg border
      ${isPopular ? 'border-blue-500 scale-105' : 'border-gray-200'}
    `}>
      {isPopular && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold tracking-tight text-gray-900">
            ₹{tier.price}
          </span>
          <span className="ml-1 text-sm font-medium text-gray-500">
            /month
          </span>
        </div>
        
        <p className="mt-6 text-gray-500">
          {tier.name === 'Free' && 'Perfect for getting started'}
          {tier.name === 'Pro' && 'Best for growing your personal brand'}
          {tier.name === 'Enterprise' && 'For teams and agencies'}
        </p>
        
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          fullWidth
          className="mt-6"
          onClick={() => onSelectPlan(tier)}
          isLoading={isLoading}
        >
          {tier.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
        </Button>
        
        <ul className="mt-8 space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="ml-3 text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Audit Reports</span>
            <span className="font-medium text-gray-900">
              {tier.limits.auditReports === -1 ? 'Unlimited' : tier.limits.auditReports}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ideas per Week</span>
            <span className="font-medium text-gray-900">
              {tier.limits.ideasPerWeek === -1 ? 'Unlimited' : tier.limits.ideasPerWeek}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Scheduled Posts</span>
            <span className="font-medium text-gray-900">
              {tier.limits.scheduledPosts === -1 ? 'Unlimited' : tier.limits.scheduledPosts}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Team Members</span>
            <span className="font-medium text-gray-900">
              {tier.limits.teamMembers === -1 ? 'Unlimited' : tier.limits.teamMembers}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;