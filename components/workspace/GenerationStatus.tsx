'use client';

import { useState, useEffect } from 'react';
import { useGenerator } from '@/lib/context';
import { categorizeError } from '@/lib/errorUtils';
import ErrorMessage from '../ui/ErrorMessage';

interface GenerationStatusProps {
  className?: string;
}

export default function GenerationStatus({ className = '' }: GenerationStatusProps) {
  const { isGenerating, error, generateImage } = useGenerator();
  const [retryCount, setRetryCount] = useState(0);
  const [retryAllowed, setRetryAllowed] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Handle retry logic
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prevCount => prevCount + 1);
      generateImage();
    } else {
      setRetryAllowed(false);
    }
  };
  
  // Reset retry count
  const handleReset = () => {
    setRetryCount(0);
    setRetryAllowed(true);
  };
  
  // Simulate progress during generation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isGenerating) {
      setProgress(0);
      
      intervalId = setInterval(() => {
        setProgress(prevProgress => {
          // Slowly increase progress but never reach 100% until complete
          const increment = 100 - prevProgress < 30 ? 0.5 : 2;
          const newProgress = Math.min(prevProgress + increment, 98);
          return newProgress;
        });
      }, 300);
    } else {
      // When generation completes or fails, set final progress
      setProgress(error ? 0 : 100);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating, error]);
  
  // If not generating and no error, don't show anything
  if (!isGenerating && !error) {
    return null;
  }
  
  return (
    <div className={`rounded-lg bg-white shadow-lg p-4 ${className}`}>
      {isGenerating ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Generating fashion model...</h3>
            <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Processing your product image</p>
            <p className={progress > 30 ? 'text-gray-700' : 'text-gray-300'}>
              • Generating virtual model
            </p>
            <p className={progress > 60 ? 'text-gray-700' : 'text-gray-300'}>
              • Applying styling and environment
            </p>
            <p className={progress > 80 ? 'text-gray-700' : 'text-gray-300'}>
              • Finalizing image
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-4">
          {/* Important: Pass the error string to categorizeError to create an ErrorDetails object */}
          <ErrorMessage 
            error={typeof error === 'string' ? categorizeError(error) : error}
            onRetry={retryAllowed ? handleRetry : undefined}
            onDismiss={handleReset}
          />
          
          {!retryAllowed && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
              <p className="text-sm text-yellow-700">
                We've tried multiple times but couldn't generate the image. 
                Please try changing your settings or using a different image.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
