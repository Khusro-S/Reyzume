"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useState } from "react";

const FONT_SIZES = [
  { label: "Small", value: "text-sm", size: "10pt" },
  { label: "Normal", value: "text-base", size: "11pt" },
  { label: "Medium", value: "text-lg", size: "12pt" },
  { label: "Large", value: "text-xl", size: "14pt" },
] as const;

export default function FontSize() {
  const [selectedSize, setSelectedSize] = useState<(typeof FONT_SIZES)[number]>(
    FONT_SIZES[1]
  ); // Default to Normal

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 hover:bg-accent"
        >
          <span className="text-sm font-medium">{selectedSize.size}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-34">
        {FONT_SIZES.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => setSelectedSize(size)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">{size.label}</span>
              <span className="text-xs text-muted-foreground">{size.size}</span>
              {selectedSize.value === size.value && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
