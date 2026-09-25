/**
 * Braille engine for converting dot grids to Braille characters
 */

const DOT_BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
] as const; // [row][col]

/**
 * Pack a 1-bit dot grid into Braille Unicode characters
 *
 * @param dots - 1-bit dot grid (0 or 1) as Uint8Array, row-major
 * @param dotW - width of dot grid
 * @param dotH - height of dot grid (should be multiple of 4 for Braille)
 * @param fillBlank - whether to represent blank cells as U+2804 (single dot) instead of U+2800
 * @returns Braille text string with newlines separating rows of cells
 */
export function packBraille(
  dots: Uint8Array,
  dotW: number,
  dotH: number,
  fillBlank = false
): string {
  const cols = Math.ceil(dotW / 2);
  const rows = Math.ceil(dotH / 4);
  const lines: string[] = [];

  for (let cy = 0; cy < rows; cy++) {
    let line = '';
    for (let cx = 0; cx < cols; cx++) {
      let bits = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          const x = cx * 2 + c;
          const y = cy * 4 + r;
          if (x < dotW && y < dotH && dots[y * dotW + x]) {
            bits |= DOT_BITS[r][c];
          }
        }
      }
      // U+2800 is the blank Braille pattern
      const charCode = 0x2800 + (bits === 0 && fillBlank ? 0x04 : bits);
      line += String.fromCharCode(charCode);
    }
    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * Convert linear luminance to 1-bit dot grid using threshold
 *
 * @param lum - linear luminance in [0,1]
 * @param w - width
 * @param h - height
 * @param threshold - threshold value in [0,1]
 * @returns 1-bit dot grid as Uint8Array (0 or 1)
 */
export function threshold(lum: Float32Array, w: number, h: number, threshold: number): Uint8Array {
  const dots = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    dots[i] = lum[i] >= threshold ? 1 : 0;
  }
  return dots;
}