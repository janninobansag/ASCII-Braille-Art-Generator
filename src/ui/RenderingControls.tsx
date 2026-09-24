import { AsciiSettings, BrailleSettings, CommonSettings, DitherAlgorithm, OutputMode } from '../state/types';
import { Segmented } from './controls/Segmented';
import { SliderField } from './controls/SliderField';
import { TextButton } from './controls/TextButton';
import { ToggleField } from './controls/ToggleField';
import styles from './ControlsPanel.module.css';

interface RenderingControlsProps {
  outputMode: OutputMode;
  common: CommonSettings;
  setCommon: (patch: Partial<CommonSettings>) => void;
  ascii: AsciiSettings;
  setAscii: (patch: Partial<AsciiSettings>) => void;
  braille: BrailleSettings;
  setBraille: (patch: Partial<BrailleSettings>) => void;
}

const DITHER_OPTIONS: { value: DitherAlgorithm; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'floyd-steinberg', label: 'Floyd–Steinberg' },
  { value: 'atkinson', label: 'Atkinson' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'blue-noise', label: 'Blue noise' },
  { value: 'custom', label: 'Custom' },
];

const DITHER_HELP: Record<DitherAlgorithm, string> = {
  none: 'Hard threshold. Sharp edges, no halftoning.',
  'floyd-steinberg': 'Smooth, fine grain. Good default for photos.',
  atkinson: 'Higher contrast, cleaner highlights and shadows.',
  ordered: 'Regular, stable pattern. No error to accumulate.',
  'blue-noise': 'Organic grain without visible structure.',
  custom: 'Uses the kernel registered in core/dither/kernels.ts.',
};

