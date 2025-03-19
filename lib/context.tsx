'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGeneratorState } from './hooks/useGeneratorState';
import { GeneratorState, ModelSettings } from './types';

// Define the shape of the context
interface GeneratorContextType extends GeneratorState {
  isHydrated: boolean; // Add this property
  uploadImage: (file: File) => Promise<void>;
  updateSettings: (newSettings: Partial<ModelSettings>) => void;
  generateImage: () => Promise<void>;
  undo: () => void;
  reset: () => void;
}

// Create context with a default value
const GeneratorContext = createContext<GeneratorContextType | null>(null);

// Provider component
export function GeneratorProvider({ children }: { children: ReactNode }) {
  const generatorState = useGeneratorState();
  
  return (
    <GeneratorContext.Provider value={generatorState}>
      {children}
    </GeneratorContext.Provider>
  );
}

// Custom hook to use the context
export function useGenerator() {
  const context = useContext(GeneratorContext);
  
  if (!context) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  
  return context;
}
