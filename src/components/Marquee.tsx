import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

// Scroll duration = base (covers the pauses at each end) + overflow distance / speed.
const BASE_SECONDS = 2;
const PX_PER_SECOND = 80;
// Ignore sub-pixel overflow from rounding, so text that fits doesn't scroll.
const MIN_OVERFLOW_PX = 1;

/**
 * Single-line text that scrolls back and forth (like a media player's track title)
 * when it doesn't fit. Short text stays still.
 */
export function Marquee({ text, className = '' }: { text: string; className?: string }) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (!outerEl || !innerEl) return;
    const measure = () => {
      const overflow = innerEl.scrollWidth - outerEl.clientWidth;
      setShift(overflow > MIN_OVERFLOW_PX ? Math.ceil(overflow) : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outerEl);
    // Web fonts can change the width after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [text]);

  const style = shift
    ? ({
        '--shift': `-${shift}px`,
        '--dur': `${(BASE_SECONDS + shift / PX_PER_SECOND).toFixed(1)}s`
      } as CSSProperties)
    : undefined;

  return (
    <span
      ref={outerRef}
      className={`marquee ${shift ? 'is-scrolling' : ''} ${className}`}
      style={style}
      title={shift ? text : undefined}
    >
      <span ref={innerRef} className="marquee-inner">
        {text}
      </span>
    </span>
  );
}
