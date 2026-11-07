import type { GameSettings, GameState } from './state.js';

export type GameRecord = {
  settings: GameSettings;
  attempts: number;
  timeMs: number;
};

export const TOP_LIMIT = 10;

const isSameSettings = (a: GameSettings, b: GameSettings): boolean =>
  a.length === b.length && a.base === b.base;

const compareRecords = (a: GameRecord, b: GameRecord): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const createRecord = (state: GameState): GameRecord | null =>
  state.status === 'won' && state.finishedAt !== null
    ? {
        settings: state.settings,
        attempts: state.history.length,
        timeMs: state.finishedAt - state.startedAt,
      }
    : null;

export const getRecordsFor = (
  records: readonly GameRecord[],
  settings: GameSettings,
): GameRecord[] =>
  records
    .filter((record) => isSameSettings(record.settings, settings))
    .sort(compareRecords);

export const addRecord = (
  records: readonly GameRecord[],
  record: GameRecord,
  limit: number = TOP_LIMIT,
): GameRecord[] => {
  const others = records.filter(
    (item) => !isSameSettings(item.settings, record.settings),
  );
  const top = getRecordsFor([...records, record], record.settings).slice(
    0,
    limit,
  );

  return [...others, ...top];
};

export const serializeRecords = (records: readonly GameRecord[]): string =>
  JSON.stringify(records);

const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const isSettings = (value: unknown): value is GameSettings => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { length, base } = value as Record<string, unknown>;

  return isPositiveInteger(length) && isPositiveInteger(base);
};

const isGameRecord = (value: unknown): value is GameRecord => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { settings, attempts, timeMs } = value as Record<string, unknown>;

  return (
    isSettings(settings) &&
    isPositiveInteger(attempts) &&
    typeof timeMs === 'number' &&
    timeMs >= 0
  );
};

export const parseRecords = (json: string | null): GameRecord[] => {
  if (json === null) {
    return [];
  }

  try {
    const data: unknown = JSON.parse(json);

    return Array.isArray(data) ? data.filter(isGameRecord) : [];
  } catch {
    return [];
  }
};
