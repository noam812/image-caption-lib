import { ILogger } from "../../src/core/interfaces";

export const mockCustomLogger: ILogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
