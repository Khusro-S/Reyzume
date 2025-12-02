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

// Simple debounce function for zundo handleSet
// export function debounce<T extends (...args: never[]) => unknown>(
//   fn: T,
//   ms: number
// ): T {
//   let timeoutId: ReturnType<typeof setTimeout> | null = null;
//   return ((...args: Parameters<T>) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => fn(...args), ms);
//   }) as T;
// }
