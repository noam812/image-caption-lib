import type { ICacheService } from "../../core/interfaces.js";
import { BrowserCacheService } from "./browserCache.js";
import { CacheService } from "./cache.js";

export function createCacheService(): ICacheService {
  if (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  ) {
    return new BrowserCacheService();
  } else {
    return CacheService.getInstance();
  }
}
