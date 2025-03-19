'use client';

import { useGenerator } from '@/lib/context';
import Select from '@/components/ui/Select';
import Tooltip from '@/components/ui/Tooltip';

export default function StyleSettings() {
  const { settings, updateSettings } = useGenerator();

  const cameraAngleOptions = [
    { label: 'Front', value: 'Front' },
    { label: '3/4 view', value: '3/4 view' },
    { label: 'Side', value: 'Side' },
  ];

  const photographyStyleOptions = [
    { label: 'Fashion', value: 'Fashion' },
    { label: 'Catalog', value: 'Catalog' },
    { label: 'Editorial', value: 'Editorial' },
  ];

  return (
    <div className="space-y-4 px-4">
      <h3 className="text-base font-medium">Style Settings</h3>
      <div className="space-y-3">
        <div>
          <Tooltip content="Select the camera angle for your model photo">
            <div>
              <Select
                label="Camera Angle"
                options={cameraAngleOptions}
                value={settings.cameraAngle}
                onChange={(e) => updateSettings({ cameraAngle: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Choose the overall photography style">
            <div>
              <Select
                label="Photography Style"
                options={photographyStyleOptions}
                value={settings.photographyStyle}
                onChange={(e) => updateSettings({ photographyStyle: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Brief explanation of photography styles */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Style Guide</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li><strong>Fashion:</strong> High-end, artistic and dramatic</li>
          <li><strong>Catalog:</strong> Clean, clear product presentation</li>
          <li><strong>Editorial:</strong> Magazine-style, storytelling focus</li>
        </ul>
      </div>
    </div>
  );
}
