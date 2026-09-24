import { ButtonHTMLAttributes } from 'react';
import styles from './TextButton.module.css';

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'button' | 'link';
}

export function TextButton({ variant = 'button', className, ...rest }: TextButtonProps) {
  const cls = variant === 'link' ? styles.link : styles.button;
  return <button type="button" className={[cls, className].filter(Boolean).join(' ')} {...rest} />;
}
