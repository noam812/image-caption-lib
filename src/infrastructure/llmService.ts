import { ILLMService } from "../core/interfaces.js";
import { CaptionConfig } from "../core/types.js";
import OpenAI from "openai";
import { createCacheService } from "./cache/factory.js";
import { createRateLimiter } from "./rateLimit/factory.js";

export class LLMService implements ILLMService {
  public cacheService: ReturnType<typeof createCacheService>;
  public rateLimiter: ReturnType<typeof createRateLimiter>;

  constructor() {
    this.cacheService = createCacheService();
    this.rateLimiter = createRateLimiter();
  }

  async generateCaption(
    imageUrl: string,
    config: CaptionConfig
  ): Promise<string> {
    const cacheKey = this.cacheService.getCacheKey(imageUrl, config.language);

    // Check if caching is disabled
    if (!config.disableCache) {
      const cachedCaption = this.cacheService.get(cacheKey);
      if (cachedCaption) {
        return cachedCaption; // Return cached caption if available
      }
    }

    // Check rate limit
    await this.rateLimiter.checkRateLimit(cacheKey);

    try {
      const openai = new OpenAI({ apiKey: config.apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Write a concise and descriptive alt text for an image in ${config.language} in context with ${config.context}. Follow these guidelines:
                    Describe the image accurately but avoid starting with phrases like 'image of' or 'picture of.'
                    Match the tone to the content (e.g., relaxed for a spa retreat, adventurous for travel).
                    Keep it concise (under 100 characters if possible) while including meaningful details.
                    Use proper grammar: capitalize the first letter, and end sentences with a period.
                    For decorative images that add no meaningful content, leave the alt text empty (alt="").
                    If the image contains text, include it exactly in the alt text.
                    For interactive or functional images (like links), describe the action (e.g., 'Navigate to home page') instead of the image content.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

      const content = response.choices[0].message.content;
      if (content === null) {
        throw new Error("Generated caption content is null");
      }
      if (!config.disableCache) {
        const cacheTTL = config.cacheDuration || 3600; // Use provided cache duration or default to 1 hour
        this.cacheService.set(cacheKey, content, cacheTTL);
      }
      return content;
    } catch (error: any) {
      throw new Error(`Failed to generate caption: ${error.message}`);
    }
  }
}
