export type Story = 'mio' | 'zoe' | 'both';
export type Kind = 'level' | 'side-story';
export type Energy = 'chill' | 'medium' | 'intense';

type BossFilter = 'any' | 'only' | 'none';

export interface Level {
  id: string;
  title: string;
  kind: Kind;
  /** Chapter this belongs to (side stories: the chapter they are found in) */
  chapterTitle: string;
  story: Story;
  energy: Energy;
  boss: boolean;
  /** One-liner shown under the title */
  tagline: string;
  /** Short description of what happens in this level */
  description: string;
  /** Optional image URL (wiki screenshot) */
  image?: string;
}

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

export function activeFilterCount(filters: FilterState): number {
  return (
    (filters.story !== 'all' ? 1 : 0) +
    (filters.energy.length ? 1 : 0) +
    (filters.boss !== 'any' ? 1 : 0) +
    (filters.kinds.length ? 1 : 0)
  );
}

export const STORY_LABEL: Record<Story, string> = {
  mio: 'Mio · Sci-fi',
  zoe: 'Zoe · Fantasy',
  both: 'Both'
};

export const KIND_LABEL: Record<Kind, string> = {
  'level': 'Level',
  'side-story': 'Side story'
};

export const ENERGY_LABEL: Record<Energy, string> = {
  chill: 'Chill',
  medium: 'Medium',
  intense: 'Intense'
};

export const BOSS_LABEL: Record<BossFilter, string> = {
  any: 'Any',
  only: 'Only bosses',
  none: 'No bosses'
};
