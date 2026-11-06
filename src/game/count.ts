export const countPossibleSecrets = (length: number, base: number): number => {
  if (length === 0) {
    return 1;
  }

  if (length > base) {
    return 0;
  }

  return base * countPossibleSecrets(length - 1, base - 1);
};
