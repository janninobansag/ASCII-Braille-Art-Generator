import { OutputMode, TextSettings } from '../state/types';
import { Segmented } from './controls/Segmented';
import { SliderField } from './controls/SliderField';
import { ToggleField } from './controls/ToggleField';
import styles from './ControlsPanel.module.css';

interface TextControlsProps {
  outputMode: OutputMode;
  text: TextSettings;
  setText: (patch: Partial<TextSettings>) => void;
}

/** Braille output requires the raster engine (see docs/text-mode.md#overview);
 * the engine switch is disabled in that case rather than hidden, so it's clear why. */
export function TextControls({ outputMode, text, setText }: TextControlsProps) {
  const engineLocked = outputMode === 'braille';

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Text</h3>
        <textarea
          aria-label="Text to convert"
          placeholder="Type something"
          value={text.text}
          onChange={e => setText({ text: e.target.value })}
          rows={4}
          style={{
            width: '100%',
            resize: 'vertical',
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text)',
            padding: 8,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
          }}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Engine</h3>
        <Segmented
          ariaLabel="Text engine"
          value={engineLocked ? 'raster' : text.engine}
          options={[
            { value: 'figlet', label: 'FIGlet' },
            { value: 'raster', label: 'Raster' },
          ]}
          onChange={v => !engineLocked && setText({ engine: v })}
        />
        {engineLocked && <p className={styles.hint}>Braille output uses the raster engine.</p>}
      </section>

      {text.engine === 'figlet' && !engineLocked ? (
        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Font</h3>
          <select
            aria-label="FIGlet font"
            value={text.figletFont}
            onChange={e => setText({ figletFont: e.target.value })}
            style={{
              width: '100%',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              padding: 8,
            }}
          >
            <optgroup label="Popular">
              <option value="Standard">Standard</option>
              <option value="Slant">Slant</option>
              <option value="Big">Big</option>
            </optgroup>
            <optgroup label="3D and Shadow">
              <option value="ANSI Shadow">ANSI Shadow</option>
            </optgroup>
            <optgroup label="Bold and Block">
              <option value="Block">Block</option>
            </optgroup>
          </select>

          <h3 className={styles.sectionLabel} style={{ marginTop: 12 }}>
            Layout
          </h3>
          <select
            aria-label="FIGlet layout"
            value={text.figletLayout}
            onChange={e => setText({ figletLayout: e.target.value as TextSettings['figletLayout'] })}
            style={{
              width: '100%',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              padding: 8,
            }}
          >
            <option value="default">Default</option>
            <option value="full">Full</option>
            <option value="fitted">Fitted</option>
            <option value="controlled smushing">Controlled smushing</option>
            <option value="universal smushing">Universal smushing</option>
          </select>
        </section>
      ) : (
        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Font</h3>
          <select
            aria-label="Raster font family"
            value={text.fontFamily}
            onChange={e => setText({ fontFamily: e.target.value })}
            style={{
              width: '100%',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              padding: 8,
            }}
          >
            <option value="Inter">Inter</option>
            <option value="IBM Plex Mono">IBM Plex Mono</option>
            <option value="Playfair Display">Playfair Display</option>
          </select>
          <SliderField
            label="Weight"
            value={text.fontWeight}
            min={100}
            max={900}
            step={100}
            onChange={v => setText({ fontWeight: v })}
          />
          <SliderField
            label="Line height"
            value={text.lineHeight}
            min={0.8}
            max={2}
            step={0.05}
            format={v => v.toFixed(2)}
            onChange={v => setText({ lineHeight: v })}
          />
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>Layout</h3>
        <Segmented
          ariaLabel="Text alignment"
          value={text.align}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
          onChange={v => setText({ align: v })}
        />
        <SliderField
          label="Wrap width"
          value={text.wrapWidth}
          min={20}
          max={200}
          onChange={v => setText({ wrapWidth: v })}
        />
      </section>

      <section className={styles.section}>
        <ToggleField label="Color gradient" checked={text.gradient} onChange={v => setText({ gradient: v })} />
        {text.gradient && (
          <>
            <Segmented
              ariaLabel="Gradient direction"
              value={text.gradientDirection}
              options={[
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
              ]}
              onChange={v => setText({ gradientDirection: v })}
            />
          </>
        )}
      </section>
    </>
  );
}
