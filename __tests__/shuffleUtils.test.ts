import { shuffleArray, generateRoomCode, calculateCompatibility, pickRandom } from '../src/core/utils/shuffleUtils';

describe('shuffleArray', () => {
  it('should return same length array', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });

  it('should handle empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('should handle single element', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('generateRoomCode', () => {
  it('should generate code of default length 6', () => {
    expect(generateRoomCode()).toHaveLength(6);
  });

  it('should generate code of custom length', () => {
    expect(generateRoomCode(8)).toHaveLength(8);
  });

  it('should only contain valid characters', () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);
  });

  it('should generate different codes on successive calls', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateRoomCode()));
    // With 6-char code from ~32 chars, collision probability is negligible
    expect(codes.size).toBeGreaterThan(90);
  });
});

describe('calculateCompatibility', () => {
  it('should return 100 for identical answers', () => {
    const answers = [true, false, true, true, false];
    expect(calculateCompatibility(answers, answers)).toBe(100);
  });

  it('should return 0 for completely opposite answers', () => {
    const a = [true, true, true];
    const b = [false, false, false];
    expect(calculateCompatibility(a, b)).toBe(0);
  });

  it('should return 50 for half matching', () => {
    const a = [true, true];
    const b = [true, false];
    expect(calculateCompatibility(a, b)).toBe(50);
  });

  it('should return 0 for empty arrays', () => {
    expect(calculateCompatibility([], [])).toBe(0);
  });

  it('should handle arrays of different lengths by using minimum', () => {
    const result = calculateCompatibility([true, true, true], [true, true]);
    expect(result).toBe(100);
  });
});

describe('pickRandom', () => {
  it('should return undefined for empty array', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('should return the only element for single-element array', () => {
    expect(pickRandom([42])).toBe(42);
  });

  it('should return a value that exists in the array', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const result = pickRandom(arr);
    expect(arr).toContain(result);
  });
});
