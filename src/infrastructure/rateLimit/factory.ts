import type { IRateLimiter } from "../../core/interfaces.js";
import { BrowserRateLimiter } from "./browserRateLimit.js";
import { RateLimiter } from "./rateLimit.js";

export function createRateLimiter(

): IRateLimiter {
  if (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  ) {
    return new BrowserRateLimiter();
  } else {
    return RateLimiter.getInstance(rateLimitPoints, rateLimitDuration);
  }
}
