import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollToSection } from '../app/navigation';
import styles from './Footer.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FooterProps {
  onOpenGenerator: () => void;
}

export function Footer({ onOpenGenerator }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '[data-footer-reveal]',
        { opacity: 0.12, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 92%',
            end: 'top 58%',
            scrub: 0.8,
          },
        },
      );

      gsap.fromTo(
        '[data-footer-mark]',
        { opacity: 0.2, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
            end: 'top 62%',
            scrub: 0.8,
          },
        },
      );
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.ctaRow}>
          <h2 className={styles.title}>
            <span data-footer-reveal>Turn pixels into</span>
            <span data-footer-reveal>character.</span>
          </h2>
          <a
            className={styles.cta}
            href="#features"
            data-footer-reveal
            onClick={event => {
              onOpenGenerator();
              scrollToSection(event, 'features');
            }}
          >
            Open generator
          </a>
        </div>

        <div className={styles.bottomRow} data-footer-reveal>
          <a
            className={styles.brand}
            href="/"
            aria-label="ASCII and Braille Art Generator home"
          >
            <img
              className={styles.mark}
              src="/ascii-braille-logo-v2.png"
              alt=""
              data-footer-mark
            />
            <span>ASCII &amp; Braille</span>
          </a>

          <nav className={styles.links} aria-label="Footer navigation">
            <a href="#features" onClick={event => scrollToSection(event, 'features')}>
              Features
            </a>
            <a href="#docs" onClick={event => scrollToSection(event, 'docs')}>
              Docs
            </a>
            <a
              href="https://github.com/janninobansag/ASCII-Braille-Art-Generator"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>

          <p className={styles.legal}>
            Processed locally. Built for the open web.
          </p>
        </div>
      </div>
    </footer>
  );
}
