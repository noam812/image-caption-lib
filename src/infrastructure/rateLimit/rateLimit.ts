// src/infrastructure/rateLimit/rateLimit.ts

import { RateLimiterMemory } from "rate-limiter-flexible";
import type { IRateLimiter } from "../../core/interfaces.js";

export class RateLimiter implements IRateLimiter {
  private static instance: RateLimiter;
  private limiter: RateLimiterMemory;

  private constructor(
    rateLimitPoints: number = 10,
    rateLimitDuration: number = 1
  ) {
    this.limiter = new RateLimiterMemory({
      points: rateLimitPoints,
      duration: rateLimitDuration,
    });
  }

  // Singleton pattern - get the single instance of RateLimiter
  public static getInstance(
    rateLimitPoints: number,
    rateLimitDuration: number
  ): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter(
        rateLimitPoints,
        rateLimitDuration
      );
    }
    return RateLimiter.instance;
  }

  async checkRateLimit(key: string): Promise<void> {
    try {
      await this.limiter.consume(key);
      console.log(`Rate limit consumed for key: ${key}`);
    } catch (error) {
      console.error(`Rate limit exceeded for key: ${key}`);
      throw new Error("Rate limit exceeded");
    }
  }
}
