import { useCallback, useEffect, useMemo, useState } from 'react';

import { LEVELS } from './data/levels';
import {
  activeFilterCount,
  BOSS_LABEL,
  DEFAULT_FILTERS,
  ENERGY_LABEL,
  KIND_LABEL,
  STORY_LABEL,
  type FilterState,
  type Level
} from './data/types';

import { bump, roll } from './lib/haptics';
import { pickRandom } from './lib/random';
import { useStoredState } from './lib/useStoredState';

import { FilterSheet } from './components/FilterSheet';
import { DiceIcon, FilterIcon, InfoIcon, UndoIcon } from './components/Icons';
import { InfoSheet } from './components/InfoSheet';
import { LevelCard } from './components/LevelCard';

const RECENT_LIMIT = 5;
const FILTERS_KEY = 'sd:filters';
const RECENT_KEY = 'sd:recent';
// Longest we wait for web fonts before showing the UI anyway.
const FONT_WAIT_MS = 1000;

type SheetName = 'filters' | 'info';

function matches(level: Level, filters: FilterState): boolean {
  if (filters.story !== 'all' && level.story !== filters.story) return false;
  if (filters.energy.length && !filters.energy.includes(level.energy)) return false;
  if (filters.boss === 'only' && !level.boss) return false;
  if (filters.boss === 'none' && level.boss) return false;
  if (filters.kinds.length && !filters.kinds.includes(level.kind)) return false;
  return true;
}

// Merge with defaults and drop values that are no longer valid (e.g. from older versions or corrupt storage).
// Object.hasOwn rather than `in`, so prototype keys like "toString" from corrupt storage are rejected.
function sanitise(stored: Partial<FilterState> | null | undefined): FilterState {
  const merged = { ...DEFAULT_FILTERS, ...(stored ?? {}) };
  return {
    story: merged.story === 'all' || Object.hasOwn(STORY_LABEL, merged.story) ? merged.story : 'all',
    energy: Array.isArray(merged.energy)
      ? merged.energy.filter(e => typeof e === 'string' && Object.hasOwn(ENERGY_LABEL, e))
      : [],
    boss: Object.hasOwn(BOSS_LABEL, merged.boss) ? merged.boss : 'any',
    kinds: Array.isArray(merged.kinds)
      ? merged.kinds.filter(k => typeof k === 'string' && Object.hasOwn(KIND_LABEL, k))
      : []
  };
}

// Keep only string ids, so a corrupt stored value can't crash the picker.
function sanitiseRecent(stored: unknown): string[] {
  return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : [];
}

// Twinkling sparkles: [x%, y%, size px, delay s]. Weighted towards Zoe's (gold) corner.
const TWINKLES: [number, number, number, number][] = [
  [88, 12, 14, 0],
  [72, 30, 9, 1.3],
  [94, 44, 11, 2.6],
  [64, 58, 8, 0.7],
  [82, 70, 16, 3.4],
  [56, 84, 10, 1.9],
  [92, 88, 12, 4.1],
  [74, 94, 8, 2.2],
  [44, 72, 7, 3.8],
  [30, 90, 9, 0.4],
  [12, 64, 6, 2.9]
];

const filterPool = (filters: FilterState) => LEVELS.filter(level => matches(level, filters));

