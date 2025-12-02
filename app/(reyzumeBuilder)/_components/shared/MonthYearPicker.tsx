"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowPresent?: boolean;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  allowPresent = false,
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [showYearPicker, setShowYearPicker] = React.useState(false);
  const [year, setYear] = React.useState(() => {
    if (value && value !== "Present") {
      const parts = value.split(" ");
      return parseInt(parts[1]) || new Date().getFullYear();
    }
    return new Date().getFullYear();
  });

  const currentYear = new Date().getFullYear();
  const isPresent = value === "Present";

  // Generate year range (50 years back to current year)
  const years = React.useMemo(() => {
    const result = [];
    for (let y = currentYear; y >= currentYear - 50; y--) {
      result.push(y);
    }
    return result;
  }, [currentYear]);

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const monthName = MONTHS[monthIndex];
    onChange(`${monthName} ${year}`);
    setOpen(false);
  };

  const handlePresentToggle = (checked: boolean) => {
    if (checked) {
      onChange("Present");
      setOpen(false);
    } else {
      onChange("");
    }
  };

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => Math.min(y + 1, currentYear));

  // Parse current value to highlight selected month
  const selectedMonth = React.useMemo(() => {
    if (!value || value === "Present") return null;
    const parts = value.split(" ");
    const monthName = parts[0];
    const monthYear = parseInt(parts[1]);
    if (monthYear !== year) return null;
    return MONTHS.indexOf(monthName);
  }, [value, year]);

  // Reset year picker when popover closes
  React.useEffect(() => {
    if (!open) {
      setShowYearPicker(false);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-end gap-1 hover:bg-muted/50 rounded px-1 py-0.5 transition-colors cursor-pointer",
            !value && "text-muted-foreground",
            className
          )}
          style={{ fontSize: "0.9em" }}
        >
          {value || placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        {/* Present checkbox */}
        {allowPresent && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
            <Checkbox
              id="present"
              checked={isPresent}
              onCheckedChange={handlePresentToggle}
            />
            <label htmlFor="present" className="font-medium cursor-pointer">
              Present
            </label>
          </div>
        )}

        {showYearPicker ? (
          // Year picker grid
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className=" font-medium">Select Year</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={() => setShowYearPicker(false)}
              >
                Back
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
              {years.map((y) => (
                <Button
                  key={y}
                  variant={year === y ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => handleYearSelect(y)}
                >
                  {y}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          // Month picker (default view)
          <>
            {/* Year selector */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handlePrevYear}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <button
                className="font-semibold hover:bg-muted px-2 py-1 rounded cursor-pointer transition-colors"
                onClick={() => setShowYearPicker(true)}
              >
                {year}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleNextYear}
                disabled={year >= currentYear}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map((month, index) => {
                const isFuture =
                  year === new Date().getFullYear() &&
                  index > new Date().getMonth();
                return (
                  <Button
                    key={month}
                    variant={selectedMonth === index ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    disabled={isFuture || isPresent}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </>
        )}

        {/* Clear button */}
        {value && !showYearPicker && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-muted-foreground"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
