import type { ICacheService } from "../../core/interfaces.js";

export class BrowserCacheService implements ICacheService {
  private ttlSeconds: number;

  constructor(ttlSeconds: number = 172800) {
    // 2 days in seconds
    this.ttlSeconds = ttlSeconds;
  }

  getCacheKey(imageUrl: string, language: string): string {
    return `${imageUrl}:${language}`;
  }

  get(key: string): string | undefined {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
      return undefined;
    }

    const { value, expiry } = JSON.parse(cachedItem);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return undefined;
    }

    return value;
  }

  set(key: string, value: string, ttl?: number): void {
    const expiry = Date.now() + (ttl ?? this.ttlSeconds) * 1000;
    const cachedItem = JSON.stringify({ value, expiry });
    localStorage.setItem(key, cachedItem);
  }
}
