// import * as Sentry from "@sentry/node";
// import winston from "winston";
// import { IMonitoring } from "../core/interfaces.js";

// export class Monitoring implements IMonitoring {
//   private logger: winston.Logger;

//   constructor() {
//     if (process.env.SENTRY_DSN) {
//       Sentry.init({
//         dsn: process.env.SENTRY_DSN,
//         environment: process.env.NODE_ENV,
//         tracesSampleRate: 1.0,
//       });
//     }

//     this.logger = winston.createLogger({
//       level: process.env.NODE_ENV === "production" ? "info" : "debug",
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       ),
//       transports: [
//         new winston.transports.File({ filename: "error.log", level: "error" }),
//         new winston.transports.File({ filename: "combined.log" }),
//       ],
//     });

//     if (process.env.NODE_ENV !== "production") {
//       this.logger.add(
//         new winston.transports.Console({
//           format: winston.format.simple(),
//         })
//       );
//     }
//   }

//   logError(error: Error, context: Record<string, any> = {}): void {
//     if (process.env.SENTRY_DSN) {
//       Sentry.captureException(error);
//     }

//     this.logger.error({
//       message: error.message,
//       stack: error.stack,
//       ...context,
//     });
//   }

//   logApiUsage(apiKey: string, cost: number): void {
//     this.logger.info({
//       event: "api_usage",
//       apiKey: apiKey.slice(-4), // Only log last 4 chars for security
//       cost,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";
import { CaptionConfig } from "../core/types";
import { ILogger, IMonitoring } from "../core/interfaces";

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