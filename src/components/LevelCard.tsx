import { useLayoutEffect, useRef, useState } from 'react';

import { ENERGY_LABEL, KIND_LABEL, STORY_LABEL, type Level } from '../data/types';

import { Marquee } from './Marquee';

// Fractional card heights on phones make scrollHeight round up and clientHeight round down,
// so text that fits can still "overflow" by a pixel or two. Only scroll beyond that.
const MIN_OVERFLOW_PX = 2;

export function LevelCard({ level }: { level: Level }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = level.image && !imgFailed;

  const descRef = useRef<HTMLParagraphElement>(null);
  const [descScrolls, setDescScrolls] = useState(false);

  useLayoutEffect(() => {
    const descEl = descRef.current;
    if (!descEl) return;
    const measure = () => setDescScrolls(descEl.scrollHeight - descEl.clientHeight > MIN_OVERFLOW_PX);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(descEl);
    // Web fonts can change the text height after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [level.description]);

  return (
    <article className={`card card-${level.story}`}>
      <div className="card-media">
        {showImage ? (
          <img
            className="media-main"
            src={level.image}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="card-art" aria-hidden="true">
            <span>{level.title.charAt(0)}</span>
          </div>
        )}
        <span className={`badge badge-${level.story}`}>{STORY_LABEL[level.story]}</span>
        <span className="kind-badge">{KIND_LABEL[level.kind]}</span>
        <div className="card-tags">
          <span className={`tag tag-${level.energy}`}>{ENERGY_LABEL[level.energy]}</span>
          {level.boss && <span className="tag tag-boss">Boss</span>}
        </div>
      </div>

      <div className="card-body">
        <Marquee className="card-chapter" text={level.chapterTitle} />

        <h2 className="card-title">
          <Marquee text={level.title} />
        </h2>
        <p className="card-tagline" title={level.tagline}>
          {level.tagline}
        </p>
        <p ref={descRef} className={`card-desc ${descScrolls ? 'is-scrollable' : ''}`}>
          {level.description}
        </p>
      </div>
    </article>
  );
}
