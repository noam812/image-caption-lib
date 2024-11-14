import type { CaptionConfig } from "./types.js";

export interface ILLMService {
  generateCaption(imageUrl: string, config: CaptionConfig): Promise<string>;
}

export interface ICacheService {
  get(key: string): string | undefined;
  set(key: string, value: string, ttl?: number): void;
  getCacheKey(imageUrl: string, language: string): string;
}

export interface IRateLimiter {
  checkRateLimit(key: string): Promise<void>;
}

export interface ILogger {
  error(message: string, metadata?: any): void;
  warn(message: string, metadata?: any): void;
  info(message: string, metadata?: any): void;
  debug(message: string, metadata?: any): void;
}

export interface IMonitoring {
  error(message: string, metadata?: any): void;
  warn(message: string, metadata?: any): void;
  info(message: string, metadata?: any): void;
  debug(message: string, metadata?: any): void;
  logError(error: Error, context?: Record<string, any>): void;
  logApiUsage(apiKey: string, cost: number): void;
}