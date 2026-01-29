import { colors } from './colors';

export const typography = {
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
};

export type TypographyVariant = keyof typeof typography;
