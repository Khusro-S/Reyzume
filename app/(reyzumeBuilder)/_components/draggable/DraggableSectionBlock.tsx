"use client";

import { Section, useReyzumeStore } from "@/hooks/useReyzumeStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { SectionContent } from "./SectionContent";
import { cn } from "@/lib/utils";
import { SectionControls } from "../shared/SectionControls";

interface DraggableSectionBlockProps {
  section: Section;
  isBeingDragged?: boolean;
}

export function DraggableSectionBlock({
  section,
  isBeingDragged = false,
}: DraggableSectionBlockProps) {
  const toggleVisibility = useReyzumeStore(
    (state) => state.toggleSectionVisibility,
  );

  const removeSection = useReyzumeStore((state) => state.removeSection);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    // Disable transition on the dragged item to prevent flicker
    transition: isDragging ? undefined : transition,
    // Hide the original element when it's being dragged (overlay shows instead)
    opacity: isBeingDragged ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      data-section-id={section.id}
      style={style}
      className={cn(
        "relative group transition-all print:break-inside-avoid",
        !section.isVisible && "opacity-50",
      )}
    >
      {/* Drag handle */}
      <button
        className="absolute -left-7 md:-left-6 top-0.5 cursor-grab active:cursor-grabbing opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-none select-none print:hidden"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="md:h-5 md:w-5 h-6 w-6 text-muted-foreground" />
      </button>

      {/* Section controls (visibility toggle, delete) */}
      <SectionControls
        sectionType={section.type}
        isVisible={section.isVisible}
        onToggleVisibility={() => toggleVisibility(section.id)}
        onDelete={() => removeSection(section.id)}
      />
      {/* Render section content based on type */}
      <SectionContent section={section} />
    </div>
  );
}
