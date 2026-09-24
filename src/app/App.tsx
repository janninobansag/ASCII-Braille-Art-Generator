import { useEffect, useState } from 'react';
import { ControlsPanel } from '../ui/ControlsPanel';
import { Header } from '../ui/Header';
import { OutputPanel } from '../ui/OutputPanel';
import { StatusRegion } from '../ui/StatusRegion';
import { useAppState } from '../state/useAppState';
import styles from './App.module.css';

export function App() {
  const state = useAppState();
  const [status, setStatus] = useState('');

  // Reflect the theme on <html> so CSS custom properties in theme.css apply globally.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  function handleFileSelected(file: File) {
    // Wire this to src/io/decode.ts: decodeToRaster(file) -> pipeline worker `load`.
    // decode.ts also handles the HEIC native-first / WASM-fallback path (docs/heic-support.md).
    setStatus(`Loading ${file.name}…`);
    state.setImageName(file.name);
    state.setHasImage(true);
  }

  function handleUrlLoad(url: string) {
    // Subject to CORS; see docs/features.md#troubleshooting.
    setStatus(`Loading image from URL…`);
    void url;
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
          <ControlsPanel state={state} onFileSelected={handleFileSelected} onUrlLoad={handleUrlLoad} />
        </div>

        <div className={`${styles.outputPane} fade-in-up`} style={{ animationDelay: '120ms' }}>
          <OutputPanel
            hasContent={state.hasImage}
            art="" // populated once the pipeline worker returns a RenderResult
            cols={state.common.columns}
            rows={0}
            zoom={state.zoom}
            onZoomChange={state.setZoom}
            onChooseImage={() => state.setControlsOpen(true)}
          />
        </div>
      </div>

      <StatusRegion message={status} />
    </div>
  );
}
