"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DraggableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DraggableItem({ id, children, className }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group/item",
        isDragging && "opacity-50 z-50",
        className
      )}
    >
      {/* Drag handle */}
      <button
        className="absolute -left-5 top-1 cursor-grab active:cursor-grabbing md:opacity-0 md:group-hover/item:opacity-100 transition-opacity touch-none select-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="md:h-4 md:w-4 h-5 w-5 text-muted-foreground" />
      </button>
      {children}
    </div>
  );
}
