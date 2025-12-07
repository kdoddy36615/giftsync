/**
 * Structured Logger Utility
 * Provides environment-aware logging with support for monitoring integration
 *
 * In development: Logs to console for debugging
 * In production: Ready for integration with monitoring services (Sentry, LogRocket, etc.)
 */

interface LogContext {
  [key: string]: unknown
}

/**
 * Log an error with context
 * @param message - User-friendly error description
 * @param error - The error object or details
 * @param context - Additional context for debugging
 */
function logError(message: string, error?: unknown, context?: LogContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, error, context)
  } else {
    // In production, log to console for now
    // TODO: Integrate with monitoring service (Sentry, LogRocket)
    console.error(`[ERROR] ${message}`, { error, context })
  }
}

/**
 * Log a warning
 * @param message - Warning message
 * @param context - Additional context
 */
function logWarn(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[WARN] ${message}`, context)
  } else {
    console.warn(`[WARN] ${message}`, context)
  }
}

/**
 * Log informational message (development only)
 * @param message - Info message
 * @param context - Additional context
 */
function logInfo(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[INFO] ${message}`, context)
  }
  // Don't log info in production to reduce noise
}

/**
 * Log a security event (always logged)
 * @param message - Security event description
 * @param context - Event details
 */
function logSecurity(message: string, context: LogContext): void {
  const timestamp = new Date().toISOString()
  console.warn(`[SECURITY] ${timestamp} - ${message}`, context)

  // TODO: Send to security monitoring service
  // In production, you might want to send to a separate security log aggregator
}

export const logger = {
  error: logError,
  warn: logWarn,
  info: logInfo,
  security: logSecurity,
}

/**
 * Create a logger instance with a consistent context prefix
 * Useful for adding context like "Server Action: createList"
 */
export function createLogger(prefix: string) {
  return {
    error: (message: string, error?: unknown, context?: LogContext) =>
      logError(`${prefix}: ${message}`, error, context),
    warn: (message: string, context?: LogContext) =>
      logWarn(`${prefix}: ${message}`, context),
    info: (message: string, context?: LogContext) =>
      logInfo(`${prefix}: ${message}`, context),
    security: (message: string, context: LogContext) =>
      logSecurity(`${prefix}: ${message}`, context),
  }
}
