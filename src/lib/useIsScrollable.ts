import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Tracks whether the referenced element's content overflows vertically, so it can be made
 * keyboard-focusable only when there is something to scroll. Re-measures on resize, once web
 * fonts load, and whenever `content` changes.
 */
export function useIsScrollable<T extends HTMLElement>(content?: unknown) {
  const ref = useRef<T>(null);
  const [scrollable, setScrollable] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScrollable(el.scrollHeight > el.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Web fonts can change the height after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [content]);

  return [ref, scrollable] as const;
}
