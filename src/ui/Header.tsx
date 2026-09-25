import { ExternalLinkIcon, GithubIcon, MoonIcon, SlidersIcon, SunIcon } from './icons/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  controlsOpen: boolean;
  onToggleControls: () => void;
}

export function Header({ theme, onToggleTheme, controlsOpen, onToggleControls }: HeaderProps) {
  return (
    <div className={`${styles.wrap} fade-in-up`}>
      <nav className={styles.nav} aria-label="Primary">
        <a className={styles.brand} href="/">
          <img className={styles.mark} src="/ascii-braille-logo-v2.png" alt="" aria-hidden="true" />
          ASCII &amp; Braille
        </a>

        <div className={styles.links}>
          <a className={styles.link} href="#features">
            Features
          </a>
          <a className={styles.link} href="#docs">
            Docs
          </a>
          <a className={styles.link} href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
            <ExternalLinkIcon size={11} className={styles.externalIcon} />
          </a>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.controlsToggle}
            aria-expanded={controlsOpen}
            aria-controls="controls-panel"
            onClick={onToggleControls}
          >
            <SlidersIcon size={15} />
            <span className={styles.controlsToggleLabel}>Controls</span>
          </button>
          <a
            className={styles.iconButton}
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </nav>
    </div>
  );
}
