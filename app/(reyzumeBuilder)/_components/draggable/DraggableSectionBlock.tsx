"use client";

import { Section } from "@/hooks/useReyzumeStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { SectionContent } from "./SectionContent";

interface DraggableSectionBlockProps {
  section: Section;
}

export function DraggableSectionBlock({ section }: DraggableSectionBlockProps) {
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border border-transparent hover:border-border rounded-lg p-3 transition-all print:break-inside-avoid"
    >
      {/* Drag handle */}
      <button
        className="absolute -left-4 md:-left-5 top-3 cursor-grab active:cursor-grabbing opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-none select-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="md:h-5 md:w-5 h-6 w-6 text-muted-foreground" />
      </button>

      {/* Render section content based on type */}
      <SectionContent section={section} />
    </div>
  );
}
