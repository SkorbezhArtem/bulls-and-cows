import { getRecordsFor, type GameRecord } from '../game/records.js';
import type { GameSettings } from '../game/state.js';
import { h } from './dom.js';
import { formatDuration } from './format.js';

type RecordsViewProps = {
  records: readonly GameRecord[];
  settings: GameSettings;
};

export const renderRecords = ({
  records,
  settings,
}: RecordsViewProps): HTMLElement => {
  const top = getRecordsFor(records, settings);

  return h(
    'section',
    { class: 'records' },
    h('h2', {}, 'High scores'),
    h(
      'p',
      { class: 'hint' },
      `Length ${settings.length}, base ${settings.base}`,
    ),
    top.length === 0
      ? h('p', {}, 'No results yet.')
      : h(
          'table',
          {},
          h(
            'thead',
            {},
            h(
              'tr',
              {},
              h('th', { scope: 'col' }, '#'),
              h('th', { scope: 'col' }, 'Attempts'),
              h('th', { scope: 'col' }, 'Time'),
            ),
          ),
          h(
            'tbody',
            {},
            ...top.map((record, index) =>
              h(
                'tr',
                {},
                h('td', {}, String(index + 1)),
                h('td', {}, String(record.attempts)),
                h('td', {}, formatDuration(record.timeMs)),
              ),
            ),
          ),
        ),
  );
};
