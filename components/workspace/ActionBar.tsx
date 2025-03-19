'use client';

import { useCallback } from 'react';
import { useGenerator } from '@/lib/context';
import Button from '../ui/Button';
import ExportPanel from './ExportPanel';
import Tooltip from '../ui/Tooltip';

interface ActionBarProps {
  exportPanelId?: string; // Changed to string ID
  showExportPanel: boolean;
  exportActionId?: string; // Changed to string ID
}

export default function ActionBar({
  exportPanelId = 'toggle-export-panel',
  showExportPanel,
  exportActionId = 'export-action'
}: ActionBarProps) {
  const { step, uploadedImage, isGenerating, generateImage, generatedImage, undo, reset } = useGenerator();

  // Safely handle export panel actions with events
  const handleExportClick = useCallback(() => {
    if (!generatedImage) {
      console.warn('Attempted to export with no generated image');
      return;
    }

    // Use the event manager
    import('@/lib/eventManager').then(({ dispatchEvent }) => {
      dispatchEvent('ui-action', { action: 'export-action' as any });
    });
  }, [generatedImage]);

  const closeExportPanel = useCallback(() => {
    // Use the event manager
    import('@/lib/eventManager').then(({ dispatchEvent }) => {
      dispatchEvent('ui-action', { action: 'hide-export-panel' as any, show: false });
    });
  }, []);

  // Handle generation safely
  const handleGenerate = useCallback(() => {
    if (!isGenerating && uploadedImage) {
      generateImage().catch(error => {
        // The error will be handled by the reducer
        console.error('Error during image generation:', error);
      });
    }
  }, [isGenerating, uploadedImage, generateImage]);

  return (
    <>
      {/* Export panel modal */}
      {showExportPanel && generatedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto scale-100 opacity-100 transition-all duration-300">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Export Options</h2>
              <button
                onClick={closeExportPanel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close export panel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <ExportPanel />
          </div>
        </div>
      )}

      {/* Action buttons - improved responsive layout */}
      <div className="action-bar">
        {step === 'upload' && (
          <div className="w-full text-center py-2">
            <span className="text-sm text-gray-600">Upload an image to get started</span>
          </div>
        )}

        {step === 'customize' && (
          <Tooltip content="Generate fashion model image (Ctrl+G)">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!uploadedImage}
              className="generate-button w-full sm:w-auto" /* Use full width on small screens, auto on larger */
            >
              Generate Image
            </Button>
          </Tooltip>
        )}

        {step === 'export' && (
          <>
            <Tooltip content="Undo last generation (Ctrl+Z)">
              <Button
                onClick={undo}
                variant="outline"
                className="w-full sm:w-auto" /* Use full width on small screens, auto on larger */
              >
                Undo
              </Button>
            </Tooltip>

            <Button className="w-full sm:w-auto">
              Regenerate
            </Button>

            <Tooltip content="Export generated image (Ctrl+E)">
              <Button
                onClick={handleExportClick}
                variant="primary"
                className="export-button w-full sm:w-auto" /* Use full width on small screens, auto on larger */
              >
                Export
              </Button>
            </Tooltip>
          </>
        )}

        {(step === 'customize' || step === 'export') && (
          <Tooltip content="Start over with a new image (Ctrl+R)">
            <Button
              onClick={reset}
              variant="ghost"
              className="w-full sm:w-auto" /* Use full width on small screens, auto on larger */
            >
              Start Over
            </Button>
          </Tooltip>
        )}
      </div>
    </>
  );
}
