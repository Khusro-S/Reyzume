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
import { HiddenSectionsPanel } from "./sections/HiddenSectionsPanel";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useReyzumeSync } from "@/hooks/useReyzumeSync";
import { Loader2 } from "lucide-react";
import { DEFAULT_ZOOM, useZoomStore } from "@/hooks/useZoomStore";
import { getFontByValue, getFontSizeByValue } from "@/lib/fonts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function ReyzumeBuilder() {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;

  const { isLoading } = useReyzumeSync(reyzumeId);
  // const { isLoading } = useReyzumeSync(reyzumeId);
  const { getZoom } = useZoomStore();
  const storedZoom = getZoom(reyzumeId);
  const isMobile = useIsMobile();

  const zoom = isMobile ? DEFAULT_ZOOM : storedZoom;
  const { reorderSections, visibleSections } = useReyzumeSections();

  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const fontFamily = getFontByValue(reyzume?.fontFamily).value;
  const fontSize = getFontSizeByValue(reyzume?.fontSize).value;

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

  // const { visibleSections, reorderSections } = useReyzumeSections();
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
  }, [isLoading]); // Re-run when loading state changes

  const fixedSections = visibleSections.filter(
    (s) => s.type === "header" || s.type === "summary"
  );
  const draggableSections = visibleSections.filter(
    (s) => s.type !== "header" && s.type !== "summary"
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
      const newSections = [...fixedSections, ...reorderedDraggable].map(
        (section, index) => ({
          ...section,
          order: index,
        })
      );
      reorderSections(newSections);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const scale = zoom / 100;
  // Calculate scaled dimensions for the wrapper
  // const scaledWidth = `calc(210mm * ${scale})`;
  const scaledHeight = `calc(${containerHeight} * ${scale})`;
  return (
    <div className="flex pb-20 w-full justify-center items-center">
      <div
        className="transition-all duration-200 ease-out"
        style={{
          // height: `calc(${containerHeight} * ${scale})`,
          // width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <div
          className="w-[210mm] max-w-[92vw] bg-white rounded-xl shadow-lg print:shadow-none print:max-w-none origin-top transition-transform duration-200 p-[5mm]"
          style={{
            height: containerHeight,
            transform: `scale(${scale})`,
            fontFamily: fontFamily,
            fontSize: fontSize,
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
        <HiddenSectionsPanel />
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
