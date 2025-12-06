"use client";

import NavbarReyzume from "@/app/(reyzumeBuilder)/_components/NavbarReyzume";
import ReyzumeBuilder, {
  ReyzumeBuilderHandle,
} from "@/app/(reyzumeBuilder)/_components/ReyzumeBuilder";
import Toolbar from "@/app/(reyzumeBuilder)/_components/Toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import ReyzumeBuilderPageSkeleton from "../../_components/ReyzumeBuilderPageSkeleton";

export default function ReyzumeIdPage() {
  const { isLoading: isAuthLoading } = useConvexAuth();
  const params = useParams();
  const reyzumeId = params.reyzumeId as Id<"reyzumes">;
  const reyzume = useQuery(api.reyzumes.getReyzumeById, { id: reyzumeId });

  const builderRef = useRef<ReyzumeBuilderHandle>(null);

  const getContentRef = () => builderRef.current?.getContainerRef() ?? null;

  if (reyzume === undefined || isAuthLoading) {
    return <ReyzumeBuilderPageSkeleton />;
  }

  if (!reyzume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Resume not found</h2>
          <p className="text-muted-foreground">
            This resume may have been deleted or you don&apos;t have access to
            it.
          </p>
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