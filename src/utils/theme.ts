export const THEMES = ['system', 'light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'system';

export const parseTheme = (value: string | null): Theme => {
  throw new Error(`parseTheme is not implemented (${value})`);
};
