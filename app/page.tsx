'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/workspace/Header';
import ImageUploader from '@/components/workspace/ImageUploader';
import ActionBar from '@/components/workspace/ActionBar';
import SettingsPanel from '@/components/workspace/SettingsPanel';
import PreviewCanvas from '@/components/workspace/PreviewCanvas';
import HelpPanel from '@/components/ui/HelpPanel';
import { useGenerator } from '@/lib/context';
import useKeyboardShortcuts from '@/lib/useKeyboardShortcuts';

export default function Home() {
  const { step } = useGenerator();
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

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
    document.addEventListener('ui-action', handleUIAction);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('help-action', handleHelpAction);
      document.removeEventListener('ui-action', handleUIAction);
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Header onHelpClick={toggleHelpPanel} />

      <div className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-2"> {/* Responsive gap */}
          {/* Left Column - Settings Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
              <SettingsPanel />
            </div>
          </div>

          {/* Right Column - Preview Canvas */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12"> {/* Added responsive padding */}
              {step === 'upload' ? (
                <div className="w-full h-full">
                  <ImageUploader />
                </div>
              ) : (
                <PreviewCanvas />
              )}
            </div>
          </div>
        </div>
      </div>

      <ActionBar
        exportActionId="export-action"
        exportPanelId="toggle-export-panel"
        showExportPanel={showExportPanel}
      />

      {/* Help panel */}
      <div className="mt-4">
        <HelpPanel isOpen={showHelpPanel} onCloseId="close-help" />
      </div>
    </main>
  );
}
