import { countPossibleSecrets } from '../game/count.js';
import {
  ALL_LENGTHS,
  getAvailableLengths,
  withBase,
} from '../game/settings.js';
import type { GameSettings } from '../game/state.js';
import { h } from './dom.js';

const BASES = [
  { base: 2, label: 'Binary (bin)' },
  { base: 8, label: 'Octal (oct)' },
  { base: 10, label: 'Decimal (dec)' },
  { base: 16, label: 'Hexadecimal (hex)' },
] as const;

type SettingsViewProps = {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
};

const readNumber = (event: Event): number =>
  Number((event.target as HTMLSelectElement).value);

export const renderSettings = ({
  settings,
  onChange,
}: SettingsViewProps): HTMLElement => {
  const available = getAvailableLengths(settings.base);

  const baseSelect = h(
    'select',
    {
      id: 'base',
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

  const total = countPossibleSecrets(settings.length, settings.base);

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
      'p',
      { class: 'hint' },
      `Possible secrets: ${total.toLocaleString('en-US')}`,
    ),
  );
};
