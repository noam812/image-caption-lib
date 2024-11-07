import { ILogger } from "../../src/core/interfaces";

export class MockWinstonLogger implements ILogger {
  error = jest.fn();
  warn = jest.fn();
  info = jest.fn();
  debug = jest.fn();

  // Mock the 'add' method used during logger configuration
  add = jest.fn();

  // If your application uses other methods like 'close', mock them as needed
  close = jest.fn();
  // Add other mocked methods if your code interacts with them
}

export const createLogger = jest.fn(() => new MockWinstonLogger());
