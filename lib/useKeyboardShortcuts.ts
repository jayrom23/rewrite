import { useEffect, useCallback } from 'react';
import { useGenerator } from './context';

export type ShortcutAction = 
  | 'generate'
  | 'undo'
  | 'reset'
  | 'toggleHelp'
  | 'export'
  | 'setting1'
  | 'setting2'
  | 'setting3'
  | 'setting4'
  | 'setting5'
  | 'setting6'
  | 'setting7'
  | 'setting8'
  | 'setting9'
  | 'setting10'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10';

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
  { key: '/', description: 'Toggle help panel', action: 'toggleHelp' },
  { key: 'e', ctrlKey: true, description: 'Export generated image', action: 'export' },
  { key: '1', ctrlKey: true, description: 'Setting action 1', action: 'setting1' },
  { key: '2', ctrlKey: true, description: 'Setting action 2', action: 'setting2' },
  { key: '3', ctrlKey: true, description: 'Setting action 3', action: 'setting3' },
  { key: '4', ctrlKey: true, description: 'Setting action 4', action: 'setting4' },
  { key: '5', ctrlKey: true, description: 'Setting action 5', action: 'setting5' },
  { key: '6', ctrlKey: true, description: 'Setting action 6', action: 'setting6' },
  { key: '7', ctrlKey: true, description: 'Setting action 7', action: 'setting7' },
  { key: '8', ctrlKey: true, description: 'Setting action 8', action: 'setting8' },
  { key: '9', ctrlKey: true, description: 'Setting action 9', action: 'setting9' },
  { key: '0', ctrlKey: true, description: 'Setting action 10', action: 'setting10' },
  { key: 'F1', description: 'Function action 1', action: 'F1' },
  { key: 'F2', description: 'Function action 2', action: 'F2' },
  { key: 'F3', description: 'Function action 3', action: 'F3' },
  { key: 'F4', description: 'Function action 4', action: 'F4' },
  { key: 'F5', description: 'Function action 5', action: 'F5' },
  { key: 'F6', description: 'Function action 6', action: 'F6' },
  { key: 'F7', description: 'Function action 7', action: 'F7' },
  { key: 'F8', description: 'Function action 8', action: 'F8' },
  { key: 'F9', description: 'Function action 9', action: 'F9' },
  { key: 'F10', description: 'Function action 10', action: 'F10' },
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
      case 'export':
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
