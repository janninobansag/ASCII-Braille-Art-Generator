import { ImageIcon } from './icons/Icons';
import styles from './OutputPanel.module.css';

interface OutputPanelProps {
  hasContent: boolean;
  art: string; // rendered text; empty until the pipeline produces a result
  cols: number;
  rows: number;
  zoom: number;
  onZoomChange: (z: number) => void;
  onChooseImage: () => void;
}

/** Right pane. `role="img"` plus an aria-label stands in for reading the
 * raw characters aloud (thousands of glyphs is not useful to a screen
 * reader) — see docs/ui-spec.md#accessibility. The actual text is still
 * reachable via Copy / Download in the export panel. */
export function OutputPanel({ hasContent, art, cols, rows, zoom, onZoomChange, onChooseImage }: OutputPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Output</span>
        {hasContent && (
          <div className={styles.zoom}>
            <button
              type="button"
              className={styles.zoomButton}
              aria-label="Zoom out"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            >
              −
            </button>
            <span>{zoom}%</span>
            <button
              type="button"
              className={styles.zoomButton}
              aria-label="Zoom in"
              onClick={() => onZoomChange(Math.min(400, zoom + 10))}
            >
              +
            </button>
            <span className={styles.size}>
              {cols}×{rows} chars
            </span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        {hasContent ? (
          <pre
            className={styles.art}
            style={{ fontSize: `${zoom / 100 * 12}px` }}
            role="img"
            aria-label={`Character art, ${cols} by ${rows} characters`}
          >
            {art}
          </pre>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <ImageIcon size={28} />
            </span>
            <p className={styles.emptyHeading}>No image yet.</p>
            <p className={styles.emptyBody}>Upload an image from the panel to see it here.</p>
            <button type="button" className={styles.chooseButton} onClick={onChooseImage}>
              Choose image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
