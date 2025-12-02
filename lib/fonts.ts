export const RESUME_FONTS = [
  { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Arial", value: "Arial, Helvetica, sans-serif" },
  { name: "Courier", value: "'Courier New', Courier, monospace" },
] as const;

export const DEFAULT_FONT = RESUME_FONTS[0];

export type ResumeFont = (typeof RESUME_FONTS)[number];

export function getFontByValue(value: string | undefined): ResumeFont {
  return RESUME_FONTS.find((f) => f.value === value) ?? DEFAULT_FONT;
}

export const FONT_SIZES = [
  { label: "Small", value: "10pt" },
  { label: "Normal", value: "11pt" },
  { label: "Medium", value: "12pt" },
  { label: "Large", value: "14pt" },
] as const;

export const DEFAULT_FONT_SIZE = FONT_SIZES[1];
export type FontSizeType = (typeof FONT_SIZES)[number];

export function getFontSizeByValue(value: string | undefined) {
  return FONT_SIZES.find((s) => s.value === value) ?? DEFAULT_FONT_SIZE;
}

// Margin presets (in mm)
export const MARGIN_PRESETS = {
  narrow: { vertical: "5", horizontal: "5" },
  normal: { vertical: "10", horizontal: "10" },
  wide: { vertical: "15", horizontal: "15" },
} as const;

export const DEFAULT_MARGIN_VERTICAL = "10";
export const DEFAULT_MARGIN_HORIZONTAL = "10";

export const MIN_MARGIN = 0;
export const MAX_MARGIN = 25;

export function getMarginValue(
  value: string | undefined,
  defaultValue: string
): number {
  if (!value) return parseInt(defaultValue);
  const parsed = parseInt(value);
  return isNaN(parsed) ? parseInt(defaultValue) : parsed;
}
