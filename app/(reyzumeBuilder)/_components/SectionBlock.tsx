"use client";

import { Section } from "@/hooks/useReyzumeStore";
import { DraggableSectionBlock } from "./draggable/DraggableSectionBlock";
import { SectionContent } from "./draggable/SectionContent";

interface SectionBlockProps {
  section: Section;
  isDraggable?: boolean;
}

export function SectionBlock({
  section,
  isDraggable = true,
}: SectionBlockProps) {
  if (!isDraggable) {
    return (
      <div className="relative group border border-transparent hover:border-border rounded-lg p-3 transition-all">
        <SectionContent section={section} />
      </div>
    );
  }

  return <DraggableSectionBlock section={section} />;
}
