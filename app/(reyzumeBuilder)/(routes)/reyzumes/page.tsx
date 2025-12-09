"use client";
import { Footer } from "@/app/(landingPage)/_components/Footer";
import { Navbar } from "@/app/(landingPage)/_components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Archive, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import ReyzumeCard from "../_components/ReyzumeCard";
import ReyzumesPageSkeleton from "../_components/ReyzumesPageSkeleton";
import { useUser } from "@clerk/nextjs";
import { getDefaultSections } from "@/hooks/reyzumeStore";

export default function ReyzumesPage() {
  const { user } = useUser();
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

        const defaultSections = getDefaultSections({
          fullName: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          phone: user?.primaryPhoneNumber?.phoneNumber,
        });

        const promise = createReyzume({
          title: "Untitled",
          content: JSON.stringify(defaultSections),
        })
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
      error: () => {
        // const errorMessage = err instanceof Error ? err.message : String(err);
        // console.log("Error creating Reyzume: ", errorMessage);
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

  // Loading state with skeleton
  if (reyzumes === undefined) {
    return <ReyzumesPageSkeleton />;
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

          {/* Empty State */}
          {activeReyzumes.length === 0 && archivedReyzumes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first resume to get started building your
                professional profile.
              </p>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create New Resume"}
              </Button>
            </div>
          )}
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