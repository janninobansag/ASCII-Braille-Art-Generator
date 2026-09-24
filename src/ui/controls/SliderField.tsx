import { useId } from 'react';
import styles from './SliderField.module.css';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  help?: string;
  onChange: (v: number) => void;
}

/** A slider paired with a numeric badge and, optionally, a direct numeric input
 * (the badge doubles as the input on click) so the control stays usable without
 * a mouse. See docs/ui-spec.md#controls-panel. */
export function SliderField({ label, value, min, max, step = 1, format, onChange, help }: SliderFieldProps) {
  const id = useId();
  const display = format ? format(value) : String(value);

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        <input
          className={styles.badge}
          type="number"
          aria-label={`${label} value`}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(clamp(Number(e.target.value), min, max))}
        />
      </div>
      <input
        id={id}
        className={styles.track}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={e => onChange(Number(e.target.value))}
      />
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
