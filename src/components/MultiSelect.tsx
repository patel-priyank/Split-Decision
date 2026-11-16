import { useEffect, useId, useRef, useState } from 'react';

interface Props<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
  /** Text shown when nothing is selected */
  anyLabel?: string;
}

export function MultiSelect<T extends string>({ label, options, value, onChange, anyLabel = 'Any' }: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (v: T) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  const summary =
    value.length === 0
      ? anyLabel
      : options
          .filter(o => value.includes(o.value))
          .map(o => o.label)
          .join(', ');

  return (
    <div className={`ms ${open ? 'open' : ''}`} ref={ref}>
      <span className="field-label">{label}</span>
      <button
        type="button"
        className="ms-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(o => !o)}
      >
        <span className={`ms-value ${value.length ? '' : 'is-any'}`}>{summary}</span>
        {value.length > 0 && <span className="ms-count">{value.length}</span>}
        <span className="chev" aria-hidden="true" />
      </button>
      {open && (
        <ul className="ms-list menu" id={listId} role="listbox" aria-multiselectable="true">
          {options.map(o => {
            const selected = value.includes(o.value);
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`menu-row ${selected ? 'selected' : ''}`}
                  onClick={() => toggle(o.value)}
                >
                  <span className="check" aria-hidden="true" />
                  {o.label}
                </button>
              </li>
            );
          })}
          {/* Always present (disabled when empty) so the list never changes size */}
          <li>
            <button
              type="button"
              className="menu-row clear-row"
              onClick={() => onChange([])}
              disabled={value.length === 0}
            >
              Clear
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
