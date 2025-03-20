'use client';

import { useState, useEffect, useRef } from 'react';
import { useGenerator } from '@/lib/context';
import GenerationStatus from './GenerationStatus';
import ProgressiveImage from './ProgressiveImage';
import { useAnimation } from '@/lib/animationContext';

interface PreviewCanvasProps {
  className?: string;
}

export default function PreviewCanvas({ className = '' }: PreviewCanvasProps) {
  const { uploadedImage, generatedImage, isGenerating, step, error, aspectRatio } = useGenerator();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { animationClasses } = useAnimation();

  // Image to display based on the current state
  const displayImage = generatedImage || uploadedImage;

  // Calculate and set the optimal image size based on the container
  useEffect(() => {
    if (!containerRef.current || !displayImage) return;

    const updateSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;

      // Add safety check for aspectRatio
      if (!aspectRatio) return;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setImageSize({ width, height });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [displayImage, aspectRatio]);

  // Trigger animation when image changes
  useEffect(() => {
    if (displayImage) {
      setAnimateIn(false);
      // Short delay before animating in to ensure CSS transition works
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    }
  }, [displayImage]);

  // Handle image loading states
  useEffect(() => {
    if (isGenerating) {
      setLoading(true);
    } else {
      // Add a small delay to simulate loading transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  // If we're in upload step with no image, show nothing
  if (step === 'upload' && !uploadedImage) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Generation Status - positioned at the bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <GenerationStatus className="mb-2" />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 animate-fade-in">
          {/* Added pulsing animation to the container */}
          <div className="animate-pulse-subtle">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-700 animate-pulse-subtle">Generating your fashion model...</p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 p-3 text-center animate-slide-up">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image display */}
      {displayImage && (
        <div
          className={`
            relative rounded-lg overflow-hidden shadow-lg
            transition-all duration-500 ease-in-out
            ${loading ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
            ${animateIn ? 'animate-scale-in' : 'opacity-0'}
          `}
          style={{
            width: imageSize.width > 0 ? imageSize.width : 'auto',
            height: imageSize.height > 0 ? imageSize.height : 'auto',
          }}
        >
          <ProgressiveImage
            src={displayImage}
            alt={generatedImage ? "Generated fashion model" : "Uploaded product"}
            className="w-full h-full object-contain transition-opacity duration-300"
            onLoad={() => setLoading(false)}
          />

          {/* Customize overlay - show when we have an uploaded image but no generated image yet */}
          {uploadedImage && !generatedImage && step === 'customize' && !loading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 animate-fade-in">
              <div className="text-center text-white max-w-xs animate-slide-up">
                <p className="font-medium mb-2">Customize your settings</p>
                <p className="text-sm opacity-90">Adjust the settings in the panel to customize your fashion model, then click Generate</p>
              </div>
            </div>
          )}

          {/* Image info overlay - shows metadata about the current image */}
          {displayImage && !loading && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs animate-slide-up">
              {generatedImage ? "AI-generated fashion model" : "Uploaded product image"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
