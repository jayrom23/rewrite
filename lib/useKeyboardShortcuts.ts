import { useEffect, useCallback } from 'react';
import { useGenerator } from './context';

export type ShortcutAction = 
  | 'generate'
  | 'undo'
  | 'reset'
  | 'toggleHelp'
  | 'exportImage';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: ShortcutAction;
}

// Define available shortcuts
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'g', ctrlKey: true, description: 'Generate image', action: 'generate' },
  { key: 'z', ctrlKey: true, description: 'Undo last action', action: 'undo' },
  { key: 'r', ctrlKey: true, description: 'Reset and start over', action: 'reset' },
  { key: '/', description: 'Toggle help', action: 'toggleHelp' },
  { key: 'e', ctrlKey: true, description: 'Export generated image', action: 'exportImage' },
];

export default function useKeyboardShortcuts(
  onToggleHelp: () => void,
  onExportImage: () => void
) {
  const { step, generateImage, undo, reset, isGenerating, generatedImage } = useGenerator();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as Element).tagName)) {
      return;
    }

    // Find matching shortcut
    const shortcut = KEYBOARD_SHORTCUTS.find(s => {
      const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey;
      const shiftMatch = s.shiftKey === undefined || s.shiftKey === event.shiftKey;
      const altMatch = s.altKey === undefined || s.altKey === event.altKey;
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (!shortcut) return;
    
    // Prevent default browser actions (like Ctrl+S saving the page)
    event.preventDefault();
    
    // Execute the corresponding action based on the app state
    switch (shortcut.action) {
      case 'generate':
        if (step === 'customize' && !isGenerating) {
          generateImage();
        }
        break;
      case 'undo':
        if (step === 'export') {
          undo();
        }
        break;
      case 'reset':
        reset();
        break;
      case 'toggleHelp':
        onToggleHelp();
        break;
      case 'exportImage':
        if (step === 'export' && generatedImage) {
          onExportImage();
        }
        break;
    }
  }, [step, isGenerating, generateImage, undo, reset, generatedImage, onToggleHelp, onExportImage]);

  // Set up event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return KEYBOARD_SHORTCUTS;
}
