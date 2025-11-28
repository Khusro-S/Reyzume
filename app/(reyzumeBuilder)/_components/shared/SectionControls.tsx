"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

interface SectionControlsProps {
  sectionType: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onDelete: () => void;
  canDelete?: boolean;
}

export function SectionControls({
  sectionType,
  isVisible,
  onToggleVisibility,
  onDelete,
  canDelete = true,
}: SectionControlsProps) {
  // Don't allow deleting header section
  const isDeletable = canDelete && sectionType !== "header";

  // Format section type for display (e.g., "experience" -> "Experience")
  const formattedType =
    sectionType.charAt(0).toUpperCase() + sectionType.slice(1);

  return (
    <div className="absolute right-1 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Toggle visibility */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 hover:bg-muted"
        onClick={onToggleVisibility}
        title={isVisible ? `Hide ${formattedType}` : `Show ${formattedType}`}
      >
        {isVisible ? (
          <Eye className="h-4 w-4 text-muted-foreground" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {/* Delete section */}
      {isDeletable && (
        <DeleteButton
          onDelete={onDelete}
          itemName={`${formattedType} section`}
          showConfirmation={true}
          disabled={!isDeletable}
          size="default"
        />
      )}
    </div>
  );
}
