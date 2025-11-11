"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Type } from "lucide-react";
import { useState } from "react";

const RESUME_FONTS = [
  { name: "Inter", value: "font-sans", class: "font-sans" },
  { name: "Roboto", value: "font-roboto", class: "font-roboto" },
  { name: "Georgia", value: "font-serif", class: "font-serif" },
  { name: "Times New Roman", value: "font-times", class: "font-times" },
  { name: "Courier", value: "font-mono", class: "font-mono" },
  { name: "Arial", value: "font-arial", class: "font-arial" },
] as const;

export default function FontSelector() {
  const [selectedFont, setSelectedFont] = useState<
    (typeof RESUME_FONTS)[number]
  >(RESUME_FONTS[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-full">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-24 hover:bg-accent"
        >
          <Type className="h-4 w-4" />
          <span className=" text-sm truncate">{selectedFont.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {RESUME_FONTS.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => setSelectedFont(font)}
            className={`cursor-pointer ${font.class}`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{font.name}</span>
              {selectedFont.value === font.value && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
