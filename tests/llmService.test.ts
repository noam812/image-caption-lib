import { LLMService } from "../src/infrastructure/llmService";
import { CaptionConfig } from "../src/core/types";

describe("LLMService", () => {
  let llmService: LLMService;

  beforeEach(() => {
    process.env.SENTRY_DSN = "test-dsn";
    llmService = new LLMService();
  });

  describe("generateCaption", () => {
    const mockConfig: CaptionConfig = {
      apiKey: "test-api-key",
      language: "en",
      context: "test context",
    };

    it("should generate caption successfully", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "Test caption" } }],
            usage: { total_tokens: 10 },
          }),
      });

      const result = await llmService.generateCaption(
        "test-image.jpg",
        mockConfig
      );
      expect(result).toBe("Test caption");
    });

    it("should use cache for repeated requests", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "Cached caption" } }],
            usage: { total_tokens: 10 },
          }),
      });

      await llmService.generateCaption("test-image.jpg", mockConfig);
      const result = await llmService.generateCaption(
        "test-image.jpg",
        mockConfig
      );

      expect(result).toBe("Cached caption");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect rate limits", async () => {
      const promises = Array(15)
        .fill(null)
        .map(() => llmService.generateCaption("test-image.jpg", mockConfig));

      await expect(Promise.all(promises)).rejects.toThrow(
        "Rate limit exceeded"
      );
    });

    it("should handle API errors", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

      await expect(
        llmService.generateCaption("test-image.jpg", mockConfig)
      ).rejects.toThrow("Failed to generate caption: API Error");
    });
  });
});
