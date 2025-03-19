/**
 * Utility functions for image processing
 */

// Convert a File to base64 string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(reader.error || new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}

// Convert base64 to Blob
export function base64ToBlob(base64: string, type = 'image/jpeg'): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type });
}

/**
 * Optimizes an image by resizing and compressing it
 */
export async function optimizeImage(file: File): Promise<string> {
  // Basic validation
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Size validation (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds 10MB limit');
  }

  try {
    // For smaller images (<1MB), just convert to base64
    if (file.size < 1024 * 1024) {
      return await fileToBase64(file);
    }

    // For larger images, resize and compress
    const imageBitmap = await createImageBitmap(file);
    const maxDimension = 1200; // Max width or height
    
    // Calculate dimensions while maintaining aspect ratio
    let width = imageBitmap.width;
    let height = imageBitmap.height;
    
    if (width > height && width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
    
    // Create canvas for resizing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw resized image on canvas
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    
    // Convert to WebP if browser supports it
    if (hasWebPSupport()) {
      return canvas.toDataURL('image/webp', 0.85);
    }
    
    // Fallback to JPEG
    return canvas.toDataURL('image/jpeg', 0.85);
    
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Fallback to simple base64 conversion if optimization fails
    return await fileToBase64(file);
  }
}

/**
 * Creates a low-resolution thumbnail for progressive loading
 */
export async function createThumbnail(imageData: string, size = 20): Promise<string> {
  try {
    // Create an image from the data
    const img = document.createElement('img');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageData;
    });
    
    // Create tiny canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = Math.round((size * img.height) / img.width);
    
    // Draw tiny version
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get low-res placeholder
    return canvas.toDataURL('image/jpeg', 0.5);
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return imageData;
  }
}

// Define interface for the function with cachedResult property
interface WebPSupportFunction {
  (): boolean;
  cachedResult?: boolean;
}

/**
 * Check if the browser supports WebP format
 */
export const hasWebPSupport: WebPSupportFunction = function(): boolean {
  // In server rendering, always return false
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Use a cached result if available
  if (typeof hasWebPSupport.cachedResult !== 'undefined') {
    return hasWebPSupport.cachedResult;
  }
  
  // Try to create a canvas and check WebP support
  try {
    const canvas = document.createElement('canvas');
    hasWebPSupport.cachedResult = 
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return hasWebPSupport.cachedResult;
  } catch (e) {
    hasWebPSupport.cachedResult = false;
    return false;
  }
};

// Initialize cachedResult as undefined
hasWebPSupport.cachedResult = undefined;

/**
 * Convert an image to WebP format if supported
 */
export async function convertToWebP(imageData: string, quality = 0.85): Promise<string> {
  if (!hasWebPSupport()) {
    return imageData; // Return original if WebP not supported
  }
  
  try {
    const img = document.createElement('img');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageData;
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/webp', quality);
  } catch (error) {
    console.error('Error converting to WebP:', error);
    return imageData;
  }
}

/**
 * Convert and export image to the desired format
 */
export async function exportImage(
  imageData: string, 
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  options: { 
    quality?: number;
    maxWidth?: number;
    fileName?: string;
  } = {}
): Promise<{ url: string; blob: Blob; fileName: string }> {
  const { 
    quality = 0.9,
    maxWidth = 2000,
    fileName = 'fashion-model'
  } = options;
  
  try {
    // Create image element from data
    const img = document.createElement('img');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageData;
    });
    
    // Resize if needed
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    
    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);
    
    // Determine mime type based on format
    let mimeType: string;
    switch (format) {
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpeg':
      default:
        mimeType = 'image/jpeg';
        break;
    }
    
    // Check if format is supported, fallback to JPEG if not
    if (format === 'webp' && !hasWebPSupport()) {
      mimeType = 'image/jpeg';
      format = 'jpeg';
    }
    
    // Get data URL
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    // Convert to blob for download
    const blob = base64ToBlob(dataUrl, mimeType);
    
    // Generate download file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName}-${timestamp}.${format}`;
    
    return {
      url: dataUrl,
      blob,
      fileName: fullFileName
    };
  } catch (error) {
    console.error('Error exporting image:', error);
    throw new Error('Failed to export image');
  }
}
