/**
 * Image decoding utilities
 * Handles loading image files and URLs, converting to pixel data
 */

/**
 * Load an image file and return its pixel data
 * @param file - File object to load
 * @returns Promise that resolves to image data and metadata
 */
export async function loadImageFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas to extract pixel data
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      } catch (e) {
        reject(new Error(`Failed to get image data: ${e}`));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image file'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Load an image from a URL and return its pixel data
 * @param url - Image URL to load
 * @returns Promise that resolves to image data and metadata
 */
export async function loadImageUrl(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Allow cross-origin images if permitted
    img.onload = () => {
      // Create canvas to extract pixel data
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      } catch (e) {
        reject(new Error(`Failed to get image data: ${e}`));
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image from URL: ${url}`));
    img.src = url;
  });
}

/**
 * Extract RGBA pixel data from ImageData
 * @param imageData - ImageData object from canvas
 * @returns { data: Uint8ClampedArray, width: number, height: number }
 */
export function getImageData(imageData: ImageData): {
  data: Uint8ClampedArray;
  width: number;
  height: number;
} {
  return {
    data: imageData.data,
    width: imageData.width,
    height: imageData.height
  };
}

/**
 * HEIC/HEIF support placeholder
 * In a full implementation, this would use libheif-js or similar
 * For now, we'll rely on browser native support when available
 */
export async function loadHeicFile(file: File): Promise<ImageData> {
  // Try to load as regular image first (browsers with HEIC support will handle it)
  try {
    return await loadImageFile(file);
  } catch (error) {
    // In a full implementation, we'd fall back to a WASM decoder here
    throw new Error(`HEIC format not supported: ${error.message}`);
  }
}