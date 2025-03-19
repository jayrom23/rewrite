'use client';

import { ReactNode } from 'react';
import { GeneratorProvider } from '@/lib/context';
import { AnimationProvider } from '@/lib/animationContext';
import AppInitializer from './AppInitializer';

interface RootWrapperProps {
  children: ReactNode;
}

/**
 * Root wrapper component that sets up providers and initializers
 */
export default function RootWrapper({ children }: RootWrapperProps) {
  return (
    <GeneratorProvider>
      <AnimationProvider>
        <AppInitializer />
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow container-fluid mx-auto py-2 md:py-4">
            {children}
          </div>
        </div>
      </AnimationProvider>
    </GeneratorProvider>
  );
}
