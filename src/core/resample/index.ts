/**
 * Resampling utilities for area-average downscaling
 */

/**
 * Resample RGBA pixels to a lower resolution using area-average (box) filter
 * Each output pixel is the average of the source pixels it covers
 *
 * @param src - source RGBA pixels as Uint8Array (length = srcW * srcH * 4)
 * @param srcW - source width
 * @param srcH - source height
 * @param dstW - destination width
 * @param dstH - destination height
 * @returns destination RGBA pixels as Uint8Array (length = dstW * dstH * 4)
 */
export function areaAverageResize(
  src: Uint8Array | Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): Uint8Array {
  const dst = new Uint8Array(dstW * dstH * 4);
  const xScale = srcW / dstW;
  const yScale = srcH / dstH;

  for (let dstY = 0; dstY < dstH; dstY++) {
    for (let dstX = 0; dstX < dstW; dstX++) {
      // Calculate source rectangle that maps to this destination pixel
      const srcX0 = Math.floor(dstX * xScale);
      const srcX1 = Math.ceil((dstX + 1) * xScale);
      const srcY0 = Math.floor(dstY * yScale);
      const srcY1 = Math.ceil((dstY + 1) * yScale);

      // Clamp to source bounds
      let x0 = Math.max(0, srcX0);
      let x1 = Math.min(srcW, srcX1);
      let y0 = Math.max(0, srcY0);
      let y1 = Math.min(srcH, srcY1);

      // Avoid division by zero
      const width = Math.max(1, x1 - x0);
      const area = Math.max(1, y1 - y0) * width;

      // Initialize accumulators
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let aSum = 0;

      // Sum all source pixels in the area
      for (let srcY = y0; srcY < y1; srcY++) {
        for (let srcX = x0; srcX < x1; srcX++) {
          const srcIdx = (srcY * srcW + srcX) * 4;
          rSum += src[srcIdx];
          gSum += src[srcIdx + 1];
          bSum += src[srcIdx + 2];
          aSum += src[srcIdx + 3];
        }
      }

      // Calculate average and store
      const dstIdx = (dstY * dstW + dstX) * 4;
      dst[dstIdx] = Math.round(rSum / area);     // R
      dst[dstIdx + 1] = Math.round(gSum / area); // G
      dst[dstIdx + 2] = Math.round(bSum / area); // B
      dst[dstIdx + 3] = Math.round(aSum / area); // A
    }
  }

  return dst;
}