'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/workspace/Header';
import ImageUploader from '@/components/workspace/ImageUploader';
import ActionBar from '@/components/workspace/ActionBar';
import SettingsPanel from '@/components/workspace/SettingsPanel';
import PreviewCanvas from '@/components/workspace/PreviewCanvas';
import HelpPanel from '@/components/ui/HelpPanel';
import GuideTour from '@/components/ui/GuideTour';
import { useGenerator } from '@/lib/context';
import useKeyboardShortcuts from '@/lib/useKeyboardShortcuts';

export default function Home() {
  const { step } = useGenerator();
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showGuideTour, setShowGuideTour] = useState(true);

  // Toggle help panel
  const toggleHelpPanel = useCallback(() => {
    setShowHelpPanel(prev => !prev);
  }, []);

  // Show export panel
  const showExport = useCallback(() => {
    setShowExportPanel(true);
  }, []);

  // Setup keyboard shortcuts
  useKeyboardShortcuts(toggleHelpPanel, showExport);

  // Event handlers for the custom events from our components
  useEffect(() => {
    // Help panel events
    const handleHelpAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.action === 'close-help') {
        setShowHelpPanel(false);
      }
    };
    
    // Guide tour events
    const handleGuideCompleted = (event: Event) => {
      setShowGuideTour(false);
    };
    
    // ActionBar events (renamed to ui-action)
    const handleUIAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.action === 'export-action') {
        setShowExportPanel(true);
      } else if (customEvent.detail.action === 'toggle-export-panel') {
        setShowExportPanel(customEvent.detail.show);
      }
    };
    
    // Add event listeners with updated names
    document.addEventListener('help-action', handleHelpAction);
    document.addEventListener('guide-completed', handleGuideCompleted);
    document.addEventListener('ui-action', handleUIAction);
    
    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('help-action', handleHelpAction);
      document.removeEventListener('guide-completed', handleGuideCompleted);
      document.removeEventListener('ui-action', handleUIAction);
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Header onHelpClick={toggleHelpPanel} />
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {/* Left Column - Settings Panel */}
        <div className="md:col-span-1 bg-white rounded-lg shadow settings-panel">
          <SettingsPanel />
        </div>
        
        {/* Right Column - Preview Canvas */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex items-center justify-center">
          {step === 'upload' ? (
            <div className="w-full h-full image-upload-area">
              <ImageUploader />
            </div>
          ) : (
            <PreviewCanvas />
          )}
        </div>
      </div>
      
      <ActionBar 
        exportActionId="export-action"
        exportPanelId="toggle-export-panel"
        showExportPanel={showExportPanel}
      />
      
      {/* Help panel */}
      <HelpPanel isOpen={showHelpPanel} onCloseId="close-help" />
      
      {/* Guide tour for first time users */}
      {showGuideTour && (
        <GuideTour onCompleteId="complete-guide" />
      )}
      
      {/* Add custom CSS for the guide highlight effect */}
      <style jsx global>{`
        .guide-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.5);
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .settings-panel {
            height: 300px;
            overflow-y: auto;
          }
        }
      `}</style>
    </main>
  );
}
