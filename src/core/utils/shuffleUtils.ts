export function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    const swapTarget = arr[j];
    if (temp !== undefined && swapTarget !== undefined) {
      arr[i] = swapTarget;
      arr[j] = temp;
    }
  }
  return arr;
}

export function generateRoomCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    code += chars[idx] ?? "X";
  }
  return code;
}

export function calculateCompatibility(
  answersA: boolean[],
  answersB: boolean[],
): number {
  const len = Math.min(answersA.length, answersB.length);
  if (len === 0) return 0;
  let matches = 0;
  for (let i = 0; i < len; i++) {
    if (answersA[i] === answersB[i]) matches++;
  }
  return Math.round((matches / len) * 100);
}

export function pickRandom<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}
