'use client';

import { ReactNode } from 'react';
import { GeneratorProvider } from '@/lib/context';
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
      <AppInitializer />
      {children}
    </GeneratorProvider>
  );
}
