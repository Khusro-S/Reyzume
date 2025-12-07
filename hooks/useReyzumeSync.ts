"use client";

import { useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useReyzumeStore } from "./useReyzumeStore";
import { useDebounce } from "@uidotdev/usehooks";

export function useReyzumeSync(reyzumeId: Id<"reyzumes">) {
  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateContent = useMutation(api.reyzumes.updateContent);

  const {
    setCurrentReyzumeId,
    loadSections,
    getSectionsAsJson,
    isDirty,
    isSaving,
    setIsSaving,
    markClean,
    sections,
  } = useReyzumeStore();

  const lastSavedContentRef = useRef<string | null>(null);
  const currentReyzumeIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Load content when resume data is fetched
  useEffect(() => {
    if (reyzume === undefined) return;

    if (currentReyzumeIdRef.current === reyzumeId) return;

    // Mark as loaded for this reyzumeId
    currentReyzumeIdRef.current = reyzumeId;
    hasLoadedRef.current = false; // Reset for new resume
    setCurrentReyzumeId(reyzumeId);

    if (reyzume) {
      loadSections(reyzume.content);
      lastSavedContentRef.current = reyzume.content || null;
    } else {
      loadSections(undefined);
    }
  }, [reyzume, reyzumeId, setCurrentReyzumeId, loadSections]);

  // Reset when reyzumeId changes
  useEffect(() => {
    return () => {
      currentReyzumeIdRef.current = null;
      lastSavedContentRef.current = null;
      hasLoadedRef.current = false;
    };
  }, [reyzumeId]);

  // Debounce the sections to trigger save after 1 second of no changes
  const debouncedSections = useDebounce(sections, 1000);

  // Auto-save when debounced sections change
  useEffect(() => {
    if (currentReyzumeIdRef.current !== reyzumeId) return;

    if (!hasLoadedRef.current) {
      // First debounce after loading - mark as loaded and set baseline
      hasLoadedRef.current = true;
      const currentContent = JSON.stringify(debouncedSections);
      if (!lastSavedContentRef.current) {
        lastSavedContentRef.current = currentContent;
      }
      return;
    }

    const currentContent = JSON.stringify(debouncedSections);

    if (currentContent === lastSavedContentRef.current) return;

    const save = async () => {
      setIsSaving(true);
      try {
        await updateContent({ id: reyzumeId, content: currentContent });
        lastSavedContentRef.current = currentContent;
        markClean();
      } catch (error) {
        console.error("Failed to save resume:", error);
      } finally {
        setIsSaving(false);
      }
    };

    save();
  }, [debouncedSections, updateContent, reyzumeId, markClean, setIsSaving]);

  // Manual save function
  const saveNow = useCallback(async () => {
    const currentContent = getSectionsAsJson();
    if (currentContent === lastSavedContentRef.current) return;

    setIsSaving(true);
    try {
      await updateContent({ id: reyzumeId, content: currentContent });
      lastSavedContentRef.current = currentContent;
      markClean();
    } catch (error) {
      console.error("Failed to save resume:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [getSectionsAsJson, updateContent, reyzumeId, markClean, setIsSaving]);

  const isLoading = reyzume === undefined;

  return {
    isLoading,
    isSaving,
    isDirty,
    saveNow,
    reyzume,
  };
}
