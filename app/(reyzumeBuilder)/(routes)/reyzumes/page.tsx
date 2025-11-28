"use client";
import { Footer } from "@/app/(landingPage)/_components/Footer";
import { Navbar } from "@/app/(landingPage)/_components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Download,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Title from "../../_components/Title";
import { useTitle } from "@/hooks/use-editable-title";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReyzumesPage() {
  const createReyzume = useMutation(api.reyzumes.createReyzume);
  const archiveReyzume = useMutation(api.reyzumes.archiveReyzume);
  const restoreReyzume = useMutation(api.reyzumes.restoreReyzume);
  const deleteReyzume = useMutation(api.reyzumes.deleteReyzume);

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reyzumeToDelete, setReyzumeToDelete] = useState<Id<"reyzumes"> | null>(
    null
  );

  const { setEditing } = useTitle();

  const reyzumes = useQuery(api.reyzumes.getReyzumes);

  const handleCreate = async () => {
    if (isCreating) return;

    setIsCreating(true);
    const promise = createReyzume({ title: "Untitled" })
      .then((reyzumeId) => {
        if (reyzumeId) {
          router.push(`/reyzumes/${reyzumeId}`);
        }
      })
      .finally(() => {
        setIsCreating(false);
      });

    toast.promise(promise, {
      loading: "Creating new Reyzume...",
      success: "Reyzume created!",
      error: (err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log("Error creating Reyzume: ", errorMessage);
        return "Failed to create your new note.";
      },
    });
  };

  const handleResumeClick = (reyzumeId: string) => {
    router.push(`/reyzumes/${reyzumeId}`);
  };

  const handleRename = (reyzume: Doc<"reyzumes">, e: React.MouseEvent) => {
    e.stopPropagation();

    // Delay setEditing until dropdown is fully closed
    setTimeout(() => {
      setEditing(reyzume._id, reyzume.title || "Untitled");
    }, 100);
  };

  const handleDuplicate = (reyzumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Duplicate feature coming soon!");
  };

  const handleDownload = (reyzumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Download feature coming soon!");
  };

  const handleArchive = async (
    reyzumeId: Id<"reyzumes">,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const promise = archiveReyzume({ id: reyzumeId });

    toast.promise(promise, {
      loading: "Archiving...",
      success: "Reyzume archived!",
      error: "Failed to archive reyzume.",
    });
  };

  const handleRestore = async (
    reyzumeId: Id<"reyzumes">,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const promise = restoreReyzume({ id: reyzumeId });

    toast.promise(promise, {
      loading: "Restoring...",
      success: "Reyzume restored!",
      error: "Failed to restore reyzume.",
    });
  };

  const handleDeleteClick = (
    reyzumeId: Id<"reyzumes">,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setReyzumeToDelete(reyzumeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reyzumeToDelete) return;

    const promise = deleteReyzume({ id: reyzumeToDelete });

    toast.promise(promise, {
      loading: "Deleting...",
      success: "Reyzume deleted permanently!",
      error: "Failed to delete reyzume.",
    });

    setDeleteDialogOpen(false);
    setReyzumeToDelete(null);
  };

  // Add loading state
  if (reyzumes === undefined) {
    return <div>Loading...</div>;
  }

  // reyzumes will be [] if not authenticated, show auth prompt
  if (reyzumes === null) {
    return <div>Please sign in to view your resumes</div>;
  }

  const activeReyzumes = reyzumes.filter((r) => !r.isArchived);
  const archivedReyzumes = reyzumes.filter((r) => r.isArchived);
  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <Navbar />
      <div className="min-h-screen max-w-6xl px-2 md:px-4 w-full">
        <div className="flex flex-1 flex-col gap-10 bg-background rounded-3xl shadow-lg px-6 py-10 sm:px-8 lg:px-16">
          <div className="w-full flex justify-between">
            <h1 className="text-2xl ">Reyzumes</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreate}
                  className="h-8 w-8 hover:cursor-pointer active:scale-90 transition-transform ease-linear rounded-full"
                  disabled={isCreating}
                >
                  <Plus
                    className={cn(
                      "h-8 w-8 text-background ",
                      isCreating && "opacity-50 cursor-not-allowed"
                    )}
                    // fill="#3b82f6"
                    aria-disabled={isCreating}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="">
                {" "}
                {isCreating ? "Creating..." : "Create new Reyzume"}
              </TooltipContent>
            </Tooltip>
          </div>
          {/* Active Resumes Grid */}
          <>
            {/* Active Reyzumes */}
            {activeReyzumes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeReyzumes.map((reyzume) => (
                  <ReyzumeCard
                    key={reyzume._id}
                    reyzume={reyzume}
                    onResumeClick={handleResumeClick}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDownload={handleDownload}
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
            {/* Archived Reyzumes */}
            {archivedReyzumes.length > 0 && (
              <>
                <div className="w-full h-px bg-foreground/20" />
                <div>
                  <h2 className="text-lg font-medium text-muted-foreground mb-4 flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Archived ({archivedReyzumes.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {archivedReyzumes.map((reyzume) => (
                      <ReyzumeCard
                        key={reyzume._id}
                        reyzume={reyzume}
                        onResumeClick={handleResumeClick}
                        // onRename={handleRename}
                        // onDuplicate={handleDuplicate}
                        // onDownload={handleDownload}
                        // onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </div>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this resume and all its content. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReyzumeToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Extracted ReyzumeCard component for cleaner code
interface ReyzumeCardProps {
  reyzume: Doc<"reyzumes">;
  onResumeClick: (id: string) => void;
  onRename?: (reyzume: Doc<"reyzumes">, e: React.MouseEvent) => void;
  onDuplicate?: (id: string, e: React.MouseEvent) => void;
  onDownload?: (id: string, e: React.MouseEvent) => void;
  onArchive?: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onRestore: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
  onDelete: (id: Id<"reyzumes">, e: React.MouseEvent) => void;
}

function ReyzumeCard({
  reyzume,
  onResumeClick,
  onRename,
  onDuplicate,
  onDownload,
  onArchive,
  onRestore,
  onDelete,
}: ReyzumeCardProps) {
  return (
    <div
      onClick={() => onResumeClick(reyzume._id)}
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg px-4 py-5 hover:shadow-lg hover:border-primary/50 transition-all ease-initial duration-200 cursor-pointer flex flex-col justify-center items-center gap-3",
        reyzume.isArchived && "opacity-60"
      )}
    >
      {/* Resume Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors",
          reyzume.isArchived && "bg-gray-100 group-hover:bg-gray-200"
        )}
      >
        <FileText
          className={cn(
            "h-6 w-6 text-primary",
            reyzume.isArchived && "text-gray-500"
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
        {reyzume.isArchived && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Archived
          </span>
        )}
      </div>

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </div>
  );
}