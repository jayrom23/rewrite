import { ModelSettings } from './types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  settings: Partial<ModelSettings>;
  category: 'style' | 'model' | 'environment';
}

// Predefined presets for quick settings
export const MODEL_PRESETS: Preset[] = [
  {
    id: 'female-slim',
    name: 'Female Slim',
    description: 'Standard female fashion model',
    category: 'model',
    settings: {
      gender: 'Female',
      bodyType: 'Slim',
      height: 'Average',
      ageRange: 'Young adult'
    }
  },
  {
    id: 'male-athletic',
    name: 'Male Athletic',
    description: 'Athletic male model',
    category: 'model',
    settings: {
      gender: 'Male',
      bodyType: 'Athletic',
      height: 'Tall',
      ageRange: 'Young adult'
    }
  },
  {
    id: 'diverse-models',
    name: 'Diverse Models',
    description: 'Ethnically diverse model settings',
    category: 'model',
    settings: {
      ethnicity: 'Random',
      ageRange: 'Adult'
    }
  },
  {
    id: 'plus-size',
    name: 'Plus Size',
    description: 'Plus size model',
    category: 'model',
    settings: {
      bodyType: 'Plus-size',
    }
  }
];

export const ENVIRONMENT_PRESETS: Preset[] = [
  {
    id: 'studio-bright',
    name: 'Studio Bright',
    description: 'Clean studio with bright lighting',
    category: 'environment',
    settings: {
      background: 'Studio',
      lighting: 'Natural'
    }
  },
  {
    id: 'urban-dramatic',
    name: 'Urban Dramatic',
    description: 'Urban setting with dramatic lighting',
    category: 'environment',
    settings: {
      background: 'Urban',
      lighting: 'Dramatic'
    }
  },
  {
    id: 'nature-soft',
    name: 'Nature Soft',
    description: 'Natural outdoor setting with soft lighting',
    category: 'environment',
    settings: {
      background: 'Nature',
      lighting: 'Soft'
    }
  }
];

export const STYLE_PRESETS: Preset[] = [
  {
    id: 'fashion-editorial',
    name: 'Fashion Editorial',
    description: 'High fashion editorial style',
    category: 'style',
    settings: {
      style: 'Trendy',
      cameraAngle: '3/4 view',
      photographyStyle: 'Editorial',
    }
  },
  {
    id: 'catalog-standard',
    name: 'Catalog Standard',
    description: 'Standard catalog product presentation',
    category: 'style',
    settings: {
      style: 'Casual',
      cameraAngle: 'Front',
      photographyStyle: 'Catalog',
    }
  },
  {
    id: 'professional-look',
    name: 'Professional Look',
    description: 'Professional business style',
    category: 'style',
    settings: {
      style: 'Professional',
      cameraAngle: 'Front',
      photographyStyle: 'Fashion',
    }
  }
];

// All presets combined
export const ALL_PRESETS = [
  ...MODEL_PRESETS,
  ...ENVIRONMENT_PRESETS,
  ...STYLE_PRESETS
];

/**
 * Apply a preset to the existing settings
 */
export function applyPreset(currentSettings: ModelSettings, preset: Preset): ModelSettings {
  return {
    ...currentSettings,
    ...preset.settings
  };
}

/**
 * Get recently used presets from local storage
 */
export function getRecentPresets(): string[] {
  try {
    const saved = localStorage.getItem('ai-fashion-generator-recent-presets');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Save a preset ID to recently used
 */
export function saveRecentPreset(presetId: string): void {
  try {
    const recent = getRecentPresets();
    // Remove if already exists
    const filtered = recent.filter(id => id !== presetId);
    // Add to front
    const updated = [presetId, ...filtered].slice(0, 5);
    localStorage.setItem('ai-fashion-generator-recent-presets', JSON.stringify(updated));
  } catch (_) {
    // Underscore indicates intentionally unused variable
    console.error('Error saving recent preset');
  }
}
