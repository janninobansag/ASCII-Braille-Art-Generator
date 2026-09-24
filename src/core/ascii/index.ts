/**
 * ASCII engine for converting luminance to ASCII characters
 */

import { quantize } from '../utils';

/**
 * ASCII ramp presets from lightest to darkest
 */
export const ASCII_RAMPS = {
  // Standard character ramp
  standard: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',

  // Simple ramp
  simple: ' .:-=+*#%@',

  // Dense ramp
  dense: ' .'`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
};

/**
 * Convert ASCII ramp to target intensities
 * In a full implementation, this would involve rendering each character
 * and measuring its pixel density. For now, we'll use evenly spaced targets
 * as a placeholder that can be enhanced with actual font calibration later.
 */
export function rampToTargets(ramp: string): Float32Array {
  const length = ramp.length;
  const targets = new Float32Array(length);

  // For now, distribute evenly - in a full implementation,
  // each character would be rendered and its density measured
  for (let i = 0; i < length; i++) {
    targets[i] = i / (length - 1);
  }

  return targets;
}

/**
 * Map luminance grid to ASCII characters using a character ramp
 *
 * @param lum - linear luminance in [0,1] as Float32Array
 * @param w - width
 * @param h - height
 * @param ramp - ASCII character string (lightest to darkest)
 * @returns ASCII art string
 */
export function renderAscii(
  lum: Float32Array,
  w: number,
  h: number,
  ramp: string
): string {
  const targets = rampToTargets(ramp);
  const resultLines: string[] = [];

  for (let y = 0; y < h; y++) {
    let line = '';
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const value = lum[idx];
      const charIndex = quantize(value, targets);
      line += ramp[charIndex];
    }
    resultLines.push(line);
  }

  return resultLines.join('\n');
}