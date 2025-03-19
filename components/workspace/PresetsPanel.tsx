'use client';

import { useState, useEffect } from 'react';
import { useGenerator } from '@/lib/context';
import { ALL_PRESETS, MODEL_PRESETS, ENVIRONMENT_PRESETS, STYLE_PRESETS, Preset, applyPreset, getRecentPresets, saveRecentPreset } from '@/lib/presets';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';

type PresetCategory = 'all' | 'model' | 'environment' | 'style' | 'recent';

export default function PresetsPanel() {
  const { settings, updateSettings } = useGenerator();
  const [activeCategory, setActiveCategory] = useState<PresetCategory>('all');
  const [recentPresetIds, setRecentPresetIds] = useState<string[]>([]);
  
  // Load recently used presets
  useEffect(() => {
    setRecentPresetIds(getRecentPresets());
  }, []);
  
  // Filter presets based on active category
  const visiblePresets = (() => {
    switch (activeCategory) {
      case 'model':
        return MODEL_PRESETS;
      case 'environment':
        return ENVIRONMENT_PRESETS;
      case 'style':
        return STYLE_PRESETS;
      case 'recent':
        return ALL_PRESETS.filter(preset => 
          recentPresetIds.includes(preset.id)
        );
      case 'all':
      default:
        return ALL_PRESETS;
    }
  })();

  const handleApplyPreset = (preset: Preset) => {
    // Apply preset to current settings
    const newSettings = applyPreset(settings, preset);
    updateSettings(newSettings);
    
    // Save to recently used
    saveRecentPreset(preset.id);
    setRecentPresetIds(getRecentPresets());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium">Presets</h3>
        <div className="text-xs text-gray-500">
          Quick setting combinations
        </div>
      </div>
      
      {/* Category filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <CategoryButton 
          active={activeCategory === 'all'} 
          onClick={() => setActiveCategory('all')}
        >
          All
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'recent'} 
          onClick={() => setActiveCategory('recent')}
          disabled={recentPresetIds.length === 0}
        >
          Recent
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'model'} 
          onClick={() => setActiveCategory('model')}
        >
          Models
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'environment'} 
          onClick={() => setActiveCategory('environment')}
        >
          Environments
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'style'} 
          onClick={() => setActiveCategory('style')}
        >
          Styles
        </CategoryButton>
      </div>
      
      {/* Presets grid */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {visiblePresets.length > 0 ? (
          visiblePresets.map(preset => (
            <PresetCard 
              key={preset.id}
              preset={preset}
              onApply={handleApplyPreset}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
            No presets available in this category
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function CategoryButton({ children, active, onClick, disabled = false }: CategoryButtonProps) {
  return (
    <button
      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap
        ${active 
          ? 'bg-primary-100 text-primary-800 font-medium' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface PresetCardProps {
  preset: Preset;
  onApply: (preset: Preset) => void;
}

function PresetCard({ preset, onApply }: PresetCardProps) {
  return (
    <div className="border rounded-md p-2 hover:border-primary-300 hover:bg-primary-50 transition-colors">
      <div className="mb-2">
        <h4 className="text-sm font-medium">{preset.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-1">{preset.description}</p>
      </div>
      
      <div className="flex justify-end">
        <Tooltip content="Apply these settings">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onApply(preset)}
          >
            Apply
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
