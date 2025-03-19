'use client';

import { useEffect, useRef, useCallback } from 'react';
import { KeyboardShortcut, KEYBOARD_SHORTCUTS } from '@/lib/useKeyboardShortcuts';
import Button from './Button';

interface HelpPanelProps {
  isOpen: boolean;
  onCloseId?: string; // Changed to string ID
}

export default function HelpPanel({ isOpen, onCloseId = 'close-help' }: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Handle close action by dispatching custom event
  const handleClose = useCallback(() => {
    import('@/lib/eventManager').then(({ dispatchEvent }) => {
      dispatchEvent('help-action', { action: onCloseId });
    });
  }, [onCloseId]);
  
  // Close when clicking outside the panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    // Only add event listener when panel is open and in browser environment
    if (typeof window !== 'undefined' && isOpen) {
      // Add with slight delay to ensure React rendering completes
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    
    return undefined;
  }, [isOpen, handleClose]);
  
  // Close on ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }
    
    // Only add event listener on client side and when panel is open
    if (typeof window !== 'undefined' && isOpen) {
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
    
    return undefined;
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={panelRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="helpPanelTitle"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="helpPanelTitle" className="text-xl font-semibold">Help & Keyboard Shortcuts</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close help panel"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Quick Guide</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>1. Upload a product image using drag-and-drop or the file selector</li>
            <li>2. Customize settings for your virtual model</li>
            <li>3. Generate the AI fashion model image</li>
            <li>4. Export the result in your preferred format</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
          <div className="bg-gray-50 rounded-md p-3 max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr>
                  <th className="py-2">Action</th>
                  <th className="py-2">Shortcut</th>
                </tr>
              </thead>
              <tbody>
                {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{shortcut.description}</td>
                    <td className="py-2">
                      <KeyCombination shortcut={shortcut} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleClose} variant="outline">Close</Button>
        </div>
      </div>
    </div>
  );
}

// Component to display a key combination nicely
function KeyCombination({ shortcut }: { shortcut: KeyboardShortcut }) {
  const keys = [];
  
  if (shortcut.ctrlKey) keys.push('Ctrl');
  if (shortcut.shiftKey) keys.push('Shift');
  if (shortcut.altKey) keys.push('Alt');
  keys.push(shortcut.key.toUpperCase());
  
  return (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <span key={index} className="inline-block px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
          {key}
        </span>
      ))}
    </div>
  );
}
