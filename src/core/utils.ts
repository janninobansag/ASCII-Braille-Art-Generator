/**
 * Utility functions for ASCII/Braille art generation
 */

/**
 * Convert sRGB color to linear light
 * Using the standard sRGB transfer function
 */
export function srgbToLinear(c: number): number {
  if (c <= 0.04045) {
    return c / 12.92;
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }
}

/**
 * Convert linear light to sRGB
 */
export function linearToSrgb(c: number): number {
  if (c <= 0.0031308) {
    return c * 12.92;
  } else {
    return 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
  }
}

/**
 * Compute Rec. 709 luminance from linear RGB
 */
export function computeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Apply brightness, contrast, and gamma adjustments to luminance
 *
 * @param lum - linear luminance in [0,1]
 * @param brightness - brightness adjustment in [-1,1]
 * @param contrast - contrast adjustment (multiplier, typically 0-3)
 * @param gamma - gamma adjustment (typically 0.5-2.5)
 * @returns adjusted luminance in [0,1]
 */
export function adjustTone(
  lum: number,
  brightness: number,
  contrast: number,
  gamma: number
): number {
  // Apply brightness shift
  let adjusted = lum + brightness;
  // Clamp to [0,1] before contrast to avoid extreme values
  adjusted = Math.max(0, Math.min(1, adjusted));

  // Apply contrast around 0.5
  adjusted = (adjusted - 0.5) * contrast + 0.5;
  // Clamp again
  adjusted = Math.max(0, Math.min(1, adjusted));

  // Apply gamma
  adjusted = Math.pow(adjusted, gamma);

  // Final clamp
  return Math.max(0, Math.min(1, adjusted));
}

/**
 * Find the nearest target index for a value
 * @param value - value to quantize
 * @param targets - sorted array of target values
 * @returns index of nearest target
 */
export function quantize(value: number, targets: Float32Array): number {
  let bestIndex = 0;
  let bestDist = Math.abs(value - targets[0]);

  for (let i = 1; i < targets.length; i++) {
    const dist = Math.abs(value - targets[i]);
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }

  return bestIndex;
}