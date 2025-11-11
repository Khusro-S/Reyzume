"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Minus, Plus } from "lucide-react";

export default function Zoom() {
  return (
    <ButtonGroup className="h-fit">
      <Button variant="outline" size="icon">
        <Plus />
      </Button>
      <Button variant="outline" className="px-2 py-1">
        100%
      </Button>
      <Button variant="outline" size="icon">
        <Minus />
      </Button>
    </ButtonGroup>
  );
}
