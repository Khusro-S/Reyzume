"use client";

import { Section, useReyzumeStore } from "@/hooks/useReyzumeStore";
import { DraggableSectionBlock } from "./draggable/DraggableSectionBlock";
import { SectionContent } from "./draggable/SectionContent";
import { SectionControls } from "./shared/SectionControls";

interface SectionBlockProps {
  section: Section;
  isDraggable?: boolean;
}

export function SectionBlock({
  section,
  isDraggable = true,
}: SectionBlockProps) {
  const toggleVisibility = useReyzumeStore(
    (state) => state.toggleSectionVisibility
  );
  const removeSection = useReyzumeStore((state) => state.removeSection);

  if (!isDraggable) {
    return (
      <div className="relative group border border-transparent hover:border-border rounded-lg p-3 transition-all">
        {/* Section controls for non-draggable sections (header can't be deleted, summary can) */}
        <SectionControls
          sectionType={section.type}
          isVisible={section.isVisible}
          onToggleVisibility={() => toggleVisibility(section.id)}
          onDelete={() => removeSection(section.id)}
        />
        <SectionContent section={section} />
      </div>
    );
  }

  return <DraggableSectionBlock section={section} />;
}