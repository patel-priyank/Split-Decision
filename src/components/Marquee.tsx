import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Single-line text that scrolls back and forth (like a media player's track title)
 * when it doesn't fit. Short text stays still.
 */
export function Marquee({ text, className = '' }: { text: string; className?: string }) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const overflow = i.scrollWidth - o.clientWidth;
      setShift(overflow > 1 ? Math.ceil(overflow) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    // Web fonts can change the width after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [text]);

  const style = shift
    ? ({ '--shift': `-${shift}px`, '--dur': `${(4 + shift / 25).toFixed(1)}s` } as CSSProperties)
    : undefined;

  return (
    <span
      ref={outer}
      className={`marquee ${shift ? 'is-scrolling' : ''} ${className}`}
      style={style}
      title={shift ? text : undefined}
    >
      <span ref={inner} className="marquee-inner">
        {text}
      </span>
    </span>
  );
}
