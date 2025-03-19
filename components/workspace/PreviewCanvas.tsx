'use client';

import { useState, useEffect, useRef } from 'react';
import { useGenerator } from '@/lib/context';
import GenerationStatus from './GenerationStatus';
import ProgressiveImage from './ProgressiveImage';

interface PreviewCanvasProps {
  className?: string;
}

export default function PreviewCanvas({ className = '' }: PreviewCanvasProps) {
  const { uploadedImage, generatedImage, isGenerating, step, error } = useGenerator();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Image to display based on the current state
  const displayImage = generatedImage || uploadedImage;
  
  // Calculate and set the optimal image size based on the container
  useEffect(() => {
    if (!containerRef.current || !displayImage) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const maxWidth = container.clientWidth - 48; // Padding
      const maxHeight = container.clientHeight - 48; // Padding
      
      // Create a temp image to get the natural dimensions
      const img = new Image();
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const ratio = naturalWidth / naturalHeight;
        
        let width = maxWidth;
        let height = width / ratio;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = height * ratio;
        }
        
        setImageSize({ width, height });
      };
      img.src = displayImage;
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Generation Status - positioned at the bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <GenerationStatus className="mb-2" />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-700">Generating your fashion model...</p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 p-3 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image display */}
      {displayImage && (
        <div 
          className={`
            relative rounded-lg overflow-hidden shadow-lg
            transition-opacity duration-300
            ${loading ? 'opacity-30' : 'opacity-100'}
          `}
          style={{ 
            width: imageSize.width > 0 ? imageSize.width : 'auto',
            height: imageSize.height > 0 ? imageSize.height : 'auto',
          }}
        >
          <ProgressiveImage
            src={displayImage}
            alt={generatedImage ? "Generated fashion model" : "Uploaded product"}
            className="w-full h-full object-contain"
            onLoad={() => setLoading(false)}
          />
          
          {/* Customize overlay - show when we have an uploaded image but no generated image yet */}
          {uploadedImage && !generatedImage && step === 'customize' && !loading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
              <div className="text-center text-white max-w-xs">
                <p className="font-medium mb-2">Customize your settings</p>
                <p className="text-sm opacity-90">Adjust the settings in the panel to customize your fashion model, then click Generate</p>
              </div>
            </div>
          )}
          
          {/* Image info overlay - shows metadata about the current image */}
          {displayImage && !loading && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs">
              {generatedImage ? "AI-generated fashion model" : "Uploaded product image"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
