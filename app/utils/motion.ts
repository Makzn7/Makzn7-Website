/**
 * True when the user has asked the OS to minimize non-essential motion.
 * Safe to call on the server (returns false there).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
