'use client';

import { useState, useEffect, useCallback } from 'react';
import GuideBubble, { GuideTip } from './GuideBubble';

// Tour steps for the app
const GUIDE_STEPS: GuideTip[] = [
  {
    id: 'upload',
    title: 'Welcome to AI Fashion Model Generator!',
    content: 'Start by uploading a product image here. You can drag-and-drop or click to browse.',
    position: 'bottom',
    elementSelector: '.image-upload-area', // CSS selector for the upload area
  },
  {
    id: 'settings',
    title: 'Customize Your Model',
    content: 'After uploading, use these settings to configure how your fashion model will look.',
    position: 'right',
    elementSelector: '.settings-panel', // CSS selector for the settings panel
  },
  {
    id: 'generate',
    title: 'Generate Your Image',
    content: 'When you\'re ready, click the Generate button to create your AI fashion model image.',
    position: 'top',
    elementSelector: '.generate-button', // CSS selector for the generate button
  },
  {
    id: 'export',
    title: 'Export Your Creation',
    content: 'Once generated, you can export your image in different formats and sizes.',
    position: 'top',
    elementSelector: '.export-button', // CSS selector for the export button
  }
];

interface GuideTourProps {
  forceShow?: boolean;
  onCompleteId?: string; // Changed to string ID
}

export default function GuideTour({ forceShow = false, onCompleteId = 'complete-guide' }: GuideTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [elementExists, setElementExists] = useState(false);
  
  const handleDismiss = useCallback(() => {
    setShowTour(false);
    document.dispatchEvent(new CustomEvent('guide-completed', { detail: { action: onCompleteId } }));
  }, [onCompleteId]);
  
  const handleNext = useCallback(() => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  }, [currentStep, handleDismiss, GUIDE_STEPS.length]);
  
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  // Add event listeners for the guide actions
  useEffect(() => {
    const handleGuideAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      switch (customEvent.detail.action) {
        case 'dismiss':
          handleDismiss();
          break;
        case 'next':
          handleNext();
          break;
        case 'prev':
          handlePrevious();
          break;
      }
    };

    document.addEventListener('guide-action', handleGuideAction);
    return () => {
      document.removeEventListener('guide-action', handleGuideAction);
    };
  }, [handleDismiss, handleNext, handlePrevious]);
  
  // Check if this is the first visit
  useEffect(() => {
    if (forceShow) {
      setShowTour(true);
      return;
    }
    
    const hasSeenTour = localStorage.getItem('ai-fashion-generator-seen-tour');
    if (!hasSeenTour) {
      setShowTour(true);
      localStorage.setItem('ai-fashion-generator-seen-tour', 'true');
    }
  }, [forceShow]);
  
  if (!showTour) return null;
  
  // Check if target element exists
  useEffect(() => {
    if (showTour && GUIDE_STEPS[currentStep]) {
      const checkElement = () => {
        const element = document.querySelector(GUIDE_STEPS[currentStep].elementSelector);
        setElementExists(!!element);
      };
      
      // Check immediately and then on a timer
      checkElement();
      const timer = setInterval(checkElement, 500);
      
      return () => clearInterval(timer);
    }
  }, [showTour, currentStep]);

  // Wait for the DOM to be ready before rendering the guide
  const currentTip = GUIDE_STEPS[currentStep];
  if (!currentTip || !showTour) return null;
  
  // Don't show the guide if the target element doesn't exist yet
  if (!elementExists) return null;
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-30 pointer-events-none" />
      
      <GuideBubble
        tip={currentTip}
        onDismissId="dismiss"
        onNextId="next"
        onPrevId="prev"
        showNavigation={true}
        currentStep={currentStep + 1}
        totalSteps={GUIDE_STEPS.length}
      />
    </>
  );
}
