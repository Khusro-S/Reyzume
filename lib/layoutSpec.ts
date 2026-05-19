import type React from "react";

// ─── Token shape ──────────────────────────────────────────────────────────────
// All values are CSS length strings (em-based so they scale with font-size).
// These become CSS custom properties injected on the resume root element.
// Every spacing decision in section/item components consumes these vars instead
// of hard-coded Tailwind classes, giving a single source of truth.

export interface ResumeLayoutSpec {
  /** Vertical gap between top-level resume sections (Experience, Education …) */
  sectionGap: string;
  /** Vertical gap between items inside a section (job1 → job2) */
  itemGap: string;
  /** Vertical gap between rows inside a single item (company → title → description) */
  blockGap: string;
  /** Gap between a section header/divider and its first item */
  headerContentGap: string;
}

// ─── Named density presets ────────────────────────────────────────────────────
// Used by the Spacing toolbar and future template defaults.
// Values are em-relative so they auto-scale when the user changes font size.

export const LAYOUT_DENSITIES = {
  compact: {
    sectionGap: "1.35em",
    itemGap: "1.2em",
    blockGap: "0.05em",
    headerContentGap: "0.15em",
  },
  normal: {
    sectionGap: "0.6em",
    itemGap: "0.4em",
    blockGap: "0.1em",
    headerContentGap: "0.25em",
  },
  relaxed: {
    sectionGap: "0.9em",
    itemGap: "0.65em",
    blockGap: "0.15em",
    headerContentGap: "0.4em",
  },
} as const satisfies Record<string, ResumeLayoutSpec>;

export type LayoutDensity = keyof typeof LAYOUT_DENSITIES;

export const DEFAULT_LAYOUT_DENSITY: LayoutDensity = "normal";
export const DEFAULT_LAYOUT = LAYOUT_DENSITIES[DEFAULT_LAYOUT_DENSITY];

// ─── CSS variable names (single source of truth) ─────────────────────────────
export const LAYOUT_CSS_VARS = {
  sectionGap: "--resume-section-gap",
  itemGap: "--resume-item-gap",
  blockGap: "--resume-block-gap",
  headerContentGap: "--resume-header-content-gap",
} as const;

// ─── Helper: build an inline-style object from a spec ────────────────────────
// Injected on the resume canvas root (ReyzumeBuilder container).
// All child components consume the vars — no props needed.

export function getLayoutCSSVars(
  spec: ResumeLayoutSpec = DEFAULT_LAYOUT,
): React.CSSProperties {
  return {
    [LAYOUT_CSS_VARS.sectionGap]: spec.sectionGap,
    [LAYOUT_CSS_VARS.itemGap]: spec.itemGap,
    [LAYOUT_CSS_VARS.blockGap]: spec.blockGap,
    [LAYOUT_CSS_VARS.headerContentGap]: spec.headerContentGap,
  } as React.CSSProperties;
}

// ─── Helper: get a spec by density key ───────────────────────────────────────
export function getLayoutByDensity(
  density: string | undefined,
): ResumeLayoutSpec {
  const key = density as LayoutDensity;
  return LAYOUT_DENSITIES[key] ?? DEFAULT_LAYOUT;
}
