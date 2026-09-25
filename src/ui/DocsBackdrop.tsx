import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './DocsBackdrop.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function DocsBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const image = backdropRef.current?.querySelector('img');
      const section = backdropRef.current?.parentElement;
      if (!image || !section) return;
      const initialOpacity = parseFloat(getComputedStyle(image).opacity);

      gsap.fromTo(
        image,
        { scale: 0.96, opacity: initialOpacity * 0.65 },
        {
          scale: 1.04,
          opacity: initialOpacity,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    },
    { scope: backdropRef },
  );

  return (
    <div ref={backdropRef} className={styles.backdrop} aria-hidden="true">
      <img
        className={styles.image}
        src="/ascii-braille-docs-bg.png"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
