// Core types for the application

// Model settings types
export interface ModelSettings {
  // Model Type
  gender: 'Male' | 'Female' | 'Neutral';
  bodyType: 'Slim' | 'Athletic' | 'Plus-size';
  height: 'Short' | 'Average' | 'Tall';

  // Appearance
  ageRange: 'Young adult' | 'Adult' | 'Mature';
  ethnicity: 'Random' | 'Asian' | 'Black' | 'White' | 'Hispanic' | 'Middle Eastern';
  style: 'Casual' | 'Professional' | 'Trendy' | 'Elegant';

  // Environment
  background: 'Studio' | 'Urban' | 'Nature' | 'Interior';
  lighting: 'Soft' | 'Dramatic' | 'Natural' | 'Studio';

  // Style
  cameraAngle: 'Front' | '3/4 view' | 'Side';
  photographyStyle: 'Fashion' | 'Catalog' | 'Editorial';
}

// Application state
export interface GeneratorState {
  uploadedImage: string | null;
  generatedImage: string | null;
  settings: ModelSettings;
  isGenerating: boolean;
  history: HistoryEntry[];
  error: string | null;
  step: 'upload' | 'customize' | 'generate' | 'export';  // Make sure 'upload' is included
  aspectRatio: number | null;
}

// History entry for undo/redo
export interface HistoryEntry {
  timestamp: number;
  settings: ModelSettings;
  generatedImage?: string;
}

// Action types for the reducer
export type GeneratorAction =
  | { type: 'UPLOAD_IMAGE'; payload: { image: string; suggestedSettings?: Partial<ModelSettings> } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ModelSettings> }
  | { type: 'GENERATION_START' }
  | { type: 'GENERATION_SUCCESS'; payload: { image: string, aspectRatio: number } }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: 'upload' | 'customize' | 'generate' | 'export' }
  | { type: 'SET_ASPECT_RATIO', payload: number }; // Add new action
