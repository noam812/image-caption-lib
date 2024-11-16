import type { ILogger } from "./interfaces.js";
export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh" | "he" | "it" | "nl" | "pl" | "pt" | "ru" | "ar" | "cs" | "da" | "fi" | "el" | "hi" | "hu" | "id" | "ko" | "no" | "fa" | "ro" | "sv" | "th" | "tr" | "uk" | "vi";

export interface CaptionConfig {
  apiKey: string;
  language: string;
  context: string;
  maxLength: number;
  cacheDuration?: number;
  disableCache?: boolean;
  rateLimitPoints?: number;
  rateLimitDuration?: number;
  monitor?: boolean;
  // New optional logging configuration
  logging?: {
    level?: "error" | "warn" | "info" | "debug";
    customLogger?: ILogger; // Optional custom logger
    outputFile?: string; // Optional path for log file
  };
}
