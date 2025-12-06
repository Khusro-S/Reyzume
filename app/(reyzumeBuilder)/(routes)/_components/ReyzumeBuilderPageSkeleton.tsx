import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for the resume builder page
export default function ReyzumeBuilderPageSkeleton() {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Navbar skeleton */}
      <header className="w-full">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between gap-5 px-3 py-2 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </nav>
      </header>

      {/* Toolbar skeleton */}
      <div className="fixed px-7 right-0 top-13 flex gap-3 w-full py-1 z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20" />
        ))}
      </div>

      {/* A4 Page skeleton */}
      <div className="mt-20 min-h-screen max-w-6xl px-4">
        <div className="flex flex-col items-center gap-3 pb-20">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[210mm] h-[297mm]">
            {/* Header section skeleton */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
            </div>

            {/* Summary skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Experience skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-28 mb-3" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Education skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-36" />
            </div>

            {/* Skills skeleton */}
            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
