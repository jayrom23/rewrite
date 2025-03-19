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
 * Saves the current session state
 */
export function saveSession(state: Partial<GeneratorState>): void {
  try {
    // Only save specific fields to avoid storage bloat
    const sessionState = {
      uploadedImage: state.uploadedImage,
      generatedImage: state.generatedImage,
      step: state.step
    };
    
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
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading session:', error);
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
