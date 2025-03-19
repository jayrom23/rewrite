'use client';

import { useState } from 'react';
// Update the import path to reference the .tsx file
import { ErrorDetails, formatErrorMessage, ErrorCategory } from '@/lib/errorUtils';
import Button from './Button';

interface ErrorMessageProps {
  // Accept either an ErrorDetails object or a simple string
  error: ErrorDetails | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  className = ''
}: ErrorMessageProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Handle the error prop properly
  let errorDetails: ErrorDetails;
  
  // Convert string error to ErrorDetails if needed
  if (typeof error === 'string') {
    errorDetails = {
      message: error,
      category: ErrorCategory.UNKNOWN,
      retryable: false,
      technicalDetails: error
    };
  } else {
    errorDetails = error;
  }
  
  // Icon based on error category
  const getIcon = () => {
    switch (errorDetails.category) {
      case ErrorCategory.NETWORK:
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case ErrorCategory.API_QUOTA:
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0 text-red-400">
          {getIcon()}
        </div>
        <div className="ml-3 flex-grow">
          <div className="text-sm text-red-700">
            {/* Use formatErrorMessage which handles both strings and ErrorDetails */}
            {formatErrorMessage(errorDetails)}
          </div>
          
          {errorDetails.technicalDetails && (
            <div className="mt-2">
              <button
                className="text-xs text-red-500 underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>
              
              {showDetails && (
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                  {errorDetails.technicalDetails}
                </pre>
              )}
            </div>
          )}
          
          <div className="mt-3 flex space-x-2">
            {errorDetails.retryable && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
