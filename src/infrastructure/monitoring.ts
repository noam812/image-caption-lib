import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import type { CaptionConfig } from '../core/types.js';
import type { ILogger, IMonitoring } from "../core/interfaces.js";

// No-Operation Logger Implementation
class NoopLogger implements ILogger {
  error(message: string, metadata?: any): void {}
  warn(message: string, metadata?: any): void {}
  info(message: string, metadata?: any): void {}
  debug(message: string, metadata?: any): void {}
}

export class CaptionMonitor implements IMonitoring {
  private logger: ILogger;
  private enabled: boolean;

  constructor(config: CaptionConfig) {
    this.enabled = config.monitor ?? false;

    if (this.enabled) {
      const logConfig = config.logging ?? {};

      if (logConfig.customLogger) {
        // Use custom logger if provided
        this.logger = logConfig.customLogger;
      } else {
        // Create and configure the default winston logger
        const defaultLogger: WinstonLogger = createLogger({
          level: logConfig.level ?? "info",
          format: format.combine(format.timestamp(), format.json()),
          transports: [], // Start with no transports
        });

        // Add console transport by default in development
        if (process.env.NODE_ENV === "development") {
          defaultLogger.add(
            new transports.Console({
              format: format.combine(format.colorize(), format.simple()),
            })
          );
        }

        // Add file transport if path provided
        if (logConfig.outputFile) {
          defaultLogger.add(
            new transports.File({
              filename: logConfig.outputFile,
            })
          );
        }

        // Assign the configured winston logger to the ILogger interface
        this.logger = defaultLogger as unknown as ILogger;
      }
    } else {
      // Assign NoopLogger when monitoring is disabled
      this.logger = new NoopLogger();
    }
  }

  error(message: string, metadata?: any): void {
    this.logger.error(message, metadata);
  }

  warn(message: string, metadata?: any): void {
    this.logger.warn(message, metadata);
  }

  info(message: string, metadata?: any): void {
    this.logger.info(message, metadata);
  }

  debug(message: string, metadata?: any): void {
    this.logger.debug(message, metadata);
  }

  // Additional monitoring methods
  logError(error: Error, context?: Record<string, any>): void {
    this.logger.error(error.message, context);
  }

  logApiUsage(apiKey: string, cost: number): void {
    // Masking the API key for security (show only last 4 characters)
    const maskedApiKey = apiKey.slice(-4);
    this.logger.info(`API Key: ***${maskedApiKey}`, {
      cost,
      timestamp: new Date().toISOString(),
    });
  }
}
