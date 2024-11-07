import MockOpenAI from "./__mocks__/openai.mock";
import { mockRateLimiter } from "./__mocks__/rateLimit.factory.mock";
import { mockCacheService } from "./__mocks__/cache.factory.mock";
import { LLMService } from "../src/infrastructure/llmService";
import { CaptionConfig } from "../src/core/types";
import { mockCustomLogger } from "./__mocks__/customLogger.mock";
import { createLogger, MockWinstonLogger } from "./__mocks__/winston.mock";

// Mock the factory modules
jest.mock("../src/infrastructure/rateLimit/factory.ts", () => ({
  createRateLimiter: jest.fn().mockReturnValue(mockRateLimiter),
}));

jest.mock("../src/infrastructure/cache/factory.ts", () => ({
  createCacheService: jest.fn().mockReturnValue(mockCacheService),
}));

// Modified OpenAI mock
const mockOpenAIInstance = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
};

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => mockOpenAIInstance);
});

jest.mock("winston", () => ({
  createLogger: () => createLogger(),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

describe("LLMService", () => {
  let llmService: LLMService;
  let mockWinstonLogger: MockWinstonLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    llmService = new LLMService();
    mockOpenAIInstance.chat.completions.create.mockReset();
  });

  const mockConfig: CaptionConfig = {
    apiKey: "test-api-key",
    language: "en",
    context: "test context",
    maxLength: 150,
    disableCache: false,
    cacheDuration: 3600,
    monitor: true,
    logging: {
      level: "info",
      customLogger: mockCustomLogger,
      outputFile: "test.log",
    },
  };

  const mockImageUrl = "https://example.com/image.jpg";
  const mockGeneratedCaption = "A beautiful sunset over mountains";

  describe("generateCaption", () => {
    it("should generate a new caption when cache is empty", async () => {
      mockCacheService.get.mockReturnValue(null);

      const mockResponse = {
        choices: [
          {
            message: {
              content: mockGeneratedCaption,
            },
          },
        ],
      };

      mockOpenAIInstance.chat.completions.create.mockResolvedValueOnce(
        mockResponse
      );

      const result = await llmService.generateCaption(mockImageUrl, mockConfig);

      expect(result).toBe(mockGeneratedCaption);
      expect(mockOpenAIInstance.chat.completions.create).toHaveBeenCalledTimes(
        1
      );
      expect(mockRateLimiter.checkRateLimit).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        mockGeneratedCaption,
        mockConfig.cacheDuration
      );
      //
    });

    it("should return cached caption when available", async () => {
      mockCacheService.get.mockReturnValue(mockGeneratedCaption);

      const result = await llmService.generateCaption(mockImageUrl, mockConfig);

      expect(result).toBe(mockGeneratedCaption);
      expect(mockOpenAIInstance.chat.completions.create).not.toHaveBeenCalled();
      expect(mockRateLimiter.checkRateLimit).not.toHaveBeenCalled();
    });

    it("should bypass cache when disableCache is true", async () => {
      const configWithDisabledCache = { ...mockConfig, disableCache: true };
      mockCacheService.get.mockReturnValue("cached caption");

      const mockResponse = {
        choices: [
          {
            message: {
              content: mockGeneratedCaption,
            },
          },
        ],
      };

      mockOpenAIInstance.chat.completions.create.mockResolvedValueOnce(
        mockResponse
      );

      const result = await llmService.generateCaption(
        mockImageUrl,
        configWithDisabledCache
      );

      expect(result).toBe(mockGeneratedCaption);
      expect(mockOpenAIInstance.chat.completions.create).toHaveBeenCalledTimes(
        1
      );
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it("should handle OpenAI API errors", async () => {
      mockCacheService.get.mockReturnValue(null);

      mockOpenAIInstance.chat.completions.create.mockRejectedValueOnce(
        new Error("API Error")
      );

      await expect(
        llmService.generateCaption(mockImageUrl, mockConfig)
      ).rejects.toThrow("Failed to generate caption: API Error");
    });

    it("should respect rate limits", async () => {
      mockCacheService.get.mockReturnValue(null);
      mockRateLimiter.checkRateLimit.mockRejectedValueOnce(
        new Error("Rate limit exceeded")
      );

      await expect(
        llmService.generateCaption(mockImageUrl, mockConfig)
      ).rejects.toThrow("Rate limit exceeded");
    });
  });
});
