'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandler } from '@/lib/errorHandler';

/**
 * Component to initialize app-wide services and handlers
 * This is meant to be included once at the app root level
 */
export default function AppInitializer() {
  useEffect(() => {
    try {
      // Setup global error handling
      setupGlobalErrorHandler();
      
      // Other app-wide initializations could go here
      // e.g., analytics setup, theme detection, etc.
      
      console.log('App services initialized');
    } catch (error) {
      console.error('Failed to initialize app services:', error);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}
