import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluate.js';

describe('evaluateGuess', () => {
  it.each(['01', '012', '0123', '01234', '012345'])(
    'reports only bulls when the guess equals the secret %s',
    (secret) => {
      expect(evaluateGuess(secret, secret)).toEqual({
        bulls: secret.length,
        cows: 0,
      });
    },
  );

  it('reports nothing when there are no common digits', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('reports only cows when all digits are in the wrong places', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('counts one bull and one cow', () => {
    expect(evaluateGuess('1234', '1350')).toEqual({ bulls: 1, cows: 1 });
  });

  it('counts one bull without cows', () => {
    expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
  });

  it('counts one cow without bulls', () => {
    expect(evaluateGuess('1234', '2956')).toEqual({ bulls: 0, cows: 1 });
  });

  it('handles a secret with a leading zero', () => {
    expect(evaluateGuess('0123', '1023')).toEqual({ bulls: 2, cows: 2 });
  });

  it('handles the binary base', () => {
    expect(evaluateGuess('01', '01')).toEqual({ bulls: 2, cows: 0 });
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
  });

  it('ignores the case of hex digits', () => {
    expect(evaluateGuess('a1f3', 'A1F3')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('a1f3', 'F3A1')).toEqual({ bulls: 0, cows: 4 });
    expect(evaluateGuess('A1f3', 'a3F1')).toEqual({ bulls: 2, cows: 2 });
  });

  it('handles the longest hex secret', () => {
    expect(evaluateGuess('0123ab', 'ab0123')).toEqual({ bulls: 0, cows: 6 });
  });

  it('gives the same result when secret and guess are swapped', () => {
    expect(evaluateGuess('1350', '1234')).toEqual(
      evaluateGuess('1234', '1350'),
    );
  });
});
