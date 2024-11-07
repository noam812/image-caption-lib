import { ILogger } from "../../src/core/interfaces";

export class NoopLogger implements ILogger {
  error(message: string, metadata?: any): void {}
  warn(message: string, metadata?: any): void {}
  info(message: string, metadata?: any): void {}
  debug(message: string, metadata?: any): void {}
}
