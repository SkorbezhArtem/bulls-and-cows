import { describe, expect, it } from 'vitest';
import {
  addRecord,
  createRecord,
  getRecordsFor,
  parseRecords,
  serializeRecords,
  TOP_LIMIT,
  type GameRecord,
} from './records.js';
import type { GameState } from './state.js';

const dec4 = { length: 4, base: 10 };
const hex4 = { length: 4, base: 16 };
const bin2 = { length: 2, base: 2 };

const record = (
  attempts: number,
  timeMs: number,
  settings = dec4,
): GameRecord => ({ settings, attempts, timeMs });

const attemptsOf = (records: GameRecord[]): number[] =>
  records.map((item) => item.attempts);

describe('createRecord', () => {
  const won: GameState = {
    settings: dec4,
    secret: '1234',
    status: 'won',
    history: [
      { guess: '5678', bulls: 0, cows: 0 },
      { guess: '1234', bulls: 4, cows: 0 },
    ],
    startedAt: 1000,
    finishedAt: 6500,
  };

  it('builds a record from a won game', () => {
    expect(createRecord(won)).toEqual({
      settings: dec4,
      attempts: 2,
      timeMs: 5500,
    });
  });

  it('returns null while the game is still being played', () => {
    expect(createRecord({ ...won, status: 'playing', finishedAt: null })).toBe(
      null,
    );
  });
});

describe('getRecordsFor', () => {
  it('returns an empty list when there are no records', () => {
    expect(getRecordsFor([], dec4)).toEqual([]);
  });

  it('sorts by attempts, fewer first', () => {
    const records = [record(7, 1000), record(3, 9000), record(5, 2000)];

    expect(attemptsOf(getRecordsFor(records, dec4))).toEqual([3, 5, 7]);
  });

  it('sorts by time when attempts are equal', () => {
    const records = [record(4, 9000), record(4, 3000), record(4, 6000)];

    expect(getRecordsFor(records, dec4).map((item) => item.timeMs)).toEqual([
      3000, 6000, 9000,
    ]);
  });

  it('puts fewer attempts before a faster time', () => {
    const records = [record(5, 1000), record(4, 50000)];

    expect(attemptsOf(getRecordsFor(records, dec4))).toEqual([4, 5]);
  });

  it('returns only records of the same length and base', () => {
    const records = [
      record(3, 1000, dec4),
      record(2, 500, hex4),
      record(2, 100, bin2),
      record(1, 100, { length: 5, base: 10 }),
    ];

    expect(getRecordsFor(records, dec4)).toEqual([record(3, 1000, dec4)]);
  });

  it('does not change the given list', () => {
    const input = Object.freeze([record(7, 1000), record(3, 1000)]);

    getRecordsFor(input, dec4);

    expect(attemptsOf([...input])).toEqual([7, 3]);
  });
});

describe('addRecord', () => {
  it('adds a record to an empty list', () => {
    expect(addRecord([], record(3, 1000))).toEqual([record(3, 1000)]);
  });

  it('keeps the records sorted', () => {
    const result = addRecord(
      [record(3, 1000), record(6, 1000)],
      record(4, 1000),
    );

    expect(attemptsOf(getRecordsFor(result, dec4))).toEqual([3, 4, 6]);
  });

  it('does not change the given list', () => {
    const input = Object.freeze([record(3, 1000)]);

    const result = addRecord(input, record(2, 1000));

    expect(result).not.toBe(input);
    expect(input).toHaveLength(1);
  });

  it('keeps only the best results up to the limit', () => {
    const top = [record(2, 1000), record(4, 1000), record(6, 1000)];

    const result = addRecord(top, record(3, 1000), 3);

    expect(attemptsOf(getRecordsFor(result, dec4))).toEqual([2, 3, 4]);
  });

  it('drops a result that is worse than the whole top', () => {
    const top = [record(2, 1000), record(4, 1000), record(6, 1000)];

    const result = addRecord(top, record(9, 1000), 3);

    expect(attemptsOf(getRecordsFor(result, dec4))).toEqual([2, 4, 6]);
  });

  it('applies the limit to each combination separately', () => {
    const records = [
      record(2, 1000),
      record(4, 1000),
      record(6, 1000),
      record(5, 1000, hex4),
      record(8, 1000, hex4),
    ];

    const result = addRecord(records, record(3, 1000), 3);

    expect(attemptsOf(getRecordsFor(result, dec4))).toEqual([2, 3, 4]);
    expect(attemptsOf(getRecordsFor(result, hex4))).toEqual([5, 8]);
  });

  it('uses TOP_LIMIT as the default limit', () => {
    const many = Array.from({ length: TOP_LIMIT }, (_, index) =>
      record(index + 2, 1000),
    );

    const top = getRecordsFor(addRecord(many, record(1, 1000)), dec4);

    expect(top).toHaveLength(TOP_LIMIT);
    expect(top[0].attempts).toBe(1);
    expect(top[TOP_LIMIT - 1].attempts).toBe(TOP_LIMIT);
  });

  it('keeps two identical results', () => {
    const result = addRecord([record(3, 1000)], record(3, 1000));

    expect(getRecordsFor(result, dec4)).toHaveLength(2);
  });
});

describe('serializeRecords and parseRecords', () => {
  it('serializes an empty list as []', () => {
    expect(serializeRecords([])).toBe('[]');
  });

  it('restores the same records after a round trip', () => {
    const records = [record(3, 1000), record(5, 2000, hex4)];

    expect(parseRecords(serializeRecords(records))).toEqual(records);
  });

  it('returns an empty list when nothing is saved yet', () => {
    expect(parseRecords(null)).toEqual([]);
  });

  it('returns an empty list for broken JSON', () => {
    expect(parseRecords('{oops')).toEqual([]);
  });

  it('returns an empty list when the JSON is not an array', () => {
    expect(parseRecords('{"attempts":3}')).toEqual([]);
  });

  it('skips broken items and keeps the valid ones', () => {
    const json = JSON.stringify([
      record(3, 1000),
      { attempts: 'x' },
      null,
      42,
      { settings: dec4, attempts: 2 },
    ]);

    expect(parseRecords(json)).toEqual([record(3, 1000)]);
  });

  it.each([
    record(0, 1000),
    record(-1, 1000),
    record(1.5, 1000),
    record(3, -1),
    { settings: dec4, attempts: null, timeMs: 1000 },
    { settings: { length: '4', base: 10 }, attempts: 3, timeMs: 1000 },
  ])('drops the invalid record %j', (bad) => {
    expect(parseRecords(JSON.stringify([bad]))).toEqual([]);
  });
});
