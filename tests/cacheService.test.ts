// import { BrowserCacheService } from "../src/infrastructure/cache/browserCache";

// describe("BrowserCacheService", () => {
//   it("should cache and retrieve a value", () => {
//     const cacheService = new BrowserCacheService();
//     const key = cacheService.getCacheKey("https://example.com/image.jpg", "en");
//     cacheService.set(key, "Cached value");

//     const cachedValue = cacheService.get(key);
//     expect(cachedValue).toBe("Cached value");
//   });

//   it("should remove expired cache entries", () => {
//     const cacheService = new BrowserCacheService(1); // 1 second TTL
//     const key = cacheService.getCacheKey("https://example.com/image.jpg", "en");
//     cacheService.set(key, "Cached value");

//     // Wait for 2 seconds to ensure the cache entry expires
//     return new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
//       const cachedValue = cacheService.get(key);
//       expect(cachedValue).toBeUndefined();
//     });
//   });
// });
import { BrowserCacheService } from "../src/infrastructure/cache/browserCache";
import { MockLocalStorage } from "./__mocks__/localStorage.mock";

describe("BrowserCacheService", () => {
  let cacheService: BrowserCacheService;
  let mockStorage: MockLocalStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });
    cacheService = new BrowserCacheService();
  });

  it("should cache and retrieve a value", () => {
    const key = "test-key";
    const value = "test-value";

    cacheService.set(key, value);
    expect(cacheService.get(key)).toBe(value);
  });

  it("should respect TTL", () => {
    const key = "test-key";
    const value = "test-value";
    const shortTTL = 1;

    cacheService.set(key, value, shortTTL);

    const cachedItem = JSON.parse(mockStorage.getItem(key)!);
    const expiredItem = {
      ...cachedItem,
      expiry: Date.now() - 1000,
    };
    mockStorage.setItem(key, JSON.stringify(expiredItem));

    expect(cacheService.get(key)).toBeUndefined();
  });
});
