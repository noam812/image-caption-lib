import type { CaptionConfig, Language } from '../core/types.js';

export const validateConfig = (config: CaptionConfig): void => {
  if (!config.apiKey) {
    throw new Error("API key is required");
  }

  if (!config.language) {
    throw new Error("Language is required");
  }

  const supportedLanguages: Language[] = ["en", "es", "fr", "de", "ja", "zh"];
  if (!supportedLanguages.includes(config.language as Language)) {
    throw new Error(`Unsupported language: ${config.language}`);
  }

  if (config.maxLength && (config.maxLength < 1 || config.maxLength > 1000)) {
    throw new Error("maxLength must be between 1 and 1000");
  }
};
