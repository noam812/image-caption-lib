export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

export interface CaptionConfig {
  apiKey: string;
  language: string;
  context: string;
  maxLength: number;
  cacheDuration?: number; // Optional custom cache duration (in seconds)
  disableCache?: boolean; // Optional flag to disable caching for a request
  rateLimitPoints?: number; // Optional rate limit per minute
  rateLimitDuration?: number; // Optional rate limit duration in seconds
  monitor?: boolean; // Optional flag to enable monitoring
}


export type ApiResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
};
