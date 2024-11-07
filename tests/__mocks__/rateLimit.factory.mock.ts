export const mockRateLimiter = {
  checkRateLimit: jest.fn().mockResolvedValue(undefined),
};

export const createRateLimiter = jest.fn().mockReturnValue(mockRateLimiter);

