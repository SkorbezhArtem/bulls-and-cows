import { getKeypadKeys } from '../game/keypad.js';
import { h } from './dom.js';

type KeypadViewProps = {
  base: number;
  length: number;
  draft: string;
  onDigit: (digit: string) => void;
  onDelete: () => void;
};

export type KeypadView = {
  element: HTMLElement;
  update: (draft: string) => void;
};

export const renderKeypad = ({
  base,
  length,
  draft,
  onDigit,
  onDelete,
}: KeypadViewProps): KeypadView => {
  const keys = getKeypadKeys(base, draft, length).map(({ digit, disabled }) =>
    h(
      'button',
      {
        type: 'button',
        class: 'key',
        disabled,
        'aria-label': `Digit ${digit}`,
        onClick: () => onDigit(digit),
      },
      digit,
    ),
  );

  const deleteKey = h(
    'button',
    {
      type: 'button',
      class: 'key key-delete',
      disabled: draft.length === 0,
      'aria-label': 'Delete last digit',
      onClick: onDelete,
    },
    '⌫',
  );

  const element = h(
    'div',
    { class: 'keypad', role: 'group', 'aria-label': 'Digit keypad' },
    ...keys,
    deleteKey,
  );

  const update = (current: string): void => {
    getKeypadKeys(base, current, length).forEach(({ disabled }, index) => {
      keys[index].disabled = disabled;
    });
    deleteKey.disabled = current.length === 0;
  };

  return { element, update };
};
