import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('returns the same result as the original function', () => {
    const add = memoize((a: number, b: number) => a + b);

    expect(add(2, 3)).toBe(5);
  });

  it('calls the original function once for repeated arguments', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const add = memoize(spy);

    expect(add(2, 3)).toBe(5);
    expect(add(2, 3)).toBe(5);
    expect(add(2, 3)).toBe(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const add = memoize(spy);

    expect(add(2, 3)).toBe(5);
    expect(add(3, 4)).toBe(7);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not mix up arguments that look the same when glued together', () => {
    const spy = vi.fn((a: number, b: number) => `${a}:${b}`);
    const join = memoize(spy);

    expect(join(1, 12)).toBe('1:12');
    expect(join(11, 2)).toBe('11:2');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it.each([0, false, '', null])('caches the falsy result %p', (value) => {
    const spy = vi.fn(() => value);
    const get = memoize(spy);

    expect(get()).toBe(value);
    expect(get()).toBe(value);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('keeps a separate cache for every memoized function', () => {
    const double = vi.fn((n: number) => n * 2);
    const triple = vi.fn((n: number) => n * 3);
    const memoDouble = memoize(double);
    const memoTriple = memoize(triple);

    expect(memoDouble(5)).toBe(10);
    expect(memoTriple(5)).toBe(15);
    expect(double).toHaveBeenCalledTimes(1);
    expect(triple).toHaveBeenCalledTimes(1);
  });

  it('passes all arguments to the original function', () => {
    const spy = vi.fn((...args: number[]) => args.length);
    const count = memoize(spy);

    expect(count(1, 2, 3)).toBe(3);
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
  });

  it('makes a recursive function compute each argument only once', () => {
    let calls = 0;
    const fib: (n: number) => number = memoize((n: number): number => {
      calls += 1;
      return n < 2 ? n : fib(n - 1) + fib(n - 2);
    });

    expect(fib(30)).toBe(832040);
    expect(calls).toBe(31);
  });
});
