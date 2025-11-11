"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Redo, Undo } from "lucide-react";

export default function UndoRedo() {
  return (
    <ButtonGroup className="h-fit">
      <Button variant="outline" size="icon">
        <Undo />
      </Button>

      <Button variant="outline" size="icon">
        <Redo />
      </Button>
    </ButtonGroup>
  );
}
