/**
 * Color Constants
 * Centralized color palette for the GiftSync dark theme
 * All colors should reference these constants for consistency
 */

/**
 * Core color palette
 * These are the exact hex values used throughout the app
 */
export const COLORS = {
  // Background colors
  BACKGROUND: '#0f0f0f',
  CARD: '#141414',
  CARD_HOVER: '#1a1a1a',

  // Border colors
  BORDER: '#2d2d2d',
  BORDER_HOVER: '#3d3d3d',

  // Text colors
  TEXT_PRIMARY: '#e4e4e7',    // zinc-200
  TEXT_SECONDARY: '#a1a1aa',  // zinc-400
  TEXT_TERTIARY: '#71717a',   // zinc-500
  TEXT_DISABLED: '#52525b',   // zinc-600

  // Accent colors
  ACCENT: '#6366f1',          // indigo-500
  ACCENT_HOVER: '#5558e3',    // indigo-600
  ACCENT_LIGHT: 'rgba(99, 102, 241, 0.12)', // 12% opacity

  // Semantic colors
  SUCCESS: '#10b981',         // emerald-500
  SUCCESS_HOVER: '#059669',   // emerald-600
  DANGER: '#dc2626',          // red-600
  DANGER_HOVER: '#b91c1c',    // red-700
  WARNING: '#f59e0b',         // amber-500
  WARNING_HOVER: '#d97706',   // amber-600
  INFO: '#3b82f6',            // blue-500
  INFO_HOVER: '#2563eb',      // blue-600
} as const

/**
 * Tailwind class mappings
 * Use these for consistent styling in components
 */
export const TAILWIND_COLORS = {
  // Background
  background: 'bg-[#0f0f0f]',
  card: 'bg-[#141414]',
  cardHover: 'bg-[#1a1a1a]',

  // Borders
  border: 'border-[#2d2d2d]',
  borderHover: 'border-[#3d3d3d]',

  // Text
  textPrimary: 'text-[#e4e4e7]',
  textSecondary: 'text-[#a1a1aa]',
  textTertiary: 'text-[#71717a]',
  textDisabled: 'text-[#52525b]',

  // Accent
  accent: 'bg-[#6366f1] text-white',
  accentHover: 'hover:bg-[#5558e3]',
  accentBorder: 'border-[#6366f1]',
  accentText: 'text-[#6366f1]',

  // Semantic
  success: 'bg-emerald-500 text-white',
  successHover: 'hover:bg-emerald-600',
  danger: 'bg-[#dc2626] text-white',
  dangerHover: 'hover:bg-[#b91c1c]',
  warning: 'bg-amber-500 text-white',
  warningHover: 'hover:bg-amber-600',
} as const

/**
 * Default colors for different UI elements
 * Use these for new gift lists, badges, etc.
 */
export const DEFAULT_COLORS = {
  PRIMARY: COLORS.ACCENT,
  LIST: COLORS.ACCENT,
  REQUIRED_BADGE: COLORS.DANGER,
  OPTIONAL_BADGE: COLORS.INFO,
  BEST_PRICE: COLORS.SUCCESS,
  HIGHEND_PRICE: COLORS.ACCENT,
} as const

/**
 * Opacity values for overlays and backgrounds
 */
export const OPACITY = {
  OVERLAY: 0.5,
  HOVER: 0.12,
  DISABLED: 0.5,
  BACKDROP: 0.8,
} as const
