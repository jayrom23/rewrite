'use client';

import { useState } from 'react';
import { useGenerator } from '@/lib/context';
import { sanitizeFilename } from '@/lib/utils';
import { exportImage, hasWebPSupport } from '@/lib/imageUtils';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Slider from '../ui/Slider';

type ExportFormat = 'jpeg' | 'png' | 'webp';

interface ExportSettings {
  format: ExportFormat;
  quality: number;
  maxWidth: number;
  fileName: string;
}

export default function ExportPanel() {
  const { generatedImage } = useGenerator();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'jpeg',
    quality: 0.9,
    maxWidth: 2000,
    fileName: 'fashion-model'
  });
  const [exportError, setExportError] = useState<string | null>(null);

  // Format options
  const formatOptions = [
    { label: 'JPEG', value: 'jpeg' },
    { label: 'PNG', value: 'png' },
    ...(hasWebPSupport() ? [{ label: 'WebP', value: 'webp' }] : [])
  ];
  
  // Size options
  const sizeOptions = [
    { label: 'Original', value: '0' },
    { label: 'Large (2000px)', value: '2000' },
    { label: 'Medium (1200px)', value: '1200' },
    { label: 'Small (800px)', value: '800' },
  ];

  const handleExport = async () => {
    if (!generatedImage) {
      setExportError('No image available to export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const result = await exportImage(
        generatedImage,
        exportSettings.format as ExportFormat,
        {
          quality: exportSettings.quality,
          maxWidth: exportSettings.maxWidth,
          fileName: sanitizeFilename(exportSettings.fileName), // Sanitize filename before export
        }
      );

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(result.blob);
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up
    } catch (error) {
      console.error('Export failed:', error);
      setExportError(error instanceof Error ? error.message : 'Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  if (!generatedImage) {
    return null;
  }

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-base font-medium">Export Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <Select
            options={formatOptions}
            value={exportSettings.format}
            onChange={(e) => setExportSettings({
              ...exportSettings,
              format: e.target.value as ExportFormat
            })}
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <Select
            options={sizeOptions}
            value={exportSettings.maxWidth.toString()}
            onChange={(e) => setExportSettings({
              ...exportSettings,
              maxWidth: parseInt(e.target.value, 10) || 0
            })}
            fullWidth
          />
        </div>
        
        {(exportSettings.format === 'jpeg' || exportSettings.format === 'webp') && (
          <div>
            <Slider
              label="Quality"
              min={50}
              max={100}
              step={5}
              value={Math.round(exportSettings.quality * 100)}
              onChange={(value) => setExportSettings({
                ...exportSettings,
                quality: value / 100
              })}
              fullWidth
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Name
          </label>
          <input
            type="text"
            value={exportSettings.fileName}
            onChange={(e) => setExportSettings({
              ...exportSettings,
              fileName: sanitizeFilename(e.target.value) // Sanitize filename on input change
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {exportError && (
          <div className="text-sm text-red-600">
            {exportError}
          </div>
        )}

        <div className="mt-6"> {/* Increased margin-top */}
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            fullWidth
          >
            Download Image
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>Your image will be exported with the selected settings and downloaded to your device.</p>
        {exportSettings.format === 'webp' && (
          <p className="mt-1">WebP offers better compression while maintaining quality.</p>
        )}
      </div>
    </div>
  );
}
