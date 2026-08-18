/**
 * Browser detection utilities.
 *
 * These are intentionally narrow checks used for progressive disclosure
 * in the UI (e.g., showing Safari-specific print guidance), NOT for
 * feature gating.  Feature detection (`@supports`, `matchMedia`, etc.)
 * should still be preferred for CSS/JS capability checks.
 */

/**
 * Detects Safari on macOS or iOS.
 *
 * The negative lookahead excludes Chromium-based browsers (Chrome, Edge,
 * Opera, Brave, Arc, etc.) and Android WebView, all of which include
 * "Safari" in their UA string but are NOT Safari.
 *
 * @returns `true` if the current browser is Safari (macOS or iOS).
 *
 * @example
 * ```ts
 * if (isSafari()) {
 *   // show Safari-specific guidance
 * }
 * ```
 */
export function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android|chromium|edg|opr|brave).)*safari/i.test(
    navigator.userAgent,
  );
}
