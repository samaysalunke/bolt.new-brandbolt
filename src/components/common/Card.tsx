import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  footer,
  headerAction,
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-start p-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;