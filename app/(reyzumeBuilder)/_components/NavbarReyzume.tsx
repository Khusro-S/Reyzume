"use client";

import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Title from "./Title";

interface NavbarReyzumeProps {
  reyzume: Doc<"reyzumes">;
}
export default function NavbarReyzume({ reyzume }: NavbarReyzumeProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/reyzumes");
  };

  const handleDownload = () => {
    toast.info("Download feature coming soon!");
  };
  return (
    <header className="w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        {/* <nav className="z-50 bg-background border-b border-border"> */}
        <div className="flex items-center justify-between gap-5 px-3 py-2 max-w-screen-2xl mx-auto">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              //   className="flex items-center gap-2 hover:bg-accent"
              className="hover:bg-accent p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              {/* <span className="hidden sm:inline">Back</span> */}
            </Button>

            <div className="min-w-0 max-w-md md:max-w-lg w-full">
              <Title initialData={reyzume} variant="navbar" />
            </div>
          </div>

          {/* Right: Download button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
