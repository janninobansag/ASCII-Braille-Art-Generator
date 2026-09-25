import { useCallback, useEffect, useRef } from 'react';
import { ControlsPanel } from '../ui/ControlsPanel';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';
import { HeroBackdrop } from '../ui/HeroBackdrop';
import { DocsBackdrop } from '../ui/DocsBackdrop';
import { OutputPanel } from '../ui/OutputPanel';
import { StatusRegion } from '../ui/StatusRegion';
import { useAppState } from '../state/useAppState';
import { loadImageFile, loadImageUrl, getImageData } from '../io/decode';
import { ASCII_RAMPS } from '../core/ascii';
import styles from './App.module.css';
import { scrollToSection } from './navigation';

interface CachedImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function App() {
  const state = useAppState();
  const workerRef = useRef<Worker | null>(null);
  const currentImageRef = useRef<CachedImage | null>(null);

  // Reflect the theme on <html> so CSS custom properties in theme.css apply globally.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  // Helper to post a process job to the worker
  const dispatchProcess = useCallback(
    (img: CachedImage) => {
      const worker = workerRef.current;
      if (!worker) return;

      const ramp =
        state.ascii.ramp === 'custom'
          ? state.ascii.customRamp || ASCII_RAMPS.classic
          : ASCII_RAMPS[state.ascii.ramp] || ASCII_RAMPS.classic;

      state.setIsProcessing(true);
      worker.postMessage({
        type: 'process',
        payload: {
          imageData: img.data,
          width: img.width,
          height: img.height,
          outputWidth: state.common.columns,
          outputMode: state.outputMode,
          brightness: state.common.brightness / 100,
          contrast: state.common.contrast,
          gamma: state.common.gamma,
          stretchX: state.common.stretchX,
          stretchY: state.common.stretchY,
          invert: state.common.invert,
          characterRamp: ramp,
          dithering: state.common.dithering.algorithm,
          ditherStrength: state.common.dithering.strength,
          serpentine: state.common.dithering.serpentine,
          edgeDetect: state.ascii.edgeEnabled,
          edgeThreshold: state.ascii.edgeThreshold,
          fillBlankCells: state.braille.fillBlank,
          thresholdAuto: state.braille.thresholdAuto,
          threshold: state.braille.threshold,
          backgroundColor:
            state.theme === 'dark' ? { r: 14, g: 16, b: 21 } : { r: 255, g: 255, b: 255 },
        },
      });
    },
    [state]
  );

