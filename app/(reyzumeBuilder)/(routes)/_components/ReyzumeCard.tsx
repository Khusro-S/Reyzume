import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Download,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Title from "../../_components/Title";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface ReyzumeCardProps {
  reyzume: Doc<"reyzumes">;
  // onResumeClick: (id: string) => void;
  onRename?: (reyzume: Doc<"reyzumes">, e: React.MouseEvent) => void;
  onDuplicate?: (id: string, e: React.MouseEvent) => void;
  onDownload?: (id: string, e: React.MouseEvent) => void;
  onArchive?: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onRestore: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onDelete: (id: Id<"reyzumes">, e: React.MouseEvent) => void;

  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (id: Id<"reyzumes">, selected: boolean) => void;
}

export default function ReyzumeCard({
  reyzume,
  // onResumeClick,
  onRename,
  onDuplicate,
  onDownload,
  onArchive,
  onRestore,
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onSelectionChange,
}: ReyzumeCardProps) {
  const href = `/reyzumes/${reyzume._id}`;

  const handleCardClick = () => {
    if (isSelectionMode && onSelectionChange) {
      onSelectionChange(reyzume._id, !isSelected);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.(reyzume._id, !isSelected);
  };

  const cardClassName = cn(
    "group relative bg-white border border-gray-200 rounded-lg px-4 py-5 hover:shadow-lg hover:border-primary/50 transition-all ease-initial duration-200 cursor-pointer flex flex-col justify-center items-center gap-3",
    reyzume.isArchived && "opacity-60",
    isSelected && "border-primary bg-primary/5 shadow-md",
  );

  const cardContent = (
    <>
      {/* Selection Checkbox */}
      {isSelectionMode && (
        <div
          className="absolute top-2 left-2 z-10"
          onClick={handleCheckboxClick}
        >
          <Checkbox
            checked={isSelected}
            className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}
      {/* Resume Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors",
          reyzume.isArchived && "bg-gray-100 group-hover:bg-gray-200",
        )}
      >
        <FileText
          className={cn(
            "h-6 w-6 text-primary",
            reyzume.isArchived && "text-gray-500",
          )}
        />
      </div>

      {/* Resume Title */}
      <Title initialData={reyzume} />

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>
          {new Date(reyzume._creationTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {reyzume.isPublished && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Published
          </span>
        )}
      </div>

      {/* More Actions Menu - hide in selection mode */}
      {!isSelectionMode && (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onRename && (
              <DropdownMenuItem onClick={(e) => onRename(reyzume, e)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={(e) => onDuplicate(reyzume._id, e)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}

            {onDownload && (
              <DropdownMenuItem onClick={(e) => onDownload(reyzume._id, e)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            )}
            {!reyzume.isArchived && <DropdownMenuSeparator />}
            {reyzume.isArchived ? (
              <>
                <DropdownMenuItem onClick={(e) => onRestore(reyzume._id, e)}>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => onDelete(reyzume._id, e)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </DropdownMenuItem>
              </>
            ) : (
              onArchive && (
                <DropdownMenuItem
                  onClick={(e) => onArchive(reyzume._id, e)}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
  return isSelectionMode ? (
    <div onClick={handleCardClick} className={cardClassName}>
      {cardContent}
    </div>
  ) : (
    <Link href={href} className={cardClassName}>
      {cardContent}
    </Link>
  );
}
