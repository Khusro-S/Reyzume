import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";

interface SelectionActionBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  onArchive?: () => void; // Only for active resumes
  onRestore?: () => void; // Only for archived resumes
  className?: string;
}

export default function SelectionActionBar({
  selectedCount,
  onSelectAll,
  onClear,
  onDelete,
  onArchive,
  onRestore,
  className,
}: SelectionActionBarProps) {
  return (
    <div
      className={`flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-sm h-7"
          >
            Select All
          </Button>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-xs h-7"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            disabled={selectedCount === 0}
            className="gap-1"
          >
            <Archive className="h-4 w-4" />
            Archive ({selectedCount})
          </Button>
        )}
        {onRestore && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRestore}
            disabled={selectedCount === 0}
            className="gap-1"
          >
            <ArchiveRestore className="h-4 w-4" />
            Restore ({selectedCount})
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={selectedCount === 0}
          className="gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
