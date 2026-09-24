import { useId, useState } from 'react';
import { UploadIcon } from './icons/Icons';
import styles from './ImageDropZone.module.css';

interface ImageDropZoneProps {
  onFileSelected: (file: File) => void;
  onUrlLoad: (url: string) => void;
}

/** Wires up click-to-browse, drag and drop, and a paste-URL field.
 * Decoding (including the HEIC fallback) happens in src/io/decode.ts;
 * this component only surfaces the file or URL. See docs/heic-support.md. */
export function ImageDropZone({ onFileSelected, onUrlLoad }: ImageDropZoneProps) {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const [url, setUrl] = useState('');

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className={dragOver ? styles.zoneActive : styles.zone}
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className={styles.icon} aria-hidden="true">
          <UploadIcon size={20} />
        </span>
        <span className={styles.primary}>
          Drop image or <strong>click to browse</strong>
        </span>
        <span className={styles.formats}>PNG, JPG, GIF, WebP, HEIC</span>
        <input
          id={inputId}
          className={styles.input}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
          }}
        />
      </label>

      <div className={styles.urlRow}>
        <input
          className={styles.urlInput}
          type="url"
          placeholder="https://…"
          aria-label="Image URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button type="button" className={styles.loadButton} onClick={() => url && onUrlLoad(url)}>
          Load
        </button>
      </div>
    </div>
  );
}
