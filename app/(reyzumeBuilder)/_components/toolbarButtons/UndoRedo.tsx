"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTemporalStore } from "@/hooks/useReyzumeStore";
import { Redo, Undo } from "lucide-react";
import { useEffect } from "react";

export default function UndoRedo() {
  // Use separate selectors to avoid infinite loop from object creation
  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  // const canUndo = useTemporalStore((state) => state.pastStates.length > 0);
  // const canRedo = useTemporalStore((state) => state.futureStates.length > 0);
  const pastStatesLength = useTemporalStore((state) => state.pastStates.length);
  const futureStatesLength = useTemporalStore(
    (state) => state.futureStates.length
  );
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea (let browser handle it)
      const target = e.target as HTMLElement;
      const isEditing =
        target.closest(".ProseMirror") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA";

      // Ctrl+Z or Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        if (!isEditing && pastStatesLength > 0) {
          e.preventDefault();
          undo();
        }
      }

      // Ctrl+Y or Cmd+Shift+Z for Redo
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        if (!isEditing && futureStatesLength > 0) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, pastStatesLength, futureStatesLength]);

  const handleUndo = () => {
    if (pastStatesLength > 0) {
      undo();
    }
  };

  const handleRedo = () => {
    if (futureStatesLength > 0) {
      redo();
    }
  };
  return (
    <TooltipProvider delayDuration={700}>
      <ButtonGroup className="h-fit">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={pastStatesLength === 0}
            >
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo section/item changes</p>
            <p className="text-xs text-muted/70">Ctrl/CMD+Z</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={futureStatesLength === 0}
            >
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo section/item changes</p>
            <p className="text-xs text-muted/70">Ctrl/CMD+Shift+Z</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </TooltipProvider>
  );
}
