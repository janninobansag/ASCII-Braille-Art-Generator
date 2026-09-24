export type InputMode = 'image' | 'text';
export type OutputMode = 'ascii' | 'braille';
export type TextEngine = 'figlet' | 'raster';
export type DitherAlgorithm = 'none' | 'floyd-steinberg' | 'atkinson' | 'ordered' | 'blue-noise' | 'custom';
export type ColorMode = 'none' | 'source' | 'gradient';

export interface Dithering {
  algorithm: DitherAlgorithm;
  strength: number; // 0..1, ignored for 'none'
  serpentine: boolean;
  matrix?: 2 | 4 | 8; // 'ordered' only
}

export interface CommonSettings {
  columns: number; // 20..300
  brightness: number; // -100..100
  contrast: number; // 0.25..3
  gamma: number; // 0.5..2.5
  stretchX: number; // 0.5..2
  stretchY: number; // 0.5..2
  invert: boolean;
  dithering: Dithering;
  color: ColorMode;
}

export interface AsciiSettings {
  ramp: 'classic' | 'extended' | 'blocks' | 'custom';
  customRamp: string;
  calibrateRamp: boolean;
  edgeEnabled: boolean;
  edgeThreshold: number; // 0..100
}

export interface BrailleSettings {
  thresholdAuto: boolean;
  threshold: number; // 0..255
  fillBlank: boolean;
}

export interface TextSettings {
  text: string;
  engine: TextEngine;
  figletFont: string;
  figletLayout: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  align: 'left' | 'center' | 'right';
  wrapWidth: number;
  gradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: 'horizontal' | 'vertical';
}

export const DEFAULT_COMMON: CommonSettings = {
  columns: 120,
  brightness: 0,
  contrast: 1,
  gamma: 1,
  stretchX: 1,
  stretchY: 1,
  invert: false,
  dithering: { algorithm: 'floyd-steinberg', strength: 1, serpentine: true },
  color: 'none',
};

export const DEFAULT_ASCII: AsciiSettings = {
  ramp: 'classic',
  customRamp: '',
  calibrateRamp: false,
  edgeEnabled: false,
  edgeThreshold: 40,
};

export const DEFAULT_BRAILLE: BrailleSettings = {
  thresholdAuto: true,
  threshold: 128,
  fillBlank: false,
};

export const DEFAULT_TEXT: TextSettings = {
  text: '',
  engine: 'figlet',
  figletFont: 'Standard',
  figletLayout: 'default',
  fontFamily: 'Inter',
  fontWeight: 700,
  lineHeight: 1.2,
  align: 'left',
  wrapWidth: 80,
  gradient: false,
  gradientFrom: '#ffffff',
  gradientTo: '#888888',
  gradientDirection: 'horizontal',
};
