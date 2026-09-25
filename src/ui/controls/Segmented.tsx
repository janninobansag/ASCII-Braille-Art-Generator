import { ReactNode } from 'react';
import styles from './Segmented.module.css';

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  ariaLabel: string;
}

export function Segmented<T extends string>({ value, options, onChange, ariaLabel }: SegmentedProps<T>) {
  return (
    <div
      className={`${styles.group} ${options.length === 3 ? styles.threeOptionGroup : ''}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={opt.value === value ? styles.optionActive : styles.option}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && (
            <span className={styles.icon} aria-hidden="true">
              {opt.icon}
            </span>
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
