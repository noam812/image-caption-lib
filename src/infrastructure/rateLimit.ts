import { RateLimiterMemory } from "rate-limiter-flexible";
import { IRateLimiter } from "../core/interfaces";

export class RateLimiter implements IRateLimiter {
  private limiter: RateLimiterMemory;

  constructor() {
    this.limiter = new RateLimiterMemory({
      points: Number(process.env.RATE_LIMIT_POINTS) || 10,
      duration: Number(process.env.RATE_LIMIT_DURATION) || 1,
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
