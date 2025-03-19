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
    
    try {
      document.dispatchEvent(new CustomEvent('ui-action', { 
        detail: { action: exportActionId }
      }));
    } catch (error) {
      console.error('Error dispatching export action event:', error);
    }
  }, [generatedImage, exportActionId]);

  const closeExportPanel = useCallback(() => {
    try {
      document.dispatchEvent(new CustomEvent('ui-action', { 
        detail: { action: exportPanelId, show: false }
      }));
    } catch (error) {
      console.error('Error dispatching close export panel event:', error);
    }
  }, [exportPanelId]);

  // Handle generation safely
  const handleGenerate = useCallback(() => {
    if (!isGenerating && uploadedImage) {
      generateImage();
    }
  }, [isGenerating, uploadedImage, generateImage]);

  return (
    <>
      {/* Export panel modal */}
      {showExportPanel && generatedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Export Options</h2>
              <button 
                onClick={closeExportPanel}
                className="text-gray-500 hover:text-gray-700"
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
      
      {/* Action buttons */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-white border-t">
        {step === 'upload' && (
          <span className="text-sm text-gray-500">Upload an image to get started</span>
        )}
        
        {step === 'customize' && (
          <Tooltip content="Generate fashion model image (Ctrl+G)">
            <div>
              <Button 
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={!uploadedImage}
                className="generate-button"
              >
                Generate Image
              </Button>
            </div>
          </Tooltip>
        )}
        
        {step === 'export' && (
          <>
            <Tooltip content="Undo last generation (Ctrl+Z)">
              <div>
                <Button onClick={undo} variant="outline">
                  Undo
                </Button>
              </div>
            </Tooltip>
            
            <Button onClick={generateImage}>
              Regenerate
            </Button>
            
            <Tooltip content="Export generated image (Ctrl+E)">
              <div>
                <Button 
                  onClick={handleExportClick}
                  variant="primary"
                  className="export-button"
                >
                  Export
                </Button>
              </div>
            </Tooltip>
          </>
        )}
        
        {(step === 'customize' || step === 'export') && (
          <Tooltip content="Start over with a new image (Ctrl+R)">
            <div>
              <Button onClick={reset} variant="ghost">
                Start Over
              </Button>
            </div>
          </Tooltip>
        )}
      </div>
    </>
  );
}
