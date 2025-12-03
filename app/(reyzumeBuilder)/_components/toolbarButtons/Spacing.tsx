"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MoveVertical,
  MoveHorizontal,
  Settings2,
  AlignVerticalSpaceAround,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DEFAULT_MARGIN_VERTICAL,
  DEFAULT_MARGIN_HORIZONTAL,
  MIN_MARGIN,
  MAX_MARGIN,
  MARGIN_PRESETS,
  getMarginValue,
  LINE_HEIGHTS,
  getLineHeightByValue,
} from "@/lib/fonts";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function Spacing() {
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;

  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });
  const updateMargins = useMutation(api.reyzumes.updateMargins);
  const updateLineHeight = useMutation(api.reyzumes.updateLineHeight);

  // Local state for immediate UI feedback
  const [localVertical, setLocalVertical] = useState<number | null>(null);
  const [localHorizontal, setLocalHorizontal] = useState<number | null>(null);

  // Get values from DB or local state
  const dbVertical = getMarginValue(
    reyzume?.marginVertical,
    DEFAULT_MARGIN_VERTICAL
  );
  const dbHorizontal = getMarginValue(
    reyzume?.marginHorizontal,
    DEFAULT_MARGIN_HORIZONTAL
  );

  const marginVertical = localVertical ?? dbVertical;
  const marginHorizontal = localHorizontal ?? dbHorizontal;

  // Line height
  const selectedLineHeight = getLineHeightByValue(reyzume?.lineHeight);

  // Check which preset is active (if any)
  const getActivePreset = (): keyof typeof MARGIN_PRESETS | null => {
    for (const [key, preset] of Object.entries(MARGIN_PRESETS)) {
      if (
        parseInt(preset.vertical) === marginVertical &&
        parseInt(preset.horizontal) === marginHorizontal
      ) {
        return key as keyof typeof MARGIN_PRESETS;
      }
    }
    return null;
  };

  const activePreset = getActivePreset();

  // Debounce local values
  const debouncedVertical = useDebounce(localVertical, 300);
  const debouncedHorizontal = useDebounce(localHorizontal, 300);

  // Sync to database when debounced values change
  useEffect(() => {
    if (debouncedVertical !== null && debouncedVertical !== dbVertical) {
      updateMargins({
        id: reyzumeId,
        marginVertical: debouncedVertical.toString(),
        marginHorizontal: marginHorizontal.toString(),
      }).then(() => setLocalVertical(null));
    }
  }, [
    debouncedVertical,
    dbVertical,
    reyzumeId,
    marginHorizontal,
    updateMargins,
  ]);

  useEffect(() => {
    if (debouncedHorizontal !== null && debouncedHorizontal !== dbHorizontal) {
      updateMargins({
        id: reyzumeId,
        marginVertical: marginVertical.toString(),
        marginHorizontal: debouncedHorizontal.toString(),
      }).then(() => setLocalHorizontal(null));
    }
  }, [
    debouncedHorizontal,
    dbHorizontal,
    reyzumeId,
    marginVertical,
    updateMargins,
  ]);

  const handleVerticalChange = (value: number[]) => {
    setLocalVertical(value[0]);
  };

  const handleHorizontalChange = (value: number[]) => {
    setLocalHorizontal(value[0]);
  };

  const handlePreset = async (preset: keyof typeof MARGIN_PRESETS) => {
    const { vertical, horizontal } = MARGIN_PRESETS[preset];
    setLocalVertical(parseInt(vertical));
    setLocalHorizontal(parseInt(horizontal));
    await updateMargins({
      id: reyzumeId,
      marginVertical: vertical,
      marginHorizontal: horizontal,
    });
    setLocalVertical(null);
    setLocalHorizontal(null);
  };

  const handleLineHeightChange = async (value: string) => {
    await updateLineHeight({
      id: reyzumeId,
      lineHeight: value,
    });
  };

  return (
    <TooltipProvider delayDuration={500}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Spacing</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adjust margins & line height</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-72" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Spacing</h4>

            <Separator />

            {/* Margin Presets */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Margins</Label>
              <div className="flex gap-2">
                <Button
                  variant={activePreset === "narrow" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handlePreset("narrow")}
                >
                  Narrow
                </Button>
                <Button
                  variant={activePreset === "normal" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handlePreset("normal")}
                >
                  Normal
                </Button>
                <Button
                  variant={activePreset === "wide" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handlePreset("wide")}
                >
                  Wide
                </Button>
              </div>
            </div>

            {/* Vertical Margin (Top & Bottom) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MoveVertical className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm">Top & Bottom</Label>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {marginVertical}mm
                </span>
              </div>
              <Slider
                value={[marginVertical]}
                onValueChange={handleVerticalChange}
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                className="w-full"
              />
            </div>

            {/* Horizontal Margin (Left & Right) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm">Left & Right</Label>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {marginHorizontal}mm
                </span>
              </div>
              <Slider
                value={[marginHorizontal]}
                onValueChange={handleHorizontalChange}
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlignVerticalSpaceAround className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm">Line Height</Label>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {LINE_HEIGHTS.map((lh) => (
                  <Button
                    key={lh.value}
                    variant={
                      selectedLineHeight.value === lh.value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs h-8 relative"
                    onClick={() => handleLineHeightChange(lh.value)}
                  >
                    {lh.label}
                    {/* {selectedLineHeight.value === lh.value && (
                      <Check className="h-3 w-3 absolute top-1 right-1" />
                    )} */}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
