"use client";

import { useReyzumeSections } from "@/hooks/useReyzumeSections";
import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SectionBlock } from "./SectionBlock";

export default function ReyzumeBuilder() {
  const { visibleSections, reorderSections } = useReyzumeSections();
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("297mm");

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const contentHeight = element.getBoundingClientRect().height;
      // A4 height in pixels (96 DPI) - approx 1122.5px
      // 30mm padding in pixels - approx 113.4px
      const A4_HEIGHT_PX = 1122.5;
      const PADDING_PX = 113.4;

      const totalHeight = contentHeight + PADDING_PX;
      const pages = Math.ceil(totalHeight / A4_HEIGHT_PX);
      const heightMm = Math.max(pages, 1) * 297;

      setContainerHeight(`${heightMm}mm`);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fixedSections = visibleSections.filter(
    (s) => s.type === "header" || s.type === "summary"
  );
  const draggableSections = visibleSections.filter(
    (s) => s.type !== "header" && s.type !== "summary"
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = draggableSections.findIndex((s) => s.id === active.id);
      const newIndex = draggableSections.findIndex((s) => s.id === over.id);
      const reorderedDraggable = arrayMove(
        draggableSections,
        oldIndex,
        newIndex
      );

      // Combine fixed and reordered draggable sections to update all orders
      const newSections = [...fixedSections, ...reorderedDraggable].map(
        (section, index) => ({
          ...section,
          order: index,
        })
      );
      reorderSections(newSections);
    }
  };

  return (
    <div className="flex justify-center pb-20">
      <div
        className="w-[210mm] max-w-[92vw] bg-white rounded-xl shadow-lg print:shadow-none print:max-w-none origin-top transition-transform duration-200 p-[5mm]"
        style={{
          height: containerHeight,
          // Visual page break marker every 297mm (A4 height)
          backgroundImage:
            "linear-gradient(to bottom, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)",
          backgroundSize: "100% 297mm",
        }}
      >
        <div className="space-y-2" ref={contentRef}>
          {/* Fixed Sections (Header, Summary) */}
          {fixedSections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              isDraggable={false}
            />
          ))}

          {/* Draggable Sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[
              restrictToVerticalAxis,
              restrictToParentElement,
              restrictToWindowEdges,
            ]}
          >
            <SortableContext
              items={draggableSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {draggableSections.map((section) => (
                  <SectionBlock key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

// export default function ReyzumeBuilder() {
//   return (
//     <div className="aspect-[1/1.414] w-[95vw] max-w-4xl bg-white shadow-lg print:shadow-none print:max-w-none origin-top rounded-xl">
//       ReyzumeBuilder
//     </div>
//   );
// }
