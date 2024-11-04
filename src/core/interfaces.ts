import { CaptionConfig } from "./types";

export interface ILLMService {
  generateCaption(imageUrl: string, config: CaptionConfig): Promise<string>;
}

export interface ICacheService {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  getCacheKey(imageUrl: string, language: string): string;
}

export interface IRateLimiter {
  checkRateLimit(key: string): Promise<void>;
}

export interface IMonitoring {
  logError(error: Error, context?: Record<string, any>): void;
  logApiUsage(apiKey: string, cost: number): void;
}
