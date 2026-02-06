"use client";

import { ReactNode, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import { ItemOverlay } from "./Overlays";
import { useOverlayStyle } from "@/components/providers/OverlayStyleContext";

interface SortableItemListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: ReactNode;
  className?: string;
}

export function SortableItemList<T extends { id: string }>({
  items,
  onReorder,
  children,
  className,
}: SortableItemListProps<T>) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const overlayStyle = useOverlayStyle();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      onReorder(reorderedItems);
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const activeItem = activeDragId
    ? items.find((item) => item.id === activeDragId)
    : null;

  const overlay = (
    <DragOverlay
      adjustScale={false}
      dropAnimation={null}
      zIndex={100}
      style={{ pointerEvents: "none" }}
    >
      {activeItem ? (
        <div
          style={
            overlayStyle
              ? {
                  transform: `scale(${overlayStyle.scale})`,
                  transformOrigin: "top left",
                  fontFamily: overlayStyle.fontFamily,
                  fontSize: overlayStyle.fontSize,
                  maxWidth: 500,
                }
              : undefined
          }
        >
          <ItemOverlay item={activeItem as Record<string, unknown>} />
        </div>
      ) : null}
    </DragOverlay>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>{children}</div>
      </SortableContext>

      {/* Portal to document.body to avoid transform: scale() issues */}
      {activeItem &&
      typeof window !== "undefined" &&
      typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : overlay}
    </DndContext>
  );
}
