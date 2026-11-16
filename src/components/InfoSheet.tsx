import { useLayoutEffect } from 'react';

import { useIsScrollable } from '../lib/useIsScrollable';

import { Sheet } from './Sheet';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InfoSheet({ open, onClose }: Props) {
  const [bodyRef, scrollable] = useIsScrollable<HTMLDivElement>();

  // Start from the top each time it opens. Layout effect, so the old position never shows during the slide-in.
  useLayoutEffect(() => {
    const bodyEl = bodyRef.current;
    if (open && bodyEl) bodyEl.scrollTop = 0;
  }, [open, bodyRef]);

  return (
    <Sheet open={open} onClose={onClose} label="About Split Decision">
      <header className="sheet-head">
        <h2 className="sheet-title">About</h2>
      </header>

      <div className="info-body" ref={bodyRef} tabIndex={scrollable ? 0 : undefined}>
        <p>
          Finished Split Fiction and just want to jump back in for a chill session? Split Decision picks a random place
          to start, so you don't have to.
        </p>
        <ul className="info-list">
          <li>
            <strong>The dice</strong> deals a random level or side story from all 8 chapters. A new one is dealt
            every time you open the app, and your last few picks won't come straight back.
          </li>
          <li>
            <strong>Filters</strong> narrow it down: whose story it is (Mio's sci-fi, Zoe's fantasy, or both), how much
            energy you've got, level or side story, and whether you're up for a boss fight. Tap Done to deal a new pick
            with them.
          </li>
          <li>Your filters are remembered on this device.</li>
          <li>Find the level in the game's chapter select and play from there.</li>
        </ul>
      </div>

      <footer className="sheet-foot sheet-foot-end">
        <button type="button" className="done-btn" onClick={onClose}>
          Got it
        </button>
      </footer>
      <p className="fineprint">
        Fan-made. Not affiliated with Hazelight or EA. Images and level details: Split Fiction Fextralife wiki.
      </p>
    </Sheet>
  );
}
