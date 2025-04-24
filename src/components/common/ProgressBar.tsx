import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  variant = 'default',
  className = '',
  valuePrefix = '',
  valueSuffix = '',
  label
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  // Determine color based on percentage if variant is 'default'
  const getColor = () => {
    if (variant !== 'default') return variantClasses[variant];
    
    if (percentage < 30) return variantClasses.danger;
    if (percentage < 70) return variantClasses.warning;
    return variantClasses.success;
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {valuePrefix}{value}{valueSuffix} / {max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${getColor()} transition-all duration-500 ease-in-out rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;