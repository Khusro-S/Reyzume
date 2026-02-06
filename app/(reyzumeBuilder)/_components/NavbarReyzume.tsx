"use client";

import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Title from "./Title";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
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
import Link from "next/link";

interface NavbarReyzumeProps {
  reyzume: Doc<"reyzumes">;
  getContentRef: () => HTMLDivElement | null;
  isReadOnly?: boolean;
}
export default function NavbarReyzume({
  reyzume,
  getContentRef,
  isReadOnly = false,
}: NavbarReyzumeProps) {
  const router = useRouter();
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: reyzume.title || "Resume",
    onBeforePrint: async () => {
      setIsPrinting(true);
      toast.loading("Preparing PDF...", { id: "print-loading" });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.dismiss("print-loading");
      toast.success("PDF ready! Check your downloads or print dialog.");
    },
    onPrintError: (errorLocation: "onBeforePrint" | "print", error: Error) => {
      setIsPrinting(false);
      toast.dismiss("print-loading");
      toast.error("Failed to generate PDF. Please try again.");
      console.error("Print error at", errorLocation, ":", error);
    },
  });
  // const handleBack = () => {
  //   router.push("/reyzumes");
  // };

  const handleDownload = () => {
    // Update the ref right before printing to ensure we have the latest element
    printRef.current = getContentRef();

    if (!printRef.current) {
      toast.error("Resume content not found. Please try again.");
      return;
    }

    handlePrint();
  };
  return (
    <header className="w-full print:hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        {/* <nav className="z-50 bg-background border-b border-border"> */}
        <div className="flex items-center justify-between gap-5 px-3 py-2 max-w-screen-2xl mx-auto">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Button
              asChild
              variant="ghost"
              size="sm"
              // onClick={handleBack}
              //   className="flex items-center gap-2 hover:bg-accent"
              className="hover:bg-accent p-0"
            >
              <Link href="/reyzumes" prefetch>
                <ArrowLeft className="h-4 w-4" />
              </Link>
              {/* <span className="hidden sm:inline">Back</span> */}
            </Button>

            <div className="min-w-0 max-w-md md:max-w-lg w-full">
              <Title
                initialData={reyzume}
                variant="navbar"
                isReadOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Right: Download button */}
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
                          Options: Check <strong>Headers and footers</strong>
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
