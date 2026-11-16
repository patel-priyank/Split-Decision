import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

/** Drawer that slides up over the card. Shared by the Filters and Info panels. */
export function Sheet({ open, onClose, label, children }: Props) {
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Move focus into the dialog on open and hand it back on close.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // preventScroll: the sheet is still translated off-screen here, and a plain focus() would scroll
    // the overflow-hidden .stage to reveal it, leaving the card shifted up after the sheet closes.
    sheet?.focus({ preventScroll: true });
    return () => {
      // Only restore if focus was lost or is still in the sheet, so closing via the dice doesn't steal focus.
      const active = document.activeElement;
      if (!active || active === document.body || sheet?.contains(active)) previous?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <div className={`sheet-layer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="sheet-backdrop" onClick={onClose} />
      <section
        ref={sheetRef}
        className="sheet"
        role="dialog"
        aria-label={label}
        tabIndex={-1}
        inert={!open}
      >
        {children}
      </section>
    </div>
  );
}
