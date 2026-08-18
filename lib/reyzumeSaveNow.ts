/**
 * Registers the editor's saveNow so chrome outside useReyzumeSync
 * (e.g. SavingIndicator Retry) can trigger a flush.
 */

type SaveNowFn = () => Promise<void>;

let saveNowFn: SaveNowFn | null = null;

export function setReyzumeSaveNow(fn: SaveNowFn | null) {
  saveNowFn = fn;
}

export async function retryReyzumeSave(): Promise<void> {
  if (!saveNowFn) return;
  await saveNowFn();
}
