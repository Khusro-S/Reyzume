"use client";

import { getSectionDefaultContent, Section } from "@/hooks/useReyzumeStore";
import { GripVertical } from "lucide-react";
import { cn, htmlToText } from "@/lib/utils";

interface SectionOverlayProps {
  section: Section;
}

/**
 * Gets the display title for a section.
 * Uses the section's own content.title if available, otherwise falls back to the default title.
 */
function getSectionTitle(section: Section): string {
  // For custom sections, use the actual (possibly user-edited) title
  if (section.type === "custom" && "title" in section.content) {
    return htmlToText((section.content as { title: string }).title);
  }

  // For other sections, get the title from content or fall back to default
  const content = section.content as { title?: string };
  if (content.title) {
    return content.title;
  }

  const defaultContent = getSectionDefaultContent(section.type) as { title?: string };
  return defaultContent.title ?? section.type;
}

/**
 * Lightweight preview shown in DragOverlay while dragging a section.
 * Renders a simple card instead of the full section content to prevent flicker.
 */
export function SectionOverlay({ section }: SectionOverlayProps) {
      const title = getSectionTitle(section);
      return (
        <div
          className={cn(
            "relative bg-white border-2 border-primary/50 rounded-lg shadow-lg px-4 py-3",
            "cursor-grabbing select-none",
            "min-w-50",
          )}
        >
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <span className="font-bold text-foreground">{title}</span>
          </div>
        </div>
      );
}
