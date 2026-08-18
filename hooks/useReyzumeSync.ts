"use client";

import { useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useReyzumeStore } from "./useReyzumeStore";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { setReyzumeSaveNow } from "@/lib/reyzumeSaveNow";

const MAX_SAVE_ATTEMPTS = 2;
const SAVE_ATTEMPT_TIMEOUT_MS = 10_000;
const RETRY_BACKOFF_MS = [2_000] as const;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Save timed out")), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

export function useReyzumeSync(reyzumeId: Id<"reyzumes">) {
  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateContent = useMutation(api.reyzumes.updateContent);
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get("print") === "true";

  const {
    setCurrentReyzumeId,
    loadSections,
    getSectionsAsJson,
    isDirty,
    isSaving,
    setIsSaving,
    setLastSaveStatus,
    markClean,
    sections,
  } = useReyzumeStore();

  const lastSavedContentRef = useRef<string | null>(null);
  const currentReyzumeIdRef = useRef<string | null>(null);
  // Bumped on resume switch / unmount so late work ignores client state updates.
  const saveGenerationRef = useRef(0);
  // Serialize saves so an older Convex write cannot overwrite a newer one on the server.
  const saveQueueRef = useRef(Promise.resolve());

  // Load content when resume data is fetched
  useEffect(() => {
    if (reyzume === undefined) return;

    if (currentReyzumeIdRef.current === reyzumeId) return;

    currentReyzumeIdRef.current = reyzumeId;
    setCurrentReyzumeId(reyzumeId);

    if (reyzume) {
      loadSections(reyzume.content);
      // Baseline against the store (after sanitize path), not raw server JSON.
      lastSavedContentRef.current = useReyzumeStore.getState().getSectionsAsJson();
    } else {
      loadSections(undefined);
      lastSavedContentRef.current = useReyzumeStore.getState().getSectionsAsJson();
    }
  }, [reyzume, reyzumeId, setCurrentReyzumeId, loadSections]);

  // Invalidate in-flight saves when switching resumes or leaving the editor
  useEffect(() => {
    return () => {
      saveGenerationRef.current += 1;
      currentReyzumeIdRef.current = null;
      lastSavedContentRef.current = null;
      // SavingIndicator lives in the layout and survives navigation. In-flight
      // persistContent skips setIsSaving(false) when stale, so reset UI here.
      const store = useReyzumeStore.getState();
      store.setIsSaving(false);
      store.setLastSaveStatus("idle");
    };
  }, [reyzumeId]);

  const persistContent = useCallback(
    (source: "debounce" | "flush") => {
      const job = async () => {
        const generation = saveGenerationRef.current;
        const idAtStart = reyzumeId;
        const isCurrent = () =>
          generation === saveGenerationRef.current &&
          currentReyzumeIdRef.current === idAtStart;

        if (!isCurrent()) return;

        setIsSaving(true);
        setLastSaveStatus("idle");

        let lastError: unknown;

        try {
          // Re-read store each pass so edits during a write get a follow-up save,
          // and we never leave markClean() over a newer dirty draft.
          for (;;) {
            if (!isCurrent()) return;

            const currentContent = getSectionsAsJson();
            if (currentContent === lastSavedContentRef.current) {
              markClean();
              setLastSaveStatus("ok");
              break;
            }

            let saved = false;
            for (let attempt = 1; attempt <= MAX_SAVE_ATTEMPTS; attempt++) {
              if (!isCurrent()) return;

              try {
                await withTimeout(
                  updateContent({ id: reyzumeId, content: currentContent }),
                  SAVE_ATTEMPT_TIMEOUT_MS
                );

                if (!isCurrent()) return;

                lastSavedContentRef.current = currentContent;
                // Only clear dirty if nothing newer was typed during the network call.
                if (getSectionsAsJson() === currentContent) {
                  markClean();
                }
                setLastSaveStatus("ok");
                saved = true;
                break;
              } catch (error) {
                lastError = error;
                if (!isCurrent()) return;

                if (attempt < MAX_SAVE_ATTEMPTS) {
                  await delay(RETRY_BACKOFF_MS[attempt - 1] ?? 5_000);
                }
              }
            }

            if (!saved) {
              if (!isCurrent()) return;
              setLastSaveStatus("error");
              toast.error(
                "Could not save resume. Your latest edits are still local."
              );
              console.error("Failed to save resume:", lastError);

              if (source === "flush") {
                throw lastError instanceof Error
                  ? lastError
                  : new Error("Failed to save resume");
              }
              return;
            }

            // If the user edited while that write was in flight, loop and save again.
            if (getSectionsAsJson() === lastSavedContentRef.current) break;
          }
        } finally {
          if (isCurrent()) {
            setIsSaving(false);
          }
        }
      };

      const next = saveQueueRef.current.then(job, job);
      // Keep the queue alive even if a job throws (flush failures).
      saveQueueRef.current = next.then(
        () => undefined,
        () => undefined
      );
      return next;
    },
    [
      reyzumeId,
      updateContent,
      markClean,
      setIsSaving,
      setLastSaveStatus,
      getSectionsAsJson,
    ]
  );

  // Debounce the sections to trigger save after 1 second of no changes
  const debouncedSections = useDebounce(sections, 1000);

  useEffect(() => {
    // Print iframe is read-only for export — don't write back to Convex.
    if (isPrintMode) return;
    if (currentReyzumeIdRef.current !== reyzumeId) return;

    const currentContent = getSectionsAsJson();

    // Skip if nothing changed vs last successful save (covers the first tick after load).
    if (currentContent === lastSavedContentRef.current) return;

    void persistContent("debounce");
  }, [
    debouncedSections,
    persistContent,
    reyzumeId,
    getSectionsAsJson,
    isPrintMode,
  ]);

  const saveNow = useCallback(async () => {
    if (isPrintMode) return;
    const currentContent = getSectionsAsJson();
    if (currentContent === lastSavedContentRef.current) {
      markClean();
      return;
    }
    await persistContent("flush");
  }, [getSectionsAsJson, persistContent, isPrintMode, markClean]);

  useEffect(() => {
    setReyzumeSaveNow(isPrintMode ? null : saveNow);
    return () => setReyzumeSaveNow(null);
  }, [saveNow, isPrintMode]);

  // Warn before closing/refreshing while unsaved edits exist.
  // Do not flush here — browsers cancel async work on unload; the dialog is the real safety net.
  useEffect(() => {
    if (isPrintMode) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!useReyzumeStore.getState().isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isPrintMode]);

  const isLoading = reyzume === undefined;

  return {
    isLoading,
    isSaving,
    isDirty,
    saveNow,
    reyzume,
  };
}
