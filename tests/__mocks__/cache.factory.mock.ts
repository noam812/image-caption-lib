export const mockCacheService = {
  getCacheKey: jest.fn(
    (imageUrl: string, language: string) => `${imageUrl}-${language}`
  ),
  get: jest.fn(),
  set: jest.fn(),
};

export const createCacheService = jest.fn().mockReturnValue(mockCacheService);
