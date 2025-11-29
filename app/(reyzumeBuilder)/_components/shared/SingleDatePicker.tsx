"use client";

import { CalendarPlus, X } from "lucide-react";
import { MonthYearPicker } from "./MonthYearPicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SingleDatePickerProps {
  date?: string;
  onChange: (val: string) => void;
  onDelete: () => void;
  allowPresent?: boolean;
  placeholder?: string;
  className?: string;
}

export function SingleDatePicker({
  date,
  onChange,
  onDelete,
  allowPresent = false,
  placeholder = "Date",
  className,
}: SingleDatePickerProps) {
  // Check if date exists (undefined means deleted, empty string means editable but empty)
  const hasDate = date !== undefined;

  if (!hasDate) {
    // No date - show add button on hover
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 px-2 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-foreground print:hidden",
          className
        )}
        onClick={() => onChange("")}
      >
        <CalendarPlus className="h-4 w-4 mr-1" />
        <span className="text-xs">Add date</span>
      </Button>
    );
  }

  // Has date - show picker with delete button on hover
  return (
    <div
      className={cn("flex items-center gap-1 shrink-0 print:hidden", className)}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
      <MonthYearPicker
        value={date || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="text-sm text-muted-foreground"
        allowPresent={allowPresent}
      />
    </div>
  );
}
