export type KeypadKey = { digit: string; disabled: boolean };

export const getKeypadKeys = (
  base: number,
  draft: string,
  length: number,
): KeypadKey[] => {
  throw new Error(
    `getKeypadKeys is not implemented (${base}, ${draft}, ${length})`,
  );
};

export const appendDigit = (
  draft: string,
  digit: string,
  length: number,
  base: number,
): string => {
  throw new Error(
    `appendDigit is not implemented (${draft}, ${digit}, ${length}, ${base})`,
  );
};

export const deleteLastDigit = (draft: string): string => {
  throw new Error(`deleteLastDigit is not implemented (${draft})`);
};
