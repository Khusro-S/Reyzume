"use client";

import { Button } from "@/components/ui/button";
import { useActiveEditor } from "@/components/providers/EditorContext";
import { List, ListOrdered } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

export default function BulletPoint() {
  const editor = useActiveEditor();

  const toggleBulletList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
    }
  };

  const toggleOrderedList = () => {
    if (editor) {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  const isBulletActive = editor?.isActive("bulletList") ?? false;
  const isOrderedActive = editor?.isActive("orderedList") ?? false;

  return (
    <ButtonGroup className="h-fit">
      <Button
        variant={isBulletActive ? "default" : "outline"}
        size="icon"
        onClick={toggleBulletList}
        disabled={!editor}
        title="Bullet List"
      >
        <List />
      </Button>
      <Button
        variant={isOrderedActive ? "default" : "outline"}
        size="icon"
        onClick={toggleOrderedList}
        disabled={!editor}
        title="Numbered List"
      >
        <ListOrdered />
      </Button>
    </ButtonGroup>
  );
}
