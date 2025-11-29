"use client";

import { CalendarPlus, X } from "lucide-react";
import { MonthYearPicker } from "./MonthYearPicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onDelete: () => void;
  allowPresent?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDelete,
  allowPresent = true,
  startPlaceholder = "Start",
  endPlaceholder = "End",
  className,
}: DateRangePickerProps) {
  // Check if dates exist (undefined means deleted, empty string means editable but empty)
  const hasDates = startDate !== undefined || endDate !== undefined;

  if (!hasDates) {
    // No dates - show add button on hover
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 px-2 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-foreground print:hidden",
          className
        )}
        onClick={() => {
          onStartDateChange("");
          onEndDateChange("");
        }}
      >
        <CalendarPlus className="h-4 w-4 mr-1" />
        <span className="text-xs">Add dates</span>
      </Button>
    );
  }

  // Has dates - show pickers with delete button on hover
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
      <div className="flex gap-1 text-sm text-muted-foreground whitespace-nowrap items-center">
        <MonthYearPicker
          value={startDate || ""}
          onChange={onStartDateChange}
          placeholder={startPlaceholder}
          className="text-sm"
        />
        <span>-</span>
        <MonthYearPicker
          value={endDate || ""}
          onChange={onEndDateChange}
          placeholder={endPlaceholder}
          className="text-sm"
          allowPresent={allowPresent}
        />
      </div>
    </div>
  );
}
