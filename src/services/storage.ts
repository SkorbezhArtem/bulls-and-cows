import {
  parseRecords,
  serializeRecords,
  type GameRecord,
} from '../game/records.js';
import { DEFAULT_THEME, parseTheme, type Theme } from '../utils/theme.js';

const RECORDS_KEY = 'bulls-and-cows:records';
const THEME_KEY = 'bulls-and-cows:theme';

export const loadRecords = (): GameRecord[] => {
  try {
    return parseRecords(window.localStorage.getItem(RECORDS_KEY));
  } catch {
    return [];
  }
};

export const saveRecords = (records: readonly GameRecord[]): void => {
  try {
    window.localStorage.setItem(RECORDS_KEY, serializeRecords(records));
  } catch {
    // Storage can be blocked or full: the game keeps working without saving.
  }
};

export const loadTheme = (): Theme => {
  try {
    return parseTheme(window.localStorage.getItem(THEME_KEY));
  } catch {
    return DEFAULT_THEME;
  }
};

export const saveTheme = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked or full: the theme just will not be remembered.
  }
};
