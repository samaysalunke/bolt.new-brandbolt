import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=3B82F6&color=fff`;
        }}
      />
    </div>
  );
};

export default Avatar;