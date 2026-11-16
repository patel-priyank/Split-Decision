// Decorative icons; the buttons that use them carry the accessible label.

export function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
      <rect x="14" y="4" width="4" height="4" fill="currentColor" />
      <rect x="8" y="10" width="4" height="4" fill="currentColor" />
      <rect x="16" y="16" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

export function DiceIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="8" cy="8" r="1.7" fill="currentColor" />
      <circle cx="16" cy="8" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="8" cy="16" r="1.7" fill="currentColor" />
      <circle cx="16" cy="16" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <rect x="10.8" y="10" width="2.4" height="8" fill="currentColor" />
      <rect x="10.8" y="6" width="2.4" height="2.4" fill="currentColor" />
    </svg>
  );
}

export function UndoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path d="M4 9h11a5 5 0 0 1 0 10H9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
      <path d="M8 5 4 9l4 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
      <path d="M3 3v5h5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}
