"use client";

import { Button } from "@/components/ui/button";
import { useActiveEditor } from "@/components/providers/EditorContext";
import { List } from "lucide-react";

export default function BulletPoint() {
  const editor = useActiveEditor();

  const toggleBulletList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
    }
  };

  const isBulletActive = editor?.isActive("bulletList") ?? false;

  return (
    <Button
      variant={isBulletActive ? "default" : "outline"}
      size="icon"
      onClick={toggleBulletList}
      disabled={!editor}
      title="Bullet List"
    >
      <List />
    </Button>
  );
}