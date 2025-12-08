import { TextStyle } from 'react-native'
import { colors } from './colors'

export const typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  // Body
  body: {
    fontSize: 14,
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Small
  small: {
    fontSize: 12,
    color: colors.textMuted,
  },
  caption: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Labels
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },

  // Buttons
  button: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
}
