/**
 * Error-diffusion kernels for dithering
 */

export interface Kernel {
  divisor: number;
  taps: ReadonlyArray<readonly [dx: number, dy: number, weight: number]>;
}

export const FLOYD_STEINBERG: Kernel = {
  divisor: 16,
  taps: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]],
};

export const ATKINSON: Kernel = {
  divisor: 8,
  taps: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]],
};

export const SIERRA_LITE: Kernel = {
  divisor: 4,
  taps: [[1, 0, 2], [-1, 1, 1], [0, 1, 1]],
};

export const BURKES: Kernel = {
  divisor: 32,
  taps: [[1, 0, 8], [2, 0, 4], [-2, 1, 2], [-1, 1, 4], [0, 1, 8], [1, 1, 4], [2, 1, 2]],
};

/**
 * Error-diffusion dithering
 *
 * @param lum - linear luminance in [0,1] as Float32Array
 * @param w - width
 * @param h - height
 * @param targets - ascending target intensities
 * @param kernel - dithering kernel to use
 * @param strength - error propagation strength (0-1)
 * @param serpentine - whether to alternate scan direction each row
 * @returns quantization indices as Uint8Array
 */
export function diffuse(
  lum: Float32Array,
  w: number,
  h: number,
  targets: Float32Array,
  kernel: Kernel,
  strength = 1,
  serpentine = true
): Uint8Array {
  const out = new Uint8Array(w * h);
  const buf = Float32Array.from(lum);

  for (let y = 0; y < h; y++) {
    const ltr = !serpentine || (y & 1) === 0; // left-to-right on even rows if serpentine
    for (let i = 0; i < w; i++) {
      const x = ltr ? i : w - 1 - i;
      const idx = y * w + x;
      const old = buf[idx];

      // Find nearest target
      let q = 0;
      let best = Infinity;
      for (let t = 0; t < targets.length; t++) {
        const d = Math.abs(old - targets[t]);
        if (d < best) {
          best = d;
          q = t;
        }
      }

      out[idx] = q;
      const err = (old - targets[q]) * strength;

      // Propagate error to neighboring pixels
      for (const [dx, dy, wt] of kernel.taps) {
        const nx = x + (ltr ? dx : -dx);
        const ny = y + dy;
        if (nx < 0 || nx >= w || ny >= h) continue;
        buf[ny * w + nx] += (err * wt) / kernel.divisor;
      }
    }
  }

  return out;
}