"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Minus, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { MAX_ZOOM, MIN_ZOOM, useZoomStore } from "@/hooks/useZoomStore";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function Zoom() {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;
  const { getZoom, zoomIn, zoomOut, resetZoom } = useZoomStore();
  const zoom = getZoom(reyzumeId);

  const isMinZoom = zoom <= MIN_ZOOM;
  const isMaxZoom = zoom >= MAX_ZOOM;

  // Keyboard shortcuts: Ctrl/Cmd + Plus/Minus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          zoomIn(reyzumeId);
        } else if (e.key === "-") {
          e.preventDefault();
          zoomOut(reyzumeId);
        } else if (e.key === "0") {
          e.preventDefault();
          resetZoom(reyzumeId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom, reyzumeId]);

  return (
    <ButtonGroup className="h-fit hidden md:flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomOut(reyzumeId)}
            disabled={isMinZoom}
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zoom out (⌘-)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="px-2 py-1 min-w-[60px] tabular-nums"
            onClick={() => resetZoom(reyzumeId)}
            aria-label="Reset zoom"
          >
            {zoom}%
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset to 100% (⌘0)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomIn(reyzumeId)}
            disabled={isMaxZoom}
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zoom in (⌘+)</p>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
