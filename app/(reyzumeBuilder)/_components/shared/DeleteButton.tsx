"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  onDelete: () => void;
  itemName?: string;
  showConfirmation?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function DeleteButton({
  onDelete,
  itemName = "item",
  showConfirmation = false,
  disabled = false,
  className = "",
  size = "sm",
}: DeleteButtonProps) {
  const buttonSize = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (disabled) return null;

  // Simple delete without confirmation
  if (!showConfirmation) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-0 hover:bg-destructive/10 print:hidden",
          buttonSize,
          className
        )}
        onClick={onDelete}
        title={`Delete ${itemName}`}
      >
        <Trash2 className={`${iconSize} text-destructive`} />
      </Button>
    );
  }

  // Delete with confirmation dialog
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-0 hover:bg-destructive/10 print:hidden",
            buttonSize,
            className
          )}
          title={`Delete ${itemName}`}
        >
          <Trash2 className={`${iconSize} text-destructive`} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this {itemName.toLowerCase()} and all
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
  );
}
