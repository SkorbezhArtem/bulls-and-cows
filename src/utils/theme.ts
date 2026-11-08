export const THEMES = ['system', 'light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'system';

const isTheme = (value: string): value is Theme =>
  (THEMES as readonly string[]).includes(value);

export const parseTheme = (value: string | null): Theme =>
  value !== null && isTheme(value) ? value : DEFAULT_THEME;
