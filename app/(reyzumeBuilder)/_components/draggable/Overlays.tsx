"use client";

import { getSectionDefaultContent, Section } from "@/hooks/useReyzumeStore";
import { GripVertical } from "lucide-react";
import { cn, htmlToText } from "@/lib/utils";

interface DragOverlayCardProps {
  title: string;
  variant?: "section" | "item";
}

/**
 * Lightweight preview shown in DragOverlay while dragging.
 * Works for both main sections and subsection items.
 */
export function DragOverlayCard({
  title,
  variant = "section",
}: DragOverlayCardProps) {
  const isItem = variant === "item";

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-primary/50 rounded-lg shadow-lg",
        "cursor-grabbing select-none",
        isItem ? "px-3 py-2" : "px-4 py-3",
      )}
    >
      <div className={cn("flex items-center", isItem ? "gap-2" : "gap-3")}>
        <GripVertical
          className={cn(
            "text-muted-foreground",
            isItem ? "h-4 w-4" : "h-5 w-5",
          )}
        />
        <span
          className={cn(
            "text-foreground font-bold",
            isItem && "text-sm truncate max-w-60",
          )}
        >
          {title || "Item"}
        </span>
      </div>
    </div>
  );
}

/**
 * Gets the display title for a section.
 */
function getSectionTitle(section: Section): string {
  if (section.type === "custom" && "title" in section.content) {
    return htmlToText((section.content as { title: string }).title);
  }

  const content = section.content as { title?: string };
  if (content.title) {
    return content.title;
  }

  const defaultContent = getSectionDefaultContent(section.type) as {
    title?: string;
  };
  return defaultContent.title ?? section.type;
}

/**
 * Extracts a display label from a subsection item object.
 */
export function getItemLabel(item: Record<string, unknown>): string {
  const labelFields = [
    "title",
    "name",
    "label",
    "degree",
    "company",
    "school",
    "issuer",
  ];

  for (const field of labelFields) {
    if (typeof item[field] === "string" && item[field]) {
      return htmlToText(item[field] as string);
    }
  }

  return "Item";
}

interface OverlayProps {
  section: Section;
}

/** Overlay for main sections (used in ReyzumeBuilder) */
export function SectionOverlay({ section }: OverlayProps) {
  return <DragOverlayCard title={getSectionTitle(section)} variant="section" />;
}

interface ItemOverlayProps {
  item: Record<string, unknown>;
}

/** Overlay for subsection items (used in SortableItemList) */
export function ItemOverlay({ item }: ItemOverlayProps) {
  return <DragOverlayCard title={getItemLabel(item)} variant="item" />;
}
