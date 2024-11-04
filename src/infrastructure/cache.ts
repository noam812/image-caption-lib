import NodeCache from "node-cache";
import { ICacheService } from "../core/interfaces";

export class CacheService implements ICacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = Number(process.env.CACHE_TTL) || 3600) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds });
  }

  getCacheKey(imageUrl: string, language: string): string {
    return `${imageUrl}:${language}`;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    this.cache.set(key, value);
  }
}
