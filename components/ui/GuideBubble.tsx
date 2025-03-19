'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Button from './Button';

export interface GuideTip {
  id: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  elementSelector: string;
}

interface GuideBubbleProps {
  tip: GuideTip;
  onDismissId?: string; // Changed to string ID instead of function
  onNextId?: string; // Changed to string ID
  onPrevId?: string; // Changed to string ID
  showNavigation?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function GuideBubble({ 
  tip, 
  onDismissId = 'dismiss', 
  onNextId = 'next', 
  onPrevId = 'prev', 
  showNavigation = false,
  currentStep = 1,
  totalSteps = 1
}: GuideBubbleProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element | null>(null);

  // Handle button actions by dispatching custom events
  const handleDismiss = useCallback(() => {
    document.dispatchEvent(new CustomEvent('guide-action', { detail: { action: onDismissId } }));
  }, [onDismissId]);
  
  const handleNext = useCallback(() => {
    document.dispatchEvent(new CustomEvent('guide-action', { detail: { action: onNextId } }));
  }, [onNextId]);
  
  const handlePrev = useCallback(() => {
    document.dispatchEvent(new CustomEvent('guide-action', { detail: { action: onPrevId } }));
  }, [onPrevId]);

  // Calculate position based on the target element
  useEffect(() => {
    const positionBubble = () => {
      try {
        const targetElement = document.querySelector(tip.elementSelector);
        if (!targetElement || !bubbleRef.current) return;

        // Store reference for cleanup
        targetRef.current = targetElement;

        const targetRect = targetElement.getBoundingClientRect();
        const bubbleRect = bubbleRef.current.getBoundingClientRect();
        
        let top = 0;
        let left = 0;

        // Position based on the specified direction
        switch (tip.position) {
          case 'top':
            top = targetRect.top - bubbleRect.height - 12;
            left = targetRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
            break;
          case 'bottom':
            top = targetRect.bottom + 12;
            left = targetRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
            break;
          case 'left':
            top = targetRect.top + (targetRect.height / 2) - (bubbleRect.height / 2);
            left = targetRect.left - bubbleRect.width - 12;
            break;
          case 'right':
            top = targetRect.top + (targetRect.height / 2) - (bubbleRect.height / 2);
            left = targetRect.right + 12;
            break;
        }

        // Keep the bubble within the viewport
        top = Math.max(10, top);
        left = Math.max(10, left);
        
        // Avoid overflowing to the right or bottom
        const maxRight = window.innerWidth - bubbleRect.width - 10;
        const maxBottom = window.innerHeight - bubbleRect.height - 10;
        
        left = Math.min(maxRight, left);
        top = Math.min(maxBottom, top);

        setPosition({ top, left });

        // Highlight the target element
        targetElement.classList.add('guide-highlight');
      } catch (error) {
        console.error('Error positioning guide bubble:', error);
      }
    };

    // Delay initial positioning to ensure DOM is ready
    const timer = setTimeout(positionBubble, 100);
    window.addEventListener('resize', positionBubble);
    
    return () => {
      window.removeEventListener('resize', positionBubble);
      clearTimeout(timer);
      
      // Clean up highlight
      if (targetRef.current) {
        targetRef.current.classList.remove('guide-highlight');
        targetRef.current = null;
      }
    };
  }, [tip.elementSelector, tip.position]);

  return (
    <div 
      ref={bubbleRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-primary-100 p-4 w-64 pointer-events-auto"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        maxWidth: '80vw'
      }}
    >
      <div className="text-sm font-medium text-gray-800 mb-2">
        {tip.title}
      </div>
      <p className="text-xs text-gray-600 mb-4">
        {tip.content}
      </p>
      
      <div className="flex items-center justify-between">
        {showNavigation ? (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={currentStep === totalSteps ? handleDismiss : handleNext}
            >
              {currentStep === totalSteps ? 'Finish' : 'Next'}
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={handleDismiss}>
            Got it
          </Button>
        )}
        
        {showNavigation && (
          <span className="text-xs text-gray-500">
            {currentStep}/{totalSteps}
          </span>
        )}
      </div>
    </div>
  );
}
