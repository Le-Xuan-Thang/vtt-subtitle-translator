// VTT file parsing types
export interface VTTSubtitle {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface VTTFile {
  name: string;
  content: string;
  subtitles: VTTSubtitle[];
  detectedLanguage?: string;
}

// Translation types
export interface TranslationSettings {
  sourceLanguage: string;
  targetLanguage: string;
  autoDetect: boolean;
}

// LLM Configuration types
export interface LLMProvider {
  id: string;
  name: string;
  apiKeyRequired: boolean;
}

export interface LLMConfig {
  provider: string;
  apiKey: string;
  model: string;
  translationStyle: string;
  customRequirements?: string;
}

// Translation styles
export const TRANSLATION_STYLES = {
  formal: 'Formal and professional translation',
  casual: 'Casual and conversational translation',
  literal: 'Literal word-for-word translation',
  natural: 'Natural and fluent translation',
  subtitle: 'Optimized for subtitle display (concise, clear)',
  educational: 'Educational and technical translation',
  custom: 'Custom requirements (specify below)',
} as const;

export type TranslationStyle = keyof typeof TRANSLATION_STYLES;
