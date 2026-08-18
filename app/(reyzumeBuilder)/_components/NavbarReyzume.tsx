"use client";

import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Title from "./Title";
import { useEffect, useRef, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSafari } from "@/lib/browserDetect";
import { printReyzumeViaIframe } from "@/lib/printReyzume";
import { retryReyzumeSave } from "@/lib/reyzumeSaveNow";
import { useReyzumeStore } from "@/hooks/useReyzumeStore";

interface NavbarReyzumeProps {
  reyzume: Doc<"reyzumes">;
  isReadOnly?: boolean;
}

export default function NavbarReyzume({
  reyzume,
  isReadOnly = false,
}: NavbarReyzumeProps) {
  const router = useRouter();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [pendingBack, setPendingBack] = useState(false);
  const printCleanupRef = useRef<(() => void) | null>(null);
  const isSaving = useReyzumeStore((state) => state.isSaving);
  const isDirty = useReyzumeStore((state) => state.isDirty);
  const lastSaveStatus = useReyzumeStore((state) => state.lastSaveStatus);

  useEffect(() => {
    setIsSafariBrowser(isSafari());
  }, []);

  useEffect(() => {
    return () => {
      printCleanupRef.current?.();
      printCleanupRef.current = null;
    };
  }, []);

  // Leave once save finishes and the draft is clean. Keep pendingBack while dirty
  // so we flush instead of aborting before isSaving flips true.
  useEffect(() => {
    if (!pendingBack || isSaving) return;

    const stillDirty = useReyzumeStore.getState().isDirty;
    if (lastSaveStatus === "error") {
      setPendingBack(false);
      toast.error("Couldn't save. Stay on this page to keep your edits.");
      return;
    }

    if (stillDirty) {
      void retryReyzumeSave().catch(() => {
        setPendingBack(false);
      });
      return;
    }

    router.push("/reyzumes");
  }, [pendingBack, isSaving, isDirty, lastSaveStatus, router]);

  const handleBackWhileBusy = () => {
    if (pendingBack) return;
    setPendingBack(true);
  };

  const handleDownload = () => {
    if (isPrinting) return;

    const toastId = "print-loading";
    setIsPrinting(true);
    toast.loading("Preparing PDF...", { id: toastId });

    // Same path as /reyzumes list download — full print-mode page in a hidden iframe.
    printCleanupRef.current = printReyzumeViaIframe({
      reyzumeId: reyzume._id,
      onReady: () => {
        setIsPrinting(false);
        toast.dismiss(toastId);
        toast.success("PDF ready! Check your print dialog.");
      },
      onError: (message) => {
        setIsPrinting(false);
        toast.dismiss(toastId);
        toast.error(message);
      },
      onCancel: () => {
        setIsPrinting(false);
        toast.dismiss(toastId);
      },
    });
  };

  // Clean draft (or read-only) → normal Link. Dirty/saving → intercept with save-then-push.
  const usePlainLink =
    isReadOnly || (!isDirty && !isSaving && !pendingBack);

  return (
    <header className="w-full print:hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between gap-5 px-3 py-2 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {usePlainLink ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-accent p-0"
              >
                <Link href="/reyzumes" prefetch aria-label="Back to resumes">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Tooltip open={pendingBack ? true : undefined}>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`hover:bg-accent p-0${pendingBack || isSaving ? " opacity-50" : ""}`}
                      aria-label={
                        pendingBack
                          ? "Saving, going back when done"
                          : isSaving
                            ? "Saving in progress, click to go back when done"
                            : "Unsaved changes, click to save and go back"
                      }
                      onClick={handleBackWhileBusy}
                      disabled={pendingBack}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {pendingBack
                    ? "Saving, going back when done"
                    : isSaving
                      ? "Saving in progress, click to go back when done"
                      : "Unsaved changes, click to save and go back"}
                </TooltipContent>
              </Tooltip>
            )}

            <div className="min-w-0 max-w-md md:max-w-lg w-full">
              <Title
                initialData={reyzume}
                variant="navbar"
                isReadOnly={isReadOnly}
              />
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPrinting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>PDF Export Settings</AlertDialogTitle>
                <AlertDialogDescription
                  asChild
                  className="space-y-3 pt-2 text-left"
                >
                  <div>
                    <p className="mb-2">
                      For the best results, we recommend using a{" "}
                      <strong>desktop browser</strong> or{" "}
                      <strong>Chrome on mobile</strong>.
                    </p>
                    <p>Please adjust your print settings:</p>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <span className="font-semibold mb-1">Chrome / Edge:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>
                          Destination: <strong>Save as PDF</strong>
                        </li>
                        <li>
                          Margins: <strong>Minimum</strong>
                        </li>
                        <li>
                          Options: Uncheck <strong>Headers and footers</strong>
                        </li>
                        <li>
                          Options: Uncheck <strong>Background graphics</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <span className="font-semibold mb-1">Safari:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>
                          Uncheck <strong>Print Backgrounds</strong>
                        </li>
                        <li>
                          Uncheck <strong>Print Headers and Footers</strong>
                        </li>
                      </ul>
                    </div>

                    {isSafariBrowser && (
                      <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                          <div>
                            <p className="font-semibold mb-1">
                              Safari User Notice
                            </p>
                            <p>
                              Safari&apos;s native print engine automatically
                              adds extra white space around documents that cannot
                              be removed. Your downloaded PDF may have slightly
                              wider margins than what you see in the editor.
                            </p>
                            <p className="mt-1.5 font-medium">
                              Tip:{" "}
                              <span className="font-normal">
                                You can either reduce the spacing settings in the
                                editor to compensate, or use{" "}
                                <strong>Chrome / Edge</strong> for a
                                pixel-perfect, 1:1 export.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDownload}>
                  Proceed to Print
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>
    </header>
  );
}
