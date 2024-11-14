import type { CaptionConfig } from "./core/types.js";
import { LLMService } from "./infrastructure/llmService.js";
import { validateConfig } from "./utils/validation.js";

export const generateImageCaption = async (
  imageUrl: string,
  config: CaptionConfig
): Promise<string> => {
  validateConfig(config);
  const llmService = new LLMService();
  return await llmService.generateCaption(imageUrl, config);
};



export type { CaptionConfig, Language } from "./core/types.js";
