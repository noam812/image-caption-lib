// import { LLMService } from "../src/infrastructure/llmService";
// import { CaptionConfig } from "../src/core/types";
// import { CacheService } from "../src/infrastructure/cache";
// import { RateLimiter } from "../src/infrastructure/rateLimit";

// describe("LLMService", () => {
//   let llmService: LLMService;
//   let mockCacheService: CacheService;
//   let mockRateLimiter: RateLimiter;

//   beforeEach(() => {
//     process.env.SENTRY_DSN = "test-dsn";
//     mockCacheService = new CacheService();
//     mockRateLimiter = new RateLimiter();
//     llmService = new LLMService();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   const mockConfig: CaptionConfig = {
//     apiKey: "test-api-key",
//     language: "en",
//     context: "fashion e-commerce product",
//     maxLength: 150,
//   };

//   describe("generateCaption", () => {
//     it("should generate caption successfully and store it in cache by default", async () => {
//       const cacheKey = mockCacheService.getCacheKey(
//         "test-image.jpg",
//         mockConfig.language
//       );

//       // Mock fetch response
//       global.fetch = jest.fn().mockResolvedValue({
//         json: () =>
//           Promise.resolve({
//             choices: [{ message: { content: "Test caption" } }],
//             usage: { total_tokens: 10 },
//           }),
//       });

//       const result = await llmService.generateCaption(
//         "test-image.jpg",
//         mockConfig
//       );
//       expect(result).toBe("Test caption");
//       expect(mockCacheService.get(cacheKey)).toBe("Test caption"); // Ensure it's cached
//     });

//     it("should retrieve caption from cache if available", async () => {
//       const cacheKey = mockCacheService.getCacheKey(
//         "test-image.jpg",
//         mockConfig.language
//       );
//       mockCacheService.set(cacheKey, "Cached caption", 60); // Cache for 60 seconds

//       const result = await llmService.generateCaption(
//         "test-image.jpg",
//         mockConfig
//       );
//       expect(result).toBe("Cached caption");
//       expect(global.fetch).not.toHaveBeenCalled(); // Ensure no API request was made
//     });

//     it("should respect custom cache duration", async () => {
//       const customConfig = { ...mockConfig, cacheDuration: 5 }; // Cache for 5 seconds
//       const cacheKey = mockCacheService.getCacheKey(
//         "test-image.jpg",
//         customConfig.language
//       );

//       global.fetch = jest.fn().mockResolvedValue({
//         json: () =>
//           Promise.resolve({
//             choices: [{ message: { content: "Short cache caption" } }],
//           }),
//       });

//       const result1 = await llmService.generateCaption(
//         "test-image.jpg",
//         customConfig
//       );
//       expect(result1).toBe("Short cache caption");

//       // Wait 6 seconds to exceed cache duration
//       await new Promise((resolve) => setTimeout(resolve, 6000));
//       const result2 = await llmService.generateCaption(
//         "test-image.jpg",
//         customConfig
//       );

//       expect(result2).toBe("Short cache caption"); // Fetch is called again since cache expired
//       expect(global.fetch).toHaveBeenCalledTimes(2); // Fetch is called twice
//     });

//     it("should skip caching if disableCache is true", async () => {
//       const noCacheConfig = { ...mockConfig, disableCache: true };

//       global.fetch = jest.fn().mockResolvedValue({
//         json: () =>
//           Promise.resolve({
//             choices: [{ message: { content: "No cache caption" } }],
//           }),
//       });

//       const result1 = await llmService.generateCaption(
//         "test-image.jpg",
//         noCacheConfig
//       );
//       const result2 = await llmService.generateCaption(
//         "test-image.jpg",
//         noCacheConfig
//       );

//       expect(result1).toBe("No cache caption");
//       expect(result2).toBe("No cache caption");
//       expect(global.fetch).toHaveBeenCalledTimes(2); // Fetch is called twice because caching is disabled
//     });

//     it("should respect rate limits and throw an error if exceeded", async () => {
//       mockRateLimiter.checkRateLimit = jest
//         .fn()
//         .mockRejectedValue(new Error("Rate limit exceeded"));

//       await expect(
//         llmService.generateCaption("test-image.jpg", mockConfig)
//       ).rejects.toThrow("Rate limit exceeded");
//       expect(mockRateLimiter.checkRateLimit).toHaveBeenCalled(); // Ensure rate limiting was checked
//     });

//     it("should handle API errors gracefully", async () => {
//       global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

//       await expect(
//         llmService.generateCaption("test-image.jpg", mockConfig)
//       ).rejects.toThrow("Failed to generate caption: API Error");
//     });
//   });
// });

// import { CaptionConfig } from "../src/core/types.js";
// import {LLMService} from "../src/infrastructure/llmService.js";

// describe("LLMService", () => {
//   it("should generate a caption for the given image", async () => {
//     const llmService = new LLMService();
//     const caption = await llmService.generateCaption(
//       "https://static.nextdirect.com/resource/blob/693452/4d45ec0cc52cf2d5b61b6f16a62f7f08/tops-t-shirts-data.jpg",
//       {
//         apiKey:
//           "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",
//         language: "en",
//         context: "fashion e commerce product",
//         maxLength: 150,
//       }
//     );
//     console.log(caption);
//     expect(caption).toBeDefined();
//   });

//   it("should return cached caption if available", async () => {
//     const llmService = new LLMService();
//     const cacheKey = llmService.cacheService.getCacheKey(
//       "https://static.nextdirect.com/resource/blob/693452/4d45ec0cc52cf2d5b61b6f16a62f7f08/tops-t-shirts-data.jpg",
//       "en"
//     );
//     llmService.cacheService.set(cacheKey, "Cached caption");

