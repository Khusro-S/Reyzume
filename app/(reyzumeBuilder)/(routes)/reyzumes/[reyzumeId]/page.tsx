"use client";

import NavbarReyzume from "@/app/(reyzumeBuilder)/_components/NavbarReyzume";
import ReyzumeBuilder, {
  ReyzumeBuilderHandle,
} from "@/app/(reyzumeBuilder)/_components/ReyzumeBuilder";
import Toolbar from "@/app/(reyzumeBuilder)/_components/Toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ReyzumeBuilderPageSkeleton from "../../_components/ReyzumeBuilderPageSkeleton";
import ReyzumeNotFound from "../_components/ReyzumeNotFound";

import { Button } from "@/components/ui/button";
import { ArchiveRestore, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function ReyzumeIdPage() {
  const { isLoading: isAuthLoading } = useConvexAuth();
  const params = useParams();
  const router = useRouter();

  const reyzumeId = params.reyzumeId as string;

  const isObviouslyInvalid = !reyzumeId || reyzumeId.length < 10;

  const reyzume = useQuery(
    api.reyzumes.getReyzumeById,
    isObviouslyInvalid ? "skip" : { id: reyzumeId },
  );
  const restoreReyzume = useMutation(api.reyzumes.restoreReyzume);
  const deleteReyzume = useMutation(api.reyzumes.deleteReyzume);

  const builderRef = useRef<ReyzumeBuilderHandle>(null);

  const getContentRef = () => builderRef.current?.getContainerRef() ?? null;

  // Dynamic document title
  useEffect(() => {
    if (reyzume?.title) {
      document.title = `${reyzume.title} | Reyzume`;
    }
    return () => {
      document.title = "Reyzume | Build ATS-Friendly Resumes Effortlessly";
    };
  }, [reyzume?.title]);

  if (reyzume === undefined || isAuthLoading) {
    return <ReyzumeBuilderPageSkeleton />;
  }

  // Valid ID but resume not found or no access
  if (!reyzume) {
    return <ReyzumeNotFound />;
  }

  const handleRestore = async () => {
    try {
      await restoreReyzume({ id: reyzumeId as Id<"reyzumes"> }); // Fixed: cast properly
      toast.success("Resume restored successfully");
    } catch (error) {
      toast.error("Failed to restore resume");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReyzume({ id: reyzumeId as Id<"reyzumes"> }); // Fixed: cast properly
      toast.success("Resume deleted permanently");
      router.push("/reyzumes");
    } catch (error) {
      toast.error("Failed to delete resume");
      console.error(error);
    }
  };

  // Archived resume - show read-only view
  if (reyzume.isArchived) {
    return (
      <div className="flex flex-col justify-center items-center">
        <NavbarReyzume
          reyzume={reyzume}
          getContentRef={getContentRef}
          isReadOnly
        />

        {/* Archived Banner */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-red-100 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Archive className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  This resume is archived
                </p>
                <p className="text-xs text-red-600">
                  Restore it to make changes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleRestore}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-primary text-primary bg-white hover:bg-primary hover:text-white"
              >
                <ArchiveRestore className="h-4 w-4" />
                Restore
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none border-red-300 bg-white hover:bg-red-600 hover:text-white text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Resume Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      &quot;{reyzume.title}&quot; and remove all of its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Read-only view with pointer-events disabled */}
        <div className="mt-40 md:mt-32 min-h-screen max-w-6xl px-4 pointer-events-none select-none">
          <ReyzumeBuilder ref={builderRef} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <NavbarReyzume reyzume={reyzume} getContentRef={getContentRef} />

      <Toolbar />
      <div className="mt-20 min-h-screen max-w-6xl px-4">
        <ReyzumeBuilder ref={builderRef} />
      </div>
    </div>
  );
}