import { useCallback, useEffect, useMemo, useState } from 'react';
import { activeFilterCount, DEFAULT_FILTERS, FilterSheet, type FilterState } from './components/FilterSheet';
import { InfoSheet } from './components/InfoSheet';
import { LevelCard } from './components/LevelCard';
import { LEVELS } from './data/levels';
import { BOSS_LABEL, ENERGY_LABEL, KIND_LABEL, type Level } from './data/types';
import { roll } from './lib/haptics';
import { load } from './lib/storage';
import { pickRandom } from './lib/random';
import { useStoredState } from './lib/useStoredState';

const RECENT_LIMIT = 5;

// Clean up data from the removed "played history" feature.
try {
  localStorage.removeItem('sd:played');
} catch {
  /* ignore */
}

function matches(level: Level, f: FilterState): boolean {
  if (f.story !== 'all' && level.story !== f.story) return false;
  if (f.energy.length && !f.energy.includes(level.energy)) return false;
  if (f.boss === 'only' && !level.boss) return false;
  if (f.boss === 'none' && level.boss) return false;
  if (f.kinds.length && !f.kinds.includes(level.kind)) return false;
  return true;
}

// Merge with defaults and drop values that no longer exist (old moods, removed 'chapter' type, ...).
function sanitise(f: Partial<FilterState> | null | undefined): FilterState {
  const m = { ...DEFAULT_FILTERS, ...(f ?? {}) };
  return {
    story: ['all', 'mio', 'zoe', 'both'].includes(m.story) ? m.story : 'all',
    energy: Array.isArray(m.energy) ? m.energy.filter(e => e in ENERGY_LABEL) : [],
    boss: m.boss in BOSS_LABEL ? m.boss : 'any',
    kinds: Array.isArray(m.kinds) ? m.kinds.filter(k => k in KIND_LABEL) : []
  };
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

const filterPool = (f: FilterState) => LEVELS.filter(l => matches(l, f));

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
      <rect x="14" y="4" width="4" height="4" fill="currentColor" />
      <rect x="8" y="10" width="4" height="4" fill="currentColor" />
      <rect x="16" y="16" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="8" cy="8" r="1.7" fill="currentColor" />
      <circle cx="16" cy="8" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="8" cy="16" r="1.7" fill="currentColor" />
      <circle cx="16" cy="16" r="1.7" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <rect x="10.8" y="10" width="2.4" height="8" fill="currentColor" />
      <rect x="10.8" y="6" width="2.4" height="2.4" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [storedFilters, setFilters] = useStoredState<FilterState>('sd:filters', DEFAULT_FILTERS);
  const filters = useMemo(() => sanitise(storedFilters), [storedFilters]);
  const [recent, setRecent] = useStoredState<string[]>('sd:recent', []);
  const [openSheet, setOpenSheet] = useState<'filters' | 'info' | null>(null);

  // Deal a fresh pick on load, using the saved filters.
  const [currentId, setCurrentId] = useState<string | undefined>(
    () => pickRandom(filterPool(sanitise(load('sd:filters', DEFAULT_FILTERS))), load<string[]>('sd:recent', []))?.id
  );
  const [spinKey, setSpinKey] = useState(0);

  // Fade the UI in once the web fonts are ready (max ~1s), so text doesn't visibly swap fonts on load.
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
    const timer = setTimeout(show, 1000);
    return () => clearTimeout(timer);
  }, []);

  const pool = useMemo(() => filterPool(filters), [filters]);
  const current = LEVELS.find(l => l.id === currentId);
  const activeCount = activeFilterCount(filters);

  const remember = useCallback(
    (id: string) => setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, RECENT_LIMIT)),
    [setRecent]
  );

  // Record the on-load pick so it won't come straight back next time.
  useEffect(() => {
    if (currentId) remember(currentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function randomise() {
    // Close any open drawer so the new pick is visible.
    setOpenSheet(null);
    const next = pickRandom(pool, recent, currentId);
    if (!next) return;
    roll();
    setCurrentId(next.id);
    remember(next.id);
    setSpinKey(k => k + 1);
  }

  const closeSheet = useCallback(() => setOpenSheet(null), []);
  const toggleSheet = (sheet: 'filters' | 'info') => setOpenSheet(o => (o === sheet ? null : sheet));

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
        <div className={`card-slot ${spinKey ? 'is-dealt' : ''}`} key={spinKey}>
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
          onChange={setFilters}
          onClose={closeSheet}
          matchCount={pool.length}
        />
        <InfoSheet open={openSheet === 'info'} onClose={closeSheet} />
      </main>

      <nav className="bottom-bar">
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
          onClick={randomise}
          disabled={pool.length === 0}
          aria-label={pool.length === 0 ? 'No matches for these filters' : 'Pick another'}
          title={pool.length === 0 ? 'No matches for these filters' : 'Pick another'}
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
      </nav>
    </div>
  );
}
