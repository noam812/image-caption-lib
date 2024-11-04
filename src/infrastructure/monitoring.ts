import * as Sentry from "@sentry/node";
import winston from "winston";
import { IMonitoring } from "../core/interfaces";

export class Monitoring implements IMonitoring {
  private logger: winston.Logger;

  constructor() {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
      });
    }

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  logError(error: Error, context: Record<string, any> = {}): void {
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error);
    }

    this.logger.error({
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  logApiUsage(apiKey: string, cost: number): void {
    this.logger.info({
      event: "api_usage",
      apiKey: apiKey.slice(-4), // Only log last 4 chars for security
      cost,
      timestamp: new Date().toISOString(),
    });
  }
}
