"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  onDelete: () => void;
  itemName?: string;
  // showConfirmation?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function DeleteButton({
  onDelete,
  itemName = "item",
  // showConfirmation = false,
  disabled = false,
  className = "",
  size = "sm",
}: DeleteButtonProps) {
  const buttonSize = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (disabled) return null;

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
