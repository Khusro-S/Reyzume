import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ReyzumeCard from "../../_components/ReyzumeCard";

interface ReyzumeGridProps {
  reyzumes: Doc<"reyzumes">[];
  // onResumeClick: (id: string) => void;
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
  // onResumeClick,
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
        "flex flex-wrap gap-6 overflow-x-visible",
        reyzumes.length > 3 && "max-h-130 overflow-y-auto pr-2",
        "scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
      )}
      // style={{ willChange: "contents" }}
    >
      {reyzumes.map((reyzume) => (
        <div
          key={reyzume._id}
          className={cn(
            // Base: full width (1 col)
            "w-full",
            // sm: 2 columns → (100% - gap) / 2
            "sm:w-[calc(50%-0.75rem)]",
            // lg: 3 columns → (100% - 2*gap) / 3
            "lg:w-[calc(33.333%-1rem)]",
            // xl: 4 columns → (100% - 3*gap) / 4
            "xl:w-[calc(25%-1.125rem)]",
          )}
        >
          <ReyzumeCard
            key={reyzume._id}
            reyzume={reyzume}
            // onResumeClick={onResumeClick}
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
        </div>
      ))}
    </div>
  );
}
