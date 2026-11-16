import { useState } from 'react';

import { ENERGY_LABEL, KIND_LABEL, STORY_LABEL, type Level } from '../data/types';

import { Marquee } from './Marquee';

export function LevelCard({ level }: { level: Level }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = level.image && !imgFailed;

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
        <p className="card-desc">{level.description}</p>
      </div>
    </article>
  );
}
