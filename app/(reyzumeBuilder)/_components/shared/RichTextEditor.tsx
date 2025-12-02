"use client";

import { useEffect, useId } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextSelection } from "@tiptap/pm/state";
import { useEditorContext } from "@/components/providers/EditorContext";
import { cn } from "@/lib/utils";
// import { LinkBubbleMenu } from "./LinkBubbleMenu";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  singleLine?: boolean;
  maxLength?: number;
  selectAllOnFocus?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  style,
  placeholder,
  singleLine = true,
  maxLength,
  selectAllOnFocus = false,
}: RichTextEditorProps) {
  const id = useId();
  const {
    setActiveEditor,
    registerEditor,
    unregisterEditor,
    showLinkBubble,
    hideLinkBubble,
  } = useEditorContext();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Configure heading levels if needed
        heading: false,
        // Configure other extensions
        bulletList: singleLine
          ? false
          : {
              keepMarks: true,
              keepAttributes: false,
            },
        orderedList: singleLine
          ? false
          : {
              keepMarks: true,
              keepAttributes: false,
            },
        listItem: singleLine ? false : undefined,
        hardBreak: singleLine ? false : undefined,
      }),
      Underline,
      Link.configure({
        openOnClick: false, // Don't open links when clicking in editor
        autolink: true, // Auto-detect URLs while typing
        linkOnPaste: true, // Convert pasted URLs to links
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",

    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[1.5em]",
          // Match existing EditableText styles
          // "text-base",
          className
        ),
      },
      // Prevent Enter key in single-line mode
      handleKeyDown: singleLine
        ? (view, event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              return true;
            }
            // Block typing if at maxLength (allow backspace, delete, arrows, etc.)
            if (
              maxLength &&
              view.state.doc.textContent.length >= maxLength &&
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey
            ) {
              event.preventDefault();
              return true;
            }
            return false;
          }
        : undefined,
      // Handle paste in single-line mode - strip newlines and enforce maxLength
      handlePaste: singleLine
        ? (view, event) => {
            event.preventDefault();
            const text = event.clipboardData?.getData("text/plain") || "";
            // Remove all newlines and extra whitespace
            let cleanText = text.replace(/[\r\n]+/g, " ").trim();

            // Enforce maxLength
            if (maxLength) {
              const currentLength = view.state.doc.textContent.length;
              const selectionLength =
                view.state.selection.to - view.state.selection.from;
              const availableSpace =
                maxLength - currentLength + selectionLength;
              cleanText = cleanText.slice(0, Math.max(0, availableSpace));
            }

            if (cleanText) {
              view.dispatch(
                view.state.tr.insertText(
                  cleanText,
                  view.state.selection.from,
                  view.state.selection.to
                )
              );
            }
            return true;
          }
        : undefined,
      // Handle link clicks - show bubble instead of navigating
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        const linkElement = target.closest("a");

        if (linkElement && linkElement.closest(".ProseMirror")) {
          event.preventDefault();
          event.stopPropagation();

          const href = linkElement.getAttribute("href") || "";
          const rect = linkElement.getBoundingClientRect();

          // Position bubble below the link
          showLinkBubble(href, {
            x: rect.left,
            y: rect.bottom + 8,
          });

          // Select the link text
          const linkPos = view.posAtDOM(linkElement, 0);
          const linkEnd = linkPos + (linkElement.textContent?.length || 0);
          view.dispatch(
            view.state.tr.setSelection(
              TextSelection.create(view.state.doc, linkPos, linkEnd)
            )
          );

          return true;
        }

        // Hide bubble when clicking elsewhere in editor
        hideLinkBubble();
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // Get HTML content
      // const html = editor.getHTML();
      // Convert empty paragraph to empty string
      // const content = html === "<p></p>" ? "" : html;
      // onChange(content);
      onChange(editor.getHTML());
    },
    onFocus: () => {
      setActiveEditor(editor);
      if (editor && selectAllOnFocus) {
        // Defer to next tick so TipTap finishes its focus handling
        setTimeout(() => {
          editor.commands.selectAll();
        }, 0);
      }
    },
  });

  // Register editor on mount
  useEffect(() => {
    if (editor) {
      registerEditor(id, editor);
      return () => {
        unregisterEditor(id);
      };
    }
  }, [editor, id, registerEditor, unregisterEditor]);

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      {/* <LinkBubbleMenu editor={editor} onEdit={() => openLinkPopover?.()} /> */}
      <EditorContent
        editor={editor}
        style={style}
        className={cn(
          "w-full overflow-hidden bg-transparent [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[1.5em]",
          // Placeholder styles
          "[&_.ProseMirror.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_a]:underline [&_a]:text-primary [&_a]:cursor-pointer",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:text-muted-foreground/50",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:pointer-events-none",
          // List styles
          "[&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-1",
          "[&_li]:pl-1",
          // Paragraph spacing
          "[&_p]:my-0",
          className
        )}
      />
    </>
  );
}
