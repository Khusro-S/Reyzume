"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Link, Unlink } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Label } from "@/components/ui/label";
import { useEditorContext } from "@/components/providers/EditorContext";

export default function Hyperlink() {
  const {
    activeEditor: editor,
    linkPopoverOpen,
    setLinkPopoverOpen,
  } = useEditorContext();
  const [url, setUrl] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const initializedRef = useRef(false);

  // Update selection state when editor selection changes
  useEffect(() => {
    if (!editor) {
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setHasSelection(false);
        setIsLinkActive(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const updateSelectionState = () => {
      const { from, to } = editor.state.selection;
      setHasSelection(from !== to);
      setIsLinkActive(editor.isActive("link"));
    };

    // Initial state - defer to avoid cascading render
    if (!initializedRef.current) {
      initializedRef.current = true;
      queueMicrotask(updateSelectionState);
    } else {
      updateSelectionState();
    }

    // Listen to selection and transaction updates
    editor.on("selectionUpdate", updateSelectionState);
    editor.on("transaction", updateSelectionState);

    return () => {
      editor.off("selectionUpdate", updateSelectionState);
      editor.off("transaction", updateSelectionState);
    };
  }, [editor]);

  // Sync with context-controlled popover state
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && editor) {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to, "");
        setSelectedText(text);
        const existingUrl = editor.getAttributes("link").href || "";
        setUrl(existingUrl);
      } else {
        setUrl("");
        setSelectedText("");
      }
      setLinkPopoverOpen(open);
    },
    [editor, setLinkPopoverOpen]
  );

  // Initialize state when opened from bubble menu
  useEffect(() => {
    if (linkPopoverOpen && editor) {
      const timer = setTimeout(() => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to, "");
        setSelectedText(text);
        const existingUrl = editor.getAttributes("link").href || "";
        setUrl(existingUrl);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [linkPopoverOpen, editor]);

  const handleInsertLink = () => {
    if (!editor || !url) return;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();

    setLinkPopoverOpen(false);
    setUrl("");
    setSelectedText("");
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPopoverOpen(false);
    setUrl("");
    setSelectedText("");
  };

  const isDisabled = !editor || (!hasSelection && !isLinkActive);

  return (
    <Popover open={linkPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={isLinkActive ? "default" : "outline"}
          size="icon"
          disabled={isDisabled}
          title={
            !editor
              ? "Click on a text field first"
              : hasSelection || isLinkActive
              ? "Insert/Edit Link"
              : "Select text to add link"
          }
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {isLinkActive ? "Edit Link" : "Insert Link"}
            </h4>
            {selectedText && (
              <p className="text-sm text-muted-foreground">
                Link text: <span className="font-medium">{selectedText}</span>
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-xs">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>
          <div className="flex justify-between">
            {isLinkActive && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveLink}
              >
                <Unlink className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinkPopoverOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleInsertLink} disabled={!url}>
                {isLinkActive ? "Update" : "Insert"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
