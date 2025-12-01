"use client";

import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import { useActiveEditor } from "@/components/providers/EditorContext";
import { ButtonGroup } from "@/components/ui/button-group";

export default function TextFormatting() {
  const editor = useActiveEditor();

  const toggleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const toggleItalic = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  const toggleUnderline = () => {
    if (editor) {
      editor.chain().focus().toggleUnderline().run();
    }
  };

  const isBold = editor?.isActive("bold") ?? false;
  const isItalic = editor?.isActive("italic") ?? false;
  const isStrike = editor?.isActive("underline") ?? false;

  return (
    <ButtonGroup className="h-fit">
      <Button
        variant={isBold ? "default" : "outline"}
        size="icon"
        onClick={toggleBold}
        disabled={!editor}
        title="Bold (Ctrl/Cmd+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant={isItalic ? "default" : "outline"}
        size="icon"
        onClick={toggleItalic}
        disabled={!editor}
        title="Italic (Ctrl/Cmd+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant={isStrike ? "default" : "outline"}
        size="icon"
        onClick={toggleUnderline}
        disabled={!editor}
        title="Underline (Ctrl/Cmd+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}
