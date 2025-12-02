"use client";

import { useReyzumeStore } from "@/hooks/useReyzumeStore";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SavingIndicator() {
  const isSaving = useReyzumeStore((state) => state.isSaving);
  const [showSaved, setShowSaved] = useState(false);
  const prevIsSavingRef = useRef(isSaving);

  useEffect(() => {
    if (prevIsSavingRef.current && !isSaving) {
      const showTimer = setTimeout(() => setShowSaved(true), 0);
      const hideTimer = setTimeout(() => setShowSaved(false), 2000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    prevIsSavingRef.current = isSaving;
  }, [isSaving]);
  if (!isSaving && !showSaved) return null;

  return (
    <div className="fixed top-24 right-2 md:right-4 text-xl text-muted-foreground print:hidden z-50 bg-white shadow-2xl px-4 py-2 rounded-xl">
      {isSaving && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground ">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving
        </div>
      )}
      {showSaved && !isSaving && (
        <div className="flex items-center gap-1 text-sm text-green-400">
          <Check className="h-4 w-4" />
          Saved
        </div>
      )}
    </div>
  );
}
