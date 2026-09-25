import { useState } from 'react';
import {
  AsciiSettings,
  BrailleSettings,
  CommonSettings,
  DEFAULT_ASCII,
  DEFAULT_BRAILLE,
  DEFAULT_COMMON,
  DEFAULT_TEXT,
  InputMode,
  OutputMode,
  TextSettings,
} from './types';

export interface AppState {
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  outputMode: OutputMode;
  setOutputMode: (m: OutputMode) => void;

  common: CommonSettings;
  setCommon: (patch: Partial<CommonSettings>) => void;
  ascii: AsciiSettings;
  setAscii: (patch: Partial<AsciiSettings>) => void;
  braille: BrailleSettings;
  setBraille: (patch: Partial<BrailleSettings>) => void;
  text: TextSettings;
  setText: (patch: Partial<TextSettings>) => void;

  resetAll: () => void;

  hasImage: boolean;
  setHasImage: (v: boolean) => void;
  imageName: string | null;
  setImageName: (v: string | null) => void;

  zoom: number;
  setZoom: (z: number) => void;

  controlsOpen: boolean; // mobile bottom sheet
  setControlsOpen: (v: boolean) => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Output state
  outputArt: string;
  setOutputArt: (art: string) => void;
  outputCols: number;
  setOutputCols: (cols: number) => void;
  outputRows: number;
  setOutputRows: (rows: number) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function useAppState(): AppState {
  const [inputMode, setInputMode] = useState<InputMode>('image');
  const [outputMode, setOutputModeRaw] = useState<OutputMode>('ascii');
  const [common, setCommonState] = useState<CommonSettings>(DEFAULT_COMMON);
  const [ascii, setAsciiState] = useState<AsciiSettings>(DEFAULT_ASCII);
  const [braille, setBrailleState] = useState<BrailleSettings>(DEFAULT_BRAILLE);
  const [text, setTextState] = useState<TextSettings>(DEFAULT_TEXT);
  const [hasImage, setHasImage] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [outputArt, setOutputArt] = useState('');
  const [outputCols, setOutputCols] = useState(0);
  const [outputRows, setOutputRows] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Selecting Braille output in Text mode implies the raster engine (see docs/text-mode.md).
  function setOutputMode(m: OutputMode) {
    setOutputModeRaw(m);
    if (m === 'braille' && inputMode === 'text') {
      setTextState(prev => ({ ...prev, engine: 'raster' }));
    }
  }

  function setCommon(patch: Partial<CommonSettings>) {
    setCommonState(prev => ({ ...prev, ...patch }));
  }
  function setAscii(patch: Partial<AsciiSettings>) {
    setAsciiState(prev => ({ ...prev, ...patch }));
  }
  function setBraille(patch: Partial<BrailleSettings>) {
    setBrailleState(prev => ({ ...prev, ...patch }));
  }
  function setText(patch: Partial<TextSettings>) {
    setTextState(prev => ({ ...prev, ...patch }));
  }

  function resetAll() {
    setCommonState(DEFAULT_COMMON);
    setAsciiState(DEFAULT_ASCII);
    setBrailleState(DEFAULT_BRAILLE);
    setTextState(DEFAULT_TEXT);
    setOutputArt('');
    setOutputCols(0);
    setOutputRows(0);
    setIsProcessing(false);
  }

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  return {
    inputMode,
    setInputMode,
    outputMode,
    setOutputMode,
    common,
    setCommon,
    ascii,
    setAscii,
    braille,
    setBraille,
    text,
    setText,
    resetAll,
    hasImage,
    setHasImage,
    imageName,
    setImageName,
    zoom,
    setZoom,
    controlsOpen,
    setControlsOpen,
    theme,
    toggleTheme,
    outputArt,
    setOutputArt,
    outputCols,
    setOutputCols,
    outputRows,
    setOutputRows,
    isProcessing,
    setIsProcessing,
  };
}