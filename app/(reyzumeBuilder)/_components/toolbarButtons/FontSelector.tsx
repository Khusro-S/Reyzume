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
import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { RESUME_FONTS, getFontByValue, ResumeFont } from "@/lib/fonts";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FontSelector() {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;

  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateFontFamily = useMutation(api.reyzumes.updateFontFamily);

  const selectedFont = getFontByValue(reyzume?.fontFamily);

  const [isTruncated, setIsTruncated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(true);
    }, 100);
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

  const handleFontChange = async (font: ResumeFont) => {
    await updateFontFamily({
      id: reyzumeId,
      fontFamily: font.value,
    });
  };

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
                <span ref={spanRef} className="text-sm truncate">
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
                onClick={() => handleFontChange(font)}
                className="cursor-pointer"
                style={{ fontFamily: font.value }}
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
