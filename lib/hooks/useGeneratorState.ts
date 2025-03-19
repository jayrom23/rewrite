'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import { GeneratorState, ModelSettings, GeneratorAction } from '../types';
import { optimizeImage } from '../imageUtils';
import { generateWithAI } from '../gemini';
import { reportError } from '../errorHandler';
import {
  saveSettings,
  loadSettings,
  saveHistory,
  loadHistory,
  saveSession,
  loadSession,
  clearStorage
} from '../storage';

// Default settings
export const DEFAULT_SETTINGS: ModelSettings = {
  // Model Type
  gender: 'Female',
  bodyType: 'Slim',
  height: 'Average',

  // Appearance
  ageRange: 'Young adult',
  ethnicity: 'Random',
  style: 'Casual',

  // Environment
  background: 'Studio',
  lighting: 'Natural',

  // Style
  cameraAngle: 'Front',
  photographyStyle: 'Fashion',
};

// Initialize state with saved data if available
const getInitialState = (): GeneratorState => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return {
      uploadedImage: null,
      generatedImage: null,
      settings: DEFAULT_SETTINGS,
      isGenerating: false,
      history: [],
      error: null,
      step: 'upload',
      aspectRatio: null,
    };
  }

  const savedSettings = loadSettings();
  const savedHistory = loadHistory();
  const savedSession = loadSession();

  return {
    uploadedImage: savedSession?.uploadedImage || null,
    generatedImage: savedSession?.generatedImage || null,
    settings: savedSettings || DEFAULT_SETTINGS,
    isGenerating: false,
    history: savedHistory || [],
    error: null,
    step: savedSession?.step || 'upload',
    aspectRatio: null,
  };
};

// Reducer function
function generatorReducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case 'UPLOAD_IMAGE':
      return {
        ...state,
        uploadedImage: action.payload.image,
        settings: {
          ...state.settings,
          ...(action.payload.suggestedSettings || {})
        },
        step: 'customize',
        error: null,
      };

    case 'UPDATE_SETTINGS':
      const newSettings = {
        ...state.settings,
        ...action.payload
      };
      // Save settings when they change
      saveSettings(newSettings);
      return {
        ...state,
        settings: newSettings,
      };

    case 'GENERATION_START':
      return {
        ...state,
        isGenerating: true,
        error: null,
      };

    case 'GENERATION_SUCCESS':
      const newHistory = [
        ...state.history,
        {
          timestamp: Date.now(),
          settings: state.settings,
          generatedImage: action.payload.image,
        }
      ];
      // Save history when we generate a new image
      saveHistory(newHistory);
      return {
        ...state,
        generatedImage: action.payload.image,
        isGenerating: false,
        history: newHistory,
        step: 'export',
        aspectRatio: action.payload.aspectRatio, // Store aspect ratio
      };
    case 'GENERATION_ERROR':
      return {
        ...state,
        isGenerating: false,
        error: action.payload,
      };

    case 'UNDO':
      if (state.history.length === 0) {
        return state;
      }

      const previousHistory = state.history.slice(0, -1);
      const lastEntry = state.history[state.history.length - 1];

      // Update history in storage
      saveHistory(previousHistory);

      return {
        ...state,
        generatedImage: lastEntry.generatedImage || null,
        settings: lastEntry.settings,
        history: previousHistory,
      };

    case 'RESET':
      // Clear storage when resetting
      clearStorage();
      return {
        ...getInitialState(),
        uploadedImage: null,
        generatedImage: null,
        history: [],
        step: 'upload',
        aspectRatio: null,
      };

    case 'SET_STEP':
      return {
        ...state,
        step: action.payload
      };
    case 'SET_ASPECT_RATIO':
      return {
        ...state,
        aspectRatio: action.payload,
      };

    default:
      return state;
  }
}

// Custom hook for generator state
export function useGeneratorState() {
  const [state, dispatch] = useReducer(generatorReducer, getInitialState());
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect - mark component as hydrated after mounting
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Save session on certain state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    saveSession({
      uploadedImage: state.uploadedImage,
      generatedImage: state.generatedImage,
      step: state.step
    });
  }, [state.uploadedImage, state.generatedImage, state.step]);

  const uploadImage = useCallback(async (file: File) => {
    try {
      // Optimize image client-side before storing
      const optimizedImage = await optimizeImage(file);

      // Auto-detect optimal settings would go here in a real implementation
      // For now, just use defaults
      const suggestedSettings = {};

      // Calculate aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        dispatch({ type: 'SET_ASPECT_RATIO', payload: aspectRatio });
        dispatch({
          type: 'UPLOAD_IMAGE',
          payload: {
            image: optimizedImage,
            suggestedSettings
          }
        });
      }
      img.src = optimizedImage;


    } catch (error) {
      // Report error to monitoring
      reportError(error, { context: 'image_upload' });

      dispatch({
        type: 'GENERATION_ERROR',
        payload: error instanceof Error ? error.message : 'Error uploading image'
      });
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ModelSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  const generateImage = useCallback(async () => {
    if (!state.uploadedImage) {
      dispatch({
        type: 'GENERATION_ERROR',
        payload: 'No image uploaded'
      });
      return;
    }

    dispatch({ type: 'GENERATION_START' });

    try {
      // Call the Gemini API to generate the image
      const result = await generateWithAI(
        state.uploadedImage,
        state.settings
      );

      // Calculate aspect ratio of the *generated* image
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        dispatch({
          type: 'GENERATION_SUCCESS',
          payload: { image: result.image, aspectRatio }, // Pass aspect ratio
        });
      };
      img.src = result.image;


    } catch (error) {
      // Report error to monitoring
      reportError(error, { context: 'image_generation', settings: state.settings });

      dispatch({
        type: 'GENERATION_ERROR',
        payload: error instanceof Error ? error.message : 'Error generating image'
      });
    }
  }, [state.uploadedImage, state.settings]);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    isHydrated,  // Export hydration status
    uploadImage,
    updateSettings,
    generateImage,
    undo,
    reset
  };
}
