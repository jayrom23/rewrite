'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Header from '@/components/workspace/Header';
import ImageUploader from '@/components/workspace/ImageUploader';
import ActionBar from '@/components/workspace/ActionBar';
import SettingsPanel from '@/components/workspace/SettingsPanel';
import PreviewCanvas from '@/components/workspace/PreviewCanvas';
import HelpPanel from '@/components/ui/HelpPanel';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useGenerator } from '@/lib/context';
import useKeyboardShortcuts from '@/lib/useKeyboardShortcuts';

export default function Home() {
  const { step, uploadedImage, generatedImage, aspectRatio } = useGenerator();
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [availableHeight, setAvailableHeight] = useState<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const actionBarRef = useRef<HTMLElement>(null);
  // Ref is now on the *outer* container
  const mainContentRef = useRef<HTMLDivElement>(null);

    // Calculate available height for the main content area (desktop only)
    useEffect(() => {
      const calculateAvailableHeight = () => {
        if (headerRef.current && actionBarRef.current && mainContentRef.current) {
          const headerHeight = headerRef.current.offsetHeight;
          const actionBarHeight = actionBarRef.current.offsetHeight;
          const windowHeight = window.innerHeight;
          // Subtract header, action bar, and a small buffer (e.g., 20px)
          const newAvailableHeight = windowHeight - headerHeight - actionBarHeight - 20;
          setAvailableHeight(newAvailableHeight);
        }
      };

      calculateAvailableHeight();

      window.addEventListener('resize', calculateAvailableHeight);
      return () => window.removeEventListener('resize', calculateAvailableHeight);
  }, []);

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
    <main className="flex flex-col min-h-screen my-8 p-6"> {/* Updated main element spacing */}
      <Header onHelpClick={toggleHelpPanel} ref={headerRef} />

      {/* Mobile Help Button */}
      <div className="block md:hidden fixed bottom-4 right-4 z-30">
        <Tooltip content="Help & Keyboard Shortcuts">
          <Button
            variant="primary"
            onClick={toggleHelpPanel}
            className="rounded-full p-3 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
            </svg>
          </Button>
        </Tooltip>
      </div>

      {/* Master container for dynamic height */}
      <div className="flex-grow" ref={mainContentRef} style={{ height: availableHeight ? `${availableHeight}px` : 'auto' }}> {/* Removed my-4 md:my-6 p-4 md:p-6 from here */}
        {/* Use flex for layout, with column on small screens, row on medium+ */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-2 md:gap-6 h-full"> {/* Updated gap on larger screens */}

          {/* Left Column - Settings Panel */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
              <SettingsPanel />
            </div>
          </div>

          {/* Right Column - Preview Canvas */}
          <div className="flex-grow">
          <div className="bg-white rounded-lg shadow overflow-hidden h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            {step === 'upload' ? (
              <div className="w-full h-full">
                <ImageUploader />
              </div>
            ) : ( aspectRatio &&
              <PreviewCanvas  />
            )}
          </div>
          </div>
        </div>
      </div>

      <ActionBar
        ref={actionBarRef}
        exportActionId="export-action"
        exportPanelId="toggle-export-panel"
        showExportPanel={showExportPanel}
        />

      <div className="mt-4 hidden md:block"> {/* Kept mt-4 */}
          <HelpPanel isOpen={showHelpPanel} onCloseId="close-help" />
      </div>
    </main>
  );
}
