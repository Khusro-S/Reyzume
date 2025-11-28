"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useReyzumeStore } from "./useReyzumeStore";
import { useDebounce } from "@uidotdev/usehooks";

export function useReyzumeSync(reyzumeId: Id<"reyzumes">) {
  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateContent = useMutation(api.reyzumes.updateContent);
  
  const [isSaving, setIsSaving] = useState(false);

  const {
    setCurrentReyzumeId,
    loadSections,
    getSectionsAsJson,
    isDirty,
    setIsLoading,
    markClean,
    sections,
  } = useReyzumeStore();

  const hasLoadedRef = useRef(false);
  const lastSavedContentRef = useRef<string | null>(null);
  const currentReyzumeIdRef = useRef<string | null>(null);

  // Debug log
  console.log("useReyzumeSync - reyzumeId:", reyzumeId, "reyzume:", reyzume);

  // Load content when resume data is fetched
  useEffect(() => {
    // console.log(
    //   "Load effect - reyzume:",
    //   reyzume,
    //   "currentRef:",
    //   currentReyzumeIdRef.current
    // );

    // Skip if still loading from Convex
    if (reyzume === undefined) {
      console.log("Still loading from Convex...");
      return;
    }

    // Skip if we already loaded this reyzume
    if (currentReyzumeIdRef.current === reyzumeId) {
      console.log("Already loaded this reyzume");
      return;
    }

    // Mark as loaded for this reyzumeId
    currentReyzumeIdRef.current = reyzumeId;
    setCurrentReyzumeId(reyzumeId);

    if (reyzume) {
      //   console.log("Loading sections from reyzume.content:", reyzume.content);
      loadSections(reyzume.content);
      lastSavedContentRef.current = reyzume.content || null;
    } else {
      console.log("Reyzume is null, loading defaults");
      loadSections(undefined);
    }
  }, [reyzume, reyzumeId, setCurrentReyzumeId, loadSections]);

  // Reset when reyzumeId changes
  useEffect(() => {
    return () => {
      // Cleanup on unmount or reyzumeId change
      currentReyzumeIdRef.current = null;
      lastSavedContentRef.current = null;
    };
  }, [reyzumeId]);

  // Debounce the sections to trigger save after 1 second of no changes
  const debouncedSections = useDebounce(sections, 1000);

  // Auto-save when debounced sections change
  useEffect(() => {
    // Don't save if we haven't loaded yet
    if (currentReyzumeIdRef.current !== reyzumeId) return;

    const currentContent = JSON.stringify(debouncedSections);

    // Skip if content hasn't changed from last save
    if (currentContent === lastSavedContentRef.current) {
      return;
    }

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
  }, [debouncedSections, updateContent, reyzumeId, markClean]);

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
  }, [getSectionsAsJson, updateContent, reyzumeId, markClean]);

  // isLoading is true when Convex query hasn't returned yet
  const isLoading = reyzume === undefined;

  return {
    isLoading,
    isSaving,
    isDirty,
    saveNow,
    reyzume,
  };
}
