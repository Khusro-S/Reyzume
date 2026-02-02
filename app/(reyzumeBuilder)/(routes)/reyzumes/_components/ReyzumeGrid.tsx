import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ReyzumeCard from "../../_components/ReyzumeCard";

interface ReyzumeGridProps {
  reyzumes: Doc<"reyzumes">[];
  onResumeClick: (id: string) => void;
  onRename?: (reyzume: Doc<"reyzumes">, e: React.MouseEvent) => void;
  onDuplicate?: (id: string, e: React.MouseEvent) => void;
  onDownload?: (id: string, e: React.MouseEvent) => void;
  onArchive?: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onRestore: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onDelete: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  isSelectionMode: boolean;
  selectedIds: Set<Id<"reyzumes">>;
  onSelectionChange: (id: Id<"reyzumes">, selected: boolean) => void;
}

export default function ReyzumeGrid({
  reyzumes,
  onResumeClick,
  onRename,
  onDuplicate,
  onDownload,
  onArchive,
  onRestore,
  onDelete,
  isSelectionMode,
  selectedIds,
  onSelectionChange,
}: ReyzumeGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        reyzumes.length > 3 && "max-h-130 overflow-y-auto pr-2",
        "scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
      )}
    >
      {reyzumes.map((reyzume) => (
        <ReyzumeCard
          key={reyzume._id}
          reyzume={reyzume}
          onResumeClick={onResumeClick}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onDownload={onDownload}
          onArchive={onArchive}
          onRestore={onRestore}
          onDelete={onDelete}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(reyzume._id)}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
}
