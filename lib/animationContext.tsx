'use client';

import { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface AnimationContextType {
  isAnimating: boolean;
  startAnimation: (duration?: number) => Promise<void>;
  animationClasses: {
    fadeIn: string;
    fadeOut: string;
    slideUp: string;
    slideDown: string;
    scaleIn: string;
  };
}

const defaultAnimationClasses = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
};

const AnimationContext = createContext<AnimationContextType | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(async (duration = 500) => {
    setIsAnimating(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setIsAnimating(false);
        resolve();
      }, duration);
    });
  }, []);

  return (
    <AnimationContext.Provider 
      value={{ 
        isAnimating, 
        startAnimation,
        animationClasses: defaultAnimationClasses
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
