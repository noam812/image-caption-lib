import { ILogger } from "./interfaces";

export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

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

