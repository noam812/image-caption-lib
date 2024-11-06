// import { BrowserRateLimiter } from "../src/infrastructure/rateLimit/browserRateLimit";

// describe("BrowserRateLimiter", () => {
//   it("should allow requests within the rate limit", async () => {
//     const rateLimiter = new BrowserRateLimiter(5, 1); // 5 requests per second
//     const key = "test-key";

//     for (let i = 0; i < 5; i++) {
//       await expect(rateLimiter.checkRateLimit(key)).resolves.not.toThrow();
//     }
//   });

//   it("should throw an error if rate limit is exceeded", async () => {
//     const rateLimiter = new BrowserRateLimiter(5, 1); // 5 requests per second
//     const key = "test-key";

//     for (let i = 0; i < 5; i++) {
//       await rateLimiter.checkRateLimit(key);
//     }

//     await expect(rateLimiter.checkRateLimit(key)).rejects.toThrow(
//       "Rate limit exceeded"
//     );
//   });
// });

import { BrowserRateLimiter } from "../src/infrastructure/rateLimit/browserRateLimit";
import { MockLocalStorage } from "./__mocks__/localStorage.mock";

describe("BrowserRateLimiter", () => {
  let rateLimiter: BrowserRateLimiter;
  let mockStorage: MockLocalStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });
    rateLimiter = new BrowserRateLimiter(5, 1); // 5 requests per second
  });

  it("should allow requests within the rate limit", async () => {
    const key = "test-key";

    for (let i = 0; i < 5; i++) {
      await expect(rateLimiter.checkRateLimit(key)).resolves.not.toThrow();
    }
  });

  it("should throw error when rate limit is exceeded", async () => {
    const key = "test-key";

    for (let i = 0; i < 5; i++) {
      await rateLimiter.checkRateLimit(key);
    }

    await expect(rateLimiter.checkRateLimit(key)).rejects.toThrow(
      "Rate limit exceeded"
    );
  });

  it("should reset rate limit after duration expires", async () => {
    const key = "test-key";

    for (let i = 0; i < 5; i++) {
      await rateLimiter.checkRateLimit(key);
    }

    const rateLimitKey = `rate-limit:${key}`;
    const currentEntry = JSON.parse(mockStorage.getItem(rateLimitKey)!);
    const expiredEntry = {
      ...currentEntry,
      expiry: Date.now() - 1000,
    };
    mockStorage.setItem(rateLimitKey, JSON.stringify(expiredEntry));

    await expect(rateLimiter.checkRateLimit(key)).resolves.not.toThrow();
  });
});