  // Initialize the pipeline worker
  useEffect(() => {
    try {
      const worker = new Worker(new URL('../workers/pipeline.worker.ts', import.meta.url), {
        type: 'module',
      });

      worker.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data;

        if (type === 'result') {
          const { art, cols, rows } = payload;
          state.setOutputArt(art);
          state.setOutputCols(cols);
          state.setOutputRows(rows);
          state.setIsProcessing(false);
        } else if (type === 'error') {
          state.setIsProcessing(false);
          console.error('Worker error:', payload.message);
        }
      };

      worker.onerror = (e: ErrorEvent) => {
        state.setIsProcessing(false);
        console.error('Worker error:', e.message);
      };

      workerRef.current = worker;

      // If we already have a cached image when worker mounts, process it
      if (currentImageRef.current) {
        dispatchProcess(currentImageRef.current);
      }

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (error) {
      console.warn('Could not create worker:', error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-process when rendering settings change and an image is loaded
  useEffect(() => {
    if (currentImageRef.current && state.inputMode === 'image') {
      dispatchProcess(currentImageRef.current);
    }
  }, [
    state.common,
    state.ascii,
    state.braille,
    state.outputMode,
    state.inputMode,
    state.theme,
    dispatchProcess,
  ]);

  async function handleFileSelected(file: File) {
    state.setIsProcessing(true);
    state.setOutputArt(''); // Clear previous output

    try {
      const imageData = await loadImageFile(file);
      const { data, width, height } = getImageData(imageData);
      const cached = { data, width, height };
      currentImageRef.current = cached;

      state.setImageName(file.name);
      state.setHasImage(true);

      dispatchProcess(cached);
    } catch (error) {
      state.setIsProcessing(false);
      console.error('Error loading image:', error);
    }
  }

  async function handleUrlLoad(url: string) {
    state.setIsProcessing(true);
    state.setOutputArt(''); // Clear previous output

    try {
      const imageData = await loadImageUrl(url);
      const { data, width, height } = getImageData(imageData);
      const cached = { data, width, height };
      currentImageRef.current = cached;

      const urlName = url.split('/').pop()?.split('?')[0] || 'remote-image';
      state.setImageName(urlName);
      state.setHasImage(true);

      dispatchProcess(cached);
    } catch (error) {
      state.setIsProcessing(false);
      console.error('Error loading image:', error);
    }
  }

  return (
    <div className={styles.shell}>
      <Header
        theme={state.theme}
        onToggleTheme={state.toggleTheme}
        controlsOpen={state.controlsOpen}
        onToggleControls={() => state.setControlsOpen(!state.controlsOpen)}
        onShowControls={() => state.setControlsOpen(true)}
        onShowOutput={() => state.setControlsOpen(false)}
      />

      <section className={styles.hero} aria-labelledby="hero-title">
        <HeroBackdrop />
        <div className={styles.heroContent}>
          <div className={styles.heroBadges} aria-label="Highlights">
            <span className={styles.heroBadge}><strong>NEW</strong> Braille-ready rendering</span>
            <span className={styles.heroBadge}>✓ Client-side processing</span>
          </div>
          <h1 id="hero-title" className={styles.heroTitle}>
            Images and text,
            <br />
            into ASCII art.
          </h1>
          <p className={styles.heroCopy}>
            Convert an image or type text to pixel-perfect ASCII and Braille art—ready for code,
            chat, and creative projects.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.heroPrimary} onClick={() => state.setControlsOpen(true)}>
              Open generator
            </button>
            <a className={styles.heroSecondary} href="#features" onClick={event => scrollToSection(event, 'features')}>
              See features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className={styles.body} aria-label="Generator features">
        <div
          className={`${state.controlsOpen ? styles.controlsPaneOpen : styles.controlsPane} fade-in-up`}
          style={{ animationDelay: '60ms' }}
        >
          <ControlsPanel
            state={state}
            onFileSelected={handleFileSelected}
            onUrlLoad={handleUrlLoad}
          />
        </div>

        <div id="output-panel" className={`${styles.outputPane} fade-in-up`} style={{ animationDelay: '120ms' }}>
          <OutputPanel
            hasContent={state.hasImage && state.outputArt.length > 0}
            art={state.outputArt}
            cols={state.outputCols}
            rows={state.outputRows}
            zoom={state.zoom}
            onZoomChange={state.setZoom}
            onChooseImage={() => state.setControlsOpen(true)}
          />
        </div>
      </section>

      <section id="docs" className={styles.about} aria-labelledby="about-title">
        <DocsBackdrop />
        <div className={styles.aboutInner}>
          <h2 id="about-title">What is ASCII &amp; Braille Art Generator?</h2>
          <p>
            ASCII &amp; Braille Art Generator is a free, browser-based tool that transforms images
            and text into artwork made from characters. It turns pixels into expressive patterns
            you can copy into code, chat, documentation, or creative projects.
          </p>
          <p>
            Everything runs locally in your browser. Your images stay on your device, with no
            account, upload, or server-side processing required.
          </p>

          <h3>Image to ASCII and Braille</h3>
          <p>
            Upload an image or paste a URL, then tune width, brightness, contrast, gamma, stretch,
            dithering, and character ramps in real time. Switch between ASCII for familiar text
            art and Braille for denser, higher-resolution output.
          </p>

          <h3>Made for sharing</h3>
          <p>
            Copy aligned text for Discord, Twitch, YouTube, and terminals, or export a PNG when
            you want the artwork to keep its exact visual shape across platforms.
          </p>
        </div>
      </section>
      <Footer onOpenGenerator={() => state.setControlsOpen(true)} />
      <StatusRegion message={state.isProcessing ? 'Processing image...' : ''} />
    </div>
  );
}
