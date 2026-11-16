import type { BossFilter, Energy, Kind, Story } from '../data/types';
import { BOSS_LABEL, ENERGY_LABEL, KIND_LABEL } from '../data/types';

import { bump, tick } from '../lib/haptics';

import { MultiSelect } from './MultiSelect';
import { Sheet } from './Sheet';

export interface FilterState {
  story: Story | 'all';
  energy: Energy[];
  boss: BossFilter;
  kinds: Kind[];
}

export const DEFAULT_FILTERS: FilterState = {
  story: 'all',
  energy: [],
  boss: 'any',
  kinds: []
};

export function activeFilterCount(filterState: FilterState): number {
  return (
    (filterState.story !== 'all' ? 1 : 0) +
    (filterState.energy.length ? 1 : 0) +
    (filterState.boss !== 'any' ? 1 : 0) +
    (filterState.kinds.length ? 1 : 0)
  );
}

interface Props {
  open: boolean;
  value: FilterState;
  onChange: (next: FilterState) => void;
  onClose: () => void;
  matchCount: number;
}

const STORY_OPTIONS: { value: FilterState['story']; label: string }[] = [
  { value: 'all', label: 'Anyone' },
  { value: 'mio', label: 'Mio' },
  { value: 'zoe', label: 'Zoe' },
  { value: 'both', label: 'Both' }
];
const ENERGY_OPTIONS = (Object.keys(ENERGY_LABEL) as Energy[]).map(val => ({ value: val, label: ENERGY_LABEL[val] }));
const KIND_OPTIONS = (Object.keys(KIND_LABEL) as Kind[]).map(val => ({ value: val, label: KIND_LABEL[val] }));
const BOSS_OPTIONS = Object.keys(BOSS_LABEL) as BossFilter[];

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (val: T) => void;
  label: string;
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div
        className="segmented"
        role="radiogroup"
        aria-label={label}
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map(option => (
          <button
            type="button"
            key={option.value}
            role="radio"
            aria-checked={value === option.value}
            className={`seg ${value === option.value ? 'selected' : ''}`}
            onClick={() => option.value !== value && onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterSheet({ open, value, onChange: setFilters, onClose, matchCount }: Props) {
  // Every filter change gives a light tick.
  const onChange = (next: FilterState) => {
    tick();
    setFilters(next);
  };

  const active = activeFilterCount(value) > 0;

  return (
    <Sheet open={open} onClose={onClose} label="Filters">
      <header className="sheet-head">
        <h2 className="sheet-title">Filters</h2>
        <span className="match-pill">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </span>
      </header>

      <Segmented
        label="Whose story"
        options={STORY_OPTIONS}
        value={value.story}
        onChange={story => onChange({ ...value, story })}
      />

      <div className="field-row">
        <MultiSelect
          label="Energy"
          options={ENERGY_OPTIONS}
          value={value.energy}
          onChange={energy => onChange({ ...value, energy })}
        />
        <MultiSelect
          label="Type"
          options={KIND_OPTIONS}
          value={value.kinds}
          onChange={kinds => onChange({ ...value, kinds })}
        />
      </div>

      <Segmented
        label="Boss fights"
        options={BOSS_OPTIONS.map(b => ({ value: b, label: BOSS_LABEL[b] }))}
        value={value.boss}
        onChange={boss => onChange({ ...value, boss })}
      />

      <footer className="sheet-foot">
        <button
          type="button"
          className="outline-btn"
          onClick={() => {
            bump();
            setFilters(DEFAULT_FILTERS);
          }}
          disabled={!active}
        >
          Reset
        </button>
        <button type="button" className="done-btn" onClick={onClose}>
          Done
        </button>
      </footer>
    </Sheet>
  );
}
