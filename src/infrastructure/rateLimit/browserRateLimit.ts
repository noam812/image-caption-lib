import { IRateLimiter } from "../../core/interfaces.js";

interface RateLimitEntry {
  points: number;
  expiry: number;
}

export class BrowserRateLimiter implements IRateLimiter {
  private rateLimitPoints: number;
  private rateLimitDuration: number;

  constructor(rateLimitPoints: number = 10, rateLimitDuration: number = 1) {
    this.rateLimitPoints = rateLimitPoints;
    this.rateLimitDuration = rateLimitDuration * 1000; // Convert to milliseconds
  }

  private getRateLimitKey(key: string): string {
    return `rate-limit:${key}`;
  }

  async checkRateLimit(key: string): Promise<void> {
    const rateLimitKey = this.getRateLimitKey(key);
    const rateLimitEntry = localStorage.getItem(rateLimitKey);
    const now = Date.now();

    if (rateLimitEntry) {
      const { points, expiry } = JSON.parse(rateLimitEntry) as RateLimitEntry;

      if (now > expiry) {
        // Reset the rate limit entry if it has expired
        localStorage.setItem(
          rateLimitKey,
          JSON.stringify({
            points: this.rateLimitPoints - 1,
            expiry: now + this.rateLimitDuration,
          })
        );
      } else if (points > 0) {
        // Decrement the points if within the rate limit duration
        localStorage.setItem(
          rateLimitKey,
          JSON.stringify({ points: points - 1, expiry })
        );
      } else {
        // Throw an error if rate limit is exceeded
        throw new Error("Rate limit exceeded");
      }
    } else {
      // Create a new rate limit entry if it doesn't exist
      localStorage.setItem(
        rateLimitKey,
        JSON.stringify({
          points: this.rateLimitPoints - 1,
          expiry: now + this.rateLimitDuration,
        })
      );
    }
  }
}