export default function App() {
  const [storedFilters, setFilters] = useStoredState<FilterState>(FILTERS_KEY, DEFAULT_FILTERS);
  const filters = useMemo(() => sanitise(storedFilters), [storedFilters]);
  const [storedRecent, setRecent] = useStoredState<string[]>(RECENT_KEY, []);
  const recent = useMemo(() => sanitiseRecent(storedRecent), [storedRecent]);
  const [openSheet, setOpenSheet] = useState<SheetName | null>(null);
  const pool = useMemo(() => filterPool(filters), [filters]);

  // Deal a fresh pick on load, using the saved filters.
  const [currentId, setCurrentId] = useState(() => pickRandom(pool, recent)?.id);
  const [dealKey, setDealKey] = useState(0);
  // The card before the last Pick, for a single undo. In memory only, so a reload clears it.
  const [previousId, setPreviousId] = useState<string | undefined>();
  const [undone, setUndone] = useState(false);

  // Fade the UI in once the web fonts are ready (or after FONT_WAIT_MS), so text doesn't visibly swap fonts on load.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const show = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    document.fonts?.ready.then(show).catch(show);
    const timer = setTimeout(show, FONT_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  const current = LEVELS.find(level => level.id === currentId);
  const activeCount = activeFilterCount(filters);
  const pickLabel = pool.length === 0 ? 'No matches for these filters' : 'Pick another';

  const remember = useCallback(
    (id: string) =>
      setRecent(prev => [id, ...sanitiseRecent(prev).filter(prevId => prevId !== id)].slice(0, RECENT_LIMIT)),
    [setRecent]
  );

  // Record the on-load pick so it won't come straight back next time.
  useEffect(() => {
    if (currentId) remember(currentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If nothing was dealt (the saved filters matched nothing), deal as soon as the filters allow one.
  useEffect(() => {
    if (currentId) return;
    const next = pickRandom(pool, recent);
    if (!next) return;
    setCurrentId(next.id);
    remember(next.id);
  }, [currentId, pool, recent, remember]);

  function deal({ undoable }: { undoable: boolean }) {
    // Close any open drawer so the new pick is visible.
    setOpenSheet(null);
    const next = pickRandom(pool, recent, currentId);
    if (!next) return;
    roll();
    // A pick after changing filters isn't undoable: the old card may not match them.
    setPreviousId(undoable ? currentId : undefined);
    setUndone(false);
    setCurrentId(next.id);
    remember(next.id);
    setDealKey(k => k + 1);
  }

  function undo() {
    if (!previousId) return;
    bump();
    setCurrentId(previousId);
    setPreviousId(undefined);
    setUndone(true);
    setDealKey(k => k + 1);
  }

  const changeFilters = (next: FilterState) => {
    setFilters(next);
    setPreviousId(undefined);
  };

  const canUndo = previousId !== undefined && openSheet === null;

  const closeSheet = useCallback(() => setOpenSheet(null), []);
  const toggleSheet = (sheet: SheetName) => setOpenSheet(open => (open === sheet ? null : sheet));

  return (
    <div className={`app ${ready ? 'is-ready' : ''}`}>
      <div className="bg" aria-hidden="true">
        <div className="bg-grid" />
        <div className="bg-stars" />
        {TWINKLES.map(([x, y, size, delay], i) => (
          <span
            key={i}
            className="twinkle"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <header className="header">
        <h1 className="title">Split Decision</h1>
        <p className="tagline">Two writers, one couch, zero decisions.</p>
      </header>

      <main className="stage">
        <div
          className={`card-slot ${dealKey ? (undone ? 'is-undone' : 'is-dealt') : ''}`}
          key={dealKey}
          inert={openSheet !== null}
        >
          {current ? (
            <LevelCard level={current} />
          ) : (
            <div className="empty">
              <p>No matches for these filters.</p>
            </div>
          )}
        </div>

        <FilterSheet
          open={openSheet === 'filters'}
          value={filters}
          onChange={changeFilters}
          onClose={closeSheet}
          onDone={() => deal({ undoable: false })}
          matchCount={pool.length}
        />
        <InfoSheet open={openSheet === 'info'} onClose={closeSheet} />
      </main>

      <footer className="bottom-bar">
        {canUndo && (
          <button className="undo-pill" onClick={undo} key={dealKey}>
            <UndoIcon />
            Undo
          </button>
        )}
        <button
          className={`icon-btn ${openSheet === 'info' ? 'is-open' : ''}`}
          onClick={() => toggleSheet('info')}
          aria-expanded={openSheet === 'info'}
          aria-label="About this app"
        >
          <InfoIcon />
        </button>
        <button
          className="randomise"
          onClick={() => deal({ undoable: true })}
          disabled={pool.length === 0}
          aria-label={pickLabel}
          title={pickLabel}
        >
          <DiceIcon />
        </button>
        <button
          className={`icon-btn ${openSheet === 'filters' ? 'is-open' : ''}`}
          onClick={() => toggleSheet('filters')}
          aria-expanded={openSheet === 'filters'}
          aria-label={`Filters${activeCount ? ` (${activeCount} active)` : ''}`}
        >
          <FilterIcon />
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </button>
      </footer>
    </div>
  );
}
