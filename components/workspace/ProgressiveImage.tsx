'use client';

import { useState, useEffect } from 'react';
import { createThumbnail } from '@/lib/imageUtils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  onLoad
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailSrc, setThumbnailSrc] = useState<string>('');

  // Generate a low-quality thumbnail when src changes
  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    
    // Generate thumbnail immediately
    createThumbnail(src)
      .then(thumbnail => {
        setThumbnailSrc(thumbnail);
      })
      .catch(err => {
        console.error('Error creating thumbnail:', err);
      });
    
    // Preload the full image
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      if (onLoad) onLoad();
    };
    img.src = src;
  }, [src, onLoad]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur-up thumbnail */}
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt={alt}
          className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-200 ${
            !isLoading && currentSrc ? 'opacity-0' : 'opacity-100 blur-sm'
          }`}
        />
      )}
      
      {/* Main image - shown when loaded */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && !thumbnailSrc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
