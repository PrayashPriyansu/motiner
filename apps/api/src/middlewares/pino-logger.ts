import env from 'api/env'
import { pinoLogger } from 'hono-pino'
import { pino } from 'pino'
import pretty from 'pino-pretty'

/**
 * A middleware that sets up Pino logging for your Hono app.
 * It uses `hono-pino` to integrate structured logging and attaches the logger to `c.var.logger`.
 */
export function customLogger() {
  return pinoLogger({
    // Create a Pino logger instance.
    pino: pino(
      {
        // Sets the log level from environment variable or defaults to 'info'.
        // Common levels: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'.
        level: env.LOG_LEVEL || 'info',
      },
      // In development, use `pino-pretty` for human-readable logs.
      // In production, skip the pretty printer for better performance and structured logs.
      env.NODE_ENV === 'production' ? undefined : pretty(),
    ),
    http: {
      // Generates a unique request ID for each request, useful for tracing logs per request.
      reqId: () => crypto.randomUUID(),
    },
  })
}

// Set the minimum log level to capture.
// Possible values (in increasing verbosity):
// 'fatal' (60) – Critical errors causing shutdown
// 'error' (50) – Unexpected runtime errors
// 'warn'  (40) – Important but non-critical issues
// 'info'  (30) – General logs (e.g. startup, requests) – good default for production
// 'debug' (20) – Detailed logs for debugging during development
// 'trace' (10) – Very fine-grained logs
// Logs below this level will be ignored.
