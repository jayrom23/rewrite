'use client';

import { useGenerator } from '@/lib/context';
import Select from '@/components/ui/Select';
import Tooltip from '@/components/ui/Tooltip';

export default function EnvironmentSettings() {
  const { settings, updateSettings } = useGenerator();

  const backgroundOptions = [
    { label: 'Studio', value: 'Studio' },
    { label: 'Urban', value: 'Urban' },
    { label: 'Nature', value: 'Nature' },
    { label: 'Interior', value: 'Interior' },
  ];

  const lightingOptions = [
    { label: 'Soft', value: 'Soft' },
    { label: 'Dramatic', value: 'Dramatic' },
    { label: 'Natural', value: 'Natural' },
    { label: 'Studio', value: 'Studio' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium">Environment Settings</h3>
      <div className="space-y-4">
        <div>
          <Tooltip content="Select the background setting for your model">
            <div>
              <Select
                label="Background"
                options={backgroundOptions}
                value={settings.background}
                onChange={(e) => updateSettings({ background: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Choose the lighting style for your photo">
            <div>
              <Select
                label="Lighting"
                options={lightingOptions}
                value={settings.lighting}
                onChange={(e) => updateSettings({ lighting: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Visual examples of environments */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
        <div className="text-sm text-gray-500">
          <p>
            <strong>{settings.background}</strong> background with{' '}
            <strong>{settings.lighting}</strong> lighting
          </p>
        </div>
      </div>
    </div>
  );
}
