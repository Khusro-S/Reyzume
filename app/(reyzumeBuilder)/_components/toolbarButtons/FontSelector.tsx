"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Check, Type } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [isTruncated, setIsTruncated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTooltipOpen(false);
  };

  useEffect(() => {
    const element = spanRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [selectedFont]);

  return (
    <TooltipProvider>
      <Tooltip open={isTruncated && isTooltipOpen}>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild className="h-full">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-24 hover:bg-accent"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Type className="h-4 w-4" />
                <span ref={spanRef} className=" text-sm truncate">
                  {selectedFont.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {isTruncated && (
            <TooltipContent>
              <p className="max-w-[300px] w-full wrap-break-word">
                {selectedFont.name}
              </p>
            </TooltipContent>
          )}
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
      </Tooltip>
    </TooltipProvider>
  );
}
