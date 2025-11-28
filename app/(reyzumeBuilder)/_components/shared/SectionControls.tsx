"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    <div className="absolute right-0 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-destructive/10"
              title={`Delete ${formattedType}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {formattedType}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the {formattedType} section and all
                its content. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
