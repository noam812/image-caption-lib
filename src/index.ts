import type { CaptionConfig } from "./core/types.js";
import { LLMService } from "./infrastructure/llmService.js";
import { validateConfig } from "./utils/validation.js";

// Create an instance of the LLMService
const llmService = new LLMService();

/**
 * Generate image caption using the OpenAI Language Model API.
 * @param imageUrl - The URL of the image for which to generate a caption.
 * @param config - Configuration object for generating the caption.
 * @returns The generated image caption.
 */
export const generateImageCaption = async (
  imageUrl: string,
  config: CaptionConfig
): Promise<string> => {
  validateConfig(config);
  return await llmService.generateCaption(imageUrl, config);
};

export type { CaptionConfig, Language } from "./core/types.js";
