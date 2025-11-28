"use client";

import { useReyzumeStore } from "@/hooks/useReyzumeStore";
import { Button } from "@/components/ui/button";
import { EyeOff, RotateCcw, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function HiddenSectionsPanel() {
  const sections = useReyzumeStore((state) => state.sections);
  const toggleVisibility = useReyzumeStore(
    (state) => state.toggleSectionVisibility
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hiddenSections = sections.filter((s) => !s.isVisible);

  // Prevent body scroll when panel is expanded and being scrolled
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isExpanded) return;

      const { scrollTop, scrollHeight, clientHeight } = panel;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable) {
        e.preventDefault();
        return;
      }

      // At top and trying to scroll up
      const isAtTop = scrollTop === 0 && e.deltaY < 0;
      // At bottom and trying to scroll down
      const isAtBottom =
        scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isExpanded) return;

      const { scrollTop, scrollHeight, clientHeight } = panel;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable) {
        e.preventDefault();
      }
    };

    panel.addEventListener("wheel", handleWheel, { passive: false });
    panel.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      panel.removeEventListener("wheel", handleWheel);
      panel.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isExpanded]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  if (hiddenSections.length === 0) return null;

  const handleRestoreAll = () => {
    hiddenSections.forEach((section) => {
      toggleVisibility(section.id);
    });
    setIsExpanded(false);
  };

  const handleRestore = (sectionId: string) => {
    toggleVisibility(sectionId);
    // Collapse if no more hidden sections
    if (hiddenSections.length <= 1) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {/* {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 print:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )} */}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 bg-background border rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-56 print:hidden z-50">
        {/* Header - always visible, clickable to expand/collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <EyeOff className="h-4 w-4" />
            <span>Hidden Sections ({hiddenSections.length})</span>
          </div>
          <ChevronUp
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Content - expandable */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-54" : "max-h-0"
          }`}
        >
          <div className="px-3 pb-3 space-y-1">
            {/* Section list */}
            <div
              ref={panelRef}
              className="max-h-40 flex flex-col gap-1 overflow-y-auto overscroll-contain"
            >
              {hiddenSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="capitalize truncate">{section.type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 shrink-0"
                    onClick={() => handleRestore(section.id)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Restore</span>
                  </Button>
                </div>
              ))}
            </div>

            {/* Restore All button */}
            {hiddenSections.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleRestoreAll}
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Restore All ({hiddenSections.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
