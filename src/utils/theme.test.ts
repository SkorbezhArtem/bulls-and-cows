import { describe, expect, it } from 'vitest';
import { parseTheme, THEMES } from './theme.js';

describe('parseTheme', () => {
  it.each(THEMES)('accepts the saved theme %s', (theme) => {
    expect(parseTheme(theme)).toBe(theme);
  });

  it('falls back to the system theme when nothing is saved', () => {
    expect(parseTheme(null)).toBe('system');
  });

  it.each(['', ' ', 'Dark', 'LIGHT', 'blue', 'dark ', 'undefined', '{}'])(
    'falls back to the system theme for the unknown value %j',
    (value) => {
      expect(parseTheme(value)).toBe('system');
    },
  );
});
