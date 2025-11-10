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
import { Doc } from "@/convex/_generated/dataModel";

export default function ReyzumesPage() {
  const createReyzume = useMutation(api.reyzumes.createReyzume);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

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

  const handleDelete = (reyzumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Delete feature coming soon!");
  };
  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <Navbar />
      <div className="min-h-screen max-w-6xl px-4 w-full">
        <div className="flex flex-1 flex-col gap-10 bg-background rounded-3xl shadow-lg px-6 py-10 sm:px-8 lg:px-16">
          <div className="w-full flex justify-between">
            <h1 className="text-2xl ">Reyzumes</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreate}
                  className="h-8 w-8 hover:cursor-pointer active:scale-90 transition-transform ease-linear rounded-full"
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
                    className="group relative bg-white border border-gray-200 rounded-lg px-4 py-5 hover:shadow-lg hover:border-primary/50 transition-all ease-initial duration-200 cursor-pointer flex flex-col justify-center items-center gap-5 w-full"
                  >
                    {/* Resume Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    {/* Resume Title */}
                    {/* <div className="w-full font-medium text-foreground truncate"> */}
                    {/* {reyzume.title} */}
                    <Title initialData={reyzume} />
                    {/* </div> */}

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

                    {/* More Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => handleRename(reyzume, e)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDuplicate(reyzume._id, e)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDownload(reyzume._id, e)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => handleDelete(reyzume._id, e)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
