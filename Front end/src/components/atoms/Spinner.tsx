import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    colorLogo: 'border-colorLogo',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
  );
};

export default Spinner; 