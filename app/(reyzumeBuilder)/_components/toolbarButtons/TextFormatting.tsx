"use client";

import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";

export default function TextFormatting() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  return (
    // <div className="flex items-center gap-1">
    <ButtonGroup className="h-fit">
      <Button
        variant="outline"
        size="sm"
        className={cn("h-9 w-9 p-0 hover:bg-accent", isBold && "bg-accent")}
        onClick={() => setIsBold(!isBold)}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={cn("h-9 w-9 p-0 hover:bg-accent", isItalic && "bg-accent")}
        onClick={() => setIsItalic(!isItalic)}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-9 w-9 p-0 hover:bg-accent",
          isUnderline && "bg-accent"
        )}
        onClick={() => setIsUnderline(!isUnderline)}
      >
        <Underline className="h-4 w-4" />
      </Button>
    </ButtonGroup>
    // {/* </div> */}
  );
}
