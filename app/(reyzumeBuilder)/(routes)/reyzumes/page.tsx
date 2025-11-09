"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { FileText, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ReyzumesPage() {
  const createReyzume = useMutation(api.reyzumes.createReyzume);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <>
      <div className="mx-auto min-h-screen max-w-6xl px-4">
        <div className="flex flex-1 flex-col gap-10 bg-background rounded-3xl shadow-lg px-6 py-10 sm:px-8 lg:px-16">
          <div className="w-full flex justify-between">
            <h1 className="text-2xl ">Reyzumes</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <PlusCircle
                  role="button"
                  onClick={handleCreate}
                  className={cn(
                    "h-8 w-8 text-background cursor-pointer active:scale-90 transition-transform ease-linear",
                    isCreating && "opacity-50 cursor-not-allowed"
                  )}
                  fill="#3b82f6"
                  aria-disabled={isCreating}
                />
              </TooltipTrigger>
              <TooltipContent className="">
                {" "}
                {isCreating ? "Creating..." : "Create new Reyzume"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Resumes Grid */}
          {reyzumes &&
            (reyzumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  No resumes yet
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Create your first resume to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {reyzumes.map((reyzume) => (
                  <div
                    key={reyzume._id}
                    onClick={() => handleResumeClick(reyzume._id)}
                    className="group relative bg-white border border-gray-200 rounded-lg px-4 py-5 hover:shadow-lg hover:border-primary/50 transition-all ease-initial duration-200 cursor-pointer flex flex-col justify-center items-center gap-5 w-50"
                  >
                    {/* Resume Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    {/* Resume Title */}
                    <h3 className="font-medium text-foreground truncate">
                      {reyzume.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {new Date(reyzume._creationTime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
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

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
