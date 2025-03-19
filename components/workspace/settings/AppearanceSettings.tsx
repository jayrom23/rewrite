'use client';

import { useGenerator } from '@/lib/context';
import Select from '@/components/ui/Select';
import Tooltip from '@/components/ui/Tooltip';

export default function AppearanceSettings() {
  const { settings, updateSettings } = useGenerator();

  const ageRangeOptions = [
    { label: 'Young adult', value: 'Young adult' },
    { label: 'Adult', value: 'Adult' },
    { label: 'Mature', value: 'Mature' },
  ];

  const ethnicityOptions = [
    { label: 'Random', value: 'Random' },
    { label: 'Asian', value: 'Asian' },
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Hispanic', value: 'Hispanic' },
    { label: 'Middle Eastern', value: 'Middle Eastern' },
  ];

  const styleOptions = [
    { label: 'Casual', value: 'Casual' },
    { label: 'Professional', value: 'Professional' },
    { label: 'Trendy', value: 'Trendy' },
    { label: 'Elegant', value: 'Elegant' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium">Appearance Settings</h3>
      <div className="space-y-4">
        <div>
          <Tooltip content="Select the age range of your model">
            <div>
              <Select
                label="Age Range"
                options={ageRangeOptions}
                value={settings.ageRange}
                onChange={(e) => updateSettings({ ageRange: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Choose the ethnicity of your model, or select Random">
            <div>
              <Select
                label="Ethnicity"
                options={ethnicityOptions}
                value={settings.ethnicity}
                onChange={(e) => updateSettings({ ethnicity: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip content="Select the general style for your model's appearance">
            <div>
              <Select
                label="Style"
                options={styleOptions}
                value={settings.style}
                onChange={(e) => updateSettings({ style: e.target.value as any })}
                fullWidth
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
