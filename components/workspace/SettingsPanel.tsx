'use client';

import { useState } from 'react';
import { useGenerator } from '@/lib/context';
import Tooltip from '../ui/Tooltip';
import PresetsPanel from './PresetsPanel';
import ModelTypeSettings from './settings/ModelTypeSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import EnvironmentSettings from './settings/EnvironmentSettings';
import StyleSettings from './settings/StyleSettings';

type SettingsTab = 'presets' | 'modelType' | 'appearance' | 'environment' | 'style';

export default function SettingsPanel() {
  const { step, isHydrated } = useGenerator();
  const [activeTab, setActiveTab] = useState<SettingsTab>('presets');

  // Only show settings panel when we're in customize or export step
  if (step === 'upload') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium mb-2">Settings</h2>
          <p className="text-sm text-gray-500">Upload an image to customize settings</p>
        </div>
      </div>
    );
  }

  // Render loading spinner until hydration is complete
  if (!isHydrated) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Settings</h2>
          <p className="text-sm text-gray-500">Loading settings...</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Full content once hydrated
  return (
    <div className="h-full flex flex-col"> {/* Added flex-col */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Settings</h2>
        <p className="text-sm text-gray-500">
          Customize your model
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        <TabButton
          isActive={activeTab === 'presets'}
          onClick={() => setActiveTab('presets')}
          tooltip="Quick setting combinations"
        >
          Presets
        </TabButton>
        <TabButton
          isActive={activeTab === 'modelType'}
          onClick={() => setActiveTab('modelType')}
          tooltip="Configure model type, body shape, and height"
        >
          Model Type
        </TabButton>
        <TabButton
          isActive={activeTab === 'appearance'}
          onClick={() => setActiveTab('appearance')}
          tooltip="Set age, ethnicity, and style"
        >
          Appearance
        </TabButton>
        <TabButton
          isActive={activeTab === 'environment'}
          onClick={() => setActiveTab('environment')}
          tooltip="Choose background and lighting"
        >
          Environment
        </TabButton>
        <TabButton
          isActive={activeTab === 'style'}
          onClick={() => setActiveTab('style')}
          tooltip="Set camera angle and photography style"
        >
          Style
        </TabButton>
      </div>

      {/* Tab Content - make scrollable */}
      <div className="flex-grow overflow-y-auto space-y-4">
        {activeTab === 'presets' && <PresetsPanel />}
        {activeTab === 'modelType' && <ModelTypeSettings />}
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'environment' && <EnvironmentSettings />}
        {activeTab === 'style' && <StyleSettings />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltip: string;
}

function TabButton({ children, isActive, onClick, tooltip }: TabButtonProps) {
  return (
    <Tooltip content={tooltip}>
      <button
        className={`px-3 py-2 text-sm font-medium ${
          isActive
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap`} /* Added whitespace-nowrap */
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  );
}
