import type { Level } from '../data/types';

/**
 * Pick a random level from the pool, avoiding recently picked ids when possible.
 * Falls back to the full pool if every candidate was picked recently.
 */
export function pickRandom(pool: Level[], recent: string[], currentId?: string): Level | undefined {
  if (pool.length === 0) return undefined;
  const fresh = pool.filter(l => !recent.includes(l.id) && l.id !== currentId);
  const candidates = fresh.length > 0 ? fresh : pool.filter(l => l.id !== currentId);
  const from = candidates.length > 0 ? candidates : pool;
  return from[Math.floor(Math.random() * from.length)];
}
