import { GeneratorState, ModelSettings, HistoryEntry } from './types';

const STORAGE_KEYS = {
  SETTINGS: 'ai-fashion-generator-settings',
  HISTORY: 'ai-fashion-generator-history',
  SESSION: 'ai-fashion-generator-session'
};

/**
 * Saves settings to local storage
 */
export function saveSettings(settings: ModelSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Loads saved settings from local storage
 */
export function loadSettings(): ModelSettings | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
}

/**
 * Saves history entries to local storage
 */
export function saveHistory(history: HistoryEntry[]): void {
  try {
    // Only save the last 10 entries to prevent storage bloat
    const recentHistory = history.slice(-10);

    // For each history entry, we need to handle the generatedImage
    // which could be a large base64 string
    const storableHistory = recentHistory.map(entry => ({
      ...entry,
      // Store a flag indicating there was an image instead of the full base64
      generatedImage: entry.generatedImage ? true : undefined
    }));

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(storableHistory));
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

/**
 * Loads saved history from local storage
 */
export function loadHistory(): HistoryEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

/**
 * Get approximate size of a string in MB
 */
function getStringSizeMB(str: string): number {
  return str ? (str.length * 2) / (1024 * 1024) : 0;
}

/**
 * Saves the current session state
 */
export function saveSession(state: Partial<GeneratorState>): void {
  try {
    // Check if images are too large for localStorage
    const uploadedImageSize = getStringSizeMB(state.uploadedImage || '');
    const generatedImageSize = getStringSizeMB(state.generatedImage || '');

    // Create session state object
    let sessionState: Record<string, any>;

    // If total image size exceeds 4MB, don't store the full images
    if (uploadedImageSize + generatedImageSize > 4) {
      console.warn('Images too large for localStorage, storing references only');
      sessionState = {
        hasUploadedImage: !!state.uploadedImage,
        hasGeneratedImage: !!state.generatedImage,
        step: state.step
      };
    } else {
      // Safe to store full images
      sessionState = {
        uploadedImage: state.uploadedImage,
        generatedImage: state.generatedImage,
        step: state.step
      };
    }

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionState));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Loads saved session state
 */
export function loadSession(): Partial<GeneratorState> | null {
  try {
    // First, test if localStorage is available
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);

    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!saved) return null;

    const sessionData = JSON.parse(saved);

    // Handle the case where we only stored references to images
    if (sessionData.hasUploadedImage !== undefined) {
      // We have a reference-only storage
      return {
        // Don't return actual images, just the step
        step: sessionData.step || 'upload',
        // Make the frontend aware there were images that are now expired
        uploadedImage: null,
        generatedImage: null,
        error: sessionData.hasUploadedImage ?
          'Previously uploaded images have expired. Please upload the image again.' : null
      };
    }

    return sessionData;
  } catch (error) {
    console.error('Error loading session:', error);
    // Clear potentially corrupted data
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      // Ignore cleanup errors
    }
    return null;
  }
}

/**
 * Clears all stored data
 */
export function clearStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}
