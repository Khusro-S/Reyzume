"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Editor } from "@tiptap/react";

interface LinkBubbleState {
  isOpen: boolean;
  href: string;
  position: { x: number; y: number };
}
interface EditorContextValue {
  // Currently focused editor (for toolbar commands)
  activeEditor: Editor | null;
  setActiveEditor: (editor: Editor | null) => void;

  // Register/unregister editors (for cleanup)
  registerEditor: (id: string, editor: Editor) => void;
  unregisterEditor: (id: string) => void;

  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  openLinkPopover: () => void;

  linkBubble: LinkBubbleState;
  showLinkBubble: (href: string, position: { x: number; y: number }) => void;
  hideLinkBubble: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [editors] = useState<Map<string, Editor>>(new Map());
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkBubble, setLinkBubble] = useState<LinkBubbleState>({
    isOpen: false,
    href: "",
    position: { x: 0, y: 0 },
  });

  const registerEditor = useCallback(
    (id: string, editor: Editor) => {
      editors.set(id, editor);
    },
    [editors]
  );

  const unregisterEditor = useCallback(
    (id: string) => {
      editors.delete(id);
      // If the unregistered editor was active, clear it
      setActiveEditor((current) => {
        if (current && editors.get(id) === current) {
          return null;
        }
        return current;
      });
    },
    [editors]
  );

  const openLinkPopover = useCallback(() => {
    setLinkPopoverOpen(true);
    // Hide bubble when opening popover
    setLinkBubble((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showLinkBubble = useCallback(
    (href: string, position: { x: number; y: number }) => {
      setLinkBubble({
        isOpen: true,
        href,
        position,
      });
    },
    []
  );

  const hideLinkBubble = useCallback(() => {
    setLinkBubble((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <EditorContext.Provider
      value={{
        activeEditor,
        setActiveEditor,
        registerEditor,
        unregisterEditor,
        linkPopoverOpen,
        setLinkPopoverOpen,
        openLinkPopover,
        linkBubble,
        showLinkBubble,
        hideLinkBubble,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return context;
}

// Hook specifically for the active editor (for toolbar usage)
export function useActiveEditor() {
  const context = useContext(EditorContext);
  return context?.activeEditor ?? null;
}
