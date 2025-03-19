'use client';

import { useGenerator } from '@/lib/context';
import Select from '@/components/ui/Select';
import Tooltip from '@/components/ui/Tooltip';

export default function ModelTypeSettings() {
  const { settings, updateSettings } = useGenerator();

  // Options for each select
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Neutral', value: 'Neutral' },
  ];

  const bodyTypeOptions = [
    { label: 'Slim', value: 'Slim' },
    { label: 'Athletic', value: 'Athletic' },
    { label: 'Plus-size', value: 'Plus-size' },
  ];

  const heightOptions = [
    { label: 'Short', value: 'Short' },
    { label: 'Average', value: 'Average' },
    { label: 'Tall', value: 'Tall' },
  ];

  return (
    <div className="space-y-4 px-4">
      <h3 className="text-base font-medium">Model Type Settings</h3>
      <div className="space-y-3">
        <div>
          <Tooltip content="Select the gender of your model">
            <div>
              <Select
                label="Gender"
                options={genderOptions}
                value={settings.gender}
                onChange={(e) => updateSettings({ gender: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Choose the body type for your model">
            <div>
              <Select
                label="Body Type"
                options={bodyTypeOptions}
                value={settings.bodyType}
                onChange={(e) => updateSettings({ bodyType: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Select the height of your model">
            <div>
              <Select
                label="Height"
                options={heightOptions}
                value={settings.height}
                onChange={(e) => updateSettings({ height: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
