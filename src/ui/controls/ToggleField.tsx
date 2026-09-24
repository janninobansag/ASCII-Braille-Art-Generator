import { useId } from 'react';
import styles from './ToggleField.module.css';

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  const id = useId();
  return (
    <label className={styles.row} htmlFor={id}>
      <input
        id={id}
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className={checked ? styles.boxChecked : styles.box} aria-hidden="true">
        {checked && <span className={styles.tick} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
