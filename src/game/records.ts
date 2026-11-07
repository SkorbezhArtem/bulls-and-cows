import type { GameSettings, GameState } from './state.js';

export type GameRecord = {
  settings: GameSettings;
  attempts: number;
  timeMs: number;
};

export const TOP_LIMIT = 10;

export const createRecord = (state: GameState): GameRecord | null => {
  throw new Error(`createRecord is not implemented (${state.status})`);
};

export const addRecord = (
  records: readonly GameRecord[],
  record: GameRecord,
  limit: number = TOP_LIMIT,
): GameRecord[] => {
  throw new Error(
    `addRecord is not implemented (${records.length}, ${record.attempts}, ${limit})`,
  );
};

export const getRecordsFor = (
  records: readonly GameRecord[],
  settings: GameSettings,
): GameRecord[] => {
  throw new Error(
    `getRecordsFor is not implemented (${records.length}, ${settings.length})`,
  );
};

export const serializeRecords = (records: readonly GameRecord[]): string => {
  throw new Error(`serializeRecords is not implemented (${records.length})`);
};

export const parseRecords = (json: string | null): GameRecord[] => {
  throw new Error(`parseRecords is not implemented (${json})`);
};
