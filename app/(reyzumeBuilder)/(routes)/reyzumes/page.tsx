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
import { Archive, CheckSquare, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTitle } from "@/hooks/use-editable-title";
import { Doc, Id } from "@/convex/_generated/dataModel";

import ReyzumesPageSkeleton from "../_components/ReyzumesPageSkeleton";
import { useUser } from "@clerk/nextjs";
import { getDefaultSections } from "@/hooks/reyzumeStore";
import SelectionActionBar from "./_components/SelectionActionBar";
import EmptyState from "./_components/EmptyState";
import ReyzumeGrid from "./_components/ReyzumeGrid";
import {
  BulkArchiveDialog,
  BulkDeleteDialog,
  BulkRestoreDialog,
  DeleteDialog,
} from "./_components/ReyzumeDialogs";

export default function ReyzumesPage() {
  const { user } = useUser();
  const router = useRouter();
  const { setEditing } = useTitle();

  const createReyzume = useMutation(api.reyzumes.createReyzume);
  const archiveReyzume = useMutation(api.reyzumes.archiveReyzume);
  const restoreReyzume = useMutation(api.reyzumes.restoreReyzume);
  const deleteReyzume = useMutation(api.reyzumes.deleteReyzume);
  const deleteMultipleReyzumes = useMutation(
    api.reyzumes.deleteMultipleReyzumes,
  );
  const archiveMultipleReyzumes = useMutation(
    api.reyzumes.archiveMultipleReyzumes,
  );
  const restoreMultipleReyzumes = useMutation(
    api.reyzumes.restoreMultipleReyzumes,
  );

  const [isCreating, setIsCreating] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reyzumeToDelete, setReyzumeToDelete] = useState<Id<"reyzumes"> | null>(
    null,
  );

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<Id<"reyzumes">>>(
    new Set(),
  );

  const [isArchivedSelectionMode, setIsArchivedSelectionMode] = useState(false);
  const [selectedArchivedIds, setSelectedArchivedIds] = useState<
    Set<Id<"reyzumes">>
  >(new Set());

  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkArchiveDialogOpen, setBulkArchiveDialogOpen] = useState(false);
  const [bulkDeleteTarget, setBulkDeleteTarget] = useState<
    "active" | "archived"
  >("active");
  const [bulkRestoreDialogOpen, setBulkRestoreDialogOpen] = useState(false);

  const reyzumes = useQuery(api.reyzumes.getReyzumes);

  // Selection handlers for active resumes
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set()); // Clear selection when toggling
  };

  const handleSelectionChange = (id: Id<"reyzumes">, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };
  // Selection handlers for archived resumes
  const toggleArchivedSelectionMode = () => {
    setIsArchivedSelectionMode(!isArchivedSelectionMode);
    setSelectedArchivedIds(new Set());
  };

  const handleArchivedSelectionChange = (
    id: Id<"reyzumes">,
    selected: boolean,
  ) => {
    setSelectedArchivedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };
  // Bulk delete handlers
  const handleBulkDeleteClick = (target: "active" | "archived") => {
    const ids = target === "active" ? selectedIds : selectedArchivedIds;
    if (ids.size === 0) return;
    setBulkDeleteTarget(target);
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    const ids =
      bulkDeleteTarget === "active" ? selectedIds : selectedArchivedIds;
    if (ids.size === 0) return;

    const idsArray = Array.from(ids);
    const promise = deleteMultipleReyzumes({ ids: idsArray });

    toast.promise(promise, {
      loading: `Deleting ${idsArray.length} resume${idsArray.length > 1 ? "s" : ""}...`,
      success: `${idsArray.length} resume${idsArray.length > 1 ? "s" : ""} deleted!`,
      error: "Failed to delete some resumes.",
    });

    setBulkDeleteDialogOpen(false);

    if (bulkDeleteTarget === "active") {
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedArchivedIds(new Set());
      setIsArchivedSelectionMode(false);
    }
  };

  // Bulk archive handlers (for active resumes only)

  const handleBulkArchiveConfirm = async () => {
    if (selectedIds.size === 0) return;

    const idsArray = Array.from(selectedIds);
    const promise = archiveMultipleReyzumes({ ids: idsArray });

    toast.promise(promise, {
      loading: `Archiving ${idsArray.length} resume${idsArray.length > 1 ? "s" : ""}...`,
      success: `${idsArray.length} resume${idsArray.length > 1 ? "s" : ""} archived!`,
      error: "Failed to archive some resumes.",
    });

    setBulkArchiveDialogOpen(false);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  // Bulk restore handlers (for archived resumes only)
  const handleBulkRestoreConfirm = async () => {
    if (selectedArchivedIds.size === 0) return;

    const idsArray = Array.from(selectedArchivedIds);
    const promise = restoreMultipleReyzumes({ ids: idsArray });

    toast.promise(promise, {
      loading: `Restoring ${idsArray.length} resume${idsArray.length > 1 ? "s" : ""}...`,
      success: `${idsArray.length} resume${idsArray.length > 1 ? "s" : ""} restored!`,
      error: "Failed to restore some resumes.",
    });

    setBulkRestoreDialogOpen(false);
    setSelectedArchivedIds(new Set());
    setIsArchivedSelectionMode(false);
  };

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

  // const handleResumeClick = (reyzumeId: string) => {
  //   router.push(`/reyzumes/${reyzumeId}`);
  // };

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
    e: React.MouseEvent,
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
    e: React.MouseEvent,
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
    e: React.MouseEvent,
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
          {/* Header */}
          <div className="w-full flex justify-between">
            <h1 className="text-2xl ">Reyzumes</h1>
            <div className="flex items-center gap-2">
              {/* Selection Mode Toggle - for active resumes */}
              {activeReyzumes.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSelectionMode ? "default" : "outline"}
                      size="sm"
                      onClick={toggleSelectionMode}
                      className="h-8 gap-1"
                    >
                      {isSelectionMode ? (
                        <>
                          <X className="h-4 w-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Select</span>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSelectionMode
                      ? "Exit selection mode"
                      : "Select multiple"}
                  </TooltipContent>
                </Tooltip>
              )}
              {/* Create Button */}
              {!isSelectionMode && (
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
                          isCreating && "opacity-50 cursor-not-allowed",
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
              )}
            </div>
          </div>
          {/* Selection Action Bar for active resumes */}
          {isSelectionMode && (
            <SelectionActionBar
              selectedCount={selectedIds.size}
              onSelectAll={() =>
                setSelectedIds(new Set(activeReyzumes.map((r) => r._id)))
              }
              onClear={() => setSelectedIds(new Set())}
              onDelete={() => handleBulkDeleteClick("active")}
              onArchive={() => setBulkArchiveDialogOpen(true)}
              className="-mt-4"
            />
          )}

          {/* Empty State */}
          {activeReyzumes.length === 0 && (
            <EmptyState onCreate={handleCreate} isCreating={isCreating} />
          )}
          {/* <> */}
          {/* Active Reyzumes */}
          {activeReyzumes.length > 0 && (
            <ReyzumeGrid
              reyzumes={activeReyzumes}
              // onResumeClick={handleResumeClick}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
              onDownload={handleDownload}
              onArchive={handleArchive}
              onRestore={handleRestore}
              onDelete={handleDeleteClick}
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          )}
          {/* Archived Reyzumes */}
          {archivedReyzumes.length > 0 && (
            <>
              <div className="w-full h-px bg-foreground/20" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Archived ({archivedReyzumes.length})
                  </h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          isArchivedSelectionMode ? "default" : "outline"
                        }
                        size="sm"
                        onClick={toggleArchivedSelectionMode}
                        className="h-8 gap-1"
                      >
                        {isArchivedSelectionMode ? (
                          <>
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline">Cancel</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Select</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isArchivedSelectionMode
                        ? "Exit selection mode"
                        : "Select multiple"}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Selection Action Bar for Archived */}
                {isArchivedSelectionMode && (
                  <SelectionActionBar
                    selectedCount={selectedArchivedIds.size}
                    onSelectAll={() =>
                      setSelectedArchivedIds(
                        new Set(archivedReyzumes.map((r) => r._id)),
                      )
                    }
                    onClear={() => setSelectedArchivedIds(new Set())}
                    onDelete={() => handleBulkDeleteClick("archived")}
                    onRestore={() => setBulkRestoreDialogOpen(true)}
                    className="mb-4"
                  />
                )}

                <ReyzumeGrid
                  reyzumes={archivedReyzumes}
                  // onResumeClick={handleResumeClick}
                  onRestore={handleRestore}
                  onDelete={handleDeleteClick}
                  isSelectionMode={isArchivedSelectionMode}
                  selectedIds={selectedArchivedIds}
                  onSelectionChange={handleArchivedSelectionChange}
                />
              </div>
            </>
          )}
          {/* </> */}
        </div>
      </div>
      <Footer />

      {/* Dialogs */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setReyzumeToDelete(null)}
      />

      <BulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDeleteConfirm}
        count={
          bulkDeleteTarget === "active"
            ? selectedIds.size
            : selectedArchivedIds.size
        }
      />

      <BulkArchiveDialog
        open={bulkArchiveDialogOpen}
        onOpenChange={setBulkArchiveDialogOpen}
        onConfirm={handleBulkArchiveConfirm}
        count={selectedIds.size}
      />

      <BulkRestoreDialog
        open={bulkRestoreDialogOpen}
        onOpenChange={setBulkRestoreDialogOpen}
        onConfirm={handleBulkRestoreConfirm}
        count={selectedArchivedIds.size}
      />
    </div>
  );
}