//     const caption = await llmService.generateCaption(
//       "https://static.nextdirect.com/resource/blob/693452/4d45ec0cc52cf2d5b61b6f16a62f7f08/tops-t-shirts-data.jpg",
//       {
//         apiKey:
//           "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",
//         language: "en",
//         context: "fashion e commerce product",
//         maxLength: 150,
//       }
//     );

//     expect(caption).toBe("Cached caption");
//   });

//   it("should throw an error if rate limit is exceeded", async () => {
//     const llmService = new LLMService();
//     const cacheKey = llmService.cacheService.getCacheKey(
//       "https://static.nextdirect.com/resource/blob/693452/4d45ec0cc52cf2d5b61b6f16a62f7f08/tops-t-shirts-data.jpg",
//       "en"
//     );

//     // Simulate rate limit exceeded
//     for (let i = 0; i < 10; i++) {
//       await llmService.rateLimiter.checkRateLimit(cacheKey);
//     }

//     await expect(
//       llmService.generateCaption(
//         "https://static.nextdirect.com/resource/blob/693452/4d45ec0cc52cf2d5b61b6f16a62f7f08/tops-t-shirts-data.jpg",
//         {
//           apiKey:
//             "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",
//           language: "en",
//           context: "fashion e commerce product",
//           maxLength: 150,
//         }
//       )
//     ).rejects.toThrow("Rate limit exceeded");
//   });
// });

import { LLMService } from "../src/infrastructure/llmService";
import { CaptionConfig } from "../src/core/types";
import MockOpenAI from "./__mocks__/openai.mock";
import {MockLocalStorage} from "./__mocks__/localStorage.mock";

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => new MockOpenAI());
});

describe("LLMService", () => {
  let llmService: LLMService;
  let mockOpenAI: jest.Mock;

  beforeEach(() => {
    // Setup localStorage mock
    global.localStorage = new MockLocalStorage();

    // Reset OpenAI mock
    mockOpenAI = require("openai");
    mockOpenAI.mockClear();

    llmService = new LLMService();
  });

  const mockConfig: CaptionConfig = {
    apiKey: "test-api-key",
    language: "en",
    context: "test context", 
    maxLength: 150,
    disableCache: false,
    cacheDuration: 3600,
  };

  const mockImageUrl = "https://example.com/image.jpg";
  const mockGeneratedCaption = "A beautiful sunset over mountains";

  describe("generateCaption", () => {
    it("should generate a new caption when cache is empty", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: mockGeneratedCaption,
            },
          },
        ],
      };

      const openaiInstance = new MockOpenAI();
      openaiInstance.chat.completions.create.mockResolvedValueOnce(
        mockResponse
      );
      mockOpenAI.mockImplementation(() => openaiInstance);

      const result = await llmService.generateCaption(mockImageUrl, mockConfig);

      expect(result).toBe(mockGeneratedCaption);
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledTimes(1);
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4o-mini",
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "user",
              content: expect.arrayContaining([
                expect.objectContaining({
                  type: "text",
                  text: expect.stringContaining(mockConfig.language),
                }),
                expect.objectContaining({
                  type: "image_url",
                  image_url: { url: mockImageUrl },
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it("should return cached caption when available", async () => {
      const cacheKey = llmService.cacheService.getCacheKey(
        mockImageUrl,
        mockConfig.language
      );
      llmService.cacheService.set(cacheKey, mockGeneratedCaption);

      const result = await llmService.generateCaption(mockImageUrl, mockConfig);

      expect(result).toBe(mockGeneratedCaption);
      expect(mockOpenAI).not.toHaveBeenCalled();
    });

    it("should bypass cache when disableCache is true", async () => {
      const configWithDisabledCache = { ...mockConfig, disableCache: true };
      const mockResponse = {
        choices: [
          {
            message: {
              content: mockGeneratedCaption,
            },
          },
        ],
      };

      const openaiInstance = new MockOpenAI();
      openaiInstance.chat.completions.create.mockResolvedValueOnce(
        mockResponse
      );
      mockOpenAI.mockImplementation(() => openaiInstance);

      const cacheKey = llmService.cacheService.getCacheKey(
        mockImageUrl,
        configWithDisabledCache.language
      );
      llmService.cacheService.set(cacheKey, "cached caption");

      const result = await llmService.generateCaption(
        mockImageUrl,
        configWithDisabledCache
      );

      expect(result).toBe(mockGeneratedCaption);
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it("should handle OpenAI API errors", async () => {
      const openaiInstance = new MockOpenAI();
      openaiInstance.chat.completions.create.mockRejectedValueOnce(
        new Error("API Error")
      );
      mockOpenAI.mockImplementation(() => openaiInstance);

      await expect(
        llmService.generateCaption(mockImageUrl, mockConfig)
      ).rejects.toThrow("Failed to generate caption: API Error");
    });

    it("should respect rate limits", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: mockGeneratedCaption,
            },
          },
        ],
      };

      const openaiInstance = new MockOpenAI();
      openaiInstance.chat.completions.create.mockResolvedValue(mockResponse);
      mockOpenAI.mockImplementation(() => openaiInstance);

      // Make multiple requests
      const requests = Array(15)
        .fill(null)
        .map(() => llmService.generateCaption(mockImageUrl, mockConfig));

      await expect(Promise.all(requests)).rejects.toThrow(
        "Rate limit exceeded"
      );
    });
  });
});
