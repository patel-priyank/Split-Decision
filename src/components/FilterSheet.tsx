import {
  activeFilterCount,
  BOSS_LABEL,
  DEFAULT_FILTERS,
  ENERGY_LABEL,
  KIND_LABEL,
  type FilterState
} from '../data/types';

import { bump, tick } from '../lib/haptics';

import { DiceIcon, ResetIcon } from './Icons';
import { MultiSelect, type Option } from './MultiSelect';
import { Sheet } from './Sheet';

interface Props {
  open: boolean;
  value: FilterState;
  onChange: (next: FilterState) => void;
  onClose: () => void;
  onDone: () => void;
  matchCount: number;
}

function toOptions<T extends string>(labels: Record<T, string>): Option<T>[] {
  return (Object.keys(labels) as T[]).map(value => ({ value, label: labels[value] }));
}

const STORY_OPTIONS: Option<FilterState['story']>[] = [
  { value: 'all', label: 'Anyone' },
  { value: 'mio', label: 'Mio' },
  { value: 'zoe', label: 'Zoe' },
  { value: 'both', label: 'Both' }
];

const ENERGY_OPTIONS = toOptions(ENERGY_LABEL);
const KIND_OPTIONS = toOptions(KIND_LABEL);
const BOSS_OPTIONS = toOptions(BOSS_LABEL);

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label
}: {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div
        className="segmented"
        role="group"
        aria-label={label}
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map(option => (
          <button
            type="button"
            key={option.value}
            aria-pressed={value === option.value}
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

export function FilterSheet({ open, value, onChange, onClose, onDone, matchCount }: Props) {
  // Every filter change gives a light tick.
  const update = (next: FilterState) => {
    tick();
    onChange(next);
  };

  const hasActive = activeFilterCount(value) > 0;

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
        onChange={story => update({ ...value, story })}
      />

      <div className="field-row">
        <MultiSelect
          label="Energy"
          options={ENERGY_OPTIONS}
          value={value.energy}
          onChange={energy => update({ ...value, energy })}
        />
        <MultiSelect
          label="Type"
          options={KIND_OPTIONS}
          value={value.kinds}
          onChange={kinds => update({ ...value, kinds })}
        />
      </div>

      <Segmented
        label="Boss fights"
        options={BOSS_OPTIONS}
        value={value.boss}
        onChange={boss => update({ ...value, boss })}
      />

      <footer className="sheet-foot">
        <button
          type="button"
          className="outline-btn"
          onClick={() => {
            bump();
            onChange(DEFAULT_FILTERS);
          }}
          disabled={!hasActive}
          aria-label="Reset filters"
          title="Reset filters"
        >
          <ResetIcon />
        </button>
        <button type="button" className="done-btn" onClick={onDone}>
          <DiceIcon size={20} />
          Done
        </button>
      </footer>
    </Sheet>
  );
}
