import { useState } from 'react';
import { OutputMode } from '../state/types';
import { Segmented } from './controls/Segmented';
import { CopyIcon, DownloadIcon } from './icons/Icons';
import styles from './ExportPanel.module.css';

interface ExportPanelProps {
  outputMode: OutputMode;
  hasContent: boolean;
  charCount: number;
  onCopyArt: () => void;
  onDiscord: () => void;
  onFullWidth: () => void;
  onCopyImage: () => void;
  onDownloadPng: (resolution: 1 | 2 | 4) => void;
  onDownloadTxt: () => void;
}

// Verify Discord's current non-Nitro message limit before shipping (see docs/features.md#exporting).
const DISCORD_LIMIT = 2000;

export function ExportPanel({
  outputMode,
  hasContent,
  charCount,
  onCopyArt,
  onDiscord,
  onFullWidth,
  onCopyImage,
  onDownloadPng,
  onDownloadTxt,
}: ExportPanelProps) {
  const [resolution, setResolution] = useState<'1' | '2' | '4'>('1');
  const overLimit = charCount > DISCORD_LIMIT;

  return (
    <div className={styles.panel}>
      <h3 className={styles.groupLabel}>Export</h3>
      <button type="button" className={styles.primary} disabled={!hasContent} onClick={onCopyArt}>
        <CopyIcon size={14} />
        Copy art
      </button>

      <h3 className={styles.groupLabel}>Paste as text</h3>
      {outputMode === 'ascii' && (
        <div className={styles.infoCard}>
          Braille mode stays <strong>perfectly aligned</strong> on every platform, with no font stretching.
        </div>
      )}
      <p className={overLimit ? styles.countWarning : styles.count}>
        {charCount.toLocaleString()} / {DISCORD_LIMIT.toLocaleString()} characters (Discord)
      </p>
      <div className={styles.row}>
        <button type="button" className={styles.secondary} disabled={!hasContent} onClick={onDiscord}>
          Discord
        </button>
        <button type="button" className={styles.secondary} disabled={!hasContent} onClick={onFullWidth}>
          Twitch · YouTube
        </button>
      </div>

      <h3 className={styles.groupLabel}>Paste as image</h3>
      <p className={styles.count}>Resolution</p>
      <div style={{ marginBottom: 12 }}>
        <Segmented
          ariaLabel="PNG export resolution"
          value={resolution}
          options={[
            { value: '1', label: '1×' },
            { value: '2', label: '2×' },
            { value: '4', label: '4×' },
          ]}
          onChange={setResolution}
        />
      </div>
      <div className={styles.row}>
        <button type="button" className={styles.secondary} disabled={!hasContent} onClick={onCopyImage}>
          <CopyIcon size={13} />
          Copy image
        </button>
        <button
          type="button"
          className={styles.secondary}
          disabled={!hasContent}
          onClick={() => onDownloadPng(Number(resolution) as 1 | 2 | 4)}
        >
          <DownloadIcon size={13} />
          Download PNG
        </button>
      </div>

      <button type="button" className={styles.secondary} disabled={!hasContent} onClick={onDownloadTxt} style={{ width: '100%' }}>
        <DownloadIcon size={13} />
        Download .txt
      </button>

      <p className={styles.notes}>
        <strong>Discord</strong> — monospace code block.
        <br />
        <strong>Twitch · YouTube</strong> — full-width Unicode characters.
        <br />
        <strong>Copy image</strong> — PNG, for Twitter, Instagram, and similar.
      </p>
    </div>
  );
}
