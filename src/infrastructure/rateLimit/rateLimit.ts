import { RateLimiterMemory } from "rate-limiter-flexible";
import { IRateLimiter } from "../../core/interfaces.js";

export class RateLimiter implements IRateLimiter {
  private limiter: RateLimiterMemory;

  constructor(rateLimitPoints: number = 10, rateLimitDuration: number = 1) {
    this.limiter = new RateLimiterMemory({
      points: rateLimitPoints,
      duration: rateLimitDuration,
    });
  }

  async checkRateLimit(key: string): Promise<void> {
    try {
      await this.limiter.consume(key);
    } catch (error) {
      throw new Error("Rate limit exceeded");
    }
  }
}
