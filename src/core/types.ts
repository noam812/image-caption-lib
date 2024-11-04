export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

export type CaptionConfig = {
  apiKey: string;
  language: Language;
  context?: string;
  maxLength?: number;
};

export type ApiResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
};
