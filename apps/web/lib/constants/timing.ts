/**
 * Timing Constants
 * Centralized timing values for consistent UX across the app
 */

/**
 * Toast notification durations (in milliseconds)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
  ERROR: 6000, // Errors stay visible longer
} as const

/**
 * Animation and transition durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  DEFAULT: 200,
  SLOW: 300,
} as const

/**
 * Debounce and throttle delays (in milliseconds)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  RESIZE: 150,
  INPUT: 500,
} as const

/**
 * Bulk operation delays (in milliseconds)
 */
export const BULK_OPERATION = {
  /**
   * Delay between opening tabs to avoid popup blocker
   * Browser popup blockers typically allow rapid clicks within ~1 second
   */
  TAB_OPEN_DELAY: 300,

  /**
   * Maximum tabs to open at once
   */
  MAX_TABS: 20,
} as const

/**
 * Auto-save and sync intervals (in milliseconds)
 */
export const SYNC_INTERVAL = {
  AUTO_SAVE: 2000,
  BACKGROUND_SYNC: 30000, // 30 seconds
  POLL_UPDATES: 60000, // 1 minute
} as const

/**
 * Timeout values (in milliseconds)
 */
export const TIMEOUT = {
  API_REQUEST: 10000, // 10 seconds
  DATABASE_QUERY: 5000, // 5 seconds
  MUTATION: 8000, // 8 seconds
} as const
