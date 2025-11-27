import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'blue' | 'red' | 'green' | 'gray' | 'yellow'; // Tailwind-safe options
  borderSize?: 'thin' | 'normal' | 'thick';
  shade?: '500' | '600' | '700'; // Optional shade
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'blue',
  shade = '600',
  borderSize = 'normal',
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const borderThicknessClasses: Record<string, string> = {
    thin: 'border border-t-2',
    normal: 'border-2 border-t-2',
    thick: 'border-4 border-t-4',
  };

  // Prebuild full Tailwind-compatible border color class
  const safeColorClass = `border-t-${color}-${shade}`;

  const finalClassName = [
    'animate-spin',
    'rounded-full',
    'border-gray-300',
    safeColorClass,
    sizeClasses[size],
    borderThicknessClasses[borderSize],
    className,
  ].join(' ');

  return <div className={finalClassName} />;
};

export default LoadingSpinner;
