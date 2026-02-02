// Helper to generate IDs that works in non-secure contexts (like mobile dev)
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for dev environments without HTTPS
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Strips trailing empty <p></p> tags that Tiptap adds after bullet lists.
 * Also handles variations like <p><br></p> or <p><br/></p>.
 */
export function stripTrailingEmptyParagraphs(html: string): string {
  if (!html) return html;
  // Remove trailing <p></p>, <p><br></p>, <p><br/></p> patterns
  return html.replace(/(<p>(\s*<br\s*[^>]*\/?>)?\s*<\/p>\s*)+$/gi, "").trim();
}

/**
 * Recursively sanitize all HTML string fields in a section's content.
 * This cleans up Tiptap artifacts before saving to the database.
 */
export function sanitizeSectionContent<T>(content: T): T {
  if (typeof content === "string") {
    return stripTrailingEmptyParagraphs(content) as T;
  }
  if (Array.isArray(content)) {
    return content.map(sanitizeSectionContent) as T;
  }
  if (content && typeof content === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(content)) {
      sanitized[key] = sanitizeSectionContent(value);
    }
    return sanitized as T;
  }
  return content;
}