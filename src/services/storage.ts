import {
  parseRecords,
  serializeRecords,
  type GameRecord,
} from '../game/records.js';

const RECORDS_KEY = 'bulls-and-cows:records';

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