export function RenderingControls({
  outputMode,
  common,
  setCommon,
  ascii,
  setAscii,
  braille,
  setBraille,
}: RenderingControlsProps) {
  const usesErrorDiffusion =
    common.dithering.algorithm === 'floyd-steinberg' ||
    common.dithering.algorithm === 'atkinson' ||
    common.dithering.algorithm === 'custom';

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Image</h3>
        <SliderField
          label="Width"
          value={common.columns}
          min={20}
          max={300}
          format={v => `${v} chars`}
          onChange={v => setCommon({ columns: v })}
        />
        <SliderField
          label="Brightness"
          value={common.brightness}
          min={-100}
          max={100}
          onChange={v => setCommon({ brightness: v })}
        />
        <SliderField
          label="Contrast"
          value={common.contrast}
          min={0.25}
          max={3}
          step={0.05}
          format={v => `${v.toFixed(2)}×`}
          onChange={v => setCommon({ contrast: v })}
        />
        <SliderField
          label="Gamma"
          value={common.gamma}
          min={0.5}
          max={2.5}
          step={0.05}
          format={v => v.toFixed(2)}
          onChange={v => setCommon({ gamma: v })}
        />
        <TextButton onClick={() => setCommon({ brightness: 0, contrast: 1, gamma: 1 })}>
          Reset brightness &amp; contrast
        </TextButton>
      </section>

      <section className={styles.section}>
        <SliderField
          label="Stretch X"
          value={common.stretchX}
          min={0.5}
          max={2}
          step={0.05}
          format={v => `${v.toFixed(2)}×`}
          onChange={v => setCommon({ stretchX: v })}
        />
        <SliderField
          label="Stretch Y"
          value={common.stretchY}
          min={0.5}
          max={2}
          step={0.05}
          format={v => `${v.toFixed(2)}×`}
          onChange={v => setCommon({ stretchY: v })}
        />
        <TextButton onClick={() => setCommon({ stretchX: 1, stretchY: 1 })}>Reset stretch</TextButton>
      </section>

      {(outputMode === 'braille' || common.dithering.algorithm === 'none') && (
        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Threshold</h3>
          <ToggleField
            label="Auto (Otsu's method)"
            checked={braille.thresholdAuto}
            onChange={v => setBraille({ thresholdAuto: v })}
          />
          {!braille.thresholdAuto && (
            <SliderField
              label="Threshold"
              value={braille.threshold}
              min={0}
              max={255}
              onChange={v => setBraille({ threshold: v })}
            />
          )}
          {braille.thresholdAuto && <p className={styles.hint}>Auto finds the best split for this image.</p>}
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Dithering</h3>
        <Segmented
          ariaLabel="Dithering algorithm"
          value={common.dithering.algorithm}
          options={DITHER_OPTIONS}
          onChange={v => setCommon({ dithering: { ...common.dithering, algorithm: v } })}
        />
        <p className={styles.hint}>{DITHER_HELP[common.dithering.algorithm]}</p>

        {usesErrorDiffusion && (
          <>
            <SliderField
              label="Strength"
              value={common.dithering.strength}
              min={0}
              max={1}
              step={0.05}
              onChange={v => setCommon({ dithering: { ...common.dithering, strength: v } })}
            />
            <ToggleField
              label="Serpentine scan"
              checked={common.dithering.serpentine}
              onChange={v => setCommon({ dithering: { ...common.dithering, serpentine: v } })}
            />
          </>
        )}

        {common.dithering.algorithm === 'ordered' && (
          <Segmented
            ariaLabel="Bayer matrix size"
            value={String(common.dithering.matrix ?? 4) as '2' | '4' | '8'}
            options={[
              { value: '2', label: '2×2' },
              { value: '4', label: '4×4' },
              { value: '8', label: '8×8' },
            ]}
            onChange={v =>
              setCommon({ dithering: { ...common.dithering, matrix: Number(v) as 2 | 4 | 8 } })
            }
          />
        )}
      </section>

      {outputMode === 'ascii' ? (
        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Character ramp</h3>
          <Segmented
            ariaLabel="Ramp preset"
            value={ascii.ramp}
            options={[
              { value: 'classic', label: 'Classic' },
              { value: 'extended', label: 'Extended' },
              { value: 'blocks', label: 'Blocks' },
              { value: 'custom', label: 'Custom' },
            ]}
            onChange={v => setAscii({ ramp: v })}
          />
          {ascii.ramp === 'custom' && (
            <input
              aria-label="Custom ramp, lightest to darkest"
              value={ascii.customRamp}
              placeholder=" .:-=+*#%@"
              onChange={e => setAscii({ customRamp: e.target.value })}
              style={{
                width: '100%',
                marginTop: 8,
                background: 'var(--bg-sunken)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                padding: 8,
                fontFamily: 'var(--font-mono)',
              }}
            />
          )}
          <ToggleField
            label="Calibrate to font"
            checked={ascii.calibrateRamp}
            onChange={v => setAscii({ calibrateRamp: v })}
          />

          <h3 className={styles.sectionLabel} style={{ marginTop: 16 }}>
            Edges
          </h3>
          <ToggleField label="Edge detect" checked={ascii.edgeEnabled} onChange={v => setAscii({ edgeEnabled: v })} />
          {ascii.edgeEnabled && (
            <SliderField
              label="Edge threshold"
              value={ascii.edgeThreshold}
              min={0}
              max={100}
              onChange={v => setAscii({ edgeThreshold: v })}
            />
          )}
        </section>
      ) : (
        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Braille</h3>
          <ToggleField
            label="Fill blank cells"
            checked={braille.fillBlank}
            onChange={v => setBraille({ fillBlank: v })}
          />
          <p className={styles.hint}>Replaces fully empty cells with a single dot so they survive chat apps that trim blank characters.</p>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Color</h3>
        <Segmented
          ariaLabel="Color mode"
          value={common.color}
          options={[
            { value: 'none', label: 'None' },
            { value: 'source', label: 'Source' },
            { value: 'gradient', label: 'Gradient' },
          ]}
          onChange={v => setCommon({ color: v })}
        />
        <ToggleField label="Invert brightness" checked={common.invert} onChange={v => setCommon({ invert: v })} />
      </section>
    </>
  );
}
