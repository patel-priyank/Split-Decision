// Light haptic feedback via the Vibration API.
// Works on Android browsers; iOS Safari doesn't support it, so this quietly does nothing there.

function vibrate(pattern: number | number[]): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/** Tiny tick for selecting an option. */
export const tick = () => vibrate(8);

/** Firmer single bump for a reset-style action. */
export const bump = () => vibrate(18);

/** Two quick taps, like a die rattling, for a new pick. */
export const roll = () => vibrate([12, 40, 12]);
