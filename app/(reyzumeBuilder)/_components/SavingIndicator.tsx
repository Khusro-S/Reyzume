"use client";

import { useReyzumeStore } from "@/hooks/useReyzumeStore";
import { retryReyzumeSave } from "@/lib/reyzumeSaveNow";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SavingIndicator() {
  const isSaving = useReyzumeStore((state) => state.isSaving);
  const lastSaveStatus = useReyzumeStore((state) => state.lastSaveStatus);
  const [showSaved, setShowSaved] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const prevIsSavingRef = useRef(isSaving);

  useEffect(() => {
    const justFinished = prevIsSavingRef.current && !isSaving;
    prevIsSavingRef.current = isSaving;

    if (!justFinished) return;

    // Only flash "Saved" after a successful write — not after a failed or cancelled save.
    if (lastSaveStatus === "ok") {
      setShowSaved(true);
      const hideTimer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(hideTimer);
    }
  }, [isSaving, lastSaveStatus]);

  // Clear local "Saved" flash if sync resets status (e.g. left the editor).
  useEffect(() => {
    if (lastSaveStatus === "idle" && !isSaving) {
      setShowSaved(false);
    }
  }, [lastSaveStatus, isSaving]);

  const showError = lastSaveStatus === "error" && !isSaving;

  if (!isSaving && !showSaved && !showError) return null;

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await retryReyzumeSave();
    } catch {
      // persistContent already toasts on final failure
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="fixed top-24 right-2 md:right-4 text-xl text-muted-foreground print:hidden z-50 bg-white shadow-2xl px-4 py-2 rounded-xl">
      {isSaving && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground ">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving
        </div>
      )}
      {showSaved && !isSaving && !showError && (
        <div className="flex items-center gap-1 text-sm text-green-400">
          <Check className="h-4 w-4" />
          Saved
        </div>
      )}
      {showError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Save failed</span>
          <button
            type="button"
            onClick={() => void handleRetry()}
            disabled={isRetrying}
            className="font-medium underline underline-offset-2 hover:text-red-600 disabled:opacity-50"
          >
            {isRetrying ? "Retrying…" : "Retry"}
          </button>
        </div>
      )}
    </div>
  );
}
