import type { GameRecord } from '../game/records.js';
import { getAvailableLengths, withBase } from '../game/settings.js';
import type { GameSettings } from '../game/state.js';
import { h } from './dom.js';
import { renderRecordsTable } from './records-view.js';
import { BASES } from './settings-view.js';

type RecordsDialogProps = {
  getRecords: () => readonly GameRecord[];
  getSettings: () => GameSettings;
};

export type RecordsDialog = {
  element: HTMLDialogElement;
  open: () => void;
};

const readNumber = (event: Event): number =>
  Number((event.target as HTMLSelectElement).value);

export const createRecordsDialog = ({
  getRecords,
  getSettings,
}: RecordsDialogProps): RecordsDialog => {
  const dialog = h('dialog', {
    class: 'records-dialog',
    'aria-labelledby': 'records-title',
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  const show = (filter: GameSettings, focusId?: string): void => {
    const lengths = getAvailableLengths(filter.base);

    dialog.replaceChildren(
      h(
        'div',
        { class: 'dialog-body' },
        h(
          'div',
          { class: 'dialog-head' },
          h('h2', { id: 'records-title' }, 'High scores'),
          h(
            'button',
            {
              type: 'button',
              class: 'btn-ghost',
              onClick: () => dialog.close(),
            },
            'Close',
          ),
        ),
        h(
          'div',
          { class: 'dialog-filters' },
          h(
            'div',
            { class: 'field' },
            h('label', { for: 'records-base' }, 'Number system'),
            h(
              'select',
              {
                id: 'records-base',
                onChange: (event) =>
                  show(withBase(filter, readNumber(event)), 'records-base'),
              },
              ...BASES.map(({ base, label }) =>
                h(
                  'option',
                  { value: base, selected: base === filter.base },
                  label,
                ),
              ),
            ),
          ),
          h(
            'div',
            { class: 'field' },
            h('label', { for: 'records-length' }, 'Secret length'),
            h(
              'select',
              {
                id: 'records-length',
                onChange: (event) =>
                  show(
                    { ...filter, length: readNumber(event) },
                    'records-length',
                  ),
              },
              ...lengths.map((length) =>
                h(
                  'option',
                  { value: length, selected: length === filter.length },
                  String(length),
                ),
              ),
            ),
          ),
        ),
        renderRecordsTable({ records: getRecords(), settings: filter }),
      ),
    );

    if (focusId) {
      dialog.querySelector<HTMLElement>(`#${focusId}`)?.focus();
    }
  };

  const open = (): void => {
    show(getSettings());

    if (!dialog.open) {
      dialog.showModal();
    }
  };

  return { element: dialog, open };
};
