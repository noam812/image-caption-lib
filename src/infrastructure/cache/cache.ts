// src/infrastructure/cache/cache.ts

import NodeCache from "node-cache";
import type { ICacheService } from "../../core/interfaces.js";

export class CacheService implements ICacheService {
  private static instance: CacheService;
  private cache: NodeCache;

  private constructor(
    ttlSeconds: number = Number(process.env.CACHE_TTL) || 3600
  ) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds });
  }

  // Singleton pattern - get the single instance of CacheService
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  getCacheKey(imageUrl: string, language: string): string {
    return `${imageUrl}:${language}`;
  }

  get(key: string): string | undefined {
    const value = this.cache.get<string>(key);
    console.log(`Cache get: key=${key}, value=${value}`);
    return value;
  }

  set(key: string, value: string, ttl?: number): void {
    this.cache.set(key, value, ttl ?? 0);
    console.log(`Cache set: key=${key}, value=${value}, ttl=${ttl}`);
  }
}
