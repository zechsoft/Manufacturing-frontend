import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'steel' | 'blue' | 'orange' | 'yellow';
  borderSize?: 'thin' | 'normal' | 'thick';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'steel',
  borderSize = 'normal',
}) => {
  const sizeMap = {
    sm: { dimension: 'w-8 h-8', svg: 32 },
    md: { dimension: 'w-12 h-12', svg: 48 },
    lg: { dimension: 'w-16 h-16', svg: 64 },
  };

  const colorMap = {
    steel: { primary: '#64748b', secondary: '#475569', accent: '#334155' },
    blue: { primary: '#3b82f6', secondary: '#2563eb', accent: '#1d4ed8' },
    orange: { primary: '#f97316', secondary: '#ea580c', accent: '#c2410c' },
    yellow: { primary: '#eab308', secondary: '#ca8a04', accent: '#a16207' },
  };

  const currentSize = sizeMap[size];
  const currentColor = colorMap[color];

  return (
    <div className={`${currentSize.dimension} relative ${className}`}>
      <svg
        width={currentSize.svg}
        height={currentSize.svg}
        viewBox="0 0 24 24"
        className="animate-spin"
        style={{ animationDuration: '2s' }}
      >
        {/* Outer gear teeth */}
        <path
          d="M12 2L13.5 4.5L16.5 3.5L17.5 6.5L21 7L20 10L22.5 12L20 14L21 17L17.5 17.5L16.5 20.5L13.5 19.5L12 22L10.5 19.5L7.5 20.5L6.5 17.5L3 17L4 14L1.5 12L4 10L3 7L6.5 6.5L7.5 3.5L10.5 4.5L12 2Z"
          fill="none"
          stroke={currentColor.primary}
          strokeWidth={
            borderSize === 'thin'
              ? '1'
              : borderSize === 'thick'
              ? '2'
              : '1.5'
          }
        />
        {/* Inner circle */}
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke={currentColor.secondary}
          strokeWidth={
            borderSize === 'thin'
              ? '1.5'
              : borderSize === 'thick'
              ? '3'
              : '2'
          }
        />
        {/* Center hole */}
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill={currentColor.accent}
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
