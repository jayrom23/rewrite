import { ModelSettings } from './types';
// Only import what we need
/**
 * Creates an effective prompt for the Gemini model based on settings
 */
export function createEffectivePrompt(settings: ModelSettings): string {
  return `
    Generate a high-quality fashion model photo based on this product image.
    Create a ${settings.gender} ${settings.bodyType} model wearing the clothing item.
    Model should be ${settings.ageRange} age range with ${settings.ethnicity === 'Random' ? 'any' : settings.ethnicity} ethnicity.
    Use ${settings.background} background with ${settings.lighting} lighting.
    Show model from ${settings.cameraAngle} view in a ${settings.style} style.
    Make the model appear ${settings.height} height.
    Use ${settings.photographyStyle} photography style.
    Make the final image look like a professional fashion product photo.
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Extract only the essential settings to reduce payload size
 */
export function getEssentialSettings(settings: ModelSettings): ModelSettings {
  return settings;
}

/**
 * Call the Gemini API to generate a fashion model image
 */
export async function generateWithAI(image: string, settings: ModelSettings): Promise<{ image: string; message?: string }> {
  try {
    // Call API with optimized payload
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image,
        prompt: createEffectivePrompt(settings),
        settings: getEssentialSettings(settings)
      })
    });

    if (!response.ok) {
      // Get detailed error info from API
      let errorText = 'API request failed';

      try {
        const errorData = await response.json();
        errorText = typeof errorData.error === 'string' ? errorData.error :
                  typeof errorData.message === 'string' ? errorData.message :
                  `Error: ${response.status}`;
      } catch (_) {
        // Underscore indicates intentionally unused variable
        errorText = await response.text() || `HTTP error ${response.status}`;
      }

      // Throw proper error for handling
      throw new Error(errorText);
    }

    // Process successful response
    const result = await response.json();

    // Check for success flag
    if (!result.success) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Failed to generate image');
    }

    // Return both the image and any message
    return {
      image: result.image,
      message: typeof result.message === 'string' ? result.message : undefined
    };
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
}
