// app/(reyzumeBuilder)/_components/ReyzumeBuilder.tsx
"use client";

import { useReyzumeSections } from "@/hooks/useReyzumeSections";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { useZoomStore } from "@/hooks/useZoomStore";
import {
  DEFAULT_MARGIN_HORIZONTAL,
  DEFAULT_MARGIN_VERTICAL,
  getFontByValue,
  getFontSizeByValue,
  getLineHeightByValue,
  getMarginValue,
} from "@/lib/fonts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MM_TO_PX = 3.7795275591;

export interface ReyzumeBuilderHandle {
  getContainerRef: () => HTMLDivElement | null;
  getMargins: () => { vertical: number; horizontal: number };
}

const ReyzumeBuilder = forwardRef<ReyzumeBuilderHandle>((_, ref) => {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;

  const { isLoading } = useReyzumeSync(reyzumeId);
  const { getZoom } = useZoomStore();
  const { reorderSections, visibleSections } = useReyzumeSections();

  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [pageCount, setPageCount] = useState(1);
  const [showOverflowWarning, setShowOverflowWarning] = useState(false);

  const zoom = getZoom(reyzumeId);
  const scale = zoom / 100;

  const fontFamily = getFontByValue(reyzume?.fontFamily).value;
  const fontSize = getFontSizeByValue(reyzume?.fontSize).value;
  const lineHeight = getLineHeightByValue(reyzume?.lineHeight).value;

  const marginVertical = getMarginValue(
    reyzume?.marginVertical,
    DEFAULT_MARGIN_VERTICAL
  );
  const marginHorizontal = getMarginValue(
    reyzume?.marginHorizontal,
    DEFAULT_MARGIN_HORIZONTAL
  );

  useImperativeHandle(ref, () => ({
    getContainerRef: () => containerRef.current,
    getMargins: () => ({
      vertical: marginVertical,
      horizontal: marginHorizontal,
    }),
  }));

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      const heightPx = node.scrollHeight;
      const pageHeightPx = (A4_HEIGHT_MM - marginVertical * 2) * MM_TO_PX;

      const pages = Math.max(1, Math.ceil(heightPx / pageHeightPx));
      setPageCount(pages);
      setShowOverflowWarning(pages > 2); // arbitrary limit for UX
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [marginVertical]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  if (isLoading || !reyzume) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 pb-20 print:gap-0 print:pb-0">
      {showOverflowWarning && (
        <div className="flex items-center gap-2 rounded-md border border-yellow-400 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 print:hidden">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Content runs past two pages. Consider trimming sections before
            exporting.
          </span>
        </div>
      )}

      <div
        className="transition-all duration-200"
        style={{ height: `calc(${pageCount * A4_HEIGHT_MM}mm * ${scale})` }}
      >
        <div
          ref={containerRef}
          data-pdf-container
          className="relative origin-top rounded-xl bg-white shadow-lg print:shadow-none"
          style={{
            width: `${A4_WIDTH_MM}mm`,
            minHeight: `${pageCount * A4_HEIGHT_MM}mm`, // Add minimum height
            maxWidth: "92vw",
            transform: `scale(${scale})`,
            fontFamily,
            fontSize,
            lineHeight,
            padding: `${marginVertical}mm ${marginHorizontal}mm`,
          }}
        >
          {/* Visual page guides */}
          {Array.from({ length: pageCount - 1 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute inset-x-0 h-px bg-gray-300 print:hidden pointer-events-none z-10"
              style={{ top: `${(idx + 1) * A4_HEIGHT_MM}mm` }}
            />
          ))}

          <div ref={contentRef} className="space-y-2">
            {fixedSections.map((section) => (
              <SectionBlock
                key={section.id}
                section={section}
                isDraggable={false}
              />
            ))}

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
});

ReyzumeBuilder.displayName = "ReyzumeBuilder";
export default ReyzumeBuilder;
