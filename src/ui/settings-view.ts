import { countPossibleSecrets } from '../game/count.js';
import {
  ALL_LENGTHS,
  getAvailableLengths,
  withBase,
} from '../game/settings.js';
import type { GameSettings } from '../game/state.js';
import { DIGITS } from '../game/validator.js';
import { h } from './dom.js';

const BASES = [
  { base: 2, label: 'Binary (bin)' },
  { base: 8, label: 'Octal (oct)' },
  { base: 10, label: 'Decimal (dec)' },
  { base: 16, label: 'Hexadecimal (hex)' },
] as const;

type SettingsViewProps = {
  settings: GameSettings;
  locked: boolean;
  onChange: (settings: GameSettings) => void;
  onStart: () => void;
};

const readNumber = (event: Event): number =>
  Number((event.target as HTMLSelectElement).value);

export const renderSettings = ({
  settings,
  locked,
  onChange,
  onStart,
}: SettingsViewProps): HTMLElement => {
  const available = getAvailableLengths(settings.base);
  const maxLength = Math.max(...available);
  const limited = available.length < ALL_LENGTHS.length;
  const total = countPossibleSecrets(settings.length, settings.base);

  const baseSelect = h(
    'select',
    {
      id: 'base',
      disabled: locked,
      onChange: (event) => onChange(withBase(settings, readNumber(event))),
    },
    ...BASES.map(({ base, label }) =>
      h('option', { value: base, selected: base === settings.base }, label),
    ),
  );

  const lengthSelect = h(
    'select',
    {
      id: 'length',
      disabled: locked,
      onChange: (event) => onChange({ ...settings, length: readNumber(event) }),
    },
    ...ALL_LENGTHS.map((length) =>
      h(
        'option',
        {
          value: length,
          selected: length === settings.length,
          disabled: !available.includes(length),
        },
        String(length),
      ),
    ),
  );

  return h(
    'section',
    { class: 'settings' },
    h('h2', {}, 'Settings'),
    h(
      'div',
      { class: 'field' },
      h('label', { for: 'base' }, 'Number system'),
      baseSelect,
    ),
    h(
      'div',
      { class: 'field' },
      h('label', { for: 'length' }, 'Secret length'),
      lengthSelect,
    ),
    h(
      'div',
      { class: 'hints' },
      h(
        'p',
        { class: 'hint' },
        `Possible secrets: ${total.toLocaleString('en-US')}`,
      ),
      h(
        'p',
        { class: 'hint' },
        'Digits in play: ',
        h('span', { class: 'digits-list' }, DIGITS.slice(0, settings.base)),
      ),
      limited
        ? h(
            'p',
            { class: 'hint' },
            `Base ${settings.base} has only ${settings.base} different digits, so the secret can be at most ${maxLength} digits long.`,
          )
        : null,
    ),
    locked
      ? null
      : h('button', { type: 'button', id: 'start', onClick: onStart }, 'Start'),
  );
};
