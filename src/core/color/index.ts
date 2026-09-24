/**
 * Color processing utilities for converting images to luminance
 */

import { srgbToLinear, computeLuminance, adjustTone } from '../utils';

/**
 * Convert RGBA image to linear luminance array
 *
 * @param rgba - RGBA pixels as Uint8Array (length = width * height * 4)
 * @param width - image width
 * @param height - image height
 * @param bgR - background red component [0,255] for alpha compositing
 * @param bgG - background green component [0,255]
 * @param bgB - background blue component [0,255]
 * @returns linear luminance as Float32Array (length = width * height)
 */
export function rgbaToLuminance(
  rgba: Uint8Array,
  width: number,
  height: number,
  bgR: number = 0,
  bgG: number = 0,
  bgB: number = 0
): Float32Array {
  const lum = new Float32Array(width * height);

  // Normalize background to [0,1]
  const nbgr = bgR / 255;
  const nbgg = bgG / 255;
  const nbgb = bgB / 255;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = rgba[idx] / 255;
      const g = rgba[idx + 1] / 255;
      const b = rgba[idx + 2] / 255;
      const a = rgba[idx + 3] / 255;

      // Composite alpha over background
      const cr = r * a + nbgr * (1 - a);
      const cg = g * a + nbgg * (1 - a);
      const cb = b * a + nbgb * (1 - a);

      // Convert sRGB to linear light
      const lr = srgbToLinear(cr);
      const lg = srgbToLinear(cg);
      const lb = srgbToLinear(cb);

      // Compute luminance
      lum[y * width + x] = computeLuminance(lr, lg, lb);
    }
  }

  return lum;
}

/**
 * Apply tone adjustments (brightness, contrast, gamma) to luminance
 *
 * @param lum - linear luminance in [0,1] as Float32Array
 * @param brightness - brightness adjustment [-1,1]
 * @param contrast - contrast multiplier (typically 0-3)
 * @param gamma - gamma adjustment (typically 0.5-2.5)
 * @param invert - whether to invert the luminance (1 - lum)
 * @returns adjusted luminance as Float32Array
 */
export function adjustLuminance(
  lum: Float32Array,
  brightness: number,
  contrast: number,
  gamma: number,
  invert = false
): Float32Array {
  const adjusted = new Float32Array(lum.length);

  for (let i = 0; i < lum.length; i++) {
    let value = lum[i];

    // Apply adjustments
    value = adjustTone(value, brightness, contrast, gamma);

    // Apply invert if needed
    if (invert) {
      value = 1 - value;
    }

    adjusted[i] = value;
  }

  return adjusted;
}