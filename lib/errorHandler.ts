import { ErrorCategory, ErrorDetails } from './errorUtils';

/**
 * Global error handler for uncaught exceptions
 */
export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    // Expose error reporting for debugging
    (window as any).__debug = {
      reportError,
      testErrorHandler: () => {
        throw new Error('Test error from debug console');
      },
      testRejection: () => {
        return Promise.reject(new Error('Test rejection from debug console'));
      }
    };
    
    // Only setup in browser environment
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      reportError(event.error);
      // Don't prevent default - let browser handle it too
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      reportError(event.reason);
      // Don't prevent default - let browser handle it too
    });
  }
}

/**
 * Reports an error to analytics or monitoring service
 */
export function reportError(error: unknown, additionalInfo: Record<string, any> = {}) {
  try {
    // In a real app, this would send to a monitoring service like Sentry
    // For now, just log to console with some structure
    const errorDetails = extractErrorDetails(error);
    
    console.group('Error Report');
    console.error('Error:', errorDetails.message);
    console.error('Category:', errorDetails.category);
    console.error('Technical Details:', errorDetails.technicalDetails);
    console.error('Additional Info:', additionalInfo);
    console.groupEnd();
    
    // Future: send to monitoring service
    // Example: Sentry.captureException(error, { extra: { ...additionalInfo } });
  } catch (reportingError) {
    // Fallback if error reporting itself fails
    console.error('Error reporting failed:', reportingError);
  }
}

/**
 * Extract structured details from an error
 */
function extractErrorDetails(error: unknown): ErrorDetails {
  if (typeof error === 'string') {
    return {
      message: error,
      category: ErrorCategory.UNKNOWN,
      retryable: false,
      technicalDetails: ''
    };
  } 
  
  if (error instanceof Error) {
    return {
      message: error.message,
      category: ErrorCategory.UNKNOWN,
      retryable: false,
      technicalDetails: error.stack || ''
    };
  }
  
  return {
    message: 'An unknown error occurred',
    category: ErrorCategory.UNKNOWN,
    retryable: false,
    technicalDetails: String(error)
  };
}
