"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SectionHeaderProps {
  title?: string;
  onAdd?: () => void;
  children?: React.ReactNode;
}

export function SectionHeader({ title, onAdd, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 border-b-[1.5px] border-black/30">
      {children || <h2 className="text-lg font-semibold">{title}</h2>}
      {onAdd && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
