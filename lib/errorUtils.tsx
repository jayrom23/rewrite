import React, { ReactNode } from 'react';

// Error categories for better handling
export enum ErrorCategory {
  UPLOAD = 'upload',
  GENERATION = 'generation',
  NETWORK = 'network',
  API_QUOTA = 'api_quota',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// Structure for error details - export this interface
export interface ErrorDetails {
  message: string;
  category: ErrorCategory;
  retryable: boolean;
  suggestions?: string[];
  technicalDetails?: string;
}

/**
 * Create user-friendly error details from an error
 * This function ALWAYS returns an ErrorDetails object, never a string
 */
export function categorizeError(error: unknown): ErrorDetails {
  // Extract error message properly based on type
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Try to extract a message from an object
    const errorObj = error as Record<string, unknown>;
    errorMessage = typeof errorObj.message === 'string' 
      ? errorObj.message 
      : 'Unknown error object';
  } else {
    errorMessage = 'Unknown error';
  }
  
  // Network errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('connection')) {
    return {
      message: 'Network connection issue. Please check your internet connection.',
      category: ErrorCategory.NETWORK,
      retryable: true,
      suggestions: [
        'Check your internet connection',
        'Try again in a few moments',
        'If the problem persists, your network might be blocking the service'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // API quota errors
  if (errorMessage.includes('quota') || 
      errorMessage.includes('rate limit') || 
      errorMessage.includes('too many requests')) {
    return {
      message: 'API usage limit reached. Please try again later.',
      category: ErrorCategory.API_QUOTA,
      retryable: true,
      suggestions: [
        'Wait a few minutes before trying again',
        'Reduce the number of requests'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // File upload errors
  if (errorMessage.includes('file') || 
      errorMessage.includes('upload') || 
      errorMessage.includes('size')) {
    return {
      message: 'There was a problem with your image upload.',
      category: ErrorCategory.UPLOAD,
      retryable: true,
      suggestions: [
        'Check that your image is valid',
        'Try using a smaller image (under 10MB)',
        'Use JPEG or PNG format'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Image generation errors
  if (errorMessage.includes('generat') || 
      errorMessage.includes('content policy') || 
      errorMessage.includes('safety')) {
    return {
      message: 'Failed to generate the image.',
      category: ErrorCategory.GENERATION,
      retryable: true,
      suggestions: [
        'Try adjusting your settings',
        'Ensure your product image complies with content policies',
        'Try a different product image'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Permission or authentication errors
  if (errorMessage.includes('permission') || 
      errorMessage.includes('auth') || 
      errorMessage.includes('key')) {
    return {
      message: 'Authentication or permission error.',
      category: ErrorCategory.PERMISSION,
      retryable: false,
      suggestions: [
        'Ensure your API key is valid',
        'Check that you have the necessary permissions'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Validation errors
  if (errorMessage.includes('valid') || 
      errorMessage.includes('required') || 
      errorMessage.includes('missing')) {
    return {
      message: 'Invalid input or missing required information.',
      category: ErrorCategory.VALIDATION,
      retryable: true,
      suggestions: [
        'Ensure all required fields are completed',
        'Check that your inputs meet the requirements'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Default unknown error - ensure we ALWAYS return an ErrorDetails object
  return {
    message: 'Something went wrong.',
    category: ErrorCategory.UNKNOWN,
    retryable: true,
    suggestions: [
      'Try the action again',
      'Refresh the page if the problem persists'
    ],
    technicalDetails: errorMessage
  };
}

/**
 * Generate user-friendly error message with suggestions
 */
export function formatErrorMessage(input: ErrorDetails | string): ReactNode {
  // If the input is just a string, return it directly
  if (typeof input === 'string') {
    return <p className="font-medium">{input}</p>;
  }
  
  // Otherwise, format the ErrorDetails object
  return (
    <>
      <p className="font-medium">{input.message}</p>
      {input.suggestions && input.suggestions.length > 0 && (
        <ul className="mt-2 text-sm list-disc pl-5">
          {input.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Helper for implementing retry logic with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    onRetry?: (attempt: number, error: Error) => void;
    retryableErrors?: string[];
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    onRetry = () => {},
    retryableErrors = []
  } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Try the operation
      return await fn();
    } catch (error) {
      // Convert error to proper Error object
      const currentError = error instanceof Error 
        ? error 
        : new Error(typeof error === 'string' ? error : 'Unknown error');
      
      lastError = currentError;
      
      // Check if we've reached max retries
      if (attempt >= maxRetries) {
        break;
      }
      
      // Check if the error is retryable based on the error text
      const errorText = currentError.message;
      const isRetryableError = retryableErrors.length === 0 || 
        retryableErrors.some(retryPattern => errorText.includes(retryPattern));
      
      // If not retryable, break out of the loop
      if (!isRetryableError) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = baseDelayMs * Math.pow(2, attempt);
      
      // Notify about the retry
      onRetry(attempt + 1, currentError);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we get here, we've exhausted all retries or hit a non-retryable error
  if (lastError) {
    throw lastError;
  }
  
  // This should never happen, but TypeScript needs it
  throw new Error('Unknown error during retry');
}