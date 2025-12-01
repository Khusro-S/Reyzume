"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Pencil, Unlink } from "lucide-react";
import { toast } from "sonner";
import { useEditorContext } from "@/components/providers/EditorContext";

export function LinkBubble() {
  const {
    activeEditor: editor,
    linkBubble,
    hideLinkBubble,
    openLinkPopover,
  } = useEditorContext();
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Close bubble when clicking outside
  useEffect(() => {
    if (!linkBubble.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Don't close if clicking inside the bubble
      if (bubbleRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on a link in the editor (will reposition instead)
      if (target.closest("a") && target.closest(".ProseMirror")) {
        return;
      }

      hideLinkBubble();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideLinkBubble();
      }
    };

    const handleScroll = () => {
      hideLinkBubble();
    };

    // Small delay to avoid closing on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll, true);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [linkBubble.isOpen, hideLinkBubble]);

  // Close bubble when editor loses focus
  useEffect(() => {
    if (!editor || !linkBubble.isOpen) return;

    const handleBlur = () => {
      // Small delay to allow clicking bubble buttons
      setTimeout(() => {
        if (!bubbleRef.current?.contains(document.activeElement)) {
          hideLinkBubble();
        }
      }, 100);
    };

    editor.on("blur", handleBlur);
    return () => {
      editor.off("blur", handleBlur);
    };
  }, [editor, linkBubble.isOpen, hideLinkBubble]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(linkBubble.href);
    toast.success("Link copied!");
  };

  const handleOpenLink = () => {
    window.open(linkBubble.href, "_blank", "noopener,noreferrer");
  };

  const handleEdit = () => {
    hideLinkBubble();
    openLinkPopover();
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    hideLinkBubble();
  };

  if (!linkBubble.isOpen || !linkBubble.href) {
    return null;
  }

  // Truncate URL for display
  const displayUrl =
    linkBubble.href.length > 30
      ? linkBubble.href.substring(0, 30) + "..."
      : linkBubble.href;

  return (
    <div
      ref={bubbleRef}
      className="fixed flex items-center gap-1 p-1.5 bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
      style={{
        // Use CSS clamp to keep bubble within viewport
        left: `clamp(8px, ${linkBubble.position.x}px, calc(100vw - 320px))`,
        top: `clamp(8px, ${linkBubble.position.y}px, calc(100vh - 50px))`,
        zIndex: 9999,
        maxWidth: "calc(100vw - 16px)",
      }}
    >
      <span
        className="text-sm text-muted-foreground px-2 max-w-[180px] truncate"
        title={linkBubble.href}
      >
        {displayUrl}
      </span>

      <div className="flex items-center gap-0.5 border-l pl-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
          title="Copy link"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleOpenLink}
          title="Open link"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleEdit}
          title="Edit link"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={handleRemoveLink}
          title="Remove link"
        >
          <Unlink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
