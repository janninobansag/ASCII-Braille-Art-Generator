import { useEffect, useRef } from 'react';
import { ControlsPanel } from '../ui/ControlsPanel';
import { Header } from '../ui/Header';
import { OutputPanel } from '../ui/OutputPanel';
import { StatusRegion } from '../ui/StatusRegion';
import { useAppState } from '../state/useAppState';
import { loadImageFile, loadImageUrl, getImageData } from '../io/decode';
import styles from './App.module.css';

export function App() {
  const state = useAppState();

  // Reflect the theme on <html> so CSS custom properties in theme.css apply globally.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  // Initialize the pipeline worker
  useEffect(() => {
    try {
      const worker = new Worker(new URL('./workers/pipeline.worker.ts', import.meta.url));

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
          // In a real app, we'd have a proper error state - for now just log
          console.error('Worker error:', payload.message);
        }
      };

      worker.onerror = (e: ErrorEvent) => {
        state.setIsProcessing(false);
        console.error('Worker error:', e.message);
      };

      return () => {
        worker.terminate();
      };
    } catch (error) {
      console.warn('Could not create worker:', error);
      // Fallback to main thread processing if worker fails
    }
  }, []); // Empty deps - worker should be created once

  async function handleFileSelected(file: File) {
    state.setIsProcessing(true);
    state.setOutputArt(''); // Clear previous output

    try {
      // Load and decode the image
      const imageData = await loadImageFile(file);
      const { data, width, height } = getImageData(imageData);

      state.setImageName(file.name);
      state.setHasImage(true);

      // Process the image if worker is available
      const worker = new Worker(new URL('./workers/pipeline.worker.ts', import.meta.url));
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

        worker.terminate(); // Clean up worker after use
      };

      worker.onerror = (e: ErrorEvent) => {
        state.setIsProcessing(false);
        console.error('Worker error:', e.message);
        worker.terminate();
      };

      worker.postMessage({
        type: 'process',
        payload: {
          imageData: data,
          width,
          height,
          outputWidth: state.common.columns,
          outputMode: state.outputMode,
          brightness: state.common.brightness,
          contrast: state.common.contrast,
          gamma: state.common.gamma,
          invert: state.common.invertBrightness,
          characterRamp: state.common.characterRamp || '',
          dithering: state.common.dithering,
          ditherStrength: state.common.ditherStrength,
          serpentine: state.common.serpentineScan,
          edgeDetect: state.common.edgeDetect,
          edgeThreshold: state.common.edgeDetectThreshold,
          fillBlankCells: state.common.fillBlankCells,
          backgroundColor: state.common.backgroundColor
        }
      });
    } catch (error) {
      state.setIsProcessing(false);
      console.error('Error loading image:', error);
    }
  }

  async function handleUrlLoad(url: string) {
    state.setIsProcessing(true);
    state.setOutputArt(''); // Clear previous output

    try {
      // Load and decode the image from URL
      const imageData = await loadImageUrl(url);
      const { data, width, height } = getImageData(imageData);

      // Process the image if worker is available
      const worker = new Worker(new URL('./workers/pipeline.worker.ts', import.meta.url));
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

        worker.terminate(); // Clean up worker after use
      };

      worker.onerror = (e: ErrorEvent) => {
        state.setIsProcessing(false);
        console.error('Worker error:', e.message);
        worker.terminate();
      };

      worker.postMessage({
        type: 'process',
        payload: {
          imageData: data,
          width,
          height,
          outputWidth: state.common.columns,
          outputMode: state.outputMode,
          brightness: state.common.brightness,
          contrast: state.common.contrast,
          gamma: state.common.gamma,
          invert: state.common.invertBrightness,
          characterRamp: state.common.characterRamp || '',
          dithering: state.common.dithering,
          ditherStrength: state.common.ditherStrength,
          serpentine: state.common.serpentineScan,
          edgeDetect: state.common.edgeDetect,
          edgeThreshold: state.common.edgeDetectThreshold,
          fillBlankCells: state.common.fillBlankCells,
          backgroundColor: state.common.backgroundColor
        }
      });
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
      />

      <div className={styles.body}>
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

        <div className={`${styles.outputPane} fade-in-up`} style={{ animationDelay: '120ms' }}>
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
      </div>
    </div>
  );
}
