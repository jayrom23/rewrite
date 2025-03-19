'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

// Define variant types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'responsive'; // Added 'responsive' size
type ButtonWidth = 'full' | 'auto' | 'responsive'; // Added width options

// Props interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth; // Use width instead of fullWidth and responsive
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  width = 'auto', // Default width to 'auto'
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses = 'btn rounded-md font-medium focus:outline-none transition-all duration-200 flex items-center justify-center';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    responsive: 'px-4 py-2 text-base min-h-[40px] sm:px-6 sm:py-3 sm:text-lg sm:min-h-[48px]' // Responsive size
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm',
    secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 active:bg-secondary-400 focus:ring-2 focus:ring-secondary-300 focus:ring-offset-2',
    outline: 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  };

  // Loading and disabled states
  const stateClasses = (isLoading || disabled)
    ? 'opacity-70 cursor-not-allowed'
    : 'cursor-pointer';

  // Width classes - now based on 'width' prop
  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
    responsive: 'w-full sm:w-auto' // Full width on mobile, auto on larger screens
  }[width];


  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${widthClasses} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
}
