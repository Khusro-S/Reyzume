"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FONT_SIZES, getFontSizeByValue } from "@/lib/fonts";

type FontSizeType = (typeof FONT_SIZES)[number];

export default function FontSize() {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;

  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateFontSize = useMutation(api.reyzumes.updateFontSize);

  const selectedSize = getFontSizeByValue(reyzume?.fontSize);

  const handleSizeChange = async (size: FontSizeType) => {
    await updateFontSize({
      id: reyzumeId,
      fontSize: size.value,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 hover:bg-accent"
        >
          <span className="text-sm font-medium">{selectedSize.value}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-34">
        {FONT_SIZES.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => handleSizeChange(size)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">{size.label}</span>
              <span className="text-xs text-muted-foreground">
                {size.value}
              </span>
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
