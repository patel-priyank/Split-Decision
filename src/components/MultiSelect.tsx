import { useEffect, useId, useRef, useState } from 'react';

interface Props<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
}

export function MultiSelect<T extends string>({ label, options, value, onChange }: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (option: T) =>
    onChange(value.includes(option) ? value.filter(selected => selected !== option) : [...value, option]);
  const summary =
    value.length === 0
      ? 'Any'
      : options
          .filter(o => value.includes(o.value))
          .map(o => o.label)
          .join(', ');

  return (
    <div className={`ms ${open ? 'open' : ''}`} ref={rootRef}>
      <span className="field-label">{label}</span>
      <button
        type="button"
        className="ms-trigger"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(o => !o)}
      >
        <span className={`ms-value ${value.length ? '' : 'is-any'}`}>{summary}</span>
        {value.length > 0 && <span className="ms-count">{value.length}</span>}
        <span className="chev" aria-hidden="true" />
      </button>
      {open && (
        <ul className="ms-list" id={listId} aria-label={label}>
          {options.map(option => {
            const selected = value.includes(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  aria-pressed={selected}
                  className={`menu-row ${selected ? 'selected' : ''}`}
                  onClick={() => toggle(option.value)}
                >
                  <span className="check" aria-hidden="true" />
                  {option.label}
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
